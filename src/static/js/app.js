console.log('app.js loaded successfully');

// Global variables to track URSP structure (similar to PyQt implementation)
let urspSum = [];
let rsdSum = [];
let rsdConts = [];

// Initialize with default values (like PyQt)
function initializeDefaultURSP() {
    // Create default URSP rule (ursp_num = 0)
    urspSum = [{
        ursp_num: 'URSP_0',
        ursp_pv: '1',
        td_type: 'Match-all',
        td_val: '-',
        rsd_cnt: 1
    }];
    
    // Create default RSD (rsd_num = 0)
    rsdSum = [[{
        rsd_num: 'RSD_0_0',
        rsd_pv: '1',
        rsd_conts_cnt: 1
    }]];
    
    // Create default RSD Contents (rsd_conts_num = 0)
    rsdConts = [[[{
        rsd_conts_num: 'RSD_0_0_0',
        rsd_conts_type: 'SSC mode',
        rsd_conts_val: ''
    }]]];
    
    console.log('Default URSP structure initialized:', { urspSum, rsdSum, rsdConts });
}

// Create URSP card HTML
function createURSPCard(urspIndex) {
    const ursp = urspSum[urspIndex];
    let cardHTML = `
        <div class="ursp-card" data-ursp-index="${urspIndex}">
            <div class="ursp-card-header">URSP Rule ${urspIndex}</div>
            <div class="ursp-fields">
                <div class="field-group">
                    <label>Precedence Value</label>
                    <input type="text" value="${ursp.ursp_pv}" placeholder="Enter value" 
                           onchange="updateURSPValue(${urspIndex}, 'ursp_pv', this.value)">
                </div>
                <div class="field-group">
                    <label>Traffic Descriptor Type</label>
                    <select onchange="updateTDType(${urspIndex}, this.value)">
                        <option value="Match-all" ${ursp.td_type === 'Match-all' ? 'selected' : ''}>Match-all</option>
                        <option value="OS Id + OS App Id" ${ursp.td_type === 'OS Id + OS App Id' ? 'selected' : ''}>OS Id + OS App Id</option>
                        <option value="DNN" ${ursp.td_type === 'DNN' ? 'selected' : ''}>DNN</option>
                        <option value="Connection capabilities" ${ursp.td_type === 'Connection capabilities' ? 'selected' : ''}>Connection capabilities</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Traffic Descriptor Value</label>
                    <input type="text" value="${ursp.td_val}" ${ursp.td_type === 'Match-all' ? 'disabled' : ''} 
                           onchange="updateURSPValue(${urspIndex}, 'td_val', this.value)" class="td-value-input">
                </div>
                <div class="field-group">
                    <label>RSD Count</label>
                    <input type="number" value="${ursp.rsd_cnt}" min="1" max="5" 
                           onchange="updateRSDCount(${urspIndex}, parseInt(this.value))">
                </div>
            </div>
            
            <div class="rsd-container">`;
    
    // Add RSD cards
    for (let rsdIndex = 0; rsdIndex < rsdSum[urspIndex].length; rsdIndex++) {
        cardHTML += createRSDCard(urspIndex, rsdIndex);
    }
    
    cardHTML += `</div></div>`;
    return cardHTML;
}

// Create RSD card HTML
function createRSDCard(urspIndex, rsdIndex) {
    const rsd = rsdSum[urspIndex][rsdIndex];
    let cardHTML = `
        <div class="rsd-card" data-rsd-index="${rsdIndex}">
            <div class="rsd-card-header">RSD ${urspIndex}_${rsdIndex}</div>
            <div class="rsd-fields">
                <div class="field-group">
                    <label>Precedence Value</label>
                    <input type="text" value="${rsd.rsd_pv}" placeholder="Enter value" 
                           onchange="updateRSDValue(${urspIndex}, ${rsdIndex}, 'rsd_pv', this.value)">
                </div>
                <div class="field-group">
                    <label>Contents Count</label>
                    <input type="number" value="${rsd.rsd_conts_cnt}" min="1" max="5" 
                           onchange="updateRSDContentsCount(${urspIndex}, ${rsdIndex}, parseInt(this.value))">
                </div>
            </div>
            
            <div class="rsd-contents-container">`;
    
    // Add RSD Contents cards
    for (let contentsIndex = 0; contentsIndex < rsdConts[urspIndex][rsdIndex].length; contentsIndex++) {
        cardHTML += createRSDContentsCard(urspIndex, rsdIndex, contentsIndex);
    }
    
    cardHTML += `</div></div>`;
    return cardHTML;
}

// Create RSD Contents card HTML
function createRSDContentsCard(urspIndex, rsdIndex, contentsIndex) {
    const contents = rsdConts[urspIndex][rsdIndex][contentsIndex];
    
    // PyQt 구현에 따라 rsd_zero 타입들만 비활성화
    const rsdZeroTypes = [
        "Multi-access preference", 
        "Non-seamless non-3GPP offload indication",
        "5G ProSe layer-3 UE-to-network relay offload indication"
    ];
    
    const isDisabled = rsdZeroTypes.includes(contents.rsd_conts_type);
    
    return `
        <div class="rsd-contents-card" data-contents-index="${contentsIndex}">
            <div class="rsd-contents-header">RSD Contents ${urspIndex}_${rsdIndex}_${contentsIndex}</div>
            <div class="rsd-contents-fields">
                <div class="field-group">
                    <label>Type</label>
                    <select onchange="updateRSDContentsType(${urspIndex}, ${rsdIndex}, ${contentsIndex}, this.value)">
                        <option value="SSC mode" ${contents.rsd_conts_type === 'SSC mode' ? 'selected' : ''}>SSC mode</option>
                        <option value="S-NSSAI" ${contents.rsd_conts_type === 'S-NSSAI' ? 'selected' : ''}>S-NSSAI</option>
                        <option value="DNN" ${contents.rsd_conts_type === 'DNN' ? 'selected' : ''}>DNN</option>
                        <option value="Access type" ${contents.rsd_conts_type === 'Access type' ? 'selected' : ''}>Access type</option>
                        <option value="Multi-access preference" ${contents.rsd_conts_type === 'Multi-access preference' ? 'selected' : ''}>Multi-access preference</option>
                        <option value="Non-seamless non-3GPP offload indication" ${contents.rsd_conts_type === 'Non-seamless non-3GPP offload indication' ? 'selected' : ''}>Non-seamless non-3GPP offload indication</option>
                        <option value="5G ProSe layer-3 UE-to-network relay offload indication" ${contents.rsd_conts_type === '5G ProSe layer-3 UE-to-network relay offload indication' ? 'selected' : ''}>5G ProSe layer-3 UE-to-network relay offload indication</option>
                        <option value="PDU session type" ${contents.rsd_conts_type === 'PDU session type' ? 'selected' : ''}>PDU session type</option>
                        <option value="Preferred access type" ${contents.rsd_conts_type === 'Preferred access type' ? 'selected' : ''}>Preferred access type</option>
                        <option value="PDU session pair ID" ${contents.rsd_conts_type === 'PDU session pair ID' ? 'selected' : ''}>PDU session pair ID</option>
                        <option value="RSN" ${contents.rsd_conts_type === 'RSN' ? 'selected' : ''}>RSN</option>
                    </select>
                </div>
                <div class="field-group">
                    <label>Value</label>
                    <input type="text" value="${contents.rsd_conts_val}" ${isDisabled ? 'disabled' : ''} 
                           placeholder="${isDisabled ? '-' : 'Enter value'}" class="rsd-value-input"
                           onchange="updateRSDContentsValue(${urspIndex}, ${rsdIndex}, ${contentsIndex}, this.value)">
                </div>
            </div>
        </div>
    `;
}

// Update functions
function updateURSPValue(urspIndex, field, value) {
    urspSum[urspIndex][field] = value;
    console.log('Updated URSP:', urspSum[urspIndex]);
}

function updateTDType(urspIndex, value) {
    urspSum[urspIndex].td_type = value;
    if (value === 'Match-all') {
        urspSum[urspIndex].td_val = '-';
    } else if (value === 'OS Id + OS App Id') {
        urspSum[urspIndex].td_val = 'Android/OS_APP_Id';
    } else if (value === 'Connection capabilities') {
        urspSum[urspIndex].td_val = 'IMS, MMS, SUPL, Internet';
    } else {
        urspSum[urspIndex].td_val = '';
    }
    renderURSPCards();
}

function updateRSDValue(urspIndex, rsdIndex, field, value) {
    rsdSum[urspIndex][rsdIndex][field] = value;
    console.log('Updated RSD:', rsdSum[urspIndex][rsdIndex]);
}

function updateRSDContentsValue(urspIndex, rsdIndex, contentsIndex, value) {
    rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = value;
    console.log('Updated RSD Contents:', rsdConts[urspIndex][rsdIndex][contentsIndex]);
}

function updateRSDContentsType(urspIndex, rsdIndex, contentsIndex, value) {
    rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_type = value;
    
    // PyQt 구현에 따라 spec.rsd_zero 타입들만 비활성화
    const rsdZeroTypes = [
        "Multi-access preference", 
        "Non-seamless non-3GPP offload indication",
        "5G ProSe layer-3 UE-to-network relay offload indication"
    ];
    
    if (rsdZeroTypes.includes(value)) {
        rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = '-';
    } else {
        // 나머지 모든 타입(SSC mode 포함)은 사용자가 입력할 수 있음
        rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = '';
        if (value === 'S-NSSAI') {
            rsdConts[urspIndex][rsdIndex][contentsIndex].rsd_conts_val = 'SST 1 + SD 1';
        }
    }
    
    renderURSPCards();
}

function updateRSDCount(urspIndex, newCount) {
    const currentCount = rsdSum[urspIndex].length;
    
    if (newCount > currentCount) {
        // Add new RSD
        for (let i = currentCount; i < newCount; i++) {
            rsdSum[urspIndex].push({
                rsd_num: `RSD_${urspIndex}_${i}`,
                rsd_pv: '',
                rsd_conts_cnt: 1
            });
            
            rsdConts[urspIndex].push([{
                rsd_conts_num: `RSD_${urspIndex}_${i}_0`,
                rsd_conts_type: 'SSC mode',
                rsd_conts_val: ''
            }]);
        }
    } else if (newCount < currentCount) {
        // Remove RSD
        rsdSum[urspIndex].splice(newCount);
        rsdConts[urspIndex].splice(newCount);
    }
    
    urspSum[urspIndex].rsd_cnt = newCount;
    renderURSPCards();
}

function updateRSDContentsCount(urspIndex, rsdIndex, newCount) {
    const currentCount = rsdConts[urspIndex][rsdIndex].length;
    
    if (newCount > currentCount) {
        // Add new RSD Contents
        for (let i = currentCount; i < newCount; i++) {
            rsdConts[urspIndex][rsdIndex].push({
                rsd_conts_num: `RSD_${urspIndex}_${rsdIndex}_${i}`,
                rsd_conts_type: 'SSC mode',
                rsd_conts_val: ''
            });
        }
    } else if (newCount < currentCount) {
        // Remove RSD Contents
        rsdConts[urspIndex][rsdIndex].splice(newCount);
    }
    
    rsdSum[urspIndex][rsdIndex].rsd_conts_cnt = newCount;
    renderURSPCards();
}

// Render all URSP cards
function renderURSPCards() {
    const container = document.getElementById('ursp-container');
    if (!container) {
        console.error('URSP container not found');
        return;
    }
    
    let html = '';
    for (let i = 0; i < urspSum.length; i++) {
        html += createURSPCard(i);
    }
    
    container.innerHTML = html;
    console.log('URSP cards rendered');
}

// Handle URSP count changes
function handleURSPCountChange(newCount) {
    const currentCount = urspSum.length;
    
    if (newCount > currentCount) {
        // Add new URSP rules
        for (let i = currentCount; i < newCount; i++) {
            urspSum.push({
                ursp_num: `URSP_${i}`,
                ursp_pv: '',
                td_type: 'Match-all',
                td_val: '-',
                rsd_cnt: 1
            });
            
            rsdSum.push([{
                rsd_num: `RSD_${i}_0`,
                rsd_pv: '',
                rsd_conts_cnt: 1
            }]);
            
            rsdConts.push([[{
                rsd_conts_num: `RSD_${i}_0_0`,
                rsd_conts_type: 'SSC mode',
                rsd_conts_val: ''
            }]]);
        }
    } else if (newCount < currentCount) {
        // Remove URSP rules
        urspSum.splice(newCount);
        rsdSum.splice(newCount);
        rsdConts.splice(newCount);
    }
    
    renderURSPCards();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready in app.js');
    
    // Initialize default URSP structure
    initializeDefaultURSP();
    
    // Render initial cards
    renderURSPCards();
    
    // Setup URSP count change listener
    const urspCountInput = document.getElementById('ursp-count');
    if (urspCountInput) {
        urspCountInput.addEventListener('change', function() {
            const newCount = parseInt(this.value);
            console.log('URSP count changed to:', newCount);
            handleURSPCountChange(newCount);
        });
        console.log('URSP count listener added');
    } else {
        console.error('ursp-count input not found');
    }
    
    // Setup tab functionality
    setupTabs();
    
    // Setup encode button
    setupEncodeButton();
    
    // Setup decode button
    setupDecodeButton();
    
    // Setup save button
    setupSaveButton();
});

// Tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// Encode button functionality
function setupEncodeButton() {
    const encodeBtn = document.getElementById('encode-btn');
    const encodeStatus = document.getElementById('encode-status');
    
    if (encodeBtn) {
        encodeBtn.addEventListener('click', async function() {
            encodeStatus.textContent = 'Encoding...';
            encodeStatus.className = 'status-message';
            
            try {
                const data = {
                    pti: document.getElementById('pti').value,
                    plmn: document.getElementById('plmn').value,
                    upsc: document.getElementById('upsc').value,
                    ursp_sum: urspSum,
                    rsd_sum: rsdSum,
                    rsd_conts: rsdConts
                };
                
                const response = await fetch('/encode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    encodeStatus.textContent = 'Encoding completed successfully!';
                    encodeStatus.className = 'status-message success';
                    
                    // Display results in Result tab
                    displayResults(result);
                    
                    // Switch to Result tab
                    document.querySelector('[data-tab="result"]').click();
                } else {
                    encodeStatus.textContent = 'Error: ' + result.error;
                    encodeStatus.className = 'status-message error';
                }
            } catch (error) {
                encodeStatus.textContent = 'Network error: ' + error.message;
                encodeStatus.className = 'status-message error';
            }
        });
    }
}

// Decode button functionality
function setupDecodeButton() {
    const decodeBtn = document.getElementById('decode-btn');
    const decodeStatus = document.getElementById('decode-status');
    
    if (decodeBtn) {
        decodeBtn.addEventListener('click', async function() {
            const logText = document.getElementById('log-text').value;
            
            if (!logText.trim()) {
                decodeStatus.textContent = 'Please enter hex log data';
                decodeStatus.className = 'status-message error';
                return;
            }
            
            decodeStatus.textContent = 'Decoding...';
            decodeStatus.className = 'status-message';
            
            try {
                const response = await fetch('/decode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ log_text: logText })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    decodeStatus.textContent = 'Decoding completed successfully!';
                    decodeStatus.className = 'status-message success';
                    
                    if (result.message_type === 'DL NAS Transport') {
                        // Display results in Result tab
                        displayResults(result);
                        
                        // Switch to Result tab
                        document.querySelector('[data-tab="result"]').click();
                    } else {
                        // Display info message
                        document.getElementById('result-text').value = result.info || result.usi_result || 'Decoding completed';
                        document.querySelector('[data-tab="result"]').click();
                    }
                } else {
                    decodeStatus.textContent = 'Error: ' + result.error;
                    decodeStatus.className = 'status-message error';
                }
            } catch (error) {
                decodeStatus.textContent = 'Network error: ' + error.message;
                decodeStatus.className = 'status-message error';
            }
        });
    }
}

// Save button functionality
function setupSaveButton() {
    const saveBtn = document.getElementById('save-btn');
    const saveStatus = document.getElementById('save-status');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', async function() {
            saveStatus.textContent = 'Saving...';
            saveStatus.className = 'status-message';
            
            try {
                const response = await fetch('/save_excel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const result = await response.json();
                
                if (result.success) {
                    saveStatus.textContent = `Saved: ${result.filename}`;
                    saveStatus.className = 'status-message success';
                } else {
                    saveStatus.textContent = 'Error: ' + result.error;
                    saveStatus.className = 'status-message error';
                }
            } catch (error) {
                saveStatus.textContent = 'Network error: ' + error.message;
                saveStatus.className = 'status-message error';
            }
        });
    }
}

// Display results in Result tab
function displayResults(result) {
    const resultSections = document.getElementById('result-sections');
    const saveBtn = document.getElementById('save-btn');
    
    if (!resultSections) {
        console.error('result-sections element not found');
        return;
    }
    
    let output = '';
    
    if (result.ef_ursp) {
        output += '<div class="result-section-card">';
        output += '<div class="result-section-header ef-ursp">SIM EF_URSP</div>';
        output += '<div class="result-section-content">';
        output += '<div class="hex-display">' + result.ef_ursp + '</div>';
        output += '</div></div>';
    }
    
    if (result.dl_nas) {
        output += '<div class="result-section-card">';
        output += '<div class="result-section-header dl-nas">DL NAS TRANSPORT</div>';
        output += '<div class="result-section-content">';
        output += '<div class="hex-display">' + result.dl_nas + '</div>';
        output += '</div></div>';
    }
    
    if (result.ursp_info) {
        output += '<div class="result-section-card">';
        output += '<div class="result-section-header ursp-rule">URSP RULE</div>';
        output += '<div class="result-section-content">';
        output += '<div class="text-display">' + result.ursp_info + '\n\n' + result.ursp_conts + '</div>';
        output += '</div></div>';
    }
    
    if (result.pol_cmd_txt) {
        output += '<div class="result-section-card">';
        output += '<div class="result-section-header policy-command">MANAGE UE POLICY COMMAND</div>';
        output += '<div class="result-section-content">';
        output += '<div class="text-display">' + result.pol_cmd_txt + '</div>';
        output += '</div></div>';
    }
    
    resultSections.innerHTML = output;
    if (saveBtn) {
        saveBtn.disabled = false;
    }
}