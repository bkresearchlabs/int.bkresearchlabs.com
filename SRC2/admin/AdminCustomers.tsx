import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Mail, Phone, Calendar, UserPlus, Crown, Shield, Package, UserCheck, CheckCircle2, AlertCircle, Edit3, Trash2, Search, Filter, Save, X, Database, Info, Sparkles, Check, ChevronRight } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { api, DEFAULT_OWNER, DEFAULT_ADMIN, DEFAULT_EMPLOYEE } from '../../lib/supabase';

interface RoleInfo {
  id: UserRole;
  title: string;
  badge: string;
  badgeColor: string;
  accentColor: string;
  bgGrad: string;
  borderColor: string;
  icon: any;
  summary: string;
  fullDescription: string;
  capabilities: string[];
  accessLevel: string;
  systemScope: string;
}

const ROLE_DETAILS_LIST: RoleInfo[] = [
  {
    id: 'owner',
    title: '1. Owner Role',
    badge: 'FULL READ/WRITE',
    badgeColor: 'bg-amber-500 text-black',
    accentColor: 'text-amber-400',
    bgGrad: 'from-amber-950/40 to-[#0a0f0e]',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    icon: Crown,
    summary: 'Executive oversight over products, orders, financial metrics, and PO contracts. Direct protection on core system configuration files.',
    fullDescription: 'The Owner role holds sovereign administrative control across the entire BK Research Labs digital ecosystem. This includes unrestricted read/write access to financial gateways, merchant settings, master inventory registries, database migrations, and staff RBAC authorization.',
    capabilities: [
      'Unrestricted access to all operational, financial, and catalog systems',
      'Direct configuration of Stripe, Authorize.Net, and crypto payment gateways',
      'Authority to assign, modify, and revoke Admin, Employee, and Customer accounts',
      'Supabase schema migrations, SQL direct execution, and audit log inspection',
      'Supplier Purchase Orders (PO) issuance, raw inventory replenishment, and cost analysis'
    ],
    accessLevel: 'Tier 1 — Master Sovereign Administrative Authority',
    systemScope: 'Global Enterprise Scope'
  },
  {
    id: 'admin',
    title: '2. Admin Role',
    badge: 'FULL ADMIN ACCESS',
    badgeColor: 'bg-emerald-500 text-black',
    accentColor: 'text-emerald-400',
    bgGrad: 'from-emerald-950/40 to-[#0a0f0e]',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    icon: ShieldCheck,
    summary: 'Full system control. Ability to create other Admins, assign Employee fulfillment accounts, modify compliance settings & SQL migrations.',
    fullDescription: 'The Admin role provides comprehensive operational management over storefront catalogs, order flows, customer records, batch analytical certificates (CoA), and system compliance settings.',
    capabilities: [
      'Full product catalog CRUD, lot assignment, and HPLC analytical report uploads',
      'Customer account verification, status modifications, and password resets',
      'Fulfillment oversight, order dispatch approvals, and batch tracking management',
      'Compliance policy editing, announcement banners, and SEO metadata',
      'System metrics monitoring, daily transaction analytics, and CSV exports'
    ],
    accessLevel: 'Tier 2 — Full Operational & Compliance Administration',
    systemScope: 'Storefront, Operations & Staff Scope'
  },
  {
    id: 'security_admin',
    title: '3. Web App Security Admin',
    badge: 'SECURITY & WAF ADMIN (AUDITED)',
    badgeColor: 'bg-cyan-500 text-black',
    accentColor: 'text-cyan-400',
    bgGrad: 'from-cyan-950/40 to-[#0a0f0e]',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    icon: Shield,
    summary: 'Full authority to configure Layer 7 WAF, API rate limiters, SSL/TLS, dynamic IP lockouts, and mitigation rules. All actions are logged and subject to supervisor review.',
    fullDescription: 'The Web App Security Administrator oversees technical defensive layers, threat monitoring, cryptographic key rotations, and perimeter defenses. To maintain strict zero-trust governance, every configuration modification made by this role is recorded with before/after state in the immutable audit trail for Executive Admin and Owner review.',
    capabilities: [
      'Master control over Layer 7 WAF inspection rules, SQLi filters, and XSS sanitizers',
      'Adjustment of API Gateway velocity throttling, burst limits, and DDoS mitigation',
      'SSL/TLS version enforcement (TLS 1.3), HSTS preload, and cipher suite configuration',
      'Dynamic IP quarantine, lockout duration management, and whitelist provisioning',
      'Automated RASP tamper inspection, mobile cert pinning, and scheduled vulnerability scans',
      'Session telemetry and change logging with mandatory supervisor audit reviews'
    ],
    accessLevel: 'Tier 2.5 — Specialized Defensive Security & Perimeter Authority (Supervised)',
    systemScope: 'Web App Security, Threat Mitigation & Audit Logs'
  },
  {
    id: 'employee',
    title: '4. Employee Role',
    badge: 'FULFILLMENT ACCESS',
    badgeColor: 'bg-indigo-500 text-white',
    accentColor: 'text-indigo-400',
    bgGrad: 'from-indigo-950/40 to-[#0a0f0e]',
    borderColor: 'border-indigo-500/40 hover:border-indigo-400',
    icon: Package,
    summary: 'Access needed to process pending orders, generate & print shipping labels, enter tracking numbers, and update stock counts.',
    fullDescription: 'The Employee role is precision-tailored for warehouse, lab logistics, and fulfillment specialists. It streamlines daily packing, batch packaging verification, shipping label generation, and stock level adjustments.',
    capabilities: [
      'View and process pending research chemical and compound orders',
      'Enter FedEx/UPS/USPS tracking numbers and dispatch email notifications',
      'Generate and print batch packing slips with lab warning notices',
      'Update physical inventory count and flag damaged or quarantined lots',
      'Restricted from viewing financial margins, customer credentials, or API keys'
    ],
    accessLevel: 'Tier 3 — Logistics & Order Fulfillment Specialist',
    systemScope: 'Warehouse & Dispatch Operations'
  },
  {
    id: 'customer',
    title: '5. Customer Role',
    badge: 'CLIENT ACCESS',
    badgeColor: 'bg-teal-800 text-teal-100',
    accentColor: 'text-teal-400',
    bgGrad: 'from-teal-950/40 to-[#0a0f0e]',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    icon: UserCheck,
    summary: 'Standard research client account. Place orders, download lot-specific COAs, save compounds, view individual order tracking.',
    fullDescription: 'The Customer role enables verified laboratory institutions, researchers, and universities to securely order certified reference materials, view analytical HPLC/MS purity sheets, and manage procurement history.',
    capabilities: [
      'Browse certified chemical catalog with live quantity indicators',
      'Download lot-specific HPLC and Mass Spectrometry Certificates of Analysis (COA)',
      'Create and manage saved chemical workbenches (Save for Later workbench)',
      'View real-time shipment status and carrier tracking milestones',
      'Update institutional shipping addresses and researcher profile data'
    ],
    accessLevel: 'Tier 4 — Verified Research Client & Institution',
    systemScope: 'Client Storefront & Personal Account'
  }
];

interface AdminCustomersProps {
  user: UserProfile;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ user }) => {
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [activeRoleModal, setActiveRoleModal] = useState<RoleInfo | null>(null);
  const [hoveredRoleId, setHoveredRoleId] = useState<UserRole | null>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('customer');
  const [newStatus, setNewStatus] = useState<'active' | 'suspended' | 'disabled'>('active');

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Notice State
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNoticeMsg(msg);
    setTimeout(() => setNoticeMsg(null), 5000);
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const fetched = await api.getUsers();
      setUsersList(fetched);
    } catch (err) {
      console.error('Failed to load user accounts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName || !newEmail) return;

    try {
      const saved = await api.saveUser({
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        phone: newPhone,
        role: newRole,
        status: newStatus,
      });

      await loadUsers();
      showNotice(`Successfully added customer/user profile for ${saved.first_name} ${saved.last_name} (${saved.email}) to Database!`);

      // Reset form
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPhone('');
      setNewRole('customer');
      setNewStatus('active');
      setIsCreateModalOpen(false);
    } catch (err) {
      showNotice(`Error saving customer account to database. Please check input.`);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updated = await api.saveUser({
        id: editingUser.id,
        auth_user_id: editingUser.auth_user_id,
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status,
      });

      await loadUsers();
      showNotice(`Updated record for ${updated.first_name} ${updated.last_name} in Database!`);
      setEditingUser(null);
    } catch (err) {
      showNotice(`Failed to update customer record.`);
    }
  };

  const handleRoleChange = async (userId: string, targetRole: UserRole) => {
    try {
      const updatedUser = await api.updateUserRole(userId, targetRole);
      setUsersList(prev => prev.map(u => u.id === userId ? updatedUser : u));
      showNotice(`Updated role for ${updatedUser.first_name} ${updatedUser.last_name} to ${targetRole.toUpperCase()} in Database!`);
    } catch (err) {
      showNotice(`Failed to update user role.`);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userName}"? This will remove the record from database and local storage.`)) {
      return;
    }

    try {
      await api.deleteUser(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId));
      showNotice(`Deleted account "${userName}" from Database.`);
    } catch (err) {
      showNotice(`Error deleting user record.`);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch =
      u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {noticeMsg && (
        <div className="bg-[#002b29] text-emerald-100 p-4 rounded-2xl border border-emerald-500/50 text-xs font-bold flex items-center justify-between gap-2 shadow-xl animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{noticeMsg}</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded uppercase">
            Database Synced
          </span>
        </div>
      )}

      {/* Role Access Matrix Cards Header - Interactive Cards with Hidden Descriptions, Hover Tooltips & Click Pop-up Window */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ROLE_DETAILS_LIST.map((role) => {
          const Icon = role.icon;
          const isHovered = hoveredRoleId === role.id;

          return (
            <div
              key={role.id}
              onClick={() => setActiveRoleModal(role)}
              onMouseEnter={() => setHoveredRoleId(role.id)}
              onMouseLeave={() => setHoveredRoleId(null)}
              className={`relative group cursor-pointer bg-[#0a0f0e] p-4 sm:p-5 rounded-2xl border ${role.borderColor} text-white space-y-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60`}
            >
              {/* Top Title & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className={`${role.accentColor} text-xs font-black uppercase tracking-widest flex items-center gap-1.5 truncate`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{role.title}</span>
                </span>
                <span className={`px-2 py-0.5 ${role.badgeColor} text-[9px] font-extrabold rounded shrink-0 shadow-xs`}>
                  {role.badge}
                </span>
              </div>

              {/* Action Hint / Collapsed State Indicator (Description Hidden by Default) */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors">
                <span className="flex items-center gap-1">
                  <Info className="w-3 h-3 text-emerald-400" />
                  <span>Hover to preview</span>
                </span>
                <span className="flex items-center gap-0.5 text-emerald-300 font-bold">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>

              {/* Interactive Hover Popover Tooltip */}
              {isHovered && (
                <div className="absolute left-0 right-0 -bottom-2 translate-y-full z-30 p-3.5 bg-[#031c19] border border-emerald-500/60 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-none">
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-white/10 text-[10px] font-bold text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{role.accessLevel.split('—')[0]}</span>
                    </span>
                    <span className="text-slate-400 text-[9px]">Click for full modal</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    {role.summary}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Account Management Control Panel */}
      <div className="bg-[#031c19] p-6 rounded-3xl border border-emerald-900/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-serif font-bold text-white">User Accounts & Customer Database</h2>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded flex items-center gap-1">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Live Table Persistence</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Add new research customer accounts, manage institutional users, assign fulfillment staff, or update access roles with automated audit logging.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setNewRole('customer');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Customer</span>
            </button>

            <button
              onClick={() => {
                setNewRole('admin');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Create Staff / Admin</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-emerald-900/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === 'all' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Accounts ({usersList.length})
            </button>

            <button
              onClick={() => setRoleFilter('customer')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === 'customer' ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔬 Customers ({usersList.filter(u => u.role === 'customer').length})
            </button>

            <button
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === 'admin' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Admins ({usersList.filter(u => u.role === 'admin').length})
            </button>

            <button
              onClick={() => setRoleFilter('security_admin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === 'security_admin' ? 'bg-cyan-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛡️ SecAdmin ({usersList.filter(u => u.role === 'security_admin').length})
            </button>

            <button
              onClick={() => setRoleFilter('employee')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === 'employee' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 Staff ({usersList.filter(u => u.role === 'employee').length})
            </button>

            <button
              onClick={() => setRoleFilter('owner')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                roleFilter === 'owner' ? 'bg-amber-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              👑 Owner
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0a0f0e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#050807] border-b border-white/10 uppercase font-bold text-[10px] text-slate-400 tracking-wider">
              <tr>
                <th className="p-4">User Profile</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Change Role Access</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading user database records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No matching user records found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                        u.role === 'owner' ? 'bg-amber-500 text-black' :
                        u.role === 'admin' ? 'bg-emerald-500 text-black' :
                        u.role === 'employee' ? 'bg-indigo-600 text-white' :
                        'bg-teal-800 text-white'
                      }`}>
                        {u.first_name ? u.first_name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{u.first_name} {u.last_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">ID: {u.id}</div>
                      </div>
                    </td>

                    <td className="p-4 space-y-0.5 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded font-extrabold text-[10px] uppercase tracking-wider ${
                        u.role === 'owner' ? 'bg-amber-500 text-black shadow-xs' :
                        u.role === 'admin' ? 'bg-emerald-500 text-black shadow-xs' :
                        u.role === 'security_admin' ? 'bg-cyan-400 text-black shadow-xs font-black' :
                        u.role === 'employee' ? 'bg-indigo-500 text-white shadow-xs' :
                        'bg-teal-900 text-teal-200 border border-teal-700/50'
                      }`}>
                        {u.role === 'owner' && '👑 OWNER'}
                        {u.role === 'admin' && '⚡ ADMIN'}
                        {u.role === 'security_admin' && '🛡️ SEC-ADMIN'}
                        {u.role === 'employee' && '📦 EMPLOYEE'}
                        {u.role === 'customer' && '🔬 CUSTOMER'}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-black/50 border border-white/20 text-white rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      >
                        <option value="customer">🔬 Customer</option>
                        <option value="employee">📦 Employee (Fulfillment)</option>
                        <option value="security_admin">🛡️ Security Admin (SecOps)</option>
                        <option value="admin">⚡ Admin (Full Access)</option>
                        <option value="owner">👑 Owner (Executive)</option>
                      </select>
                    </td>

                    <td className="p-4 text-slate-400 font-mono text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 font-bold rounded-full text-[10px] uppercase border ${
                        u.status === 'active' ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50' :
                        u.status === 'suspended' ? 'bg-amber-950 text-amber-300 border-amber-800/50' :
                        'bg-red-950 text-red-300 border-red-800/50'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingUser(u)}
                          title="Edit Customer Profile"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {u.role !== 'owner' && u.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, `${u.first_name} ${u.last_name}`)}
                            title="Delete Record"
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Customer / User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0a0f0e] text-white rounded-2xl border border-white/20 max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#050807] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>Add Record to Customer & User Database</span>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={e => setNewFirstName(e.target.value)}
                    required
                    placeholder="e.g. Rachel"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={e => setNewLastName(e.target.value)}
                    required
                    placeholder="e.g. Chen"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  placeholder="e.g. rchen@bkresearchlabs.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="e.g. +1 (617) 555-0199"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Role</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="customer">🔬 Customer Account</option>
                    <option value="security_admin">🛡️ Web App Security Admin (Supervised)</option>
                    <option value="admin">⚡ Administrator (Full Access)</option>
                    <option value="employee">📦 Employee (Fulfillment)</option>
                    <option value="owner">👑 Owner (Executive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'active' | 'suspended' | 'disabled')}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save to Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer / User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-[#0a0f0e] text-white rounded-2xl border border-white/20 max-w-md w-full overflow-hidden shadow-2xl">
            <div className="p-5 bg-[#050807] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <span>Edit Customer Record ({editingUser.id})</span>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">First Name</label>
                  <input
                    type="text"
                    value={editingUser.first_name}
                    onChange={e => setEditingUser({ ...editingUser, first_name: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editingUser.last_name}
                    onChange={e => setEditingUser({ ...editingUser, last_name: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Role</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="customer">🔬 Customer Account</option>
                    <option value="security_admin">🛡️ Web App Security Admin (Supervised)</option>
                    <option value="admin">⚡ Administrator (Full Access)</option>
                    <option value="employee">📦 Employee (Fulfillment)</option>
                    <option value="owner">👑 Owner (Executive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'suspended' | 'disabled' })}
                    className="w-full bg-black border border-white/20 text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Details Pop-Up Window / Modal */}
      {activeRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#050807] border border-emerald-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 text-slate-100">
            {/* Top Close Button */}
            <button
              onClick={() => setActiveRoleModal(null)}
              className="absolute top-5 right-5 p-2 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white rounded-full transition-colors"
              title="Close Role Details Window"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3.5 pr-10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-md">
                {React.createElement(activeRoleModal.icon, { className: `w-6 h-6 ${activeRoleModal.accentColor}` })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                    {activeRoleModal.title}
                  </h3>
                  <span className={`px-2.5 py-0.5 ${activeRoleModal.badgeColor} text-[10px] font-extrabold rounded shadow-xs`}>
                    {activeRoleModal.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {activeRoleModal.accessLevel}
                </p>
              </div>
            </div>

            {/* Comprehensive Role Description */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scope & Purpose Description</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeRoleModal.fullDescription}
              </p>
            </div>

            {/* Privileges & Capabilities Checklist */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Authorized Privileges & System Capabilities
              </span>
              <div className="space-y-2">
                {activeRoleModal.capabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-mono">
                Scope: {activeRoleModal.systemScope}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setRoleFilter(activeRoleModal.id);
                    setActiveRoleModal(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all"
                >
                  Filter Table by {activeRoleModal.id.toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveRoleModal(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
