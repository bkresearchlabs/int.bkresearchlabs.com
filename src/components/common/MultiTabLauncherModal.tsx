import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Search,
  X,
  Layers,
  LayoutGrid,
  Shield,
  Package,
  ShoppingCart,
  FileSpreadsheet,
  Languages,
  Database,
  Radio,
  Bot,
  Globe,
  QrCode,
  FolderOpen,
  BookOpen,
  Users,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { buildAppUrl, openInNewTab } from '../../lib/navigation';
import { tabSync, requestGlobalResync, ConnectedTabInfo } from '../../lib/tabSync';

interface MultiTabLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  userRole?: UserRole;
  onNavigateToTab?: (tabId: string) => void;
  onNavigateToView?: (view: string) => void;
}

interface FeatureItem {
  id: string;
  name: string;
  category: 'Storefront & Customer' | 'Administrative & Inventory' | 'Security & Operations' | 'Productivity & AI' | 'Developer & System';
  description: string;
  icon: any;
  href: string;
  badge?: string;
  requiredRole?: UserRole[];
}

export const MultiTabLauncherModal: React.FC<MultiTabLauncherModalProps> = ({
  isOpen,
  onClose,
  user,
  userRole = user?.role || 'customer',
  onNavigateToTab,
  onNavigateToView
}) => {
  const [search, setSearch] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [connectedTabs, setConnectedTabs] = useState<ConnectedTabInfo[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = tabSync.subscribePresence((tabs) => {
      setConnectedTabs(tabs);
    });
    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  const ALL_FEATURES: FeatureItem[] = [
    // Storefront & Customer
    {
      id: 'store-home',
      name: 'Storefront Catalog Home',
      category: 'Storefront & Customer',
      description: 'Main public catalog homepage with hero announcement, featured reference standards, and laboratory credentials.',
      icon: ShoppingCart,
      href: buildAppUrl({ view: 'home' }),
      badge: 'Public View'
    },
    {
      id: 'store-shop',
      name: 'Product Catalog & Filters',
      category: 'Storefront & Customer',
      description: 'Comprehensive chemical standards catalog with analytical purity filters, HPLC specs, and live stock tags.',
      icon: Package,
      href: buildAppUrl({ view: 'shop' }),
      badge: 'Catalog'
    },
    {
      id: 'store-saved',
      name: 'Saved Reference Compounds',
      category: 'Storefront & Customer',
      description: 'Customer bookmarked compounds list and quick re-order stage.',
      icon: Layers,
      href: buildAppUrl({ view: 'save-for-later' }),
      badge: 'Bookmarks'
    },
    {
      id: 'customer-portal',
      name: 'Customer Account & COA Portal',
      category: 'Storefront & Customer',
      description: 'Customer order history, cryptographically sealed Certificates of Analysis (COAs), tracking & address book.',
      icon: Users,
      href: buildAppUrl({ view: 'customer-portal', tab: 'overview' }),
      badge: 'Customer Hub'
    },

    // Administrative & Inventory
    {
      id: 'admin-overview',
      name: 'Executive & Admin Overview',
      category: 'Administrative & Inventory',
      description: 'High-level executive metrics, revenue velocity, real-time order alerts, and operational telemetry.',
      icon: LayoutGrid,
      href: buildAppUrl({ view: 'admin', tab: 'overview' }),
      badge: 'Executive',
      requiredRole: ['owner', 'admin']
    },
    {
      id: 'admin-products',
      name: 'Products & Formulation Manager',
      category: 'Administrative & Inventory',
      description: 'Product catalog editor, CAS numbers, molecular specifications, lot numbers, and purity certificate uploads.',
      icon: Package,
      href: buildAppUrl({ view: 'admin', tab: 'products' }),
      badge: 'Catalog Admin',
      requiredRole: ['owner', 'admin', 'employee']
    },
    {
      id: 'admin-inventory',
      name: 'Inventory & Purchase Orders (PO)',
      category: 'Administrative & Inventory',
      description: 'Stock thresholds, low inventory alerts, supplier purchase orders, and receiving dock reconciliation.',
      icon: FileSpreadsheet,
      href: buildAppUrl({ view: 'admin', tab: 'inventory' }),
      badge: 'Stock & POs',
      requiredRole: ['owner', 'admin', 'employee']
    },
    {
      id: 'admin-orders',
      name: 'Order Fulfillment & Cold-Chain',
      category: 'Administrative & Inventory',
      description: 'Order fulfillment queue, FedEx/DHL tracking number generator, thermal packaging verification, and packing slips.',
      icon: Package,
      href: buildAppUrl({ view: 'admin', tab: 'orders' }),
      badge: 'Fulfillment',
      requiredRole: ['owner', 'admin', 'employee']
    },

    // Security & Operations
    {
      id: 'admin-security',
      name: 'Security & WAF Telemetry Center',
      category: 'Security & Operations',
      description: 'Web application firewall (WAF), rate limiting, IP lockouts, supervisor review approvals, and active threats.',
      icon: Shield,
      href: buildAppUrl({ view: 'admin', tab: 'security' }),
      badge: 'SecOps',
      requiredRole: ['owner', 'admin', 'security_admin']
    },
    {
      id: 'admin-audit',
      name: 'Audit Logs & Compliance Trail',
      category: 'Security & Operations',
      description: 'Immutable administrative audit trail, staff actions history, and regulatory compliance logs.',
      icon: Shield,
      href: buildAppUrl({ view: 'admin', tab: 'audit-logs' }),
      badge: 'Compliance',
      requiredRole: ['owner', 'admin', 'security_admin', 'employee']
    },
    {
      id: 'admin-customers',
      name: 'Staff Roles & RBAC Directory',
      category: 'Security & Operations',
      description: 'Manage staff role assignments (Owner, Admin, SecAdmin, Employee, Customer), permission overrides, and RBAC policies.',
      icon: Users,
      href: buildAppUrl({ view: 'admin', tab: 'customers' }),
      badge: 'RBAC Directory',
      requiredRole: ['owner', 'admin', 'security_admin']
    },

    // Productivity & AI
    {
      id: 'admin-ai',
      name: 'AI Master Governance Control',
      category: 'Productivity & AI',
      description: 'Universal governance for local and cloud Gemini AI capabilities: Chat, Thinking Mode, Vision, Audio, Grounding, and Lyria Music.',
      icon: Bot,
      href: buildAppUrl({ view: 'admin', tab: 'ai-control' }),
      badge: 'AI Governance',
      requiredRole: ['owner', 'admin']
    },
    {
      id: 'admin-document-center',
      name: 'Document & Office Suite',
      category: 'Productivity & AI',
      description: 'Integrated office productivity suite: Word document editor, dynamic spreadsheet with formulas, and PDF generator.',
      icon: FileSpreadsheet,
      href: buildAppUrl({ view: 'admin', tab: 'document-center' }),
      badge: 'Office Suite',
      requiredRole: ['owner', 'admin', 'employee']
    },
    {
      id: 'admin-qr',
      name: 'QR Studio & Lot Verification',
      category: 'Productivity & AI',
      description: 'Batch cryptographic QR code generator, lot-level COA verification links, and mobile app download targets.',
      icon: QrCode,
      href: buildAppUrl({ view: 'admin', tab: 'qr-studio' }),
      badge: 'QR Suite',
      requiredRole: ['owner', 'admin', 'employee']
    },

    // Developer & System
    {
      id: 'admin-language-debugger',
      name: 'Language Debugger & Coverage Matrix',
      category: 'Developer & System',
      description: 'Audit translation key coverage across all UI elements, inspect missing fallback logs, and test multi-lingual dictionary resolution.',
      icon: Languages,
      href: buildAppUrl({ view: 'admin', tab: 'language-debugger' }),
      badge: 'i18n Auditor',
      requiredRole: ['owner', 'admin', 'employee']
    },
    {
      id: 'admin-database',
      name: 'Supabase Database & Backup Hub',
      category: 'Developer & System',
      description: 'Supabase connection status, PostgreSQL schema migrations, JSON data backup export, and recovery tools.',
      icon: Database,
      href: buildAppUrl({ view: 'admin', tab: 'database' }),
      badge: 'Postgres Hub',
      requiredRole: ['owner', 'admin', 'security_admin']
    },
    {
      id: 'admin-fleet-sync',
      name: 'Fleet & Real-Time OTA Broadcast',
      category: 'Developer & System',
      description: 'Zero-downtime over-the-air hot-patch broadcast engine across iOS, Android, and Web terminal fleet.',
      icon: Radio,
      href: buildAppUrl({ view: 'admin', tab: 'fleet-sync' }),
      badge: 'Live OTA',
      requiredRole: ['owner', 'admin', 'security_admin']
    },
    {
      id: 'admin-google-services',
      name: 'Google Cloud Services & Telecom',
      category: 'Developer & System',
      description: 'Google Voice VoIP telecom, Workspace Gmail sync, Merchant Center feed, GA4 enhanced analytics, Ads & Maps.',
      icon: Globe,
      href: buildAppUrl({ view: 'admin', tab: 'google-services' }),
      badge: 'Google Suite',
      requiredRole: ['owner', 'admin']
    },
    {
      id: 'admin-user-guide',
      name: 'Operations & Role Manual SOP',
      category: 'Developer & System',
      description: 'Comprehensive store operations manual, role walkthroughs (Owner, Admin, SecAdmin, Employee), and system architecture guide.',
      icon: BookOpen,
      href: buildAppUrl({ view: 'admin', tab: 'user-guide' }),
      badge: 'Manual & SOP'
    }
  ];

  const visibleFeatures = ALL_FEATURES.filter(f => {
    if (f.requiredRole && !f.requiredRole.includes(userRole)) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      (f.badge && f.badge.toLowerCase().includes(q))
    );
  });

  const categories = Array.from(new Set(visibleFeatures.map(f => f.category)));

  const handleLaunchPreset = (urls: string[]) => {
    urls.forEach(url => openInNewTab(url));
  };

  const handleCopyLink = (href: string) => {
    const fullUrl = window.location.origin + window.location.pathname + href;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(href);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-[#0c1412] border border-emerald-500/30 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 text-white overflow-hidden"
      >
        {/* Modal Top Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-[#0c1412] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Universal Multi-Tab Hub
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {visibleFeatures.length} Available Tools
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white mt-1">
                Multi-Tab Feature Launcher & Workspace Router
              </h2>
              <p className="text-xs text-slate-400">
                Open multiple monitoring tools, fulfillment queues, and analytics tabs concurrently without session collision.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Multi-Tasking Presets Bar */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Instant Workspace Presets:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['owner', 'admin'].includes(userRole) && (
              <button
                onClick={() =>
                  handleLaunchPreset([
                    buildAppUrl({ view: 'admin', tab: 'overview' }),
                    buildAppUrl({ view: 'admin', tab: 'orders' }),
                    buildAppUrl({ view: 'admin', tab: 'security' })
                  ])
                }
                className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Opens 3 tabs: Executive Overview, Orders Fulfillment, and Security Telemetry"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch Exec Tri-Tab (Overview + Orders + SecOps)</span>
              </button>
            )}

            {['owner', 'admin', 'employee'].includes(userRole) && (
              <button
                onClick={() =>
                  handleLaunchPreset([
                    buildAppUrl({ view: 'admin', tab: 'orders' }),
                    buildAppUrl({ view: 'admin', tab: 'inventory' }),
                    buildAppUrl({ view: 'admin', tab: 'document-center' })
                  ])
                }
                className="px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Opens 3 tabs: Orders Fulfillment, Inventory/POs, and Document Suite"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Launch Fulfillment Suite (Orders + Stock + Docs)</span>
              </button>
            )}

            <button
              onClick={() =>
                handleLaunchPreset([
                  buildAppUrl({ view: 'home' }),
                  buildAppUrl({ view: 'shop' }),
                  buildAppUrl({ view: 'customer-portal', tab: 'overview' })
                ])
              }
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Opens 3 tabs: Storefront, Full Shop, and Customer Portal"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Storefront + Portal Dual-Tab</span>
            </button>
          </div>
        </div>

        {/* Search & Shortcuts Bar */}
        <div className="p-4 border-b border-white/10 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search tools, dashboards, features..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Pro-tip: Hold</span>
            <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-emerald-400 font-bold">
              Ctrl
            </kbd>
            <span>or</span>
            <kbd className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-emerald-400 font-bold">
              ⌘ Cmd
            </kbd>
            <span>+ Click any button to open in a new tab</span>
          </div>
        </div>

        {/* Scrollable Features List Grouped by Category */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {categories.map(cat => {
            const items = visibleFeatures.filter(f => f.category === cat);
            return (
              <div key={cat} className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span>{cat}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {items.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map(item => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800/90 hover:border-emerald-500/40 rounded-2xl p-4 transition-all flex flex-col justify-between group shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 group-hover:text-white group-hover:bg-emerald-600 transition-colors shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-bold text-white truncate">
                                {item.name}
                              </h3>
                              {item.badge && (
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleCopyLink(item.href)}
                            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Copy deep link URL to clipboard"
                          >
                            {copiedLink === item.href ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <span>Copy Link</span>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            {/* In-App Direct Switch */}
                            <a
                              href={item.href}
                              onClick={e => {
                                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button !== 1) {
                                  e.preventDefault();
                                  onClose();
                                  if (item.href.includes('view=admin')) {
                                    const params = new URLSearchParams(item.href.replace(/^\?/, ''));
                                    const tab = params.get('tab') || 'overview';
                                    onNavigateToTab?.(tab);
                                  } else {
                                    const params = new URLSearchParams(item.href.replace(/^\?/, ''));
                                    const view = params.get('view') || 'home';
                                    onNavigateToView?.(view);
                                  }
                                }
                              }}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              Navigate Here
                            </a>

                            {/* Open in Separate Browser Tab */}
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all hover:scale-105 cursor-pointer"
                              title="Open feature directly in a brand new browser tab"
                            >
                              <span>Open New Tab</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-medium">BroadcastChannel Mesh Active</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono border border-emerald-500/30">
              {Math.max(1, connectedTabs.length)} {connectedTabs.length === 1 ? 'Tab' : 'Tabs'} In Sync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                requestGlobalResync();
              }}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-emerald-500/30"
              title="Resynchronize all open browser tabs"
            >
              Resync All Tabs
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Close Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
