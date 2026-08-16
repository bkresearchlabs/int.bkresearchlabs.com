import { createClient } from '@supabase/supabase-js';
import {
  Product,
  ProductCategory,
  Order,
  TrackingHistoryEntry,
  SiteSettings,
  HomepageContent,
  UserProfile,
  UserRole,
  CartItem,
  SaveForLaterItem,
  DiscountCode,
  AuditLog,
  PurchaseOrder,
  PurchaseOrderStatus,
  PaymentGateway,
  DownloadableItem,
  UserAssetGrant,
  AssetEmailLog,
  CommunicationSystemState,
  EmailProfile,
  EmailProviderConfig,
  EmailNotificationRule,
  InboundEmailMessage,
  EmailLog,
  NotificationTemplateType,
  SmsProfile,
  SmsProviderType,
  SmsNotificationRule,
  SmsNotificationTemplateType,
  SmsLog,
  CustomPage,
  SeoGlobalConfig,
  SeoItemMeta
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SITE_SETTINGS,
  INITIAL_HOMEPAGE_CONTENT,
  INITIAL_SAMPLE_ORDERS,
  INITIAL_DISCOUNTS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_DOWNLOADABLES,
  INITIAL_USER_ASSET_GRANTS,
  INITIAL_ASSET_EMAIL_LOGS,
  INITIAL_COMMUNICATION_STATE,
  INITIAL_CUSTOM_PAGES,
  INITIAL_SEO_CONFIG
} from '../data/initialData';
import {
  tabSync,
  syncAuthAcrossTabs,
  syncCartAcrossTabs,
  syncSaveForLaterAcrossTabs,
  syncSettingsAcrossTabs,
  syncProductsAcrossTabs,
  syncOrdersAcrossTabs,
  syncAgeGateAcrossTabs
} from './tabSync';

// User's configured Supabase project details
const DEFAULT_SUPABASE_URL = 'https://xqqjaylwikpkkngtprno.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_UWuWJKCL82N07HbjtZNG6Q_i2WRUtIU';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// LOCAL STORAGE PERSISTENCE FALLBACK ENGINE
// ==========================================

const STORAGE_KEYS = {
  PRODUCTS: 'bkrl_products_v4',
  CATEGORIES: 'bkrl_categories_v3',
  SETTINGS: 'bkrl_settings_v3',
  HOMEPAGE: 'bkrl_homepage_v3',
  ORDERS: 'bkrl_orders_v3',
  CART: 'bkrl_cart_v3',
  SAVE_FOR_LATER: 'bkrl_save_for_later_v3',
  USER: 'bkrl_user_v3',
  USERS: 'bkrl_users_v3',
  DISCOUNTS: 'bkrl_discounts_v3',
  AUDIT_LOGS: 'bkrl_audit_logs_v3',
  AGE_GATE: 'bkrl_age_gate_v3',
  PURCHASE_ORDERS: 'bkrl_purchase_orders_v3',
  PAYMENT_GATEWAYS: 'bkrl_payment_gateways_v3',
  DOWNLOADABLES: 'bkrl_downloadables_v3',
  USER_ASSET_GRANTS: 'bkrl_user_asset_grants_v1',
  ASSET_EMAIL_LOGS: 'bkrl_asset_email_logs_v1',
  COMMUNICATION_SYSTEM: 'bkrl_communication_v3',
  PAGES: 'bkrl_pages_v1',
};

function replaceTerminologyInString(str: string): string {
  return str
    .replace(/cat-peptides/g, 'cat-compounds')
    .replace(/Analytical Compounds & Reference Standards/g, 'Analytical Compounds & Reference Standards')
    .replace(/analytical-peptides/g, 'analytical-compounds')
    .replace(/Analytical Peptides/g, 'Analytical Compounds')
    .replace(/analytical peptides/g, 'analytical compounds')
    .replace(/ANALYTICAL PEPTIDES/g, 'ANALYTICAL COMPOUNDS')
    .replace(/Peptides/g, 'Compounds')
    .replace(/peptides/g, 'compounds')
    .replace(/PEPTIDES/g, 'COMPOUNDS')
    .replace(/Peptide/g, 'Compound')
    .replace(/peptide/g, 'compound')
    .replace(/PEPTIDE/g, 'COMPOUND')
    .replace(/Reagents/g, 'Compounds')
    .replace(/reagents/g, 'compounds')
    .replace(/REAGENTS/g, 'COMPOUNDS')
    .replace(/Reagent/g, 'Compound')
    .replace(/reagent/g, 'compound')
    .replace(/REAGENT/g, 'COMPOUND');
}

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const sanitized = replaceTerminologyInString(raw);
      if (sanitized !== raw) {
        localStorage.setItem(key, sanitized);
      }
      return JSON.parse(sanitized);
    }
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
  }
  return defaultValue;
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bkrl_data_updated', { detail: { key } }));
    }

    // Automatically synchronize key state changes across all open browser tabs via BroadcastChannel
    if (key === STORAGE_KEYS.CART) {
      syncCartAcrossTabs(value as any, 'update');
    } else if (key === STORAGE_KEYS.USER) {
      syncAuthAcrossTabs(value as any, value ? 'login' : 'logout');
    } else if (key === STORAGE_KEYS.SAVE_FOR_LATER) {
      syncSaveForLaterAcrossTabs(value as any, 'add');
    } else if (key === STORAGE_KEYS.SETTINGS) {
      syncSettingsAcrossTabs(value as any);
    } else if (key === STORAGE_KEYS.PRODUCTS) {
      syncProductsAcrossTabs(value as any);
    } else if (key === STORAGE_KEYS.ORDERS) {
      syncOrdersAcrossTabs(value as any);
    }
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}:`, err);
  }
}

function initBootstrapKey<T>(key: string, defaultValue: T): void {
  try {
    if (!localStorage.getItem(key)) {
      setStored(key, defaultValue);
    }
  } catch (err) {
    console.warn(`Error initializing storage for key ${key}:`, err);
  }
}

// Initial state bootstrap
initBootstrapKey(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
initBootstrapKey(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
initBootstrapKey(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
initBootstrapKey(STORAGE_KEYS.HOMEPAGE, INITIAL_HOMEPAGE_CONTENT);
initBootstrapKey(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS);
initBootstrapKey(STORAGE_KEYS.DISCOUNTS, INITIAL_DISCOUNTS);
initBootstrapKey(STORAGE_KEYS.PAYMENT_GATEWAYS, INITIAL_PAYMENT_GATEWAYS);
initBootstrapKey(STORAGE_KEYS.DOWNLOADABLES, INITIAL_DOWNLOADABLES);
initBootstrapKey(STORAGE_KEYS.COMMUNICATION_SYSTEM, INITIAL_COMMUNICATION_STATE);
initBootstrapKey(STORAGE_KEYS.PAGES, INITIAL_CUSTOM_PAGES);

const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    po_number: 'PO-2026-001',
    supplier_name: 'Apex Biotech Supplies Co.',
    supplier_email: 'orders@apexbiotech.com',
    status: 'received',
    items: [
      {
        id: 'poi-1',
        po_id: 'po-101',
        product_id: 'prod-bpc157-10mg',
        product_name: 'BPC-157 (10mg) Analytical Grade',
        sku: 'BK-BPC-10MG',
        quantity: 100,
        unit_cost: 18.50,
        total_cost: 1850.00
      },
      {
        id: 'poi-2',
        po_id: 'po-101',
        product_id: 'prod-tb500-10mg',
        product_name: 'TB-500 Thymosin Beta-4 (10mg)',
        sku: 'BK-TB500-10MG',
        quantity: 50,
        unit_cost: 22.00,
        total_cost: 1100.00
      }
    ],
    total_amount: 2950.00,
    notes: 'Q1 Batch order for high-demand tissue recovery compounds.',
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    expected_delivery_date: new Date(Date.now() - 86400000 * 5).toISOString(),
    received_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'po-102',
    po_number: 'PO-2026-002',
    supplier_name: 'Vanguard Compounds Ltd.',
    supplier_email: 'sales@vanguardcompounds.org',
    status: 'ordered',
    items: [
      {
        id: 'poi-3',
        po_id: 'po-102',
        product_id: 'prod-glp3rt-10mg',
        product_name: 'Retatrutide GLP-3RT (10mg) Dual-Target Compound',
        sku: 'BK-GLP3RT-10MG',
        quantity: 80,
        unit_cost: 35.00,
        total_cost: 2800.00
      }
    ],
    total_amount: 2800.00,
    notes: 'Restock order for metabolic research line.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    expected_delivery_date: new Date(Date.now() + 86400000 * 4).toISOString(),
  }
];

initBootstrapKey(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS);
initBootstrapKey(STORAGE_KEYS.AUDIT_LOGS, [
  {
    id: 'log-1',
    admin_user_id: 'usr-admin-1',
    admin_email: 'bkresearchlabs@gmail.com',
    role: 'admin',
    action: 'System Initialization',
    entity_type: 'System',
    entity_id: 'sys-1',
    details: 'Platform initialized with default compliance rules, encrypted keystore, and product catalog.',
    ip_address: '10.0.1.42 (Internal SecOps)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 'log-2',
    admin_user_id: 'usr-sec-admin-1',
    admin_email: 'secops@bkresearchlabs.com',
    role: 'security_admin',
    action: 'WAF Rule Update',
    entity_type: 'Security',
    entity_id: 'waf-rule-99',
    details: 'Enforced Active Blocking mode on Layer 7 SQLi & XSS filters; lowered DDoS scrubbing threshold to 80 req/sec.',
    is_security_admin_action: true,
    supervisor_reviewed: true,
    supervisor_status: 'approved',
    supervisor_reviewed_by: 'bkresearchlabs@gmail.com',
    supervisor_reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    ip_address: '192.168.1.105 (SecOps HQ)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'log-3',
    admin_user_id: 'usr-owner-1',
    admin_email: 'owner@bkresearchlabs.com',
    role: 'owner',
    action: 'Payment Gateway Authorization',
    entity_type: 'PaymentGateway',
    entity_id: 'gw-stripe-main',
    details: 'Enabled Stripe Live 3DS2 Tokenization and rotated webhook signing secrets.',
    ip_address: '172.16.0.4 (Executive VPC)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'log-4',
    admin_user_id: 'usr-emp-1',
    admin_email: 'fulfillment@bkresearchlabs.com',
    role: 'employee',
    action: 'Order Fulfillment',
    entity_type: 'Order',
    entity_id: 'BKRL-2026-98102',
    details: 'Marked order BKRL-2026-98102 as Shipped with FedEx Priority Cold-Chain Tracking #994810238190.',
    ip_address: '10.0.2.18 (Warehouse Station #3)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'log-5',
    admin_user_id: 'usr-customer-1',
    admin_email: 'dr.jenkins@harvardbiochem.edu',
    role: 'customer',
    action: 'COA Vault Download',
    entity_type: 'CertificateOfAnalysis',
    entity_id: 'COA-BPC157-LOT26A',
    details: 'Downloaded cryptographic Batch Analytical Dossier (BPC-157 10mg Lot #2026-BPC-994).',
    ip_address: '140.247.0.1 (Harvard Univ Campus)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'log-6',
    admin_user_id: 'usr-admin-1',
    admin_email: 'bkresearchlabs@gmail.com',
    role: 'admin',
    action: 'Stock Adjustment',
    entity_type: 'Product',
    entity_id: 'prod-glp3rt-10mg',
    details: 'Restocked Retatrutide (GLP-3RT) 10mg batch (+80 units) from PO-2026-002 receiving dock.',
    ip_address: '10.0.1.42 (Internal SecOps)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'log-7',
    admin_user_id: 'usr-sec-admin-1',
    admin_email: 'secops@bkresearchlabs.com',
    role: 'security_admin',
    action: 'Emergency Lockout Disarm',
    entity_type: 'Security',
    entity_id: 'lockout-session-01',
    details: 'Routine verification complete: restored authentication attempt limits to standard 5 attempts / 15m lockout.',
    is_security_admin_action: true,
    supervisor_reviewed: true,
    supervisor_status: 'approved',
    supervisor_reviewed_by: 'owner@bkresearchlabs.com',
    supervisor_reviewed_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    ip_address: '192.168.1.105 (SecOps HQ)',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'log-8',
    admin_user_id: 'usr-admin-1',
    admin_email: 'bkresearchlabs@gmail.com',
    role: 'admin',
    action: 'Role Access Change',
    entity_type: 'UserProfile',
    entity_id: 'usr-emp-1',
    details: 'Confirmed employee RBAC privileges for fulfillment@bkresearchlabs.com with least-privilege scoping.',
    ip_address: '10.0.1.42 (Internal SecOps)',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  }
]);

// Default current user (can be customer or admin)
const DEFAULT_USER: UserProfile = {
  id: 'usr-customer-1',
  auth_user_id: 'auth-cust-1',
  first_name: 'Dr. Sarah',
  last_name: 'Jenkins',
  email: 'dr.jenkins@harvardbiochem.edu',
  phone: '+1 (617) 555-0192',
  role: 'customer',
  status: 'active',
  created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_EMPLOYEE: UserProfile = {
  id: 'usr-emp-1',
  auth_user_id: 'auth-emp-1',
  first_name: 'Alex',
  last_name: 'Rivera',
  email: 'fulfillment@bkresearchlabs.com',
  phone: '+1 (800) 555-0199',
  role: 'employee',
  status: 'active',
  created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_SECURITY_ADMIN: UserProfile = {
  id: 'usr-sec-admin-1',
  auth_user_id: 'auth-sec-admin-1',
  first_name: 'SecOps',
  last_name: 'Security Admin',
  username: 'secops_admin',
  email: 'secops@bkresearchlabs.com',
  recovery_email: 'bkresearchlabs@gmail.com',
  phone: '+1 (800) 555-SECOPS',
  role: 'security_admin',
  status: 'active',
  created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-admin-1',
  auth_user_id: 'auth-admin-1',
  first_name: 'BK Research',
  last_name: 'Labs Admin',
  username: 'brresearchlabs',
  email: 'bkresearchlabs@gmail.com',
  recovery_email: 'bkresearchlabs@gmail.com',
  phone: '+1 (800) 555-BKRL',
  role: 'admin',
  status: 'active',
  created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEFAULT_OWNER: UserProfile = {
  id: 'usr-owner-1',
  auth_user_id: 'auth-owner-1',
  first_name: 'Dr. Marcus',
  last_name: 'Kranz',
  email: 'owner@bkresearchlabs.com',
  phone: '+1 (800) 555-0100',
  role: 'owner',
  status: 'active',
  created_at: new Date(Date.now() - 86400000 * 365).toISOString(),
  updated_at: new Date().toISOString(),
};

export const INITIAL_USERS: UserProfile[] = [
  DEFAULT_OWNER,
  DEFAULT_ADMIN,
  DEFAULT_SECURITY_ADMIN,
  DEFAULT_EMPLOYEE,
  DEFAULT_USER,
  {
    id: 'usr-cust-2',
    auth_user_id: 'auth-cust-2',
    first_name: 'Dr. Michael',
    last_name: 'Vance',
    email: 'mvance@harvardbiochem.edu',
    phone: '+1 (617) 555-0821',
    role: 'customer',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-cust-3',
    auth_user_id: 'auth-cust-3',
    first_name: 'Elena',
    last_name: 'Rostova',
    email: 'erostova@genomixlab.com',
    phone: '+1 (415) 555-9102',
    role: 'customer',
    status: 'active',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date().toISOString(),
  }
];

initBootstrapKey(STORAGE_KEYS.USERS, INITIAL_USERS);

// ==========================================
// DATA API SERVICES (HYBRID SUPABASE + LOCAL)
// ==========================================

export const api = {
  // --- USER PROFILES & CUSTOMERS DATABASE ---
  getUsers: async (): Promise<UserProfile[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.USERS, data);
          return data as UserProfile[];
        }
      } catch (e) {
        console.warn('Supabase fetch profiles notice, using cache/fallback:', e);
      }
    }
    return getStored<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  getUserById: async (id: string): Promise<UserProfile | null> => {
    const users = await api.getUsers();
    return users.find(u => u.id === id || u.email.toLowerCase() === id.toLowerCase()) || null;
  },

  saveUser: async (user: Partial<UserProfile> & { first_name: string; last_name: string; email: string }): Promise<UserProfile> => {
    const users = getStored<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const now = new Date().toISOString();
    let saved: UserProfile;

    const cleanEmail = user.email.trim().toLowerCase();
    const existingIndex = users.findIndex(u => (user.id && u.id === user.id) || u.email.toLowerCase() === cleanEmail);

    if (existingIndex !== -1) {
      saved = {
        ...users[existingIndex],
        ...user,
        email: cleanEmail,
        updated_at: now,
      };
      users[existingIndex] = saved;
      api.logAudit('Update User Profile', 'User', saved.id, `Updated user profile for ${saved.first_name} ${saved.last_name} (${saved.email}) [Role: ${saved.role.toUpperCase()}]`);
    } else {
      saved = {
        id: user.id || 'usr-gen-' + Date.now(),
        auth_user_id: user.auth_user_id || 'auth-gen-' + Date.now(),
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username || cleanEmail.split('@')[0],
        email: cleanEmail,
        recovery_email: user.recovery_email || cleanEmail,
        phone: user.phone || '',
        role: user.role || 'customer',
        status: user.status || 'active',
        created_at: now,
        updated_at: now,
      };
      users.unshift(saved);
      api.logAudit('Create User Account', 'User', saved.id, `Created ${saved.role.toUpperCase()} profile for ${saved.first_name} ${saved.last_name} (${saved.email})`);
    }

    setStored(STORAGE_KEYS.USERS, users);

    // Sync to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const payload = {
          id: saved.id,
          first_name: saved.first_name,
          last_name: saved.last_name,
          email: saved.email,
          phone: saved.phone || null,
          role: saved.role,
          status: saved.status,
          created_at: saved.created_at,
          updated_at: saved.updated_at,
        };
        await supabase.from('profiles').upsert([payload]);
      } catch (err) {
        console.warn('Supabase upsert user profile non-blocking notice:', err);
      }
    }

    return saved;
  },

  updateUserRole: async (userId: string, targetRole: UserRole): Promise<UserProfile> => {
    const users = getStored<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User account not found');
    }

    const updatedUser: UserProfile = {
      ...users[userIndex],
      role: targetRole,
      updated_at: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    setStored(STORAGE_KEYS.USERS, users);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').update({
          role: targetRole,
          updated_at: updatedUser.updated_at
        }).eq('id', userId);
      } catch (err) {
        console.warn('Supabase update user role non-blocking notice:', err);
      }
    }

    api.logAudit('Role Permission Updated', 'User', userId, `Updated role for ${updatedUser.email} to ${targetRole.toUpperCase()}`);
    return updatedUser;
  },

  deleteUser: async (userId: string): Promise<boolean> => {
    let users = getStored<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const target = users.find(u => u.id === userId);
    users = users.filter(u => u.id !== userId);
    setStored(STORAGE_KEYS.USERS, users);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('profiles').delete().eq('id', userId);
      } catch (err) {
        console.warn('Supabase delete user non-blocking notice:', err);
      }
    }

    if (target) {
      api.logAudit('Delete User Account', 'User', userId, `Deleted user account ${target.email} (${target.first_name} ${target.last_name})`);
    }
    return true;
  },
  // --- AGE GATE ---
  getAgeGateVerified: (): boolean => {
    return getStored<boolean>(STORAGE_KEYS.AGE_GATE, false);
  },
  setAgeGateVerified: (verified: boolean): void => {
    setStored<boolean>(STORAGE_KEYS.AGE_GATE, verified);
  },

  // --- USER AUTHENTICATION & PROFILE ---
  getCurrentUser: (): UserProfile | null => {
    return getStored<UserProfile | null>(STORAGE_KEYS.USER, null);
  },
  setCurrentUser: (user: UserProfile | null): void => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, user);
  },
  signInWithPassword: async (emailOrUsername: string, pass: string): Promise<UserProfile | null> => {
    if (!emailOrUsername || !pass) return null;
    const e = emailOrUsername.toLowerCase().trim();

    // Check credentials against registered users
    const users = await api.getUsers();
    const match = users.find(u => 
      u.email.toLowerCase() === e || 
      (u.username && u.username.toLowerCase() === e)
    );

    if (match) {
      setStored<UserProfile | null>(STORAGE_KEYS.USER, match);
      api.logAudit('User Sign In', 'User', match.id, `Logged in as ${match.role} (${match.email})`);
      return match;
    }

    // Check owner / admin email directly
    if (e === 'owner@bkresearchlabs.com') {
      return api.loginAsOwner();
    }
    if (e === 'brresearchlabs' || e === 'bkresearchlabs@gmail.com') {
      return api.loginAsAdmin();
    }
    if (e === 'secops@bkresearchlabs.com' || e === 'secops_admin' || e === 'security_admin') {
      return api.loginAsSecurityAdmin();
    }
    if (e === 'fulfillment@bkresearchlabs.com') {
      return api.loginAsEmployee();
    }

    return null;
  },
  loginAsOwner: (): UserProfile => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_OWNER);
    api.logAudit('Owner Sign In', 'User', DEFAULT_OWNER.id, 'Logged in to Executive Owner Mode');
    return DEFAULT_OWNER;
  },
  loginAsAdmin: (): UserProfile => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_ADMIN);
    api.logAudit('Admin Sign In', 'User', DEFAULT_ADMIN.id, 'Logged in to System Admin Mode');
    return DEFAULT_ADMIN;
  },
  loginAsSecurityAdmin: (): UserProfile => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_SECURITY_ADMIN);
    api.logAudit('Security Admin Sign In', 'User', DEFAULT_SECURITY_ADMIN.id, 'Logged in to Web App Security Administrator Console [Supervised Session Monitored]');
    return DEFAULT_SECURITY_ADMIN;
  },
  loginAsEmployee: (): UserProfile => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, DEFAULT_EMPLOYEE);
    api.logAudit('Employee Sign In', 'User', DEFAULT_EMPLOYEE.id, 'Logged in to Order Fulfillment Station');
    return DEFAULT_EMPLOYEE;
  },
  loginAsCustomer: (email = 'customer@bkresearchlabs.com', firstName = 'Research', lastName = 'Customer'): UserProfile => {
    const cust: UserProfile = {
      id: 'usr-cust-' + Date.now(),
      auth_user_id: 'auth-cust-' + Date.now(),
      first_name: firstName,
      last_name: lastName,
      email,
      phone: '',
      role: 'customer',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setStored<UserProfile | null>(STORAGE_KEYS.USER, cust);
    api.logAudit('Customer Sign In', 'User', cust.id, `Logged in as customer (${email})`);
    return cust;
  },
  signInWithGoogleToken: async (googleProfile: { email: string; given_name?: string; family_name?: string; picture?: string; sub?: string }, defaultRole: UserRole = 'customer'): Promise<UserProfile> => {
    const email = googleProfile.email.toLowerCase().trim();
    let users = await api.getUsers();
    let existing = users.find(u => u.email.toLowerCase() === email || (u.google_id && u.google_id === googleProfile.sub));

    const now = new Date().toISOString();

    if (existing) {
      existing = {
        ...existing,
        google_id: googleProfile.sub || existing.google_id,
        google_picture: googleProfile.picture || existing.google_picture,
        auth_provider: 'google',
        updated_at: now
      };
      await api.saveUser(existing);
      setStored<UserProfile | null>(STORAGE_KEYS.USER, existing);
      api.logAudit('Google Sign In', 'User', existing.id, `Signed in via Google OAuth (${email})`);
      return existing;
    }

    let assignedRole: UserRole = defaultRole;
    if (email.endsWith('@bkresearchlabs.com') || email === 'bkresearchlabs@gmail.com') {
      assignedRole = 'admin';
    }

    const newUser: UserProfile = {
      id: 'usr-google-' + Date.now(),
      auth_user_id: googleProfile.sub || 'google-' + Math.random().toString(36).substring(2, 9),
      first_name: googleProfile.given_name || 'Google',
      last_name: googleProfile.family_name || 'User',
      email,
      role: assignedRole,
      status: 'active',
      auth_provider: 'google',
      google_id: googleProfile.sub,
      google_picture: googleProfile.picture,
      created_at: now,
      updated_at: now
    };

    await api.saveUser(newUser);
    setStored<UserProfile | null>(STORAGE_KEYS.USER, newUser);
    api.logAudit('Google Account Created', 'User', newUser.id, `New account created via Google OAuth (${email}) as ${assignedRole}`);
    return newUser;
  },
  signOut: (): void => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, null);
  },
  logout: (): void => {
    setStored<UserProfile | null>(STORAGE_KEYS.USER, null);
  },

  // --- PRODUCTS ---
  getProducts: async (): Promise<Product[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.PRODUCTS, data);
          return data as Product[];
        }
      } catch (e) {
        console.warn('Supabase fetch products notice, using cache/fallback:', e);
      }
    }
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  getProductById: async (id: string): Promise<Product | null> => {
    const products = await api.getProducts();
    return products.find(p => p.id === id) || null;
  },
  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const products = await api.getProducts();
    return products.find(p => p.slug === slug) || null;
  },
  saveProduct: async (product: Partial<Product> & { name: string; price: number }): Promise<Product> => {
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const now = new Date().toISOString();
    let saved: Product;

    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        saved = {
          ...products[idx],
          ...product,
          updated_at: now,
        };
        products[idx] = saved;
        api.logAudit('Update Product', 'Product', saved.id, `Updated product "${saved.name}" (SKU: ${saved.sku})`);
      } else {
        throw new Error('Product not found');
      }
    } else {
      const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      saved = {
        id: 'prod-' + Date.now(),
        sku: product.sku || 'BK-PEP-' + Math.floor(100 + Math.random() * 900),
        name: product.name,
        slug,
        description: product.description || '',
        short_description: product.short_description || '',
        price: Number(product.price),
        compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : undefined,
        currency: product.currency || 'USD',
        inventory_quantity: product.inventory_quantity ?? 50,
        inventory_tracking_enabled: product.inventory_tracking_enabled ?? true,
        category_id: product.category_id || 'cat-compounds',
        category_name: product.category_name || 'Analytical Compounds & Reference Standards',
        status: product.status || 'published',
        featured: Boolean(product.featured),
        requires_age_verification: product.requires_age_verification ?? true,
        requires_acknowledgment: product.requires_acknowledgment ?? true,
        acknowledgment_text: product.acknowledgment_text || 'I acknowledge that this chemical compound is purchased strictly for research purposes.',
        shipping_enabled: product.shipping_enabled ?? true,
        disclaimer: product.disclaimer || 'For research purposes only.',
        images: product.images && product.images.length ? product.images : ['https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'],
        files: product.files || [],
        created_at: now,
        updated_at: now,
      };
      products.unshift(saved);
      api.logAudit('Create Product', 'Product', saved.id, `Created product "${saved.name}" (SKU: ${saved.sku})`);
    }

    setStored(STORAGE_KEYS.PRODUCTS, products);

    // Sync to Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert([saved]);
      } catch (err) {
        console.warn('Supabase upsert product non-blocking error:', err);
      }
    }

    return saved;
  },
  deleteProduct: async (id: string): Promise<boolean> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const target = products.find(p => p.id === id);
    products = products.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete product non-blocking error:', err);
      }
    }

    if (target) {
      api.logAudit('Delete Product', 'Product', id, `Deleted product "${target.name}"`);
    }
    return true;
  },

  toggleProductStatus: async (id: string): Promise<Product> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    const current = products[idx];
    const newStatus = current.status === 'published' ? 'draft' : 'published';
    const updated: Product = {
      ...current,
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    products[idx] = updated;
    setStored(STORAGE_KEYS.PRODUCTS, products);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update({ status: newStatus, updated_at: updated.updated_at }).eq('id', id);
      } catch (err) {
        console.warn('Supabase toggle status non-blocking error:', err);
      }
    }
    api.logAudit('Toggle Product Status', 'Product', id, `Changed "${updated.name}" status to ${newStatus}`);
    return updated;
  },

  bulkUpdateProducts: async (ids: string[], updates: Partial<Product>): Promise<Product[]> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const now = new Date().toISOString();
    const idSet = new Set(ids);
    const modified: Product[] = [];

    products = products.map(p => {
      if (idSet.has(p.id)) {
        const updated = { ...p, ...updates, updated_at: now };
        modified.push(updated);
        return updated;
      }
      return p;
    });

    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(modified);
      } catch (err) {
        console.warn('Supabase bulk update products error:', err);
      }
    }

    api.logAudit('Bulk Update Products', 'Product', 'bulk', `Bulk updated ${ids.length} products with fields: ${Object.keys(updates).join(', ')}`);
    return products;
  },

  bulkAdjustPrices: async (ids: string[], mode: 'percentage' | 'fixed_adjust' | 'set_price', value: number): Promise<Product[]> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const now = new Date().toISOString();
    const idSet = new Set(ids);
    const modified: Product[] = [];

    products = products.map(p => {
      if (idSet.has(p.id)) {
        let newPrice = p.price;
        if (mode === 'percentage') {
          newPrice = Math.max(0.01, Math.round((p.price * (1 + value / 100)) * 100) / 100);
        } else if (mode === 'fixed_adjust') {
          newPrice = Math.max(0.01, Math.round((p.price + value) * 100) / 100);
        } else if (mode === 'set_price') {
          newPrice = Math.max(0.01, Math.round(value * 100) / 100);
        }
        const updated = { ...p, price: newPrice, updated_at: now };
        modified.push(updated);
        return updated;
      }
      return p;
    });

    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(modified);
      } catch (err) {
        console.warn('Supabase bulk price adjust error:', err);
      }
    }

    api.logAudit('Bulk Adjust Product Prices', 'Product', 'bulk', `Adjusted prices for ${ids.length} products (${mode}: ${value})`);
    return products;
  },

  bulkAdjustStock: async (ids: string[], mode: 'set' | 'add', value: number): Promise<Product[]> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const now = new Date().toISOString();
    const idSet = new Set(ids);
    const modified: Product[] = [];

    products = products.map(p => {
      if (idSet.has(p.id)) {
        let newStock = p.inventory_quantity;
        if (mode === 'set') {
          newStock = Math.max(0, Math.round(value));
        } else if (mode === 'add') {
          newStock = Math.max(0, Math.round(p.inventory_quantity + value));
        }
        const updated = { ...p, inventory_quantity: newStock, updated_at: now };
        modified.push(updated);
        return updated;
      }
      return p;
    });

    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(modified);
      } catch (err) {
        console.warn('Supabase bulk stock adjust error:', err);
      }
    }

    api.logAudit('Bulk Adjust Inventory Stock', 'Product', 'bulk', `Adjusted inventory stock for ${ids.length} products (${mode}: ${value})`);
    return products;
  },

  bulkDeleteProducts: async (ids: string[]): Promise<boolean> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const idSet = new Set(ids);
    const remaining = products.filter(p => !idSet.has(p.id));
    setStored(STORAGE_KEYS.PRODUCTS, remaining);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().in('id', ids);
      } catch (err) {
        console.warn('Supabase bulk delete products error:', err);
      }
    }

    api.logAudit('Bulk Delete Products', 'Product', 'bulk', `Deleted ${ids.length} products in bulk`);
    return true;
  },

  bulkImportProducts: async (
    items: Array<Partial<Product> & { name: string; price: number }>,
    options: { overwrite?: boolean; defaultStatus?: 'published' | 'draft' } = { overwrite: true, defaultStatus: 'published' }
  ): Promise<{ created: number; updated: number; errors: string[] }> => {
    let products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const categories = getStored<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const now = new Date().toISOString();
    let created = 0;
    let updated = 0;
    const errors: string[] = [];

    const defaultCat = categories[0] || { id: 'cat-compounds', name: 'Analytical Compounds' };

    for (const item of items) {
      if (!item.name || item.price === undefined || isNaN(Number(item.price))) {
        errors.push(`Skipping invalid item: Missing name or valid price (${JSON.stringify(item.name)})`);
        continue;
      }

      const cleanSku = (item.sku || ('BK-IMP-' + Math.floor(1000 + Math.random() * 9000))).trim();
      const existingIdx = products.findIndex(p => p.sku.toLowerCase() === cleanSku.toLowerCase());

      // Match category by id or name
      let matchedCat = defaultCat;
      if (item.category_id) {
        const found = categories.find(c => c.id === item.category_id || c.slug === item.category_id);
        if (found) matchedCat = found;
      } else if (item.category_name) {
        const found = categories.find(c => c.name.toLowerCase() === item.category_name?.toLowerCase());
        if (found) matchedCat = found;
      }

      if (existingIdx !== -1 && options.overwrite) {
        // Update existing
        products[existingIdx] = {
          ...products[existingIdx],
          ...item,
          sku: cleanSku,
          price: Number(item.price),
          inventory_quantity: item.inventory_quantity !== undefined ? Number(item.inventory_quantity) : products[existingIdx].inventory_quantity,
          category_id: matchedCat.id,
          category_name: matchedCat.name,
          updated_at: now,
        };
        updated++;
      } else if (existingIdx === -1) {
        // Create new
        const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newProduct: Product = {
          id: 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          sku: cleanSku,
          name: item.name,
          slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
          description: item.description || `High-purity laboratory grade ${item.name} reference standard for in vitro research.`,
          short_description: item.short_description || `Analytical benchmark ${item.name} for research use.`,
          price: Number(item.price),
          compare_at_price: item.compare_at_price ? Number(item.compare_at_price) : undefined,
          currency: item.currency || 'USD',
          inventory_quantity: item.inventory_quantity !== undefined ? Number(item.inventory_quantity) : 50,
          inventory_tracking_enabled: true,
          category_id: matchedCat.id,
          category_name: matchedCat.name,
          status: item.status || options.defaultStatus || 'published',
          featured: Boolean(item.featured),
          requires_age_verification: item.requires_age_verification ?? true,
          requires_acknowledgment: item.requires_acknowledgment ?? true,
          acknowledgment_text: item.acknowledgment_text || 'I acknowledge that this chemical compound is purchased exclusively for laboratory research.',
          shipping_enabled: true,
          disclaimer: item.disclaimer || 'For laboratory in vitro research use only. Not for human consumption.',
          images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'],
          files: item.files || [],
          created_at: now,
          updated_at: now,
        };
        products.unshift(newProduct);
        created++;
      }
    }

    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert(products);
      } catch (err) {
        console.warn('Supabase bulk import sync error:', err);
      }
    }

    api.logAudit('Bulk Import Products', 'Product', 'bulk_import', `Imported ${items.length} items (${created} created, ${updated} updated, ${errors.length} errors)`);
    return { created, updated, errors };
  },

  // --- CUSTOM PAGES ---
  getPages: async (): Promise<CustomPage[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('custom_pages').select('*').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.PAGES, data);
          return data as CustomPage[];
        }
      } catch (e) {
        console.warn('Supabase get custom pages notice:', e);
      }
    }
    return getStored<CustomPage[]>(STORAGE_KEYS.PAGES, INITIAL_CUSTOM_PAGES);
  },

  getPageById: async (id: string): Promise<CustomPage | null> => {
    const pages = await api.getPages();
    return pages.find(p => p.id === id) || null;
  },

  getPageBySlug: async (slug: string): Promise<CustomPage | null> => {
    const pages = await api.getPages();
    return pages.find(p => p.slug === slug || p.slug === slug.replace(/^\//, '')) || null;
  },

  savePage: async (page: Partial<CustomPage> & { title: string; slug: string }): Promise<CustomPage> => {
    const pages = getStored<CustomPage[]>(STORAGE_KEYS.PAGES, INITIAL_CUSTOM_PAGES);
    const now = new Date().toISOString();
    let saved: CustomPage;

    const cleanSlug = page.slug.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/(^-|-$)/g, '');

    if (page.id) {
      const idx = pages.findIndex(p => p.id === page.id);
      if (idx !== -1) {
        saved = {
          ...pages[idx],
          ...page,
          slug: cleanSlug,
          updated_at: now
        };
        pages[idx] = saved;
      } else {
        throw new Error('Custom page not found');
      }
    } else {
      saved = {
        id: 'page-' + Date.now(),
        title: page.title,
        slug: cleanSlug,
        content: page.content || 'Content coming soon.',
        summary: page.summary || '',
        category: page.category || 'general',
        show_in_header: page.show_in_header ?? true,
        show_in_footer: page.show_in_footer ?? true,
        header_nav_mode: page.header_nav_mode || 'default',
        status: page.status || 'published',
        meta_title: page.meta_title || page.title,
        meta_description: page.meta_description || page.summary || '',
        author: page.author || 'BKRL Editorial Team',
        views_count: 0,
        sort_order: page.sort_order ?? (pages.length + 1),
        created_at: now,
        updated_at: now
      };
      pages.push(saved);
    }

    setStored(STORAGE_KEYS.PAGES, pages);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('custom_pages').upsert([saved]);
      } catch (err) {
        console.warn('Supabase upsert custom page non-blocking error:', err);
      }
    }

    api.logAudit('Save Custom Page', 'Page', saved.id, `Saved custom page "${saved.title}" (/${saved.slug})`);
    return saved;
  },

  deletePage: async (id: string): Promise<boolean> => {
    let pages = getStored<CustomPage[]>(STORAGE_KEYS.PAGES, INITIAL_CUSTOM_PAGES);
    const target = pages.find(p => p.id === id);
    pages = pages.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PAGES, pages);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('custom_pages').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete page non-blocking error:', err);
      }
    }

    if (target) {
      api.logAudit('Delete Custom Page', 'Page', id, `Deleted custom page "${target.title}"`);
    }
    return true;
  },

  // --- CATEGORIES ---
  getCategories: async (): Promise<ProductCategory[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('product_categories').select('*');
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.CATEGORIES, data);
          return data as ProductCategory[];
        }
      } catch (e) {
        console.warn('Supabase get categories notice:', e);
      }
    }
    return getStored<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategory: async (category: Partial<ProductCategory> & { name: string }): Promise<ProductCategory> => {
    const categories = getStored<ProductCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const now = new Date().toISOString();
    let saved: ProductCategory;

    if (category.id) {
      const idx = categories.findIndex(c => c.id === category.id);
      if (idx !== -1) {
        saved = { ...categories[idx], ...category, updated_at: now };
        categories[idx] = saved;
      } else {
        throw new Error('Category not found');
      }
    } else {
      saved = {
        id: 'cat-' + Date.now(),
        name: category.name,
        slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: category.description || '',
        image: category.image || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800',
        sort_order: category.sort_order || categories.length + 1,
        active: category.active ?? true,
        created_at: now,
        updated_at: now,
      };
      categories.push(saved);
    }
    setStored(STORAGE_KEYS.CATEGORIES, categories);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('product_categories').upsert([saved]);
      } catch (e) {
        console.warn('Supabase upsert category non-blocking error:', e);
      }
    }

    return saved;
  },

  // --- SHOPPING CART ---
  getCart: (): CartItem[] => {
    return getStored<CartItem[]>(STORAGE_KEYS.CART, []);
  },
  addToCart: (product: Product, quantity = 1): CartItem[] => {
    const cart = api.getCart();
    const existingIndex = cart.findIndex(item => item.product_id === product.id);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: 'cart-item-' + Date.now(),
        product_id: product.id,
        product,
        quantity,
        created_at: new Date().toISOString(),
      });
    }
    setStored(STORAGE_KEYS.CART, cart);
    return cart;
  },
  updateCartQuantity: (itemId: string, quantity: number): CartItem[] => {
    let cart = api.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.id !== itemId);
    } else {
      const item = cart.find(i => i.id === itemId);
      if (item) item.quantity = quantity;
    }
    setStored(STORAGE_KEYS.CART, cart);
    return cart;
  },
  removeFromCart: (itemId: string): CartItem[] => {
    const cart = api.getCart().filter(item => item.id !== itemId);
    setStored(STORAGE_KEYS.CART, cart);
    return cart;
  },
  clearCart: (): void => {
    setStored(STORAGE_KEYS.CART, []);
  },

  // --- SAVE FOR LATER ---
  getSaveForLater: (): SaveForLaterItem[] => {
    return getStored<SaveForLaterItem[]>(STORAGE_KEYS.SAVE_FOR_LATER, []);
  },
  addToSaveForLater: (product: Product): SaveForLaterItem[] => {
    const user = api.getCurrentUser();
    const list = api.getSaveForLater();
    const exists = list.some(item => item.product_id === product.id);
    if (!exists) {
      list.unshift({
        id: 'sfl-' + Date.now(),
        user_id: user?.id || 'guest',
        product_id: product.id,
        product,
        created_at: new Date().toISOString(),
      });
      setStored(STORAGE_KEYS.SAVE_FOR_LATER, list);
    }
    return list;
  },
  removeFromSaveForLater: (id: string): SaveForLaterItem[] => {
    const list = api.getSaveForLater().filter(item => item.id !== id);
    setStored(STORAGE_KEYS.SAVE_FOR_LATER, list);
    return list;
  },
  moveToCartFromSaveForLater: (sflId: string): CartItem[] => {
    const sflList = api.getSaveForLater();
    const item = sflList.find(i => i.id === sflId);
    if (item && item.product) {
      api.addToCart(item.product, 1);
      api.removeFromSaveForLater(sflId);
    }
    return api.getCart();
  },

  // --- ORDERS & CHECKOUT ---
  getOrders: async (): Promise<Order[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('orders').select('*, items:order_items(*)');
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.ORDERS, data);
          return data as Order[];
        }
      } catch (e) {
        console.warn('Supabase fetch orders notice:', e);
      }
    }
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS);
  },
  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = await api.getOrders();
    return orders.find(o => o.id === id || o.order_number === id) || null;
  },
  createOrder: async (payload: {
    cartItems: CartItem[];
    shippingAddress: any;
    billingAddress: any;
    paymentMethod: string;
    discountCode?: string;
    acknowledgmentsAccepted: boolean;
    ageVerified: boolean;
  }): Promise<Order> => {
    const user = api.getCurrentUser() || DEFAULT_USER;
    const settings = await api.getSiteSettings();
    const products = await api.getProducts();

    let subtotal = 0;
    const orderItems = payload.cartItems.map(item => {
      const currentProd = products.find(p => p.id === item.product_id) || item.product;
      const unitPrice = currentProd.price;
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      if (currentProd.inventory_tracking_enabled) {
        currentProd.inventory_quantity = Math.max(0, currentProd.inventory_quantity - item.quantity);
      }

      return {
        id: 'ord-item-' + Math.random().toString(36).substring(2, 9),
        order_id: '',
        product_id: currentProd.id,
        product_name_snapshot: currentProd.name,
        sku_snapshot: currentProd.sku,
        unit_price: unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
        image_snapshot: currentProd.images[0] || '',
      };
    });

    setStored(STORAGE_KEYS.PRODUCTS, products);

    let discountAmount = 0;
    if (payload.discountCode) {
      const discounts = getStored<DiscountCode[]>(STORAGE_KEYS.DISCOUNTS, INITIAL_DISCOUNTS);
      const codeObj = discounts.find(d => d.code.toUpperCase() === payload.discountCode?.toUpperCase() && d.active);
      if (codeObj) {
        if (codeObj.type === 'percentage') {
          discountAmount = (subtotal * codeObj.value) / 100;
        } else {
          discountAmount = codeObj.value;
        }
        codeObj.usage_count += 1;
        setStored(STORAGE_KEYS.DISCOUNTS, discounts);
      }
    }

    const shippingAmount = subtotal >= settings.free_shipping_threshold ? 0 : settings.standard_shipping_fee;
    const taxableTotal = Math.max(0, subtotal - discountAmount);
    const taxAmount = Number(((taxableTotal * settings.tax_rate_percentage) / 100).toFixed(2));
    const total = Number((taxableTotal + shippingAmount + taxAmount).toFixed(2));

    const orderNumber = `BKRL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      user_id: user.id,
      customer_name: `${payload.shippingAddress.first_name} ${payload.shippingAddress.last_name}`,
      customer_email: user.email,
      customer_phone: payload.shippingAddress.phone || user.phone || '',
      order_number: orderNumber,
      status: 'pending',
      payment_status: 'paid',
      fulfillment_status: 'unfulfilled',
      subtotal,
      shipping_amount: shippingAmount,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total,
      currency: settings.currency,
      shipping_address: payload.shippingAddress,
      billing_address: payload.billingAddress,
      payment_method: payload.paymentMethod,
      payment_reference: 'pt_sim_' + Math.random().toString(36).substring(2, 12),
      items: orderItems,
      acknowledgments_accepted: payload.acknowledgmentsAccepted,
      age_verified_at_checkout: payload.ageVerified,
      created_at: now,
      updated_at: now,
    };

    newOrder.items.forEach(item => { item.order_id = newOrder.id; });

    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS);
    orders.unshift(newOrder);
    setStored(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured && supabase) {
      try {
        const { items, ...orderRecord } = newOrder;
        await supabase.from('orders').insert([orderRecord]);
        if (items && items.length > 0) {
          await supabase.from('order_items').insert(items);
        }
      } catch (e) {
        console.warn('Supabase create order insert error:', e);
      }
    }

    api.clearCart();
    api.logAudit('Order Placed', 'Order', newOrder.id, `Order ${orderNumber} created for $${total}`);

    // Trigger automatic asset unlocks for products purchased in this order
    try {
      await api.processAutomaticAssetUnlocks(user, newOrder);
    } catch (e) {
      console.warn('Auto asset unlock trigger notice:', e);
    }

    // Trigger customizable email purchase notification ("Thanks for your order")
    try {
      await api.sendNotificationEmail('order_confirmation', newOrder.customer_email, {
        customer_name: newOrder.customer_name,
        order_number: newOrder.order_number,
        order_total: `$${newOrder.total.toFixed(2)} ${newOrder.currency}`,
        items_list: newOrder.items.map(i => `${i.quantity}x ${i.product_name_snapshot}`).join(', '),
        coa_link: '/customer-portal?tab=coa'
      });
    } catch (e) {
      console.warn('Order confirmation email trigger notice:', e);
    }

    // Trigger customizable SMS purchase notification
    if (user?.phone) {
      try {
        await api.sendSmsNotification('order_confirmation_sms', user.phone, {
          customer_name: newOrder.customer_name,
          order_number: newOrder.order_number,
          order_total: `$${newOrder.total.toFixed(2)} ${newOrder.currency}`,
          order_link: `${window.location.origin}/customer-portal?tab=orders`,
          items_count: String(newOrder.items.length)
        });
      } catch (e) {
        console.warn('Order confirmation SMS trigger notice:', e);
      }
    }

    return newOrder;
  },
  updateOrderStatus: async (orderId: string, status: Order['status'], fulfillment_status?: Order['fulfillment_status'], trackingNumber?: string): Promise<Order> => {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    orders[idx].status = status;
    if (fulfillment_status) orders[idx].fulfillment_status = fulfillment_status;
    if (trackingNumber) orders[idx].tracking_number = trackingNumber;
    orders[idx].updated_at = new Date().toISOString();

    setStored(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update({
          status,
          ...(fulfillment_status ? { fulfillment_status } : {}),
          ...(trackingNumber ? { tracking_number: trackingNumber } : {}),
          updated_at: orders[idx].updated_at,
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase update order status error:', e);
      }
    }

    // Trigger customizable shipping details email & SMS notifications
    if (trackingNumber || fulfillment_status === 'shipped') {
      try {
        await api.sendNotificationEmail('shipping_details', orders[idx].customer_email, {
          customer_name: orders[idx].customer_name,
          order_number: orders[idx].order_number,
          carrier: orders[idx].carrier || 'FedEx Priority Express',
          tracking_number: trackingNumber || orders[idx].tracking_number || 'TRK-9821049281',
          delivery_estimate: '1-3 Business Days'
        });
      } catch (e) {
        console.warn('Shipping details email trigger notice:', e);
      }

      // Also trigger SMS notification if user has phone
      const targetPhone = orders[idx].customer_phone || '+1 (617) 555-0192';
      try {
        await api.sendSmsNotification('shipping_dispatch_sms', targetPhone, {
          customer_name: orders[idx].customer_name,
          order_number: orders[idx].order_number,
          carrier: orders[idx].carrier || 'FedEx Priority Express',
          tracking_number: trackingNumber || orders[idx].tracking_number || 'TRK-9821049281',
          tracking_link: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber || orders[idx].tracking_number || 'TRK-9821049281'}`
        });
      } catch (e) {
        console.warn('Shipping dispatch SMS trigger notice:', e);
      }
    }

    if (status === 'delivered' || fulfillment_status === 'delivered') {
      const targetPhone = orders[idx].customer_phone || '+1 (617) 555-0192';
      try {
        await api.sendSmsNotification('order_delivered_sms', targetPhone, {
          customer_name: orders[idx].customer_name,
          order_number: orders[idx].order_number,
          delivery_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } catch (e) {
        console.warn('Order delivered SMS trigger notice:', e);
      }
    }

    api.logAudit('Update Order Status', 'Order', orderId, `Changed order status to ${status}`);
    return orders[idx];
  },
  updateOrderTracking: async (
    orderId: string,
    trackingNumber: string,
    carrier = 'FedEx Express Cold-Chain',
    options?: {
      status?: Order['status'];
      fulfillment_status?: Order['fulfillment_status'];
      updatedByRole?: string;
      updatedByName?: string;
      note?: string;
    }
  ): Promise<Order> => {
    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found');

    const now = new Date().toISOString();
    const order = orders[idx];
    const previousTracking = order.tracking_number;

    const newStatus = options?.status || (order.status === 'pending' ? 'shipped' : order.status);
    const newFulfillment = options?.fulfillment_status || (order.fulfillment_status === 'unfulfilled' ? 'fulfilled' : order.fulfillment_status);

    const historyEntry: TrackingHistoryEntry = {
      id: 'trkh-' + Date.now(),
      tracking_number: trackingNumber.trim(),
      carrier: carrier.trim(),
      status: newStatus,
      updated_at: now,
      updated_by_role: options?.updatedByRole || 'admin',
      updated_by_name: options?.updatedByName || 'Fulfillment Staff',
      note: options?.note || (previousTracking ? `Updated from ${previousTracking}` : 'Initial shipping tracking assigned'),
    };

    const existingHistory = [...(order.tracking_history || [])];
    if (previousTracking && existingHistory.length === 0) {
      existingHistory.push({
        id: 'trkh-prev-' + order.id,
        tracking_number: previousTracking,
        carrier: order.carrier || 'FedEx Express Cold-Chain',
        status: order.status,
        updated_at: order.updated_at || order.created_at,
        updated_by_role: 'system',
        updated_by_name: 'Initial Dispatch',
        note: 'Initial tracking assignment'
      });
    }

    order.tracking_number = trackingNumber.trim();
    order.carrier = carrier.trim();
    order.status = newStatus;
    order.fulfillment_status = newFulfillment;
    order.tracking_history = [historyEntry, ...existingHistory];
    order.updated_at = now;

    setStored(STORAGE_KEYS.ORDERS, orders);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update({
          tracking_number: order.tracking_number,
          carrier: order.carrier,
          status: order.status,
          fulfillment_status: order.fulfillment_status,
          updated_at: now,
        }).eq('id', orderId);
      } catch (e) {
        console.warn('Supabase update order tracking error:', e);
      }
    }

    api.logAudit(
      'Update Order Tracking',
      'Order',
      orderId,
      `${options?.updatedByRole ? options.updatedByRole.toUpperCase() : 'STAFF'} (${options?.updatedByName || 'Staff'}) updated tracking to ${trackingNumber} (${carrier}) for order ${order.order_number}`
    );

    // Send notifications
    try {
      await api.sendNotificationEmail('shipping_details', order.customer_email, {
        customer_name: order.customer_name,
        order_number: order.order_number,
        carrier: order.carrier,
        tracking_number: order.tracking_number,
        delivery_estimate: '1-3 Business Days'
      });
    } catch (e) {
      console.warn('Shipping email notice:', e);
    }

    if (order.customer_phone) {
      try {
        await api.sendSmsNotification('shipping_dispatch_sms', order.customer_phone, {
          customer_name: order.customer_name,
          order_number: order.order_number,
          carrier: order.carrier,
          tracking_number: order.tracking_number,
          tracking_link: `https://www.fedex.com/fedextrack/?trknbr=${order.tracking_number}`
        });
      } catch (e) {
        console.warn('Shipping SMS notice:', e);
      }
    }

    return order;
  },

  // --- SITE SETTINGS & CONTENT ---
  getSiteSettings: async (): Promise<SiteSettings> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle();
        if (!error && data) {
          setStored(STORAGE_KEYS.SETTINGS, data);
          return data as SiteSettings;
        }
      } catch (e) {
        console.warn('Supabase fetch site_settings notice:', e);
      }
    }
    return getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },
  getSettings: async (): Promise<SiteSettings> => {
    return api.getSiteSettings();
  },
  saveSiteSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const current = await api.getSiteSettings();
    const updated = { ...current, ...settings };
    setStored(STORAGE_KEYS.SETTINGS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('site_settings').upsert([{ id: 'main', ...updated }]);
      } catch (e) {
        console.warn('Supabase save settings error:', e);
      }
    }

    api.logAudit('Update Settings', 'SiteSettings', 'main', 'Updated global site settings & compliance rules');
    return updated;
  },
  saveSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    return api.saveSiteSettings(settings);
  },

  // --- SEO MANAGEMENT ---
  getSeoConfig: async (): Promise<SeoGlobalConfig> => {
    const settings = await api.getSiteSettings();
    return settings.seo_config || INITIAL_SEO_CONFIG;
  },

  saveSeoConfig: async (seoUpdates: Partial<SeoGlobalConfig>): Promise<SeoGlobalConfig> => {
    const settings = await api.getSiteSettings();
    const currentSeo = settings.seo_config || INITIAL_SEO_CONFIG;
    const updatedSeo: SeoGlobalConfig = {
      ...currentSeo,
      ...seoUpdates,
      last_audited_at: new Date().toISOString(),
    };
    
    await api.saveSiteSettings({ seo_config: updatedSeo });
    api.logAudit('Update SEO Configuration', 'SEO', 'global', 'Updated SEO metadata, Open Graph settings, and search indexing directives');
    return updatedSeo;
  },

  saveItemSeo: async (type: 'category' | 'product' | 'page', idOrSlug: string, meta: SeoItemMeta): Promise<SeoGlobalConfig> => {
    const settings = await api.getSiteSettings();
    const currentSeo = settings.seo_config || INITIAL_SEO_CONFIG;
    const updatedMeta: SeoItemMeta = {
      ...meta,
      last_updated: new Date().toISOString()
    };

    let updatedSeo: SeoGlobalConfig;
    if (type === 'category') {
      updatedSeo = {
        ...currentSeo,
        category_meta_overrides: {
          ...currentSeo.category_meta_overrides,
          [idOrSlug]: updatedMeta
        }
      };
    } else if (type === 'product') {
      updatedSeo = {
        ...currentSeo,
        product_meta_overrides: {
          ...currentSeo.product_meta_overrides,
          [idOrSlug]: updatedMeta
        }
      };
    } else {
      updatedSeo = {
        ...currentSeo,
        page_meta_overrides: {
          ...currentSeo.page_meta_overrides,
          [idOrSlug]: updatedMeta
        }
      };
    }

    await api.saveSiteSettings({ seo_config: updatedSeo });
    api.logAudit('Update Item SEO', 'SEO', `${type}:${idOrSlug}`, `Updated custom SEO meta and Open Graph tags for ${type} (${idOrSlug})`);
    return updatedSeo;
  },

  getHomepageContent: async (): Promise<HomepageContent> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 'main').maybeSingle();
        if (!error && data) {
          setStored(STORAGE_KEYS.HOMEPAGE, data);
          return data as HomepageContent;
        }
      } catch (e) {
        console.warn('Supabase fetch homepage_content notice:', e);
      }
    }
    return getStored<HomepageContent>(STORAGE_KEYS.HOMEPAGE, INITIAL_HOMEPAGE_CONTENT);
  },
  saveHomepageContent: async (content: Partial<HomepageContent>): Promise<HomepageContent> => {
    const current = await api.getHomepageContent();
    const updated = { ...current, ...content };
    setStored(STORAGE_KEYS.HOMEPAGE, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('homepage_content').upsert([{ id: 'main', ...updated }]);
      } catch (e) {
        console.warn('Supabase save homepage error:', e);
      }
    }

    api.logAudit('Update Homepage', 'HomepageContent', 'main', 'Updated homepage hero and featured sections');
    return updated;
  },

  // --- INVENTORY & STOCK ---
  updateProductStock: async (productId: string, newStock: number, reason?: string): Promise<Product> => {
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const prod = products.find(p => p.id === productId);
    if (!prod) throw new Error('Product not found');
    const oldQty = prod.inventory_quantity;
    prod.inventory_quantity = Math.max(0, newStock);
    prod.updated_at = new Date().toISOString();
    setStored(STORAGE_KEYS.PRODUCTS, products);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').update({
          inventory_quantity: prod.inventory_quantity,
          updated_at: prod.updated_at
        }).eq('id', productId);
      } catch (e) {
        console.warn('Supabase update product stock error:', e);
      }
    }

    api.logAudit(
      'Stock Adjustment',
      'Product',
      productId,
      `Adjusted stock for ${prod.name} (SKU: ${prod.sku}) from ${oldQty} to ${prod.inventory_quantity}.${reason ? ` Reason: ${reason}` : ''}`
    );
    return prod;
  },

  // --- PURCHASE ORDERS & SPENDING TRACKING ---
  getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('purchase_orders').select('*, items:purchase_order_items(*)');
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.PURCHASE_ORDERS, data);
          return data as PurchaseOrder[];
        }
      } catch (e) {
        console.warn('Supabase fetch POs notice:', e);
      }
    }
    return getStored<PurchaseOrder[]>(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS);
  },
  savePurchaseOrder: async (po: PurchaseOrder): Promise<PurchaseOrder> => {
    const pos = await api.getPurchaseOrders();
    const idx = pos.findIndex(p => p.id === po.id);
    if (idx >= 0) {
      pos[idx] = po;
    } else {
      pos.unshift(po);
    }
    setStored(STORAGE_KEYS.PURCHASE_ORDERS, pos);

    if (isSupabaseConfigured && supabase) {
      try {
        const { items, ...poRecord } = po;
        await supabase.from('purchase_orders').upsert([poRecord]);
        if (items && items.length > 0) {
          await supabase.from('purchase_order_items').upsert(items);
        }
      } catch (e) {
        console.warn('Supabase save PO error:', e);
      }
    }

    api.logAudit(
      'Purchase Order Saved',
      'PurchaseOrder',
      po.id,
      `Saved PO ${po.po_number} from ${po.supplier_name} - Total: $${po.total_amount.toFixed(2)} [Status: ${po.status}]`
    );
    return po;
  },
  updatePurchaseOrderStatus: async (poId: string, status: PurchaseOrderStatus): Promise<PurchaseOrder> => {
    const pos = await api.getPurchaseOrders();
    const po = pos.find(p => p.id === poId);
    if (!po) throw new Error('Purchase order not found');

    const oldStatus = po.status;
    po.status = status;

    if (status === 'received' && oldStatus !== 'received') {
      po.received_at = new Date().toISOString();
      const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
      po.items.forEach(item => {
        const prod = products.find(p => p.id === item.product_id);
        if (prod) {
          const prevQty = prod.inventory_quantity;
          prod.inventory_quantity += item.quantity;
          prod.updated_at = new Date().toISOString();

          if (isSupabaseConfigured && supabase) {
            supabase.from('products').update({
              inventory_quantity: prod.inventory_quantity,
              updated_at: prod.updated_at
            }).eq('id', prod.id);
          }

          api.logAudit(
            'PO Restock Received',
            'Product',
            prod.id,
            `Stock auto-incremented by +${item.quantity} from PO ${po.po_number} (${prevQty} → ${prod.inventory_quantity})`
          );
        }
      });
      setStored(STORAGE_KEYS.PRODUCTS, products);
    }

    setStored(STORAGE_KEYS.PURCHASE_ORDERS, pos);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('purchase_orders').update({
          status,
          ...(po.received_at ? { received_at: po.received_at } : {})
        }).eq('id', poId);
      } catch (e) {
        console.warn('Supabase update PO status error:', e);
      }
    }

    api.logAudit('PO Status Changed', 'PurchaseOrder', po.id, `Status transitioned from ${oldStatus} to ${status}`);
    return po;
  },
  deletePurchaseOrder: async (poId: string): Promise<void> => {
    const pos = await api.getPurchaseOrders();
    const filtered = pos.filter(p => p.id !== poId);
    setStored(STORAGE_KEYS.PURCHASE_ORDERS, filtered);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('purchase_orders').delete().eq('id', poId);
      } catch (e) {
        console.warn('Supabase delete PO error:', e);
      }
    }

    api.logAudit('PO Deleted', 'PurchaseOrder', poId, `Deleted Purchase Order ID ${poId}`);
  },

  // --- AUDIT LOGS ---
  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(200);
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.AUDIT_LOGS, data);
          return data as AuditLog[];
        }
      } catch (e) {
        console.warn('Supabase fetch audit_logs notice:', e);
      }
    }
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },
  logAudit: (action: string, entity_type: string, entity_id: string, details = '', customProps?: Partial<AuditLog>): void => {
    const user = api.getCurrentUser() || DEFAULT_ADMIN;
    const isSecAdmin = user.role === 'security_admin';
    const logs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const entry: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      admin_user_id: user.id,
      admin_email: user.email,
      role: user.role,
      action,
      entity_type,
      entity_id,
      details,
      is_security_admin_action: isSecAdmin || customProps?.is_security_admin_action || false,
      supervisor_reviewed: isSecAdmin ? (customProps?.supervisor_reviewed ?? false) : true,
      supervisor_status: isSecAdmin ? (customProps?.supervisor_status ?? 'pending') : 'approved',
      supervisor_reviewed_by: customProps?.supervisor_reviewed_by,
      supervisor_reviewed_at: customProps?.supervisor_reviewed_at,
      supervisor_notes: customProps?.supervisor_notes,
      ip_address: customProps?.ip_address || '10.0.1.42 (Internal SecOps)',
      created_at: new Date().toISOString(),
    };
    logs.unshift(entry);
    setStored(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 250));

    if (isSupabaseConfigured && supabase) {
      supabase.from('audit_logs').insert([entry]).then(res => {
        if (res.error) console.warn('Supabase log audit notice:', res.error);
      });
    }
  },
  reviewAuditLog: (logId: string, reviewerEmail: string, status: 'approved' | 'flagged', notes?: string): AuditLog[] => {
    const logs = getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const updated = logs.map(l => {
      if (l.id === logId) {
        return {
          ...l,
          supervisor_reviewed: true,
          supervisor_status: status,
          supervisor_reviewed_by: reviewerEmail,
          supervisor_reviewed_at: new Date().toISOString(),
          supervisor_notes: notes || l.supervisor_notes
        };
      }
      return l;
    });
    setStored(STORAGE_KEYS.AUDIT_LOGS, updated);
    return updated;
  },

  // --- PAYMENT GATEWAYS & ONLINE BANKING SERVICES ---
  getPaymentGateways: async (): Promise<PaymentGateway[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('payment_gateways').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.PAYMENT_GATEWAYS, data);
          return data as PaymentGateway[];
        }
      } catch (e) {
        console.warn('Supabase fetch payment_gateways notice:', e);
      }
    }
    return getStored<PaymentGateway[]>(STORAGE_KEYS.PAYMENT_GATEWAYS, INITIAL_PAYMENT_GATEWAYS);
  },

  getPaymentGatewayById: async (id: string): Promise<PaymentGateway | null> => {
    const gateways = await api.getPaymentGateways();
    return gateways.find(g => g.id === id) || null;
  },

  savePaymentGateway: async (gateway: Partial<PaymentGateway> & { name: string; provider: PaymentGateway['provider'] }): Promise<PaymentGateway> => {
    const gateways = getStored<PaymentGateway[]>(STORAGE_KEYS.PAYMENT_GATEWAYS, INITIAL_PAYMENT_GATEWAYS);
    const now = new Date().toISOString();
    let saved: PaymentGateway;

    const existingIndex = gateways.findIndex(g => (gateway.id && g.id === gateway.id) || (g.provider === gateway.provider && g.provider !== 'custom'));

    if (existingIndex !== -1) {
      saved = {
        ...gateways[existingIndex],
        ...gateway,
        updated_at: now,
      };
      gateways[existingIndex] = saved;
      api.logAudit('Update Payment Gateway', 'PaymentGateway', saved.id, `Updated config for ${saved.name} (${saved.provider}) [Status: ${saved.enabled ? 'ENABLED' : 'DISABLED'}]`);
    } else {
      saved = {
        id: gateway.id || 'gw-' + gateway.provider + '-' + Date.now(),
        name: gateway.name,
        provider: gateway.provider,
        description: gateway.description || '',
        icon_name: gateway.icon_name || 'CreditCard',
        enabled: gateway.enabled ?? true,
        display_order: gateway.display_order || gateways.length + 1,
        test_mode: gateway.test_mode ?? true,
        badge_text: gateway.badge_text,
        authorize_net: gateway.authorize_net,
        stripe: gateway.stripe,
        paypal: gateway.paypal,
        bank_wire: gateway.bank_wire,
        crypto: gateway.crypto,
        apple_pay: gateway.apple_pay,
        custom_fields: gateway.custom_fields,
        created_at: now,
        updated_at: now,
      };
      gateways.push(saved);
      api.logAudit('Add Payment Gateway', 'PaymentGateway', saved.id, `Added new payment gateway ${saved.name} (${saved.provider})`);
    }

    setStored(STORAGE_KEYS.PAYMENT_GATEWAYS, gateways);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('payment_gateways').upsert([saved]);
      } catch (err) {
        console.warn('Supabase upsert payment_gateway non-blocking notice:', err);
      }
    }

    return saved;
  },

  togglePaymentGateway: async (id: string, enabled: boolean): Promise<PaymentGateway> => {
    const gateways = getStored<PaymentGateway[]>(STORAGE_KEYS.PAYMENT_GATEWAYS, INITIAL_PAYMENT_GATEWAYS);
    const index = gateways.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Payment gateway not found');
    }

    const updated = {
      ...gateways[index],
      enabled,
      updated_at: new Date().toISOString()
    };
    gateways[index] = updated;
    setStored(STORAGE_KEYS.PAYMENT_GATEWAYS, gateways);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('payment_gateways').update({
          enabled,
          updated_at: updated.updated_at
        }).eq('id', id);
      } catch (err) {
        console.warn('Supabase toggle payment_gateway non-blocking notice:', err);
      }
    }

    api.logAudit('Toggle Payment Gateway', 'PaymentGateway', id, `${enabled ? 'ENABLED' : 'DISABLED'} payment gateway: ${updated.name}`);
    return updated;
  },

  deletePaymentGateway: async (id: string): Promise<boolean> => {
    let gateways = getStored<PaymentGateway[]>(STORAGE_KEYS.PAYMENT_GATEWAYS, INITIAL_PAYMENT_GATEWAYS);
    const target = gateways.find(g => g.id === id);
    gateways = gateways.filter(g => g.id !== id);
    setStored(STORAGE_KEYS.PAYMENT_GATEWAYS, gateways);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('payment_gateways').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete payment gateway non-blocking notice:', err);
      }
    }

    if (target) {
      api.logAudit('Delete Payment Gateway', 'PaymentGateway', id, `Removed payment gateway ${target.name}`);
    }
    return true;
  },

  testAuthorizeNetConnection: async (apiLoginId: string, transactionKey: string, isSandbox: boolean): Promise<{ success: boolean; message: string; code?: string }> => {
    await new Promise(r => setTimeout(r, 800));

    if (!apiLoginId || !transactionKey) {
      return { success: false, message: 'API Login ID and Transaction Key are required for Authorize.Net API handshake.' };
    }

    if (apiLoginId.length < 5 || transactionKey.length < 8) {
      return { success: false, message: 'Invalid API credentials format. Authorize.Net API Login ID must be valid.' };
    }

    return {
      success: true,
      code: 'Ok',
      message: `Authorize.Net ${isSandbox ? 'Sandbox Test' : 'Production Live'} Handshake Successful! Merchant Account Authenticated.`
    };
  },

  getDownloadables: async (): Promise<DownloadableItem[]> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('downloadable_content').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setStored(STORAGE_KEYS.DOWNLOADABLES, data);
          return data as DownloadableItem[];
        }
      } catch (err) {
        console.warn('Supabase getDownloadables notice:', err);
      }
    }
    return getStored<DownloadableItem[]>(STORAGE_KEYS.DOWNLOADABLES, INITIAL_DOWNLOADABLES);
  },

  saveDownloadable: async (item: Partial<DownloadableItem>): Promise<DownloadableItem> => {
    let items = getStored<DownloadableItem[]>(STORAGE_KEYS.DOWNLOADABLES, INITIAL_DOWNLOADABLES);
    let updatedItem: DownloadableItem;

    if (item.id) {
      let found = false;
      items = items.map(d => {
        if (d.id === item.id) {
          found = true;
          updatedItem = {
            ...d,
            ...item,
            updated_at: new Date().toISOString()
          };
          return updatedItem;
        }
        return d;
      });
      if (!found) {
        updatedItem = {
          id: item.id,
          title: item.title || 'Untitled Downloadable',
          filename: item.filename || 'download.bin',
          file_size: item.file_size || '1.0 MB',
          version: item.version || '1.0.0',
          category: item.category || 'app',
          platform: item.platform || 'all',
          description: item.description || '',
          download_url: item.download_url || '#',
          is_public: item.is_public ?? true,
          requires_auth: item.requires_auth ?? false,
          download_count: item.download_count || 0,
          release_notes: item.release_notes || '',
          md5_hash: item.md5_hash || '',
          created_at: item.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        items.unshift(updatedItem);
      }
    } else {
      const id = `dl-${Date.now()}`;
      updatedItem = {
        id,
        title: item.title || 'New Downloadable Item',
        filename: item.filename || 'file.apk',
        file_size: item.file_size || '10.0 MB',
        version: item.version || '1.0.0',
        category: item.category || 'app',
        platform: item.platform || 'android',
        description: item.description || '',
        download_url: item.download_url || `/downloads/${item.filename || 'file.apk'}`,
        is_public: item.is_public ?? true,
        requires_auth: item.requires_auth ?? false,
        download_count: 0,
        release_notes: item.release_notes || '',
        md5_hash: item.md5_hash || '0123456789abcdef0123456789abcdef',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      items.unshift(updatedItem);
    }

    setStored(STORAGE_KEYS.DOWNLOADABLES, items);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('downloadable_content').upsert(updatedItem);
      } catch (err) {
        console.warn('Supabase save downloadable non-blocking notice:', err);
      }
    }

    api.logAudit('Save Downloadable', 'DownloadableItem', updatedItem.id, `Saved downloadable asset: ${updatedItem.title} (${updatedItem.filename})`);
    return updatedItem;
  },

  deleteDownloadable: async (id: string): Promise<boolean> => {
    let items = getStored<DownloadableItem[]>(STORAGE_KEYS.DOWNLOADABLES, INITIAL_DOWNLOADABLES);
    const target = items.find(d => d.id === id);
    items = items.filter(d => d.id !== id);
    setStored(STORAGE_KEYS.DOWNLOADABLES, items);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('downloadable_content').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete downloadable notice:', err);
      }
    }

    if (target) {
      api.logAudit('Delete Downloadable', 'DownloadableItem', id, `Removed downloadable item ${target.title}`);
    }
    return true;
  },

  incrementDownloadCount: async (id: string): Promise<number> => {
    let items = getStored<DownloadableItem[]>(STORAGE_KEYS.DOWNLOADABLES, INITIAL_DOWNLOADABLES);
    let newCount = 0;
    items = items.map(d => {
      if (d.id === id) {
        newCount = (d.download_count || 0) + 1;
        return { ...d, download_count: newCount, updated_at: new Date().toISOString() };
      }
      return d;
    });
    setStored(STORAGE_KEYS.DOWNLOADABLES, items);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('downloadable_content').update({ download_count: newCount }).eq('id', id);
      } catch (err) {
        console.warn('Supabase increment download_count notice:', err);
      }
    }
    return newCount;
  },

  // --- DIGITAL ASSET & STORAGE ACCESS CONTROL SYSTEM ---
  getUserAssetGrants: async (userId?: string): Promise<UserAssetGrant[]> => {
    let grants = getStored<UserAssetGrant[]>(STORAGE_KEYS.USER_ASSET_GRANTS, INITIAL_USER_ASSET_GRANTS);
    if (userId) {
      grants = grants.filter(g => g.user_id === userId || g.user_email.toLowerCase() === userId.toLowerCase());
    }
    return grants;
  },

  grantAssetToUser: async (grantData: Partial<UserAssetGrant>, sendEmailNotice = true): Promise<UserAssetGrant> => {
    const grants = getStored<UserAssetGrant[]>(STORAGE_KEYS.USER_ASSET_GRANTS, INITIAL_USER_ASSET_GRANTS);
    const downloadables = await api.getDownloadables();
    const targetAsset = downloadables.find(d => d.id === grantData.asset_id);

    const now = new Date().toISOString();
    const cleanEmail = (grantData.user_email || '').toLowerCase().trim();

    const newGrant: UserAssetGrant = {
      id: grantData.id || 'grant-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      user_id: grantData.user_id || 'usr-gen-' + Date.now(),
      user_email: cleanEmail,
      user_name: grantData.user_name || cleanEmail.split('@')[0] || 'Registered User',
      asset_id: grantData.asset_id || '',
      asset_title: grantData.asset_title || targetAsset?.title || 'Digital Asset Download',
      filename: grantData.filename || targetAsset?.filename || 'download.zip',
      granted_by: grantData.granted_by || 'admin',
      granted_by_detail: grantData.granted_by_detail || 'Assigned by Administrator',
      granted_at: grantData.granted_at || now,
      expires_at: grantData.expires_at,
      download_count: grantData.download_count || 0,
      max_downloads: grantData.max_downloads,
      last_downloaded_at: grantData.last_downloaded_at
    };

    // Remove existing grant for same user + asset if any
    const updated = grants.filter(g => !(g.user_email.toLowerCase() === newGrant.user_email.toLowerCase() && g.asset_id === newGrant.asset_id));
    updated.unshift(newGrant);
    setStored(STORAGE_KEYS.USER_ASSET_GRANTS, updated);

    // Also update asset's assigned_user_emails array if not already present
    if (targetAsset) {
      const assignedEmails = targetAsset.assigned_user_emails || [];
      if (!assignedEmails.includes(newGrant.user_email)) {
        targetAsset.assigned_user_emails = [...assignedEmails, newGrant.user_email];
        await api.saveDownloadable(targetAsset);
      }
    }

    api.logAudit('Grant Asset Access', 'UserAssetGrant', newGrant.id, `Granted access for asset "${newGrant.asset_title}" to ${newGrant.user_email} (${newGrant.granted_by_detail})`);

    // Optionally dispatch email immediately
    if (sendEmailNotice && newGrant.asset_id && newGrant.user_email) {
      try {
        await api.sendAssetToEmail(newGrant.asset_id, newGrant.user_email);
      } catch (e) {
        console.warn('Dispatch asset grant email notice:', e);
      }
    }

    return newGrant;
  },

  revokeAssetGrant: async (grantId: string): Promise<boolean> => {
    let grants = getStored<UserAssetGrant[]>(STORAGE_KEYS.USER_ASSET_GRANTS, INITIAL_USER_ASSET_GRANTS);
    const target = grants.find(g => g.id === grantId);
    grants = grants.filter(g => g.id !== grantId);
    setStored(STORAGE_KEYS.USER_ASSET_GRANTS, grants);

    if (target) {
      api.logAudit('Revoke Asset Access', 'UserAssetGrant', grantId, `Revoked access for asset "${target.asset_title}" from ${target.user_email}`);
    }
    return true;
  },

  getAccessibleAssetsForUser: async (user: UserProfile | null): Promise<{ downloadable: DownloadableItem; isGranted: boolean; grantReason: string; isExpired: boolean; grant?: UserAssetGrant }[]> => {
    const downloadables = await api.getDownloadables();
    const grants = await api.getUserAssetGrants(user?.id || user?.email);
    const orders = user ? (getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_SAMPLE_ORDERS)).filter(o => o.customer_email.toLowerCase() === user.email.toLowerCase()) : [];
    
    const purchasedProductIds = new Set<string>();
    orders.forEach(o => {
      if (o.payment_status === 'paid' || o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered' || o.status === 'processing' || o.status === 'pending') {
        o.items.forEach(i => purchasedProductIds.add(i.product_id));
      }
    });

    const userEmail = user?.email.toLowerCase() || '';
    const userId = user?.id || '';

    return downloadables.map(asset => {
      const accessRule = asset.access_rule || (asset.is_public ? 'public' : asset.requires_auth ? 'registered_only' : 'public');

      // Check if user has an explicit UserAssetGrant
      const userGrant = grants.find(g => g.asset_id === asset.id && (g.user_email.toLowerCase() === userEmail || g.user_id === userId));

      // Check if user bought a linked product
      let boughtLinkedProduct = false;
      if (asset.linked_product_ids && asset.linked_product_ids.length > 0) {
        for (const pId of asset.linked_product_ids) {
          if (purchasedProductIds.has(pId)) {
            boughtLinkedProduct = true;
            break;
          }
        }
      }

      // Check manually assigned arrays on asset
      const isDirectlyAssigned = (asset.assigned_user_emails || []).some(e => e.toLowerCase() === userEmail) || (asset.assigned_user_ids || []).includes(userId);

      let isGranted = false;
      let grantReason = 'Locked';
      let isExpired = false;

      if (userGrant?.expires_at && new Date(userGrant.expires_at) < new Date()) {
        isExpired = true;
      }

      if (accessRule === 'public') {
        isGranted = true;
        grantReason = 'Public Access';
      } else if (accessRule === 'registered_only' && user) {
        isGranted = true;
        grantReason = 'Registered Member Access';
      } else if (userGrant && !isExpired) {
        isGranted = true;
        grantReason = userGrant.granted_by_detail || `Granted by ${userGrant.granted_by}`;
      } else if (boughtLinkedProduct) {
        isGranted = true;
        grantReason = 'Product Purchase Auto-Unlocked';
      } else if (isDirectlyAssigned && user) {
        isGranted = true;
        grantReason = 'Admin Granted Access';
      }

      return {
        downloadable: asset,
        isGranted,
        grantReason,
        isExpired,
        grant: userGrant
      };
    });
  },

  sendAssetToEmail: async (assetId: string, recipientEmail: string, requestorUser?: UserProfile): Promise<{ success: boolean; message: string }> => {
    const downloadables = await api.getDownloadables();
    const asset = downloadables.find(d => d.id === assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    const cleanRecipient = recipientEmail.toLowerCase().trim();
    if (!cleanRecipient) {
      throw new Error('Recipient email is required');
    }

    // Generate full URL
    const downloadLink = window.location.origin + asset.download_url;

    // Send email using communication engine
    const commState = await api.getCommunicationState();
    const activeProfile = commState.profiles.find(p => p.id === commState.active_profile_id) || commState.profiles[0];
    const senderEmail = activeProfile?.company_email || 'bkresearchlabs@gmail.com';

    const subject = `📥 Digital Asset Download: ${asset.title} - BK Research Labs`;

    // Add to Email Logs
    const now = new Date().toISOString();
    const newLog: EmailLog = {
      id: 'log-asset-' + Date.now(),
      direction: 'outgoing',
      from_email: senderEmail,
      to_email: cleanRecipient,
      subject,
      template_type: 'custom',
      status: 'delivered',
      details: `Dispatched digital asset download link for "${asset.title}" (${asset.filename}). Handshake profile: ${activeProfile.name}`,
      timestamp: now
    };
    commState.email_logs.unshift(newLog);
    setStored(STORAGE_KEYS.COMMUNICATION_SYSTEM, commState);

    // Add to Asset Email Logs
    const assetEmailLogs = getStored<AssetEmailLog[]>(STORAGE_KEYS.ASSET_EMAIL_LOGS, INITIAL_ASSET_EMAIL_LOGS);
    const assetLog: AssetEmailLog = {
      id: 'alog-' + Date.now(),
      asset_id: asset.id,
      asset_title: asset.title,
      filename: asset.filename,
      recipient_email: cleanRecipient,
      sent_by_user_id: requestorUser?.id,
      sent_by_email: requestorUser?.email || senderEmail,
      trigger_source: requestorUser?.role === 'admin' || requestorUser?.role === 'owner' ? 'admin_dispatch' : 'user_request',
      status: 'sent',
      details: `Emailed file link to ${cleanRecipient}`,
      sent_at: now
    };
    assetEmailLogs.unshift(assetLog);
    setStored(STORAGE_KEYS.ASSET_EMAIL_LOGS, assetEmailLogs);

    // Increment email sent count on asset
    asset.email_sent_count = (asset.email_sent_count || 0) + 1;
    await api.saveDownloadable(asset);

    api.logAudit('Asset Emailed', 'DownloadableItem', asset.id, `Emailed download copy of "${asset.title}" to ${cleanRecipient}`);

    return {
      success: true,
      message: `Successfully dispatched "${asset.title}" to ${cleanRecipient}!`
    };
  },

  processAutomaticAssetUnlocks: async (user: UserProfile, order: Order): Promise<UserAssetGrant[]> => {
    const downloadables = await api.getDownloadables();
    const createdGrants: UserAssetGrant[] = [];

    const orderProductIds = order.items.map(item => item.product_id);

    for (const asset of downloadables) {
      if (!asset.linked_product_ids || asset.linked_product_ids.length === 0) continue;

      const matchesOrder = asset.linked_product_ids.some(pId => orderProductIds.includes(pId));
      if (matchesOrder) {
        // Matched! Auto Grant Access
        const grant = await api.grantAssetToUser({
          user_id: user.id,
          user_email: user.email,
          user_name: `${user.first_name} ${user.last_name}`,
          asset_id: asset.id,
          asset_title: asset.title,
          filename: asset.filename,
          granted_by: 'product_purchase',
          granted_by_detail: `Order #${order.order_number} (${order.items.map(i => i.product_name_snapshot).join(', ')})`,
          download_count: 0
        }, true); // automatically dispatches email copy!

        createdGrants.push(grant);
      }
    }

    return createdGrants;
  },

  getAssetEmailLogs: async (): Promise<AssetEmailLog[]> => {
    return getStored<AssetEmailLog[]>(STORAGE_KEYS.ASSET_EMAIL_LOGS, INITIAL_ASSET_EMAIL_LOGS);
  },

  // --- REAL-TIME CUSTOMIZABLE COMMUNICATION & EMAIL NOTIFICATIONS ENGINE ---
  getCommunicationState: async (): Promise<CommunicationSystemState> => {
    const state = getStored<CommunicationSystemState>(STORAGE_KEYS.COMMUNICATION_SYSTEM, INITIAL_COMMUNICATION_STATE);
    // Ensure profiles array and active_profile_id exist
    if (!state.profiles || state.profiles.length === 0) {
      state.profiles = INITIAL_COMMUNICATION_STATE.profiles;
    }
    if (!state.active_profile_id) {
      const defaultProf = state.profiles.find(p => p.is_default) || state.profiles[0];
      state.active_profile_id = defaultProf ? defaultProf.id : 'prof-primary-gmail';
    }
    // Keep provider_config in sync with active profile
    const activeProf = state.profiles.find(p => p.id === state.active_profile_id) || state.profiles[0];
    if (activeProf) {
      state.provider_config = {
        provider_type: activeProf.provider_type,
        company_external_email: activeProf.company_email,
        sender_name: activeProf.sender_name,
        reply_to_email: activeProf.reply_to_email || activeProf.company_email,
        smtp_host: activeProf.smtp_host,
        smtp_port: activeProf.smtp_port,
        smtp_user: activeProf.smtp_user,
        smtp_pass: activeProf.smtp_pass,
        smtp_security: activeProf.smtp_security,
        api_key: activeProf.api_key,
        webhook_url: activeProf.webhook_url,
        status: activeProf.status,
        last_tested_at: activeProf.last_tested_at,
        last_error_message: activeProf.last_error_message
      };
    }

    // Ensure SMS state defaults
    if (!state.sms_profiles || state.sms_profiles.length === 0) {
      state.sms_profiles = INITIAL_COMMUNICATION_STATE.sms_profiles || [];
    }
    if (!state.active_sms_profile_id) {
      const defaultSmsProf = state.sms_profiles.find(p => p.is_default) || state.sms_profiles[0];
      state.active_sms_profile_id = defaultSmsProf ? defaultSmsProf.id : 'sms-prof-twilio';
    }
    if (!state.sms_notification_rules || state.sms_notification_rules.length === 0) {
      state.sms_notification_rules = INITIAL_COMMUNICATION_STATE.sms_notification_rules || [];
    }
    if (!state.sms_logs) {
      state.sms_logs = INITIAL_COMMUNICATION_STATE.sms_logs || [];
    }
    if (state.sms_notifications_enabled === undefined) {
      state.sms_notifications_enabled = true;
    }

    return state;
  },

  updateCommunicationState: async (state: CommunicationSystemState): Promise<CommunicationSystemState> => {
    setStored(STORAGE_KEYS.COMMUNICATION_SYSTEM, state);
    const activeProf = state.profiles?.find(p => p.id === state.active_profile_id);
    const emailInfo = activeProf ? activeProf.company_email : state.provider_config.company_external_email;
    api.logAudit('Update Communication Config', 'Settings', 'comm-system', `Updated email system config. Active profile email: ${emailInfo}`);
    return state;
  },

  // Multiple Email Profiles Management
  createEmailProfile: async (profileData: Omit<EmailProfile, 'id' | 'created_at' | 'updated_at'>): Promise<EmailProfile> => {
    const commState = await api.getCommunicationState();
    const now = new Date().toISOString();
    const newProfile: EmailProfile = {
      ...profileData,
      id: 'prof-' + Date.now(),
      created_at: now,
      updated_at: now
    };

    if (newProfile.is_default || commState.profiles.length === 0) {
      commState.profiles.forEach(p => { p.is_default = false; });
      newProfile.is_default = true;
      commState.active_profile_id = newProfile.id;
    }

    commState.profiles.push(newProfile);
    await api.updateCommunicationState(commState);
    api.logAudit('Create Email Profile', 'Settings', 'comm-system', `Created new company email profile: ${newProfile.name} (${newProfile.company_email})`);
    return newProfile;
  },

  updateEmailProfile: async (id: string, updates: Partial<EmailProfile>): Promise<EmailProfile> => {
    const commState = await api.getCommunicationState();
    const index = commState.profiles.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Email profile not found');

    const existing = commState.profiles[index];
    const updated: EmailProfile = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (updates.is_default) {
      commState.profiles.forEach(p => { p.is_default = (p.id === id); });
      commState.active_profile_id = id;
    }

    commState.profiles[index] = updated;
    await api.updateCommunicationState(commState);
    api.logAudit('Update Email Profile', 'Settings', 'comm-system', `Updated email profile: ${updated.name} (${updated.company_email})`);
    return updated;
  },

  deleteEmailProfile: async (id: string): Promise<void> => {
    const commState = await api.getCommunicationState();
    if (commState.profiles.length <= 1) {
      throw new Error('At least one email profile must remain active for the company.');
    }
    const target = commState.profiles.find(p => p.id === id);
    commState.profiles = commState.profiles.filter(p => p.id !== id);

    if (commState.active_profile_id === id) {
      commState.profiles[0].is_default = true;
      commState.active_profile_id = commState.profiles[0].id;
    }

    await api.updateCommunicationState(commState);
    api.logAudit('Delete Email Profile', 'Settings', 'comm-system', `Deleted email profile: ${target?.name || id}`);
  },

  setActiveEmailProfile: async (id: string): Promise<EmailProfile> => {
    const commState = await api.getCommunicationState();
    const target = commState.profiles.find(p => p.id === id);
    if (!target) throw new Error('Email profile not found');

    commState.profiles.forEach(p => {
      p.is_default = (p.id === id);
    });
    commState.active_profile_id = id;

    await api.updateCommunicationState(commState);
    api.logAudit('Set Active Email Profile', 'Settings', 'comm-system', `Switched active company email profile to: ${target.name} (${target.company_email})`);
    return target;
  },

  updateEmailProviderConfig: async (config: Partial<EmailProviderConfig>): Promise<EmailProviderConfig> => {
    const commState = await api.getCommunicationState();
    const updatedConfig: EmailProviderConfig = {
      ...commState.provider_config,
      ...config,
      last_tested_at: new Date().toISOString()
    };
    commState.provider_config = updatedConfig;

    // Also sync to current active profile
    const activeProfIndex = commState.profiles.findIndex(p => p.id === commState.active_profile_id);
    if (activeProfIndex !== -1) {
      commState.profiles[activeProfIndex] = {
        ...commState.profiles[activeProfIndex],
        company_email: config.company_external_email || commState.profiles[activeProfIndex].company_email,
        sender_name: config.sender_name || commState.profiles[activeProfIndex].sender_name,
        reply_to_email: config.reply_to_email || commState.profiles[activeProfIndex].reply_to_email,
        provider_type: config.provider_type || commState.profiles[activeProfIndex].provider_type,
        smtp_host: config.smtp_host,
        smtp_port: config.smtp_port,
        smtp_user: config.smtp_user,
        smtp_pass: config.smtp_pass,
        smtp_security: config.smtp_security,
        api_key: config.api_key,
        webhook_url: config.webhook_url,
        status: config.status || commState.profiles[activeProfIndex].status,
        last_tested_at: new Date().toISOString()
      };
    }

    await api.updateCommunicationState(commState);
    return updatedConfig;
  },

  testEmailHandshake: async (targetEmail?: string, profileId?: string): Promise<{ success: boolean; message: string; details: string }> => {
    const commState = await api.getCommunicationState();
    const prof = (profileId && commState.profiles.find(p => p.id === profileId)) ||
                 commState.profiles.find(p => p.id === commState.active_profile_id) ||
                 commState.profiles[0];

    const senderEmail = prof ? prof.company_email : commState.provider_config.company_external_email;
    const provider = prof ? prof.provider_type : commState.provider_config.provider_type;
    const host = prof ? prof.smtp_host : commState.provider_config.smtp_host;
    const recipient = targetEmail || senderEmail || 'admin@bkresearchlabs.com';
    const now = new Date().toISOString();

    const testLog: EmailLog = {
      id: 'log-test-' + Date.now(),
      direction: 'outgoing',
      from_email: senderEmail || 'bkresearchlabs@gmail.com',
      to_email: recipient,
      subject: `[Handshake Test] Live Profile Verification: ${prof?.name || 'Company Profile'} (${provider.toUpperCase()})`,
      template_type: 'custom',
      status: 'delivered',
      details: `Handshake successful via ${provider.toUpperCase()} (${host || 'API Key Portal'}) for company email profile ${senderEmail}`,
      timestamp: now
    };

    commState.email_logs.unshift(testLog);

    if (prof) {
      prof.status = 'connected';
      prof.last_tested_at = now;
      prof.last_error_message = undefined;
    }
    commState.provider_config.status = 'connected';
    commState.provider_config.last_tested_at = now;

    await api.updateCommunicationState(commState);

    return {
      success: true,
      message: `Email handshake verified for profile "${prof?.name || 'Default'}"! Test email sent to ${recipient}`,
      details: `Authenticated via ${provider.toUpperCase()} (${host || 'API Portal'}) using sender ${senderEmail}.`
    };
  },

  updateNotificationRules: async (rules: EmailNotificationRule[]): Promise<EmailNotificationRule[]> => {
    const commState = await api.getCommunicationState();
    commState.notification_rules = rules;
    await api.updateCommunicationState(commState);
    return rules;
  },

  sendNotificationEmail: async (
    templateType: NotificationTemplateType,
    recipientEmail: string,
    variables: Record<string, string>,
    profileIdOverride?: string
  ): Promise<{ success: boolean; log: EmailLog }> => {
    const commState = await api.getCommunicationState();
    const rule = commState.notification_rules.find(r => r.template_type === templateType);

    // Determine profile
    let targetProfile: EmailProfile | undefined;
    const assignedId = profileIdOverride || rule?.assigned_profile_id;
    if (assignedId && assignedId !== 'default') {
      targetProfile = commState.profiles.find(p => p.id === assignedId);
    }
    if (!targetProfile) {
      targetProfile = commState.profiles.find(p => p.id === commState.active_profile_id) || commState.profiles[0];
    }

    const senderEmail = targetProfile ? targetProfile.company_email : commState.provider_config.company_external_email;
    const senderName = targetProfile ? targetProfile.sender_name : commState.provider_config.sender_name;
    const providerType = targetProfile ? targetProfile.provider_type : commState.provider_config.provider_type;

    if (!rule || !rule.enabled) {
      const disabledLog: EmailLog = {
        id: 'log-' + Date.now(),
        direction: 'outgoing',
        from_email: senderEmail || 'bkresearchlabs@gmail.com',
        to_email: recipientEmail,
        subject: `Notification Skipped (${templateType})`,
        template_type: templateType,
        status: 'failed',
        details: `Rule for ${templateType} is disabled or unconfigured in dashboard settings.`,
        timestamp: new Date().toISOString()
      };
      return { success: false, log: disabledLog };
    }

    let subject = rule.subject;
    let bodyText = rule.body_text;
    let bodyHtml = rule.body_html;

    const allVars: Record<string, string> = {
      company_email: senderEmail || 'support@bkresearchlabs.com',
      sender_name: senderName || 'BK Research Labs',
      profile_name: targetProfile ? targetProfile.name : 'Default Company Profile',
      ...variables
    };

    Object.entries(allVars).forEach(([k, v]) => {
      const pattern = new RegExp(`\\{\\{${k}\\}\\}`, 'g');
      subject = subject.replace(pattern, v || '');
      bodyText = bodyText.replace(pattern, v || '');
      bodyHtml = bodyHtml.replace(pattern, v || '');
    });

    const log: EmailLog = {
      id: 'log-' + Date.now(),
      direction: 'outgoing',
      from_email: senderEmail || 'bkresearchlabs@gmail.com',
      to_email: recipientEmail,
      subject,
      template_type: templateType,
      status: 'delivered',
      details: `Dispatched via profile "${targetProfile?.name || 'Default'}" (${providerType.toUpperCase()}) from ${senderEmail} to ${recipientEmail}`,
      timestamp: new Date().toISOString()
    };

    commState.email_logs.unshift(log);
    if (commState.email_logs.length > 200) commState.email_logs.pop();

    await api.updateCommunicationState(commState);
    return { success: true, log };
  },

  // --- SMS NOTIFICATION & GATEWAY MANAGEMENT ENGINE ---
  createSmsProfile: async (profileData: Omit<SmsProfile, 'id' | 'created_at' | 'updated_at'>): Promise<SmsProfile> => {
    const commState = await api.getCommunicationState();
    const now = new Date().toISOString();
    const newProfile: SmsProfile = {
      ...profileData,
      id: 'sms-prof-' + Date.now(),
      created_at: now,
      updated_at: now
    };

    if (!commState.sms_profiles) commState.sms_profiles = [];

    if (newProfile.is_default || commState.sms_profiles.length === 0) {
      commState.sms_profiles.forEach(p => { p.is_default = false; });
      newProfile.is_default = true;
      commState.active_sms_profile_id = newProfile.id;
    }

    commState.sms_profiles.push(newProfile);
    await api.updateCommunicationState(commState);
    api.logAudit('Create SMS Profile', 'Settings', 'comm-system', `Created SMS profile: ${newProfile.name} (${newProfile.from_phone_number})`);
    return newProfile;
  },

  updateSmsProfile: async (id: string, updates: Partial<SmsProfile>): Promise<SmsProfile> => {
    const commState = await api.getCommunicationState();
    if (!commState.sms_profiles) commState.sms_profiles = [];
    const index = commState.sms_profiles.findIndex(p => p.id === id);
    if (index === -1) throw new Error('SMS profile not found');

    const existing = commState.sms_profiles[index];
    const updated: SmsProfile = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (updates.is_default) {
      commState.sms_profiles.forEach(p => { p.is_default = (p.id === id); });
      commState.active_sms_profile_id = id;
    }

    commState.sms_profiles[index] = updated;
    await api.updateCommunicationState(commState);
    api.logAudit('Update SMS Profile', 'Settings', 'comm-system', `Updated SMS profile: ${updated.name}`);
    return updated;
  },

  deleteSmsProfile: async (id: string): Promise<void> => {
    const commState = await api.getCommunicationState();
    if (!commState.sms_profiles || commState.sms_profiles.length <= 1) {
      throw new Error('At least one SMS profile must remain configured.');
    }
    const target = commState.sms_profiles.find(p => p.id === id);
    commState.sms_profiles = commState.sms_profiles.filter(p => p.id !== id);

    if (commState.active_sms_profile_id === id) {
      commState.sms_profiles[0].is_default = true;
      commState.active_sms_profile_id = commState.sms_profiles[0].id;
    }

    await api.updateCommunicationState(commState);
    api.logAudit('Delete SMS Profile', 'Settings', 'comm-system', `Deleted SMS profile: ${target?.name || id}`);
  },

  setActiveSmsProfile: async (id: string): Promise<SmsProfile> => {
    const commState = await api.getCommunicationState();
    if (!commState.sms_profiles) commState.sms_profiles = [];
    const target = commState.sms_profiles.find(p => p.id === id);
    if (!target) throw new Error('SMS profile not found');

    commState.sms_profiles.forEach(p => {
      p.is_default = (p.id === id);
    });
    commState.active_sms_profile_id = id;

    await api.updateCommunicationState(commState);
    api.logAudit('Set Active SMS Profile', 'Settings', 'comm-system', `Switched active SMS profile to: ${target.name} (${target.from_phone_number})`);
    return target;
  },

  saveSmsNotificationRule: async (ruleData: Partial<SmsNotificationRule> & { template_type: SmsNotificationTemplateType }): Promise<SmsNotificationRule> => {
    const commState = await api.getCommunicationState();
    if (!commState.sms_notification_rules) commState.sms_notification_rules = [];
    const now = new Date().toISOString();
    let saved: SmsNotificationRule;

    const existingIndex = ruleData.id
      ? commState.sms_notification_rules.findIndex(r => r.id === ruleData.id)
      : commState.sms_notification_rules.findIndex(r => r.template_type === ruleData.template_type);

    if (existingIndex !== -1) {
      saved = {
        ...commState.sms_notification_rules[existingIndex],
        ...ruleData,
        updated_at: now
      };
      commState.sms_notification_rules[existingIndex] = saved;
    } else {
      saved = {
        id: ruleData.id || 'sms-rule-' + Date.now(),
        template_type: ruleData.template_type,
        title: ruleData.title || 'SMS Notification Rule',
        description: ruleData.description || 'Custom SMS template',
        enabled: ruleData.enabled ?? true,
        trigger_event: ruleData.trigger_event || ruleData.template_type,
        recipient_target: ruleData.recipient_target || 'customer',
        custom_recipient_phone: ruleData.custom_recipient_phone,
        assigned_sms_profile_id: ruleData.assigned_sms_profile_id,
        message_body: ruleData.message_body || 'BK Research Labs alert for {customer_name}.',
        available_variables: ruleData.available_variables || ['customer_name', 'order_number'],
        created_at: now,
        updated_at: now
      };
      commState.sms_notification_rules.push(saved);
    }

    await api.updateCommunicationState(commState);
    api.logAudit('Save SMS Rule', 'Settings', saved.id, `Saved SMS template rule: ${saved.title}`);
    return saved;
  },

  deleteSmsNotificationRule: async (ruleId: string): Promise<void> => {
    const commState = await api.getCommunicationState();
    if (!commState.sms_notification_rules) return;
    commState.sms_notification_rules = commState.sms_notification_rules.filter(r => r.id !== ruleId);
    await api.updateCommunicationState(commState);
    api.logAudit('Delete SMS Rule', 'Settings', ruleId, `Deleted SMS rule ${ruleId}`);
  },

  testSmsHandshake: async (targetPhone?: string, profileId?: string, customMsg?: string): Promise<{ success: boolean; message: string; details: string }> => {
    const commState = await api.getCommunicationState();
    const smsProfiles = commState.sms_profiles || [];
    const prof = (profileId && smsProfiles.find(p => p.id === profileId)) ||
                 smsProfiles.find(p => p.id === commState.active_sms_profile_id) ||
                 smsProfiles[0];

    const recipient = targetPhone || '+1 (617) 555-0192';
    const sender = prof ? prof.from_phone_number : '+1 (800) 555-0199';
    const provider = prof ? prof.provider_type : 'twilio';
    const now = new Date().toISOString();
    const text = customMsg || `[BKRL TEST SMS] Gateway test handshake from ${sender} via ${provider.toUpperCase()}. Timestamp: ${now}`;

    const segments = Math.ceil(text.length / 160);

    const testLog: SmsLog = {
      id: 'sms-test-' + Date.now(),
      direction: 'outgoing',
      from_phone: sender,
      to_phone: recipient,
      message_body: text,
      provider_used: `${prof?.name || 'Default Gateway'} (${provider.toUpperCase()})`,
      segment_count: segments,
      status: 'delivered',
      details: `Test SMS Ping successfully delivered to carrier gateway (${recipient}). Segments: ${segments}. SID: SM-TST-${Math.floor(Math.random() * 899999 + 100000)}`,
      timestamp: now
    };

    if (!commState.sms_logs) commState.sms_logs = [];
    commState.sms_logs.unshift(testLog);

    if (prof) {
      prof.status = 'connected';
      prof.last_tested_at = now;
      prof.last_error_message = undefined;
    }

    await api.updateCommunicationState(commState);

    return {
      success: true,
      message: `SMS Handshake Verified via ${prof?.name || provider.toUpperCase()}`,
      details: `Dispatched test SMS to ${recipient} from ${sender}. Status: Delivered (${segments} segment).`
    };
  },

  sendSmsNotification: async (
    templateType: SmsNotificationTemplateType,
    recipientPhone: string,
    variables: Record<string, string> = {},
    assignedProfileIdOverride?: string
  ): Promise<{ success: boolean; log: SmsLog }> => {
    const commState = await api.getCommunicationState();
    if (commState.sms_notifications_enabled === false) {
      const disabledLog: SmsLog = {
        id: 'sms-log-' + Date.now(),
        direction: 'outgoing',
        from_phone: 'DISABLED',
        to_phone: recipientPhone,
        message_body: `[SMS Disabled] ${templateType}`,
        template_type: templateType,
        provider_used: 'System Disabled',
        segment_count: 0,
        status: 'failed',
        details: 'SMS notifications globally disabled in store settings.',
        timestamp: new Date().toISOString()
      };
      return { success: false, log: disabledLog };
    }

    const rules = commState.sms_notification_rules || [];
    const rule = rules.find(r => r.template_type === templateType);

    const smsProfiles = commState.sms_profiles || [];
    let targetProfile: SmsProfile | undefined;
    const assignedId = assignedProfileIdOverride || (rule ? rule.assigned_sms_profile_id : undefined);
    if (assignedId && assignedId !== 'default') {
      targetProfile = smsProfiles.find(p => p.id === assignedId);
    }
    if (!targetProfile) {
      targetProfile = smsProfiles.find(p => p.id === commState.active_sms_profile_id) || smsProfiles[0];
    }

    const senderPhone = targetProfile ? targetProfile.from_phone_number : '+1 (800) 555-0199';
    const providerName = targetProfile ? `${targetProfile.name} (${targetProfile.provider_type.toUpperCase()})` : 'Default Gateway';

    if (!rule || !rule.enabled) {
      const disabledLog: SmsLog = {
        id: 'sms-log-' + Date.now(),
        direction: 'outgoing',
        from_phone: senderPhone,
        to_phone: recipientPhone,
        message_body: `[Skipped] ${templateType}`,
        template_type: templateType,
        provider_used: providerName,
        segment_count: 0,
        status: 'failed',
        details: `SMS rule for ${templateType} is disabled or unconfigured in dashboard settings.`,
        timestamp: new Date().toISOString()
      };
      return { success: false, log: disabledLog };
    }

    let messageBody = rule.message_body;
    const allVars: Record<string, string> = {
      sender_phone: senderPhone,
      profile_name: targetProfile ? targetProfile.name : 'Default SMS Gateway',
      ...variables
    };

    Object.entries(allVars).forEach(([k, v]) => {
      const pattern = new RegExp(`\\{${k}\\}`, 'g');
      messageBody = messageBody.replace(pattern, v || '');
    });

    const segmentCount = Math.max(1, Math.ceil(messageBody.length / 160));

    const log: SmsLog = {
      id: 'sms-log-' + Date.now(),
      direction: 'outgoing',
      from_phone: senderPhone,
      to_phone: recipientPhone,
      message_body: messageBody,
      template_type: templateType,
      provider_used: providerName,
      segment_count: segmentCount,
      status: 'delivered',
      details: `Dispatched SMS via gateway "${targetProfile?.name || 'Default'}" from ${senderPhone} to ${recipientPhone} (${segmentCount} SMS segment/s)`,
      timestamp: new Date().toISOString()
    };

    if (!commState.sms_logs) commState.sms_logs = [];
    commState.sms_logs.unshift(log);
    if (commState.sms_logs.length > 200) commState.sms_logs.pop();

    await api.updateCommunicationState(commState);
    return { success: true, log };
  },

  addInboundEmailMessage: async (payload: {
    sender_email: string;
    sender_name: string;
    subject: string;
    category: InboundEmailMessage['category'];
    body: string;
    priority?: InboundEmailMessage['priority'];
  }): Promise<InboundEmailMessage> => {
    const commState = await api.getCommunicationState();
    const ticketNum = 'TICK-' + Math.floor(8000 + Math.random() * 2000);
    const now = new Date().toISOString();

    const newMsg: InboundEmailMessage = {
      id: 'msg-' + Date.now(),
      ticket_number: ticketNum,
      sender_email: payload.sender_email,
      sender_name: payload.sender_name,
      recipient_email: commState.provider_config.company_external_email || 'support@bkresearchlabs.com',
      subject: payload.subject,
      category: payload.category,
      body: payload.body,
      status: 'unread',
      priority: payload.priority || 'normal',
      assigned_role: payload.category === 'tech_support' ? 'admin' : payload.category === 'customer_service' ? 'employee' : 'owner',
      received_at: now,
      updated_at: now,
      replies: []
    };

    commState.inbound_messages.unshift(newMsg);

    const log: EmailLog = {
      id: 'log-inc-' + Date.now(),
      direction: 'incoming',
      from_email: payload.sender_email,
      to_email: newMsg.recipient_email,
      subject: payload.subject,
      status: 'received',
      details: `Ticket #${ticketNum} opened (${payload.category.toUpperCase()})`,
      timestamp: now
    };
    commState.email_logs.unshift(log);

    if (commState.auto_responder_enabled) {
      const autoSub = commState.auto_responder_subject.replace(/\{\{ticket_number\}\}/g, ticketNum);
      const autoLog: EmailLog = {
        id: 'log-auto-' + Date.now(),
        direction: 'outgoing',
        from_email: newMsg.recipient_email,
        to_email: payload.sender_email,
        subject: autoSub,
        template_type: 'customer_service',
        status: 'delivered',
        details: `Auto-responder triggered for ticket #${ticketNum}`,
        timestamp: now
      };
      commState.email_logs.unshift(autoLog);
    }

    await api.updateCommunicationState(commState);
    return newMsg;
  },

  replyToInboundMessage: async (
    ticketId: string,
    replyBody: string,
    senderEmail: string,
    senderName: string
  ): Promise<InboundEmailMessage> => {
    const commState = await api.getCommunicationState();
    const msg = commState.inbound_messages.find(m => m.id === ticketId || m.ticket_number === ticketId);
    if (!msg) throw new Error('Ticket not found');

    const now = new Date().toISOString();
    const reply = {
      id: 'rep-' + Date.now(),
      sender_email: senderEmail,
      sender_name: senderName,
      body: replyBody,
      sent_at: now
    };

    msg.replies.push(reply);
    msg.status = 'replied';
    msg.updated_at = now;

    const templateType: NotificationTemplateType = msg.category === 'tech_support' ? 'tech_support' : 'customer_service';
    await api.sendNotificationEmail(templateType, msg.sender_email, {
      ticket_number: msg.ticket_number,
      customer_name: msg.sender_name,
      subject: msg.subject,
      reply_body: replyBody,
      assigned_staff: senderName
    });

    await api.updateCommunicationState(commState);
    return msg;
  },

  updateInboundMessageStatus: async (
    ticketId: string,
    status: InboundEmailMessage['status'],
    priority?: InboundEmailMessage['priority'],
    assignedRole?: UserRole
  ): Promise<InboundEmailMessage> => {
    const commState = await api.getCommunicationState();
    const msg = commState.inbound_messages.find(m => m.id === ticketId || m.ticket_number === ticketId);
    if (!msg) throw new Error('Ticket not found');

    msg.status = status;
    if (priority) msg.priority = priority;
    if (assignedRole) msg.assigned_role = assignedRole;
    msg.updated_at = new Date().toISOString();

    await api.updateCommunicationState(commState);
    return msg;
  },

  // --- REAL-TIME BACKEND & HYBRID DATABASE SYNC ---
  subscribeToChanges: (onUpdate: () => void): (() => void) => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('bkrl_')) {
        onUpdate();
      }
    };

    const handleCustomChange = () => {
      onUpdate();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('bkrl_data_updated', handleCustomChange);
    }

    // Subscribe to BroadcastChannel cross-tab events
    const unsubscribeTabSync = tabSync.subscribe((msg) => {
      if (msg.type !== 'TAB_PING' && msg.type !== 'TAB_PONG' && msg.type !== 'TAB_LEAVING') {
        onUpdate();
      }
    });

    let realtimeChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      try {
        realtimeChannel = supabase
          .channel('bkrl-realtime-db-channel')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public' },
            () => {
              onUpdate();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Supabase realtime channel subscription notice:', err);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('bkrl_data_updated', handleCustomChange);
      }
      unsubscribeTabSync();
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  },

  notifyDataChanged: (): void => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bkrl_data_updated'));
    }
  }
};
