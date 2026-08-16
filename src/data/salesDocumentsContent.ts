/**
 * BKR Enterprise Platform - Sales Documents, Spec Sheet, and Visual Commercial Sales Flyer
 * Contains comprehensive Markdown, HTML, and Data-URI payloads for downloads and office integration.
 */

export const SALES_EXECUTIVE_SUMMARY_MD = `# BKR Enterprise Biotechnology & Scientific E-Commerce Platform
## Executive Sales Overview & Capabilities Summary

---

### 1. Executive Summary & Value Proposition
The **BKR Enterprise Platform** is a specialized, production-grade digital commerce and laboratory operations management system engineered specifically for biotechnology researchers, peptide synthesis facilities, chemical reference standard vendors, compounding laboratories, and scientific testing institutions.

Unlike generic e-commerce platforms (e.g. Shopify or WooCommerce), the BKR Platform natively solves the strict regulatory, analytical, chemical safety, and operational challenges inherent to scientific chemical commerce—including **HPLC purity verification**, **GHS hazard labeling**, **multi-merchant payment routing**, **thermal bottle serialization**, **interactive dilution & reconstitution calculators**, **full-featured internal Office Suite**, **4-tier Row-Level Security (RLS) file management**, and **real-time fleet over-the-air (OTA) hot-patching**.

---

### 2. Who It Is For (Target Audiences)
- **Life Sciences & Biotechnology Research Laboratories**: Seamless acquisition of certified research-grade compounds with batch-specific HPLC and mass spec data.
- **Peptide Synthesizers & Chemical Manufacturers**: End-to-end cataloging, lot serialization, GHS hazard warning generation, and supplier purchase order automation.
- **Analytical & Forensic Testing Centers**: Automated distribution and cryptographic verification of Certificates of Analysis (COAs) and Safety Data Sheets (SDSs).
- **Compounding Facilities & Medical Research Merchants**: Flexible multi-gateway checkout accepting credit cards, bank wires, and cryptocurrency with multi-currency conversion.
- **Science Commerce Operators**: High-converting storefront with responsive visual themes, micro-spaced layout customizers, and SOC2 / GxP compliance audit logging.

---

### 3. Unmatched Customizability & Enterprise Flexibility
1. **Real-Time Visual Spacing & Layout Engine**:
   - Micro-tune container outer padding (8px to 48px), inner element padding, and card corner radiuses (sharp 0px to pill 24px).
   - 5 luxury palette presets (Obsidian Emerald, Cyber Neon, Deep Sea Blue, Dark Slate, and Clean Minimalist Light) with real-time responsive viewport simulation.
2. **Customer Portal Drag-and-Drop Layout Designer**:
   - Reorder dashboard tabs, toggle widget visibility (Recent Orders, Loyalty Points, Quick Reorder, Reconstitution Calculator), and customize greeting headlines.
3. **Chemical Bottle Label & Thermal Printer Designer**:
   - Dynamically generate GHS-compliant bottle labels with CAS numbers, chemical molecular formulas, hazard pictograms, and 2D DataMatrix / QR verification codes.
   - 1-click output to thermal roll printers (Zebra ZPL, DYMO) or formatted PDF multi-label sheets.
4. **Multi-Merchant Payment & Financial Routing**:
   - Independent sandbox/live switches for Authorize.Net, Stripe, PayPal, Web3 Crypto Wallets (BTC, ETH, USDT), Bank Wire Instructions, and Apple Pay.
5. **Transactional Communication Hub**:
   - Liquid-style merge templating with automated email (SMTP, SendGrid, Mailgun) and SMS (Twilio, Telnyx) dispatch logging.
6. **Supabase PostgreSQL Schema Sync & Universal Backups**:
   - 1-click live PostgreSQL DDL generation with RLS policies, plus full JSON and CSV table exports.

---

### 4. Key Platform Features & Modules
| Module | Core Capabilities |
| :--- | :--- |
| **Storefront & Catalog** | Instant search (Ctrl+K), category filters, CAS/SKU lookup, molecular mass visualizer, HPLC purity graphs, batch COA attachments. |
| **Scientific Calculators** | Reconstitution calculator, syringe unit concentration (mcg/IU), diluent volume matrix, and compound half-life decay modeling. |
| **Checkout & Multi-Gateway** | Credit Card, Crypto, Bank Wire, Apple Pay, multi-currency support, tax calculation, and instant asset auto-grants. |
| **Customer Portal & Security** | Real-time shipment tracking milestones, invoice archive, COA vault, multi-address book, VIP loyalty points, Google Authenticator (TOTP), SMS 2FA, and Passkeys. |
| **Admin Operations** | Bulk CSV catalog import/export, batch price/stock editing, single/multi-image studio retoucher, and purchase order restock increments. |
| **Office Suite** | Word processor with letterheads, multi-sheet calculation engine with formulas (SUM, AVG, MIN, MAX), slide decks, and gold foil business cards. |
| **Lab File Manager** | Multi-bucket storage, 4-tier Row-Level Security (RLS), expiring signed URLs (1hr to 30d), watermarking, and forensic audit logs. |
| **SecOps & Audit Trail** | Chronological visual timeline, multifaceted role/event filtering, SOC2/GxP compliance dossier export, and emergency security actions. |
| **Fleet & OTA Sync** | Real-time WebSocket sync for iOS, Android, and Web clients with automated dynamic manual recompilation and SHA-256 validation. |

---
*BK Research Labs Enterprise Solutions • Certified Laboratory Software Systems*
`;

export const MASTER_SPEC_SHEET_MD = `# BKR Enterprise Biotechnology Platform — Master Technical & Functional Specification Sheet
## Comprehensive Architecture, Data Models & Feature Matrix (v2.5)

---

### Section 1: System Architecture & Tech Stack
- **Frontend Core**: React 18+ Single Page Application (SPA) with TypeScript 5.x.
- **Styling Architecture**: Tailwind CSS 4.x utility architecture with dynamic CSS variable spacing and zero CSS-in-JS overhead.
- **Animation & Transitions**: Motion (formerly Framer Motion) hardware-accelerated transitions.
- **Icons & Visual Language**: Lucide-React SVG iconography.
- **Persistence & Cloud Sync**: LocalStorage client cache with seamless live Supabase (PostgreSQL 15+) cloud synchronization, RLS security policies, and SQL DDL auto-generator.
- **Document Rendering**: Client-side jsPDF vector document generation, HTML5 Canvas rendering, and UTF-8 Blob exporters.
- **Internationalization**: Lightweight i18n engine supporting English (en), Spanish (es), French (fr), German (de), Japanese (ja), and Chinese (zh).

---

### Section 2: Storefront & Research Catalog
- **Catalog Navigation**: Fast faceted filtering across Peptides, Nootropics, Chemical Compounds, and Reference Standards.
- **Command Palette Search**: Global \`Ctrl + K\` / \`Cmd + K\` modal search with fuzzy query matching on Chemical Name, CAS Number, SKU, and Keywords.
- **Product Details Specification**:
  - Molecular Structure formula, molecular weight (g/mol), and sequence representation.
  - CAS Registry Number with authoritative chemical registry verification links.
  - HPLC Chromatographic Purity Percentage display (e.g. 99.48% Area).
  - Storage temperature guidelines (e.g. -20°C Cryogenic / 2-8°C Refrigerated).
  - High-resolution studio photography with multiple angle thumbnails and zoom overlay.
  - Downloadable Safety Data Sheet (SDS) and Certificate of Analysis (COA) PDF attachments.
  - Dynamic volume pricing tiers (e.g., 1-4 vials, 5-9 vials, 10+ wholesale).
- **Interactive Reconstitution Calculator**:
  - Input: Vial lyophilized mass (mg) + Sterile Bacteriostatic Water volume (mL).
  - Output: Exact unit concentration (mcg per 0.01mL / 1 IU on U-100 syringe).
  - Half-life stability graph and recommended reconstitution handling instructions.
- **Cart & Wishlist Engine**:
  - Persistent shopping cart with real-time stock availability verification.
  - "Save for Later" wishlist bookmarking with 1-click cart transfer.

---

### Section 3: Multi-Gateway Checkout & Payment Engine
- **Supported Payment Processors**:
  - **Authorize.Net**: Merchant API Login ID & Transaction Key with CIM tokenization.
  - **Stripe**: Credit/Debit Cards with 3D Secure 2.0 authentication.
  - **PayPal**: Express checkout and PayPal Credit.
  - **Web3 Cryptocurrency**: Bitcoin (BTC), Ethereum (ETH), and Tether (USDT-TRC20/ERC20) with automated QR payment generation.
  - **Bank Wire Transfer**: Automated routing number and SWIFT/IBAN invoice remittance generation.
  - **Apple Pay / Google Pay**: Browser-native biometric checkout.
- **Multi-Currency Support**: Real-time conversion across USD ($), EUR (€), GBP (£), CAD ($), and JPY (¥).
- **Instant Digital Asset Grants**: Automatic license and COA attachment grant upon successful checkout.

---

### Section 4: Customer Dashboard & Security Suite
- **Order Tracking & Milestones**: Interactive chronological progress timeline (Order Placed -> Payment Verified -> Lab Compounding -> Quality Assurance -> Carrier Dispatched -> Delivered).
- **Carrier Deep Links**: Automatic 1-click tracking for FedEx, UPS, DHL Express, and USPS.
- **Invoices & Receipts**: Printable PDF commercial invoice generation with tax breakdown and lot numbers.
- **Certificate Verification Vault**: Search batch lot numbers to view third-party HPLC chromatograms and SHA-256 hashes.
- **Multi-Address Book**: Manage primary and secondary laboratory shipping/billing destinations with postal validation.
- **Rewards & Loyalty Engine**: Tiered points accumulation (Bronze, Silver, Gold, Diamond VIP) with coupon code generator.
- **Account Security & 2FA**:
  - Google Authenticator / Authy TOTP 6-digit time-based one-time password pairing with QR code.
  - SMS Two-Factor verification via Twilio gateway.
  - WebAuthn Biometric Passkeys (Touch ID, Face ID, Windows Hello).
  - Active session inspector with remote token revocation.
- **Support Ticket Desk**: Inbound ticketing with priority triage, attachments, and real-time email/SMS updates.

---

### Section 5: Admin Suite & Operations Management
- **Catalog Management & Bulk Ops**:
  - Full CRUD operations on chemical compounds.
  - Bulk CSV Import with column auto-mapping.
  - Bulk Price Adjustments (percentage markup/discount or flat dollar increment).
  - Bulk Stock Adjustments and category re-assignment.
- **Image Studio Retoucher**:
  - Crop tool with fixed aspect ratios (1:1 Square, 4:3 Product, 16:9 Banner).
  - Gallery reordering and storefront thumbnail selection.
- **Orders & Multi-Carrier Fulfillment**:
  - Status transitions (Pending, Processing, Shipped, Delivered, Cancelled).
  - Thermal tracking barcode generation and carrier assignment.
  - 1-Click PDF Packing Slips and Hazardous Materials Shipping Manifests.
- **Inventory & Purchase Orders (POs)**:
  - Low-stock reorder threshold triggers with visual stock badges.
  - Supplier PO creation with unit costs, expected arrival dates, and automatic stock reception increments.
- **Customer CRM & RLS Asset Grants**:
  - Customer lifetime value (LTV) calculation, order history, and VIP tagging.
  - Manual grant/revocation of confidential research assets with download expiration limits.

---

### Section 6: Internal Office Suite & Document Center
- **Word Processor**:
  - WYSIWYG rich text formatting (bold, italic, underline, strike, headings H1-H3, bullet/numbered lists, blockquotes, tables).
  - Custom letterhead toggle, ISO 17025 certification headers, page margins, orientation (Portrait/Landscape), and watermark overlay.
  - Digital signature blocks with cryptographic SHA-256 hash stamp.
  - 1-Click PDF compilation and browser print dialog.
- **Spreadsheet Engine**:
  - Multi-sheet tab navigation with row/column insertion and deletion.
  - Formula computation: \`=SUM()\`, \`=AVERAGE()\`, \`=MIN()\`, \`=MAX()\`, \`=PRODUCT()\`.
  - Cell formatting: Currency ($), Percentage (%), Decimal precision, bold, color coding.
  - CSV Import / Export and Excel workbook compatibility.
- **Slide Deck Presentation Builder**:
  - Executive slide templates with customizable color themes (Navy, Emerald, Charcoal, Royal Indigo).
  - Slide layouts: Title Hero, Two-Column Feature, High-Impact Metric, Matrix Comparison.
  - Presentation mode and PDF slide deck export.
- **Luxury Business Card Designer**:
  - Dual-sided US Standard (3.5" x 2") and European (85mm x 55mm) formats.
  - Metallic gold foil finish simulation, rounded corner preview, and live vCard QR codes.
- **Universal File Converter**:
  - Bidirectional conversion between PDF, CSV, JSON, Markdown, Word DOCX, and Plain Text.

---

### Section 7: Lab Storage & Row-Level Security (RLS) File Manager
- **Storage Buckets**:
  - \`lab-certificates\` (COAs, Mass Spec graphs, HPLC chromatograms)
  - \`compound-media\` (Vial renders, 3D molecular structures, photography)
  - \`research-documents\` (Material Safety Data Sheets, Reconstitution SOPs)
  - \`office-files\` (Spreadsheets, slide decks, invoices, purchase orders)
  - \`system-backups\` (Database dumps, configuration archives)
- **4-Tier RLS Access Control**:
  - **Public**: Anonymous CDN delivery.
  - **Authenticated**: Registered users only.
  - **Role-Restricted**: Specific RBAC roles (Owner, Admin, Employee).
  - **Private Admin**: Root Owner & Executive accounts only.
- **Expiring Signed URLs**: Cryptographically generated URLs with configurable TTL (1 hour to 30 days).
- **Dynamic Watermarking**: Embeds user email, timestamp, and confidentiality notices on downloaded assets.
- **Forensic Access Logs**: IP address, user agent, action (view, download, policy update), and allow/deny status recording.

---

### Section 8: SecOps, Visual Timeline & Audit Trail
- **Visual Chronological Timeline**: Milestones grouped by date with status tags and payload previews.
- **High-Density Table View**: Search and filter by User Email, RBAC Role, Event Category, and Date Range.
- **Compliance Dossier Export**: SOC2 / GxP compliance markdown dossiers, raw JSON transaction ledgers, and CSV logs.
- **Quick-Action Emergency Controls**: Instant deployment of "Emergency Lockout" and "WAF Aggressive Mode".

---

### Section 9: Real-Time Fleet OTA Updates & Dynamic Manual Engine
- **WebSocket Fleet Synchronization**: Broadcast live UI and data hot-patches to connected iOS, Android, and Web clients.
- **SHA-256 Checksum Validation**: Ensures cryptographic integrity before applying mobile application updates.
- **Dynamic Manual Recompilation**: User guides and SOP documentation automatically update to reflect live database schemas and configuration parameters.
`;

export const SALES_FLYER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BKR Enterprise Platform — Commercial Sales Flyer</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #030712; color: #f3f4f6; line-height: 1.5; padding: 30px; }
    .flyer-container { max-width: 1000px; margin: 0 auto; background: linear-gradient(135deg, #0b0f19 0%, #030712 100%); border: 1px solid #1f2937; border-radius: 24px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
    .header-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 14px; border-radius: 9999px; margin-bottom: 20px; }
    .hero-title { font-size: 38px; font-weight: 900; line-height: 1.15; color: #ffffff; margin-bottom: 12px; }
    .hero-title span { background: linear-gradient(90deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-subtitle { font-size: 16px; color: #9ca3af; margin-bottom: 30px; max-width: 800px; }
    
    .metrics-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 35px; }
    .metric-card { background: rgba(17, 24, 39, 0.7); border: 1px solid #374151; border-radius: 14px; padding: 18px; text-align: center; }
    .metric-val { font-size: 26px; font-weight: 900; color: #10b981; }
    .metric-label { font-size: 12px; color: #9ca3af; text-transform: uppercase; font-weight: 700; margin-top: 4px; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 35px; }
    .feature-card { background: rgba(17, 24, 39, 0.6); border: 1px solid #1f2937; border-radius: 16px; padding: 24px; }
    .feature-card h3 { font-size: 18px; font-weight: 800; color: #f9fafb; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
    .feature-card p { font-size: 13.5px; color: #9ca3af; margin-bottom: 14px; }
    .feature-list { list-style: none; }
    .feature-list li { font-size: 12.5px; color: #d1d5db; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
    .feature-list li::before { content: "✓"; color: #10b981; font-weight: bold; }
    
    .banner-highlight { background: linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; padding: 24px; margin-bottom: 35px; }
    .banner-highlight h4 { font-size: 16px; font-weight: 800; color: #34d399; margin-bottom: 8px; }
    .banner-highlight p { font-size: 13px; color: #d1d5db; }
    
    .footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #1f2937; padding-top: 24px; margin-top: 20px; font-size: 12px; color: #6b7280; }
    .cta-btn { background: #10b981; color: #030712; font-weight: 800; font-size: 13px; padding: 10px 22px; border-radius: 10px; text-decoration: none; display: inline-block; }
    
    @media (max-width: 768px) {
      .metrics-bar { grid-template-columns: 1fr 1fr; }
      .grid-2 { grid-template-columns: 1fr; }
      .hero-title { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="flyer-container">
    <div class="header-badge">★ Enterprise Scientific E-Commerce & Lab OS</div>
    <h1 class="hero-title">The Complete Operating System for <span>Biotech & Chemical Commerce</span></h1>
    <p class="hero-subtitle">
      Engineered specifically for life sciences research, peptide synthesis facilities, and chemical reference suppliers. Seamlessly unifying high-conversion e-commerce with ISO 17025 compliant documentation, GHS label printing, and cryptographic verification.
    </p>

    <!-- Key Metrics -->
    <div class="metrics-bar">
      <div class="metric-card">
        <div class="metric-val">99.8%+</div>
        <div class="metric-label">HPLC Purity Verification</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">6+</div>
        <div class="metric-label">Payment Gateways</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">4-Tier</div>
        <div class="metric-label">Row-Level Security (RLS)</div>
      </div>
      <div class="metric-card">
        <div class="metric-val">&lt;50ms</div>
        <div class="metric-label">Real-Time Fleet OTA Sync</div>
      </div>
    </div>

    <!-- Feature Grid -->
    <div class="grid-2">
      <div class="feature-card">
        <h3>🔬 Scientific Research Catalog</h3>
        <p>Built-in chemical parameters, CAS registries, and interactive calculators.</p>
        <ul class="feature-list">
          <li>CAS Number, Molecular Mass & Peptide Sequence specs</li>
          <li>Live HPLC Area % Chromatograms & Mass Spec verification</li>
          <li>Reconstitution & Syringe Dosage Calculator (mcg/IU)</li>
          <li>Safety Data Sheet (SDS) & Batch COA PDF attachments</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>💳 Multi-Gateway Financial Routing</h3>
        <p>Accept cards, bank wires, and cryptocurrency with instant digital asset delivery.</p>
        <ul class="feature-list">
          <li>Authorize.Net & Stripe Credit/Debit card processing</li>
          <li>Web3 Crypto: Bitcoin (BTC), Ethereum (ETH), Tether (USDT)</li>
          <li>Bank Wire SWIFT/IBAN & Apple Pay biometric checkout</li>
          <li>Multi-currency auto conversion (USD, EUR, GBP, CAD, JPY)</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>🏷️ Chemical Bottle Label Designer</h3>
        <p>GHS-compliant thermal label generator with 2D DataMatrix and QR deep-links.</p>
        <ul class="feature-list">
          <li>GHS Hazard Pictograms (Toxic, Flammable, Corrosive, etc.)</li>
          <li>2D DataMatrix & QR verification codes linking to live COAs</li>
          <li>Direct output to thermal roll printers (ZPL/PDF)</li>
          <li>Batch lot numbers, expiration dates & cryo storage tags</li>
        </ul>
      </div>

      <div class="feature-card">
        <h3>📑 Internal Office & Lab File Manager</h3>
        <p>Full-featured word processor, spreadsheet engine, slide decks, and RLS vault.</p>
        <ul class="feature-list">
          <li>Word Processor with custom letterheads & signature blocks</li>
          <li>Multi-sheet Excel-compatible calculation engine with formulas</li>
          <li>Lab Storage Explorer with 4-tier Row-Level Security (RLS)</li>
          <li>Expiring signed download URLs (1hr to 30d) & dynamic watermarks</li>
        </ul>
      </div>
    </div>

    <!-- Highlight Banner -->
    <div class="banner-highlight">
      <h4>⚡ Real-Time Fleet OTA Hot-Patching & Dynamic Manual Engine</h4>
      <p>
        Modify layouts, theme colors, container spacing, and product parameters in the Admin Panel and watch connected iOS, Android, and Web client apps update instantaneously across your entire enterprise without app-store redeployment cycles. All user manuals and SOP PDFs re-compile dynamically with live system parameters.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>
        <strong>BK Research Labs Enterprise Platform v2.5</strong><br>
        <span>Compliance: ISO/IEC 17025 • cGMP 21 CFR Part 111 • SOC2 / GxP Auditable</span>
      </div>
      <div>
        <a href="#demo" class="cta-btn">Access Live Platform</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
