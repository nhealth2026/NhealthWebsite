# NHealth Technologies — Brand Design System & UI Specification

> **Derived Directly from the NHealth Technologies Brand Logo**  
> Tagline: *Healthcare at Your Doorstep* | *Healthcare at Home*  
> Target Audience: Patients, Doctors, Pharmacies, Diagnostic Centers, Nurses, Ambulance Providers, Delivery Partners, Administrators.

---

## 1. Logo Visual Identity Extraction

The NHealth visual mark comprises three fundamental geometries:
1. **Dynamic Ribbon "N" Mark**: A continuous 3D helical ribbon representing the continuity of care, vitality, and modern fluid digital health. It transitions from **Vibrant Mint Teal** (`#01CCB6`) to **Electric Royal Blue** (`#0060D1`), culminating in an upward soaring **Cyan Azure** stem (`#00B4DB`).
2. **Medical Cross (`+`)**: Positioned at the top right of the ribbon in **Medical Mint Teal** (`#02BFB4`), anchoring clinical authority, positive outcomes, and emergency responsiveness.
3. **Commanding Wordmark ("Nhealth")**: Set in a heavy, geometric rounded sans-serif in **Deep Trust Navy** (`#003169`), conveying institutional stability, enterprise credibility, and HIPAA/NABL-level security.
4. **Tagline Anchor ("— Healthcare at Home —")**: Formatted in sophisticated **Slate Steel** (`#54718C`) flanked by clean balanced em-dashes.

---

## 2. Color System & Design Tokens

### Core Brand Palette
| Token Name | Hex Code | RGB | Role / Usage | WCAG On White | WCAG On Navy |
|---|---|---|---|---|---|
| `--nh-navy-700` (Primary) | `#003169` | `rgb(0, 49, 105)` | Wordmark, Primary Headers, Enterprise Top Bars | 12.65:1 (AAA) | — |
| `--nh-navy-900` (Deep Navy) | `#001A3D` | `rgb(0, 26, 61)` | Hero Canvas, Footer, Dark Mode Elements | 16.8:1 (AAA) | — |
| `--nh-blue-600` (Secondary) | `#0060D1` | `rgb(0, 96, 209)` | Ribbon Central Loop, CTAs, Active States | 5.5:1 (AA) | 2.3:1 |
| `--nh-teal-500` (Accent Mint) | `#02BFB4` | `rgb(2, 191, 180)` | Medical Cross `+`, Badges, Live Pulse, Accents | 2.3:1 (Use with Navy text) | 5.9:1 (AAA) |
| `--nh-teal-400` (Vibrant Mint) | `#01CCB6` | `rgb(1, 204, 182)` | Ribbon Tip, Glowing Dots, Accent Gradients | 2.1:1 | 6.2:1 (AAA) |
| `--nh-cyan-500` (Sky Azure) | `#00B4DB` | `rgb(0, 180, 219)` | Ribbon Stem, Dark Mode Focus Rings, Charts | 2.6:1 | 5.1:1 (AA) |
| `--nh-slate-500` (Support Slate) | `#54718C` | `rgb(84, 113, 140)` | Logo Tagline, Secondary Meta Text, Subtle Borders | 4.8:1 (AA) | 2.8:1 |

### Functional Status Tokens
- **Online / Active / Success**: `#059669` (Subtle bg: `#ECFDF5`)
- **Warning / Pending Review**: `#D97706` (Subtle bg: `#FFFBEB`)
- **Emergency SOS / Danger**: `#DC2626` (Subtle bg: `#FEF2F2`)
- **Telemedicine Live / Info**: `#0284C7` (Subtle bg: `#F0F9FF`)

### Gradients
```css
/* Signature Brand Ribbon Gradient */
--bg-gradient-ribbon: linear-gradient(135deg, #01CCB6 0%, #0060D1 50%, #00B4DB 100%);

/* Enterprise Hero Background */
--bg-hero: linear-gradient(135deg, #001A3D 0%, #003169 55%, #004F9E 100%);

/* High-Conversion Accent Button */
--bg-btn-accent: linear-gradient(135deg, #01CCB6 0%, #02BFB4 100%);
```

---

## 3. Typography Architecture

### 1. Heading Font: `Plus Jakarta Sans`
- Matches the optical geometry and softly radiused terminals of the "Nhealth" logo mark.
- Weights:
  - **800 (Extra Bold)**: Hero title (`3.4rem`), Key Statistics (`1.75rem`)
  - **700 (Bold)**: Section Titles (`2.25rem`), Service Card Titles (`1.35rem`)
  - **600 (Semi Bold)**: Nav items, buttons, table headers, modal labels

### 2. Body Font: `Inter`
- High-legibility grotesque sans-serif engineered for clinical readability, telemedicine messages, and user forms.
- Weights: **400 (Regular)**, **500 (Medium)**, **600 (Semi Bold)**

### 3. Medical Vitals & Metric Font: `JetBrains Mono`
- Monospaced numerical font used for real-time telemetry (Heart Rate: `74 bpm`, SpO2: `99%`, BP: `120/80 mmHg`), patient barcodes, dosages, and transaction IDs.

---

## 4. Light vs. Dedicated Dark Theme Matrix

| Component | Light Theme (`data-theme="light"`) | Dedicated Clinical Dark Theme (`data-theme="dark"`) |
|---|---|---|
| **App Canvas** | `#F5F8FC` (Soft icy blue pearl) | `#061224` (Deep obsidian navy) |
| **Card Surface** | `#FFFFFF` (Pure white) | `#0B1C36` (Elevated clinical slate-navy) |
| **Elevated Containers** | `#FFFFFF` (Shadow: `0 10px 30px rgba(0,49,105,0.12)`) | `#152E54` (Luminous ambient border) |
| **Primary Text** | `#001A3D` (Deep Navy) | `#F0F6FC` (Crisp ice-white) |
| **Secondary Text** | `#54718C` (Slate Steel) | `#97B0C7` (Soft steel-blue) |
| **Borders** | `#E1E8F2` | `#183359` |
| **Brand Logo In Nav** | `assets/images/logo-transparent.png` | `assets/images/logo-white-text.png` |

---

## 5. Component Library Specifications

### Buttons
1. **Primary Button (`.nh-btn-primary`)**:
   - Fill: `linear-gradient(135deg, #003169 0%, #0060D1 100%)`
   - Text: `#FFFFFF`, Weight: 600
   - Shadow: `0 4px 14px rgba(0, 49, 105, 0.25)`
   - Hover: Translates `-1px` with `0 6px 20px rgba(0, 96, 209, 0.35)`

2. **Secondary Button (`.nh-btn-secondary`)**:
   - Fill: Surface white, Border: 1px solid `#E1E8F2`
   - Text: `#003169` (Navy)
   - Hover: Border `#0060D1`, background `#F2F7FE`

3. **Accent Button (`.nh-btn-accent`)**:
   - Fill: `linear-gradient(135deg, #01CCB6 0%, #02BFB4 100%)`
   - Text: `#00223E` (Dark Navy for optimal AAA contrast)
   - Hover: Luminous teal glow `0 6px 22px rgba(2, 191, 180, 0.45)`

4. **Danger / Emergency SOS Button (`.nh-btn-danger`)**:
   - Fill: `#DC2626`
   - Text: `#FFFFFF`
   - Hover: `#B91C1C`

### Enterprise Data Tables (`.nh-table`)
- Header: Subtle slate background `#EDF3F9` with uppercase tracking (`letter-spacing: 0.05em`).
- Row hover: Subtle blue tint `rgba(0, 96, 209, 0.05)`.
- Status indicators: Rounded pill badges with 12% opacity tints matching status semantics.

### Telemedicine Video Consultation Suite
- Real-time video canvas with Doctor primary stream and Picture-in-Picture patient preview.
- Floating HUD displaying synchronized vitals (`Pulse`, `SpO2`, `Blood Pressure`).
- Encrypted WebSocket-style consultation chat with automated physician simulated response.
- One-click prescription generator linked to WhatsApp and registered pharmacy.

### WhatsApp Notification Integration
- Authentic WhatsApp Business Card UI featuring the verified tick mark, official green bubble header, and live updated dynamic booking details.

---

## 6. Multi-Role Ecosystem Matrix

The platform is designed to seamlessly support 8 distinct user classes:
1. **Patients**: Instant doctor booking, prescription downloads, home lab tracking, ambulance tracker.
2. **Doctors**: Clinical appointments queue, HD telemedicine console, electronic prescription writer, earnings ledger.
3. **Pharmacies**: Digital Rx verification desk, order dispensing queue, delivery fleet dispatch.
4. **Diagnostic Centers**: Pathology specimen batching, phlebotomist tracker, barcode analyzer sync, NABL report publishing.
5. **Nurses**: Home care shift scheduling, patient vitals monitoring, attendant logs.
6. **Ambulance Providers**: Emergency SOS distress queue, GPS navigation telemetry, hospital ER pre-handover.
7. **Delivery Partners**: Temperature-controlled medicine dispatch, live route optimization.
8. **Administrators**: Platform GMV analytics, doctor KYC approvals, commission settlement ledger, HIPAA/ISO audit compliance.
