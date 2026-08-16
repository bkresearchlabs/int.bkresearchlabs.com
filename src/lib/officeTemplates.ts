import { OfficeDocument, OfficeTemplate } from '../types/office';

export const DEFAULT_OFFICE_DOCUMENTS: OfficeDocument[] = [
  {
    id: 'doc-sales-executive-overview',
    title: 'BKR Enterprise Platform - Sales Executive Overview & Commercial Value Matrix',
    type: 'document',
    category: 'marketing',
    status: 'approved',
    version: '2.5',
    author: 'BK Research Labs Commercial Team',
    authorEmail: 'bkresearchlabs@gmail.com',
    tags: ['Sales', 'Executive Summary', 'Commercial', 'Capabilities', 'Platform'],
    isFavorite: true,
    createdAt: '2026-08-15T12:00:00Z',
    updatedAt: '2026-08-16T08:00:00Z',
    docContent: {
      pageSize: 'letter',
      orientation: 'portrait',
      margins: 'normal',
      showLetterhead: true,
      showPageNumbers: true,
      isoStandardCode: 'ISO/IEC 17025:2017 & cGMP 21 CFR Part 111 Compliance',
      watermarkText: 'ENTERPRISE PLATFORM OVERVIEW',
      headerTitle: 'BK RESEARCH LABS — EXECUTIVE COMMERCIAL SALES OVERVIEW',
      footerNote: 'Confidential commercial documentation prepared for enterprise partners and biotechnology commerce operators.',
      signatureBlock: {
        signerName: 'Commercial Operations Board',
        signerTitle: 'Director of Strategic Enterprise Solutions',
        date: 'August 16, 2026',
        digitalHash: 'SHA256: e8c4a9b2d1f03e5a7c8b9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f01',
        includeStamp: true
      },
      htmlContent: `
<h2>1. Executive Summary & Market Positioning</h2>
<p>The <strong>BKR Enterprise Platform</strong> is the industry's premier all-in-one digital operating system and commerce engine purpose-built for biotechnology research laboratories, peptide synthesis facilities, and specialized scientific suppliers.</p>

<h2>2. Who It Is For (Target Segments)</h2>
<ul>
  <li><strong>Life Science Research Laboratories:</strong> Acquire verified compounds with instant batch HPLC chromatograms.</li>
  <li><strong>Chemical Synthesizers & Manufacturers:</strong> End-to-end cataloging, thermal label serialization, and supplier PO lifecycle.</li>
  <li><strong>Compounding Pharmacies & Analytical Testing Labs:</strong> Multi-currency checkout, dynamic diluent calculators, and cryptographic COA verification.</li>
</ul>

<h2>3. Extreme Customizability & Design Flexibility</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Customization Module</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Operational Control</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Real-Time Capability</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Visual Spacing & Themes</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Container padding (8px-48px), card radius (0px-24px), 5 palette themes</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">Instant Hot-Reload</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Bottle Label Designer</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">CAS, GHS Pictograms, 2D DataMatrix/QR codes, batch serials</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">ZPL & PDF Export</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Payment Gateways</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Authorize.Net, Stripe, PayPal, Web3 Crypto (BTC/ETH/USDT), Bank Wire</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">Live / Test Switches</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Fleet OTA Synchronization</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">WebSocket live updates for iOS, Android, and Web clients</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">Zero App-Store Delay</td>
    </tr>
  </tbody>
</table>
`
    }
  },
  {
    id: 'doc-master-feature-spec-sheet',
    title: 'BKR Platform Master Technical & Functional Specification Sheet (v2.5)',
    type: 'document',
    category: 'scientific',
    status: 'approved',
    version: '2.5',
    author: 'Principal Software Architect',
    authorEmail: 'bkresearchlabs@gmail.com',
    tags: ['Spec Sheet', 'Technical Specs', 'Architecture', 'SOC2', 'GxP', 'ISO 17025'],
    isFavorite: true,
    createdAt: '2026-08-15T14:00:00Z',
    updatedAt: '2026-08-16T08:30:00Z',
    docContent: {
      pageSize: 'letter',
      orientation: 'portrait',
      margins: 'normal',
      showLetterhead: true,
      showPageNumbers: true,
      isoStandardCode: 'ISO/IEC 17025:2017 & cGMP 21 CFR Part 111 Master Spec',
      watermarkText: 'TECHNICAL SPECIFICATION SHEET',
      headerTitle: 'BK RESEARCH LABS — MASTER PLATFORM SPECIFICATION SHEET',
      footerNote: 'Exhaustive system matrix detailing frontend, backend, security, and office integration architecture.',
      signatureBlock: {
        signerName: 'Platform Architecture Review Board',
        signerTitle: 'Lead Enterprise Systems Architect',
        date: 'August 16, 2026',
        digitalHash: 'SHA256: 3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0123456789abcdef0123456789abcd',
        includeStamp: true
      },
      htmlContent: `
<h2>1. Architectural Architecture & Core Components</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Layer</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Implementation Technology</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Key Capabilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Frontend Core</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">React 18 + TypeScript + Tailwind CSS</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Dynamic micro-spacing, Motion transitions, i18n localization</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Persistence & Sync</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">LocalStorage Cache + Supabase PostgreSQL</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Row-Level Security (RLS), JSON/CSV backups, automated DDL generation</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Security & Auditing</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">SOC2 / GxP Transaction Ledger</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Visual timeline, emergency lockdown controls, TOTP 2FA, Passkeys</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Document Engine</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Internal Office Suite + jsPDF + Canvas</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">WYSIWYG Word, Excel formulas, slide decks, luxury gold foil business cards</td>
    </tr>
  </tbody>
</table>
`
    }
  },
  {
    id: 'doc-coa-template-01',
    title: 'Certificate of Analysis (COA) - BPC-157 5mg Lot #BK-8842',
    type: 'document',
    category: 'coa',
    status: 'approved',
    version: '1.4',
    author: 'Dr. Elena Rostova, Lead Analytical Chemist',
    authorEmail: 'e.rostova@bkresearchlabs.com',
    tags: ['COA', 'HPLC Purity', 'Mass Spec', 'BPC-157', 'Quality Control'],
    isFavorite: true,
    linkedProductId: 'prod-bpc157',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-14T09:15:00Z',
    docContent: {
      pageSize: 'letter',
      orientation: 'portrait',
      margins: 'normal',
      showLetterhead: true,
      showPageNumbers: true,
      isoStandardCode: 'ISO/IEC 17025:2017 & cGMP 21 CFR Part 111',
      watermarkText: 'VERIFIED LABORATORY GRADE',
      headerTitle: 'OFFICIAL CERTIFICATE OF ANALYSIS — BK RESEARCH LABS',
      footerNote: 'Strictly for in-vitro analytical research and scientific synthesis investigation only. Not for human or veterinary administration.',
      signatureBlock: {
        signerName: 'Dr. Elena Rostova, Ph.D.',
        signerTitle: 'Director of Analytical Chemistry & QA',
        date: 'August 14, 2026',
        digitalHash: 'SHA256: 7f8a9e4b1c2d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
        includeStamp: true
      },
      htmlContent: `
<h2>1. Compound & Lot Identification</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Parameter</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Specification</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Observed Result</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Testing Method</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Product Name</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BPC-157 Acetate Pentadecapeptide</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BPC-157 Lyophilized Solid</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">In-house Standard</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Lot Number</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BK-8842-AUG26</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BK-8842-AUG26</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">LIMS Lot Tracker</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>CAS Number</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">137525-51-0</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">137525-51-0 (Conforms)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Chemical Registry</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Molecular Formula</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">C62 H98 N16 O22</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">1419.55 g/mol</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Theoretical Calc</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Physical Appearance</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">White to off-white lyophilized powder</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Ultra-pure white cake</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Visual Inspection</td>
    </tr>
  </tbody>
</table>

<h2>2. Quantitative Purity & Mass Spectrometry</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Test Assay</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Acceptance Limit</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Analytical Result</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>HPLC Chromatographic Purity</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&ge; 99.00% Area</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">99.48% (Area %)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>ESI-MS Identity (m/z)</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">1419.5 &plusmn; 1.0 Da</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">[M+H]+ = 1420.3 Da</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Moisture Content (Karl Fischer)</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&le; 5.0% w/w</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">1.84% w/w</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Peptide Content (N content)</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&ge; 80.0%</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">86.2%</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Heavy Metals (ICP-MS)</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&le; 10 ppm total (Pb, As, Cd, Hg)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&lt; 0.4 ppm</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Bacterial Endotoxins (LAL Test)</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&le; 5.0 EU/mg</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&lt; 0.05 EU/mg</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
  </tbody>
</table>

<h2>3. Analytical Instrument Calibration & Parameters</h2>
<p>Chromatographic testing performed on an Agilent 1290 Infinity II UHPLC coupled with DAD detector at 214nm / 280nm and Phenomenex Aeris C18 (150mm x 2.1mm, 1.7&micro;m) reverse-phase column. Solvent A: 0.1% TFA in Optima LC-MS Grade Water; Solvent B: 0.1% TFA in Acetonitrile. Gradient elution over 30 minutes at flow rate 0.35 mL/min with column temperature held constant at 40.0&deg;C.</p>

<div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 12px; margin-top: 15px;">
  <strong>QA Reviewer Note:</strong> This lot meets or exceeds all chemical purity, peptide content, and microbiological endotoxin requirements established under BK Research Labs master batch specification BK-SPEC-2026.
</div>
      `
    }
  },
  {
    id: 'doc-sop-042',
    title: 'Standard Operating Procedure (SOP-042): Cryogenic Lyophilization',
    type: 'document',
    category: 'sop',
    status: 'approved',
    version: '2.1',
    author: 'Marcus Vance, Lead Process Engineer',
    authorEmail: 'm.vance@bkresearchlabs.com',
    tags: ['SOP', 'Cleanroom', 'Lyophilization', 'Compliance', 'Cryo'],
    isFavorite: false,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-12T16:20:00Z',
    docContent: {
      pageSize: 'letter',
      orientation: 'portrait',
      margins: 'normal',
      showLetterhead: true,
      showPageNumbers: true,
      isoStandardCode: 'ISO 14644-1 Class 5 Cleanroom Standard',
      headerTitle: 'STANDARD OPERATING PROCEDURE — SOP-042',
      footerNote: 'Proprietary BKR Labs Operating Protocol. Unauthorized reproduction or dissemination strictly prohibited.',
      signatureBlock: {
        signerName: 'Marcus Vance, M.S. ChemE',
        signerTitle: 'Head of Chemical Process Engineering',
        date: 'August 12, 2026',
        digitalHash: 'SHA256: c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f012345678',
        includeStamp: true
      },
      htmlContent: `
<h2>1. Purpose & Scope</h2>
<p>This Standard Operating Procedure establishes the mandatory protocols for the freeze-drying (cryogenic lyophilization), vial hermetic sealing, and nitrogen backfilling of analytical research peptide compounds in ISO Class 5 laminar flow cleanroom workstations.</p>

<h2>2. Required Personal Protective Equipment (PPE)</h2>
<ul>
  <li>Sterile particulate-free Tyvek cleanroom coverall (Level 3).</li>
  <li>Nitrile cleanroom gloves (double gloving required).</li>
  <li>Full-face PAPR respirator with HEPA particulate filtration.</li>
  <li>Conductive anti-static cleanroom boots with grounded heel straps.</li>
</ul>

<h2>3. Step-by-Step Lyophilization Procedure</h2>
<ol>
  <li><strong>Pre-Cooling Phase:</strong> Power on the VirTis Genesis 25XL Freeze Dryer. Lower shelf temperature to -45.0&deg;C (&plusmn; 1.0&deg;C) for a minimum equilibration period of 120 minutes.</li>
  <li><strong>Solution Loading:</strong> Aliquot sterile-filtered compound solution (0.22&micro;m PES membrane) into borosilicate glass vials using calibrated multi-channel pipettes. Seat butyl stoppers in the semi-open notched position.</li>
  <li><strong>Primary Drying Sublimation:</strong> Initiate chamber vacuum pull down to &le; 50 mTorr. Step shelf temperature from -40&deg;C to -10&deg;C at 0.5&deg;C/min. Maintain for 24 to 36 hours until product thermocouple reads equal to shelf temperature.</li>
  <li><strong>Secondary Drying Desorption:</strong> Ramp shelf temperature to +25.0&deg;C under high vacuum (&le; 20 mTorr) for 8 hours to strip residual bound crystal moisture.</li>
  <li><strong>Inert Gas Backfill & Stoppering:</strong> Bleed ultra-high-purity (99.999%) sterile liquid nitrogen boil-off vapor into chamber until reaching 700 mbar. Actuate hydraulic rams to seat stoppers firmly. Apply tamper-evident aluminum flip-off crimp seals.</li>
</ol>
      `
    }
  },
  {
    id: 'sheet-inventory-calc-01',
    title: 'Compound Inventory Valuation & Reorder Matrix 2026',
    type: 'spreadsheet',
    category: 'inventory',
    status: 'approved',
    version: '3.0',
    author: 'Operations & Logistics Department',
    tags: ['Inventory', 'Valuation', 'Reorder Alerts', 'Lead Time', 'Costing'],
    isFavorite: true,
    createdAt: '2026-08-05T11:00:00Z',
    updatedAt: '2026-08-15T18:00:00Z',
    spreadsheetContent: {
      activeSheetIndex: 0,
      sheets: [
        {
          id: 'sheet-inv-1',
          name: 'Master Inventory Valuation',
          rowCount: 20,
          colCount: 10,
          columnWidths: { A: 180, B: 100, C: 110, D: 100, E: 120, F: 120, G: 120, H: 120 },
          selectedChartType: 'bar',
          chartConfig: {
            title: 'Compound Inventory Value ($ USD)',
            labelColumn: 'A',
            valueColumn: 'F',
            startRow: 2,
            endRow: 7
          },
          cells: {
            'A1': { value: 'Compound Name', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'left' },
            'B1': { value: 'SKU Code', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'center' },
            'C1': { value: 'Units in Stock', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'right' },
            'D1': { value: 'Unit Cost ($)', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'right' },
            'E1': { value: 'Retail Price ($)', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'right' },
            'F1': { value: 'Total Cost Val', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'right' },
            'G1': { value: 'Total Retail Val', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'right' },
            'H1': { value: 'Est. Gross Margin', bold: true, bg: '#0f172a', textColor: '#ffffff', align: 'right' },

            'A2': { value: 'BPC-157 5mg Vial' },
            'B2': { value: 'BPC-5MG', align: 'center' },
            'C2': { value: '450', format: 'number', align: 'right' },
            'D2': { value: '14.50', format: 'currency', align: 'right' },
            'E2': { value: '54.99', format: 'currency', align: 'right' },
            'F2': { value: '=C2*D2', format: 'currency', align: 'right', bold: true },
            'G2': { value: '=C2*E2', format: 'currency', align: 'right' },
            'H2': { value: '=(G2-F2)/G2', format: 'percent', align: 'right', textColor: '#059669', bold: true },

            'A3': { value: 'TB-500 5mg Lyophilized' },
            'B3': { value: 'TB-5MG', align: 'center' },
            'C3': { value: '280', format: 'number', align: 'right' },
            'D3': { value: '16.20', format: 'currency', align: 'right' },
            'E3': { value: '59.99', format: 'currency', align: 'right' },
            'F3': { value: '=C3*D3', format: 'currency', align: 'right', bold: true },
            'G3': { value: '=C3*E3', format: 'currency', align: 'right' },
            'H3': { value: '=(G3-F3)/G3', format: 'percent', align: 'right', textColor: '#059669', bold: true },

            'A4': { value: 'Semaglutide 5mg Pure' },
            'B4': { value: 'SEMA-5MG', align: 'center' },
            'C4': { value: '190', format: 'number', align: 'right' },
            'D4': { value: '28.00', format: 'currency', align: 'right' },
            'E4': { value: '98.50', format: 'currency', align: 'right' },
            'F4': { value: '=C4*D4', format: 'currency', align: 'right', bold: true },
            'G4': { value: '=C4*E4', format: 'currency', align: 'right' },
            'H4': { value: '=(G4-F4)/G4', format: 'percent', align: 'right', textColor: '#059669', bold: true },

            'A5': { value: 'Tirzepatide 10mg Cake' },
            'B5': { value: 'TIRZ-10MG', align: 'center' },
            'C5': { value: '125', format: 'number', align: 'right' },
            'D5': { value: '42.00', format: 'currency', align: 'right' },
            'E5': { value: '145.00', format: 'currency', align: 'right' },
            'F5': { value: '=C5*D5', format: 'currency', align: 'right', bold: true },
            'G5': { value: '=C5*E5', format: 'currency', align: 'right' },
            'H5': { value: '=(G5-F5)/G5', format: 'percent', align: 'right', textColor: '#059669', bold: true },

            'A6': { value: 'NAD+ 500mg Solution' },
            'B6': { value: 'NAD-500MG', align: 'center' },
            'C6': { value: '310', format: 'number', align: 'right' },
            'D6': { value: '18.50', format: 'currency', align: 'right' },
            'E6': { value: '68.00', format: 'currency', align: 'right' },
            'F6': { value: '=C6*D6', format: 'currency', align: 'right', bold: true },
            'G6': { value: '=C6*E6', format: 'currency', align: 'right' },
            'H6': { value: '=(G6-F6)/G6', format: 'percent', align: 'right', textColor: '#059669', bold: true },

            'A7': { value: 'CJC-1295 + Ipamorelin' },
            'B7': { value: 'CJC-IPA-10', align: 'center' },
            'C7': { value: '220', format: 'number', align: 'right' },
            'D7': { value: '22.00', format: 'currency', align: 'right' },
            'E7': { value: '79.99', format: 'currency', align: 'right' },
            'F7': { value: '=C7*D7', format: 'currency', align: 'right', bold: true },
            'G7': { value: '=C7*E7', format: 'currency', align: 'right' },
            'H7': { value: '=(G7-F7)/G7', format: 'percent', align: 'right', textColor: '#059669', bold: true },

            'A8': { value: 'TOTALS & AVERAGES', bold: true, bg: '#f1f5f9', align: 'left' },
            'B8': { value: '6 SKUs', bold: true, bg: '#f1f5f9', align: 'center' },
            'C8': { value: '=SUM(C2:C7)', format: 'number', bold: true, bg: '#f1f5f9', align: 'right' },
            'D8': { value: '=AVG(D2:D7)', format: 'currency', bold: true, bg: '#f1f5f9', align: 'right' },
            'E8': { value: '=AVG(E2:E7)', format: 'currency', bold: true, bg: '#f1f5f9', align: 'right' },
            'F8': { value: '=SUM(F2:F7)', format: 'currency', bold: true, bg: '#f1f5f9', align: 'right', textColor: '#0284c7' },
            'G8': { value: '=SUM(G2:G7)', format: 'currency', bold: true, bg: '#f1f5f9', align: 'right', textColor: '#059669' },
            'H8': { value: '=AVG(H2:H7)', format: 'percent', bold: true, bg: '#f1f5f9', align: 'right', textColor: '#059669' },
          }
        },
        {
          id: 'sheet-inv-2',
          name: 'Restock Buffer & Lead Time',
          rowCount: 15,
          colCount: 6,
          columnWidths: { A: 180, B: 120, C: 120, D: 120, E: 120 },
          cells: {
            'A1': { value: 'Compound Name', bold: true, bg: '#1e293b', textColor: '#fff' },
            'B1': { value: 'Daily Run Rate', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
            'C1': { value: 'Lead Time (Days)', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
            'D1': { value: 'Safety Buffer', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
            'E1': { value: 'Reorder Trigger Point', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
            'A2': { value: 'BPC-157 5mg' },
            'B2': { value: '18', format: 'number', align: 'right' },
            'C2': { value: '14', format: 'number', align: 'right' },
            'D2': { value: '50', format: 'number', align: 'right' },
            'E2': { value: '=B2*C2+D2', format: 'number', align: 'right', bold: true, textColor: '#dc2626' },
            'A3': { value: 'TB-500 5mg' },
            'B3': { value: '12', format: 'number', align: 'right' },
            'C3': { value: '14', format: 'number', align: 'right' },
            'D3': { value: '40', format: 'number', align: 'right' },
            'E3': { value: '=B3*C3+D3', format: 'number', align: 'right', bold: true, textColor: '#dc2626' },
          }
        }
      ]
    }
  },
  {
    id: 'deck-lab-presentation-01',
    title: 'BKR Labs 2026 Analytical Quality & Compound Synthesis Portfolio',
    type: 'presentation',
    category: 'marketing',
    status: 'approved',
    version: '1.2',
    author: 'Executive Science Board',
    tags: ['Pitch Deck', 'Synthesis', 'Purity Standards', 'HPLC', 'Slide Deck'],
    isFavorite: true,
    createdAt: '2026-08-08T09:00:00Z',
    updatedAt: '2026-08-14T15:00:00Z',
    presentationContent: {
      theme: 'emerald',
      slides: [
        {
          id: 'slide-1',
          layout: 'title',
          badge: 'BK RESEARCH LABS ENTERPRISE',
          title: 'Precision Analytical Compounds & Quality Synthesis',
          subtitle: 'Setting the highest tier of purity, verification, and analytical rigor for scientific research.',
          bodyText: 'Presented by BK Research Labs Chemical Synthesis Group'
        },
        {
          id: 'slide-2',
          layout: 'metrics',
          badge: 'VERIFIED LABORATORY METRICS',
          title: 'Industrial Purity Benchmark & Quality Compliance',
          subtitle: 'Independent HPLC, LC-MS, and NMR validation on 100% of all synthetic lots.',
          metrics: [
            { label: 'Minimum Purity Standard', value: '99.4%', sub: 'Verified across every production batch' },
            { label: 'Synthesis Volume/Yr', value: '250,000+', sub: 'Vials compounded under ISO 5 cleanrooms' },
            { label: 'Endotoxin Assay', value: '< 0.05 EU', sub: 'LAL test passing international standards' },
            { label: 'On-Time Dispatch', value: '99.8%', sub: 'Cold-chain packaging with gel ice insulation' }
          ]
        },
        {
          id: 'slide-3',
          layout: 'cards',
          badge: 'CORE ADVANTAGES',
          title: 'Why Top Research Institutions Choose BKR Labs',
          subtitle: 'Architected for reliability, speed, and analytical reproducibility.',
          cards: [
            { title: 'Triple-Point Testing', desc: 'Every vial undergoes UHPLC purity quantification, ESI-MS molecular mass confirmation, and Karl Fischer moisture titrations.', stat: '3x Test' },
            { title: 'Cold-Chain Integrity', desc: 'Temperature-monitored vacuum insulated shipping ensures zero thermal degradation during transit.', stat: '-20°C Pack' },
            { title: 'Cryptographic COAs', desc: 'Every certificate is signed with a SHA-256 digital cryptographic hash verifiable on the blockchain or via instant QR scan.', stat: '100% Legit' }
          ]
        },
        {
          id: 'slide-4',
          layout: 'specs',
          badge: 'FLAGSHIP RESEARCH COMPOUNDS',
          title: 'High-Demand Chemical Portfolio & Stock Levels',
          subtitle: 'Available immediately for commercial institutions and accredited research groups.',
          specs: [
            { key: 'BPC-157 Acetate', value: '5mg & 10mg Lyophilized (Purity: 99.48%)' },
            { key: 'TB-500 Thymosin Beta-4', value: '5mg & 10mg Lyophilized (Purity: 99.32%)' },
            { key: 'Semaglutide Base', value: '5mg Analytical Grade (Purity: 99.65%)' },
            { key: 'Tirzepatide Dual Agonist', value: '10mg & 15mg Research Solid (Purity: 99.55%)' },
            { key: 'NAD+ Coenzyme Solution', value: '500mg & 1000mg Sterile Aqueous Buffer' }
          ]
        }
      ]
    }
  },
  {
    id: 'doc-card-exec-01',
    title: 'Executive Business Card - Dr. Michael Sterling',
    type: 'business_card',
    category: 'branding',
    status: 'approved',
    version: '1.0',
    author: 'Admin',
    authorEmail: 'bkresearchlabs@gmail.com',
    tags: ['Business Card', 'Executive', 'Gold Foil', 'vCard QR', 'Branding'],
    isFavorite: true,
    createdAt: '2026-08-12T10:00:00Z',
    updatedAt: '2026-08-15T18:30:00Z',
    businessCardContent: {
      size: 'us_standard',
      orientation: 'landscape',
      corner: 'rounded_md',
      finish: 'gold_foil',
      theme: 'obsidian_gold',
      fontFamily: 'sans',
      contact: {
        fullName: 'Dr. Michael Sterling',
        credentials: 'Ph.D., CSO',
        jobTitle: 'Chief Scientific Officer & Co-Founder',
        department: 'Peptide Synthesis & Analytical Chemistry',
        companyName: 'BK RESEARCH LABS',
        tagline: 'High-Purity Analytical Formulations & Synthesis',
        phone: '+1 (800) 555-0199',
        mobile: '+1 (415) 882-9104',
        email: 'm.sterling@bkresearchlabs.com',
        website: 'www.bkresearchlabs.com',
        address: '100 Research Parkway, Cambridge, MA 02142',
        licenseNumber: 'ISO/IEC 17025 Certified Facility #BKR-8842',
        socials: {
          linkedin: 'linkedin.com/in/bkresearchlabs',
          twitter: '@BKResearchLabs'
        }
      },
      qrConfig: {
        enabled: true,
        side: 'back',
        type: 'vcard',
        label: 'SCAN TO SAVE CONTACT VCARD',
        size: 92,
        fgColor: '#000000',
        bgColor: '#ffffff',
        includeFrame: true
      },
      front: {
        bgColor: '#090d16',
        bgPattern: 'hex',
        textColor: '#f8fafc',
        secondaryTextColor: '#94a3b8',
        accentColor: '#eab308',
        borderStyle: 'metallic_gold',
        showLogo: true,
        logoIcon: 'flask',
        logoSize: 28,
        showWatermark: true,
        watermarkText: 'BK RESEARCH',
        watermarkOpacity: 0.05,
        layoutStyle: 'standard_split'
      },
      back: {
        bgColor: '#020617',
        bgPattern: 'circuit',
        textColor: '#f8fafc',
        secondaryTextColor: '#94a3b8',
        accentColor: '#eab308',
        borderStyle: 'metallic_gold',
        showLogo: true,
        logoIcon: 'bkr_emblem',
        logoSize: 36,
        showWatermark: true,
        watermarkText: 'VERIFIED LABORATORY GRADE',
        watermarkOpacity: 0.06,
        layoutStyle: 'qr_hero'
      },
      notes: 'Official titanium obsidian & gold foil card for executive team.'
    }
  }
];

export const OFFICE_TEMPLATES: OfficeTemplate[] = [
  {
    id: 'tpl-coa',
    title: 'Certificate of Analysis (COA) Official Form',
    description: 'ISO/IEC 17025 compliant analytical certificate with HPLC purity table, mass spec results, and digital QA signature stamp.',
    type: 'document',
    category: 'coa',
    badge: 'Compliance Standard',
    iconName: 'ShieldCheck',
    previewSnippet: 'Includes quantitative HPLC, LC-MS, Karl Fischer moisture, and heavy metal assays.',
    documentData: {
      title: 'Certificate of Analysis - [Compound Name] Lot #[Lot-Number]',
      type: 'document',
      category: 'coa',
      status: 'draft',
      version: '1.0',
      tags: ['COA', 'Quality Control', 'Laboratory'],
      docContent: {
        pageSize: 'letter',
        orientation: 'portrait',
        margins: 'normal',
        showLetterhead: true,
        showPageNumbers: true,
        isoStandardCode: 'ISO/IEC 17025:2017 & cGMP 21 CFR Part 111',
        watermarkText: 'LABORATORY SPECIFICATION',
        headerTitle: 'OFFICIAL CERTIFICATE OF ANALYSIS — BK RESEARCH LABS',
        footerNote: 'Strictly for in-vitro analytical research and scientific synthesis investigation only.',
        signatureBlock: {
          signerName: 'Lead Analytical Chemist, Ph.D.',
          signerTitle: 'Director of Analytical Chemistry & QA',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          digitalHash: 'SHA256: GENERATED_UPON_APPROVAL',
          includeStamp: true
        },
        htmlContent: `
<h2>1. Compound Identification</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Parameter</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Specification</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Observed Result</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Test Method</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Product Name</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">[Insert Compound Name]</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Conforms to Reference Standard</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Internal Standard</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>Lot / Batch Number</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BK-LOT-[YYYYMM]</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BK-LOT-[YYYYMM]</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">LIMS Registry</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>CAS Registry Number</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">[CAS-XX-XX-X]</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Conforms</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">CAS Verification</td>
    </tr>
  </tbody>
</table>

<h2>2. Quantitative Purity & Assay</h2>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Test Assay</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Specification</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Observed Result</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>HPLC Chromatographic Purity</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">&ge; 99.00%</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">99.50%</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>ESI-MS Mass Identity</strong></td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Conforms to exact mass</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">Mass Conforms</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; color: #059669; font-weight: bold;">PASSED</td>
    </tr>
  </tbody>
</table>
        `
      }
    }
  },
  {
    id: 'tpl-invoice',
    title: 'Commercial Laboratory Invoice & Packing Slip',
    description: 'Itemized invoice for institutional orders with compound breakdown, PO reference, tax calculation, and payment wiring terms.',
    type: 'document',
    category: 'invoice',
    badge: 'Financial & Billing',
    iconName: 'Receipt',
    previewSnippet: 'Calculated subtotals, tax rate, shipping rates, and payment methods.',
    documentData: {
      title: 'Commercial Laboratory Invoice #INV-2026-001',
      type: 'document',
      category: 'invoice',
      status: 'draft',
      version: '1.0',
      tags: ['Invoice', 'Billing', 'Orders', 'Accounting'],
      docContent: {
        pageSize: 'letter',
        orientation: 'portrait',
        margins: 'normal',
        showLetterhead: true,
        showPageNumbers: true,
        headerTitle: 'COMMERCIAL LABORATORY INVOICE — BK RESEARCH LABS',
        footerNote: 'Thank you for your business. Remittance terms: Net 30 days.',
        signatureBlock: {
          signerName: 'Accounting & Billing Department',
          signerTitle: 'Finance Controller',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          digitalHash: 'VERIFIED_FINANCE_RECORD',
          includeStamp: true
        },
        htmlContent: `
<table style="width: 100%; margin-bottom: 20px;">
  <tr>
    <td style="width: 50%; vertical-align: top;">
      <strong>BILLED TO:</strong><br>
      Academic Research Institute / Lab Account<br>
      Attn: Procurement Department<br>
      100 University Boulevard, Suite 400<br>
      Cambridge, MA 02138
    </td>
    <td style="width: 50%; vertical-align: top; text-align: right;">
      <strong>INVOICE NO:</strong> INV-2026-8891<br>
      <strong>DATE:</strong> ${new Date().toLocaleDateString()}<br>
      <strong>PAYMENT TERMS:</strong> Net 30<br>
      <strong>DUE DATE:</strong> 30 Days from issue
    </td>
  </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr style="background-color: #f1f5f9; text-align: left;">
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Item SKU</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1;">Description</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">Qty</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">Unit Price</th>
      <th style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">Total Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BPC-5MG</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">BPC-157 5mg Analytical Lyophilized Solid (Lot #BK-8842)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">10</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">$54.99</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">$549.90</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">TB-5MG</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">TB-500 5mg Lyophilized Pentadecapeptide</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">5</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">$59.99</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">$299.95</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">SHIP-COLD</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">FedEx Priority Overnight (Insulated Cold-Chain Gel Pack)</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">1</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">$25.00</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">$25.00</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4" style="padding: 8px; text-align: right; font-weight: bold;">Subtotal:</td>
      <td style="padding: 8px; text-align: right; font-weight: bold;">$874.85</td>
    </tr>
    <tr>
      <td colspan="4" style="padding: 8px; text-align: right;">Estimated Sales Tax (0.0% Research Exempt):</td>
      <td style="padding: 8px; text-align: right;">$0.00</td>
    </tr>
    <tr style="background-color: #f8fafc;">
      <td colspan="4" style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px; color: #0284c7;">TOTAL DUE:</td>
      <td style="padding: 8px; text-align: right; font-weight: bold; font-size: 16px; color: #0284c7;">$874.85 USD</td>
    </tr>
  </tfoot>
</table>
        `
      }
    }
  },
  {
    id: 'tpl-sds',
    title: 'Safety Data Sheet (SDS / MSDS - GHS Standard)',
    description: '16-section standardized Global Harmonized System safety sheet covering toxicology, handling, firefighting, and spill procedures.',
    type: 'document',
    category: 'msds',
    badge: 'OSHA & GHS Standard',
    iconName: 'AlertTriangle',
    previewSnippet: 'Complete 16-section GHS chemical hazard protocol template.',
    documentData: {
      title: 'Safety Data Sheet (SDS) - [Compound Name]',
      type: 'document',
      category: 'msds',
      status: 'draft',
      version: '1.0',
      tags: ['SDS', 'MSDS', 'Safety', 'GHS', 'Hazmat'],
      docContent: {
        pageSize: 'letter',
        orientation: 'portrait',
        margins: 'normal',
        showLetterhead: true,
        showPageNumbers: true,
        headerTitle: 'SAFETY DATA SHEET (SDS) — GHS COMPLIANT',
        footerNote: 'According to OSHA HazCom Standard 29 CFR 1910.1200 and Regulation (EC) No 1907/2006 (REACH)',
        htmlContent: `
<h2>SECTION 1: Identification of the Substance and Company</h2>
<p><strong>Product Name:</strong> Research Analytical Peptide Solid<br>
<strong>Recommended Use:</strong> Laboratory chemical for research and development synthesis.<br>
<strong>Emergency Contact:</strong> Chemtrec 24/7 Hotline: +1 (800) 424-9300</p>

<h2>SECTION 2: Hazards Identification</h2>
<p><strong>GHS Classification:</strong> Not a hazardous substance or mixture according to Regulation (EC) No. 1272/2008 or OSHA 29 CFR 1910.1200.<br>
<strong>Caution:</strong> The toxicological properties of this synthesized compound have not been fully investigated. Handle with standard Good Laboratory Practices (GLP).</p>

<h2>SECTION 4: First Aid Measures</h2>
<ul>
  <li><strong>Inhalation:</strong> Move person to fresh air. If breathing is difficult, administer oxygen and seek medical attention.</li>
  <li><strong>Skin Contact:</strong> Wash thoroughly with soap and copious quantities of water for at least 15 minutes.</li>
  <li><strong>Eye Contact:</strong> Flush eyes with sterile saline or eye-wash fountain for 15 minutes.</li>
  <li><strong>Ingestion:</strong> Never give anything by mouth to an unconscious person. Rinse mouth thoroughly with water.</li>
</ul>

<h2>SECTION 7: Handling and Storage</h2>
<p><strong>Handling:</strong> Avoid dust formation and aerosol inhalation. Provide adequate local exhaust ventilation.<br>
<strong>Storage:</strong> Store tightly sealed in a cool, dry freezer at -20.0&deg;C. Protect from direct ultraviolet light exposure and moisture.</p>
        `
      }
    }
  },
  {
    id: 'tpl-compounding-sheet',
    title: 'Batch Compounding & Yield Calculation Sheet',
    type: 'spreadsheet',
    category: 'scientific',
    badge: 'Lab Calculations',
    iconName: 'Calculator',
    description: 'Spreadsheet formula matrix calculating theoretical peptide yields, solvent titration ratios, and packaging loss percentages.',
    previewSnippet: 'Auto-calculates input mass vs. final recovered lyophilized cake weight.',
    documentData: {
      title: 'Batch Compounding & Yield Calculator',
      type: 'spreadsheet',
      category: 'scientific',
      status: 'draft',
      version: '1.0',
      tags: ['Compounding', 'Yield', 'Lab Calculations', 'Chemistry'],
      spreadsheetContent: {
        activeSheetIndex: 0,
        sheets: [
          {
            id: 'sheet-comp-1',
            name: 'Batch Yields',
            rowCount: 15,
            colCount: 8,
            columnWidths: { A: 160, B: 120, C: 120, D: 120, E: 120, F: 120 },
            selectedChartType: 'bar',
            chartConfig: {
              title: 'Batch Recovered Yield (%)',
              labelColumn: 'A',
              valueColumn: 'E',
              startRow: 2,
              endRow: 5
            },
            cells: {
              'A1': { value: 'Batch Code', bold: true, bg: '#1e293b', textColor: '#fff' },
              'B1': { value: 'Input Reagent (g)', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
              'C1': { value: 'Theory Mass (g)', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
              'D1': { value: 'Recovered Mass (g)', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },
              'E1': { value: 'Net Yield (%)', bold: true, bg: '#1e293b', textColor: '#fff', align: 'right' },

              'A2': { value: 'Batch BK-8840' },
              'B2': { value: '25.0', format: 'number', align: 'right' },
              'C2': { value: '22.5', format: 'number', align: 'right' },
              'D2': { value: '21.2', format: 'number', align: 'right' },
              'E2': { value: '=D2/C2', format: 'percent', align: 'right', bold: true, textColor: '#059669' },

              'A3': { value: 'Batch BK-8841' },
              'B3': { value: '50.0', format: 'number', align: 'right' },
              'C3': { value: '45.0', format: 'number', align: 'right' },
              'D3': { value: '43.8', format: 'number', align: 'right' },
              'E3': { value: '=D3/C3', format: 'percent', align: 'right', bold: true, textColor: '#059669' },

              'A4': { value: 'Batch BK-8842' },
              'B4': { value: '100.0', format: 'number', align: 'right' },
              'C4': { value: '90.0', format: 'number', align: 'right' },
              'D4': { value: '88.2', format: 'number', align: 'right' },
              'E4': { value: '=D4/C4', format: 'percent', align: 'right', bold: true, textColor: '#059669' },

              'A5': { value: 'AVERAGE YIELD', bold: true, bg: '#f1f5f9' },
              'B5': { value: '=SUM(B2:B4)', format: 'number', bold: true, bg: '#f1f5f9', align: 'right' },
              'C5': { value: '=SUM(C2:C4)', format: 'number', bold: true, bg: '#f1f5f9', align: 'right' },
              'D5': { value: '=SUM(D2:D4)', format: 'number', bold: true, bg: '#f1f5f9', align: 'right' },
              'E5': { value: '=AVG(E2:E4)', format: 'percent', bold: true, bg: '#f1f5f9', align: 'right', textColor: '#0284c7' }
            }
          }
        ]
      }
    }
  },
  {
    id: 'tpl-pitch-deck',
    title: 'Executive Presentation & Product Launch Deck',
    type: 'presentation',
    category: 'marketing',
    badge: 'Slide Deck',
    iconName: 'Presentation',
    description: 'Multi-slide presentation template with title cards, KPI stat callouts, product spotlights, and speaker notes.',
    previewSnippet: 'Dark / Emerald responsive presentation with full-screen Presenter Mode.',
    documentData: {
      title: 'Executive Slide Presentation Deck',
      type: 'presentation',
      category: 'marketing',
      status: 'draft',
      version: '1.0',
      tags: ['Slides', 'Pitch Deck', 'Product Launch'],
      presentationContent: {
        theme: 'emerald',
        slides: [
          {
            id: 'slide-tpl-1',
            layout: 'title',
            badge: 'BK RESEARCH LABS',
            title: 'Compound Launch & Scientific Overview',
            subtitle: 'High-purity peptide synthesis, HPLC verification, and institutional procurement.',
            bodyText: 'Presented by BK Research Labs'
          },
          {
            id: 'slide-tpl-2',
            layout: 'metrics',
            badge: 'KEY MILESTONES',
            title: 'Analytical Quality Performance',
            subtitle: 'Our commitment to purity and batch reproducibility.',
            metrics: [
              { label: 'HPLC Purity Spec', value: '> 99.4%', sub: 'Exceeds standard pharmacopeia' },
              { label: 'Active Formulations', value: '48 Compounds', sub: 'Lyophilized & sterile solutions' },
              { label: 'Turnaround Time', value: '< 24 Hours', sub: 'Order dispatch speed' }
            ]
          }
        ]
      }
    }
  },
  {
    id: 'tpl-card-titanium-gold',
    title: 'Titanium Executive & Obsidian Gold Card',
    type: 'business_card',
    category: 'branding',
    badge: 'Luxury Executive',
    iconName: 'CreditCard',
    description: 'Deep obsidian satin canvas with metallic gold foil accent border, laboratory flask insignia, and dynamic vCard QR code.',
    previewSnippet: 'Standard US 3.5" x 2.0" with gold foil finish, rounded corners, and instant QR contact saving.',
    documentData: {
      title: 'Executive Titanium & Gold Card',
      type: 'business_card',
      category: 'branding',
      status: 'draft',
      version: '1.0',
      tags: ['Business Card', 'Executive', 'Gold Foil', 'vCard'],
      businessCardContent: {
        size: 'us_standard',
        orientation: 'landscape',
        corner: 'rounded_md',
        finish: 'gold_foil',
        theme: 'obsidian_gold',
        fontFamily: 'sans',
        contact: {
          fullName: 'Dr. Michael Sterling',
          credentials: 'Ph.D., CSO',
          jobTitle: 'Chief Scientific Officer & Founder',
          department: 'Analytical Chemistry Division',
          companyName: 'BK RESEARCH LABS',
          tagline: 'High-Purity Analytical Formulations',
          phone: '+1 (800) 555-0199',
          mobile: '+1 (415) 882-9104',
          email: 'm.sterling@bkresearchlabs.com',
          website: 'www.bkresearchlabs.com',
          address: '100 Research Parkway, Cambridge, MA',
          licenseNumber: 'ISO/IEC 17025 Certified #BKR-8842'
        },
        qrConfig: {
          enabled: true,
          side: 'back',
          type: 'vcard',
          label: 'SCAN TO SAVE CONTACT',
          size: 90,
          fgColor: '#000000',
          bgColor: '#ffffff',
          includeFrame: true
        },
        front: {
          bgColor: '#090d16',
          bgPattern: 'hex',
          textColor: '#f8fafc',
          secondaryTextColor: '#94a3b8',
          accentColor: '#eab308',
          borderStyle: 'metallic_gold',
          showLogo: true,
          logoIcon: 'flask',
          logoSize: 28,
          showWatermark: true,
          watermarkText: 'BK RESEARCH',
          watermarkOpacity: 0.05,
          layoutStyle: 'standard_split'
        },
        back: {
          bgColor: '#020617',
          bgPattern: 'circuit',
          textColor: '#f8fafc',
          secondaryTextColor: '#94a3b8',
          accentColor: '#eab308',
          borderStyle: 'metallic_gold',
          showLogo: true,
          logoIcon: 'bkr_emblem',
          logoSize: 36,
          showWatermark: true,
          watermarkText: 'VERIFIED LABORATORY GRADE',
          watermarkOpacity: 0.06,
          layoutStyle: 'qr_hero'
        }
      }
    }
  },
  {
    id: 'tpl-card-biopharma-cyan',
    title: 'Bio-Pharma Clean Minimalist Card',
    type: 'business_card',
    category: 'branding',
    badge: 'Clinical / Biotech',
    iconName: 'Dna',
    description: 'Crisp, clinical high-contrast white & medical cyan card with DNA helix emblem and ISO compliance seal.',
    previewSnippet: 'Clean modern typography with prominent laboratory contact channels and QR link to verified research portal.',
    documentData: {
      title: 'Bio-Pharma Clean Cyan Card',
      type: 'business_card',
      category: 'branding',
      status: 'draft',
      version: '1.0',
      tags: ['Business Card', 'Biotech', 'Clean', 'Cyan'],
      businessCardContent: {
        size: 'us_standard',
        orientation: 'landscape',
        corner: 'rounded_sm',
        finish: 'matte',
        theme: 'clean_cyan',
        fontFamily: 'sans',
        contact: {
          fullName: 'Dr. Elena Rostova',
          credentials: 'Ph.D., Lead Chemist',
          jobTitle: 'Director of QA & Quality Control',
          department: 'HPLC Analytical Testing',
          companyName: 'BK RESEARCH LABS',
          tagline: 'Precision Synthesis & Mass Spectrometry',
          phone: '+1 (800) 555-0199',
          mobile: '+1 (617) 492-3810',
          email: 'e.rostova@bkresearchlabs.com',
          website: 'www.bkresearchlabs.com',
          address: '400 Technology Square, Cambridge, MA',
          licenseNumber: 'cGMP 21 CFR Part 111 Conforming'
        },
        qrConfig: {
          enabled: true,
          side: 'back',
          type: 'vcard',
          label: 'VERIFY BATCH CREDENTIALS',
          size: 90,
          fgColor: '#000000',
          bgColor: '#ffffff',
          includeFrame: true
        },
        front: {
          bgColor: '#082f49',
          bgPattern: 'dots',
          textColor: '#ffffff',
          secondaryTextColor: '#bae6fd',
          accentColor: '#38bdf8',
          borderStyle: 'thin',
          showLogo: true,
          logoIcon: 'dna',
          logoSize: 28,
          showWatermark: true,
          watermarkText: 'PHARMACEUTICAL PURITY',
          watermarkOpacity: 0.06,
          layoutStyle: 'standard_split'
        },
        back: {
          bgColor: '#0369a1',
          bgPattern: 'grid',
          textColor: '#ffffff',
          secondaryTextColor: '#e0f2fe',
          accentColor: '#7dd3fc',
          borderStyle: 'thin',
          showLogo: true,
          logoIcon: 'atom',
          logoSize: 32,
          showWatermark: true,
          watermarkText: 'BK RESEARCH',
          watermarkOpacity: 0.07,
          layoutStyle: 'qr_hero'
        }
      }
    }
  },
  {
    id: 'tpl-card-cyber-neon',
    title: 'Biotech Cyber Neon Innovator Card',
    type: 'business_card',
    category: 'branding',
    badge: 'Tech & Research',
    iconName: 'Atom',
    description: 'High-tech dark canvas with luminescent cyan & emerald circuit lines, holographic finish, and prominent digital matrix code.',
    previewSnippet: 'Futuristic aesthetic engineered for synthesis developers, lab directors, and tech innovators.',
    documentData: {
      title: 'Biotech Cyber Neon Card',
      type: 'business_card',
      category: 'branding',
      status: 'draft',
      version: '1.0',
      tags: ['Business Card', 'Cyber', 'Neon', 'Tech'],
      businessCardContent: {
        size: 'us_standard',
        orientation: 'landscape',
        corner: 'rounded_md',
        finish: 'holographic',
        theme: 'cyber_neon',
        fontFamily: 'mono',
        contact: {
          fullName: 'Alex Vance',
          credentials: 'M.S., Bio-Engineer',
          jobTitle: 'Head of Automated Synthesis Systems',
          department: 'High-Throughput Robotic Chemistry',
          companyName: 'BK RESEARCH LABS',
          tagline: 'Computational Molecular Modeling & Synthesis',
          phone: '+1 (800) 555-0199',
          mobile: '+1 (415) 919-8201',
          email: 'a.vance@bkresearchlabs.com',
          website: 'www.bkresearchlabs.com',
          address: 'Silicon Valley Biohub / Cambridge Annex'
        },
        qrConfig: {
          enabled: true,
          side: 'back',
          type: 'vcard',
          label: 'DIGITAL PASSPORT & VCARD',
          size: 95,
          fgColor: '#000000',
          bgColor: '#ffffff',
          includeFrame: true
        },
        front: {
          bgColor: '#050b14',
          bgPattern: 'circuit',
          textColor: '#00f5ff',
          secondaryTextColor: '#67e8f9',
          accentColor: '#10b981',
          borderStyle: 'neon_glow',
          showLogo: true,
          logoIcon: 'atom',
          logoSize: 28,
          showWatermark: true,
          watermarkText: 'ALGORITHM x MOLECULE',
          watermarkOpacity: 0.08,
          layoutStyle: 'standard_split'
        },
        back: {
          bgColor: '#020408',
          bgPattern: 'circuit',
          textColor: '#00f5ff',
          secondaryTextColor: '#67e8f9',
          accentColor: '#34d399',
          borderStyle: 'neon_glow',
          showLogo: true,
          logoIcon: 'bkr_emblem',
          logoSize: 36,
          showWatermark: true,
          watermarkText: 'QUANTUM LABS',
          watermarkOpacity: 0.08,
          layoutStyle: 'qr_hero'
        }
      }
    }
  },
  {
    id: 'tpl-card-emerald-gold',
    title: 'Executive Deep Emerald & Gold Card',
    type: 'business_card',
    category: 'branding',
    badge: 'Institutional',
    iconName: 'Shield',
    description: 'Rich British racing / forest green satin with champagne gold accents, shield crest, and authoritative typography.',
    previewSnippet: 'Prestigious corporate aesthetic designed for institutional partnerships and board relations.',
    documentData: {
      title: 'Deep Emerald & Gold Executive Card',
      type: 'business_card',
      category: 'branding',
      status: 'draft',
      version: '1.0',
      tags: ['Business Card', 'Emerald', 'Gold', 'Corporate'],
      businessCardContent: {
        size: 'us_standard',
        orientation: 'landscape',
        corner: 'rounded_md',
        finish: 'gold_foil',
        theme: 'deep_emerald',
        fontFamily: 'serif',
        contact: {
          fullName: 'Harrison Vance, MBA',
          credentials: 'Managing Director',
          jobTitle: 'VP of Institutional Procurement',
          department: 'Corporate & University Partnerships',
          companyName: 'BK RESEARCH LABS',
          tagline: 'Institutional Grade Analytical Solutions',
          phone: '+1 (800) 555-0199',
          mobile: '+1 (212) 840-1920',
          email: 'h.vance@bkresearchlabs.com',
          website: 'www.bkresearchlabs.com',
          address: '500 Fifth Avenue, Suite 3200, New York, NY'
        },
        qrConfig: {
          enabled: true,
          side: 'back',
          type: 'vcard',
          label: 'SCAN FOR DIRECT DIAL',
          size: 90,
          fgColor: '#000000',
          bgColor: '#ffffff',
          includeFrame: true
        },
        front: {
          bgColor: '#022c22',
          bgPattern: 'lines',
          textColor: '#f0fdf4',
          secondaryTextColor: '#a7f3d0',
          accentColor: '#34d399',
          borderStyle: 'metallic_gold',
          showLogo: true,
          logoIcon: 'shield',
          logoSize: 28,
          showWatermark: true,
          watermarkText: 'INSTITUTIONAL GRADE',
          watermarkOpacity: 0.05,
          layoutStyle: 'standard_split'
        },
        back: {
          bgColor: '#064e3b',
          bgPattern: 'hex',
          textColor: '#f0fdf4',
          secondaryTextColor: '#a7f3d0',
          accentColor: '#6ee7b7',
          borderStyle: 'metallic_gold',
          showLogo: true,
          logoIcon: 'crown',
          logoSize: 34,
          showWatermark: true,
          watermarkText: 'BK RESEARCH',
          watermarkOpacity: 0.06,
          layoutStyle: 'qr_hero'
        }
      }
    }
  },
  {
    id: 'tpl-card-classic-linen',
    title: 'Classic Academic & Scientific Fellow Linen Card',
    type: 'business_card',
    category: 'branding',
    badge: 'Academic & Fellow',
    iconName: 'Award',
    description: 'Textured ivory linen cardstock with bronze foil highlights, classic serif typography, and academic credentials block.',
    previewSnippet: 'Tactile textured finish with understated sophistication for symposiums and research conferences.',
    documentData: {
      title: 'Academic Fellow Linen Card',
      type: 'business_card',
      category: 'branding',
      status: 'draft',
      version: '1.0',
      tags: ['Business Card', 'Academic', 'Linen', 'Ivory'],
      businessCardContent: {
        size: 'us_standard',
        orientation: 'landscape',
        corner: 'sharp',
        finish: 'linen',
        theme: 'classic_linen',
        fontFamily: 'serif',
        contact: {
          fullName: 'Prof. Julian Sterling, Ph.D.',
          credentials: 'FRS, Principal Investigator',
          jobTitle: 'Distinguished Research Fellow',
          department: 'Center for Peptide Therapeutics',
          companyName: 'BK RESEARCH LABS',
          tagline: 'Fundamental & Applied Synthesis Studies',
          phone: '+1 (800) 555-0199',
          mobile: '+1 (617) 555-7788',
          email: 'j.sterling@bkresearchlabs.com',
          website: 'www.bkresearchlabs.com',
          address: 'Harvard & Cambridge Science Complex'
        },
        qrConfig: {
          enabled: true,
          side: 'back',
          type: 'vcard',
          label: 'SCAN TO ACCESS PUBLICATIONS',
          size: 88,
          fgColor: '#000000',
          bgColor: '#ffffff',
          includeFrame: true
        },
        front: {
          bgColor: '#faf8f5',
          bgPattern: 'none',
          textColor: '#292524',
          secondaryTextColor: '#78716c',
          accentColor: '#b45309',
          borderStyle: 'thin',
          showLogo: true,
          logoIcon: 'flask',
          logoSize: 26,
          showWatermark: true,
          watermarkText: 'FELLOW OF CHEMISTRY',
          watermarkOpacity: 0.04,
          layoutStyle: 'standard_split'
        },
        back: {
          bgColor: '#f5f0e8',
          bgPattern: 'none',
          textColor: '#292524',
          secondaryTextColor: '#78716c',
          accentColor: '#92400e',
          borderStyle: 'thin',
          showLogo: true,
          logoIcon: 'bkr_emblem',
          logoSize: 32,
          showWatermark: true,
          watermarkText: 'BK RESEARCH LABS',
          watermarkOpacity: 0.05,
          layoutStyle: 'qr_hero'
        }
      }
    }
  }
];

