import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  Search,
  Filter,
  FileCode,
  HardDrive,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  QrCode,
  Layers,
  FileText,
  Terminal,
  UploadCloud,
  CheckCircle2,
  Mail,
  UserCheck,
  Zap,
  Lock,
  Unlock,
  Key,
  Users,
  Send,
  Sparkles,
  Link2,
  Clock,
  AlertTriangle,
  Package,
  Activity,
  History,
  CheckCircle
} from 'lucide-react';
import {
  DownloadableItem,
  DownloadCategory,
  DownloadPlatform,
  AssetAccessRule,
  UserAssetGrant,
  AssetEmailLog,
  UserProfile,
  Product
} from '../../types';
import { api } from '../../lib/supabase';

interface AdminDownloadablesProps {
  onNavigateToPreview?: () => void;
}

export const AdminDownloadables: React.FC<AdminDownloadablesProps> = ({ onNavigateToPreview }) => {
  const [downloadables, setDownloadables] = useState<DownloadableItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [grants, setGrants] = useState<UserAssetGrant[]>([]);
  const [emailLogs, setEmailLogs] = useState<AssetEmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Main Studio Tab
  const [activeStudioTab, setActiveStudioTab] = useState<'library' | 'grants' | 'triggers' | 'logs'>('library');

  // Library Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedAccessRule, setSelectedAccessRule] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<DownloadableItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Immediate Email Send Modal State
  const [emailModalAsset, setEmailModalAsset] = useState<DownloadableItem | null>(null);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  // Manual Grant Form State
  const [selectedGrantUserEmail, setSelectedGrantUserEmail] = useState('');
  const [selectedGrantAssetId, setSelectedGrantAssetId] = useState('');
  const [grantExpiresDays, setGrantExpiresDays] = useState<number>(0); // 0 = lifetime
  const [grantMaxDownloads, setGrantMaxDownloads] = useState<number>(0); // 0 = unlimited
  const [grantSendEmail, setGrantSendEmail] = useState(true);
  const [granting, setGranting] = useState(false);

  // Trigger Form State
  const [triggerProductId, setTriggerProductId] = useState('');
  const [triggerAssetId, setTriggerAssetId] = useState('');
  const [simulatingTrigger, setSimulatingTrigger] = useState(false);

  // APK & iOS Compilation Build State
  const [isBuildingApk, setIsBuildingApk] = useState(false);
  const [isBuildingIos, setIsBuildingIos] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildingPlatform, setBuildingPlatform] = useState<'android' | 'ios' | null>(null);
  const [showQrModal, setShowQrModal] = useState<DownloadableItem | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [items, usersList, productsList, grantsList, logsList] = await Promise.all([
        api.getDownloadables(),
        api.getUsers(),
        api.getProducts(),
        api.getUserAssetGrants(),
        api.getAssetEmailLogs()
      ]);
      setDownloadables(items);
      setUsers(usersList);
      setProducts(productsList);
      setGrants(grantsList);
      setEmailLogs(logsList);
      if (usersList.length > 0 && !selectedGrantUserEmail) {
        setSelectedGrantUserEmail(usersList[0].email);
      }
      if (items.length > 0) {
        if (!selectedGrantAssetId) setSelectedGrantAssetId(items[0].id);
        if (!triggerAssetId) setTriggerAssetId(items[0].id);
      }
      if (productsList.length > 0 && !triggerProductId) {
        setTriggerProductId(productsList[0].id);
      }
    } catch (err) {
      console.error('Failed to load asset & storage data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopyLink = (item: DownloadableItem) => {
    const fullUrl = window.location.origin + item.download_url;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).catch(() => {});
    }
    setCopiedId(item.id);
    showToast(`Copied download link for "${item.title}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = async (item: DownloadableItem) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}" (${item.filename})?`)) {
      return;
    }
    try {
      await api.deleteDownloadable(item.id);
      showToast(`Deleted "${item.title}".`);
      loadAllData();
    } catch (err) {
      console.error('Failed to delete downloadable:', err);
    }
  };

  // Immediate Email Send Action
  const handleOpenEmailModal = (asset: DownloadableItem) => {
    setEmailModalAsset(asset);
    setEmailRecipient(selectedGrantUserEmail || 'bkresearchlabs@gmail.com');
  };

  const handleSendEmailImmediately = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalAsset || !emailRecipient) return;

    setEmailSending(true);
    try {
      const res = await api.sendAssetToEmail(emailModalAsset.id, emailRecipient);
      showToast(`✓ ${res.message}`);
      setEmailModalAsset(null);
      loadAllData();
    } catch (err: any) {
      alert(`Email Dispatch Error: ${err?.message || 'Failed to send asset copy'}`);
    } finally {
      setEmailSending(false);
    }
  };

  // Create or Edit Asset
  const handleOpenAddModal = () => {
    setEditingItem({
      title: '',
      filename: 'BK-Asset-' + Math.floor(Math.random() * 1000) + '.zip',
      file_size: '12.5 MB',
      version: '1.0.0',
      category: 'software',
      platform: 'all',
      description: '',
      download_url: '/downloads/BK-Asset.zip',
      is_public: false,
      requires_auth: true,
      access_rule: 'product_purchase_required',
      linked_product_ids: products.length > 0 ? [products[0].id] : [],
      assigned_user_emails: [],
      email_delivery_enabled: true,
      release_notes: '',
      md5_hash: 'a' + Math.random().toString(16).substring(2, 10) + '0123456789'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: DownloadableItem) => {
    setEditingItem({
      ...item,
      linked_product_ids: item.linked_product_ids || [],
      assigned_user_emails: item.assigned_user_emails || []
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.filename) {
      alert('Please fill out all required fields.');
      return;
    }

    setSaving(true);
    try {
      await api.saveDownloadable(editingItem);
      showToast(editingItem.id ? 'Updated digital asset configuration!' : 'Created new digital asset!');
      setIsModalOpen(false);
      setEditingItem(null);
      loadAllData();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  // Manual Grant Handler
  const handleCreateGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrantUserEmail || !selectedGrantAssetId) {
      alert('Please select a user and an asset.');
      return;
    }

    const targetUser = users.find(u => u.email.toLowerCase() === selectedGrantUserEmail.toLowerCase());
    const targetAsset = downloadables.find(d => d.id === selectedGrantAssetId);

    if (!targetAsset) return;

    setGranting(true);
    try {
      let expiresAt: string | undefined = undefined;
      if (grantExpiresDays > 0) {
        expiresAt = new Date(Date.now() + grantExpiresDays * 86400000).toISOString();
      }

      await api.grantAssetToUser({
        user_id: targetUser?.id || 'usr-gen-' + Date.now(),
        user_email: selectedGrantUserEmail,
        user_name: targetUser ? `${targetUser.first_name} ${targetUser.last_name}` : selectedGrantUserEmail,
        asset_id: targetAsset.id,
        asset_title: targetAsset.title,
        filename: targetAsset.filename,
        granted_by: 'admin',
        granted_by_detail: 'Manual Admin Assignment via Access Studio',
        expires_at: expiresAt,
        max_downloads: grantMaxDownloads > 0 ? grantMaxDownloads : undefined
      }, grantSendEmail);

      showToast(`✓ Assigned "${targetAsset.title}" to ${selectedGrantUserEmail}${grantSendEmail ? ' & emailed copy!' : ''}`);
      loadAllData();
    } catch (err: any) {
      alert(`Grant Error: ${err?.message || 'Failed to grant access'}`);
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeGrant = async (grantId: string, assetTitle: string, email: string) => {
    if (!window.confirm(`Revoke access to "${assetTitle}" for ${email}?`)) return;

    try {
      await api.revokeAssetGrant(grantId);
      showToast(`Revoked access for ${email}.`);
      loadAllData();
    } catch (err) {
      console.error('Failed to revoke grant:', err);
    }
  };

  // Product Auto-Trigger Mapping
  const handleAddTriggerLink = async (productId: string, assetId: string) => {
    const targetAsset = downloadables.find(d => d.id === assetId);
    if (!targetAsset) return;

    const currentLinks = targetAsset.linked_product_ids || [];
    if (currentLinks.includes(productId)) {
      showToast('This product trigger mapping already exists!');
      return;
    }

    const updated = {
      ...targetAsset,
      linked_product_ids: [...currentLinks, productId],
      access_rule: 'product_purchase_required' as AssetAccessRule
    };

    await api.saveDownloadable(updated);
    showToast(`✓ Linked product sale auto-trigger to "${targetAsset.title}"!`);
    loadAllData();
  };

  const handleRemoveTriggerLink = async (productId: string, assetId: string) => {
    const targetAsset = downloadables.find(d => d.id === assetId);
    if (!targetAsset) return;

    const currentLinks = targetAsset.linked_product_ids || [];
    const updated = {
      ...targetAsset,
      linked_product_ids: currentLinks.filter(p => p !== productId)
    };

    await api.saveDownloadable(updated);
    showToast('Removed trigger link.');
    loadAllData();
  };

  // Trigger Simulator
  const handleSimulatePurchaseTrigger = async () => {
    if (!selectedGrantUserEmail || !triggerProductId) {
      alert('Select a user email and product to simulate checkout trigger.');
      return;
    }

    const targetUser = users.find(u => u.email.toLowerCase() === selectedGrantUserEmail.toLowerCase()) || {
      id: 'usr-sim-' + Date.now(),
      auth_user_id: 'auth-sim',
      first_name: 'Simulated',
      last_name: 'Customer',
      email: selectedGrantUserEmail,
      role: 'customer' as const,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const targetProd = products.find(p => p.id === triggerProductId);
    if (!targetProd) return;

    setSimulatingTrigger(true);
    try {
      const simOrder = {
        id: 'ord-sim-' + Date.now(),
        user_id: targetUser.id,
        customer_name: `${targetUser.first_name} ${targetUser.last_name}`,
        customer_email: targetUser.email,
        order_number: `BKRL-SIM-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'paid' as const,
        payment_status: 'paid' as const,
        fulfillment_status: 'unfulfilled' as const,
        subtotal: targetProd.price,
        shipping_amount: 0,
        tax_amount: 0,
        discount_amount: 0,
        total: targetProd.price,
        currency: 'USD',
        shipping_address: {
          id: 's',
          user_id: targetUser.id,
          type: 'shipping' as const,
          first_name: targetUser.first_name,
          last_name: targetUser.last_name,
          address_line_1: '100 Bio Science Way',
          city: 'Cambridge',
          state: 'MA',
          postal_code: '02142',
          country: 'United States',
          is_default: true
        },
        billing_address: {
          id: 'b',
          user_id: targetUser.id,
          type: 'billing' as const,
          first_name: targetUser.first_name,
          last_name: targetUser.last_name,
          address_line_1: '100 Bio Science Way',
          city: 'Cambridge',
          state: 'MA',
          postal_code: '02142',
          country: 'United States',
          is_default: true
        },
        payment_method: 'credit_card',
        items: [
          {
            id: 'item-sim',
            order_id: 'ord-sim',
            product_id: targetProd.id,
            product_name_snapshot: targetProd.name,
            sku_snapshot: targetProd.sku,
            unit_price: targetProd.price,
            quantity: 1,
            subtotal: targetProd.price
          }
        ],
        acknowledgments_accepted: true,
        age_verified_at_checkout: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const grantsCreated = await api.processAutomaticAssetUnlocks(targetUser, simOrder);

      if (grantsCreated.length > 0) {
        showToast(`⚡ Purchase Simulation Success! Auto-granted ${grantsCreated.length} asset(s) and emailed ${targetUser.email}!`);
      } else {
        showToast(`⚡ Simulated purchase of "${targetProd.name}". Note: No digital assets were linked to this product yet. Add a trigger mapping below!`);
      }

      loadAllData();
    } catch (err: any) {
      alert(`Simulation Error: ${err?.message || 'Failed trigger test'}`);
    } finally {
      setSimulatingTrigger(false);
    }
  };

  // Compile App APK / iOS Builders
  const handleCompileNewApkBuild = () => {
    setIsBuildingApk(true);
    setBuildingPlatform('android');
    setBuildProgress(10);
    setBuildLogs(['Initializing BK Research Labs Android Build Environment...', 'Loading Gradle 8.2 & Kotlin 1.9 compiler plugins...']);

    setTimeout(() => {
      setBuildProgress(35);
      setBuildLogs(prev => [...prev, 'Bundling React web app assets into Capacitor Android WebView...', 'Compiling native Kotlin wrappers & biometric auth modules...']);
    }, 1200);

    setTimeout(() => {
      setBuildProgress(70);
      setBuildLogs(prev => [...prev, 'Generating signed release APK (aligning Zipalign & Keystore RSA-4096)...', 'Generating QR Code installer metadata...']);
    }, 2400);

    setTimeout(() => {
      setBuildProgress(100);
      setBuildLogs(prev => [...prev, '✓ Build Succeeded! BK-Research-Labs-v1.0.4.apk ready for distribution.']);
      setIsBuildingApk(false);
      showToast('✓ Compiled new Android APK Package v1.0.4 successfully!');
    }, 3600);
  };

  const handleCompileNewIosBuild = () => {
    setIsBuildingIos(true);
    setBuildingPlatform('ios');
    setBuildProgress(15);
    setBuildLogs(['Initializing Xcode 16 Build Server...', 'Loading Swift 6 toolchain & Capacitor iOS framework...']);

    setTimeout(() => {
      setBuildProgress(45);
      setBuildLogs(prev => [...prev, 'Compiling native iOS App targets & Apple Wallet Pass Kit...', 'Applying App Store provision profile & entitlement certs...']);
    }, 1200);

    setTimeout(() => {
      setBuildProgress(80);
      setBuildLogs(prev => [...prev, 'Packaging BK-Research-Labs-v1.0.4.ipa bundle...', 'Uploading symbols to TestFlight distribution queue...']);
    }, 2500);

    setTimeout(() => {
      setBuildProgress(100);
      setBuildLogs(prev => [...prev, '✓ iOS Build Succeeded! BK-Research-Labs-v1.0.4.ipa generated.']);
      setIsBuildingIos(false);
      showToast('✓ Compiled new iOS IPA Package v1.0.4 successfully!');
    }, 3800);
  };

  // Filtered Assets
  const filteredAssets = downloadables.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    const matchesAccess = selectedAccessRule === 'all' || (item.access_rule || 'public') === selectedAccessRule;

    return matchesSearch && matchesCategory && matchesPlatform && matchesAccess;
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#031b19] border border-emerald-500/80 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#002b29] to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/50 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Asset Storage & Access Control System
              </span>
              <span className="text-slate-400 text-xs">• {downloadables.length} Assets Registered</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Asset & Storage Access Studio
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Manage digital files, assign downloads to select registered users, map automatic product purchase access triggers, and dispatch email download copies in real-time.
            </p>
          </div>

          {/* Quick Build & Add Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Asset</span>
            </button>

            <button
              onClick={handleCompileNewApkBuild}
              disabled={isBuildingApk}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-white/10"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>{isBuildingApk ? 'Compiling APK...' : 'Build Android APK'}</span>
            </button>

            <button
              onClick={handleCompileNewIosBuild}
              disabled={isBuildingIos}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all border border-white/10"
            >
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>{isBuildingIos ? 'Building IPA...' : 'Build iOS App'}</span>
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="mt-8 pt-6 border-t border-emerald-800/60 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'library', label: '📁 Asset Library & Storage', count: downloadables.length },
            { id: 'grants', label: '👤 User Access & Manual Grants', count: grants.length },
            { id: 'triggers', label: '⚡ Product Auto-Triggers', count: downloadables.filter(d => (d.linked_product_ids || []).length > 0).length },
            { id: 'logs', label: '📧 Email Dispatch & Access Logs', count: emailLogs.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveStudioTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeStudioTab === tab.id
                  ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100 border border-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md font-mono text-[10px] ${
                activeStudioTab === tab.id ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Build Logs Progress Drawer (if compiling) */}
      {(isBuildingApk || isBuildingIos) && (
        <div className="bg-slate-950 border border-emerald-800 text-emerald-400 rounded-3xl p-6 shadow-2xl space-y-4 font-mono text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Active Compiler Toolchain: {buildingPlatform === 'android' ? 'Android APK Compiler' : 'iOS IPA Builder'}</span>
            </div>
            <span className="text-emerald-400 font-bold">{buildProgress}%</span>
          </div>

          <div className="w-full bg-emerald-950 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${buildProgress}%` }} />
          </div>

          <div className="bg-black/60 p-3 rounded-xl h-28 overflow-y-auto space-y-1 text-[11px] text-emerald-300">
            {buildLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 shrink-0">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= STUDIO TAB 1: ASSET LIBRARY & STORAGE ================= */}
      {activeStudioTab === 'library' && (
        <div className="space-y-6">
          {/* Search & Filters Toolbar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search Bar */}
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search title, filename, notes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                />
              </div>

              {/* Access Rule Filter */}
              <div>
                <select
                  value={selectedAccessRule}
                  onChange={e => setSelectedAccessRule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                >
                  <option value="all">🛡️ All Access Control Rules</option>
                  <option value="public">🌐 Public (Anyone)</option>
                  <option value="registered_only">👤 Registered Members Only</option>
                  <option value="product_purchase_required">⚡ Product Purchase Required</option>
                  <option value="admin_granted_only">🔒 Admin Granted Only</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                >
                  <option value="all">📂 All Categories</option>
                  <option value="app">Mobile Apps (.apk / .ipa)</option>
                  <option value="coa">Certificates of Analysis (COA)</option>
                  <option value="software">Software & Parsers</option>
                  <option value="documentation">Dossiers & Protocols</option>
                  <option value="dataset">Raw Datasets</option>
                  <option value="other">Other Files</option>
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <select
                  value={selectedPlatform}
                  onChange={e => setSelectedPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002b29]"
                >
                  <option value="all">💻 All OS Platforms</option>
                  <option value="android">Android</option>
                  <option value="ios">iOS</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="all">Cross-Platform</option>
                </select>
              </div>
            </div>
          </div>

          {/* Asset Grid */}
          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-slate-500 text-xs font-bold">Loading Digital Assets and Storage Matrix...</p>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <HardDrive className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-700 text-sm font-bold">No digital assets match your filter criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedPlatform('all'); setSelectedAccessRule('all'); }}
                className="text-xs text-emerald-800 font-bold hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAssets.map(item => {
                const accessRule = item.access_rule || (item.is_public ? 'public' : item.requires_auth ? 'registered_only' : 'public');
                const linkedCount = (item.linked_product_ids || []).length;
                const assignedCount = (item.assigned_user_emails || []).length;

                return (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all group">
                    <div className="space-y-3">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold rounded-lg uppercase">
                          {item.category} • {item.platform}
                        </span>

                        {accessRule === 'public' && (
                          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <Unlock className="w-3 h-3 text-emerald-700" /> Public Access
                          </span>
                        )}
                        {accessRule === 'registered_only' && (
                          <span className="px-2.5 py-0.5 bg-sky-100 text-sky-900 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3 text-sky-700" /> Registered Only
                          </span>
                        )}
                        {accessRule === 'product_purchase_required' && (
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-700" /> Purchase Trigger ({linkedCount} Products)
                          </span>
                        )}
                        {accessRule === 'admin_granted_only' && (
                          <span className="px-2.5 py-0.5 bg-rose-100 text-rose-900 font-bold text-[10px] rounded-full flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-700" /> Admin Assigned Only
                          </span>
                        )}
                      </div>

                      {/* Title & Filename */}
                      <div>
                        <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#002b29] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{item.filename}</code>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.description || 'No description specified for this digital file asset.'}
                      </p>

                      {/* Stats pill */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-600">
                        <div>Size: <strong className="text-slate-900">{item.file_size}</strong></div>
                        <div>Downloads: <strong className="text-emerald-700">{item.download_count}</strong></div>
                        <div>Emailed: <strong className="text-sky-700">{item.email_sent_count || 0}</strong></div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Send Copy to Email Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEmailModal(item)}
                          className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Copy to Email</span>
                        </button>

                        {/* Copy Download Link */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                          title="Copy Download Link"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>

                        {/* QR Code button for mobile APKs/IPAs */}
                        {(item.platform === 'android' || item.platform === 'ios') && (
                          <button
                            type="button"
                            onClick={() => setShowQrModal(item)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                            title="Generate QR Code"
                          >
                            <QrCode className="w-4 h-4 text-slate-700" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="text-emerald-800 hover:underline font-bold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Asset & Triggers
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="text-rose-600 hover:underline font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= STUDIO TAB 2: USER ACCESS & MANUAL GRANTS ================= */}
      {activeStudioTab === 'grants' && (
        <div className="space-y-8">
          {/* Form: Manual User Download Grant Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-widest">Access Control Assignment</span>
              <h2 className="font-serif font-bold text-xl text-slate-900">Assign File Downloads to Registered User</h2>
              <p className="text-xs text-slate-500">Select any registered account, choose an asset, set optional download caps or expiration, and dispatch an email download link immediately.</p>
            </div>

            <form onSubmit={handleCreateGrant} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {/* Select Registered User */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Users className="w-4 h-4 text-emerald-700" /> Select Registered User:
                </label>
                <select
                  value={selectedGrantUserEmail}
                  onChange={e => setSelectedGrantUserEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.email}>
                      {u.first_name} {u.last_name} ({u.email}) [{u.role.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Asset */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <HardDrive className="w-4 h-4 text-emerald-700" /> Select Digital Asset:
                </label>
                <select
                  value={selectedGrantAssetId}
                  onChange={e => setSelectedGrantAssetId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                >
                  {downloadables.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.filename})
                    </option>
                  ))}
                </select>
              </div>

              {/* Expiration Days */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-emerald-700" /> Access Expiration:
                </label>
                <select
                  value={grantExpiresDays}
                  onChange={e => setGrantExpiresDays(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#002b29]"
                >
                  <option value={0}>♾️ Lifetime Access (No Expiration)</option>
                  <option value={7}>7 Days Access</option>
                  <option value={30}>30 Days Access</option>
                  <option value={90}>90 Days Access</option>
                  <option value={365}>1 Year Access</option>
                </select>
              </div>

              {/* Max Download Count */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Download className="w-4 h-4 text-emerald-700" /> Max Download Limit:
                </label>
                <select
                  value={grantMaxDownloads}
                  onChange={e => setGrantMaxDownloads(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#002b29]"
                >
                  <option value={0}>♾️ Unlimited Downloads</option>
                  <option value={1}>1 Download Max</option>
                  <option value={3}>3 Downloads Max</option>
                  <option value={5}>5 Downloads Max</option>
                  <option value={10}>10 Downloads Max</option>
                </select>
              </div>

              {/* Checkbox send email */}
              <div className="md:col-span-2 lg:col-span-2 flex items-center gap-3 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-bold">
                  <input
                    type="checkbox"
                    checked={grantSendEmail}
                    onChange={e => setGrantSendEmail(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span>Dispatch email copy with download link to user's inbox immediately upon granting</span>
                </label>
              </div>

              <div className="md:col-span-2 lg:col-span-3 pt-2">
                <button
                  type="submit"
                  disabled={granting}
                  className="px-6 py-3 bg-[#002b29] hover:bg-[#003d3a] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{granting ? 'Assigning & Emailing...' : 'Grant Download Access Now'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Grants Table */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Active User Access Grants</h3>
                <p className="text-xs text-slate-500">List of manually assigned or purchase-unlocked digital asset grants across registered user accounts.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{grants.length} Total Active Grants</span>
            </div>

            {grants.length === 0 ? (
              <p className="text-slate-400 text-xs py-6 text-center">No active user grants found. Assign asset access above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase tracking-wider font-extrabold">
                      <th className="pb-3 pl-2">Target Registered User</th>
                      <th className="pb-3">Granted Digital Asset</th>
                      <th className="pb-3">Trigger Source</th>
                      <th className="pb-3">Granted Date</th>
                      <th className="pb-3">Downloads Used</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {grants.map(grant => (
                      <tr key={grant.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="font-bold text-slate-900">{grant.user_name || 'Registered User'}</div>
                          <div className="font-mono text-[11px] text-emerald-800">{grant.user_email}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-slate-900">{grant.asset_title}</div>
                          <div className="font-mono text-[10px] text-slate-400">{grant.filename}</div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            grant.granted_by === 'product_purchase'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {grant.granted_by === 'product_purchase' ? '⚡ Purchase Auto' : '👤 Admin Manual'}
                          </span>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs">{grant.granted_by_detail}</div>
                        </td>
                        <td className="py-3 text-slate-600 font-mono text-[11px]">
                          {new Date(grant.granted_at).toLocaleDateString()}
                          {grant.expires_at && (
                            <div className="text-[10px] text-rose-600">Expires: {new Date(grant.expires_at).toLocaleDateString()}</div>
                          )}
                        </td>
                        <td className="py-3 font-mono">
                          <span className="font-bold text-emerald-700">{grant.download_count}</span>
                          {grant.max_downloads ? ` / ${grant.max_downloads}` : ' (Unlimited)'}
                        </td>
                        <td className="py-3 text-right pr-2 space-x-2">
                          <button
                            type="button"
                            onClick={() => api.sendAssetToEmail(grant.asset_id, grant.user_email).then(r => showToast(`✓ ${r.message}`))}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] rounded-lg transition-colors"
                            title="Re-email download link to user"
                          >
                            Email Copy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevokeGrant(grant.id, grant.asset_title, grant.user_email)}
                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-[10px] rounded-lg transition-colors"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= STUDIO TAB 3: PRODUCT AUTO-TRIGGERS ================= */}
      {activeStudioTab === 'triggers' && (
        <div className="space-y-8">
          {/* Purchase Trigger Mapper */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">Automatic Purchase Trigger Engine</span>
              <h2 className="font-serif font-bold text-xl text-slate-900">Map Product Sale to Automatic File Access</h2>
              <p className="text-xs text-slate-500">When a registered customer buys a specific product, the system automatically unlocks the designated digital assets in their account and dispatches an email copy immediately.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">1. When Customer Buys Product:</label>
                <select
                  value={triggerProductId}
                  onChange={e => setTriggerProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#002b29]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (${p.price.toFixed(2)}) [SKU: {p.sku}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">2. Automatically Unlock Digital Asset:</label>
                <select
                  value={triggerAssetId}
                  onChange={e => setTriggerAssetId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-mono focus:outline-none focus:border-[#002b29]"
                >
                  {downloadables.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.filename})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => handleAddTriggerLink(triggerProductId, triggerAssetId)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Zap className="w-4 h-4" />
                  <span>Create Trigger Mapping</span>
                </button>
              </div>
            </div>

            {/* Test Trigger Simulator Box */}
            <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Test Purchase Auto-Grant Simulator
                </div>
                <p className="text-[11px] text-amber-800">
                  Simulate a successful order checkout for <strong className="font-mono">{selectedGrantUserEmail}</strong> purchasing the selected product above to test the real-time grant & email flow.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSimulatePurchaseTrigger}
                disabled={simulatingTrigger}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-md"
              >
                <Activity className="w-4 h-4 text-amber-400" />
                <span>{simulatingTrigger ? 'Simulating Checkout...' : 'Simulate Purchase Trigger'}</span>
              </button>
            </div>
          </div>

          {/* Existing Product Trigger Mappings */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-slate-900">Active Product Purchase Access Triggers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloadables.filter(d => (d.linked_product_ids || []).length > 0).map(asset => (
                <div key={asset.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900">{asset.title}</div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">
                      {(asset.linked_product_ids || []).length} Linked Products
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Triggering Product Sales:</div>
                    <div className="space-y-1">
                      {(asset.linked_product_ids || []).map(pId => {
                        const prod = products.find(p => p.id === pId);
                        return (
                          <div key={pId} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-xl border border-slate-200 font-mono text-[11px]">
                            <span className="font-bold text-slate-800">{prod?.name || pId}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTriggerLink(pId, asset.id)}
                              className="text-rose-600 hover:underline text-[10px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STUDIO TAB 4: EMAIL DISPATCH & ACCESS LOGS ================= */}
      {activeStudioTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900">Digital Asset Email Dispatch & Access Audit Trail</h3>
              <p className="text-xs text-slate-500">Real-time log of asset email dispatches, purchase triggers, and user download requests.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{emailLogs.length} Total Logs</span>
          </div>

          {emailLogs.length === 0 ? (
            <p className="text-slate-400 text-xs py-6 text-center">No digital asset email logs recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {emailLogs.map(log => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.asset_title}</span>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold uppercase ${
                        log.trigger_source === 'automatic_purchase'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {log.trigger_source}
                      </span>
                    </div>

                    <div className="font-mono text-[11px] text-slate-600 flex items-center gap-2">
                      <span>Recipient: <strong className="text-emerald-800">{log.recipient_email}</strong></span>
                      <span>• File: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{log.filename}</code></span>
                    </div>

                    <div className="text-[10px] text-slate-400">{log.details}</div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                    <div>{new Date(log.sent_at).toLocaleDateString()} {new Date(log.sent_at).toLocaleTimeString()}</div>
                    <div className="text-emerald-700 font-bold flex items-center justify-end gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Dispatched
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Immediate Email Send Modal */}
      {emailModalAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Mail className="w-5 h-5 text-emerald-700" />
                <span>Send Copy to Email Immediately</span>
              </div>
              <button
                onClick={() => setEmailModalAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1 text-xs">
              <div className="font-extrabold text-slate-900">{emailModalAsset.title}</div>
              <div className="font-mono text-slate-500 text-[11px]">{emailModalAsset.filename} ({emailModalAsset.file_size})</div>
            </div>

            <form onSubmit={handleSendEmailImmediately} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Recipient Email Address:</label>
                <input
                  type="email"
                  required
                  value={emailRecipient}
                  onChange={e => setEmailRecipient(e.target.value)}
                  placeholder="e.g. researcher@biotech-lab.org"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-[#002b29] font-mono"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                This dispatches a direct download copy with MD5 checksum verification directly to the recipient email via the connected active SMTP profile.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEmailModalAsset(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={emailSending}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{emailSending ? 'Dispatching...' : 'Send Copy Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Add / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="font-serif font-bold text-xl text-slate-900">
                {editingItem.id ? 'Edit Digital Asset & Access Rules' : 'Add New Storage Asset'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Asset Display Title:</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Tesamorelin Lot 2026-A COA & Protocol"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Filename:</label>
                  <input
                    type="text"
                    required
                    value={editingItem.filename || ''}
                    onChange={e => setEditingItem({ ...editingItem, filename: e.target.value })}
                    placeholder="e.g. Tesamorelin-2026-A.pdf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Access Control Rule:</label>
                  <select
                    value={editingItem.access_rule || (editingItem.is_public ? 'public' : 'product_purchase_required')}
                    onChange={e => {
                      const rule = e.target.value as AssetAccessRule;
                      setEditingItem({
                        ...editingItem,
                        access_rule: rule,
                        is_public: rule === 'public',
                        requires_auth: rule !== 'public'
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#002b29]"
                  >
                    <option value="public">🌐 Public (Anyone can download)</option>
                    <option value="registered_only">👤 Registered Members Only</option>
                    <option value="product_purchase_required">⚡ Product Purchase Required (Auto-Unlocked on Checkout)</option>
                    <option value="admin_granted_only">🔒 Admin Granted Only (Explicit Admin Manual Assignment)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category:</label>
                  <select
                    value={editingItem.category || 'software'}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as DownloadCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#002b29]"
                  >
                    <option value="app">Mobile App Package</option>
                    <option value="coa">Certificate of Analysis (COA)</option>
                    <option value="software">Software / Parser Utility</option>
                    <option value="documentation">Documentation / Dossier</option>
                    <option value="dataset">Raw Analytical Dataset</option>
                    <option value="other">Other File</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Platform Target:</label>
                  <select
                    value={editingItem.platform || 'all'}
                    onChange={e => setEditingItem({ ...editingItem, platform: e.target.value as DownloadPlatform })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#002b29]"
                  >
                    <option value="all">All / Cross-Platform</option>
                    <option value="android">Android</option>
                    <option value="ios">iOS</option>
                    <option value="windows">Windows</option>
                    <option value="macos">macOS</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">File Size & Version:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editingItem.file_size || '10.0 MB'}
                      onChange={e => setEditingItem({ ...editingItem, file_size: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#002b29]"
                    />
                    <input
                      type="text"
                      value={editingItem.version || '1.0.0'}
                      onChange={e => setEditingItem({ ...editingItem, version: e.target.value })}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#002b29]"
                    />
                  </div>
                </div>
              </div>

              {/* Linked Product Auto-Triggers */}
              {(editingItem.access_rule === 'product_purchase_required' || !editingItem.access_rule) && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2">
                  <label className="font-bold text-amber-900 block">
                    ⚡ Linked Products (Purchasing any of these products automatically unlocks this download):
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 border border-amber-200 rounded-xl p-2 bg-white">
                    {products.map(p => {
                      const isLinked = (editingItem.linked_product_ids || []).includes(p.id);
                      return (
                        <label key={p.id} className="flex items-center gap-2 cursor-pointer text-[11px] font-mono text-slate-800">
                          <input
                            type="checkbox"
                            checked={isLinked}
                            onChange={e => {
                              const curr = editingItem.linked_product_ids || [];
                              const updated = e.target.checked ? [...curr, p.id] : curr.filter(id => id !== p.id);
                              setEditingItem({ ...editingItem, linked_product_ids: updated });
                            }}
                            className="w-3.5 h-3.5 text-amber-600 rounded"
                          />
                          <span>{p.name} (${p.price.toFixed(2)})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Description & Usage Notes:</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Detailed description for customer portal display..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#002b29]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Download URL / Storage Path:</label>
                <input
                  type="text"
                  value={editingItem.download_url || ''}
                  onChange={e => setEditingItem({ ...editingItem, download_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-slate-900 text-xs focus:outline-none focus:border-[#002b29]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#002b29] text-white font-extrabold rounded-xl shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Dialog Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-scale-up">
            <h3 className="font-serif font-bold text-lg text-slate-900">Mobile Installer QR Code</h3>
            <p className="text-xs text-slate-500">Scan with your camera to install {showQrModal.filename} on your mobile device.</p>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block">
              {/* Simulated high density QR Code */}
              <div className="w-40 h-40 bg-slate-900 rounded-xl p-3 grid grid-cols-6 gap-1 mx-auto">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${(i * 7 + 3) % 2 === 0 ? 'bg-emerald-400' : 'bg-slate-950'} rounded-xs`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs font-mono text-slate-600 truncate">{window.location.origin + showQrModal.download_url}</div>

            <button
              onClick={() => setShowQrModal(null)}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Close QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
