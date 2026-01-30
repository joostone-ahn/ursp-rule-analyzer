# 📡 URSP Rule Analyzer

A powerful web-based tool for analyzing URSP (UE Route Selection Policy) rules used in 5G network slicing. Built to assist engineers interpreting protocol logs or provisioning rules on real devices.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.1+-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

---

## 💡 Why This Tool?

In protocol engineering, one of the most persistent challenges is dealing with raw hex data found in logs or SIM files that standard tools can't parse. This tool bridges that gap by translating **hex-encoded URSP rules** into human-readable structures — and vice versa — using a modern web-based interface.

### Key Advantages
- ✅ **No Hardware Required**: Analyze logs from any device with protocol diagnostics
- ✅ **Web-Based**: Access from any browser, no installation needed
- ✅ **Dual Mode**: Both encoding and decoding capabilities
- ✅ **3GPP Compliant**: Based on TS 24.526/24.501/31.121 standards
- ✅ **Real-time Processing**: Interactive analysis with immediate results

---

## ✨ Key Features

### 📊 Dual Analysis Modes
1. **Encoder**: Visually define URSP rules and generate 3GPP-compliant hex output
2. **Decoder**: Parse raw hex data from NAS logs or SIM files into structured format

### 🔍 Advanced Capabilities
- **Multiple Input Methods**: File upload or direct text paste
- **Real-time Validation**: Immediate feedback on rule configuration
- **Export Support**: Save analysis results to Excel format
- **Interactive UI**: Modern responsive design with split-panel layout
- **Error Detection**: Automatic identification of protocol violations

### 🎨 User Interface
- **Split Layout**: Input panel on left, results on right for efficient workflow
- **Color-Coded Results**: Visual indicators for different message types
- **File Upload**: Drag-and-drop or browse for log files
- **Export**: Download analysis results to Excel

---

## 🧾 Supported Message Types

| Message Type | Detection Logic | Notes |
|--------------|-----------------|-------|
| DL NAS Transport | Contains `68` + `05` | MANAGE UE POLICY COMMAND decoding |
| UL NAS Transport | Contains `67` + `05` | UE policy container responses |
| UE STATE INDICATION | Contains `04` | UE state reporting |
| Registration Request | Contains `41` | Basic detection (TBD) |

---

## 🚀 Quick Start

### 1. Install Docker Desktop
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 2. Run Container

#### macOS (Intel)
```bash
docker run -d \
  -p 8082:8082 \
  -v $(pwd)/uploads:/app/uploads \
  --name ursp-analyzer \
  ghcr.io/joostone-ahn/network-slicing-ursp-rules-analyzer:latest
```

#### macOS (Apple Silicon - M1/M2/M3)
```bash
docker run -d \
  --platform linux/amd64 \
  -p 8082:8082 \
  -v $(pwd)/uploads:/app/uploads \
  --name ursp-analyzer \
  ghcr.io/joostone-ahn/network-slicing-ursp-rules-analyzer:latest
```

> **Note**: Use `--platform linux/amd64` for Apple Silicon (runs via Rosetta 2 emulation)

#### Windows (PowerShell)
```powershell
docker run -d -p 8082:8082 -v ${PWD}/uploads:/app/uploads --name ursp-analyzer ghcr.io/joostone-ahn/network-slicing-ursp-rules-analyzer:latest
```

### 3. Access
Open your browser and navigate to: http://localhost:8082

---

## 📦 Running from Source (For Developers)

If you have cloned the repository and want to run the application directly from Python source:

### 1. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Application

**Web Version (recommended):**
```bash
python src/main.py
```

**PyQt Desktop Version:**
```bash
python src/main_PyQt.py
```

The web application will be available at http://localhost:8082

> **Note**: This method is recommended for developers who want to modify the code or contribute to the project.

---

## 🔧 Docker Management

### Container Control
```bash
# Start
docker start ursp-analyzer

# Stop
docker stop ursp-analyzer

# Restart
docker restart ursp-analyzer

# Remove
docker rm -f ursp-analyzer

# View logs
docker logs -f ursp-analyzer
```

### Update Image
```bash
# Stop and remove old container
docker rm -f ursp-analyzer

# Pull latest image
docker pull ghcr.io/joostone-ahn/ursp-rule-analyzer:latest

# Run new container (use the command for your platform above)
```

---

## 📖 How to Use

### Step 1: Choose Mode
- **Encoder**: Create new URSP rules from scratch
- **Decoder**: Analyze existing hex data from logs

### Step 2: Input Data

#### For Encoding:
1. Fill in basic information (PTI, PLMN, UPSC)
2. Configure URSP rules with traffic descriptors
3. Set route selection descriptors
4. Click **Encode** button

#### For Decoding:
1. Upload a log file or paste hex data directly
2. Click **Decode** button
3. Review the parsed results

### Step 3: Analyze Results
- **EF_URSP**: SIM file format output
- **DL NAS Transport**: Network message format
- **URSP Information**: Structured rule breakdown
- **Payload Details**: Complete protocol analysis

### Step 4: Export (Optional)
Click **Save to Excel** to download complete analysis results

---

## 🎨 Color Guide

### Message Types
| Color | Meaning | Examples |
|-------|---------|----------|
| 🔵 **Blue** | Information | DL NAS Transport success |
| 🟢 **Green** | Success | Successful encoding/decoding |
| 🔴 **Red** | Error | Protocol violations, parsing failures |
| 🟡 **Yellow** | Warning | UL NAS Transport responses |

---

## 🧩 Tech Stack

### Backend
- **Python 3.11+**: Core language
- **Flask 3.1+**: Web framework
- **Flask-Session**: Server-side session management
- **pandas**: Data processing and analysis
- **openpyxl**: Excel file generation

### Frontend
- **HTML5 + CSS3**: Modern web standards
- **Vanilla JavaScript**: No framework dependencies
- **Responsive Design**: Works on desktop and mobile

### Deployment
- **Gunicorn**: WSGI HTTP server
- **Docker**: Containerization support
- **GitHub Container Registry**: Image distribution

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           Frontend (Browser)                │
│  • Split Panel Layout                       │
│  • File Upload Interface                    │
│  • Real-time Results Display                │
└──────────────┬──────────────────────────────┘
               │ HTTP/JSON
┌──────────────▼──────────────────────────────┐
│         Flask Web Server                    │
│  • Route Handlers                           │
│  • Session Management                       │
│  • File Processing                          │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│       Core Processing Pipeline              │
│                                              │
│  encoder.py  → URSP Rule Encoding           │
│  decoder.py  → Protocol Analysis            │
│  display.py  → Result Formatting            │
│  spec.py     → 3GPP Standards Reference     │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│       Reference Data (3GPP Standards)       │
│  • Traffic Descriptor Types                 │
│  • Route Selection Descriptor Types         │
│  • Message Type Definitions                 │
│  • Protocol Constants                       │
└─────────────────────────────────────────────┘
```

---

## 📖 References

### 3GPP Standards
- [TS 24.526](https://www.3gpp.org/ftp/Specs/archive/24_series/24.526/) - UE Policy Container (URSP)
- [TS 24.501](https://www.3gpp.org/ftp/Specs/archive/24_series/24.501/) - NAS Signaling Procedures
- [TS 31.121](https://www.3gpp.org/ftp/Specs/archive/31_series/31.121/) - EF_URSP File Format in UICC
- [TS 23.503](https://www.3gpp.org/ftp/Specs/archive/23_series/23.503/) - Policy and Charging Control Framework

---

## 👤 Author

**JUSEOK AHN (안주석)**  
**Email**: ajs3013@lguplus.co.kr  
**Organization**: LG U+  
**Role**: Technical Specialist, Telecommunications Engineer

---

## 📄 License & Credits

**© 2025 JUSEOK AHN &lt;ajs3013@lguplus.co.kr&gt; All rights reserved.**

This software is proprietary and confidential. Developed for internal analysis, URSP validation, and automation of diagnostic workflows at LG U+.

### Applicable For
- QA teams performing 5G network slicing testing
- Engineers debugging UE-network communication
- Researchers working with modern 5G SA infrastructure
- Network operators validating URSP policies

### Patent Information
This software is protected by patent applications filed with the Korean Intellectual Property Office.

---

**Made with ❤️ for better 5G network slicing analysis**