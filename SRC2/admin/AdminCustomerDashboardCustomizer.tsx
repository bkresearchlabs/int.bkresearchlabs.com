import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  Mail, 
  Phone, 
  Clock, 
  Megaphone, 
  Eye, 
  Plus, 
  Trash2, 
  Check, 
  HelpCircle, 
  FileCheck, 
  Award, 
  Bookmark, 
  MapPin, 
  Shield, 
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { SiteSettings, CustomerDashboardSettings, CustomerDashboardFaqItem } from '../../types';

interface AdminCustomerDashboardCustomizerProps {
  settings: SiteSettings;
  onSaveSettings: (settings: Partial<SiteSettings>) => void;
  onNavigateToPreview?: () => void;
}

export const AdminCustomerDashboardCustomizer: React.FC<AdminCustomerDashboardCustomizerProps> = ({
  settings,
  onSaveSettings,
  onNavigateToPreview
}) => {
  const defaultDashboardSettings: CustomerDashboardSettings = {
    welcome_message: 'Welcome to your BK Research Labs portal. Access your orders, lab reports, and direct scientific support.',
    announcement_enabled: true,
    announcement_text: '⚡ Priority Dispatch: Next-day cold-chain shipping active on all reference peptides and culture media.',
    support_email: settings.contact_email || 'support@bkresearchlabs.com',
    support_phone: settings.contact_phone || '+1 (800) 555-BKRL',
    support_hours: 'Monday – Friday: 8:00 AM – 8:00 PM EST',
    show_quick_reorder: true,
    show_coa_vault: true,
    show_rewards_tier: true,
    show_saved_items: true,
    show_address_book: true,
    show_support_portal: true,
    show_security_tab: true,
    custom_faq_items: [
      {
        id: 'faq-1',
        question: 'How do I download lot-specific Certificates of Analysis (COAs)?',
        answer: 'Navigate to the COA & Lab Reports tab in your customer dashboard, or click any completed order in your order history to download lot-specific HPLC & MS purity reports directly.',
        category: 'Quality Assurance'
      },
      {
        id: 'faq-2',
        question: 'What cold-chain preservation protocols are used during transit?',
        answer: 'Temperature-sensitive compounds are packaged in insulated thermal containers with solid CO2 dry ice or refrigerated gel cold packs to ensure 100% bioactivity upon arrival.',
        category: 'Shipping & Logistics'
      }
    ]
  };

  const [dashConfig, setDashConfig] = useState<CustomerDashboardSettings>({
    ...defaultDashboardSettings,
    ...(settings.customer_dashboard || {})
  });

  const [saved, setSaved] = useState(false);
  const [activeFaqModal, setActiveFaqModal] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('General Support');

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      customer_dashboard: dashConfig
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    const newItem: CustomerDashboardFaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      category: newFaqCategory.trim() || 'General'
    };

    setDashConfig({
      ...dashConfig,
      custom_faq_items: [...(dashConfig.custom_faq_items || []), newItem]
    });

    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setActiveFaqModal(false);
  };

  const handleDeleteFaq = (id: string) => {
    setDashConfig({
      ...dashConfig,
      custom_faq_items: (dashConfig.custom_faq_items || []).filter(item => item.id !== id)
    });
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#002b29] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-900/50 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Customer Portal Manager
          </span>
          <h1 className="text-2xl font-serif font-bold text-white">
            Customer Dashboard Controls & View Customizer
          </h1>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            Customize the customer portal layout, manage visible features, configure the customer support email link, banner announcements, and FAQ knowledge base.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Customization</span>
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>✓ Customer dashboard layout and support configuration saved successfully!</span>
        </div>
      )}

      {/* Main Grid: Controls vs Live Customer View Preview */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Customization Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. WELCOME & ANNOUNCEMENT BANNER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Megaphone className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif font-bold text-slate-900 text-base">Portal Welcome & Announcement Banner</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Welcome Header Subtitle Message</label>
                <input
                  type="text"
                  value={dashConfig.welcome_message}
                  onChange={e => setDashConfig({ ...dashConfig, welcome_message: e.target.value })}
                  placeholder="Welcome to your portal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Displayed beneath the customer's name in their account header.</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Enable Customer Announcement Banner</span>
                    <span className="text-[10px] text-slate-500">Show a top notification box when customers log in</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={dashConfig.announcement_enabled}
                    onChange={e => setDashConfig({ ...dashConfig, announcement_enabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-0 cursor-pointer"
                  />
                </label>

                {dashConfig.announcement_enabled && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Announcement Message Text</label>
                    <textarea
                      rows={2}
                      value={dashConfig.announcement_text}
                      onChange={e => setDashConfig({ ...dashConfig, announcement_text: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. CUSTOMER SUPPORT CONTACT & EMAIL LINK */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Mail className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif font-bold text-slate-900 text-base">Customer Support Links & Email Config</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Customer Support Email *</span>
                </label>
                <input
                  type="email"
                  value={dashConfig.support_email}
                  onChange={e => setDashConfig({ ...dashConfig, support_email: e.target.value })}
                  placeholder="support@bkresearchlabs.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#002b29]"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Populates direct mailto: buttons on customer dashboard & receipts.</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Support Hotline Phone</span>
                </label>
                <input
                  type="text"
                  value={dashConfig.support_phone}
                  onChange={e => setDashConfig({ ...dashConfig, support_phone: e.target.value })}
                  placeholder="+1 (800) 555-BKRL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#002b29]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Support Operating Hours</span>
                </label>
                <input
                  type="text"
                  value={dashConfig.support_hours}
                  onChange={e => setDashConfig({ ...dashConfig, support_hours: e.target.value })}
                  placeholder="Monday – Friday: 8:00 AM – 8:00 PM EST"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                />
              </div>
            </div>
          </div>

          {/* 3. FEATURE & MODULE VISIBILITY TOGGLES */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Eye className="w-5 h-5 text-emerald-700" />
              <h3 className="font-serif font-bold text-slate-900 text-base">Dashboard Modules & Navigation Toggles</h3>
            </div>

            <p className="text-xs text-slate-500">Enable or disable specific features available in the customer account area:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  <span>Quick Re-Order Widget</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_quick_reorder}
                  onChange={e => setDashConfig({ ...dashConfig, show_quick_reorder: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>COA & Lab Reports Vault</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_coa_vault}
                  onChange={e => setDashConfig({ ...dashConfig, show_coa_vault: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Rewards & Loyalty Points</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_rewards_tier}
                  onChange={e => setDashConfig({ ...dashConfig, show_rewards_tier: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <Bookmark className="w-4 h-4 text-emerald-700" />
                  <span>Saved Items & Wishlist</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_saved_items}
                  onChange={e => setDashConfig({ ...dashConfig, show_saved_items: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Address Book Manager</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_address_book}
                  onChange={e => setDashConfig({ ...dashConfig, show_address_book: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Scientific Help & FAQ Portal</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_support_portal}
                  onChange={e => setDashConfig({ ...dashConfig, show_support_portal: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>

              <label className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 transition-colors">
                <span className="flex items-center gap-2 font-bold text-slate-800">
                  <Shield className="w-4 h-4 text-emerald-700" />
                  <span>Account Security Tab</span>
                </span>
                <input
                  type="checkbox"
                  checked={dashConfig.show_security_tab}
                  onChange={e => setDashConfig({ ...dashConfig, show_security_tab: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* 4. FAQ KNOWLEDGE BASE MANAGER */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <h3 className="font-serif font-bold text-slate-900 text-base">Customer Support FAQ Knowledge Base</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveFaqModal(true)}
                className="px-3 py-1.5 bg-[#002b29] text-white font-bold text-xs rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ Item</span>
              </button>
            </div>

            {(!dashConfig.custom_faq_items || dashConfig.custom_faq_items.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No FAQ items created. Click "Add FAQ Item" above.</p>
            ) : (
              <div className="space-y-3">
                {dashConfig.custom_faq_items.map(faq => (
                  <div key={faq.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[9px] rounded-md uppercase">
                        {faq.category || 'General'}
                      </span>
                      <div className="font-bold text-slate-900">{faq.question}</div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{faq.answer}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1 text-red-500 hover:text-red-700 shrink-0"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Customer View Interactive Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 sticky top-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Live Customer View Preview
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Interactive Mockup
              </span>
            </div>

            {/* Simulated Customer Header */}
            <div className="bg-[#002b29] text-white rounded-2xl p-5 border border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold font-serif text-lg">
                  S
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider block">
                    Verified Customer Portal
                  </span>
                  <div className="text-base font-serif font-bold text-white truncate">Dr. Sarah Jenkins</div>
                  <div className="text-[10px] text-emerald-100/70 truncate">{dashConfig.welcome_message}</div>
                </div>
              </div>

              {/* Customer Support Email Badge inside Header */}
              <div className="pt-2 border-t border-emerald-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-300">Need direct support?</span>
                <a
                  href={`mailto:${dashConfig.support_email}`}
                  className="px-2.5 py-1 bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 hover:underline"
                >
                  <Mail className="w-3 h-3" />
                  <span>{dashConfig.support_email}</span>
                </a>
              </div>
            </div>

            {/* Announcement Banner Preview */}
            {dashConfig.announcement_enabled && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-[11px] text-emerald-200 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-tight">{dashConfig.announcement_text}</span>
              </div>
            )}

            {/* Active Navigation Tabs Preview */}
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visible Dashboard Tabs</div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg">Account Overview</span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-200 font-bold rounded-lg">Research Orders</span>
                {dashConfig.show_coa_vault && <span className="px-2.5 py-1 bg-slate-800 text-emerald-300 font-bold rounded-lg border border-emerald-500/30">COA Vault</span>}
                {dashConfig.show_saved_items && <span className="px-2.5 py-1 bg-slate-800 text-slate-200 font-bold rounded-lg">Saved Items</span>}
                {dashConfig.show_rewards_tier && <span className="px-2.5 py-1 bg-slate-800 text-amber-300 font-bold rounded-lg border border-amber-500/30">Rewards Tier</span>}
                {dashConfig.show_address_book && <span className="px-2.5 py-1 bg-slate-800 text-slate-200 font-bold rounded-lg">Addresses</span>}
                {dashConfig.show_support_portal && <span className="px-2.5 py-1 bg-slate-800 text-teal-300 font-bold rounded-lg border border-teal-500/30">Support Portal</span>}
              </div>
            </div>

            {/* Support Callout Preview */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Direct Scientific Support</span>
                <span className="text-[10px] text-emerald-400">Customer Link Active</span>
              </div>
              <div className="text-[11px] text-slate-300 space-y-1">
                <div>Email: <a href={`mailto:${dashConfig.support_email}`} className="text-emerald-300 underline">{dashConfig.support_email}</a></div>
                <div>Phone: <span className="text-white font-mono">{dashConfig.support_phone}</span></div>
                <div>Hours: <span className="text-slate-400">{dashConfig.support_hours}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add FAQ Item */}
      {activeFaqModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-base font-serif font-bold text-slate-900">Add Customer FAQ Question</h3>

            <form onSubmit={handleAddFaq} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newFaqCategory}
                  onChange={e => setNewFaqCategory(e.target.value)}
                  placeholder="e.g. Quality Assurance, Shipping, Billing"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={newFaqQuestion}
                  onChange={e => setNewFaqQuestion(e.target.value)}
                  placeholder="How do I..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Answer *</label>
                <textarea
                  required
                  rows={3}
                  value={newFaqAnswer}
                  onChange={e => setNewFaqAnswer(e.target.value)}
                  placeholder="Clear answer..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFaqModal(false)}
                  className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold rounded-xl"
                >
                  Save FAQ Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
