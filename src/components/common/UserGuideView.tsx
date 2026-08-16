import React, { useState, useMemo } from 'react';
import {
  BookOpen, Shield, Crown, Briefcase, User, Search, CheckCircle2, Sliders,
  HelpCircle, ChevronRight, Download, FileText, Sparkles, Copy, Check,
  Layers, Package, Warehouse, ShoppingBag, CreditCard, Mail, Settings, Database,
  ArrowRight, X, AlertCircle, Printer, Filter, QrCode, Calculator, HardDrive,
  Presentation, Table as TableIcon, FileSpreadsheet, Lock, Activity, Eye,
  Palette, Smartphone, ShieldCheck, Globe, ListChecks, FileCode, Award
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { UserRole } from '../../types';
import { useTranslation } from '../../lib/i18n';

interface UserGuideViewProps {
  initialRole?: UserRole;
  currentUserId?: string;
}

type GuideRole = 'owner' | 'admin' | 'employee' | 'customer';

interface SectionItem {
  id: string;
  title: string;
  category: string;
  icon: any;
  description: string;
  details: string[];
  keywords: string[];
}

export const UserGuideView: React.FC<UserGuideViewProps> = ({
  initialRole = 'customer'
}) => {
  const { t, language } = useTranslation();
  const [activeRole, setActiveRole] = useState<GuideRole>(
    (initialRole as GuideRole) || 'owner'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Master Data Guide Items for each Role - Complete & Exhaustive
  const roleSections: Record<GuideRole, SectionItem[]> = useMemo(() => ({
    owner: [
      {
        id: 'owner-rbac',
        title: '1. Role Governance & Staff Access Control (RBAC)',
        category: 'Governance',
        icon: Crown,
        description: 'Manage platform permissions across Owner, Admin, Employee, and Customer roles with instant lockout controls.',
        keywords: ['role', 'permissions', 'staff', 'owner', 'admin', 'employee', 'rbac', 'suspend', 'access', 'security'],
        details: [
          'Navigate to Admin Portal -> Customers & CRM.',
          'Locate any user record and modify their permission tier: Owner, Admin, Employee, or Customer.',
          'Toggle "Account Suspension" to instantaneously terminate active session tokens for compromised or rogue users.',
          'Review user lifetime spend, order histories, assigned downloadable assets, and security audit logs.'
        ]
      },
      {
        id: 'owner-gateways',
        title: '2. Payment Gateways & Multi-Merchant Routing',
        category: 'Finance',
        icon: CreditCard,
        description: 'Configure payment processors with sandbox toggles, API keys, and automated cryptocurrency/card routing.',
        keywords: ['payment', 'gateways', 'authorize.net', 'stripe', 'paypal', 'crypto', 'bank wire', 'apple pay', 'checkout', 'sandbox'],
        details: [
          'Navigate to Admin Portal -> Payment Gateways.',
          'Configure API credentials for Authorize.Net, Stripe, PayPal, Web3 Crypto Wallets (BTC, ETH, USDT), Bank Wire Instructions, and Apple Pay.',
          'Toggle "Test Mode (Sandbox)" vs "Live Production Mode" independently per gateway.',
          'Assign the primary default checkout processor and customize customer remittance instructions.'
        ]
      },
      {
        id: 'owner-comms',
        title: '3. Communication Hub (SMTP, SendGrid & Twilio SMS)',
        category: 'Infrastructure',
        icon: Mail,
        description: 'Manage transactional email servers, SMS gateways, liquid dynamic templates, and dispatch vault logs.',
        keywords: ['email', 'sms', 'twilio', 'smtp', 'sendgrid', 'notification', 'templates', 'dispatch', 'carrier', 'logs'],
        details: [
          'Navigate to Admin Portal -> Communications.',
          'Configure custom SMTP servers, SendGrid API keys, Mailgun, or Twilio / Telnyx SMS gateways.',
          'Edit Liquid-style HTML email templates and SMS notifications using merge tags like {customer_name}, {order_number}, and {tracking_link}.',
          'Inspect the real-time "Message Dispatch Vault" to monitor carrier delivery timestamps, HTTP status codes, and recipient history.'
        ]
      },
      {
        id: 'owner-database',
        title: '4. Database Backup, JSON/CSV Export & Supabase Migration',
        category: 'Infrastructure',
        icon: Database,
        description: 'Safeguard enterprise data with full JSON snapshots, CSV tables, and live Supabase PostgreSQL DDL generators.',
        keywords: ['database', 'backup', 'export', 'sql', 'supabase', 'migration', 'ddl', 'csv', 'json', 'restore'],
        details: [
          'Navigate to Admin Portal -> Database & Backup.',
          'Generate full JSON backup snapshots or download clean CSV tables for catalog products, orders, inventory, and customer rosters.',
          'Generate and execute Supabase PostgreSQL schema migration DDL scripts with Row-Level Security (RLS) policies.',
          'Inspect real-time cloud database connection health or reset the sandbox to baseline demonstration state.'
        ]
      },
      {
        id: 'owner-theming-spacing',
        title: '5. Visual Spacing & Dynamic Theme Customizer',
        category: 'Customization',
        icon: Sliders,
        description: 'Micro-tune container padding, card border radiuses, color palettes, and typography with live preview.',
        keywords: ['visual', 'spacing', 'theme', 'padding', 'border radius', 'colors', 'typography', 'customizer', 'responsive'],
        details: [
          'Go to Admin -> Visual Spacing to micro-tune container padding (8px to 48px) and card corner radiuses (sharp 0px to pill 24px).',
          'Switch between luxury aesthetic presets: Obsidian Emerald, Cyber Neon, Deep Sea Blue, Dark Slate, and Clean Minimalist Light.',
          'Audit responsive layout behavior across Desktop, Laptop, Tablet, and Mobile viewports with live overlay guides.'
        ]
      },
      {
        id: 'owner-label-designer',
        title: '6. Chemical Bottle Label Designer & Thermal Printing',
        category: 'Customization',
        icon: QrCode,
        description: 'Design GHS-compliant compound bottle labels with CAS numbers, 2D DataMatrix/QR verification, and batch serials.',
        keywords: ['bottle label', 'ghs', 'hazards', 'thermal', 'printer', 'qr code', 'datamatrix', 'cas', 'serialization'],
        details: [
          'Navigate to Admin -> Bottle Label Designer.',
          'Select any chemical product to automatically populate molecular weight, purity %, CAS number, and storage temperature.',
          'Toggle GHS Hazard Pictograms (Toxic, Flammable, Health Hazard, Biohazard, Corrosive) and storage warnings.',
          'Configure 2D DataMatrix / QR verification codes that deep-link directly to third-party batch COA test reports.',
          'Send output directly to thermal barcode printers (Zebra ZPL, DYMO, standard PDF sheet labels).'
        ]
      },
      {
        id: 'owner-ota-fleet',
        title: '7. Real-Time Fleet OTA Updates & Dynamic Manual Engine',
        category: 'Infrastructure',
        icon: Smartphone,
        description: 'Broadcast instant hot-patches to iOS, Android, and Web clients in real-time with automated manual re-compilation.',
        keywords: ['ota', 'real-time', 'fleet', 'ios', 'android', 'auto-update', 'manual', 'websocket', 'sync', 'hot-patch'],
        details: [
          'Navigate to Admin Portal -> Fleet & OTA Sync to monitor active connected devices and latency across client nodes.',
          'Enable automated live hot-patching for mobile (iOS/Android) and Web applications whenever catalog items or styles update.',
          'The dynamic instruction engine re-compiles documentation and SOPs on-the-fly reflecting real-time database parameters.',
          'Broadcast manual OTA updates with cryptographic SHA-256 integrity checksum verification.'
        ]
      },
      {
        id: 'owner-audit-logs',
        title: '8. Comprehensive SecOps & Visual Audit Timeline',
        category: 'Governance',
        icon: ShieldCheck,
        description: 'Inspect cryptographic transaction ledgers with chronological visual milestones, multifaceted filtering, and SOC2/GxP export.',
        keywords: ['audit logs', 'timeline', 'secops', 'security', 'compliance', 'soc2', 'gxp', 'filters', 'forensic', 'export'],
        details: [
          'Navigate to Admin Portal -> Audit Logs.',
          'Toggle between the Visual Chronological Timeline (grouped by date milestones) and the high-density Table View.',
          'Filter forensic events by User Email, RBAC Role (Owner, SecOps, Admin, Fulfillment, Customer), Event Category, and Date Ranges.',
          'Inspect raw cryptographic payload metadata and export dossiers in CSV, JSON Ledger, or SOC2 / GxP Compliance Markdown.'
        ]
      },
      {
        id: 'owner-customer-portal-layout',
        title: '9. Customer Portal Layout & Widget Customizer',
        category: 'Customization',
        icon: Palette,
        description: 'Drag, reorder, and toggle visibility of customer dashboard widgets, tabs, and greeting banners.',
        keywords: ['portal customizer', 'widgets', 'layout', 'dashboard', 'tabs', 'reorder', 'customer view'],
        details: [
          'Navigate to Admin Portal -> Customer Portal Layout.',
          'Drag-and-drop to reorder navigation tabs (Overview, Orders, Batch COAs, Wishlist, Addresses, Rewards, Support, Guides).',
          'Toggle widget visibility (Recent Orders, Loyalty Points, Quick Reorder, Reconstitution Calculator widget).',
          'Customize promotional banner announcements and customer portal greeting headlines.'
        ]
      },
      {
        id: 'owner-office-suite',
        title: '10. Enterprise Document Center & Internal Office Suite',
        category: 'Documentation',
        icon: FileSpreadsheet,
        description: 'Full-featured Word Processor, Spreadsheet Engine, Slide Deck Builder, Luxury Business Card Designer & File Converter.',
        keywords: ['office', 'word processor', 'spreadsheet', 'slide deck', 'business card', 'file converter', 'print preview', 'templates'],
        details: [
          'Navigate to Admin Portal -> Document Center.',
          'Word Processor: Rich text formatting, letterheads, margins, orientation, and PDF print preview.',
          'Spreadsheet Engine: Multi-sheet tabs, formulas (SUM, AVERAGE, MIN, MAX, PRODUCT), currency formatting, and cell styling.',
          'Slide Deck Builder: Executive presentations with themes, slide layouts, badges, and export capabilities.',
          'Business Card Designer: Dual-sided standard US & Euro cards with metallic gold finishes and live vCard QR codes.',
          'Universal File Converter: Convert files between PDF, CSV, JSON, Markdown, Word DOCX, and Text.'
        ]
      },
      {
        id: 'owner-file-manager',
        title: '11. Lab Storage Explorer & Row-Level Security (RLS) Engine',
        category: 'Infrastructure',
        icon: HardDrive,
        description: 'Multi-bucket storage vault with 4-tier Row-Level Security, expiring signed URLs, and forensic access logging.',
        keywords: ['file manager', 'storage', 'buckets', 'rls', 'row-level security', 'signed url', 'watermark', 'access logs', 'supabase'],
        details: [
          'Navigate to Admin Portal -> File Manager.',
          'Organize files across 5 storage buckets: Lab Certificates, Media Assets, Research Protocols, Office Files, and System Backups.',
          'Configure 4 RLS Policy tiers: Public (CDN), Authenticated Only, Role-Restricted (RBAC), and Private Admin Only.',
          'Generate expiring signed URLs with custom TTL (e.g. 1 hour to 30 days) and apply cryptographic watermarks.',
          'Inspect real-time Storage Quotas and forensic File Access Audit Logs.'
        ]
      },
      {
        id: 'owner-seo',
        title: '12. SEO Management & Dynamic XML Sitemap Generator',
        category: 'Marketing',
        icon: Globe,
        description: 'Manage OpenGraph metadata, search engine crawl policies, robots.txt, and automated XML sitemaps.',
        keywords: ['seo', 'sitemap', 'robots.txt', 'opengraph', 'metadata', 'indexing', 'google', 'canonical'],
        details: [
          'Navigate to Admin Portal -> SEO & Sitemaps.',
          'Configure site-wide meta titles, descriptions, canonical URLs, and OpenGraph social share cards.',
          'Edit robots.txt crawler rules and generate search-engine-ready dynamic XML sitemaps with priority weightings.'
        ]
      }
    ],
    admin: [
      {
        id: 'admin-products',
        title: '1. Products Catalog & Compound Chemical Specs',
        category: 'Catalog',
        icon: Package,
        description: 'Create, edit, and organize research compounds with chemical purity parameters, CAS numbers, and SDS attachments.',
        keywords: ['product', 'catalog', 'compound', 'sku', 'cas', 'purity', 'molecular', 'coa', 'sds', 'price'],
        details: [
          'Go to Admin Portal -> Products Catalog.',
          'Click "Add New Product" or edit existing chemical compounds.',
          'Define SKU, CAS number, molecular formula, purity percentage (e.g. 99.8%), stock count, and vial size.',
          'Attach Certificate of Analysis (COA) PDFs and Safety Data Sheets (SDS) for customer verification.',
          'Configure multi-tiered pricing, bulk purchase discounts, and stock visibility toggles.'
        ]
      },
      {
        id: 'admin-bulk-ops',
        title: '2. Bulk Product CSV Import/Export & Batch Editing',
        category: 'Catalog',
        icon: TableIcon,
        description: 'Perform batch pricing adjustments, stock updates, and massive CSV catalog imports with field mapping.',
        keywords: ['bulk edit', 'csv import', 'csv export', 'batch update', 'catalog management', 'price adjustments'],
        details: [
          'Navigate to Admin Portal -> Products Catalog -> Bulk Operations.',
          'Use "Bulk Product Import" to upload thousands of SKUs via standard CSV spreadsheet with intelligent column mapping.',
          'Use "Bulk Edit" to adjust prices (percentage or fixed amount), stock counts, categories, and tags across selected items simultaneously.',
          'Export entire catalog data into formatted CSV files for backup or ERP integration.'
        ]
      },
      {
        id: 'admin-image-editor',
        title: '3. Single & Multi-Product Image Studio Editor',
        category: 'Media',
        icon: Eye,
        description: 'Crop, resize, adjust aspect ratios (1:1, 4:3, 16:9), and enhance compound product photography.',
        keywords: ['image editor', 'product photo', 'crop', 'aspect ratio', 'studio render', 'vial photography'],
        details: [
          'Open any product in the Catalog and click "Edit Images".',
          'Crop images with aspect ratio locking (1:1 Square, 4:3 Product, 16:9 Banner).',
          'Upload transparent studio renders, vial mockups, and chemical molecular structure graphics.',
          'Reorder gallery images and designate primary storefront thumbnails.'
        ]
      },
      {
        id: 'admin-orders',
        title: '4. Orders & Multi-Carrier Fulfillment Workflow',
        category: 'Fulfillment',
        icon: ShoppingBag,
        description: 'Process orders through verification, picking, multi-carrier label dispatch, and automated customer tracking updates.',
        keywords: ['orders', 'fulfillment', 'shipping', 'tracking', 'fedex', 'ups', 'dhl', 'usps', 'invoice', 'packing slip'],
        details: [
          'Go to Admin Portal -> Orders & Sales.',
          'Filter orders by status: Pending, Processing, Shipped, Delivered, or Cancelled.',
          'Assign carrier tracking numbers (FedEx, UPS, DHL, USPS) with automated customer SMS and email tracking links.',
          'Generate and print PDF packing slips, commercial invoices, and hazardous material shipping manifests with 1-click.'
        ]
      },
      {
        id: 'admin-inventory',
        title: '5. Inventory Management, Reorder Triggers & Purchase Orders (POs)',
        category: 'Inventory',
        icon: Warehouse,
        description: 'Monitor stock levels, set automated low-stock warnings, and generate supplier Purchase Orders.',
        keywords: ['inventory', 'stock', 'po', 'purchase order', 'supplier', 'reorder', 'restock', 'unit cost'],
        details: [
          'Go to Admin Portal -> Inventory & POs.',
          'Monitor real-time inventory levels, low-stock threshold triggers, and stock-out alerts.',
          'Draft Purchase Orders (POs) for synthesis labs and chemical suppliers with unit cost tracking.',
          'Mark PO shipments as received to automatically update live storefront stock counts.'
        ]
      },
      {
        id: 'admin-customers',
        title: '6. Customer Accounts, CRM & Grant Management',
        category: 'CRM',
        icon: User,
        description: 'Inspect customer profiles, track lifetime orders, assign VIP tiers, and grant restricted access tokens.',
        keywords: ['customer', 'crm', 'lifetime spend', 'vip', 'grants', 'account status', 'orders'],
        details: [
          'Go to Admin Portal -> Customers & CRM.',
          'Inspect customer profile metadata, verified shipping addresses, total order volume, and lifetime spend.',
          'Assign custom customer tags (e.g. VIP Researcher, Institution, Wholesale Partner).',
          'Grant access to gated technical dossiers, proprietary datasets, and early-access batches.'
        ]
      },
      {
        id: 'admin-support',
        title: '7. Support Ticket Helpdesk & Multi-Channel Messaging',
        category: 'Support',
        icon: Mail,
        description: 'Manage customer service inquiries, assign priorities (Urgent, High, Normal), and dispatch replies.',
        keywords: ['support', 'tickets', 'inbox', 'customer service', 'priority', 'reply', 'messages', 'canned responses'],
        details: [
          'Go to Admin Portal -> Communications -> Support Inbox.',
          'Filter unread customer tickets by priority and category (Order Tracking, COA Inquiries, Reconstitution Help, Billing).',
          'Send replies directly—customers receive automated email and SMS notification updates.',
          'Maintain internal resolution notes and resolve inquiries with complete audit trail history.'
        ]
      },
      {
        id: 'admin-downloadables',
        title: '8. Downloadables & Batch Certificate Distribution',
        category: 'Assets',
        icon: FileText,
        description: 'Manage digital documentation, product-purchase auto-grants, and document expiration controls.',
        keywords: ['downloadables', 'assets', 'grant', 'coa', 'sds', 'pdf', 'expiration', 'permissions'],
        details: [
          'Go to Admin Portal -> Downloadables & COAs.',
          'Upload master batch COAs, SDS sheets, reconstitution guides, and analytical datasets.',
          'Configure automated granting rules (e.g. granted automatically upon purchase of specific SKUs).',
          'Set expiration timers and maximum download count limits per user.'
        ]
      },
      {
        id: 'admin-label-printer',
        title: '9. Thermal Bottle Label Printer & Serialization Station',
        category: 'Fulfillment',
        icon: QrCode,
        description: 'Generate and print chemical vial labels with GHS hazard pictograms, batch serials, and QR validation.',
        keywords: ['label printer', 'thermal', 'bottle', 'ghs', 'qr code', 'datamatrix', 'serialization'],
        details: [
          'Go to Admin Portal -> Bottle Label Designer.',
          'Select the compound batch to automatically populate molecular properties and chemical safety warnings.',
          'Print formatted labels directly to thermal roll printers or multi-label PDF sheets.'
        ]
      },
      {
        id: 'admin-file-manager',
        title: '10. Lab Storage & RLS File Explorer Operations',
        category: 'Infrastructure',
        icon: HardDrive,
        description: 'Upload files, navigate folder hierarchies, configure RLS security policies, and manage batch assets.',
        keywords: ['file manager', 'storage', 'upload', 'folder tree', 'rls', 'signed url', 'download'],
        details: [
          'Navigate to Admin Portal -> File Manager.',
          'Drag & drop files from your desktop directly into folders.',
          'Configure RLS access policies for individual files or entire folders.',
          'Generate signed download URLs and inspect file metadata (SHA-256 hash, dimensions, MIME types).'
        ]
      }
    ],
    employee: [
      {
        id: 'emp-picking',
        title: '1. Order Picking & Packing Station',
        category: 'Fulfillment',
        icon: ShoppingBag,
        description: 'View pending orders, verify chemical compound quantities and vial lot numbers, and print packing slips.',
        keywords: ['picking', 'packing', 'fulfillment', 'orders', 'slip', 'chemical', 'bottle', 'batch'],
        details: [
          'Go to Admin Portal -> Orders & Sales.',
          'Filter by "Pending" or "Processing" to see items ready for picking.',
          'Verify chemical bottle sizes, lot numbers, and hazardous material indicators.',
          'Click "Print Packing Slip" to include inside the shipment package.'
        ]
      },
      {
        id: 'emp-labels',
        title: '2. Chemical Label Printing & Bottle Serialization',
        category: 'Fulfillment',
        icon: Package,
        description: 'Generate and apply compliant chemical compound bottle labels before shipment dispatch.',
        keywords: ['label', 'designer', 'bottle', 'barcode', 'qr code', 'ghs', 'hazards', 'zpl', 'thermal'],
        details: [
          'Go to Admin Portal -> Bottle Label Designer.',
          'Select the target product and batch number.',
          'Verify hazard symbols, CAS number, and QR code verification links.',
          'Click "Print Labels" to send output to thermal label printer (ZPL/PDF).'
        ]
      },
      {
        id: 'emp-receiving',
        title: '3. Stock Receiving, Inventory Counts & PO Fulfillment',
        category: 'Inventory',
        icon: Warehouse,
        description: 'Receive supplier shipments, check physical counts against POs, and record stock increments.',
        keywords: ['receiving', 'stock', 'inventory', 'supplier', 'po', 'counts', 'delivery'],
        details: [
          'Go to Admin Portal -> Inventory & POs.',
          'Locate the matching Purchase Order and click "Mark as Received".',
          'Verify item counts against physical delivery and record stock adjustments.'
        ]
      },
      {
        id: 'emp-tickets',
        title: '4. Inbound Customer Support Inquiries & Ticket Triage',
        category: 'Support',
        icon: Mail,
        description: 'Answer customer inquiries regarding order status, tracking links, or Certificate of Analysis lookup.',
        keywords: ['support', 'ticket', 'tracking', 'inquiry', 'customer', 'status', 'response'],
        details: [
          'Go to Admin Portal -> Communications -> Support Inbox.',
          'Review unread customer tickets filtered by priority.',
          'Send replies directly through the portal—the customer will receive an instant email and SMS update.'
        ]
      },
      {
        id: 'emp-file-lookup',
        title: '5. Lab Storage Explorer & Document Lookup',
        category: 'Documentation',
        icon: HardDrive,
        description: 'Quickly locate Safety Data Sheets (SDS), technical protocols, and formulation calculation spreadsheets.',
        keywords: ['file manager', 'storage', 'sds', 'protocols', 'lookup', 'search'],
        details: [
          'Go to Admin Portal -> File Manager.',
          'Search for chemical safety sheets, product photos, or testing protocols using the global filter bar.',
          'Download or preview documents directly in your browser.'
        ]
      },
      {
        id: 'emp-tracking-update',
        title: '6. Tracking Code Assignment & Dispatch Confirmation',
        category: 'Fulfillment',
        icon: ListChecks,
        description: 'Scan carrier shipping barcodes, enter tracking numbers, and transition orders to "Shipped".',
        keywords: ['tracking', 'carrier', 'fedex', 'ups', 'dhl', 'barcode scan', 'dispatch'],
        details: [
          'Locate the processed order and click "Update Tracking".',
          'Select the shipping carrier (FedEx, UPS, DHL, USPS) and enter the tracking number.',
          'Click "Confirm Shipment" to automatically notify the customer via SMS and email with live tracking links.'
        ]
      }
    ],
    customer: [
      {
        id: 'cust-catalog',
        title: '1. Browsing Catalog & Chemical Purity Specifications',
        category: 'Shopping',
        icon: Package,
        description: 'Search certified reference compounds, filter by category, and inspect HPLC purity percentages.',
        keywords: ['catalog', 'search', 'purity', 'cas', 'sku', 'coa', 'specifications', 'filter', 'peptides'],
        details: [
          'Use the top search bar (Ctrl + K) to search by chemical name, CAS number, or SKU.',
          'Filter by category (Peptides, Nootropics, Compounds) or stock status.',
          'Click on any product to view full purity specifications, molecular weight, peptide sequence, and batch test reports.'
        ]
      },
      {
        id: 'cust-calculator',
        title: '2. Interactive Reconstitution & Dosage Calculator',
        category: 'Tools',
        icon: Calculator,
        description: 'Calculate sterile water volume, unit concentrations (mcg/IU), and peptide half-life decay curves.',
        keywords: ['calculator', 'reconstitution', 'bac water', 'dosage', 'units', 'half-life', 'syringe'],
        details: [
          'Click the "Calculator" button in the top navigation or on any product page.',
          'Select compound vial size (e.g. 5mg, 10mg) and bacteriostatic water volume (e.g. 2mL).',
          'View exact syringe tick mark concentrations (mcg per IU) and inspect half-life stability guidelines.'
        ]
      },
      {
        id: 'cust-quickview-wishlist',
        title: '3. Quick View, Wishlist & Save for Later',
        category: 'Shopping',
        icon: Eye,
        description: 'Bookmark favorite compounds, compare molecular properties, and save items for future re-orders.',
        keywords: ['quick view', 'save for later', 'wishlist', 'bookmark', 're-order'],
        details: [
          'Click the bookmark icon on any product card to add it to your "Save for Later" wishlist.',
          'Access your wishlist anytime from the top navigation to move items directly into your active cart.'
        ]
      },
      {
        id: 'cust-checkout',
        title: '4. Placing Orders & Express Multi-Gateway Checkout',
        category: 'Shopping',
        icon: ShoppingBag,
        description: 'Checkout securely using Credit Cards, Crypto (BTC/ETH/USDT), Bank Wire, or Apple Pay with multi-currency support.',
        keywords: ['checkout', 'order', 'cart', 'payment', 'shipping', 'credit card', 'crypto', 'wire', 'apple pay', 'currency'],
        details: [
          'Add desired items to cart and click "Proceed to Checkout".',
          'Provide shipping address and contact phone number for SMS tracking updates.',
          'Select payment gateway (Credit Card, Crypto, Bank Wire, Apple Pay) and complete order.',
          'Receive instant order confirmation and downloadable access links.'
        ]
      },
      {
        id: 'cust-dashboard',
        title: '5. Customer Dashboard & Real-Time Tracking',
        category: 'Account',
        icon: FileText,
        description: 'Track active shipments with live carrier milestones, review historical invoices, and print receipts.',
        keywords: ['dashboard', 'orders', 'tracking', 'fedex', 'ups', 'invoice', 'status', 'milestones'],
        details: [
          'Click on "Account / Dashboard" in the top navigation header.',
          'View current order statuses, carrier tracking links (FedEx / UPS / DHL), and detailed invoice receipts.',
          'Click "Reorder" to instantly populate your cart with previous order selections.'
        ]
      },
      {
        id: 'cust-coa-vault',
        title: '6. Certificate Verification & Batch COA Download Vault',
        category: 'Quality',
        icon: ShieldCheck,
        description: 'Search batch lot numbers to view third-party HPLC chromatograms, mass spectrometry, and verify SHA-256 hashes.',
        keywords: ['coa', 'certificate', 'hplc', 'mass spec', 'purity', 'lot number', 'sha256', 'download'],
        details: [
          'Click "COA Viewer" in the top navigation bar or inside your Customer Dashboard.',
          'Enter the lot number printed on your chemical bottle label (e.g. BK-8842-AUG26).',
          'Inspect full HPLC area % purity graphs, mass spec validation, and download the certified PDF report.'
        ]
      },
      {
        id: 'cust-addresses',
        title: '7. Multi-Address Book & Preferred Shipping Destinations',
        category: 'Account',
        icon: Warehouse,
        description: 'Save multiple shipping and billing addresses for one-click checkout.',
        keywords: ['address book', 'shipping address', 'billing address', 'default address'],
        details: [
          'Navigate to Customer Dashboard -> Addresses.',
          'Add new laboratory or residential addresses with country, state, and postal code verification.',
          'Designate your default shipping address for fast checkout.'
        ]
      },
      {
        id: 'cust-rewards',
        title: '8. Loyalty Rewards Program & Tier Perks',
        category: 'Rewards',
        icon: Award,
        description: 'Earn reward points on every purchase, unlock VIP tier discounts, and generate instant coupon codes.',
        keywords: ['rewards', 'loyalty points', 'vip tier', 'discount coupons', 'perks'],
        details: [
          'Navigate to Customer Dashboard -> Rewards.',
          'Track your current points balance and tier level (Bronze, Silver, Gold, Diamond VIP).',
          'Convert accumulated loyalty points into instant checkout discount coupons.'
        ]
      },
      {
        id: 'cust-security',
        title: '9. Account Security, 2FA & Biometric Passkeys',
        category: 'Security',
        icon: Lock,
        description: 'Protect your account with Google Authenticator (TOTP), SMS 2FA, biometric Passkeys, and session management.',
        keywords: ['security', '2fa', 'totp', 'google authenticator', 'passkeys', 'webauthn', 'password', 'sessions'],
        details: [
          'Navigate to Customer Dashboard -> Security & Profile.',
          'Enable Two-Factor Authentication via Google Authenticator TOTP or SMS verification codes.',
          'Register biometric Passkeys (Touch ID, Face ID, Windows Hello) for passwordless authentication.',
          'View active device sessions and terminate unauthorized connections with 1-click.'
        ]
      },
      {
        id: 'cust-support',
        title: '10. Support Ticket Desk & Real-Time Inquiries',
        category: 'Support',
        icon: Mail,
        description: 'Submit technical inquiries to lab chemists and receive immediate SMS/email resolution updates.',
        keywords: ['support', 'ticket', 'helpdesk', 'inquiry', 'message thread'],
        details: [
          'Navigate to Customer Dashboard -> Support Tickets.',
          'Submit a new support inquiry with priority level and category.',
          'View message thread history and receive instant email/SMS notifications when staff replies.'
        ]
      },
      {
        id: 'cust-agegate',
        title: '11. Age Verification Gate & Compliance Guidelines',
        category: 'Compliance',
        icon: Shield,
        description: 'Adhere to 21+ age verification guidelines and scientific research terms of service.',
        keywords: ['age verification', 'age gate', '21+', 'research terms', 'compliance'],
        details: [
          'All visitors must confirm 21+ age verification upon first visiting the catalog.',
          'Review institutional research compound compliance terms and handling guidelines.'
        ]
      }
    ]
  }), []);

  // Filter sections based on search query and category
  const filteredSections = useMemo(() => {
    const currentSections = roleSections[activeRole] || [];
    return currentSections.filter((sec) => {
      const matchCategory = selectedCategory === 'all' || sec.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = sec.title.toLowerCase().includes(q);
      const matchDesc = sec.description.toLowerCase().includes(q);
      const matchKeywords = sec.keywords.some((k) => k.toLowerCase().includes(q));
      const matchDetails = sec.details.some((d) => d.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchKeywords || matchDetails;
    });
  }, [roleSections, activeRole, selectedCategory, searchQuery]);

  // Available categories for current role
  const categories = useMemo(() => {
    const currentSections = roleSections[activeRole] || [];
    const set = new Set(currentSections.map((s) => s.category));
    return ['all', ...Array.from(set)];
  }, [roleSections, activeRole]);

  // PDF Export Generator Function using jsPDF
  const handleDownloadRolePDF = (targetRole: GuideRole) => {
    try {
      setDownloadingPdf(targetRole);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const roleTitles: Record<GuideRole, string> = {
        owner: 'OWNER PROFILE OPERATIONS MANUAL & SYSTEM GOVERNANCE',
        admin: 'ADMIN PROFILE OPERATIONS MANUAL & STORE MANAGEMENT',
        employee: 'EMPLOYEE PROFILE FULFILLMENT & SUPPORT GUIDE',
        customer: 'CUSTOMER PORTAL USER GUIDE & PURCHASING MANUAL'
      };

      const roleName = targetRole.toUpperCase();
      const sections = roleSections[targetRole] || [];

      // Primary header banner
      doc.setFillColor(0, 43, 41); // Dark teal
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('BK RESEARCH LABS', 14, 14);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`ENTERPRISE OPERATIONS GUIDE • PROFILE: ${roleName}`, 14, 22);
      doc.text(`v2.5 Live Ready • Generated: ${new Date().toLocaleDateString()}`, 130, 22);

      let y = 42;
      const pageHeight = 280;
      const marginX = 14;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > pageHeight) {
          doc.addPage();
          doc.setFillColor(0, 43, 41);
          doc.rect(0, 0, 210, 14, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(`BK RESEARCH LABS - ${roleName} OPERATIONS GUIDE`, marginX, 9);
          doc.text(`Page ${doc.getNumberOfPages()}`, 180, 9);
          y = 22;
        }
      };

      // Document Title
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(roleTitles[targetRole], marginX, y);
      y += 8;

      // Executive Summary
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);

      const summaries: Record<GuideRole, string> = {
        owner: 'This manual outlines executive operational procedures for System Owners at BK Research Labs. Scope includes full user role management, merchant payment gateways, email/SMS carriers, SQL database backups, and custom theme layout tools.',
        admin: 'This manual details store administration guidelines for Administrators. Scope includes compound product cataloging, order fulfillment workflows, inventory purchase orders, customer support tickets, and document asset grants.',
        employee: 'This manual details fulfillment station SOPs for Employees. Scope includes order picking/packing, chemical bottle label printing with GHS hazard symbols, inventory receiving, and customer inquiry support.',
        customer: 'This user guide provides step-by-step instructions for Customers. Scope includes catalog search, Certificate of Analysis (COA) verification, placing orders, real-time shipment tracking, and account security.'
      };

      const summaryLines = doc.splitTextToSize(summaries[targetRole], 182);
      doc.text(summaryLines, marginX, y);
      y += summaryLines.length * 5 + 6;

      // Draw separator line
      doc.setDrawColor(226, 232, 240);
      doc.line(marginX, y, 196, y);
      y += 8;

      // Render each section
      sections.forEach((sec, idx) => {
        checkPageBreak(30);

        // Section Title Header Box
        doc.setFillColor(241, 245, 249);
        doc.rect(marginX, y, 182, 8, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(sec.title, marginX + 3, y + 5.5);
        y += 12;

        // Section Description
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        const descLines = doc.splitTextToSize(sec.description, 180);
        doc.text(descLines, marginX + 2, y);
        y += descLines.length * 4.5 + 3;

        // Operating Steps
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);

        sec.details.forEach((step) => {
          checkPageBreak(10);
          const stepLines = doc.splitTextToSize(`• ${step}`, 178);
          doc.text(stepLines, marginX + 4, y);
          y += stepLines.length * 4 + 1.5;
        });

        y += 6;
      });

      // Footer disclaimer
      checkPageBreak(15);
      doc.setDrawColor(226, 232, 240);
      doc.line(marginX, y, 196, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('© 2026 BK Research Labs. Enterprise E-Commerce Operations Manual. Confidential.', marginX, y);

      // Save PDF file
      const fileName = `BK_Research_Labs_${targetRole.toUpperCase()}_Operations_Guide.pdf`;
      doc.save(fileName);

      triggerToast(`✓ Generated ${fileName} successfully!`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      triggerToast('⚠️ PDF creation failed. Please try again.');
    } finally {
      setDownloadingPdf(null);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 text-slate-100 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-3xl z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('Complete Role Operations & User Manuals')}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>⚡ {t('Real-Time Auto-Compiled • Live Fleet Sync')}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            {t('BK Research Labs Operating Guide & SOPs')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t('Instant search across every operational feature, step-by-step SOPs, system controls, and official PDF manual downloads for Owner, Admin, Employee, and Customer roles.')}
          </p>
        </div>

        {/* Quick Download PDF buttons per role */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 z-10">
          <button
            onClick={() => handleDownloadRolePDF(activeRole)}
            disabled={downloadingPdf === activeRole}
            className="px-5 py-3 rounded-2xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloadingPdf === activeRole
                ? t('Generating PDF...')
                : `${t('common.download')} ${activeRole.toUpperCase()} ${t('nav.guide')} (PDF)`}
            </span>
          </button>
        </div>
      </div>

      {/* Role Switcher Tabs */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            {t('Profile Role')}:
          </span>
          {(['owner', 'admin', 'employee', 'customer'] as GuideRole[]).map((role) => {
            const isActive = activeRole === role;
            const icons = {
              owner: Crown,
              admin: Shield,
              employee: Briefcase,
              customer: User
            };
            const Icon = icons[role];
            const labels: Record<GuideRole, string> = {
              owner: t('1. Owner Manual'),
              admin: t('2. Admin Manual'),
              employee: t('3. Employee Manual'),
              customer: t('4. Customer Guide')
            };
            const colors = {
              owner: 'border-amber-500/50 bg-amber-500/10 text-amber-300',
              admin: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
              employee: 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300',
              customer: 'border-teal-500/50 bg-teal-500/10 text-teal-300'
            };

            return (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setSelectedCategory('all');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap ${
                  isActive
                    ? `${colors[role]} shadow-md`
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{labels[role]}</span>
              </button>
            );
          })}
        </div>

        {/* Download PDF for Other Roles */}
        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">{t('Export PDF')}:</span>
          {(['owner', 'admin', 'employee', 'customer'] as GuideRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleDownloadRolePDF(r)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] uppercase border border-slate-700 flex items-center gap-1 transition-colors"
              title={`${t('Download PDF for')} ${r}`}
            >
              <Printer className="w-3 h-3 text-emerald-400" />
              <span>{r}.pdf</span>
            </button>
          ))}
        </div>
      </div>

      {/* Instant Search Bar & Category Filter */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`${t('Search')} ${activeRole} ${t('topics, features, keywords (e.g., \'shipping\', \'database\', \'coa\', \'payments\')...')}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? t('filter.all_categories') : t(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            {t('Showing')} <strong>{filteredSections.length}</strong> {t('topics for')}{' '}
            <strong className="text-emerald-400 uppercase">{activeRole}</strong> {t('profile')}
          </span>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-emerald-400 hover:underline font-semibold"
            >
              {t('Reset Search Filter')}
            </button>
          )}
        </div>
      </div>

      {/* Topic Cards List */}
      {filteredSections.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-white">{t('No matching topics found')}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {t('guide.no_search_results_desc', { query: searchQuery })}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40"
          >
            {t('Clear Search')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all space-y-4 shadow-lg group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-800 text-emerald-400 border border-slate-700">
                        {t(sec.category)}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">{t(sec.title)}</h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{t(sec.description)}</p>

                {/* Operating Instructions */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {t('Operating Instructions & SOP')}:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {sec.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{t(detail)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Keywords tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{t('Keywords')}:</span>
                  {sec.keywords.slice(0, 6).map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800/60 text-slate-400 border border-slate-800"
                    >
                      #{t(kw)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
