import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { AgeGate } from './components/common/AgeGate';
import { MasterSearchModal } from './components/common/MasterSearchModal';
import { DeviceFrame } from './components/common/DeviceFrame';
import { AuthModal } from './components/common/AuthModal';
import { TopMenuPopupModal, TopMenuPopupType } from './components/common/TopMenuPopupModal';
import { MultiTabLauncherModal } from './components/common/MultiTabLauncherModal';

import { ProductFilter } from './components/store/ProductFilter';
import { ProductGrid } from './components/store/ProductGrid';
import { ProductDetailsModal } from './components/store/ProductDetailsModal';
import { CartDrawer } from './components/store/CartDrawer';
import { SaveForLaterView } from './components/store/SaveForLaterView';

import { CheckoutFlow } from './components/checkout/CheckoutFlow';
import { CustomerDashboard } from './components/customer/CustomerDashboard';

import { AdminHeader } from './components/admin/AdminHeader';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminContent } from './components/admin/AdminContent';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminDatabaseExport } from './components/admin/AdminDatabaseExport';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminGateways } from './components/admin/AdminGateways';
import { AdminCustomerDashboardCustomizer } from './components/admin/AdminCustomerDashboardCustomizer';
import { AdminDownloadables } from './components/admin/AdminDownloadables';
import { AdminFileManager } from './components/admin/AdminFileManager';
import { AdminDocumentCenter } from './components/admin/AdminDocumentCenter';
import { AdminQRStudio } from './components/admin/qr/AdminQRStudio';
import { AdminCommunication } from './components/admin/AdminCommunication';
import { AdminGoogleAuth } from './components/admin/AdminGoogleAuth';
import { AdminGoogleServices } from './components/admin/AdminGoogleServices';
import { AdminThemeCustomizer } from './components/admin/AdminThemeCustomizer';
import { AdminPages } from './components/admin/AdminPages';
import { AdminSeoManagement } from './components/admin/AdminSeoManagement';
import { AdminDeviceSync } from './components/admin/AdminDeviceSync';
import { AdminSecurity } from './components/admin/AdminSecurity';
import { AdminAiMasterControl } from './components/admin/AdminAiMasterControl';
import { AdminLanguageDebugger } from './components/admin/AdminLanguageDebugger';
import { CustomPageView } from './components/store/CustomPageView';
import { CustomPageModal } from './components/common/CustomPageModal';
import { UserGuideView } from './components/common/UserGuideView';
import { AutoScaleWrapper } from './components/common/AutoScaleWrapper';
import { AutoScaleWidget } from './components/common/AutoScaleWidget';
import { ToastContainer } from './components/common/ToastContainer';
import { GoogleVoiceFloatingWidget } from './components/common/GoogleVoiceFloatingWidget';
import { LocalTranslator } from './components/common/LocalTranslator';
import { AiLaboratoryAssistantWidget } from './components/common/AiLaboratoryAssistantWidget';
import { GlobalTabSyncHud } from './components/common/GlobalTabSyncHud';

import { api } from './lib/supabase';
import { tabSync, CURRENT_TAB_ID } from './lib/tabSync';
import { parseAppUrl, buildAppUrl } from './lib/navigation';
import { LanguageProvider, getTranslation } from './lib/i18n';
import {
  initGoogleTranslateWidget,
  syncSeoHreflangTags,
  applyNoTranslateExclusions,
  getSavedLanguage
} from './lib/googleTranslate';
import { AutoScaleProvider } from './lib/autoScale';
import { ToastProvider, useToast } from './lib/toast';
import {
  Product,
  ProductCategory,
  CartItem,
  SaveForLaterItem,
  Order,
  UserProfile,
  UserRole,
  SiteSettings,
  HomepageContent,
  AuditLog,
  PurchaseOrder,
  PurchaseOrderStatus,
  CustomPage,
  LanguageCode
} from './types';

import { Shield, Sparkles, Truck, Award, CheckCircle2, ArrowRight, FileCheck } from 'lucide-react';

function AppInner({
  language,
  setLanguage,
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
}) {
  const { toast } = useToast();
  // App view state initialized from URL query parameters for deep linking
  const initialParams = parseAppUrl(typeof window !== 'undefined' ? window.location.search : '');
  const [view, setView] = useState<'home' | 'shop' | 'save-for-later' | 'customer-portal' | 'admin' | 'checkout' | 'custom-page' | 'guide'>((initialParams.view as any) || 'home');
  const [deviceMode, setDeviceMode] = useState<'web' | 'ios' | 'android'>('web');

  const t = (key: string, params?: Record<string, string | number>) => getTranslation(language, key, params);

  // Sync document language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Modals
  const [ageVerified, setAgeVerified] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMultiTabHubOpen, setIsMultiTabHubOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [activeTopPopup, setActiveTopPopup] = useState<TopMenuPopupType>(null);
  const [activeCustomPageModal, setActiveCustomPageModal] = useState<CustomPage | null>(null);

  // Store data state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saveForLaterItems, setSaveForLaterItems] = useState<SaveForLaterItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [activeCustomPageSlug, setActiveCustomPageSlug] = useState<string | null>(initialParams.page || null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  // Filtering
  const [searchQuery, setSearchQuery] = useState(initialParams.search || '');
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || '');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Admin tab state initialized from URL
  const [adminTab, setAdminTab] = useState(initialParams.tab || 'overview');

  // Synchronize browser history and popstate (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseAppUrl(window.location.search);
      if (parsed.view) setView(parsed.view as any);
      if (parsed.tab) setAdminTab(parsed.tab);
      if (parsed.page) setActiveCustomPageSlug(parsed.page);
      if (parsed.category !== undefined) setSelectedCategory(parsed.category);
      if (parsed.search !== undefined) setSearchQuery(parsed.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser URL query params whenever routing state changes
  useEffect(() => {
    const targetUrl = buildAppUrl({
      view: view === 'home' ? undefined : view,
      tab: view === 'admin' ? (adminTab === 'overview' ? undefined : adminTab) : undefined,
      category: selectedCategory || undefined,
      page: view === 'custom-page' ? activeCustomPageSlug || undefined : undefined,
      search: searchQuery || undefined,
    });

    const currentRelativeUrl = window.location.pathname + window.location.search;
    if (targetUrl !== currentRelativeUrl) {
      window.history.pushState(
        { view, tab: adminTab, category: selectedCategory, page: activeCustomPageSlug },
        '',
        targetUrl
      );
    }
  }, [view, adminTab, selectedCategory, activeCustomPageSlug, searchQuery]);

  // Initial Data Load & Real-Time Sync
  useEffect(() => {
    async function loadData() {
      const u = await api.getCurrentUser();
      setUser(u);

      const prods = await api.getProducts();
      setProducts(prods);

      const cats = await api.getCategories();
      setCategories(cats);

      const c = await api.getCart();
      setCart(c);

      const sfl = await api.getSaveForLater();
      setSaveForLaterItems(sfl);

      const ords = await api.getOrders();
      setOrders(ords);

      const st = await api.getSettings();
      setSettings(st);

      const hp = await api.getHomepageContent();
      setHomepageContent(hp);

      const logs = await api.getAuditLogs();
      setAuditLogs(logs);

      const pos = await api.getPurchaseOrders();
      setPurchaseOrders(pos);

      const pgs = await api.getPages();
      setCustomPages(pgs);

      // Check age verification
      try {
        const verified = localStorage.getItem('bkrl_age_verified');
        if (verified === 'true') setAgeVerified(true);
      } catch (e) {
        // ignore
      }

      // Initialize Google Translate Widget & SEO Localization
      try {
        initGoogleTranslateWidget('google_translate_element', () => {
          applyNoTranslateExclusions();
        });
        syncSeoHreflangTags(language);
        applyNoTranslateExclusions();
      } catch (e) {
        console.warn('Google Translate initialization notice:', e);
      }
    }

    loadData();

    // Subscribe to real-time events across tabs and Supabase backend
    const unsubscribe = api.subscribeToChanges(() => {
      loadData();
    });

    // Fine-grained BroadcastChannel Tab Sync listener for instantaneous cross-tab state reflections
    const unsubscribeTabSync = tabSync.subscribe((msg) => {
      if (msg.senderTabId === CURRENT_TAB_ID) return;

      if (msg.type === 'AUTH_CHANGED') {
        const nextUser = msg.payload?.user || null;
        setUser(nextUser);
        if (!nextUser) {
          setView((prev) => (prev === 'admin' || prev === 'customer-portal' ? 'home' : prev));
          toast.auth({
            message: t('Session signed out across browser tabs'),
            type: 'logout'
          });
        } else {
          toast.auth({
            message: t('Session synchronized across tabs'),
            userName: `${nextUser.first_name || ''} ${nextUser.last_name || ''}`.trim() || nextUser.email,
            role: nextUser.role,
            type: 'login'
          });
        }
      } else if (msg.type === 'CART_CHANGED') {
        if (msg.payload?.cart) {
          setCart(msg.payload.cart);
        }
        if (msg.summary) {
          toast.info(msg.summary, { title: t('Global Tab Sync') });
        }
      } else if (msg.type === 'SAVE_FOR_LATER_CHANGED') {
        if (msg.payload?.items) {
          setSaveForLaterItems(msg.payload.items);
        }
      } else if (msg.type === 'SETTINGS_CHANGED') {
        if (msg.payload?.settings) {
          setSettings(msg.payload.settings);
        }
      } else if (msg.type === 'AGE_GATE_CHANGED') {
        if (msg.payload?.verified !== undefined) {
          setAgeVerified(msg.payload.verified);
        }
      } else if (msg.type === 'FORCE_RESYNC_REQUEST') {
        loadData();
      }
    });

    return () => {
      unsubscribe();
      unsubscribeTabSync();
    };
  }, []);

  // Synchronize Tab Context with BroadcastChannel Mesh
  useEffect(() => {
    tabSync.updateTabContext(view, user?.role);
  }, [view, user]);

  // Update SEO hreflang and exclusions when language or active view changes
  useEffect(() => {
    syncSeoHreflangTags(language);
    applyNoTranslateExclusions();
  }, [language, view, selectedCategory, activeCustomPageSlug]);

  if (!settings || !homepageContent) {
    return (
      <div className="min-h-screen bg-[#002b29] text-white flex items-center justify-center font-serif text-lg">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="tracking-widest uppercase text-xs text-emerald-300">Initializing BK Research Labs Gateway...</p>
        </div>
      </div>
    );
  }

  // Handle Age Verification
  const handleVerifyAge = () => {
    try {
      localStorage.setItem('bkrl_age_verified', 'true');
    } catch (e) {
      // ignore
    }
    setAgeVerified(true);
  };

  // Auth Operations
  const handleSignOut = () => {
    const name = user ? `${user.first_name} ${user.last_name}` : undefined;
    api.signOut();
    setUser(null);
    toast.auth({
      message: t('Session securely terminated'),
      userName: name,
      type: 'logout',
    });
    if (view === 'admin' || view === 'customer-portal') {
      setView('home');
    }
  };

  // Cart Operations
  const handleAddToCart = async (product: Product, quantity = 1) => {
    const updated = await api.addToCart(product, quantity);
    setCart(updated);
    setIsCartOpen(true);

    // Rich Cart Toast Notification
    toast.cart({
      productName: product.name,
      quantity,
      price: product.price,
      image: product.images[0],
      onViewCart: () => setIsCartOpen(true),
    });

    // Low Inventory Alert
    if (product.inventory_tracking_enabled && product.inventory_quantity <= 5) {
      const remaining = Math.max(0, product.inventory_quantity - quantity);
      toast.inventory({
        productName: product.name,
        remainingQty: remaining,
        sku: product.sku,
        isOutOfStock: remaining <= 0,
      });
    }
  };

  const handleUpdateCartQuantity = async (itemId: string, qty: number) => {
    const updated = await api.updateCartQuantity(itemId, qty);
    setCart(updated);
    const item = cart.find(c => c.id === itemId);
    if (item) {
      toast.info(`${item.product.name} quantity updated to ${qty}`, { title: t('Cart Updated') });
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    const item = cart.find(c => c.id === itemId);
    const updated = await api.removeFromCart(itemId);
    setCart(updated);
    if (item) {
      toast.info(`${item.product.name} removed from cart.`, { title: t('Cart Updated') });
    }
  };

  const handleMoveToSaveForLater = async (item: CartItem) => {
    await handleRemoveFromCart(item.id);
    const updatedSfl = await api.addToSaveForLater(item.product);
    setSaveForLaterItems(updatedSfl);
    toast.info(`Moved ${item.product.name} to Saved for Later.`, { title: t('Cart Updated') });
  };

  // Save for Later Operations
  const handleToggleSaveForLater = async (product: Product) => {
    const isSaved = saveForLaterItems.some(i => i.product.id === product.id);
    if (isSaved) {
      const existing = saveForLaterItems.find(i => i.product.id === product.id);
      if (existing) {
        const updated = await api.removeFromSaveForLater(existing.id);
        setSaveForLaterItems(updated);
        toast.info(`${product.name} removed from saved items.`, { title: t('Save for Later') });
      }
    } else {
      const updated = await api.addToSaveForLater(product);
      setSaveForLaterItems(updated);
      toast.success(`${product.name} saved for later reference.`, { title: t('Saved for Later') });
    }
  };

  const handleMoveSflToCart = async (sflId: string) => {
    const item = saveForLaterItems.find(i => i.id === sflId);
    if (item && item.product) {
      await handleAddToCart(item.product, 1);
      const updatedSfl = await api.removeFromSaveForLater(sflId);
      setSaveForLaterItems(updatedSfl);
    }
  };

  const handleRemoveSfl = async (sflId: string) => {
    const item = saveForLaterItems.find(i => i.id === sflId);
    const updated = await api.removeFromSaveForLater(sflId);
    setSaveForLaterItems(updated);
    if (item) {
      toast.info(`${item.product.name} removed from saved items.`, { title: t('Save for Later') });
    }
  };

  // Admin Save Operations
  const handleSaveProduct = async (prodData: Partial<Product> & { name: string; price: number }) => {
    await api.saveProduct(prodData);
    const refreshed = await api.getProducts();
    setProducts(refreshed);
    const refreshedLogs = await api.getAuditLogs();
    setAuditLogs(refreshedLogs);
    toast.success(`${prodData.name} saved to laboratory catalog.`, { title: t('Catalog Updated') });
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const prod = products.find(p => p.id === id);
      await api.deleteProduct(id);
      const refreshed = await api.getProducts();
      setProducts(refreshed);
      toast.info(`${prod?.name || 'Product'} deleted from catalog.`, { title: t('Product Removed') });
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    fulfillmentStatus?: Order['fulfillment_status'],
    trackingNumber?: string
  ) => {
    await api.updateOrderStatus(orderId, status, fulfillmentStatus, trackingNumber);
    const refreshed = await api.getOrders();
    setOrders(refreshed);
    toast.success(
      `Order ${orderId.slice(0, 8)} status set to ${status}${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}`,
      { title: t('Order Status Updated') }
    );
  };

  // Filter products logic
  let filteredProducts = products.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedCategory && p.category_id !== selectedCategory) return false;
    if (inStockOnly && p.inventory_quantity <= 0) return false;
    if (featuredOnly && !p.featured) return false;
    return true;
  });

  // Sort logic
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0; // featured default
  });

  // Render Inner Content inside Device Frame
  const renderMainContent = () => {
    if (view === 'checkout') {
      return (
        <CheckoutFlow
          cartItems={cart}
          user={user}
          settings={settings}
          onOrderComplete={async (newOrder) => {
            const refreshedOrders = await api.getOrders();
            setOrders(refreshedOrders);
            const refreshedCart = await api.getCart();
            setCart(refreshedCart);
            setView('customer-portal');
            toast.order({
              orderNumber: newOrder.order_number,
              total: newOrder.total_amount,
              message: t('Order #{orderNumber} placed successfully! Documentation & invoice generated.', { orderNumber: newOrder.order_number }),
              onViewOrder: () => setView('customer-portal'),
            });
          }}
          onCancel={() => setView('shop')}
        />
      );
    }

    if (view === 'save-for-later') {
      return (
        <SaveForLaterView
          items={saveForLaterItems}
          onMoveToCart={handleMoveSflToCart}
          onRemoveItem={handleRemoveSfl}
          onNavigateToShop={() => setView('shop')}
        />
      );
    }

    if (view === 'custom-page') {
      const activePage = customPages.find(p => p.slug === activeCustomPageSlug) || customPages[0];
      if (!activePage) {
        return (
          <div className="max-w-4xl mx-auto py-20 px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 font-serif">Page Not Found</h2>
            <p className="text-slate-500 text-sm mt-2">The requested documentation or resource page could not be located.</p>
            <button onClick={() => setView('home')} className="mt-6 px-6 py-2.5 bg-[#002b29] text-white rounded-xl text-xs font-bold hover:bg-[#003d3a] transition-all">
              Return Home
            </button>
          </div>
        );
      }
      return (
        <CustomPageView
          page={activePage}
          settings={settings!}
          onBack={() => setView('home')}
          onNavigateToShop={() => setView('shop')}
        />
      );
    }

    if (view === 'guide') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('home')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors cursor-pointer shadow-xs"
            >
              ← Return to Storefront
            </button>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">BK Research Labs Technical Protocol Manual</span>
          </div>
          <UserGuideView initialRole={user?.role || 'customer'} />
        </div>
      );
    }

    if (view === 'customer-portal') {
      if (!user) {
        return (
          <div className="max-w-md mx-auto my-16 p-8 bg-[#040807] border border-emerald-500/30 rounded-3xl text-center space-y-5 shadow-2xl text-white">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold font-mono">
              BK
            </div>
            <h2 className="text-2xl font-bold font-serif">Customer Account Portal</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please sign in or register your institutional account to view your live orders, analytical COAs, tracking numbers, and saved compounds.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Sign In / Register
              </button>
              <button
                onClick={() => setView('home')}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-xs transition-all cursor-pointer border border-white/10"
              >
                Browse Storefront
              </button>
            </div>
          </div>
        );
      }

      return (
        <CustomerDashboard
          user={user}
          orders={orders}
          saveForLaterItems={saveForLaterItems}
          siteSettings={settings}
          products={products}
          onNavigateToShop={() => setView('shop')}
          onNavigateToSaveForLater={() => setView('save-for-later')}
          onSignOut={handleSignOut}
          onAddToCart={handleAddToCart}
          onUpdateProfile={(updated) => setUser({ ...user, ...updated })}
        />
      );
    }

    if (view === 'admin') {
      const handleSwitchRole = (targetRole: UserRole) => {
        let switchedUser: UserProfile;
        if (targetRole === 'owner') {
          switchedUser = api.loginAsOwner();
        } else if (targetRole === 'admin') {
          switchedUser = api.loginAsAdmin();
        } else if (targetRole === 'security_admin') {
          switchedUser = api.loginAsSecurityAdmin();
          setAdminTab('security');
        } else if (targetRole === 'employee') {
          switchedUser = api.loginAsEmployee();
          setAdminTab('orders');
        } else {
          switchedUser = api.loginAsCustomer();
          setUser(switchedUser);
          setView('home');
          return;
        }
        setUser(switchedUser);
        setView('admin');
      };

      return (
        <AdminHeader
          currentTab={adminTab}
          onSelectTab={setAdminTab}
          onExitAdmin={() => setView('home')}
          adminEmail={user?.email || 'admin@bkresearchlabs.com'}
          userRole={user?.role || 'admin'}
          onSwitchRole={handleSwitchRole}
          onOpenMultiTabHub={() => setIsMultiTabHubOpen(true)}
        >
          {adminTab === 'overview' && (
            <AdminOverview
              orders={orders}
              products={products}
              purchaseOrders={purchaseOrders}
              auditLogs={auditLogs}
              onSelectTab={setAdminTab}
            />
          )}
          {adminTab === 'products' && (
            <AdminProducts
              products={products}
              categories={categories}
              onSaveProduct={handleSaveProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
          {adminTab === 'inventory' && (
            <AdminInventory
              products={products}
              categories={categories}
              purchaseOrders={purchaseOrders}
              auditLogs={auditLogs}
              onUpdateStock={async (productId, newStock, reason) => {
                await api.updateProductStock(productId, newStock, reason);
                const updatedProds = await api.getProducts();
                setProducts(updatedProds);
                const updatedLogs = await api.getAuditLogs();
                setAuditLogs(updatedLogs);
              }}
              onSavePurchaseOrder={async (po) => {
                await api.savePurchaseOrder(po);
                const updatedPOs = await api.getPurchaseOrders();
                setPurchaseOrders(updatedPOs);
                const updatedLogs = await api.getAuditLogs();
                setAuditLogs(updatedLogs);
              }}
              onUpdatePOStatus={async (poId, status) => {
                await api.updatePurchaseOrderStatus(poId, status);
                const updatedPOs = await api.getPurchaseOrders();
                setPurchaseOrders(updatedPOs);
                const updatedProds = await api.getProducts();
                setProducts(updatedProds);
                const updatedLogs = await api.getAuditLogs();
                setAuditLogs(updatedLogs);
              }}
              onDeletePurchaseOrder={async (poId) => {
                await api.deletePurchaseOrder(poId);
                const updatedPOs = await api.getPurchaseOrders();
                setPurchaseOrders(updatedPOs);
                const updatedLogs = await api.getAuditLogs();
                setAuditLogs(updatedLogs);
              }}
              onRefreshData={async () => {
                const updatedProds = await api.getProducts();
                setProducts(updatedProds);
                const updatedPOs = await api.getPurchaseOrders();
                setPurchaseOrders(updatedPOs);
                const updatedLogs = await api.getAuditLogs();
                setAuditLogs(updatedLogs);
              }}
            />
          )}
          {adminTab === 'orders' && (
            <AdminOrders
              orders={orders}
              userRole={user?.role || 'admin'}
              userName={user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Admin Staff'}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}
          {adminTab === 'communication' && (
            <AdminCommunication
              userRole={user?.role || 'admin'}
              currentStaffEmail={user?.email || 'admin@bkresearchlabs.com'}
              currentStaffName={`${user?.first_name || 'Admin'} ${user?.last_name || 'User'}`}
            />
          )}
          {adminTab === 'gateways' && <AdminGateways />}
          {adminTab === 'downloadables' && <AdminDownloadables onNavigateToPreview={() => setView('home')} />}
          {adminTab === 'file-manager' && <AdminFileManager />}
          {adminTab === 'document-center' && <AdminDocumentCenter />}
          {adminTab === 'qr-studio' && <AdminQRStudio />}
          {adminTab === 'customer-dashboard' && (
            <AdminCustomerDashboardCustomizer
              settings={settings}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
              onNavigateToPreview={() => setView('customer-portal')}
            />
          )}
          {adminTab === 'customers' && <AdminCustomers user={user || { id: 'admin', auth_user_id: 'a', first_name: 'Admin', last_name: 'User', email: 'admin@bkresearchlabs.com', role: 'admin', status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }} />}
          {adminTab === 'content' && (
            <AdminContent
              homepage={homepageContent}
              settings={settings}
              categories={categories}
              onSaveHomepage={async (c) => {
                await api.saveHomepageContent(c);
                const updated = await api.getHomepageContent();
                setHomepageContent(updated);
              }}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
              onSaveCategory={async (cat) => {
                await api.saveCategory(cat);
                const updatedCats = await api.getCategories();
                setCategories(updatedCats);
              }}
            />
          )}
          {adminTab === 'security' && (
            <AdminSecurity
              siteSettings={settings}
              onSaveSiteSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'google-services' && (
            <AdminGoogleServices
              settings={settings!}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'google-auth' && (
            <AdminGoogleAuth
              settings={settings!}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'theme-customizer' && (
            <AdminThemeCustomizer
              settings={settings!}
              customPages={customPages}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'pages' && (
            <AdminPages
              onPreviewPage={(page, mode) => {
                if (mode === 'popup') {
                  setActiveCustomPageModal(page);
                } else {
                  setActiveCustomPageSlug(page.slug);
                  setView('custom-page');
                }
              }}
            />
          )}
          {adminTab === 'seo' && (
            <AdminSeoManagement
              settings={settings!}
              categories={categories}
              products={products}
              pages={customPages}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'ai-control' && (
            <AdminAiMasterControl
              settings={settings!}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'settings' && (
            <AdminSettings
              settings={settings!}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
              onNavigateToGateways={() => setAdminTab('gateways')}
              onNavigateToCustomerCustomizer={() => setAdminTab('customer-dashboard')}
              onNavigateToDownloadables={() => setAdminTab('downloadables')}
              onNavigateToGoogleServices={() => setAdminTab('google-services')}
              onNavigateToGoogleAuth={() => setAdminTab('google-auth')}
              onNavigateToThemeCustomizer={() => setAdminTab('theme-customizer')}
              onNavigateToPages={() => setAdminTab('pages')}
              onNavigateToFleetSync={() => setAdminTab('fleet-sync')}
              onNavigateToLanguageDebugger={() => setAdminTab('language-debugger')}
            />
          )}
          {adminTab === 'fleet-sync' && (
            <AdminDeviceSync
              settings={settings!}
              customPages={customPages}
              products={products}
              categories={categories}
              gateways={[]}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'audit-logs' && <AdminAuditLogs logs={auditLogs} />}
          {adminTab === 'database' && <AdminDatabaseExport />}
          {adminTab === 'language-debugger' && (
            <AdminLanguageDebugger
              settings={settings!}
              onSaveSettings={async (s) => {
                await api.saveSettings(s);
                const updated = await api.getSettings();
                setSettings(updated);
              }}
            />
          )}
          {adminTab === 'user-guide' && <UserGuideView initialRole={user?.role || 'admin'} />}
        </AdminHeader>
      );
    }

    // Dynamic spacing configuration from settings
    const heroSpacing = settings?.spacing_config?.hero_section;
    const catalogSpacing = settings?.spacing_config?.product_grid;
    const guaranteesSpacing = settings?.spacing_config?.guarantees_banner;
    const footerSpacing = settings?.spacing_config?.footer_section;

    // Default: Home & Shop View
    return (
      <div>
        {/* Hero Section on Homepage */}
        {view === 'home' && (
          <section
            className="bg-gradient-to-b from-[#002b29] to-[#001f1e] text-white relative overflow-hidden transition-all duration-300"
            style={{
              paddingTop: heroSpacing ? `${heroSpacing.paddingTop}px` : undefined,
              paddingRight: heroSpacing ? `${heroSpacing.paddingRight}px` : undefined,
              paddingBottom: heroSpacing ? `${heroSpacing.paddingBottom}px` : undefined,
              paddingLeft: heroSpacing ? `${heroSpacing.paddingLeft}px` : undefined,
              marginTop: heroSpacing ? `${heroSpacing.marginTop}px` : undefined,
              marginBottom: heroSpacing ? `${heroSpacing.marginBottom}px` : undefined,
            }}
          >
            <div
              className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 items-center"
              style={{
                gap: heroSpacing?.gap ? `${heroSpacing.gap}px` : '32px',
                maxWidth: heroSpacing?.maxWidth ? `${heroSpacing.maxWidth}px` : undefined,
              }}
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t(homepageContent.announcement_bar_text || 'hero.badge')}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight">
                  {t(homepageContent.hero_title || 'hero.title')}
                </h1>

                <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                  {t(homepageContent.hero_subtitle || 'hero.subtitle')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setView('shop')}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#002b29] font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <span>{t(homepageContent.hero_primary_cta_label || 'hero.primary_cta')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="#guarantees"
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-wider border border-white/20 transition-all flex items-center gap-2"
                  >
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>{t('hero.secondary_cta')}</span>
                  </a>
                </div>

                {/* Assurance Badges */}
                <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <div className="font-bold text-white">{t('hero.stat_purity')}</div>
                    <div className="text-slate-400 text-[11px]">{t('hero.stat_purity_desc')}</div>
                  </div>
                  <div>
                    <div className="font-bold text-white">{t('hero.stat_shipping')}</div>
                    <div className="text-slate-400 text-[11px]">{t('hero.stat_shipping_desc')}</div>
                  </div>
                  <div>
                    <div className="font-bold text-white">{t('hero.stat_coa')}</div>
                    <div className="text-slate-400 text-[11px]">{t('hero.stat_coa_desc')}</div>
                  </div>
                </div>
              </div>

              {/* Hero Feature Visual Card */}
              <div className="relative">
                <div className="aspect-4/3 rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900">
                  <img
                    src={homepageContent.hero_image_url || "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=1200"}
                    alt="BK Research Laboratory"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002b29] via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-xs">
                    <div className="flex justify-between items-center text-emerald-300 font-mono font-bold mb-1">
                      <span>{t('hero.card_batch')}</span>
                      <span>{t('hero.card_purity')}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      {t('hero.card_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Catalog Shop View */}
        <section
          id="catalog-products-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 space-y-8"
          style={{
            paddingTop: catalogSpacing ? `${catalogSpacing.paddingTop}px` : '48px',
            paddingRight: catalogSpacing ? `${catalogSpacing.paddingRight}px` : undefined,
            paddingBottom: catalogSpacing ? `${catalogSpacing.paddingBottom}px` : '48px',
            paddingLeft: catalogSpacing ? `${catalogSpacing.paddingLeft}px` : undefined,
            marginTop: catalogSpacing ? `${catalogSpacing.marginTop}px` : undefined,
            marginBottom: catalogSpacing ? `${catalogSpacing.marginBottom}px` : undefined,
            maxWidth: catalogSpacing?.maxWidth ? `${catalogSpacing.maxWidth}px` : undefined,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{t('nav.products')}</span>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mt-1">
                {selectedCategory
                  ? t(categories.find(c => c.id === selectedCategory)?.name || 'Compound Catalog')
                  : t('filter.all_products')}
              </h2>
            </div>
            <p className="text-slate-500 text-xs max-w-md">
              {t('guarantees.card1_desc')}
            </p>
          </div>

          {/* Product Filter Bar */}
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSelectSortBy={setSortBy}
            inStockOnly={inStockOnly}
            onToggleInStockOnly={() => setInStockOnly(!inStockOnly)}
            featuredOnly={featuredOnly}
            onToggleFeaturedOnly={() => setFeaturedOnly(!featuredOnly)}
          />

          {/* Product Cards Grid */}
          <ProductGrid
            products={filteredProducts}
            savedProductIds={saveForLaterItems.map(i => i.product.id)}
            onSelectProduct={prod => setSelectedProductDetails(prod)}
            onAddToCart={prod => handleAddToCart(prod, 1)}
            onToggleSaveForLater={handleToggleSaveForLater}
          />
        </section>

        {/* Institutional Quality Guarantees Banner */}
        <section
          id="guarantees"
          className="bg-slate-100 border-t border-slate-200 transition-all duration-300"
          style={{
            paddingTop: guaranteesSpacing ? `${guaranteesSpacing.paddingTop}px` : '64px',
            paddingRight: guaranteesSpacing ? `${guaranteesSpacing.paddingRight}px` : undefined,
            paddingBottom: guaranteesSpacing ? `${guaranteesSpacing.paddingBottom}px` : '64px',
            paddingLeft: guaranteesSpacing ? `${guaranteesSpacing.paddingLeft}px` : undefined,
            marginTop: guaranteesSpacing ? `${guaranteesSpacing.marginTop}px` : undefined,
            marginBottom: guaranteesSpacing ? `${guaranteesSpacing.marginBottom}px` : undefined,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">{t('guarantees.eyebrow')}</span>
              <h2 className="text-2xl font-serif font-bold text-slate-900">{t('guarantees.heading')}</h2>
            </div>

            <div
              className="grid md:grid-cols-3"
              style={{ gap: guaranteesSpacing?.gap ? `${guaranteesSpacing.gap}px` : '24px' }}
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl w-fit">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-base">{t('guarantees.card1_title')}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {t('guarantees.card1_desc')}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl w-fit">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-base">{t('guarantees.card2_title')}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {t('guarantees.card2_desc')}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl w-fit">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-base">{t('guarantees.card3_title')}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {t('guarantees.card3_desc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="bg-[#002b29] text-white border-t border-white/10 text-xs transition-all duration-300"
          style={{
            paddingTop: footerSpacing ? `${footerSpacing.paddingTop}px` : '48px',
            paddingRight: footerSpacing ? `${footerSpacing.paddingRight}px` : undefined,
            paddingBottom: footerSpacing ? `${footerSpacing.paddingBottom}px` : '48px',
            paddingLeft: footerSpacing ? `${footerSpacing.paddingLeft}px` : undefined,
            marginTop: footerSpacing ? `${footerSpacing.marginTop}px` : undefined,
            marginBottom: footerSpacing ? `${footerSpacing.marginBottom}px` : undefined,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="font-serif font-bold text-lg text-emerald-300">BK RESEARCH LABS</div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {t('footer.brand_desc')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-emerald-300 uppercase tracking-wider">{t('footer.products_title')}</div>
              <ul className="space-y-1.5 text-slate-300">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      id={`footer-category-${cat.id}`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setView('shop');
                        setTimeout(() => {
                          const el = document.getElementById('catalog-products-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }}
                      className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                    >
                      {t(cat.name)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-emerald-300 uppercase tracking-wider">{t('footer.account_title')}</div>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button
                    id="footer-nav-sfl"
                    onClick={() => setView('save-for-later')}
                    className="hover:text-emerald-400 cursor-pointer"
                  >
                    {t('footer.save_for_later')} ({saveForLaterItems.length})
                  </button>
                </li>
                <li>
                  <button
                    id="footer-nav-account"
                    onClick={() => {
                      if (user) {
                        setView('customer-portal');
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="hover:text-emerald-400 cursor-pointer"
                  >
                    {t('footer.account_portal')}
                  </button>
                </li>
                <li>
                  <button
                    id="footer-nav-guide"
                    onClick={() => setView('guide')}
                    className="hover:text-emerald-400 cursor-pointer"
                  >
                    {t('footer.user_guide')}
                  </button>
                </li>
                {customPages.filter(p => p.show_in_footer && p.status === 'published').map(page => (
                  <li key={page.id}>
                    <button
                      id={`footer-nav-page-${page.slug}`}
                      onClick={() => {
                        const mode = page.footer_nav_mode || 'page';
                        if (mode === 'popup') {
                          setActiveCustomPageModal(page);
                        } else {
                          setActiveCustomPageSlug(page.slug);
                          setView('custom-page');
                        }
                      }}
                      className="hover:text-emerald-400 cursor-pointer"
                    >
                      {page.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    id="footer-nav-admin"
                    onClick={() => {
                      if (!user) {
                        setIsAuthModalOpen(true);
                      } else if (user.role === 'customer') {
                        setView('customer-portal');
                      } else {
                        setView('admin');
                      }
                    }}
                    className="hover:text-emerald-400 font-bold text-amber-400 cursor-pointer"
                  >
                    {t('footer.admin_gateway')}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-slate-400">
              <div className="font-bold text-emerald-300 uppercase tracking-wider">{t('footer.disclaimer_title')}</div>
              <p className="text-[11px] leading-relaxed">
                {t('footer.disclaimer_text')}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-white/10 text-center text-slate-500 text-[11px]">
            {t('footer.copyright')}
          </div>
        </footer>
      </div>
    );
  };

  return (
    <AutoScaleWrapper isWebMode={deviceMode === 'web'}>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-[#002b29] selection:text-emerald-300">
        {/* Age Verification Compliance Gate */}
        <AgeGate
          isOpen={!ageVerified}
          onVerify={handleVerifyAge}
          settings={settings}
        />

        {/* Device Frame Wrapping App Preview */}
        <DeviceFrame
          deviceMode={deviceMode}
          onDeviceChange={setDeviceMode}
          userRole={user?.role}
        >
          {/* Main Storefront Header */}
          <Header
            user={user}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            saveForLaterCount={saveForLaterItems.length}
            currentLang={language}
            onSelectLang={setLanguage}
            deviceMode={deviceMode}
            onSelectDeviceMode={setDeviceMode}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigate={(v) => {
              setActiveTopPopup(null);
              if (v === 'login') {
                setIsAuthModalOpen(true);
              } else if (v === 'account' || v === 'orders') {
                if (user) {
                  setView('customer-portal');
                } else {
                  setIsAuthModalOpen(true);
                }
              } else if (v === 'guide') {
                setView('guide');
              } else if (v === 'save-for-later') {
                setView('save-for-later');
              } else if (v === 'categories') {
                setSelectedCategory('');
                setView('shop');
                setTimeout(() => {
                  const el = document.getElementById('catalog-products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              } else if (v === 'shop') {
                setSelectedCategory('');
                setView('shop');
                setTimeout(() => {
                  const el = document.getElementById('catalog-products-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              } else if (v.startsWith('custom-page:')) {
                const slug = v.replace('custom-page:', '');
                setActiveCustomPageSlug(slug);
                setView('custom-page');
              } else {
                setView(v as any);
              }
            }}
            currentView={view}
            settings={settings}
            isAdminMode={view === 'admin'}
            onToggleAdminMode={() => {
              if (!user) {
                setIsAuthModalOpen(true);
                return;
              }
              if (user.role === 'customer') {
                setView(view === 'customer-portal' ? 'home' : 'customer-portal');
              } else if (user.role === 'employee') {
                if (view === 'admin') {
                  setView('home');
                } else {
                  setAdminTab('orders');
                  setView('admin');
                }
              } else {
                setView(view === 'admin' ? 'home' : 'admin');
              }
            }}
            onSignOut={handleSignOut}
            products={products}
            categories={categories}
            orders={orders}
            saveForLaterItems={saveForLaterItems}
            onAddToCart={handleAddToCart}
            onToggleSaveForLater={handleToggleSaveForLater}
            activeTopPopup={activeTopPopup}
            onSelectTopPopup={setActiveTopPopup}
            customPages={customPages}
            activeCustomPageSlug={activeCustomPageSlug}
            onSelectCustomPage={(page, mode) => {
              if (mode === 'popup') {
                setActiveCustomPageModal(page);
              } else {
                setActiveCustomPageSlug(page.slug);
                setView('custom-page');
              }
            }}
            onOpenMultiTabHub={() => setIsMultiTabHubOpen(true)}
          />

          {/* Dynamic Route Content */}
          {renderMainContent()}
        </DeviceFrame>

        {/* Top Menu Pop-Up Modal (External full screen popup) */}
        <TopMenuPopupModal
          activePopup={activeTopPopup}
          onClose={() => setActiveTopPopup(null)}
          onSelectPopup={(p) => setActiveTopPopup(p)}
          onMaximizeView={(v) => {
            setActiveTopPopup(null);
            if (v === 'login') setIsAuthModalOpen(true);
            else if (v === 'account') setView(user ? 'customer-portal' : 'home');
            else if (v === 'categories') setView('shop');
            else setView(v as any);
          }}
          products={products}
          categories={categories}
          orders={orders}
          saveForLaterItems={saveForLaterItems}
          user={user}
          onAddToCart={handleAddToCart}
          onToggleSaveForLater={handleToggleSaveForLater}
          settings={settings}
          onSignOut={handleSignOut}
        />

        {/* Custom Page Modal */}
        <CustomPageModal
          isOpen={!!activeCustomPageModal}
          page={activeCustomPageModal}
          settings={settings!}
          onClose={() => setActiveCustomPageModal(null)}
          onNavigateToFullPage={(slug) => {
            setActiveCustomPageModal(null);
            setActiveCustomPageSlug(slug);
            setView('custom-page');
          }}
        />

        {/* Global Modals & Drawers */}
        <MasterSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          categories={categories}
          onSelectProduct={prod => {
            setIsSearchOpen(false);
            setSelectedProductDetails(prod);
          }}
          onSelectCategory={catId => {
            setIsSearchOpen(false);
            setSelectedCategory(catId);
            setView('shop');
          }}
        />

        <ProductDetailsModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onAddToCart={handleAddToCart}
          onToggleSaveForLater={handleToggleSaveForLater}
          isSaved={selectedProductDetails ? saveForLaterItems.some(i => i.product.id === selectedProductDetails.id) : false}
          settings={settings}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onMoveToSaveForLater={handleMoveToSaveForLater}
          onProceedToCheckout={() => setView('checkout')}
          settings={settings}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          settings={settings}
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            toast.auth({
              message: `${t('Welcome back')}, ${loggedUser.first_name}!`,
              userName: `${loggedUser.first_name} ${loggedUser.last_name}`,
              role: loggedUser.role,
              type: 'login',
            });
            if (loggedUser.role === 'admin') setView('admin');
            else setView('customer-portal');
          }}
        />

        {/* Multi-Tab Feature Launcher Modal */}
        <MultiTabLauncherModal
          isOpen={isMultiTabHubOpen}
          onClose={() => setIsMultiTabHubOpen(false)}
          user={user}
          userRole={user?.role}
          onNavigateToTab={(tabId) => {
            setAdminTab(tabId);
            setView('admin');
            setIsMultiTabHubOpen(false);
          }}
          onNavigateToView={(targetView) => {
            if (targetView.startsWith('custom-page:')) {
              setActiveCustomPageSlug(targetView.replace('custom-page:', ''));
              setView('custom-page');
            } else {
              setView(targetView as any);
            }
            setIsMultiTabHubOpen(false);
          }}
        />

        {/* Global Auto-Scale Floating Widget HUD */}
        <AutoScaleWidget position="bottom-left" />

        {/* Google Voice Customer Support & Hotline Floating Widget */}
        <GoogleVoiceFloatingWidget settings={settings} />

        {/* Local AI Laboratory & Chemical Translator Floating Widget */}
        <LocalTranslator />

        {/* AI Laboratory Assistant Customer Widget (Off by default, controlled via AI Master Control) */}
        <AiLaboratoryAssistantWidget settings={settings} />

        {/* Global Tab Sync Real-Time Floating Indicator & Control */}
        <div className="fixed bottom-4 right-24 z-40 hidden sm:block">
          <GlobalTabSyncHud
            user={user}
            currentView={view}
            cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
            onNavigateToView={(v) => setView(v as any)}
            products={products}
          />
        </div>
      </div>
    </AutoScaleWrapper>
  );
}

export function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');

  return (
    <LanguageProvider initialLanguage={language} onLanguageChange={setLanguage}>
      <ToastProvider>
        <AutoScaleProvider>
          <AppInner language={language} setLanguage={setLanguage} />
          <ToastContainer />
        </AutoScaleProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
