import React, { useState, useEffect } from 'react';
import {
  Radio,
  ExternalLink,
  RefreshCw,
  ShoppingCart,
  Shield,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  ArrowRight,
  Monitor,
  Activity,
  Copy,
  Check,
  Smartphone,
  Laptop
} from 'lucide-react';
import { UserProfile, UserRole, Product } from '../../types';
import {
  tabSync,
  CURRENT_TAB_ID,
  ConnectedTabInfo,
  SyncActivityLog,
  syncCartAcrossTabs,
  syncAuthAcrossTabs,
  requestGlobalResync
} from '../../lib/tabSync';
import { buildAppUrl, openInNewTab } from '../../lib/navigation';
import { api } from '../../lib/supabase';
import { useToast } from '../../lib/toast';
import { useTranslation } from '../../lib/i18n';

interface GlobalTabSyncHudProps {
  user: UserProfile | null;
  currentView: string;
  cartCount: number;
  onNavigateToView?: (view: string) => void;
  products?: Product[];
}

export const GlobalTabSyncHud: React.FC<GlobalTabSyncHudProps> = ({
  user,
  currentView,
  cartCount,
  onNavigateToView,
  products = []
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [connectedTabs, setConnectedTabs] = useState<ConnectedTabInfo[]>([]);
  const [activityLogs, setActivityLogs] = useState<SyncActivityLog[]>([]);
  const [copiedTabId, setCopiedTabId] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(true);

  const isSupported = tabSync.isSupported();

  useEffect(() => {
    // Subscribe to presence
    const unsubPresence = tabSync.subscribePresence((tabs) => {
      setConnectedTabs(tabs);
    });

    // Subscribe to activity logs
    const unsubActivity = tabSync.subscribeActivity((logs) => {
      setActivityLogs(logs);
    });

    return () => {
      unsubPresence();
      unsubActivity();
    };
  }, []);

  const handleCopyTabId = () => {
    navigator.clipboard.writeText(CURRENT_TAB_ID);
    setCopiedTabId(true);
    setTimeout(() => setCopiedTabId(false), 2000);
  };

  const handleForceResync = () => {
    requestGlobalResync();
    toast.success(t('Broadcast resynchronization signal sent across all tabs.'), { title: t('Global Tab Sync') });
  };

  const handleTestAddCartItem = async () => {
    setIsSimulating(true);
    try {
      // Find a sample product or use first available
      const sampleProd = products.find(p => p.sku?.includes('BPC') || p.name.includes('BPC')) || products[0] || {
        id: 'prod-test-sync',
        name: 'BPC-157 (5mg Research Standard)',
        slug: 'bpc-157-5mg',
        cas_number: '137525-51-0',
        purity_percentage: 99.8,
        price: 54.00,
        sku: 'BK-BPC157-5MG',
        images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'],
        inventory_quantity: 45,
        inventory_tracking_enabled: true,
        featured: true,
        category_id: 'cat-peptides'
      } as unknown as Product;

      const updated = await api.addToCart(sampleProd, 1);
      toast.cart({
        productName: sampleProd.name,
        quantity: 1,
        price: sampleProd.price,
        image: sampleProd.images[0]
      });
      toast.success(t('Broadcasted item to cart. Check other open tabs!'), { title: t('Tab Sync Active') });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTestSwitchRole = (role: UserRole) => {
    let switched: UserProfile;
    if (role === 'owner') switched = api.loginAsOwner();
    else if (role === 'admin') switched = api.loginAsAdmin();
    else if (role === 'security_admin') switched = api.loginAsSecurityAdmin();
    else if (role === 'employee') switched = api.loginAsEmployee();
    else switched = api.loginAsCustomer();

    toast.auth({
      message: t('Session role switched & synchronized across all browser tabs'),
      userName: switched.first_name,
      role: switched.role,
      type: 'login'
    });
  };

  const handleOpenParallelTab = (view = 'shop') => {
    openInNewTab(buildAppUrl({ view: view as any }));
    toast.info(t('Opening new synchronized tab. Watch state changes mirror in real-time!'), { title: t('New Tab Launched') });
  };

  const activeTabsCount = Math.max(1, connectedTabs.length);

  return (
    <>
      {/* Persistent Floating Indicator Pill */}
      <button
        onClick={() => setIsOpen(true)}
        title={t('Click to open Global Tab Sync Inspector')}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400/60 shadow-lg shadow-emerald-950/40 text-xs font-mono transition-all backdrop-blur-md cursor-pointer group"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Radio className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="text-[11px] font-semibold text-emerald-300">
          Tab Sync
        </span>
        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
          {activeTabsCount} {activeTabsCount === 1 ? 'Tab' : 'Tabs'}
        </span>
      </button>

      {/* Global Tab Sync Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div
            className="bg-[#040807] border border-emerald-500/30 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/50 via-slate-950 to-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                      Global Tab Sync Engine
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                      BroadcastChannel API
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-time bidirectional session, cart & catalog synchronization across all open browser windows
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Architecture & Telemetry Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Sync Channel</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-mono font-bold text-emerald-300 truncate">bkrl_global_tab_sync</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {isSupported ? 'Native Channel Mesh' : 'Storage Fallback Active'}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Connected Tabs</span>
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-mono font-bold text-white">
                      {activeTabsCount} <span className="text-xs font-sans font-normal text-slate-400">Active</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Auto-heartbeat (10s interval)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Current Tab Identity</span>
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-slate-200 truncate">{CURRENT_TAB_ID}</span>
                      <button
                        onClick={handleCopyTabId}
                        className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Tab ID"
                      >
                        {copiedTabId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      View: {currentView} • Role: {user?.role || 'Guest'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Tabs Mesh List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    Connected Browser Tabs ({connectedTabs.length})
                  </h3>
                  <button
                    onClick={handleForceResync}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-400" />
                    Force Resync All
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {connectedTabs.map((tab) => (
                    <div
                      key={tab.tabId}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                        tab.isCurrentTab
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                          : 'bg-slate-950/60 border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${tab.isCurrentTab ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                        <div className="min-w-0">
                          <div className="font-mono font-medium truncate flex items-center gap-2">
                            <span>{tab.tabTitle || 'BK Research Labs'}</span>
                            {tab.isCurrentTab && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-sans font-semibold border border-emerald-500/30">
                                This Tab
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate">
                            ID: {tab.tabId} • View: {tab.currentView || 'home'} {tab.userRole ? `• Role: ${tab.userRole}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 shrink-0">
                        Heartbeat: {Math.max(0, Math.round((Date.now() - tab.lastHeartbeat) / 1000))}s ago
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Interactive Sync Testing Suite */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-serif">
                      Interactive Multi-Tab Sync Test Station
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Broadcast
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Click any action below to broadcast immediate state events through the BroadcastChannel mesh. Open multiple tabs to observe instantaneous cross-tab mirroring of cart quantities, authentication, and inventory.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  <button
                    onClick={handleTestAddCartItem}
                    disabled={isSimulating}
                    className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-2 text-xs font-semibold transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div>Broadcast +1 Cart Item</div>
                        <div className="text-[10px] text-emerald-400/80 font-normal">Add BPC-157 (5mg)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleTestSwitchRole('owner')}
                    className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 flex items-center justify-between gap-2 text-xs font-semibold transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div>Broadcast Switch to Owner</div>
                        <div className="text-[10px] text-purple-400/80 font-normal">Executive Mode Sync</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleTestSwitchRole('customer')}
                    className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 flex items-center justify-between gap-2 text-xs font-semibold transition-all cursor-pointer group text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div>Broadcast Customer Mode</div>
                        <div className="text-[10px] text-blue-400/80 font-normal">Customer Account Sync</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/20 text-xs">
                  <span className="text-slate-400">Launch a parallel tab to verify live synchronization:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenParallelTab('shop')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Shop in New Tab
                    </button>
                    <button
                      onClick={() => handleOpenParallelTab('admin')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors cursor-pointer text-xs border border-white/10"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Admin in New Tab
                    </button>
                  </div>
                </div>
              </div>

              {/* Real-time Activity Stream Feed */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Broadcast Activity Stream ({activityLogs.length} Events)
                </h3>

                <div className="bg-slate-950/80 rounded-2xl border border-white/10 p-3 max-h-48 overflow-y-auto space-y-2">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-mono">
                      No broadcast events recorded yet. Perform a cart or auth action to observe the feed.
                    </div>
                  ) : (
                    activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold mt-0.5 ${
                              log.type === 'CART_CHANGED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : log.type === 'AUTH_CHANGED'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : log.type === 'ORDERS_CHANGED'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {log.type.replace('_CHANGED', '')}
                          </span>
                          <div className="min-w-0">
                            <div className="text-slate-200 font-medium truncate">{log.summary}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              Origin: {log.isSelf ? 'This Tab' : log.senderTabId}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-emerald-500/20 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Synchronized with LocalStorage cache + Supabase backend</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
