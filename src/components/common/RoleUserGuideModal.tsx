import React, { useState } from 'react';
import {
  BookOpen, Shield, Crown, Briefcase, User, Search, CheckCircle2, Sliders,
  HelpCircle, ChevronRight, X, FileText, Sparkles, Copy, Check, Download,
  Layers, Package, Warehouse, ShoppingBag, CreditCard, Mail, Settings, Database,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../../types';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface RoleUserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole?: UserRole;
}

type GuideRole = 'owner' | 'admin' | 'employee' | 'customer';

export const RoleUserGuideModal: React.FC<RoleUserGuideModalProps> = ({
  isOpen,
  onClose,
  currentUserRole = 'customer'
}) => {
  const [activeRole, setActiveRole] = useState<GuideRole>((currentUserRole as GuideRole) || 'owner');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [copiedText, setCopiedText] = useState(false);
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: isOpen,
    onClose
  });

  if (!isOpen) return null;

  const handleCopyGuide = () => {
    const guideContent = document.getElementById('role-guide-printable-content')?.innerText || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(guideContent).catch(() => {});
    }
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleDownloadGuide = () => {
    const guideContent = document.getElementById('role-guide-printable-content')?.innerText || '';
    const blob = new Blob([guideContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BK_Research_Labs_${activeRole.toUpperCase()}_Operations_Guide.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Application Operations & Complete User Guide</span>
                <span className="px-2.5 py-0.5 text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full">
                  v2.5 Live Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tailored functional breakdown, customization manuals, and operational SOPs for every platform profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGuide}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Copy text guide to clipboard"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedText ? 'Copied!' : 'Copy Guide'}</span>
            </button>
            <button
              onClick={handleDownloadGuide}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download text file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download TXT</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Switcher Tabs */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-b border-slate-800 gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
              Select Profile Guide:
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
              const labels = {
                owner: '1. Owner Profile',
                admin: '2. Admin Profile',
                employee: '3. Employee Profile',
                customer: '4. Customer Profile'
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
                    setSelectedSection('overview');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive
                      ? `${colors[role]} shadow-md`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{labels[role]}</span>
                  {currentUserRole === role && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500 text-slate-950 font-black">
                      YOUR ROLE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search features or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8" id="role-guide-printable-content">
          {activeRole === 'owner' && <OwnerGuideSection searchQuery={searchQuery} />}
          {activeRole === 'admin' && <AdminGuideSection searchQuery={searchQuery} />}
          {activeRole === 'employee' && <EmployeeGuideSection searchQuery={searchQuery} />}
          {activeRole === 'customer' && <CustomerGuideSection searchQuery={searchQuery} />}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>BK Research Labs • Enterprise E-Commerce Platform v2.5 Operations Documentation</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* OWNER GUIDE COMPONENT                                                      */
/* -------------------------------------------------------------------------- */
const OwnerGuideSection: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  return (
    <div className="space-y-6 text-slate-200">
      {/* Role Banner */}
      <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <Crown className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-amber-200">Owner Profile Operations Manual & System Governance</h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-slate-950 uppercase">
              Full Root Access
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            As the <strong>System Owner</strong>, you possess root-level governance over staff role provisioning, multi-merchant financial gateways, transactional communication infrastructure, visual theme & padding customizers, real-time fleet hot-patching, office suite document generation, and forensic audit trails.
          </p>
        </div>
      </div>

      {/* Grid of Key Responsibilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuideCard
          icon={Crown}
          title="1. Role Management & Staff Access (RBAC)"
          description="Grant or revoke permissions across Admin, Employee, and Customer accounts."
          details={[
            'Navigate to Admin Portal -> Customers & CRM.',
            'Locate any user record and modify role: Owner, Admin, Employee, or Customer.',
            'Toggle "Account Suspension" to instantaneously terminate session tokens for compromised users.',
            'View user lifetime spend, order history, and assign restricted downloadable COAs.'
          ]}
        />
        <GuideCard
          icon={CreditCard}
          title="2. Payment Gateways & Multi-Merchant Routing"
          description="Configure merchant credentials and payment processors with live/test switches."
          details={[
            'Navigate to Admin Portal -> Payment Gateways.',
            'Configure Authorize.Net, Stripe, PayPal, Web3 Crypto Wallets (BTC, ETH, USDT), Bank Wires, and Apple Pay.',
            'Toggle Test Mode (Sandbox) vs Live Production Mode per gateway.',
            'Set default primary checkout gateway and custom remittance instructions.'
          ]}
        />
        <GuideCard
          icon={Mail}
          title="3. Communication Hub (SMTP, SendGrid & Twilio SMS)"
          description="Manage transactional email servers, SMS gateways, liquid templates, and dispatch logs."
          details={[
            'Navigate to Admin Portal -> Communications.',
            'Configure SMTP / SendGrid / Mailgun settings and active SMS Gateways (Twilio, Telnyx).',
            'Edit liquid-style HTML email templates and text message templates with variable tokens.',
            'Review Dispatch Vault logs to inspect every sent message with carrier delivery status.'
          ]}
        />
        <GuideCard
          icon={Database}
          title="4. Database Export & Supabase Migration"
          description="Safeguard enterprise data with full JSON/CSV backups and SQL DDL generators."
          details={[
            'Navigate to Admin Portal -> Database & Backup.',
            'Download full JSON backup snapshots or clean CSV tables for catalog, orders, and customer lists.',
            'Generate or execute Supabase PostgreSQL schema migration DDL scripts with one click.',
            'Reset store to demo state or inspect real-time connection status.'
          ]}
        />
        <GuideCard
          icon={Sliders}
          title="5. Visual Spacing & Dynamic Theme Customizer"
          description="Micro-tune container padding, card radiuses, and color themes with live preview."
          details={[
            'Navigate to Admin Portal -> Visual Spacing.',
            'Adjust container padding (8px-48px), card radius (0px-24px), and select from 5 palette presets.',
            'Audit responsive layout behavior across Desktop, Laptop, Tablet, and Mobile viewports.'
          ]}
        />
        <GuideCard
          icon={Package}
          title="6. Chemical Bottle Label Designer & Thermal Serialization"
          description="Design GHS-compliant compound bottle labels with CAS numbers, 2D DataMatrix/QR codes, and batch serials."
          details={[
            'Navigate to Admin Portal -> Bottle Label Designer.',
            'Select any chemical product to automatically populate molecular weight, purity %, and CAS number.',
            'Toggle GHS Hazard Pictograms and print output directly to thermal barcode printers (ZPL/PDF).'
          ]}
        />
        <GuideCard
          icon={Layers}
          title="7. Real-Time Fleet OTA Updates & Dynamic Manual Engine"
          description="Auto-update iOS, Android, and Web clients in real-time on design and feature changes."
          details={[
            'Navigate to Admin Portal -> Fleet & OTA Sync to monitor active connected devices and latency.',
            'Broadcast live hot-patches with instant cryptographic SHA-256 integrity checksum verification.',
            'Dynamic instruction manuals and SOP PDFs re-compile automatically with real-time database state.'
          ]}
        />
        <GuideCard
          icon={Shield}
          title="8. Comprehensive SecOps & Visual Audit Timeline"
          description="Inspect cryptographic transaction ledgers with chronological visual milestones."
          details={[
            'Navigate to Admin Portal -> Audit Logs.',
            'Toggle between the Visual Chronological Timeline and high-density Table View.',
            'Filter forensic events by User Email, Role, Category, and Date Ranges with SOC2 / GxP export.'
          ]}
        />
      </div>

      {/* Step-by-Step Customization Guide */}
      <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
        <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <span>How to Customize the Store & Layout (Owner Executive SOP)</span>
        </h4>
        <ol className="list-decimal list-inside text-sm text-slate-300 space-y-2.5">
          <li>
            <strong>Visual Spacing &amp; Theme Adjustments:</strong> Go to <em>Admin &rarr; Visual Spacing</em>. Adjust container padding, card corner radius (0px to 24px), border contrast, and color themes. Changes update live in real-time.
          </li>
          <li>
            <strong>Bottle Label &amp; Barcode Designer:</strong> Go to <em>Admin &rarr; Bottle Label Designer</em>. Customize chemical names, batch numbers, expiration dates, GHS hazard pictograms, QR codes, and click "Print Labels" to render high-resolution ZPL or PDF sheets.
          </li>
          <li>
            <strong>Customer Portal Widget Customizer:</strong> Go to <em>Admin &rarr; Customer Portal Layout</em>. Drag, reorder, or toggle widgets (Orders, Downloads, Support Tickets, Security) visible to customers.
          </li>
          <li>
            <strong>Document Center &amp; Internal Office Suite:</strong> Go to <em>Admin &rarr; Document Center</em> to author rich Word documents, calculation spreadsheets, presentation slide decks, and luxury business cards with universal file conversion.
          </li>
        </ol>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* ADMIN GUIDE COMPONENT                                                      */
/* -------------------------------------------------------------------------- */
const AdminGuideSection: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  return (
    <div className="space-y-6 text-slate-200">
      <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-emerald-200">Admin Profile Operations Manual</h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 uppercase">
              Management & Operations
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            As an <strong>Administrator</strong>, you oversee day-to-day store operations, order fulfillment, catalog management, customer support ticket resolution, inventory restocks, and content updates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuideCard
          icon={Package}
          title="1. Products Catalog & Compound Specs"
          description="Create, edit, and organize compound products with chemical purity parameters."
          details={[
            'Go to Admin Portal -> Products Catalog.',
            'Click "Add New Product" or edit existing compounds.',
            'Set SKU, CAS number, molecular formula, purity percentage (e.g. 99.8%), stock, and bottle size.',
            'Upload Certificate of Analysis (COA) PDFs and Safety Data Sheets (SDS) for customer download.'
          ]}
        />
        <GuideCard
          icon={ShoppingBag}
          title="2. Orders & Multi-Carrier Fulfillment Workflow"
          description="Process incoming customer orders, update shipping statuses, and generate invoices."
          details={[
            'Go to Admin Portal -> Orders & Sales.',
            'Filter orders by status: Pending, Processing, Shipped, Delivered, or Cancelled.',
            'Assign tracking numbers (FedEx, UPS, DHL, USPS) and select shipping carriers.',
            'Print PDF packing slips and commercial invoices directly from the order detail view.'
          ]}
        />
        <GuideCard
          icon={Warehouse}
          title="3. Inventory, Low-Stock Triggers & Purchase Orders (POs)"
          description="Track stock levels, set low-stock reorder triggers, and manage supplier POs."
          details={[
            'Go to Admin Portal -> Inventory & POs.',
            'Monitor low stock warnings and automated reorder alerts.',
            'Create Purchase Orders (POs) for suppliers, adjust unit costs, and receive stock increments upon delivery.'
          ]}
        />
        <GuideCard
          icon={FileText}
          title="4. Downloadables & Batch Certificate Distribution"
          description="Manage digital documentation, user asset grants, and document access control."
          details={[
            'Go to Admin Portal -> Downloadables & COAs.',
            'Upload master batch COAs, SDS sheets, and research protocols.',
            'Grant custom file permissions to individual customer emails with expiration dates and download limits.'
          ]}
        />
        <GuideCard
          icon={User}
          title="5. Customer Accounts & CRM Relations"
          description="Inspect customer profiles, track lifetime orders, and grant restricted access tokens."
          details={[
            'Navigate to Admin Portal -> Customers & CRM.',
            'Inspect customer profile metadata, verified addresses, and lifetime spending.',
            'Assign VIP researcher tiers and grant access to proprietary batch files.'
          ]}
        />
        <GuideCard
          icon={Mail}
          title="6. Support Ticket Helpdesk & Multi-Channel Messaging"
          description="Manage customer service inquiries, assign priorities, and dispatch replies."
          details={[
            'Navigate to Admin Portal -> Communications -> Support Inbox.',
            'Filter unread customer tickets by priority (Normal, High, Urgent).',
            'Send replies directly—customers receive automated email and SMS notification updates.'
          ]}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* EMPLOYEE GUIDE COMPONENT                                                   */
/* -------------------------------------------------------------------------- */
const EmployeeGuideSection: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  return (
    <div className="space-y-6 text-slate-200">
      <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
          <Briefcase className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-indigo-200">Employee Profile Operations Manual</h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-500 text-white uppercase">
              Fulfillment & Support
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            As an <strong>Employee</strong>, your focal tasks center around picking and packing orders, updating tracking numbers, printing bottle labels, and responding to inbound customer service tickets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuideCard
          icon={ShoppingBag}
          title="1. Order Picking & Packing Station"
          description="View pending orders, review item quantities, and print packing lists."
          details={[
            'Go to Admin Portal -> Orders & Sales.',
            'Filter by "Pending" or "Processing" to see items ready for picking.',
            'Verify chemical bottle sizes, lot numbers, and hazardous material indicators.',
            'Click "Print Packing Slip" to include inside the shipment package.'
          ]}
        />
        <GuideCard
          icon={Package}
          title="2. Chemical Label Printing & Bottle Serialization"
          description="Generate compliant chemical compound bottle labels before dispatch."
          details={[
            'Go to Admin Portal -> Bottle Label Designer.',
            'Select the target product and batch number.',
            'Verify hazard symbols, CAS number, and QR code verification links.',
            'Click "Print Labels" to send output to thermal label printer (ZPL/PDF).'
          ]}
        />
        <GuideCard
          icon={Mail}
          title="3. Inbound Customer Support Inquiries & Ticket Triage"
          description="Answer customer inquiries regarding order status, tracking, or COAs."
          details={[
            'Go to Admin Portal -> Communications -> Support Inbox.',
            'Review unread customer tickets filtered by priority.',
            'Send replies directly through the portal—the customer will receive an instant email and SMS update.'
          ]}
        />
        <GuideCard
          icon={Warehouse}
          title="4. Stock Counts, Receiving & PO Fulfillment"
          description="Receive supplier shipments and update physical stock inventory."
          details={[
            'Go to Admin Portal -> Inventory & POs.',
            'Locate the matching Purchase Order and click "Mark as Received".',
            'Verify item counts against physical delivery and record stock adjustments.'
          ]}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CUSTOMER GUIDE COMPONENT                                                   */
/* -------------------------------------------------------------------------- */
const CustomerGuideSection: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  return (
    <div className="space-y-6 text-slate-200">
      <div className="p-5 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40">
          <User className="w-8 h-8" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-teal-200">Customer Profile Operations Manual</h3>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-teal-500 text-slate-950 uppercase">
              Client Portal & Shopping
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">
            Welcome to <strong>BK Research Labs</strong>! As a valued customer, you can browse certified research compounds, place orders, download batch COA documents, track deliveries in real time, and manage your account security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuideCard
          icon={Package}
          title="1. Browsing Catalog & Chemical Purity Specs"
          description="Search certified reference standards, filter by category, and view batch COAs."
          details={[
            'Use the top search bar (Ctrl + K) to search by chemical name, CAS number, or SKU.',
            'Filter by category (Peptides, Nootropics, Compounds) or stock status.',
            'Click on any product to view full purity specifications, molecular weight, and batch test reports.'
          ]}
        />
        <GuideCard
          icon={ShoppingBag}
          title="2. Placing Orders & Express Checkout"
          description="Add items to cart, select shipping options, and choose payment methods."
          details={[
            'Add desired items to cart and click "Proceed to Checkout".',
            'Provide shipping address and contact phone number for SMS tracking updates.',
            'Select payment gateway (Credit Card, Crypto, Bank Wire, Apple Pay) and complete order.',
            'Receive instant order confirmation and downloadable access links.'
          ]}
        />
        <GuideCard
          icon={FileText}
          title="3. Customer Dashboard & Certificate Downloads"
          description="Track shipments, access historical invoices, and download batch COAs."
          details={[
            'Click on "Account / Dashboard" in the top navigation header.',
            'View current order statuses, tracking links (FedEx / UPS), and order details.',
            'Access "Downloadable Assets" to retrieve batch COAs, SDS sheets, and research guides anytime.'
          ]}
        />
        <GuideCard
          icon={Mail}
          title="4. Support Tickets & Saved Items"
          description="Submit inquiries to lab technicians and save items for future re-orders."
          details={[
            'Use "Save for Later" on product cards to bookmark compounds for future purchase.',
            'Submit customer support tickets directly from your dashboard for fast assistance.',
            'Manage security settings, update password, and toggle SMS alert preferences.'
          ]}
        />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* HELPER CARD COMPONENT                                                      */
/* -------------------------------------------------------------------------- */
const GuideCard: React.FC<{
  icon: any;
  title: string;
  description: string;
  details: string[];
}> = ({ icon: Icon, title, description, details }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-100">{title}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <ul className="space-y-1.5 text-xs text-slate-300">
        {details.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
