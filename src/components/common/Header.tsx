import React, { useState } from 'react';
import { Search, ShoppingBag, Bookmark, User, Globe, Shield, Menu, X, Smartphone, Monitor, ChevronDown, Download, QrCode, Check, Copy, ShieldCheck, FileText, BookOpen, Layers, ExternalLink, Maximize2, ZoomIn, ZoomOut, RotateCcw, Sliders, Sparkles, LogOut, LayoutDashboard, Home } from 'lucide-react';
import { Logo } from './Logo';
import { UserProfile, LanguageCode, DeviceMode, SiteSettings, Product, ProductCategory, Order, SaveForLaterItem, CustomPage } from '../../types';
import { useTranslation, translatePage } from '../../lib/i18n';
import { useAutoScale } from '../../lib/autoScale';
import { TopMenuPopupModal, TopMenuPopupType } from './TopMenuPopupModal';
import { GoogleLanguageSwitcher } from './GoogleLanguageSwitcher';
import { buildAppUrl, getRoleDefaultDashboardUrl, getRoleDashboardLabel, handleSmartLinkClick } from '../../lib/navigation';

interface HeaderProps {
  user: UserProfile | null;
  cartCount: number;
  saveForLaterCount: number;
  currentLang?: LanguageCode;
  onSelectLang?: (lang: LanguageCode) => void;
  deviceMode: DeviceMode;
  onSelectDeviceMode: (mode: DeviceMode) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  onNavigate: (view: string) => void;
  currentView?: string;
  settings?: SiteSettings;
  isAdminMode?: boolean;
  onToggleAdminMode?: () => void;
  onSignOut?: () => void;
  products?: Product[];
  categories?: ProductCategory[];
  orders?: Order[];
  saveForLaterItems?: SaveForLaterItem[];
  onAddToCart?: (product: Product, quantity: number) => void;
  onToggleSaveForLater?: (product: Product) => void;
  activeTopPopup?: TopMenuPopupType;
  onSelectTopPopup?: (popup: TopMenuPopupType) => void;
  customPages?: CustomPage[];
  activeCustomPageSlug?: string | null;
  onSelectCustomPage?: (page: CustomPage, mode: 'page' | 'popup') => void;
  onOpenMultiTabHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  cartCount,
  saveForLaterCount,
  currentLang,
  onSelectLang,
  deviceMode = 'web',
  onSelectDeviceMode = (_mode: DeviceMode) => {},
  onOpenSearch = () => {},
  onOpenCart = () => {},
  onNavigate = (_view: string) => {},
  currentView = 'home',
  settings,
  isAdminMode = false,
  onToggleAdminMode = () => {},
  onSignOut = () => {},
  products = [],
  categories = [],
  orders = [],
  saveForLaterItems = [],
  onAddToCart,
  onToggleSaveForLater,
  activeTopPopup = null,
  onSelectTopPopup,
  customPages = [],
  activeCustomPageSlug = null,
  onSelectCustomPage,
  onOpenMultiTabHub,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const activeLang = (currentLang || language || 'en') as LanguageCode;

  const handleLanguageSelect = (lang: LanguageCode) => {
    if (onSelectLang) {
      onSelectLang(lang);
    }
    setLanguage(lang);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [deviceDropdownOpen, setDeviceDropdownOpen] = useState(false);
  const [scaleDropdownOpen, setScaleDropdownOpen] = useState(false);

  const {
    enabled: autoScaleEnabled,
    setEnabled: setAutoScaleEnabled,
    scaleMode: autoScaleMode,
    setScaleMode: setAutoScaleMode,
    scalePercent: autoScalePercent,
    setManualPercent: setAutoManualPercent,
    zoomIn: autoZoomIn,
    zoomOut: autoZoomOut,
    resetScale: autoResetScale,
    windowSize: autoWindowSize,
  } = useAutoScale();

  // Helper to determine whether an item should open as page or popup based on admin theme settings
  const getNavMode = (itemId: string): 'page' | 'popup' => {
    let item: any = undefined;
    const menuItems = settings?.navigation_config?.menu_items;
    if (Array.isArray(menuItems)) {
      item = menuItems.find((m: any) => m?.id === itemId);
    } else if (menuItems && typeof menuItems === 'object') {
      item = (menuItems as Record<string, any>)[itemId];
    }

    if (item && item.mode && item.mode !== 'default') {
      return item.mode;
    }
    return settings?.navigation_config?.global_mode || 'page';
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetUrl: string,
    itemId: string,
    defaultPage: string,
    defaultPopup: TopMenuPopupType
  ) => {
    const mode = getNavMode(itemId);
    if (mode === 'page') {
      handleSmartLinkClick(e, targetUrl, () => {
        onSelectTopPopup?.(null);
        onNavigate(defaultPage);
      });
    } else {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
        return;
      }
      e.preventDefault();
      onSelectTopPopup?.(activeTopPopup === defaultPopup ? null : defaultPopup);
    }
  };

  const roleDashboardUrl = getRoleDefaultDashboardUrl(user?.role);
  const roleDashboardInfo = getRoleDashboardLabel(user?.role);

  return (
    <header className="sticky top-0 z-40 bg-[#050807]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      {/* Top Compliance & Admin Announcement Bar */}
      <div className={`px-4 py-1.5 text-xs font-semibold text-center transition-colors flex items-center justify-between border-b ${
        isAdminMode
          ? 'bg-amber-950/80 text-amber-200 border-amber-800/50'
          : 'bg-[#002b29] text-emerald-100 border-emerald-900/50'
      }`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="truncate">
              {user ? (
                <span className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    user.role === 'owner'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : user.role === 'admin'
                      ? 'bg-emerald-500 text-slate-950 shadow-xs'
                      : user.role === 'employee'
                      ? 'bg-indigo-500 text-white shadow-xs'
                      : 'bg-teal-700 text-teal-100'
                  }`}>
                    {user.role === 'owner' && (
                      <span className="flex items-center gap-1">
                        <span>👑</span>
                        <span>{t('OWNER')}</span>
                      </span>
                    )}
                    {user.role === 'admin' && (
                      <span className="flex items-center gap-1">
                        <span>⚡</span>
                        <span>{t('ADMIN')}</span>
                      </span>
                    )}
                    {user.role === 'employee' && (
                      <span className="flex items-center gap-1">
                        <span>📦</span>
                        <span>{t('EMPLOYEE')}</span>
                      </span>
                    )}
                    {user.role === 'customer' && (
                      <span className="flex items-center gap-1">
                        <span>🔬</span>
                        <span>{t('CUSTOMER')}</span>
                      </span>
                    )}
                  </span>
                  <span>
                    {t('LOGGED IN AS')} {user.first_name.toUpperCase()} {user.last_name.toUpperCase()} ({user.email})
                  </span>
                </span>
              ) : (
                t(settings?.tagline || 'Precision Compounds & Certified Reference Standards')
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-Tab Workspace Launcher Trigger */}
            <button
              onClick={() => onOpenMultiTabHub?.()}
              className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 transition-all shadow-xs hover:scale-105 cursor-pointer"
              title="Open Multi-Tab Feature Hub & Launch Tools"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Multi-Tab Hub</span>
            </button>

            {/* Unified Mobile Apps & QR Code Popup Trigger Button */}
            <button
              onClick={() => onSelectTopPopup?.(activeTopPopup === 'qr' || activeTopPopup === 'ios' || activeTopPopup === 'android' ? null : 'qr')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 cursor-pointer ${
                activeTopPopup === 'qr' || activeTopPopup === 'ios' || activeTopPopup === 'android'
                  ? 'bg-emerald-500 text-slate-950 font-black border border-emerald-300'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400/40'
              }`}
              title={t('Mobile Apps & Lot QR Verification')}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t('Apps & QR')}</span>
            </button>

            {/* Role-Specific Dashboard / Portal Button (Displayed after user logs in) */}
            {user && (
              <a
                href={roleDashboardUrl}
                onClick={(e) => {
                  handleSmartLinkClick(e, roleDashboardUrl, () => {
                    onToggleAdminMode();
                  });
                }}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm hover:scale-105 cursor-pointer ${
                  user.role === 'owner'
                    ? isAdminMode
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-black'
                      : 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-400/40'
                    : user.role === 'admin'
                    ? isAdminMode
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black'
                      : 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-400/40'
                    : user.role === 'employee'
                    ? isAdminMode
                      ? 'bg-indigo-500 text-white hover:bg-indigo-400 font-black'
                      : 'bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-400/40'
                    : currentView === 'customer-portal'
                    ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 font-black'
                    : 'bg-teal-500/20 hover:bg-teal-500/35 text-teal-300 border border-teal-400/40'
                }`}
                title={t(`Open ${user.role.toUpperCase()} Dashboard (Ctrl+Click for new tab)`)}
              >
                {user.role === 'owner' && (
                  <>
                    <span>👑</span>
                    <span>{isAdminMode ? t('Exit Dashboard') : t('Owner Dashboard')}</span>
                  </>
                )}
                {user.role === 'admin' && (
                  <>
                    <span>⚡</span>
                    <span>{isAdminMode ? t('Exit Admin') : t('Admin Dashboard')}</span>
                  </>
                )}
                {user.role === 'employee' && (
                  <>
                    <span>📦</span>
                    <span>{isAdminMode ? t('Exit Portal') : t('Fulfillment Portal')}</span>
                  </>
                )}
                {user.role === 'customer' && (
                  <>
                    <span>🔬</span>
                    <span>{currentView === 'customer-portal' ? t('Exit Portal') : t('Customer Dashboard')}</span>
                  </>
                )}
              </a>
            )}

            {/* Combined Device View Dropdown Selector (Staff Only) */}
            {user && ['owner', 'admin', 'employee'].includes(user.role) && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setDeviceDropdownOpen(!deviceDropdownOpen)}
                  className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all bg-black/50 hover:bg-black/70 text-slate-200 border border-white/20 shadow-xs"
                  title={t('Select Device Viewport Mode')}
                >
                  {deviceMode === 'web' && <Monitor className="w-3 h-3 text-emerald-400" />}
                  {deviceMode === 'ios' && <Smartphone className="w-3 h-3 text-blue-400" />}
                  {deviceMode === 'android' && <Smartphone className="w-3 h-3 text-emerald-400" />}
                  <span>{t('Device View')}</span>
                  <span className="text-[9px] text-emerald-300 font-mono font-normal">
                    ({deviceMode === 'web' ? t('Web') : deviceMode === 'ios' ? 'iOS' : 'Android'})
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${deviceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {deviceDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1 w-52 bg-[#0a100e] border border-emerald-500/40 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 text-slate-100"
                    onClick={() => setDeviceDropdownOpen(false)}
                  >
                    <div className="px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest text-slate-400 border-b border-white/5 flex items-center justify-between">
                      <span>{t('Display Viewport')}</span>
                      <span className="text-[8px] text-emerald-400 font-mono">{t('3 MODES')}</span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectDeviceMode('web');
                        setDeviceDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        deviceMode === 'web' ? 'bg-emerald-950/80 text-emerald-300 font-bold' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('Web Desktop View')}</span>
                      </span>
                      {deviceMode === 'web' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => {
                        onSelectDeviceMode('ios');
                        setDeviceDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        deviceMode === 'ios' ? 'bg-blue-950/80 text-blue-300 font-bold' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                        <span>{t('Apple iOS Frame')}</span>
                      </span>
                      {deviceMode === 'ios' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>

                    <button
                      onClick={() => {
                        onSelectDeviceMode('android');
                        setDeviceDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        deviceMode === 'android' ? 'bg-emerald-950/80 text-emerald-300 font-bold' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('Android Frame')}</span>
                      </span>
                      {deviceMode === 'android' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Direct Log Out Button in Top Utility Bar */}
            {user && (
              <button
                id="topbar-logout-btn"
                onClick={onSignOut}
                className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-800/60 shadow-xs hover:scale-105 cursor-pointer"
                title={t('nav.sign_out')}
              >
                <LogOut className="w-3 h-3 text-red-400" />
                <span>{t('nav.sign_out')}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo with flexible container to auto-scale */}
        <a
          id="header-logo-btn"
          href={buildAppUrl({ view: 'home' })}
          onClick={(e) => {
            handleSmartLinkClick(e, buildAppUrl({ view: 'home' }), () => {
              onSelectTopPopup?.(null);
              onNavigate('home');
            });
          }}
          className="shrink-0 min-w-0 cursor-pointer"
          title="Return to BK Research Labs Home (Ctrl+Click for new tab)"
        >
          <Logo size="md" showTagline={false} logoUrl={settings?.logo_url} siteName={settings?.site_name} />
        </a>

        {/* Navigation Desktop Links */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs uppercase tracking-[0.12em] font-medium text-slate-300">
          <a
            id="nav-link-home"
            href={buildAppUrl({ view: 'home' })}
            onClick={(e) => {
              handleSmartLinkClick(e, buildAppUrl({ view: 'home' }), () => {
                onSelectTopPopup?.(null);
                onNavigate('home');
              });
            }}
            className={`hover:text-emerald-400 transition-all pb-1 cursor-pointer flex items-center gap-1 ${
              currentView === 'home' && !activeTopPopup ? 'text-white border-b-2 border-emerald-500 font-bold' : ''
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('nav.home')}</span>
          </a>

          {/* Universal Dashboard Link in Main Nav Bar */}
          <a
            id="nav-link-universal-dashboard"
            href={roleDashboardUrl}
            onClick={(e) => {
              handleSmartLinkClick(e, roleDashboardUrl, () => {
                if (!user) {
                  onNavigate('login');
                } else if (user.role === 'customer') {
                  onNavigate('customer-portal');
                } else {
                  onNavigate('admin');
                }
              });
            }}
            className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
              currentView === 'admin' || currentView === 'customer-portal'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-950/50 scale-105'
                : 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 font-bold'
            }`}
            title={`Open ${roleDashboardInfo.title} (Ctrl+Click for new tab)`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('Dashboard')}</span>
          </a>

          <a
            id="nav-link-shop"
            href={buildAppUrl({ view: 'shop' })}
            onClick={(e) => handleNavClick(e, buildAppUrl({ view: 'shop' }), 'shop', 'shop', 'shop')}
            className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
              activeTopPopup === 'shop'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-950/50 scale-105'
                : currentView === 'shop' && !activeTopPopup
                ? 'text-white border-emerald-500/50 bg-emerald-950/40 font-bold'
                : 'text-slate-300 border-transparent hover:text-emerald-400 hover:border-emerald-500/30'
            }`}
            title={t('Shop Product Catalog')}
          >
            <span>{t('nav.shop')}</span>
          </a>

          <a
            id="nav-link-categories"
            href={buildAppUrl({ view: 'shop' })}
            onClick={(e) => handleNavClick(e, buildAppUrl({ view: 'shop' }), 'categories', 'categories', 'categories')}
            className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
              activeTopPopup === 'categories'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-950/50 scale-105'
                : currentView === 'categories' && !activeTopPopup
                ? 'text-white border-emerald-500/50 bg-emerald-950/40 font-bold'
                : 'text-slate-300 border-transparent hover:text-emerald-400 hover:border-emerald-500/30'
            }`}
            title={t('Browse Chemical Categories')}
          >
            <span>{t('nav.categories')}</span>
          </a>

          <a
            id="nav-link-save-for-later"
            href={buildAppUrl({ view: 'save-for-later' })}
            onClick={(e) => handleNavClick(e, buildAppUrl({ view: 'save-for-later' }), 'save-for-later', 'save-for-later', 'save-for-later')}
            className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
              activeTopPopup === 'save-for-later'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-950/50 scale-105'
                : currentView === 'save-for-later' && !activeTopPopup
                ? 'text-white border-emerald-500/50 bg-emerald-950/40 font-bold'
                : 'text-slate-300 border-transparent hover:text-emerald-400 hover:border-emerald-500/30'
            }`}
            title={t('Saved Reference Compounds')}
          >
            <span>{t('nav.save_for_later')}</span>
            {saveForLaterCount > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTopPopup === 'save-for-later'
                  ? 'bg-slate-950 text-emerald-300'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
              }`}>
                {saveForLaterCount}
              </span>
            )}
          </a>

          <a
            id="nav-link-orders"
            href={buildAppUrl({ view: 'customer-portal', tab: 'orders' })}
            onClick={(e) => handleNavClick(e, buildAppUrl({ view: 'customer-portal', tab: 'orders' }), 'orders', 'orders', 'orders')}
            className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
              activeTopPopup === 'orders'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-950/50 scale-105'
                : (currentView === 'customer-portal' || currentView === 'account') && !activeTopPopup
                ? 'text-white border-emerald-500/50 bg-emerald-950/40 font-bold'
                : 'text-slate-300 border-transparent hover:text-emerald-400 hover:border-emerald-500/30'
            }`}
            title={t('Orders & Lot COA Vault')}
          >
            <span>{t('nav.orders')}</span>
          </a>

          {/* Custom Pages Added by Admin with show_in_header */}
          {customPages.filter(p => p.show_in_header && p.status === 'published').map(page => {
            const locPage = translatePage(page, activeLang);
            const isPageActive = currentView === 'custom-page' && activeCustomPageSlug === page.slug && !activeTopPopup;
            const pageUrl = buildAppUrl({ view: 'custom-page', page: page.slug });
            return (
              <a
                key={page.id}
                id={`nav-link-page-${page.slug}`}
                href={pageUrl}
                onClick={(e) => {
                  const mode = page.header_nav_mode || settings?.navigation_config?.global_mode || 'page';
                  if (mode === 'popup') {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
                    e.preventDefault();
                    onSelectCustomPage?.(page, 'popup');
                  } else {
                    handleSmartLinkClick(e, pageUrl, () => {
                      if (onSelectCustomPage) {
                        onSelectCustomPage(page, 'page');
                      } else {
                        onNavigate(`custom-page:${page.slug}`);
                      }
                    });
                  }
                }}
                className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
                  isPageActive
                    ? 'text-white border-emerald-500/50 bg-emerald-950/40 font-bold'
                    : 'text-slate-300 border-transparent hover:text-emerald-400 hover:border-emerald-500/30'
                }`}
                title={locPage.title}
              >
                <span>{locPage.title}</span>
              </a>
            );
          })}

          <a
            id="nav-link-guide"
            href={buildAppUrl({ view: 'guide' })}
            onClick={(e) => handleNavClick(e, buildAppUrl({ view: 'guide' }), 'guide', 'guide', 'guide')}
            className={`transition-all px-3 py-1.5 rounded-full border flex items-center gap-1.5 cursor-pointer ${
              activeTopPopup === 'guide'
                ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-950/50 scale-105'
                : currentView === 'guide' && !activeTopPopup
                ? 'text-white border-emerald-500/50 bg-emerald-950/40 font-bold'
                : 'text-slate-300 border-transparent hover:text-emerald-400 hover:border-emerald-500/30'
            }`}
            title={t('Open User Guide Documentation')}
          >
            <span>{t('nav.guide')}</span>
          </a>
        </nav>

        {/* Master Search Bar Trigger & Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Master Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-full text-xs font-medium transition-all border border-white/10 hover:border-emerald-500/50"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t('nav.search_placeholder')}</span>
            <span className="hidden md:inline text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 font-mono text-slate-400">
              ⌘K
            </span>
          </button>

          {/* QR Code Popup Trigger Button */}
          <button
            onClick={() => onSelectTopPopup?.(activeTopPopup === 'qr' ? null : 'qr')}
            className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-bold ${
              activeTopPopup === 'qr'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title={t('Scan Lot QR Code / Mobile App')}
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden xl:inline text-[10px] font-mono uppercase text-emerald-300">{t('QR Code')}</span>
          </button>

          {/* Language Selector */}
          <GoogleLanguageSwitcher
            currentLang={activeLang}
            onSelectLang={handleLanguageSelect}
            variant="header"
          />

          {/* Global Auto-Scale Responsive Quick HUD */}
          <div className="relative">
            <button
              id="header-autoscale-btn"
              onClick={() => setScaleDropdownOpen(!scaleDropdownOpen)}
              className={`p-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer ${
                autoScaleEnabled
                  ? 'text-emerald-300 hover:text-white hover:bg-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={t('Auto Scale Screen Size Settings')}
            >
              <Maximize2 className={`w-4 h-4 ${autoScaleEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span className="hidden xl:inline text-[11px]">
                {autoScaleEnabled ? `${autoScalePercent}%` : '100%'}
              </span>
            </button>

            {scaleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0a0f0e] rounded-2xl shadow-2xl border border-emerald-500/40 p-4 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Auto-Scale Settings</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60 font-bold">
                    {autoScalePercent}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Auto-Scale Global:</span>
                  <button
                    onClick={() => setAutoScaleEnabled(!autoScaleEnabled)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${
                      autoScaleEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {autoScaleEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 font-mono">
                  Window: {autoWindowSize.width}px × {autoWindowSize.height}px
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Scale Strategy</div>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <button
                      onClick={() => setAutoScaleMode('auto')}
                      className={`py-1 rounded border transition-colors cursor-pointer ${
                        autoScaleMode === 'auto' ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold' : 'border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Auto %
                    </button>
                    <button
                      onClick={() => setAutoScaleMode('fit-width')}
                      className={`py-1 rounded border transition-colors cursor-pointer ${
                        autoScaleMode === 'fit-width' ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold' : 'border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Fit Width
                    </button>
                    <button
                      onClick={() => setAutoScaleMode('manual')}
                      className={`py-1 rounded border transition-colors cursor-pointer ${
                        autoScaleMode === 'manual' ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 font-bold' : 'border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                  <div className="flex items-center gap-1 font-mono">
                    <button
                      onClick={autoZoomOut}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    <button
                      onClick={autoZoomIn}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      autoResetScale();
                      setScaleDropdownOpen(false);
                    }}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset (100%)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            title={t('Shopping Cart')}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#050807] shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account Menu & Quick Log Out */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-white/5 transition-colors text-slate-200 text-xs font-semibold"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#002b29] text-emerald-300 border border-emerald-700/50 flex items-center justify-center text-xs font-bold">
                      {user.first_name[0]}
                    </div>
                    <span className="hidden sm:inline">Dr. {user.last_name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0a0f0e] rounded-xl shadow-2xl border border-white/10 py-1 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-white/10">
                        <div className="font-semibold text-white flex items-center justify-between">
                          <span>{user.first_name} {user.last_name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                            user.role === 'owner' ? 'bg-amber-500 text-black' :
                            user.role === 'admin' ? 'bg-emerald-500 text-black' :
                            user.role === 'employee' ? 'bg-indigo-500 text-white' :
                            'bg-teal-800 text-teal-100'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          onNavigate('account');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 text-slate-300 font-medium"
                      >
                        {t('nav.account')} & {t('nav.orders')}
                      </button>
                      <button
                        onClick={() => {
                          onNavigate('save-for-later');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-white/5 text-slate-300 font-medium"
                      >
                        {t('nav.save_for_later')} ({saveForLaterCount})
                      </button>
                      {(user.role === 'admin' || user.role === 'owner' || user.role === 'employee') && (
                        <button
                          onClick={() => {
                            onToggleAdminMode();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-amber-950/40 text-amber-300 font-bold border-t border-white/10 flex items-center justify-between"
                        >
                          <span>{user.role === 'employee' ? `📦 ${t('Fulfillment Station')}` : user.role === 'owner' ? `👑 ${t('Executive Portal')}` : `⚡ ${t('System Admin Portal')}`}</span>
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded border border-amber-500/30 uppercase">
                            {t('Launch')}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onSignOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-red-950/40 text-red-400 font-medium border-t border-white/10 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.sign_out')}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Direct 1-Click Log Out on Header */}
                <button
                  id="header-nav-logout-btn"
                  onClick={onSignOut}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-red-950/30 hover:bg-red-900/60 text-red-300 hover:text-white rounded-full text-xs font-semibold border border-red-800/40 hover:border-red-600 transition-all cursor-pointer shadow-xs"
                  title={t('nav.sign_out')}
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden xl:inline">{t('nav.sign_out')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.sign_in')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f0e] border-b border-white/10 px-4 py-4 space-y-3 text-xs uppercase tracking-wider font-medium text-slate-300 animate-in slide-in-from-top duration-200">
          {/* Universal Dashboard Link in Mobile Drawer */}
          <a
            id="mobile-nav-dashboard"
            href={roleDashboardUrl}
            onClick={(e) => {
              handleSmartLinkClick(e, roleDashboardUrl, () => {
                if (!user) {
                  onNavigate('login');
                } else if (user.role === 'customer') {
                  onNavigate('customer-portal');
                } else {
                  onNavigate('admin');
                }
                setMobileMenuOpen(false);
              });
            }}
            className="flex items-center justify-between w-full py-2 text-emerald-400 font-bold bg-emerald-950/40 px-3 rounded-xl border border-emerald-500/30 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span>{roleDashboardInfo.title}</span>
            </span>
            <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded font-black">
              HOME
            </span>
          </a>

          <a
            id="mobile-nav-home"
            href={buildAppUrl({ view: 'home' })}
            onClick={(e) => {
              handleSmartLinkClick(e, buildAppUrl({ view: 'home' }), () => {
                onSelectTopPopup?.(null);
                onNavigate('home');
                setMobileMenuOpen(false);
              });
            }}
            className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
          >
            {t('nav.home')}
          </a>
          <a
            id="mobile-nav-shop"
            href={buildAppUrl({ view: 'shop' })}
            onClick={(e) => {
              handleNavClick(e, buildAppUrl({ view: 'shop' }), 'shop', 'shop', 'shop');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
          >
            {t('nav.shop')}
          </a>
          <a
            id="mobile-nav-categories"
            href={buildAppUrl({ view: 'shop' })}
            onClick={(e) => {
              handleNavClick(e, buildAppUrl({ view: 'shop' }), 'categories', 'categories', 'categories');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
          >
            {t('nav.categories')}
          </a>
          <a
            id="mobile-nav-save-for-later"
            href={buildAppUrl({ view: 'save-for-later' })}
            onClick={(e) => {
              handleNavClick(e, buildAppUrl({ view: 'save-for-later' }), 'save-for-later', 'save-for-later', 'save-for-later');
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
          >
            <span>{t('nav.save_for_later')}</span>
            <span className="bg-emerald-950 text-emerald-300 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-800/50">
              {saveForLaterCount}
            </span>
          </a>
          <a
            id="mobile-nav-orders"
            href={buildAppUrl({ view: 'customer-portal', tab: 'orders' })}
            onClick={(e) => {
              handleNavClick(e, buildAppUrl({ view: 'customer-portal', tab: 'orders' }), 'orders', 'orders', 'orders');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
          >
            {t('nav.orders')}
          </a>
          <a
            id="mobile-nav-guide"
            href={buildAppUrl({ view: 'guide' })}
            onClick={(e) => {
              handleNavClick(e, buildAppUrl({ view: 'guide' }), 'guide', 'guide', 'guide');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
          >
            {t('nav.guide')}
          </a>
          {/* Custom pages in mobile menu */}
          {customPages.filter(p => p.show_in_header && p.status === 'published').map(page => {
            const locPage = translatePage(page, activeLang);
            const pageUrl = buildAppUrl({ view: 'custom-page', page: page.slug });
            return (
              <a
                key={page.id}
                id={`mobile-nav-page-${page.slug}`}
                href={pageUrl}
                onClick={(e) => {
                  const mode = page.header_nav_mode || settings?.navigation_config?.global_mode || 'page';
                  if (mode === 'popup') {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
                    e.preventDefault();
                    onSelectCustomPage?.(page, 'popup');
                  } else {
                    handleSmartLinkClick(e, pageUrl, () => {
                      if (onSelectCustomPage) {
                        onSelectCustomPage(page, 'page');
                      } else {
                        onNavigate(`custom-page:${page.slug}`);
                      }
                    });
                  }
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
              >
                {locPage.title}
              </a>
            );
          })}
          <button
            onClick={() => {
              onOpenMultiTabHub?.();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between py-2 text-left text-slate-300 hover:text-emerald-400 border-t border-white/10 pt-2 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Multi-Tab Feature Hub</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Launch ↗</span>
          </button>
          {user ? (
            <>
              <a
                id="mobile-nav-account"
                href={buildAppUrl({ view: 'customer-portal', tab: 'overview' })}
                onClick={(e) => {
                  handleSmartLinkClick(e, buildAppUrl({ view: 'customer-portal', tab: 'overview' }), () => {
                    onNavigate('account');
                    setMobileMenuOpen(false);
                  });
                }}
                className="block w-full text-left py-2 hover:text-emerald-400 cursor-pointer"
              >
                {t('nav.account')} & {t('nav.orders')}
              </a>
              <a
                id="mobile-nav-admin-toggle"
                href={roleDashboardUrl}
                onClick={(e) => {
                  handleSmartLinkClick(e, roleDashboardUrl, () => {
                    onToggleAdminMode();
                    setMobileMenuOpen(false);
                  });
                }}
                className="block w-full text-left py-2 text-amber-300 font-bold hover:text-amber-200 cursor-pointer"
              >
                {user.role === 'owner' && `👑 ${t('Access Owner Dashboard')}`}
                {user.role === 'admin' && `⚡ ${t('Access Admin Dashboard')}`}
                {user.role === 'employee' && `📦 ${t('Access Fulfillment Portal')}`}
                {user.role === 'customer' && `🔬 ${t('Access Customer Dashboard')}`}
              </a>
              <button
                id="mobile-nav-signout"
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left py-2 text-red-400 font-bold hover:text-red-300 cursor-pointer border-t border-white/10 pt-2.5 mt-1"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>{t('nav.sign_out')}</span>
              </button>
            </>
          ) : (
            <button
              id="mobile-nav-signin"
              onClick={() => {
                onNavigate('login');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-emerald-400 font-bold cursor-pointer"
            >
              {t('nav.sign_in')}
            </button>
          )}
          {/* Mobile Language Selector */}
          <div className="pt-3 border-t border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('common.language')} & Translation</span>
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                Google Cloud AI
              </span>
            </div>
            <GoogleLanguageSwitcher
              currentLang={activeLang}
              onSelectLang={handleLanguageSelect}
              variant="footer"
              className="w-full"
            />
          </div>

          <div className="pt-2">
            <button
              id="mobile-nav-qr"
              onClick={() => {
                onSelectTopPopup?.('qr');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2.5 px-4 bg-emerald-950/70 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-700/50 hover:bg-emerald-900/60 transition-colors shadow-sm cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>{t('nav.qr_app')}</span>
              </span>
              <span className="text-[9px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black uppercase">iOS / APK</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
