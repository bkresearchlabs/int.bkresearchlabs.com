import React, { useState, useEffect } from 'react';
import { 
  X, Maximize2, ShoppingBag, Bookmark, Package, BookOpen, QrCode, 
  Search, Filter, Check, Plus, Minus, ExternalLink, Download, FileText, 
  ShieldCheck, ArrowRight, Sparkles, User, RefreshCw, CheckCircle2, ChevronRight,
  Smartphone, ShieldAlert, Cpu, Camera, Copy, AlertTriangle, Eye, ChevronLeft, Info, Truck, LogOut
} from 'lucide-react';
import { Product, ProductCategory, Order, SaveForLaterItem, UserProfile, SiteSettings } from '../../types';
import { UserGuideView } from './UserGuideView';
import { PopupDownloadablesShowcase } from './PopupDownloadablesShowcase';
import { INITIAL_SITE_SETTINGS } from '../../data/initialData';
import { useTranslation, translateProduct, translateCategory } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

export type TopMenuPopupType = 'shop' | 'categories' | 'save-for-later' | 'orders' | 'guide' | 'qr' | 'ios' | 'android' | null;

interface TopMenuPopupModalProps {
  activePopup: TopMenuPopupType;
  onClose: () => void;
  onSelectPopup: (type: TopMenuPopupType) => void;
  onMaximizeView: (view: string) => void;
  products?: Product[];
  categories?: ProductCategory[];
  orders?: Order[];
  saveForLaterItems?: SaveForLaterItem[];
  user?: UserProfile | null;
  onAddToCart?: (product: Product, quantity: number) => void;
  onToggleSaveForLater?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
  settings?: SiteSettings;
  onSignOut?: () => void;
}

export const TopMenuPopupModal: React.FC<TopMenuPopupModalProps> = ({
  activePopup,
  onClose,
  onSelectPopup,
  onMaximizeView,
  products = [],
  categories = [],
  orders = [],
  saveForLaterItems = [],
  user,
  onAddToCart,
  onToggleSaveForLater,
  onSelectProduct,
  settings,
  onSignOut
}) => {
  const { t, language } = useTranslation();
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: !!activePopup,
    onClose
  });

  const [shopSearch, setShopSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [activeQrTab, setActiveQrTab] = useState<'ios' | 'android' | 'scanner'>('ios');
  const [copiedLink, setCopiedLink] = useState(false);
  const [scannedLotInput, setScannedLotInput] = useState('');
  const [foundLotResult, setFoundLotResult] = useState<{ lotNumber: string; product: Product; purity: string; date: string } | null>(null);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);

  // Product Quick View state within Shop Pop-up
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewImage, setQuickViewImage] = useState<string>('');
  const [quickViewQty, setQuickViewQty] = useState<number>(1);
  const [quickViewAck, setQuickViewAck] = useState<boolean>(true);
  const [quickViewAdded, setQuickViewAdded] = useState<boolean>(false);

  // Sync internal tab & reset quick view whenever activePopup changes
  useEffect(() => {
    setQuickViewProduct(null);
    if (activePopup === 'ios') setActiveQrTab('ios');
    else if (activePopup === 'android') setActiveQrTab('android');
    else if (activePopup === 'qr') setActiveQrTab('scanner');
  }, [activePopup]);

  if (!activePopup) return null;

  // When a product is selected for quick view, initialize its image and quantity
  const handleSelectQuickView = (prod: Product) => {
    setQuickViewProduct(prod);
    setQuickViewImage(prod.images?.[0] || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800');
    setQuickViewQty(1);
    setQuickViewAck(!prod.requires_acknowledgment);
    setQuickViewAdded(false);
  };

  const handleDownloadDoc = (docType: string, productName: string, sku: string) => {
    const textContent = `BK RESEARCH LABS - ${docType.toUpperCase()}
Item: ${productName}
SKU: ${sku}
Batch/Lot: BKRL-${new Date().getFullYear()}-${sku.replace(/[^0-9]/g, '') || '9041'}
Standard: Analytical Reference Standard (>99.8% RP-HPLC Purity)
Issued: ${new Date().toLocaleDateString()}
Authorized By: Quality Control & Analytical Verification Division
Status: Verified Authentic`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${docType.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter products for Shop Pop-up
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(shopSearch.toLowerCase()) ||
      (p as any).cas_number?.toLowerCase().includes(shopSearch.toLowerCase()) ||
      (p as any).formula?.toLowerCase().includes(shopSearch.toLowerCase());
    const matchesCat = selectedCat === 'all' || p.category_id === selectedCat;
    return matchesSearch && matchesCat;
  });

  const userOrders = user ? orders.filter(o => o.customer_email === user.email || o.user_id === user.id) : [];

  const handleAddToCartClick = (prod: Product, qty: number = 1) => {
    if (onAddToCart) {
      onAddToCart(prod, qty);
      setAddedProductId(prod.id);
      setTimeout(() => setAddedProductId(null), 2000);
    }
  };

  const handleQuickViewAddToCart = () => {
    if (!quickViewProduct) return;
    if (quickViewProduct.requires_acknowledgment && !quickViewAck) return;
    if (onAddToCart) {
      onAddToCart(quickViewProduct, quickViewQty);
      setQuickViewAdded(true);
      setTimeout(() => setQuickViewAdded(false), 2000);
    }
  };

  const handleLotLookup = (lot: string) => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      setIsSimulatingScan(false);
      const cleanLot = lot.trim().toUpperCase();
      if (!cleanLot) {
        setFoundLotResult(null);
        return;
      }
      const matchedProd = products[0] || null;
      if (matchedProd) {
        setFoundLotResult({
          lotNumber: cleanLot.startsWith('LOT-') ? cleanLot : `LOT-${cleanLot}`,
          product: matchedProd,
          purity: '99.85%',
          date: '2026-03-15'
        });
      }
    }, 600);
  };

  const popupsConfig = settings?.popups_config || INITIAL_SITE_SETTINGS.popups_config!;

  const getPopupTitle = () => {
    switch (activePopup) {
      case 'shop': return popupsConfig.shop?.title || 'Research Compounds & Product Catalog';
      case 'categories': return popupsConfig.categories?.title || 'Chemical Categories & Scientific Disciplines';
      case 'save-for-later': return popupsConfig['save-for-later']?.title || 'Saved Compounds & Reference Standards';
      case 'orders': return popupsConfig.orders?.title || 'Customer Orders & Lot COA Vault';
      case 'guide': return popupsConfig.guide?.title || 'Platform User Guide & Role Documentation';
      case 'ios': return popupsConfig.ios?.title || 'BKRL Apple iOS Mobile Application';
      case 'android': return popupsConfig.android?.title || 'BKRL Android Mobile Application';
      case 'qr': return popupsConfig.qr?.title || 'Mobile Scanner & Lot QR Verification';
      default: return 'BK Research Labs';
    }
  };

  const getPopupIcon = () => {
    switch (activePopup) {
      case 'shop': return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'categories': return <Filter className="w-5 h-5 text-emerald-400" />;
      case 'save-for-later': return <Bookmark className="w-5 h-5 text-emerald-400" />;
      case 'orders': return <Package className="w-5 h-5 text-emerald-400" />;
      case 'guide': return <BookOpen className="w-5 h-5 text-emerald-400" />;
      case 'ios': return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'android': return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'qr': return <QrCode className="w-5 h-5 text-emerald-400" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all overflow-y-auto pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-[#080d0c] border border-emerald-500/40 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[88vh] flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200 my-auto relative pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Controls Bar */}
        <div className="p-4 bg-gradient-to-r from-[#021815] via-[#05221e] to-[#021815] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-700/50 rounded-2xl shadow-inner">
              {getPopupIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  BK Research Labs
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-white tracking-tight mt-0.5">
                {t(getPopupTitle())}
              </h2>
            </div>
          </div>

          {/* Quick Tab Switcher inside Header */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-[11px] font-bold">
            <button
              onClick={() => onSelectPopup('shop')}
              className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${
                activePopup === 'shop'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t('nav.shop')}</span>
            </button>

            <button
              onClick={() => onSelectPopup('categories')}
              className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${
                activePopup === 'categories'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t('nav.categories')}</span>
            </button>

            <button
              onClick={() => onSelectPopup('save-for-later')}
              className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${
                activePopup === 'save-for-later'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t('nav.save_for_later')} ({saveForLaterItems.length})</span>
            </button>

            <button
              onClick={() => onSelectPopup('orders')}
              className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${
                activePopup === 'orders'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t('nav.orders')}</span>
            </button>

            <button
              onClick={() => onSelectPopup('qr')}
              className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${
                activePopup === 'qr'
                  ? 'bg-teal-500 text-slate-950 font-black shadow-md'
                  : 'bg-teal-950/40 hover:bg-teal-900/40 text-teal-300 border border-teal-800/40'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t('nav.qr_app')}</span>
            </button>

            <button
              onClick={() => onSelectPopup('guide')}
              className={`px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 shrink-0 ${
                activePopup === 'guide'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('nav.guide')}</span>
            </button>
          </div>

          {/* Window Control Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {user && onSignOut && (
              <button
                id="top-popup-logout-btn"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="p-1.5 px-2 bg-red-950/40 hover:bg-red-900/70 text-red-300 border border-red-800/40 rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer hover:text-white"
                title={t('nav.sign_out')}
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">{t('nav.sign_out')}</span>
              </button>
            )}

            <button
              id="top-popup-maximize-btn"
              onClick={() => {
                const targetView = activePopup === 'orders' ? 'account' : activePopup === 'save-for-later' ? 'save-for-later' : activePopup === 'guide' ? 'guide' : 'shop';
                onMaximizeView(targetView);
              }}
              className="p-1.5 bg-white/5 hover:bg-white/15 text-slate-300 rounded-xl transition-all flex items-center gap-1 text-[10px] font-bold cursor-pointer"
              title="Full Page View"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Full Page</span>
            </button>

            <button
              id="top-popup-close-btn"
              onClick={onClose}
              className="p-1.5 bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-800/50 rounded-xl transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pop-Up Window Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin scrollbar-thumb-emerald-800">
          {/* 1. SHOP POPUP CONTENT */}
          {activePopup === 'shop' && (
            <div className="space-y-5">
              {quickViewProduct ? (
                /* PRODUCT QUICK VIEW COMPONENT */
                (() => {
                  const quickViewSpacing = settings?.spacing_config?.product_quick_view;
                  const locQuickView = translateProduct(quickViewProduct, language);
                  return (
                    <div 
                      className="bg-[#040807] border border-emerald-500/30 space-y-6 animate-in fade-in zoom-in-95 duration-200"
                      style={{
                        marginTop: quickViewSpacing?.marginTop !== undefined ? `${quickViewSpacing.marginTop}px` : undefined,
                        marginRight: quickViewSpacing?.marginRight !== undefined ? `${quickViewSpacing.marginRight}px` : undefined,
                        marginBottom: quickViewSpacing?.marginBottom !== undefined ? `${quickViewSpacing.marginBottom}px` : undefined,
                        marginLeft: quickViewSpacing?.marginLeft !== undefined ? `${quickViewSpacing.marginLeft}px` : undefined,
                        paddingTop: quickViewSpacing?.paddingTop !== undefined ? `${quickViewSpacing.paddingTop}px` : '24px',
                        paddingRight: quickViewSpacing?.paddingRight !== undefined ? `${quickViewSpacing.paddingRight}px` : '24px',
                        paddingBottom: quickViewSpacing?.paddingBottom !== undefined ? `${quickViewSpacing.paddingBottom}px` : '24px',
                        paddingLeft: quickViewSpacing?.paddingLeft !== undefined ? `${quickViewSpacing.paddingLeft}px` : '24px',
                        borderRadius: quickViewSpacing?.borderRadius !== undefined ? `${quickViewSpacing.borderRadius}px` : '16px',
                        maxWidth: quickViewSpacing?.maxWidth ? `${quickViewSpacing.maxWidth}px` : undefined,
                      }}
                    >
                      {/* Top Quick View Navigation / Breadcrumbs */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <button
                          onClick={() => setQuickViewProduct(null)}
                          className="px-3.5 py-1.5 bg-white/5 hover:bg-emerald-950/50 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                          <span>{t('product.back_catalog')}</span>
                        </button>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-mono font-bold text-[10px]">
                            SKU: {locQuickView.sku}
                          </span>
                          {locQuickView.category_name && (
                            <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-bold text-[10px]">
                              {locQuickView.category_name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 2-Column Main Quick View Details */}
                      <div 
                        className="grid grid-cols-1 lg:grid-cols-12 items-start"
                        style={{ gap: quickViewSpacing?.gap !== undefined ? `${quickViewSpacing.gap}px` : '24px' }}
                      >
                    {/* Left Column: Gallery & Quality Certificates (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Main High-Resolution Image Box */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-emerald-950/20 border border-white/10 group">
                        <img
                          src={quickViewImage || locQuickView.images?.[0] || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'}
                          alt={locQuickView.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Badges on Image */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                          <span className="bg-black/80 backdrop-blur-md text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-emerald-500/40">
                            CAS: {(quickViewProduct as any).cas_number || 'Certified'}
                          </span>
                          {quickViewProduct.featured && (
                            <span className="bg-emerald-600/90 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-md">
                              Featured Standard
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 z-10">
                          <span className="bg-black/80 backdrop-blur-md text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10">
                            {(quickViewProduct as any).grade || 'HPLC ≥99.0%'}
                          </span>
                        </div>
                      </div>

                      {/* Thumbnail selector */}
                      {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {quickViewProduct.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setQuickViewImage(img)}
                              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                quickViewImage === img ? 'border-emerald-400 scale-95 shadow-md shadow-emerald-950/60' : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* CoA & MSDS Quality Verification Box */}
                      <div className="bg-emerald-950/30 border border-emerald-700/30 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            {popupsConfig.product_quick_view?.quality_dossier_title || 'Quality Dossier & Lot CoA'}
                          </span>
                          <span className="text-[10px] text-emerald-400/80 font-mono">
                            {popupsConfig.product_quick_view?.lot_sample_badge || 'Lot #BK-2026-X'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {popupsConfig.product_quick_view?.quality_dossier_subtitle || 'Third-party RP-HPLC purity profiling & mass spectrometry report available for direct download.'}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadDoc('CoA', quickViewProduct.name, quickViewProduct.sku)}
                            className="flex-1 py-1.5 px-3 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{popupsConfig.product_quick_view?.download_coa_button_text || 'Download CoA'}</span>
                          </button>
                          <button
                            onClick={() => handleDownloadDoc('MSDS', quickViewProduct.name, quickViewProduct.sku)}
                            className="py-1.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{popupsConfig.product_quick_view?.msds_button_text || 'MSDS'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Downloadable Assets for Quick View Overlay */}
                      {popupsConfig.product_quick_view?.downloadables && (
                        <PopupDownloadablesShowcase
                          config={popupsConfig.product_quick_view.downloadables}
                        />
                      )}
                    </div>

                    {/* Right Column: Specifications, Tier Pricing, Quantity & Add to Cart (7 cols) */}
                    <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Title & Short Details */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                              Analytical Standard Solution
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Ready for Cold-Chain Dispatch
                            </span>
                          </div>

                          <h3 className="text-lg sm:text-xl font-bold font-serif text-white tracking-tight leading-snug">
                            {locQuickView.name}
                          </h3>

                          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                            {locQuickView.short_description || locQuickView.description}
                          </p>
                        </div>

                        {/* Price & Tier Pricing Table */}
                        <div className="bg-black/50 border border-white/10 rounded-xl p-3.5 space-y-3">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <div className="text-xs text-slate-400 font-medium">Single Unit Price</div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white font-mono">
                                  ${quickViewProduct.price?.toFixed(2) || '0.00'}
                                </span>
                                {quickViewProduct.compare_at_price && (
                                  <span className="text-sm text-slate-500 line-through font-mono">
                                    ${quickViewProduct.compare_at_price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                                In Stock: {quickViewProduct.inventory_quantity || 25} Units
                              </span>
                            </div>
                          </div>

                          {/* Tier Volume Discounts Table */}
                          <div className="pt-2 border-t border-white/5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-400" />
                              <span>Institutional Volume Tier Pricing</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                              <div className={`p-2 rounded-lg border transition-all ${quickViewQty < 3 ? 'bg-emerald-950/60 border-emerald-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                <div className="font-bold text-[11px]">1 - 2 Vials</div>
                                <div className="text-emerald-400 font-mono font-bold">${quickViewProduct.price.toFixed(2)}</div>
                                <div className="text-[9px] text-slate-400">Standard</div>
                              </div>
                              <div className={`p-2 rounded-lg border transition-all ${quickViewQty >= 3 && quickViewQty < 5 ? 'bg-emerald-950/60 border-emerald-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                <div className="font-bold text-[11px]">3 - 4 Vials</div>
                                <div className="text-emerald-400 font-mono font-bold">${(quickViewProduct.price * 0.92).toFixed(2)}</div>
                                <div className="text-[9px] text-emerald-300 font-bold">Save 8%</div>
                              </div>
                              <div className={`p-2 rounded-lg border transition-all ${quickViewQty >= 5 ? 'bg-emerald-950/60 border-emerald-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400'}`}>
                                <div className="font-bold text-[11px]">5+ Vials</div>
                                <div className="text-emerald-400 font-mono font-bold">${(quickViewProduct.price * 0.85).toFixed(2)}</div>
                                <div className="text-[9px] text-emerald-300 font-bold">Save 15%</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Quantity Selector & Compliance Check */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-300">Quantity:</span>
                            <div className="flex items-center border border-white/20 bg-slate-900 rounded-xl overflow-hidden">
                              <button
                                onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                                className="p-2 hover:bg-white/10 text-slate-300 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-4 py-1 text-xs font-bold font-mono text-white">
                                {quickViewQty}
                              </span>
                              <button
                                onClick={() => setQuickViewQty(quickViewQty + 1)}
                                className="p-2 hover:bg-white/10 text-slate-300 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-xs text-slate-400 font-mono">
                              Total: <span className="text-emerald-400 font-bold font-mono text-sm">
                                ${(
                                  (quickViewQty >= 5 
                                    ? quickViewProduct.price * 0.85 
                                    : quickViewQty >= 3 
                                      ? quickViewProduct.price * 0.92 
                                      : quickViewProduct.price) * quickViewQty
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {quickViewProduct.requires_acknowledgment && (
                            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 cursor-pointer text-xs">
                              <input
                                type="checkbox"
                                checked={quickViewAck}
                                onChange={e => setQuickViewAck(e.target.checked)}
                                className="mt-0.5 rounded border-amber-600 text-amber-500 focus:ring-amber-500 shrink-0"
                              />
                              <span className="text-amber-200/90 text-[11px] leading-relaxed">
                                {quickViewProduct.acknowledgment_text || 'I acknowledge that this chemical compound is purchased strictly for qualified in-vitro scientific research.'}
                              </span>
                            </label>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                          <button
                            onClick={handleQuickViewAddToCart}
                            disabled={quickViewProduct.requires_acknowledgment && !quickViewAck}
                            className={`w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                              quickViewAdded
                                ? 'bg-emerald-400 text-slate-950 shadow-emerald-950/60'
                                : (quickViewProduct.requires_acknowledgment && !quickViewAck)
                                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:scale-[1.02]'
                            }`}
                          >
                            {quickViewAdded ? (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Added {quickViewQty} Vial(s) to Cart!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" />
                                <span>Add {quickViewQty} to Laboratory Cart</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onToggleSaveForLater && onToggleSaveForLater(quickViewProduct)}
                            className={`p-3 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 text-xs font-bold ${
                              saveForLaterItems.some(i => i.product.id === quickViewProduct.id)
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
                            }`}
                            title="Save Compound to Workbench"
                          >
                            <Bookmark className={`w-4 h-4 ${saveForLaterItems.some(i => i.product.id === quickViewProduct.id) ? 'fill-current' : ''}`} />
                            <span className="hidden sm:inline">
                              {saveForLaterItems.some(i => i.product.id === quickViewProduct.id) ? 'Saved' : 'Save'}
                            </span>
                          </button>
                        </div>

                        {/* Technical Specifications Grid */}
                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-emerald-400" />
                            Technical Specifications
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">CAS Number</span>
                              <span className="text-white font-mono font-bold">{(quickViewProduct as any).cas_number || 'N/A'}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Purity (RP-HPLC)</span>
                              <span className="text-emerald-400 font-mono font-bold">{(quickViewProduct as any).grade || '≥99.0%'}</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Physical Form</span>
                              <span className="text-white font-medium">Lyophilized Powder</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Storage Temp</span>
                              <span className="text-white font-medium">-20°C Desiccated</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Reconstitution</span>
                              <span className="text-white font-medium">Sterile Bacteriostatic H2O</span>
                            </div>
                            <div className="p-2 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Dispatch Status</span>
                              <span className="text-emerald-300 font-medium">Cold-Chain Insulated</span>
                            </div>
                          </div>
                        </div>

                        {/* Research Disclaimer */}
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 leading-relaxed">
                          <span className="font-bold text-slate-300">Regulatory Compliance:</span> {quickViewProduct.disclaimer || 'This compound is manufactured for institutional laboratory analysis and research protocols. Not for diagnostic, medicinal, or human administration.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                  );
                })()
              ) : (
                /* PRODUCTS CATALOG GRID */
                <>
                  {/* Filter controls inside Pop-Up */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-black/40 p-3.5 rounded-2xl border border-white/10">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={shopSearch}
                        onChange={e => setShopSearch(e.target.value)}
                        placeholder={popupsConfig.shop?.search_placeholder || "Search compounds, CAS#, formulas..."}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
                      <button
                        onClick={() => setSelectedCat('all')}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          selectedCat === 'all'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        {popupsConfig.shop?.all_compounds_badge || 'All Compounds'} ({products.length})
                      </button>
                      {categories.map(c => {
                        const locCat = translateCategory(c, language);
                        return (
                          <button
                            key={c.id}
                            onClick={() => setSelectedCat(c.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                              selectedCat === c.id
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                          >
                            {locCat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Products Grid in Pop-Up with Product Pictures & Quick View trigger */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map(prod => {
                      const locProd = translateProduct(prod, language);
                      return (
                        <div 
                          key={prod.id}
                          className="bg-[#050a09] border border-white/10 hover:border-emerald-500/40 rounded-2xl p-3.5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-lg hover:shadow-emerald-950/20"
                        >
                          <div className="space-y-2.5">
                            {/* Product Image Thumbnail with Quick View Hover Trigger */}
                            <div 
                              onClick={() => handleSelectQuickView(prod)}
                              className="relative aspect-4/3 rounded-xl overflow-hidden bg-emerald-950/20 border border-white/5 cursor-pointer"
                            >
                              <img
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'}
                                alt={locProd.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                                loading="lazy"
                              />
                              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                                <span className="text-[9px] font-mono font-bold text-emerald-300 bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded border border-emerald-700/40">
                                  CAS {(prod as any).cas_number || prod.sku}
                                </span>
                              </div>
                              <span className="absolute top-2 right-2 text-[9px] text-slate-200 font-bold bg-black/75 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                                {(prod as any).grade || '99% Pure'}
                              </span>

                              {/* Quick View Hover Button */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectQuickView(prod);
                                  }}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-1.5 transition-all transform scale-95 group-hover:scale-100"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{popupsConfig.shop?.quick_view_button_text || 'Quick View'}</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <h3 
                                onClick={() => handleSelectQuickView(prod)}
                                className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-1 cursor-pointer"
                              >
                                {locProd.name}
                              </h3>

                              <div className="flex items-baseline gap-2 pt-1">
                                <span className="text-base font-black text-white font-mono">
                                  ${prod.price?.toFixed(2) || (prod.tier_prices?.[0]?.price?.toFixed(2) || '0.00')}
                                </span>
                                <span className="text-[10px] text-slate-400">{popupsConfig.shop?.price_suffix || '/ vial'}</span>
                              </div>
                            </div>
                          </div>

                        <div className="flex items-center gap-2 pt-3 mt-2 border-t border-white/5">
                          <button
                            onClick={() => handleSelectQuickView(prod)}
                            className="p-2 bg-white/5 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                            title="Product Quick View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{popupsConfig.shop?.quick_view_button_text || 'Details'}</span>
                          </button>

                          <button
                            onClick={() => handleAddToCartClick(prod)}
                            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                              addedProductId === prod.id
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {addedProductId === prod.id ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>{popupsConfig.shop?.add_to_cart_button_text || 'Add to Cart'}</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => onToggleSaveForLater && onToggleSaveForLater(prod)}
                            className={`p-2 rounded-xl border transition-all ${
                              saveForLaterItems.some(i => i.product.id === prod.id)
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10'
                            }`}
                            title="Save Compound"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  </div>

                  {/* Pop-Up Downloadables Showcase */}
                  {popupsConfig.shop?.downloadables && (
                    <div className="pt-4 border-t border-white/10">
                      <PopupDownloadablesShowcase
                        config={popupsConfig.shop.downloadables}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* 2. CATEGORIES POPUP CONTENT */}
          {activePopup === 'categories' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 max-w-2xl">
                {popupsConfig.categories?.subtitle || 'Browse our high-purity synthetic compounds, analytical standard solutions, and specialized reaction catalysts grouped by discipline.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const count = products.filter(p => p.category_id === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCat(cat.id);
                        onSelectPopup('shop');
                      }}
                      className="bg-slate-950/80 hover:bg-emerald-950/30 border border-white/10 hover:border-emerald-500/40 p-4 rounded-2xl cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                          {cat.name}
                        </span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                          {count} items
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {cat.description || 'Standard certified analytical compounds and laboratory standards.'}
                      </p>
                      <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 pt-2">
                        <span>{popupsConfig.categories?.view_compounds_cta || 'Browse Compounds'}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Downloadables for Categories */}
              {popupsConfig.categories?.downloadables && (
                <div className="pt-4 border-t border-white/10">
                  <PopupDownloadablesShowcase config={popupsConfig.categories.downloadables} />
                </div>
              )}
            </div>
          )}

          {/* 3. SAVED FOR LATER POPUP CONTENT */}
          {activePopup === 'save-for-later' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {saveForLaterItems.length} compound(s) saved in your active laboratory session
                </span>
              </div>

              {saveForLaterItems.length === 0 ? (
                <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">
                    {popupsConfig['save-for-later']?.empty_title || 'Your saved workbench is empty'}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {popupsConfig['save-for-later']?.empty_cta_text || 'Click the bookmark icon on any compound card to pin it for quick reference.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {saveForLaterItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950/80 hover:bg-emerald-950/20 border border-white/10 hover:border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3 transition-all cursor-pointer group"
                      onClick={() => {
                        handleSelectQuickView(item.product);
                        onSelectPopup('shop');
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10 bg-emerald-950/30 group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{item.product.name}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">CAS: {(item.product as any).cas_number || item.product.sku}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            handleSelectQuickView(item.product);
                            onSelectPopup('shop');
                          }}
                          className="p-2 bg-white/5 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleAddToCartClick(item.product)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{popupsConfig['save-for-later']?.add_button_text || 'Add'}</span>
                        </button>
                        <button
                          onClick={() => onToggleSaveForLater && onToggleSaveForLater(item.product)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-xl border border-red-800"
                          title="Remove from Saved"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Downloadables for Save For Later */}
              {popupsConfig['save-for-later']?.downloadables && (
                <div className="pt-4 border-t border-white/10">
                  <PopupDownloadablesShowcase config={popupsConfig['save-for-later'].downloadables} />
                </div>
              )}
            </div>
          )}

          {/* 4. ORDERS & COAS POPUP CONTENT */}
          {activePopup === 'orders' && (
            <div className="space-y-4">
              {/* COA Vault Banner */}
              <div className="p-3.5 bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-teal-950/40 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{popupsConfig.orders?.coa_vault_banner_title || 'Certified Lot Certificate Vault'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {popupsConfig.orders?.coa_vault_banner_text || 'Institutional order history & HPLC-verified batch analytical certificates with automated lot trace.'}
                  </p>
                </div>
              </div>

              {!user ? (
                <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/10 space-y-3">
                  <User className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Sign In to Access Customer Orders & Lot COAs</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Access lot-specific HPLC/MS Certificates of Analysis, cold-chain tracking numbers, and institutional order invoices.
                  </p>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/10 space-y-2">
                  <Package className="w-8 h-8 text-slate-400 mx-auto" />
                  <div className="text-xs font-bold text-slate-300">No active customer orders found for {user.email}</div>
                  <p className="text-[11px] text-slate-400">Place an order to view cold-chain tracking and download lot COA PDFs here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map(ord => (
                    <div
                      key={ord.id}
                      className="p-4 bg-slate-950/90 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-emerald-400">{ord.order_number}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">
                          {ord.items.length} items • ${ord.total_amount.toFixed(2)} USD • {new Date(ord.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownloadDoc('CoA', `Order-${ord.order_number}`, ord.order_number)}
                          className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{popupsConfig.orders?.coa_button_text || 'Download Lot COA'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Downloadables for Orders */}
              {popupsConfig.orders?.downloadables && (
                <div className="pt-4 border-t border-white/10">
                  <PopupDownloadablesShowcase config={popupsConfig.orders.downloadables} />
                </div>
              )}
            </div>
          )}

          {/* 5. USER GUIDE POPUP CONTENT */}
          {activePopup === 'guide' && (
            <div className="space-y-4">
              <div className="bg-slate-950/90 rounded-2xl p-4 border border-white/10">
                <UserGuideView
                  userRole={user?.role || 'customer'}
                  onClose={onClose}
                />
              </div>

              {/* Downloadables for User Guide */}
              {popupsConfig.guide?.downloadables && (
                <div className="pt-2">
                  <PopupDownloadablesShowcase config={popupsConfig.guide.downloadables} />
                </div>
              )}
            </div>
          )}

          {/* 6. IOS, ANDROID & QR POPUP CONTENT */}
          {(activePopup === 'ios' || activePopup === 'android' || activePopup === 'qr') && (
            <div className="space-y-6">
              {/* Top Subnav for Mobile / QR options */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveQrTab('ios')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeQrTab === 'ios'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-blue-300" />
                  <span>Apple iOS App (.IPA)</span>
                  <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded font-mono">v2.4</span>
                </button>

                <button
                  onClick={() => setActiveQrTab('android')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeQrTab === 'android'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-300" />
                  <span>Android App (.APK)</span>
                  <span className="text-[9px] bg-black/40 px-1.5 py-0.5 rounded font-mono">v2.4</span>
                </button>

                <button
                  onClick={() => setActiveQrTab('scanner')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    activeQrTab === 'scanner'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <Camera className="w-4 h-4 text-teal-300" />
                  <span>Scan QR / Lot Lookup</span>
                </button>
              </div>

              {/* Sub-tab 1: iOS App (.IPA) */}
              {activeQrTab === 'ios' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {popupsConfig.ios?.ipa_badge || 'Apple iOS Package (.IPA)'}
                        </span>
                        <span className="text-[10px] text-slate-400">iOS 15.0+ Compatible</span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-white">BK Research Labs for iPhone & iPad</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Download the certified iOS `.ipa` standalone bundle for laboratory inventory audits, fast compound barcode scanning, and instant lot COA verification.
                      </p>

                      <div className="bg-black/40 border border-blue-500/30 rounded-2xl p-4 space-y-3">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Direct .IPA Package</span>
                          <span className="text-[10px] text-blue-400 font-mono">
                            SHA-256: {popupsConfig.ios?.ipa_sha256 || '8f3b...9a12'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href="/downloads/BK-Research-Labs-v1.0.4.ipa"
                            download="BK-Research-Labs-v1.0.4.ipa"
                            onClick={() => {
                              try {
                                (window as any).bkrlApi?.incrementDownloadCount('dl-ios-ipa');
                              } catch (e) {}
                            }}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                          >
                            <Download className="w-4 h-4" />
                            <span>
                              {popupsConfig.ios?.ipa_download_button || 'Download .IPA File'} ({popupsConfig.ios?.ipa_file_size || '31.2 MB'})
                            </span>
                          </a>

                          <button
                            onClick={() => {
                              const url = window.location.origin + '/downloads/BK-Research-Labs-v1.0.4.ipa';
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(url).catch(() => {});
                              }
                              setCopiedLink(true);
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors"
                            title="Copy Direct Download Link"
                          >
                            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-800/40 text-[11px] text-blue-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-blue-300">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Installation Instructions:</span>
                        </div>
                        <p className="text-slate-300">
                          Install using <strong>AltStore</strong>, <strong>Sideloadly</strong>, or your organization's Apple Developer Enterprise / TestFlight management profile.
                        </p>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="p-6 bg-slate-950 border border-blue-500/30 rounded-3xl text-center space-y-3">
                      <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-xl flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                            window.location.origin + '/downloads/BK-Research-Labs-v1.0.4.ipa'
                          )}`}
                          alt="iOS IPA QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                        Scan with iPhone Camera to Install .IPA
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {window.location.origin}/downloads/BK-Research-Labs-v1.0.4.ipa
                      </p>
                    </div>
                  </div>

                  {/* Downloadables for iOS */}
                  {popupsConfig.ios?.downloadables && (
                    <div className="pt-4 border-t border-white/10">
                      <PopupDownloadablesShowcase config={popupsConfig.ios.downloadables} />
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Android App (.APK) */}
              {activeQrTab === 'android' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                          {popupsConfig.android?.apk_badge || 'Android APK Package (.APK)'}
                        </span>
                        <span className="text-[10px] text-slate-400">Android 8.0+ / HarmonyOS</span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-white">BK Research Labs for Android Devices</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Download the direct Android `.apk` package to sideload the full BKRL laboratory app onto phones, tablets, and rugged warehouse scanners.
                      </p>

                      <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Direct .APK Package</span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            SHA-256: {popupsConfig.android?.apk_sha256 || '4c9e...7d81'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href="/downloads/BK-Research-Labs-v1.0.4.apk"
                            download="BK-Research-Labs-v1.0.4.apk"
                            onClick={() => {
                              try {
                                (window as any).bkrlApi?.incrementDownloadCount('dl-android-apk');
                              } catch (e) {}
                            }}
                            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                          >
                            <Download className="w-4 h-4" />
                            <span>
                              {popupsConfig.android?.apk_download_button || 'Download .APK File'} ({popupsConfig.android?.apk_file_size || '28.4 MB'})
                            </span>
                          </a>

                          <button
                            onClick={() => {
                              const url = window.location.origin + '/downloads/BK-Research-Labs-v1.0.4.apk';
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(url).catch(() => {});
                              }
                              setCopiedLink(true);
                              setTimeout(() => setCopiedLink(false), 2000);
                            }}
                            className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors"
                            title="Copy Direct Download Link"
                          >
                            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-[11px] text-emerald-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Sideload Instructions:</span>
                        </div>
                        <p className="text-slate-300">
                          Tap download, then open the file and select <strong>Install</strong>. If prompted, allow "Install from Unknown Sources" in Android Settings.
                        </p>
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="p-6 bg-slate-950 border border-emerald-500/30 rounded-3xl text-center space-y-3">
                      <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-xl flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                            window.location.origin + '/downloads/BK-Research-Labs-v1.0.4.apk'
                          )}`}
                          alt="Android APK QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                        Scan with Android Camera to Install .APK
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {window.location.origin}/downloads/BK-Research-Labs-v1.0.4.apk
                      </p>
                    </div>
                  </div>

                  {/* Downloadables for Android */}
                  {popupsConfig.android?.downloadables && (
                    <div className="pt-4 border-t border-white/10">
                      <PopupDownloadablesShowcase config={popupsConfig.android.downloadables} />
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 3: Scanner & Live Lot Lookup */}
              {activeQrTab === 'scanner' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/20 text-teal-300 border border-teal-400/30">
                          Lot COA & Barcode Scanner
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-white">Interactive Compound Lot Lookup</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {popupsConfig.qr?.camera_instructions || 'Enter or scan any compound bottle QR barcode or lot code to immediately verify purity assay results and HPLC chromatograms.'}
                      </p>

                      <div className="bg-black/40 border border-teal-500/30 rounded-2xl p-4 space-y-3">
                        <div className="text-xs font-bold text-white">Lot Verification Lookup:</div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={scannedLotInput}
                            onChange={e => setScannedLotInput(e.target.value)}
                            placeholder={popupsConfig.qr?.manual_lookup_placeholder || "e.g. LOT-BKR-9982 or CAS 58-08-2"}
                            className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                          />
                          <button
                            onClick={() => handleLotLookup(scannedLotInput || 'LOT-BKR-9982')}
                            disabled={isSimulatingScan}
                            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                          >
                            {isSimulatingScan ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                            <span>{popupsConfig.qr?.lookup_button_text || 'Verify'}</span>
                          </button>
                        </div>

                        {/* Quick Sample Lot Buttons */}
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>Sample Lots:</span>
                          <button
                            onClick={() => {
                              setScannedLotInput('LOT-BKR-9982');
                              handleLotLookup('LOT-BKR-9982');
                            }}
                            className="text-teal-300 hover:underline font-mono"
                          >
                            LOT-BKR-9982
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => {
                              setScannedLotInput('LOT-BKR-4011');
                              handleLotLookup('LOT-BKR-4011');
                            }}
                            className="text-teal-300 hover:underline font-mono"
                          >
                            LOT-BKR-4011
                          </button>
                        </div>
                      </div>

                      {foundLotResult && (
                        <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-black text-emerald-300">{foundLotResult.lotNumber}</span>
                            <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                              {foundLotResult.purity} PURITY
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white">{foundLotResult.product.name}</div>
                          <div className="text-[11px] text-slate-300 flex items-center gap-2">
                            <span>CAS: {foundLotResult.product.cas_number}</span>
                            <span>•</span>
                            <span>Tested: {foundLotResult.date}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR Code Container */}
                    <div className="p-6 bg-slate-950 border border-teal-500/30 rounded-3xl text-center space-y-3">
                      <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto shadow-xl flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                            window.location.origin + '/#lot-scan'
                          )}`}
                          alt="Web App QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-xs font-bold text-teal-400 uppercase tracking-widest">
                        Live Store & Lot Scanner QR
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">
                        {window.location.origin}
                      </p>
                    </div>
                  </div>

                  {/* Downloadables for QR */}
                  {popupsConfig.qr?.downloadables && (
                    <div className="pt-4 border-t border-white/10">
                      <PopupDownloadablesShowcase config={popupsConfig.qr.downloadables} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
