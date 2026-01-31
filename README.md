# 📡 URSP Rule Analyzer

A powerful web-based tool for analyzing URSP (UE Route Selection Policy) rules used in 5G network slicing. Built to assist engineers interpreting protocol logs or provisioning rules on real devices.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## 💡 Why This Tool?

In protocol engineering, one of the most persistent challenges is dealing with raw hex data found in logs or SIM files that standard tools can't parse. This tool bridges that gap by translating **hex-encoded URSP rules** into human-readable structures — and vice versa — using a modern web-based interface.

---

## 🚀 Quick Start

### 1. Using Docker (Recommended)

#### Mac (Intel)
```bash
docker run -d \
  -p 8081:8081 \
  --name ursp-rule-analyzer \
  ghcr.io/joostone-ahn/ursp-rule-analyzer:latest
```

#### Mac (Apple Silicon)
```bash
docker run -d \
  --platform linux/amd64 \
  -p 8081:8081 \
  --name ursp-rule-analyzer \
  ghcr.io/joostone-ahn/ursp-rule-analyzer:latest
```

#### Windows
```powershell
docker run -d -p 8081:8081 --name ursp-rule-analyzer ghcr.io/joostone-ahn/ursp-rule-analyzer:latest
```

> **Note**: 
> - Apple Silicon users must use `--platform linux/amd64` as the image is built for AMD64 architecture
> - Windows users need WSL2 installed for Docker Desktop

#### Access Application
Open your browser and navigate to: http://localhost:8081

#### Container Management
```bash
# Start
docker start ursp-rule-analyzer

# Stop
docker stop ursp-rule-analyzer

# Remove
docker rm -f ursp-rule-analyzer

# View logs
docker logs -f ursp-rule-analyzer
```

### 2. Running from Source (For Development)

If you want to modify the code or run from source:

```bash
# Clone repository
git clone https://github.com/joostone-ahn/ursp-rule-analyzer.git
cd ursp-rule-analyzer

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run application
python src/main.py
```

---

## 📖 How to Use

### Encoder Tab - Creating URSP Rules

Use this when you need to generate hex data for SIM card provisioning or create network policy messages.

1. **Configure Basic Information**: Set PTI, PLMN, UPSC values and adjust "URSP Rule Count" to create multiple URSP rules
2. **Define Traffic Rules**: Configure which types of traffic this rule should apply to: Match-all, OS Id + OS App Id, DNN, Connection capabilities
3. **Set Route Selection**: Configure route selection descriptors (RSD) by adjusting "RSD Count" and "RSD Type Count" within each rule: SSC mode, S-NSSAI, DNN, Access type, Multi-access preference, etc.
4. **Generate Output**: Click **🚀 Encoding** to create hex data and protocol messages

> **Dynamic Rule Management**: Adjust count values to add/remove rules dynamically. Precedence values are automatically assigned to avoid conflicts and can be manually edited as needed.

### Decoder Tab - Analyzing Existing Data

Use this when you have hex logs from network traces, SIM card dumps, or protocol analyzer captures.

Simply paste the hex data and click **🔍 Decode** to see the structured breakdown.

### Result Tab - Understanding Your Data

The Result tab provides four types of analysis output:

- **SIM EF_URSP**: Ready-to-use hex data for SIM card programming
- **DL NAS TRANSPORT**: Complete over-the-air message format for network communication
- **URSP RULE**: Human-readable rule summary for quick verification and troubleshooting
- **MANAGE UE POLICY COMMAND**: Detailed byte-by-byte protocol analysis for deep debugging

> Each section includes **📋 Copy** buttons for quick data sharing.

---

## 🧩 Tech Stack

### Backend
- **Python 3.11+**: Core language
- **Flask 3.1+**: Web framework
- **Flask-Session**: Server-side session management
- **pandas**: Data processing and Excel export
- **openpyxl**: Excel file generation

### Frontend
- **HTML5 + CSS3**: Modern web standards with CSS Grid and Flexbox
- **Vanilla JavaScript**: No framework dependencies, pure ES6+
- **Responsive Design**: Mobile-first approach with breakpoints

### File Structure
```
src/
├── main.py              # Flask web server
├── main_PyQt.py         # Desktop version (legacy)
├── encoder.py           # URSP rule encoding logic
├── decoder.py           # Protocol analysis and decoding
├── display.py           # Result formatting
├── spec.py              # 3GPP standards reference
├── excel.py             # Excel export functionality
├── templates/
│   └── index.html       # Main web interface
└── static/
    ├── css/
    │   └── style.css    # Modern styling
    └── js/
        └── app.js       # Interactive functionality
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (Browser)                │
│  • Three-Tab Interface                      │
│  • Dynamic Card Management                  │
│  • Real-time Form Validation                │
│  • Copy & Export Functionality              │
└──────────────┬──────────────────────────────┘
               │ HTTP/JSON API
┌──────────────▼──────────────────────────────┐
│         Flask Web Server (Port 8081)        │
│  • /encode - URSP rule encoding             │
│  • /decode - Protocol analysis              │
│  • /save_excel - Excel export               │
│  • Session management                       │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│       Core Processing Pipeline              │
│                                             │
│  encoder.py  → URSP Rule Encoding           │
│  decoder.py  → Protocol Analysis            │
│  display.py  → Result Formatting            │
│  spec.py     → 3GPP Standards Reference     │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│         Output Generation                   │
│  • xlsx/ - Excel files                      │
│  • Hex-formatted results                    │
│  • Structured text output                   │
└─────────────────────────────────────────────┘
```

---

## 📖 References

### 3GPP Standards
- [TS 24.526](https://www.3gpp.org/ftp/Specs/archive/24_series/24.526/) - UE Policy Container (URSP)
- [TS 24.501](https://www.3gpp.org/ftp/Specs/archive/24_series/24.501/) - NAS Signaling Procedures
- [TS 31.102](https://www.3gpp.org/ftp/Specs/archive/31_series/31.102/) - EF_URSP File Format in USIM Application
- [TS 23.503](https://www.3gpp.org/ftp/Specs/archive/23_series/23.503/) - Policy and Charging Control Framework

---
gi
## 👤 Author

**JUSEOK AHN (안주석)**  
**Email**: ajs3013@lguplus.co.kr  
**Organization**: LG U+  
**Role**: Technical Specialist, Telecommunications Engineer

---

## 📄 License & Credits

**© 2026 JUSEOK AHN &lt;ajs3013@lguplus.co.kr&gt; All rights reserved.**

This software is proprietary and confidential. Developed for internal analysis, URSP validation, and automation of diagnostic workflows at LG U+.

### Applicable For
- QA teams performing 5G network slicing testing
- Engineers debugging UE-network communication
- Researchers working with modern 5G SA infrastructure
- Network operators validating URSP policies

---

**Made with ❤️ for better 5G network slicing analysis**