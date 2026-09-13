# NHealth Technologies — Healthcare at Your Doorstep

An enterprise-grade, comprehensive digital healthcare marketplace and telemedicine ecosystem built for **NHealth Technologies**.

---

## 🌟 Overview

**NHealth Technologies** connects patients, board-certified doctors, verified pharmacies, NABL diagnostic laboratories, and emergency smart ambulance fleets into one seamless, hospital-grade platform.

### Key Highlights:
- 🚀 **15-Minute Instant Telemedicine**: Live HD video consultations with synchronized vitals telemetry.
- 💊 **2-Hour Doorstep Pharmacy Delivery**: Authentic prescription medicines delivered directly to patients' homes.
- 🧪 **Home Diagnostic Testing**: 85+ parameter blood, urine, and pathology sample collections by certified phlebotomists.
- 🚑 **8-Minute Smart Ambulance Dispatch**: Real-time GPS-tracked ALS/BLS ambulances linked with hospital emergency rooms.
- 🗺️ **Pan-India Operations with Dedicated Andhra Pradesh Hub**: Comprehensive coverage across all 26 districts in Andhra Pradesh (Visakhapatnam, Vijayawada, Guntur, Tirupati, Kurnool, etc.).

---

## 🏥 Dedicated Specialized Portals

The platform includes 6 standalone clinical & operational management consoles:

| Portal | File | Description |
|---|---|---|
| **Landing Page** | `index.html` | Public portal with Hero, Video Showcase, Services, Interactive India Map, Telemedicine Room & Booking |
| **Doctor Console** | `doctor.html` | Clinical queue, digital E-Rx prescription builder, patient vitals & consultation schedules |
| **Patient Portal** | `patient.html` | Health records, past appointments, prescription tracking, and lab reports |
| **Pharmacy Hub** | `pharmacy.html` | Prescription verification, inventory dispensing, order fulfillment & delivery routing |
| **Diagnostics Lab** | `diagnostics.html` | Phlebotomist dispatch, sample cold-chain tracking, and digital PDF report publishing |
| **Ambulance Dispatch** | `ambulance.html` | Emergency SOS hotline, GPS fleet map, hospital pre-notification & ALS telemetry |
| **Executive Admin** | `admin.html` | Platform revenue, operational KPIs, partner credentialing, and compliance metrics |

---

## 🛠️ Technology Stack

- **Frontend**: Semantic HTML5, Modern CSS3 (CSS Grid, Flexbox, Glassmorphism, CSS Variables, GPU Keyframe Animations).
- **Client Logic**: Vanilla JavaScript (ES6+) with zero external framework dependencies for sub-second load times.
- **Geospatial & Visuals**: Scalable Vector Graphics (SVG 1.1/2.0) with custom dual-pass Gaussian glow filters highlighting Andhra Pradesh.
- **Media**: HTML5 Native Video Streaming (H.264/MP4).
- **Theming**: Real-time Dark/Light theme persistence via `localStorage`.

---

## 🚀 Quick Start

Because this platform is built with pure client-side web technologies, no build steps or package installations (`npm` or `pip`) are needed:

### Method 1: Local HTTP Server (Recommended)
```bash
# Start a simple local server on port 3000
python -m http.server 3000
```
Open **[http://localhost:3000](http://localhost:3000)** in any browser.

### Method 2: Direct Launch
Simply double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.

---

## 📁 Repository Structure

```
.
├── index.html                 # Main Landing Page & Interactive Telemedicine
├── doctor.html                # Doctor Clinical Portal
├── patient.html               # Patient Health Portal
├── pharmacy.html              # E-Pharmacy Hub
├── diagnostics.html           # Diagnostics Lab Portal
├── ambulance.html             # Smart Ambulance Dispatch Console
├── admin.html                 # Executive Admin Dashboard
├── DESIGN_SYSTEM.md           # Brand Guidelines & Color Tokens
├── Nhealthvideo.mp4           # Ambient Hero Background Video
├── Nhealthvideo2.mp4          # Clinical Consultation Showcase Video
├── assets/
│   ├── images/
│   │   ├── logo.png                   # Official NHealth Logo
│   │   ├── logo-transparent.png       # Transparent Background Logo
│   │   ├── logo-white-text.png        # High-Contrast Logo
│   │   ├── logo-icon.png              # Standalone Plus Icon
│   │   ├── image1.jpg                 # Medical Consultation Image
│   │   └── india_ap_golden.svg        # India Map with Golden-Bordered Andhra Pradesh
│   └── videos/
│       ├── Nhealthvideo.mp4
│       └── Nhealthvideo2.mp4
├── js/
│   └── app.js                 # Theme Engine, Portal Navigation & Telemetry Simulation
└── styles/
    └── main.css               # Design Tokens, Glassmorphism & Responsive Layouts
```

---

## 📄 License & Copyright

© 2026 NHealth Technologies. All Rights Reserved.  
*Healthcare at Your Doorstep.*
