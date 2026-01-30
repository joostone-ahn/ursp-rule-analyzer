from flask import Flask, render_template, request, jsonify, session
import flask_session
import pandas as pd
import re
import os
import sys
from datetime import datetime

# Add current directory to path if running directly
if __name__ == '__main__' and __package__ is None:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import encoder, decoder, spec, display

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ursp-analyzer-secret-key-2025'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = '/tmp/flask_session'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
flask_session.Session(app)

# Disable caching for development
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/service-worker.js')
def service_worker():
    return app.send_static_file('service-worker.js')

@app.route('/encode', methods=['POST'])
def encode():
    try:
        data = request.json
        
        PTI = data.get('pti', '151')
        PLMN = data.get('plmn', '45006F')
        UPSC = data.get('upsc', '2')
        
        ursp_sum = data.get('ursp_sum', [])
        rsd_sum = data.get('rsd_sum', [])
        rsd_conts = data.get('rsd_conts', [])
        
        df_dl_nas, ef_ursp, dl_nas = encoder.ursp_encoder(ursp_sum, rsd_sum, rsd_conts, PTI, PLMN, UPSC)
        df_payload, ursp_sum_decoded, rsd_sum_decoded, rsd_conts_decoded, PTI_decoded, PLMN_decoded, UPSC_decoded = decoder.ursp_decoder(df_dl_nas)
        
        ursp_info, ursp_conts = display.ursp_to_txt(ursp_sum_decoded, rsd_sum_decoded, rsd_conts_decoded, PTI_decoded, PLMN_decoded, UPSC_decoded)
        pol_cmd_txt = display.payload_to_txt(df_payload)
        
        ef_ursp_formatted = display.hex_format(ef_ursp)
        dl_nas_formatted = display.hex_format(dl_nas)
        
        session['pol_cmd_excel'] = df_payload.to_dict('records')
        
        return jsonify({
            'success': True,
            'ef_ursp': ef_ursp_formatted,
            'dl_nas': dl_nas_formatted,
            'ursp_info': ursp_info,
            'ursp_conts': ursp_conts,
            'pol_cmd_txt': pol_cmd_txt
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/decode', methods=['POST'])
def decode():
    try:
        data = request.json
        log_paste = data.get('log_text', '')
        
        hex_values = re.findall(r'\b[0-9A-Fa-f]{2}\b', log_paste)
        hex_int = [int(x, 16) for x in hex_values]
        hex_str = [f'{x:02X}' for x in hex_int]
        
        result = {}
        
        # DL NAS Transport
        if '68' in hex_str:
            start = hex_str.index('68')
            payload_type = hex_str[start+1]
            
            if payload_type == '05':
                df_dl_nas = pd.DataFrame({'hex': hex_str[start:]})
                df_payload, ursp_sum, rsd_sum, rsd_conts, PTI, PLMN, UPSC = decoder.ursp_decoder(df_dl_nas)
                
                session['pol_cmd_excel'] = df_payload.to_dict('records')
                
                df_dl_nas_enc, ef_ursp, dl_nas = encoder.ursp_encoder(ursp_sum, rsd_sum, rsd_conts, PTI, PLMN, UPSC)
                
                ursp_info, ursp_conts = display.ursp_to_txt(ursp_sum, rsd_sum, rsd_conts, PTI, PLMN, UPSC)
                pol_cmd_txt = display.payload_to_txt(df_payload)
                
                ef_ursp_formatted = display.hex_format(ef_ursp)
                dl_nas_formatted = display.hex_format(dl_nas)
                
                result = {
                    'success': True,
                    'message_type': 'DL NAS Transport',
                    'ef_ursp': ef_ursp_formatted,
                    'dl_nas': dl_nas_formatted,
                    'ursp_info': ursp_info,
                    'ursp_conts': ursp_conts,
                    'pol_cmd_txt': pol_cmd_txt
                }
            else:
                result = {
                    'success': False,
                    'error': '[DL NAS Transport] No UE policy container'
                }
        
        # UL NAS Transport
        elif '67' in hex_str:
            start = hex_str.index('67')
            payload_type = hex_str[start+1]
            
            if payload_type == '05':
                type_int = int(hex_str[start+5], 16) & 0x0F
                if type_int in spec.pol_msg_types:
                    pol_msg_type = spec.pol_msg_types[type_int]
                    result = {
                        'success': True,
                        'message_type': 'UL NAS Transport',
                        'info': f'UE policy container type: {pol_msg_type}',
                        'is_reject': 'REJECT' in pol_msg_type
                    }
            else:
                result = {
                    'success': False,
                    'error': '[UL NAS Transport] No UE policy container'
                }
        
        # Registration request
        elif '41' in hex_str:
            if '85' in hex_str:
                payload = hex_str[hex_str.index('85'):]
                usi_rst = decoder.usi_decoder(payload)
                result = {
                    'success': True,
                    'message_type': 'Registration request',
                    'usi_result': usi_rst
                }
            else:
                result = {
                    'success': False,
                    'error': '[Registration request] No UE policy container'
                }
        
        else:
            result = {
                'success': False,
                'error': 'No UE policy container in these hex values'
            }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/save_excel', methods=['POST'])
def save_excel():
    try:
        pol_cmd_data = session.get('pol_cmd_excel')
        if not pol_cmd_data:
            return jsonify({'success': False, 'error': 'No data to save'}), 400
        
        df_payload = pd.DataFrame(pol_cmd_data)
        
        current_datetime = datetime.now()
        timestamp = current_datetime.strftime("%Y%m%d_%H%M%S")
        output_file = f'MANAGE_UE_POLICY_COMMAND_{timestamp}.xlsx'
        
        os.makedirs('xlsx', exist_ok=True)
        output_path = os.path.join('xlsx', output_file)
        df_payload.to_excel(output_path, index=False)
        
        return jsonify({
            'success': True,
            'filename': output_file,
            'path': os.path.abspath(output_path)
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=False)