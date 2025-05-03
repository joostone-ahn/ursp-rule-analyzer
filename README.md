# 🧠 Network Slicing URSP Rules Analyzer

A Python-based GUI tool for **decoding and encoding URSP (UE Route Selection Policy)** rules used in 5G network slicing — built to assist engineers interpreting protocol logs or provisioning rules on real devices.

---

## 📌 Overview

In the field of protocol engineering, hex-only log areas and unparsed policy containers are a common challenge.  
This tool was built to decode and encode **URSP rules** based on **3GPP TS 24.526** and **TS 24.501**, enabling fast interpretation of **UE Policy Containers** or **EF_URSP SIM files**.

> ✅ Pre-validated with both *pre-configured URSP (SIM EF_URSP)* and *network-provisioned rules (NAS UE Policy Container)*  
> ✅ Supports end-to-end encoding + decoding in hex for AT command scripting, analysis, and automation  

---

## 🔍 What Are URSP Rules?

**URSP (UE Route Selection Policy)** rules allow a UE to select a specific **PDU session or network slice** for a given app or traffic descriptor.

- 📁 **Pre-configured rules**: Stored on SIM (EF_URSP) or NV memory.  
- 🌐 **Provisioned rules**: Delivered by the network PCF over NAS in the **UE Policy Container**.

Each rule may include:
- `Application Identifier`
- `Traffic Descriptor` (IP filters, port ranges, protocols)
- `Route Selection Descriptor` (OSId, SSC Mode, DNN, S-NSSAI, etc.)
- `Precedence`, `MatchAll`, and more

These are foundational to **5G slicing**, **QoS isolation**, and **application-specific PDU sessions**.

---

## 🛠 Features

| Feature                | Description                                                                 |
|------------------------|-----------------------------------------------------------------------------|
| ✅ Decode from Hex      | Parse binary URSP rules (e.g. from NAS log or SIM file) into human-readable fields |
| ✅ Encode to Hex        | Build a rule visually and encode it for writing to SIM or scripting         |
| ✅ PyQt GUI             | Drag-and-fill interface for rule construction                              |
| ✅ Spec-Compliant       | Based on 3GPP TS 24.526, 24.501, and 31.121                                 |
| ✅ Developer-Friendly   | Modular Python scripts for integration or CLI usage                        |

---

## 🖥️ Tool Structure

<pre>
Network-Slicing-URSP-rules-Analyzer/
│
├── decoder.py         # Hex → structured rule parser
├── encoder.py         # Structured rule → hex encoder
├── ui_main.py         # PyQt GUI launcher
├── ursp_parser.py     # Core logic (shared by decoder/encoder)
│
├── example_files/     # Sample rules and hex strings
├── image/             # UI screenshots
└── README.md
</pre>

---

## 🚀 Getting Started

### ▶️ Launch GUI

```bash
python ui_main.py
```

## 🖼 Sample Screenshots

### URSP Encoder (GUI)

![image](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/dcd783df-dfe5-4303-b45f-62feab5b7b85)
![image](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/ba3b1162-8404-4d0a-9bac-5060dea8ba76)

---

### URSP Decoder (GUI)

![image](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/94341c95-5545-4749-858d-dd41411878a2)
![image](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/fa0a8ea3-11c2-45c1-862e-de2a83d8186f)

---

## 📚 References

* 📘 [3GPP TS 24.526 – UE Policy Container (URSP)](https://www.3gpp.org/ftp/Specs/archive/24_series/24.526/)
* 📘 [3GPP TS 24.501 – NAS Signaling Procedures](https://www.3gpp.org/ftp/Specs/archive/24_series/24.501/)
* 📘 [3GPP TS 31.121 – EF\_URSP File Format in UICC](https://www.3gpp.org/ftp/Specs/archive/31_series/31.121/)
* 📘 [3GPP TS 23.503 – Policy and Charging Control Framework](https://www.3gpp.org/ftp/Specs/archive/23_series/23.503/)
