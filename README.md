# 📡 Network Slicing URSP Rules Analyzer

A Python-based GUI tool for **decoding and encoding URSP (UE Route Selection Policy)** rules used in 5G network slicing — built to assist engineers interpreting protocol logs or provisioning rules on real devices.

> 🔧 **Bridging Hex-Level Protocol Analysis with GUI-Based Rule Configuration**:
> In protocol engineering, one of the most persistent challenges is dealing with raw hex data found in logs or SIM files that standard tools can’t parse. This tool bridges that gap by translating **hex-encoded URSP rules** into human-readable structures — and vice versa — using a 3GPP-compliant GUI interface.

---

## 📌 Overview

URSP rules are a foundational mechanism in **5G Standalone (SA)** networks to support **network slicing**, where specific apps or traffic types are dynamically routed to the most appropriate network slice.

This tool was developed to decode and encode **URSP rules** based on:

* **3GPP TS 24.526** – URSP encoding in UE Policy Container (NAS)
* **3GPP TS 24.501** – NAS message procedures
* **3GPP TS 31.121** – SIM file structure (EF\_URSP)

It enables rapid interpretation of complex **UE Policy Containers** or **SIM-resident URSP rules**, helping testers, device makers, and protocol engineers to automate rule creation, validation, and testing.

* Validated with both *pre-configured URSP (SIM EF\_URSP)* and *network-provisioned rules (NAS UE Policy Container)*
* Supports end-to-end encoding + decoding in hex for AT command scripting, network slicing validation, and log inspection workflows

---

## 🔍 What Are URSP Rules?

**URSP (UE Route Selection Policy)** rules define how a UE selects a **PDU session or network slice** for a given application, flow, or service.
They enable **application-level traffic steering**, a key differentiator in the 5G architecture.

There are two provisioning models:

* 📁 **Pre-configured**: Rules stored on SIM (EF\_URSP) or UE non-volatile memory.
* 🌐 **Network Provisioned**: Rules generated on the **PCF** and delivered via NAS (UE Policy Container).

Each rule can include:

* `Application Identifier`
* `Traffic Descriptor` (e.g., IPv4/IPv6 prefixes, ports, protocols)
* `Route Selection Descriptor` (e.g., OSId, SSC Mode, DNN, S-NSSAI)
* `Precedence`, `Match-All flag`, and other control fields

These rules are the foundation for **per-app QoS**, **slice isolation**, and **multi-PDU session steering** in 5G SA.

---

## 🛠 Key Features

| Feature              | Description                                                                   |
| -------------------- | ----------------------------------------------------------------------------- |
| ✅ Decode from Hex    | Paste raw hex (e.g., from NAS log or EF\_URSP dump) and get structured output |
| ✅ Encode to Hex      | Visually define new rules, output valid 3GPP-encoded hex                      |
| ✅ PyQt GUI           | Drag-and-fill interface to construct rules with ease                          |
| ✅ Spec-Compliant     | Fully aligned with 3GPP TS 24.526, 24.501, and 31.121                         |

---

## 🚀 Getting Started

### ▶️ Launch GUI

  ```bash
  python main.py
  ```

---

## 🖼 Sample Screenshots

### URSP Encoder (GUI)

Define rule components using dropdowns and structured fields
Output is 3GPP-encoded hex, ready for AT command or file injection

![Encoder UI](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/dcd783df-dfe5-4303-b45f-62feab5b7b85)
![Encoder Output](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/ba3b1162-8404-4d0a-9bac-5060dea8ba76)

---

### URSP Decoder (GUI)

Paste raw hex from logs or SIM file
Structured output shows traffic filters, S-NSSAI, precedence, and more

![Decoder Input](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/94341c95-5545-4749-858d-dd41411878a2)
![Decoder Output](https://github.com/joostone-ahn/URSP_Analyzer/assets/98713651/fa0a8ea3-11c2-45c1-862e-de2a83d8186f)

---

## 📚 References

* 📘 [3GPP TS 24.526 – UE Policy Container (URSP)](https://www.3gpp.org/ftp/Specs/archive/24_series/24.526/)
* 📘 [3GPP TS 24.501 – NAS Signaling Procedures](https://www.3gpp.org/ftp/Specs/archive/24_series/24.501/)
* 📘 [3GPP TS 31.121 – EF\_URSP File Format in UICC](https://www.3gpp.org/ftp/Specs/archive/31_series/31.121/)
* 📘 [3GPP TS 23.503 – Policy and Charging Control Framework](https://www.3gpp.org/ftp/Specs/archive/23_series/23.503/)

---
