import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Bookmark, 
  MapPin, 
  Key, 
  LogOut, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  FileCheck, 
  Award, 
  Megaphone, 
  Copy, 
  Check, 
  Plus, 
  RefreshCw, 
  Download, 
  HelpCircle, 
  Send, 
  ShieldCheck, 
  Building,
  ShoppingCart,
  Search,
  Filter,
  FileText,
  Grid,
  PanelLeft,
  Command,
  Layers,
  SlidersHorizontal,
  X,
  LayoutList,
  Sliders,
  Maximize2,
  Minimize2,
  BookOpen,
  Truck
} from 'lucide-react';
import { UserProfile, Order, SaveForLaterItem, SiteSettings, Product, Address, NavLayoutOption, DownloadableItem, UserAssetGrant } from '../../types';
import { api } from '../../lib/supabase';
import { UserGuideView } from '../common/UserGuideView';
import { ThemeAndLayoutModal } from '../common/ThemeAndLayoutModal';
import { OSDashboardLayouts } from '../common/OSDashboardLayouts';
import { DiscreteThemeSwitcherWidget } from '../common/DiscreteThemeSwitcherWidget';
import { CustomerOrderDetailsModal } from './CustomerOrderDetailsModal';
import { AccountSecuritySection } from '../accountSecurity/AccountSecuritySection';
import {
  getUserDashboardPreferences,
  saveUserDashboardPreferences,
  DASHBOARD_THEMES,
  DashboardThemeId
} from '../../lib/dashboardTheme';
import { useTranslation, translateProduct } from '../../lib/i18n';

interface CustomerDashboardProps {
  user: UserProfile;
  orders: Order[];
  saveForLaterItems: SaveForLaterItem[];
  siteSettings?: SiteSettings;
  products?: Product[];
  onNavigateToShop: () => void;
  onNavigateToSaveForLater: () => void;
  onSignOut: () => void;
  onAddToCart?: (product: Product, quantity: number) => void;
  onUpdateProfile?: (updated: Partial<UserProfile>) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  orders,
  saveForLaterItems,
  siteSettings,
  products = [],
  onNavigateToShop,
  onNavigateToSaveForLater,
  onSignOut,
  onAddToCart,
  onUpdateProfile,
}) => {
  const { t, language } = useTranslation();
  const dashConfig = siteSettings?.customer_dashboard || {
    welcome_message: 'Welcome to your BK Research Labs portal. Access your orders, lab reports, and direct scientific support.',
    announcement_enabled: true,
    announcement_text: '⚡ Priority Dispatch: Next-day cold-chain shipping active on all reference peptides and culture media.',
    support_email: siteSettings?.contact_email || 'support@bkresearchlabs.com',
    support_phone: siteSettings?.contact_phone || '+1 (800) 555-BKRL',
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

  const supportEmail = dashConfig.support_email || 'support@bkresearchlabs.com';
  const supportPhone = dashConfig.support_phone || '+1 (800) 555-BKRL';

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'coa' | 'saved' | 'addresses' | 'rewards' | 'support' | 'profile' | 'guide'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeOrderPopup, setActiveOrderPopup] = useState<Order | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState<string | null>(null);

  // Digital Asset & Storage Access State
  const [userAssets, setUserAssets] = useState<{ downloadable: DownloadableItem; isGranted: boolean; grantReason: string; isExpired: boolean; grant?: UserAssetGrant }[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [sendingEmailAssetId, setSendingEmailAssetId] = useState<string | null>(null);

  React.useEffect(() => {
    loadUserAccessibleAssets();
  }, [user]);

  const loadUserAccessibleAssets = async () => {
    setLoadingAssets(true);
    try {
      const items = await api.getAccessibleAssetsForUser(user);
      setUserAssets(items);
    } catch (err) {
      console.error('Failed to load user accessible assets:', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleSendAssetToMyEmail = async (assetId: string, assetTitle: string) => {
    setSendingEmailAssetId(assetId);
    try {
      const res = await api.sendAssetToEmail(assetId, user.email, user);
      setReorderSuccessMsg(`✓ ${res.message} Check your inbox (${user.email}).`);
      setTimeout(() => setReorderSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(`Failed to send email copy: ${err?.message || 'Error sending email'}`);
    } finally {
      setSendingEmailAssetId(null);
    }
  };

  // Customer Persistent Navigation Layout & Theme State
  const [custPrefs, setCustPrefs] = useState(() => getUserDashboardPreferences(user.id || user.email));
  const [navLayoutOption, setNavLayoutOption] = useState<NavLayoutOption>(custPrefs.layout);
  const [custThemeId, setCustThemeId] = useState<DashboardThemeId>(custPrefs.theme);

  const [showNavLayoutModal, setShowNavLayoutModal] = useState(false);
  const [navLayoutToast, setNavLayoutToast] = useState<string | null>(null);
  const [custSidebarOpen, setCustSidebarOpen] = useState(true);
  const [custSidebarScale, setCustSidebarScale] = useState<'standard' | 'compact' | 'mini'>('standard');
  const [custSidebarSearch, setCustSidebarSearch] = useState('');
  const [custMegamenuCat, setCustMegamenuCat] = useState<string | null>(null);

  const handleSaveCustomerPreferences = (layout: NavLayoutOption, theme: DashboardThemeId) => {
    setNavLayoutOption(layout);
    setCustThemeId(theme);
    saveUserDashboardPreferences(user.id || user.email, { layout, theme });
    setNavLayoutToast('✓ Dashboard Theme & OS Layout choice saved! Retained for all future customer logins.');
    setTimeout(() => setNavLayoutToast(null), 3000);
    setShowNavLayoutModal(false);
  };

  const handleResetCustomerDefaultScreen = () => {
    setNavLayoutOption('floating_dock');
    setCustThemeId('emerald_dark');
    saveUserDashboardPreferences(user.id || user.email, {
      layout: 'floating_dock',
      theme: 'emerald_dark'
    });
    setNavLayoutToast('✓ Restored Default Screen & Theme (Floating Glass Pill + Emerald Dark)');
    setTimeout(() => setNavLayoutToast(null), 3000);
  };

  // Address Book state
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr-default',
      user_id: user.id,
      type: 'shipping',
      first_name: user.first_name,
      last_name: user.last_name,
      address_line_1: '100 Research Parkway, Suite 400',
      city: 'Cambridge',
      state: 'MA',
      postal_code: '02142',
      country: 'United States',
      phone: user.phone || '+1 (617) 555-0192',
      is_default: true
    }
  ]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    address_line_1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States',
    phone: '',
    is_default: false
  });

  // Support Inquiry State
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Order Inquiry',
    order_number: '',
    message: '',
    priority: 'Normal'
  });

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone || '',
    organization: 'Cambridge Biomolecular Institute'
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // COA Search State
  const [coaSearch, setCoaSearch] = useState('');

  const customerOrders = orders.filter(o => o.customer_email === user.email || o.user_id === user.id);

  const handleCopySupportEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(supportEmail).catch(() => {});
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyReferral = () => {
    const firstName = (user?.first_name || 'researcher').toLowerCase();
    const userSuffix = user?.id ? user.id.slice(-4) : '2026';
    const refUrl = `https://bkresearchlabs.com/join?ref=${firstName}${userSuffix}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(refUrl).catch(() => {});
    }
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleReorderOrder = (orderToReorder: Order) => {
    if (!onAddToCart) return;
    let addedCount = 0;
    orderToReorder.items.forEach(item => {
      const matchProd = products.find(p => p.id === item.product_id || p.sku === item.sku_snapshot);
      if (matchProd) {
        onAddToCart(matchProd, item.quantity);
        addedCount += item.quantity;
      }
    });
    setReorderSuccessMsg(`Added ${addedCount || orderToReorder.items.length} item(s) from Order ${orderToReorder.order_number} to your shopping cart!`);
    setTimeout(() => setReorderSuccessMsg(null), 3500);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.address_line_1 || !newAddr.city || !newAddr.state || !newAddr.postal_code) return;

    const created: Address = {
      id: `addr-${Date.now()}`,
      user_id: user.id,
      type: 'shipping',
      ...newAddr
    };

    if (newAddr.is_default) {
      setAddresses(prev => prev.map(a => ({ ...a, is_default: false })).concat(created));
    } else {
      setAddresses(prev => [...prev, created]);
    }

    setShowAddressModal(false);
    setNewAddr({
      first_name: user.first_name,
      last_name: user.last_name,
      address_line_1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'United States',
      phone: '',
      is_default: false
    });
  };

  const handleSendSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setTicketForm({ subject: '', category: 'Order Inquiry', order_number: '', message: '', priority: 'Normal' });
    }, 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        phone: profileForm.phone
      });
    }
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 2500);
  };

  const themeConfig = DASHBOARD_THEMES.find(t => t.id === custThemeId) || DASHBOARD_THEMES[0];
  const isOSLayout = navLayoutOption !== 'grid_deck';

  const customerTabs = [
    { id: 'overview', label: t('Account Overview'), category: t('Account'), icon: User, show: true, count: null, description: t('Profile details, order summary & quick stats') },
    { id: 'orders', label: t('Research Orders'), category: t('Orders'), icon: Package, show: true, count: customerOrders.length, description: t('Order history, tracking numbers & COAs') },
    { id: 'coa', label: t('COA & Lab Reports'), category: t('Quality'), icon: FileCheck, show: dashConfig.show_coa_vault, count: 'PDFs', description: t('HPLC & MS certificates of analysis') },
    { id: 'saved', label: t('Saved Items'), category: t('Shopping'), icon: Bookmark, show: dashConfig.show_saved_items, count: saveForLaterItems.length, description: t('Bookmarked research products') },
    { id: 'addresses', label: t('Address Book'), category: t('Shipping'), icon: MapPin, show: dashConfig.show_address_book, count: addresses.length, description: t('Saved laboratory shipping locations') },
    { id: 'rewards', label: t('Rewards Tier'), category: t('Account'), icon: Award, show: dashConfig.show_rewards_tier, count: '450 pts', description: t('Loyalty points and researcher discount level') },
    { id: 'support', label: t('Support & FAQ'), category: t('Help'), icon: HelpCircle, show: dashConfig.show_support_portal, count: null, description: t('Direct customer service & scientific FAQ') },
    { id: 'profile', label: t('Profile & Security'), category: t('Account'), icon: Key, show: dashConfig.show_security_tab !== false, count: null, description: t('Password reset & security settings') },
    { id: 'guide', label: t('Operations & User Guide'), category: t('Help'), icon: BookOpen, show: true, count: 'SOPs', description: t('Complete role manual, topic search & PDF downloads') },
  ].filter(t => t.show);

  if (isOSLayout) {
    return (
      <div className="min-h-screen">
        {navLayoutToast && (
          <div className="fixed top-4 right-4 z-50 p-3 bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg border border-emerald-500">
            <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{navLayoutToast}</span>
          </div>
        )}

        <OSDashboardLayouts
          layoutOption={navLayoutOption}
          tabs={customerTabs}
          currentTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId as any)}
          themeConfig={themeConfig}
          userRole="customer"
          userEmail={user.email}
          onOpenThemeCustomizer={() => setShowNavLayoutModal(true)}
          onResetDefaultScreen={handleResetCustomerDefaultScreen}
          onSelectTheme={(t) => handleSaveCustomerPreferences(navLayoutOption, t)}
          onSelectLayout={(l) => handleSaveCustomerPreferences(l, custThemeId)}
          onExitPortal={onSignOut}
        >
          {/* Active Tab Panel Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t('Total Orders')}</div>
                      <div className="text-2xl font-serif font-bold text-slate-900 mt-1">{customerOrders.length}</div>
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{t('Verified Purchase History')}</div>
                    </div>
                    <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t('Saved Compounds')}</div>
                      <div className="text-2xl font-serif font-bold text-slate-900 mt-1">{saveForLaterItems.length}</div>
                      <div className="text-[10px] text-amber-700 font-bold mt-0.5">{t('Wishlist Vault')}</div>
                    </div>
                    <div className="p-3.5 bg-amber-50 text-amber-800 rounded-2xl">
                      <Bookmark className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t('Rewards Points')}</div>
                      <div className="text-2xl font-serif font-bold text-amber-600 mt-1">450 Pts</div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">$45.00 {t('Credit Balance')}</div>
                    </div>
                    <div className="p-3.5 bg-amber-100/60 text-amber-800 rounded-2xl">
                      <Award className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t('Account Status')}</div>
                      <div className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{t('Active Tier 1')}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{t('Verified Lab Researcher')}</div>
                    </div>
                    <div className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl">
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-slate-900 text-base">{t('Quick Portal Actions')}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={onNavigateToShop}
                      className="p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <ShoppingCart className="w-5 h-5 text-emerald-700 mb-2" />
                      <div className="font-bold text-xs text-slate-900">{t('Browse Catalog')}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t('Shop research compounds')}</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <Package className="w-5 h-5 text-slate-700 mb-2" />
                      <div className="font-bold text-xs text-slate-900">{t('View Orders')} ({customerOrders.length})</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t('Track shipment statuses')}</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('coa')}
                      className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <FileCheck className="w-5 h-5 text-slate-700 mb-2" />
                      <div className="font-bold text-xs text-slate-900">{t('Lab COAs')}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t('Download certs')}</div>
                    </button>
                    <button
                      onClick={() => setActiveTab('guide')}
                      className="p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl text-left transition-all cursor-pointer"
                    >
                      <BookOpen className="w-5 h-5 text-amber-700 mb-2" />
                      <div className="font-bold text-xs text-slate-900">{t('User Guide')}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{t('Search SOPs & PDFs')}</div>
                    </button>
                  </div>
                </div>

                {/* Recent Orders on Overview */}
                {customerOrders.length > 0 && (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-slate-900 text-base">{t('Recent Research Orders')}</h3>
                        <p className="text-xs text-slate-500">{t('Click any order to view tracking details or download the official invoice.')}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-700 hover:underline cursor-pointer"
                      >
                        {t('View All')} ({customerOrders.length}) →
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {customerOrders.slice(0, 3).map(ord => (
                        <div
                          key={ord.id}
                          onClick={() => setActiveOrderPopup(ord)}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-emerald-50/40 p-2.5 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white rounded-xl transition-colors shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 text-xs group-hover:text-emerald-900">
                                  #{ord.order_number}
                                </span>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                  ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {t(ord.status)}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {new Date(ord.created_at).toLocaleDateString()} • {ord.items.length} {t('items')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              ${(ord.total || ord.total_amount || 0).toFixed(2)}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <span>{t('Track & Invoice')}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Research Purchase Orders')}</h3>
                      <p className="text-xs text-slate-500">
                        {t('Click on any order to view its real-time carrier tracking, cold-chain timeline, or download commercial invoices.')}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-xl self-start sm:self-auto">
                      {customerOrders.length} {t('Completed Orders')}
                    </span>
                  </div>

                  {customerOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 space-y-3">
                      <Package className="w-12 h-12 mx-auto stroke-1" />
                      <p className="text-sm font-semibold text-slate-600">{t('No orders logged under this research account yet.')}</p>
                      <button onClick={onNavigateToShop} className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
                        {t('Browse Catalog')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customerOrders.map(ord => (
                        <div
                          key={ord.id}
                          onClick={() => setActiveOrderPopup(ord)}
                          className="p-4 sm:p-5 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-xs transition-all cursor-pointer group"
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="p-2.5 bg-emerald-50 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white rounded-xl transition-colors shrink-0 mt-0.5">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-emerald-900">
                                  #{ord.order_number}
                                </span>
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                  ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {t(ord.status)}
                                </span>
                                {ord.fulfillment_status && (
                                  <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                    {t(ord.fulfillment_status)}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                {new Date(ord.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {ord.items.length} {t('items')} • {t('Total')}: <strong className="text-slate-900 font-mono">${(ord.total || ord.total_amount || 0).toFixed(2)}</strong>
                              </div>
                              {ord.tracking_number && (
                                <div className="text-[11px] text-emerald-800 font-mono font-semibold mt-1.5 flex items-center gap-1.5 bg-emerald-100/60 px-2.5 py-0.5 rounded-md inline-flex">
                                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>{t('Tracking')}: {ord.tracking_number} ({ord.carrier || 'Courier'})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveOrderPopup(ord);
                              }}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>{t('View Details & Tracking')}</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorderOrder(ord);
                              }}
                              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                              {t('Reorder')}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'coa' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Certificates of Analysis (COA) Vault')}</h3>
                <p className="text-xs text-slate-500">{t('Search batch numbers or chemical names to download lab reports.')}</p>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={t('Search COA by batch or compound name...')}
                    value={coaSearch}
                    onChange={e => setCoaSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                  {coaSearch ? `${t('Searching COA vault for')} "${coaSearch}"...` : t('Select an order or enter batch number above to access HPLC/MS spectrum PDFs.')}
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Saved Research Compounds')}</h3>
                {saveForLaterItems.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">{t('Your saved items list is empty.')}</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {saveForLaterItems.map(item => {
                      if (!item.product) return null;
                      const trProd = translateProduct(item.product, language);
                      return (
                        <div key={item.id} className="p-4 border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-slate-900">{trProd.name}</div>
                            <div className="text-[10px] text-slate-400">{trProd.short_description || '≥99.0% Pure Research Grade'}</div>
                          </div>
                          <button onClick={onNavigateToSaveForLater} className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                            {t('View Saved')}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Laboratory Address Book')}</h3>
                  <button onClick={() => setShowAddressModal(true)} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>{t('Add Address')}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="p-4 border border-slate-200 rounded-2xl text-xs space-y-1">
                      <div className="font-bold text-slate-900">{addr.first_name} {addr.last_name}</div>
                      <div className="text-slate-600">{addr.address_line_1}</div>
                      <div className="text-slate-600">{addr.city}, {addr.state} {addr.postal_code}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'rewards' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Researcher Rewards Tier')}</h3>
                <div className="p-6 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-widest">{t('Platinum Tier Member')}</div>
                  <div className="text-3xl font-serif font-bold">450 {t('Loyalty Points')}</div>
                  <p className="text-xs text-emerald-200">{t('Redeem points for store credit on future orders ($10 per 100 pts).')}</p>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Support & Scientific Inquiry')}</h3>
                <p className="text-xs text-slate-500">{t('Contact our lab team directly or browse scientific SOPs.')}</p>
                <a href={`mailto:${supportEmail}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                  <Mail className="w-4 h-4" />
                  <span>{t('Email Support')} ({supportEmail})</span>
                </a>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-slate-900 text-lg">{t('Profile & Security Settings')}</h3>
                <p className="text-xs text-slate-500">{t('Update account credentials and communication preferences.')}</p>
                <div className="text-xs font-mono text-slate-700 p-3 bg-slate-50 rounded-xl">
                  {t('Logged in as')}: {user.email}
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <UserGuideView initialRole="customer" />
            )}
          </div>
        </OSDashboardLayouts>

        <ThemeAndLayoutModal
          isOpen={showNavLayoutModal}
          onClose={() => setShowNavLayoutModal(false)}
          currentLayout={navLayoutOption}
          currentTheme={custThemeId}
          onSavePreferences={handleSaveCustomerPreferences}
          userRole="customer"
          userName={user.first_name ? `${user.first_name} ${user.last_name}` : user.email}
        />

        {/* Detailed Order Tracking & History Pop-up Modal for OS Layout */}
        {activeOrderPopup && (
          <CustomerOrderDetailsModal
            order={activeOrderPopup}
            supportEmail={supportEmail}
            onClose={() => setActiveOrderPopup(null)}
            onReorder={handleReorderOrder}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. TOP CUSTOMER HEADER BAR */}
      <div className="bg-[#002b29] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-emerald-900/40">
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-2xl font-serif font-bold shrink-0">
            {user.first_name[0]}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Verified Customer Portal
              </span>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Platinum Researcher
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-xs text-emerald-100/80 max-w-xl">
              {dashConfig.welcome_message}
            </p>
          </div>
        </div>

        {/* Customer Support Email Link Button & Sign Out */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto justify-start md:justify-end">
          <a
            href={`mailto:${supportEmail}`}
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md shrink-0"
            title="Click to send email to customer support"
          >
            <Mail className="w-4 h-4 stroke-[2.5]" />
            <span>Support: {supportEmail}</span>
          </a>

          <button
            onClick={handleCopySupportEmail}
            className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20 shrink-0"
            title="Copy support email address"
          >
            {copiedEmail ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
          </button>

          <button
            onClick={onSignOut}
            className="px-3.5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-500/30 shrink-0 ml-auto md:ml-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Persistent Layout Change Toast */}
      {navLayoutToast && (
        <div className="p-3 bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg border border-emerald-500">
          <CheckCircle className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{navLayoutToast}</span>
        </div>
      )}

      {/* 2. CUSTOMER ANNOUNCEMENT BANNER (IF ENABLED) */}
      {dashConfig.announcement_enabled && dashConfig.announcement_text && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-slate-800 leading-snug">{dashConfig.announcement_text}</span>
          </div>
          <a
            href={`mailto:${supportEmail}?subject=Announcement Inquiry`}
            className="text-[11px] font-bold text-[#002b29] underline hover:text-emerald-700 shrink-0"
          >
            Inquire via Email →
          </a>
        </div>
      )}

      {/* Global Reorder Alert Message */}
      {reorderSuccessMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reorderSuccessMsg}</span>
        </div>
      )}

      {/* 3. DYNAMIC NAVIGATION TABS (5 LAYOUT OPTIONS) */}
      {(() => {
        const customerTabs = [
          { id: 'overview', label: 'Account Overview', category: 'Account', icon: User, show: true, count: null, description: 'Profile details, order summary & quick stats' },
          { id: 'orders', label: 'Research Orders', category: 'Orders', icon: Package, show: true, count: customerOrders.length, description: 'Order history, tracking numbers & COAs' },
          { id: 'coa', label: 'COA & Lab Reports', category: 'Quality', icon: FileCheck, show: dashConfig.show_coa_vault, count: 'PDFs', description: 'HPLC & MS certificates of analysis' },
          { id: 'saved', label: 'Saved Items', category: 'Shopping', icon: Bookmark, show: dashConfig.show_saved_items, count: saveForLaterItems.length, description: 'Bookmarked research products' },
          { id: 'addresses', label: 'Address Book', category: 'Shipping', icon: MapPin, show: dashConfig.show_address_book, count: addresses.length, description: 'Saved laboratory shipping locations' },
          { id: 'rewards', label: 'Rewards Tier', category: 'Account', icon: Award, show: dashConfig.show_rewards_tier, count: '450 pts', description: 'Loyalty points and researcher discount level' },
          { id: 'support', label: 'Support & FAQ', category: 'Help', icon: HelpCircle, show: dashConfig.show_support_portal, count: null, description: 'Direct customer service & scientific FAQ' },
          { id: 'profile', label: 'Profile & Security', category: 'Account', icon: Key, show: dashConfig.show_security_tab !== false, count: null, description: 'Password reset & security settings' },
          { id: 'guide', label: 'Operations & User Guide', category: 'Help', icon: BookOpen, show: true, count: 'SOPs', description: 'Complete role manual, topic search & PDF downloads' },
        ].filter(t => t.show);

        const customerCategories = Array.from(new Set(customerTabs.map(t => t.category)));

        // LAYOUT 1: VISIBLE MULTI-ROW GRID DECK
        if (navLayoutOption === 'grid_deck') {
          return (
            <div className="bg-[#002b29] text-white rounded-2xl p-4 space-y-3 border border-emerald-800 shadow-md">
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-2 text-xs">
                <div className="flex items-center gap-2 font-black text-emerald-300 uppercase tracking-wider text-[11px]">
                  <Grid className="w-4 h-4 text-emerald-400" />
                  <span>Portal Navigation</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {customerTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); setSelectedOrder(null); }}
                      className={`p-3 rounded-xl border flex flex-col items-start justify-between text-left transition-all ${
                        isActive
                          ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-black shadow-lg scale-105 ring-2 ring-emerald-300/50'
                          : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-100 hover:bg-emerald-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                        {tab.count !== null && (
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                            isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-800/80 text-emerald-200'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-bold leading-tight">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        // LAYOUT 2: SIDEBAR DRAWER & RAIL
        if (navLayoutOption === 'sidebar_drawer') {
          return (
            <div className="bg-slate-900 text-white rounded-2xl p-3 border border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCustSidebarOpen(!custSidebarOpen)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl font-bold flex items-center gap-2 border border-slate-700"
                  >
                    <PanelLeft className="w-4 h-4" />
                    <span>{custSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar Rail'}</span>
                  </button>

                  {custSidebarOpen && (
                    <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                      <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase tracking-wider hidden sm:inline">Scale:</span>
                      <button
                        onClick={() => setCustSidebarScale('mini')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all ${
                          custSidebarScale === 'mini' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Mini Icon Rail (72px)"
                      >
                        Mini (72px)
                      </button>
                      <button
                        onClick={() => setCustSidebarScale('compact')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all ${
                          custSidebarScale === 'compact' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Compact Rail (220px)"
                      >
                        Compact (220px)
                      </button>
                      <button
                        onClick={() => setCustSidebarScale('standard')}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all ${
                          custSidebarScale === 'standard' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                        }`}
                        title="Standard Rail (280px)"
                      >
                        Full (280px)
                      </button>
                    </div>
                  )}

                  <span className="text-slate-300 font-bold hidden sm:inline">Active View: <strong className="text-emerald-400">{customerTabs.find(t => t.id === activeTab)?.label}</strong></span>
                </div>

                <button
                  onClick={() => setShowNavLayoutModal(true)}
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  Change Layout
                </button>
              </div>
            </div>
          );
        }

        // LAYOUT 3: CATEGORIZED MEGAMENU COMMAND HUB
        if (navLayoutOption === 'command_hub') {
          return (
            <div className="bg-[#002b29] text-white rounded-2xl p-3 border border-emerald-800 shadow-md space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <Command className="w-4 h-4 text-emerald-400" />
                  <span>Categorized Portal Hub:</span>
                </div>
                <button
                  onClick={() => setShowNavLayoutModal(true)}
                  className="text-xs font-bold text-emerald-300 hover:underline"
                >
                  Layout Option
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {customerCategories.map(cat => {
                  const catTabs = customerTabs.filter(t => t.category === cat);
                  const isCatActive = catTabs.some(t => t.id === activeTab);
                  const isOpen = custMegamenuCat === cat;

                  return (
                    <div key={cat} className="relative">
                      <button
                        onClick={() => setCustMegamenuCat(isOpen ? null : cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                          isCatActive
                            ? 'bg-emerald-400 text-slate-950 font-black'
                            : isOpen
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-950 text-emerald-200 hover:bg-emerald-900'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
                          {catTabs.length}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="absolute left-0 top-11 w-72 bg-slate-950 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 space-y-1 text-white">
                          <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                            {cat} Options
                          </div>
                          {catTabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setActiveTab(tab.id as any);
                                  setSelectedOrder(null);
                                  setCustMegamenuCat(null);
                                }}
                                className={`w-full p-2 rounded-xl text-left flex items-start gap-2.5 transition-all ${
                                  isActive ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40' : 'hover:bg-slate-900 text-slate-300'
                                }`}
                              >
                                <Icon className="w-4 h-4 text-emerald-400 mt-0.5" />
                                <div>
                                  <div className="text-xs font-bold">{tab.label}</div>
                                  <div className="text-[10px] text-slate-400">{tab.description}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        // LAYOUT 4: FLOATING GLASS PILL DOCK
        if (navLayoutOption === 'floating_dock') {
          return (
            <div className="flex justify-center py-2">
              <div className="bg-[#002b29]/90 backdrop-blur-md border border-emerald-700/80 p-2 rounded-3xl shadow-xl flex items-center gap-2 overflow-x-auto max-w-full">
                {customerTabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id as any); setSelectedOrder(null); }}
                      className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-400 text-slate-950 font-black shadow-lg scale-105'
                          : 'text-emerald-100 hover:text-white hover:bg-emerald-900/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.count !== null && <span className="text-[10px] px-1 bg-black/20 rounded-md">{tab.count}</span>}
                    </button>
                  );
                })}

                <button
                  onClick={() => setShowNavLayoutModal(true)}
                  className="p-2 text-emerald-300 hover:text-white hover:bg-emerald-900/60 rounded-xl"
                  title="Layout Options"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        }

        // LAYOUT 5: MINIMAL COMPACT TEXT STRIP
        return (
          <div className="border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold scrollbar-none flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {customerTabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSelectedOrder(null); }}
                    className={`px-3 py-2.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                      isActive ? 'border-[#002b29] text-[#002b29] bg-slate-50 font-extrabold rounded-t-lg' : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400">[{idx + 1}]</span>
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== null && <span className="text-[10px] opacity-75">({tab.count})</span>}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowNavLayoutModal(true)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Layout</span>
            </button>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* THEME & OS LAYOUT CUSTOMIZER MODAL */}
      <ThemeAndLayoutModal
        isOpen={showNavLayoutModal}
        onClose={() => setShowNavLayoutModal(false)}
        currentLayout={navLayoutOption}
        currentTheme={custThemeId}
        onSavePreferences={handleSaveCustomerPreferences}
        userRole="customer"
        userName={user.first_name ? `${user.first_name} ${user.last_name}` : user.email}
      />


      {/* SIDEBAR RAIL & MAIN DATA CONTAINER WRAPPER FOR SIDEBAR_DRAWER LAYOUT */}
      <div className={navLayoutOption === 'sidebar_drawer' ? 'flex flex-col lg:flex-row gap-6 items-start w-full' : 'w-full'}>
        {navLayoutOption === 'sidebar_drawer' && custSidebarOpen && (
          <aside className={`${
            custSidebarScale === 'mini' ? 'w-full lg:w-20' : custSidebarScale === 'compact' ? 'w-full lg:w-56' : 'w-full lg:w-72'
          } shrink-0 bg-[#002b29] text-white rounded-3xl p-4 border border-emerald-800/80 shadow-xl space-y-4 lg:sticky lg:top-24 transition-all duration-300`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-3">
              {custSidebarScale !== 'mini' && (
                <div className="flex items-center gap-2">
                  <PanelLeft className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-xs uppercase tracking-wider text-emerald-100">Customer Rail</span>
                </div>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setCustSidebarScale(custSidebarScale === 'mini' ? 'standard' : 'mini')}
                  className="p-1 hover:bg-emerald-900 rounded-lg text-emerald-300"
                  title={custSidebarScale === 'mini' ? "Expand Rail" : "Minimize Rail"}
                >
                  {custSidebarScale === 'mini' ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => setCustSidebarOpen(false)} className="p-1 hover:bg-emerald-900 rounded-lg text-emerald-300">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter search if standard/compact */}
            {custSidebarScale !== 'mini' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Filter tabs..."
                  value={custSidebarSearch}
                  onChange={e => setCustSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-3">
              {custSidebarScale === 'mini' ? (
                <div className="space-y-2 flex flex-col items-center">
                  {[
                    { id: 'overview', label: 'Account Overview', category: 'Account', icon: User, show: true, count: null },
                    { id: 'orders', label: 'Research Orders', category: 'Orders', icon: Package, show: true, count: customerOrders.length },
                    { id: 'coa', label: 'COA Vault', category: 'Quality', icon: FileCheck, show: dashConfig.show_coa_vault, count: 'PDFs' },
                    { id: 'saved', label: 'Saved Items', category: 'Shopping', icon: Bookmark, show: dashConfig.show_saved_items, count: saveForLaterItems.length },
                    { id: 'addresses', label: 'Address Book', category: 'Shipping', icon: MapPin, show: dashConfig.show_address_book, count: addresses.length },
                    { id: 'rewards', label: 'Rewards Tier', category: 'Account', icon: Award, show: dashConfig.show_rewards_tier, count: '450 pts' },
                    { id: 'support', label: 'Support & FAQ', category: 'Help', icon: HelpCircle, show: dashConfig.show_support_portal, count: null },
                    { id: 'profile', label: 'Profile & Security', category: 'Account', icon: Key, show: dashConfig.show_security_tab !== false, count: null },
                  ].filter(t => t.show).map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setSelectedOrder(null); }}
                        title={`${tab.label} (${tab.category})`}
                        className={`p-2.5 rounded-xl transition-all relative group ${
                          isActive
                            ? 'bg-emerald-400 text-slate-950 font-black shadow-lg ring-2 ring-emerald-300/50'
                            : 'text-emerald-100 hover:bg-emerald-900/80'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                ['Account', 'Orders', 'Quality', 'Shopping', 'Shipping', 'Help'].map(cat => {
                  const catTabs = [
                    { id: 'overview', label: 'Account Overview', category: 'Account', icon: User, show: true, count: null },
                    { id: 'orders', label: 'Research Orders', category: 'Orders', icon: Package, show: true, count: customerOrders.length },
                    { id: 'coa', label: 'COA Vault', category: 'Quality', icon: FileCheck, show: dashConfig.show_coa_vault, count: 'PDFs' },
                    { id: 'saved', label: 'Saved Items', category: 'Shopping', icon: Bookmark, show: dashConfig.show_saved_items, count: saveForLaterItems.length },
                    { id: 'addresses', label: 'Address Book', category: 'Shipping', icon: MapPin, show: dashConfig.show_address_book, count: addresses.length },
                    { id: 'rewards', label: 'Rewards Tier', category: 'Account', icon: Award, show: dashConfig.show_rewards_tier, count: '450 pts' },
                    { id: 'support', label: 'Support & FAQ', category: 'Help', icon: HelpCircle, show: dashConfig.show_support_portal, count: null },
                    { id: 'profile', label: 'Profile & Security', category: 'Account', icon: Key, show: dashConfig.show_security_tab !== false, count: null },
                  ].filter(t => t.show && t.category === cat && (!custSidebarSearch || t.label.toLowerCase().includes(custSidebarSearch.toLowerCase())));

                  if (catTabs.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-2 py-0.5">
                        {cat}
                      </div>
                      {catTabs.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                          <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setSelectedOrder(null); }}
                            className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                              isActive ? 'bg-emerald-400 text-slate-950 font-black shadow-md' : 'text-emerald-100 hover:bg-emerald-900/80'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="truncate">{tab.label}</span>
                            </div>
                            {tab.count !== null && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                                isActive ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-emerald-900 text-emerald-300'
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* Right Data Container - Flex 1 min-w-0 */}
        <div className="flex-1 min-w-0 w-full space-y-8">

      {/* 4. OVERVIEW TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Orders</div>
                <div className="text-2xl font-serif font-bold text-slate-900 mt-1">{customerOrders.length}</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Verified Purchase History</div>
              </div>
              <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Saved Compounds</div>
                <div className="text-2xl font-serif font-bold text-slate-900 mt-1">{saveForLaterItems.length}</div>
                <div className="text-[10px] text-amber-700 font-bold mt-0.5">Wishlist Vault</div>
              </div>
              <div className="p-3.5 bg-amber-50 text-amber-800 rounded-2xl">
                <Bookmark className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Rewards Points</div>
                <div className="text-2xl font-serif font-bold text-amber-600 mt-1">450 Pts</div>
                <div className="text-[10px] text-slate-500 font-bold mt-0.5">$45.00 Credit Balance</div>
              </div>
              <div className="p-3.5 bg-amber-100/60 text-amber-800 rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Support Portal</div>
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Active Support
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Direct Scientific Assistance</div>
              </div>
              <div className="p-3.5 bg-teal-50 text-teal-800 rounded-2xl">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Re-Order Carousel / Grid (if enabled) */}
          {dashConfig.show_quick_reorder && products.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-[#002b29] text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">Fast Re-Stock</span>
                  <h3 className="font-serif font-bold text-xl text-white">Quick Re-Order Featured Compounds</h3>
                </div>
                <button
                  onClick={onNavigateToShop}
                  className="text-xs font-bold text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <span>Explore Full Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.slice(0, 3).map(prod => (
                  <div key={prod.id} className="bg-white/10 backdrop-blur-xs border border-white/10 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-white line-clamp-1">{prod.name}</div>
                      <div className="text-[10px] text-emerald-200 font-mono">SKU: {prod.sku}</div>
                      <div className="text-sm font-extrabold text-amber-300 mt-1">${prod.price.toFixed(2)}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart && onAddToCart(prod, 1)}
                      className="w-full py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Support Callout Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Direct Scientific Support</span>
              <h3 className="font-serif font-bold text-lg text-slate-900">Need Assistance with an Order or COA?</h3>
              <p className="text-xs text-slate-500">
                Contact our customer support team directly at <strong className="text-slate-800 font-mono">{supportEmail}</strong> or call <strong className="text-slate-800 font-mono">{supportPhone}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`mailto:${supportEmail}`}
                className="px-5 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Email Customer Support</span>
              </a>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">Recent Research Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#002b29] hover:underline"
              >
                View Full History ({customerOrders.length})
              </button>
            </div>

            {customerOrders.length === 0 ? (
              <p className="text-slate-500 text-xs py-4">No recent orders found on your account.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {customerOrders.slice(0, 3).map(order => (
                  <div
                    key={order.id}
                    onClick={() => setActiveOrderPopup(order)}
                    className="py-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 font-mono">{order.order_number}</div>
                      <div className="text-slate-400">{new Date(order.created_at).toLocaleDateString()} • {order.items.length} items</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-full text-[10px] uppercase">
                        {order.status}
                      </span>
                      <span className="font-bold text-slate-900">${order.total.toFixed(2)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveOrderPopup(order); }}
                        className="p-1.5 bg-slate-100 hover:bg-[#002b29] hover:text-white rounded-lg transition-colors text-slate-600 cursor-pointer"
                        title="View Detailed Order & Tracking"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. RESEARCH ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {selectedOrder ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-xs text-[#002b29] font-bold hover:underline mb-1 flex items-center gap-1"
                  >
                    <span>← Back to Order History</span>
                  </button>
                  <h2 className="font-serif font-bold text-xl text-slate-900 font-mono">
                    Order {selectedOrder.order_number}
                  </h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveOrderPopup(selectedOrder)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Live Tracker & Invoice Modal</span>
                  </button>

                  <button
                    onClick={() => handleReorderOrder(selectedOrder)}
                    className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Order All Items</span>
                  </button>

                  <span className="px-3.5 py-1.5 bg-[#002b29] text-emerald-300 font-bold text-xs rounded-full uppercase font-mono">
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items & Lab Documents</h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div className="flex gap-3 items-center">
                        {item.image_snapshot && (
                          <img src={item.image_snapshot} alt="" className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.product_name_snapshot}</div>
                          <div className="text-slate-500 font-mono">SKU: {item.sku_snapshot}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-auto sm:ml-0">
                        <a
                          href={`mailto:${supportEmail}?subject=COA Request for SKU ${item.sku_snapshot} (Order ${selectedOrder.order_number})`}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-800 font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Request COA</span>
                        </a>

                        <div className="text-right">
                          <div className="font-bold text-slate-900">${item.subtotal.toFixed(2)}</div>
                          <div className="text-slate-400 text-[11px]">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment Info */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm mb-1">Shipping Destination</div>
                  <div>{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</div>
                  <div>{selectedOrder.shipping_address.address_line_1}</div>
                  <div>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.postal_code}</div>
                  <div>{selectedOrder.shipping_address.country}</div>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm mb-1">Carrier Tracking & Support</div>
                  <div>Carrier: <strong className="text-slate-800">{selectedOrder.carrier || 'Standard Courier Express'}</strong></div>
                  <div>
                    Tracking #: <strong className="text-slate-800 font-mono">{selectedOrder.tracking_number || 'Pending Dispatch'}</strong>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveOrderPopup(selectedOrder)}
                      className="text-emerald-800 font-bold underline flex items-center gap-1 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Track shipment & milestones</span>
                    </button>
                    <a
                      href={`mailto:${supportEmail}?subject=Order Inquiry ${selectedOrder.order_number}`}
                      className="text-slate-600 hover:text-slate-900 font-bold underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Contact scientific support</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <h2 className="font-serif font-bold text-lg text-slate-900">Research Order History</h2>
                  <p className="text-xs text-slate-500">
                    Click any order row or click "Track & Invoice" to open the live tracking milestones and commercial invoice popup.
                  </p>
                </div>
                <span className="text-xs text-emerald-800 font-bold font-mono bg-emerald-50 px-3 py-1 rounded-xl self-start sm:self-auto">
                  {customerOrders.length} Completed Orders
                </span>
              </div>

              {customerOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-slate-500 text-sm">No research orders placed yet.</p>
                  <button
                    onClick={onNavigateToShop}
                    className="px-5 py-2.5 bg-[#002b29] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customerOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => setActiveOrderPopup(order)}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-emerald-50/40 p-3 rounded-2xl transition-all group border border-transparent hover:border-emerald-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white rounded-xl text-slate-700 transition-colors shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 font-mono text-sm group-hover:text-emerald-950">
                              #{order.order_number}
                            </span>
                            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold rounded-full text-[10px] uppercase">
                              {order.status}
                            </span>
                            {order.fulfillment_status && (
                              <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                {order.fulfillment_status}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • {order.items.length} items • <strong className="font-mono text-slate-900">${order.total.toFixed(2)}</strong>
                          </div>
                          {order.tracking_number && (
                            <div className="text-[11px] text-emerald-800 font-mono font-semibold pt-0.5 flex items-center gap-1">
                              <Truck className="w-3 h-3 text-emerald-600" />
                              <span>Tracking: {order.tracking_number}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveOrderPopup(order);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Track & Invoice</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorderOrder(order);
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. COA & LAB REPORTS VAULT TAB */}
      {activeTab === 'coa' && dashConfig.show_coa_vault && (
        <div className="space-y-8">
          {/* Section A: Digital Asset & Storage Access Vault */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">Access Control Vault</span>
                <h2 className="font-serif font-bold text-xl text-slate-900">My Digital Downloads & Unlocked Assets</h2>
                <p className="text-xs text-slate-500">Access files automatically granted via product purchases, admin assignments, or registered membership.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={coaSearch}
                  onChange={e => setCoaSearch(e.target.value)}
                  placeholder="Search file title or category..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                />
              </div>
            </div>

            {loadingAssets ? (
              <div className="text-center py-8 text-xs text-slate-400 font-bold flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Checking asset access permissions...</span>
              </div>
            ) : userAssets.length === 0 ? (
              <p className="text-slate-400 text-xs py-6 text-center">No digital assets found in vault.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userAssets
                  .filter(ua => !coaSearch || ua.downloadable.title.toLowerCase().includes(coaSearch.toLowerCase()) || ua.downloadable.filename.toLowerCase().includes(coaSearch.toLowerCase()))
                  .map(({ downloadable: item, isGranted, grantReason }) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                        isGranted
                          ? 'bg-slate-50 border-slate-200 hover:border-emerald-500/50'
                          : 'bg-slate-50/60 border-slate-200/60 opacity-70'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] font-bold rounded-md uppercase">
                            {item.category} • {item.platform}
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            isGranted ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isGranted ? <ShieldCheck className="w-3 h-3 text-emerald-700" /> : <Lock className="w-3 h-3 text-slate-500" />}
                            <span>{grantReason}</span>
                          </span>
                        </div>

                        <div className="font-bold text-slate-900 text-sm font-serif">{item.title}</div>
                        <div className="text-[11px] font-mono text-slate-500">
                          File: <code className="bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-800">{item.filename}</code> ({item.file_size})
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                        {isGranted ? (
                          <>
                            {/* Immediate Email Button */}
                            <button
                              type="button"
                              onClick={() => handleSendAssetToMyEmail(item.id, item.title)}
                              disabled={sendingEmailAssetId === item.id}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{sendingEmailAssetId === item.id ? 'Sending...' : 'Email Copy to Me'}</span>
                            </button>

                            {/* Direct Download Button */}
                            <a
                              href={item.download_url}
                              download={item.filename}
                              onClick={() => api.incrementDownloadCount(item.id)}
                              className="px-3 py-1.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold text-[11px] rounded-xl flex items-center gap-1 shadow-xs"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download File</span>
                            </a>
                          </>
                        ) : (
                          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5 text-slate-400" /> Requires product purchase or admin grant
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Section B: Standard Certificates of Analysis */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Standard Catalog Certificates of Analysis</h3>
              <p className="text-xs text-slate-500">Lot-specific HPLC chromatography and Mass Spectrometry purity verification reports.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { sku: 'BK-PEP-157', name: 'BPC-157 Analytical Reference Compound (5mg)', lot: 'LOT-2026-9921', purity: '99.82% HPLC Verified', date: '2026-07-15' },
                { sku: 'BK-PEP-3RT', name: 'GLP-3RT Triple Agonist Compound (10mg)', lot: 'LOT-2026-8819', purity: '99.91% LC-MS Verified', date: '2026-08-01' },
                { sku: 'BK-CEL-100', name: 'High-Glucose Modified Cell Culture Buffer (500mL)', lot: 'LOT-2026-7712', purity: 'Sterile Filtered 0.1μm', date: '2026-06-20' },
                { sku: 'BK-MET-500', name: 'NAD+ Ultra Pure Coenzyme Standard (500mg)', lot: 'LOT-2026-6641', purity: '99.75% HPLC Verified', date: '2026-07-28' },
              ]
              .filter(item => !coaSearch || item.name.toLowerCase().includes(coaSearch.toLowerCase()) || item.sku.toLowerCase().includes(coaSearch.toLowerCase()))
              .map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-mono font-bold text-emerald-800 text-[11px]">{item.sku} • {item.lot}</div>
                    <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                    <div className="text-[11px] text-slate-500">Purity: <span className="font-bold text-emerald-700">{item.purity}</span></div>
                    <div className="text-[10px] text-slate-400">Certified Date: {item.date}</div>
                  </div>

                  <a
                    href={`mailto:${supportEmail}?subject=Download Official PDF COA for ${item.sku} ${item.lot}`}
                    className="px-3 py-1.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold text-[11px] rounded-xl flex items-center gap-1 shrink-0 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Report PDF</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. SAVED ITEMS / WISHLIST TAB */}
      {activeTab === 'saved' && dashConfig.show_saved_items && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900">Saved Items & Wishlist</h2>
              <p className="text-xs text-slate-500">Quickly re-visit research compounds saved for future acquisition.</p>
            </div>
            <button
              onClick={() => onNavigateToSaveForLater()}
              className="text-xs font-bold text-[#002b29] hover:underline"
            >
              Manage Saved Items →
            </button>
          </div>

          {saveForLaterItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs space-y-2">
              <p>Your wishlist is currently empty.</p>
              <button onClick={onNavigateToShop} className="px-4 py-2 bg-[#002b29] text-white font-bold rounded-xl">
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {saveForLaterItems.map(item => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{item.product?.name || 'Saved Product'}</div>
                    <div className="text-slate-400 font-mono text-[11px]">SKU: {item.product?.sku}</div>
                    <div className="font-bold text-slate-900 text-sm mt-1">${(item.product?.price ?? 0).toFixed(2)}</div>
                  </div>

                  <button
                    onClick={() => item.product && onAddToCart && onAddToCart(item.product, 1)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. ADDRESS BOOK TAB */}
      {activeTab === 'addresses' && dashConfig.show_address_book && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-serif font-bold text-xl text-slate-900">Saved Address Book</h2>
              <p className="text-xs text-slate-500">Manage laboratory delivery locations and institutional billing addresses.</p>
            </div>

            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 bg-[#002b29] text-white font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(addr => (
              <div key={addr.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs relative">
                {addr.is_default && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[9px] rounded-full uppercase">
                    Default Destination
                  </span>
                )}
                <div className="font-bold text-slate-900 text-sm">{addr.first_name} {addr.last_name}</div>
                <div className="text-slate-600">{addr.address_line_1}</div>
                <div className="text-slate-600">{addr.city}, {addr.state} {addr.postal_code}</div>
                <div className="text-slate-600">{addr.country}</div>
                {addr.phone && <div className="text-slate-400 font-mono text-[11px]">{addr.phone}</div>}
              </div>
            ))}
          </div>

          {/* Modal Add Address */}
          {showAddressModal && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
                <h3 className="text-base font-serif font-bold text-slate-900">Add New Delivery Location</h3>

                <form onSubmit={handleSaveAddress} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.first_name}
                        onChange={e => setNewAddr({ ...newAddr, first_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={newAddr.last_name}
                        onChange={e => setNewAddr({ ...newAddr, last_name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      value={newAddr.address_line_1}
                      onChange={e => setNewAddr({ ...newAddr, address_line_1: e.target.value })}
                      placeholder="100 Science Way, Suite 200"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.city}
                        onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.state}
                        onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Zip *</label>
                      <input
                        type="text"
                        required
                        value={newAddr.postal_code}
                        onChange={e => setNewAddr({ ...newAddr, postal_code: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={newAddr.is_default}
                      onChange={e => setNewAddr({ ...newAddr, is_default: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-bold text-slate-700">Set as Default Shipping Address</span>
                  </label>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="w-1/2 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2 bg-[#002b29] text-white font-bold rounded-xl"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. REWARDS TIER TAB */}
      {activeTab === 'rewards' && dashConfig.show_rewards_tier && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-2.5 py-0.5 rounded-full">
                Research Rewards Tier
              </span>
              <h2 className="text-2xl font-serif font-bold mt-1">Platinum Researcher Status</h2>
              <p className="text-xs text-slate-900 font-medium">Earn 5 points on every $1 spent towards future lab supplies.</p>
            </div>

            <div className="bg-slate-950 text-white p-4 rounded-xl text-center shrink-0">
              <div className="text-2xl font-black text-amber-400 font-serif">450 PTS</div>
              <div className="text-[10px] text-slate-300 font-bold">$45.00 Store Credit</div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h3 className="font-serif font-bold text-slate-900 text-base">Referral Link & Academic Discount Rewards</h3>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900">Your Institutional Referral Link</div>
                <div className="text-slate-500 text-[11px]">Share with colleagues to earn 100 bonus points ($10 credit) per referral.</div>
              </div>
              <button
                onClick={handleCopyReferral}
                className="px-4 py-2 bg-[#002b29] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0"
              >
                {copiedReferral ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReferral ? 'Link Copied!' : 'Copy Referral Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. SCIENTIFIC SUPPORT & FAQ PORTAL TAB */}
      {activeTab === 'support' && dashConfig.show_support_portal && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-widest">Customer Support Center</span>
                <h2 className="font-serif font-bold text-xl text-slate-900">Scientific Support & Customer Service</h2>
                <p className="text-xs text-slate-500">Contact our lab specialists or submit an inquiry ticket directly.</p>
              </div>

              {/* Direct Customer Support Email Badge */}
              <a
                href={`mailto:${supportEmail}`}
                className="px-4 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Email Support: {supportEmail}</span>
              </a>
            </div>

            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="font-bold text-emerald-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Customer Support Email</span>
                </div>
                <a href={`mailto:${supportEmail}`} className="font-mono text-emerald-800 font-bold block hover:underline">
                  {supportEmail}
                </a>
                <p className="text-[10px] text-slate-500">Clicking opens your mail application directly.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-700" />
                  <span>Support Hotline</span>
                </div>
                <div className="font-mono text-slate-800 font-bold">{supportPhone}</div>
                <p className="text-[10px] text-slate-500">Toll-free customer service line.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700" />
                  <span>Operating Hours</span>
                </div>
                <div className="text-slate-800 font-semibold">{dashConfig.support_hours}</div>
                <p className="text-[10px] text-slate-500">Priority cold-chain support team.</p>
              </div>
            </div>

            {/* Inquiry Submission Form */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-serif font-bold text-slate-900 text-base">Submit Support Inquiry Ticket</h3>

              {ticketSubmitted ? (
                <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Your support ticket has been received! Our lab specialists will email you at {user.email}.</span>
                </div>
              ) : (
                <form onSubmit={handleSendSupportTicket} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Inquiry Subject *</label>
                      <input
                        type="text"
                        required
                        value={ticketForm.subject}
                        onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        placeholder="e.g. COA Verification / Expedited Cold-Chain Request"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category</label>
                      <select
                        value={ticketForm.category}
                        onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                      >
                        <option value="Order Inquiry">Order Inquiry</option>
                        <option value="COA / Lab Report">COA / Lab Report Request</option>
                        <option value="Technical Specification">Technical Compound Specification</option>
                        <option value="Billing & PO">Institutional Billing & PO</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Detailed Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={ticketForm.message}
                      onChange={e => setTicketForm({ ...ticketForm, message: e.target.value })}
                      placeholder="Please describe your question or research inquiry..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#002b29]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold rounded-xl flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry Ticket</span>
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Knowledge Base */}
            {dashConfig.custom_faq_items && dashConfig.custom_faq_items.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-serif font-bold text-slate-900 text-base">Frequently Asked Questions</h3>
                <div className="space-y-3 text-xs">
                  {dashConfig.custom_faq_items.map(faq => (
                    <div key={faq.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                        {faq.category || 'General'}
                      </span>
                      <div className="font-bold text-slate-900 text-sm mt-1">{faq.question}</div>
                      <p className="text-slate-600 text-xs leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. PROFILE & SECURITY TAB */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-serif font-bold text-xl text-slate-900">Profile & Security Credentials</h2>
            <p className="text-xs text-slate-500">Update account contact information and security settings.</p>
          </div>

          {profileSavedMsg && (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>✓ Profile credentials updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.first_name}
                  onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.last_name}
                  onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution / Organization</label>
              <input
                type="text"
                value={profileForm.organization}
                onChange={e => setProfileForm({ ...profileForm, organization: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#002b29] text-white font-bold rounded-xl shadow-md cursor-pointer hover:bg-[#003d3a] transition-all"
            >
              Save Profile Changes
            </button>
          </form>

          {/* Master Account Security Section: TOTP MFA, Hardware Keys, Device Sessions */}
          <div className="pt-6 border-t border-slate-100">
            <AccountSecuritySection
              user={user}
              userEmail={user.email}
              userRole={user.role || 'customer'}
            />
          </div>
        </div>
      )}

      {/* 12. OPERATIONS & USER GUIDE TAB */}
      {activeTab === 'guide' && (
        <UserGuideView initialRole="customer" />
      )}

        </div>
      </div>

      {/* Detailed Order Tracking & History Pop-up Modal */}
      {activeOrderPopup && (
        <CustomerOrderDetailsModal
          order={activeOrderPopup}
          supportEmail={supportEmail}
          onClose={() => setActiveOrderPopup(null)}
          onReorder={handleReorderOrder}
        />
      )}
    </div>
  );
};
