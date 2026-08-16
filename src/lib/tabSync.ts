import { UserProfile, CartItem, SaveForLaterItem, SiteSettings, Order, Product } from '../types';

export type SyncEventType =
  | 'AUTH_CHANGED'
  | 'CART_CHANGED'
  | 'SAVE_FOR_LATER_CHANGED'
  | 'SETTINGS_CHANGED'
  | 'PRODUCTS_CHANGED'
  | 'ORDERS_CHANGED'
  | 'LANGUAGE_CHANGED'
  | 'THEME_CHANGED'
  | 'AGE_GATE_CHANGED'
  | 'TAB_PING'
  | 'TAB_PONG'
  | 'TAB_LEAVING'
  | 'FORCE_RESYNC_REQUEST';

export interface TabSyncMessage<T = any> {
  type: SyncEventType;
  senderTabId: string;
  senderTabTitle?: string;
  senderView?: string;
  timestamp: number;
  payload: T;
  summary?: string;
}

export interface ConnectedTabInfo {
  tabId: string;
  tabTitle: string;
  currentView?: string;
  userRole?: string;
  lastHeartbeat: number;
  isCurrentTab: boolean;
}

export interface SyncActivityLog {
  id: string;
  type: SyncEventType;
  senderTabId: string;
  senderTabTitle: string;
  timestamp: number;
  summary: string;
  isSelf: boolean;
}

const CHANNEL_NAME = 'bkrl_global_tab_sync';
const FALLBACK_STORAGE_KEY = 'bkrl_tab_sync_event_fallback';

// Generate a random stable Tab ID for the lifetime of this browser tab
export const CURRENT_TAB_ID = typeof window !== 'undefined'
  ? `tab-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36).slice(-4)}`
  : 'server-tab';

class GlobalTabSyncManager {
  private channel: BroadcastChannel | null = null;
  private isBroadcastChannelSupported = false;
  private listeners = new Set<(message: TabSyncMessage) => void>();
  private tabPresenceListeners = new Set<(tabs: ConnectedTabInfo[]) => void>();
  private activityListeners = new Set<(logs: SyncActivityLog[]) => void>();
  
  private knownTabs = new Map<string, ConnectedTabInfo>();
  private activityLogs: SyncActivityLog[] = [];
  private heartbeatInterval: any = null;
  private purgeInterval: any = null;
  private isInitialized = false;

  private currentView = 'home';
  private currentUserRole = 'customer';

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Check BroadcastChannel support
    if ('BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.isBroadcastChannelSupported = true;
        this.channel.onmessage = (event: MessageEvent<TabSyncMessage>) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization failed, falling back to localStorage event:', err);
        this.isBroadcastChannelSupported = false;
      }
    }

    // Always listen to localStorage storage events as fallback/reinforcement
    window.addEventListener('storage', this.handleStorageEvent);

    // Broadcast tab leaving on close/unload
    window.addEventListener('beforeunload', () => {
      this.broadcast('TAB_LEAVING', { tabId: CURRENT_TAB_ID }, 'Tab Closed');
    });

    // Register this tab
    this.registerSelf();

    // Start discovery and heartbeat
    this.startHeartbeat();

    // Announce arrival to existing tabs
    setTimeout(() => {
      this.broadcast('TAB_PING', {
        tabId: CURRENT_TAB_ID,
        tabTitle: document.title || 'BK Research Labs',
        view: this.currentView,
        role: this.currentUserRole
      }, 'Tab connected to sync mesh');
    }, 100);
  }

  public updateTabContext(view: string, userRole?: string) {
    this.currentView = view;
    if (userRole) this.currentUserRole = userRole;
    this.registerSelf();
  }

  private registerSelf() {
    this.knownTabs.set(CURRENT_TAB_ID, {
      tabId: CURRENT_TAB_ID,
      tabTitle: (typeof document !== 'undefined' ? document.title : 'BKRL Tab') || 'BKRL Tab',
      currentView: this.currentView,
      userRole: this.currentUserRole,
      lastHeartbeat: Date.now(),
      isCurrentTab: true
    });
    this.notifyPresenceChange();
  }

  private startHeartbeat() {
    if (typeof window === 'undefined') return;

    // Ping every 10 seconds
    this.heartbeatInterval = setInterval(() => {
      this.registerSelf();
      this.broadcast('TAB_PING', {
        tabId: CURRENT_TAB_ID,
        tabTitle: document.title || 'BK Research Labs',
        view: this.currentView,
        role: this.currentUserRole
      });
    }, 10000);

    // Purge dead tabs every 5 seconds (tabs older than 25 seconds)
    this.purgeInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, tab] of this.knownTabs.entries()) {
        if (id !== CURRENT_TAB_ID && now - tab.lastHeartbeat > 25000) {
          this.knownTabs.delete(id);
          changed = true;
        }
      }
      if (changed) {
        this.notifyPresenceChange();
      }
    }, 5000);
  }

  private handleStorageEvent = (e: StorageEvent) => {
    if (e.key === FALLBACK_STORAGE_KEY && e.newValue) {
      try {
        const msg: TabSyncMessage = JSON.parse(e.newValue);
        if (msg && msg.senderTabId !== CURRENT_TAB_ID) {
          this.handleIncomingMessage(msg);
        }
      } catch (err) {
        // ignore malformed payloads
      }
    }
  };

  private handleIncomingMessage(msg: TabSyncMessage) {
    if (!msg || typeof msg !== 'object') return;

    // Record incoming presence
    if (msg.type === 'TAB_PING') {
      const payload = msg.payload || {};
      this.knownTabs.set(msg.senderTabId, {
        tabId: msg.senderTabId,
        tabTitle: payload.tabTitle || msg.senderTabTitle || 'BKRL Tab',
        currentView: payload.view || msg.senderView,
        userRole: payload.role,
        lastHeartbeat: Date.now(),
        isCurrentTab: false
      });
      this.notifyPresenceChange();

      // Reply with PONG so new tab learns about us
      this.broadcast('TAB_PONG', {
        tabId: CURRENT_TAB_ID,
        tabTitle: document.title || 'BK Research Labs',
        view: this.currentView,
        role: this.currentUserRole
      });
      return;
    }

    if (msg.type === 'TAB_PONG') {
      const payload = msg.payload || {};
      this.knownTabs.set(msg.senderTabId, {
        tabId: msg.senderTabId,
        tabTitle: payload.tabTitle || msg.senderTabTitle || 'BKRL Tab',
        currentView: payload.view || msg.senderView,
        userRole: payload.role,
        lastHeartbeat: Date.now(),
        isCurrentTab: false
      });
      this.notifyPresenceChange();
      return;
    }

    if (msg.type === 'TAB_LEAVING') {
      this.knownTabs.delete(msg.senderTabId);
      this.notifyPresenceChange();
      this.addActivityLog(msg, false);
      return;
    }

    // Update heartbeat of sender tab
    const existing = this.knownTabs.get(msg.senderTabId);
    if (existing) {
      existing.lastHeartbeat = Date.now();
      if (msg.senderView) existing.currentView = msg.senderView;
      if (msg.senderTabTitle) existing.tabTitle = msg.senderTabTitle;
    } else {
      this.knownTabs.set(msg.senderTabId, {
        tabId: msg.senderTabId,
        tabTitle: msg.senderTabTitle || 'BKRL Tab',
        currentView: msg.senderView,
        lastHeartbeat: Date.now(),
        isCurrentTab: false
      });
      this.notifyPresenceChange();
    }

    // Add to activity logs
    this.addActivityLog(msg, false);

    // Notify listeners
    this.listeners.forEach(fn => {
      try {
        fn(msg);
      } catch (err) {
        console.error('Error in TabSync listener:', err);
      }
    });
  }

  private addActivityLog(msg: TabSyncMessage, isSelf: boolean) {
    if (msg.type === 'TAB_PING' || msg.type === 'TAB_PONG') return; // skip noisy heartbeats

    const log: SyncActivityLog = {
      id: 'synclog-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      type: msg.type,
      senderTabId: msg.senderTabId,
      senderTabTitle: msg.senderTabTitle || (isSelf ? 'Current Tab' : 'Peer Tab'),
      timestamp: msg.timestamp || Date.now(),
      summary: msg.summary || `${msg.type} synced`,
      isSelf
    };

    this.activityLogs = [log, ...this.activityLogs].slice(0, 40);
    this.activityListeners.forEach(fn => {
      try {
        fn(this.activityLogs);
      } catch (e) {
        // ignore
      }
    });
  }

  private notifyPresenceChange() {
    const tabsList = Array.from(this.knownTabs.values());
    this.tabPresenceListeners.forEach(fn => {
      try {
        fn(tabsList);
      } catch (e) {
        // ignore
      }
    });
  }

  /**
   * Broadcast a message to all open tabs
   */
  public broadcast<T = any>(type: SyncEventType, payload: T, summary?: string): TabSyncMessage<T> {
    const message: TabSyncMessage<T> = {
      type,
      senderTabId: CURRENT_TAB_ID,
      senderTabTitle: typeof document !== 'undefined' ? document.title : 'BKRL Tab',
      senderView: this.currentView,
      timestamp: Date.now(),
      payload,
      summary
    };

    // 1. Send via BroadcastChannel
    if (this.channel && this.isBroadcastChannelSupported) {
      try {
        this.channel.postMessage(message);
      } catch (err) {
        console.warn('BroadcastChannel postMessage error:', err);
      }
    }

    // 2. Also write to localStorage fallback for non-BroadcastChannel environments
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(message));
      } catch (err) {
        // ignore quota/security errors
      }
    }

    // Log to local activity log
    this.addActivityLog(message, true);

    return message;
  }

  /**
   * Subscribe to incoming broadcast messages from other tabs
   */
  public subscribe(callback: (message: TabSyncMessage) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Subscribe to tab presence updates (active open tabs count and list)
   */
  public subscribePresence(callback: (tabs: ConnectedTabInfo[]) => void): () => void {
    this.tabPresenceListeners.add(callback);
    callback(Array.from(this.knownTabs.values()));
    return () => {
      this.tabPresenceListeners.delete(callback);
    };
  }

  /**
   * Subscribe to real-time sync activity logs
   */
  public subscribeActivity(callback: (logs: SyncActivityLog[]) => void): () => void {
    this.activityListeners.add(callback);
    callback(this.activityLogs);
    return () => {
      this.activityListeners.delete(callback);
    };
  }

  public getConnectedTabs(): ConnectedTabInfo[] {
    return Array.from(this.knownTabs.values());
  }

  public getActiveTabsCount(): number {
    return Math.max(1, this.knownTabs.size);
  }

  public getActivityLogs(): SyncActivityLog[] {
    return this.activityLogs;
  }

  public isSupported(): boolean {
    return this.isBroadcastChannelSupported;
  }

  public destroy() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    if (this.purgeInterval) clearInterval(this.purgeInterval);
    if (this.channel) {
      try {
        this.channel.close();
      } catch (e) {
        // ignore
      }
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
  }
}

// Global Singleton Instance
export const tabSync = new GlobalTabSyncManager();

// ==========================================
// CONVENIENCE BROADCAST HELPERS
// ==========================================

export function syncAuthAcrossTabs(
  user: UserProfile | null,
  action: 'login' | 'logout' | 'role_switch' | 'update',
  detailSummary?: string
) {
  const summary = detailSummary || (
    user
      ? `Session authenticated as ${user.role.toUpperCase()} (${user.first_name || user.email})`
      : 'Session signed out across tabs'
  );
  return tabSync.broadcast('AUTH_CHANGED', { user, action }, summary);
}

export function syncCartAcrossTabs(
  cart: CartItem[],
  action: 'add' | 'update' | 'remove' | 'clear',
  productName?: string,
  quantity?: number
) {
  let summary = `Cart updated (${cart.length} unique items)`;
  if (action === 'add' && productName) {
    summary = `Added ${quantity || 1}x ${productName} to cart`;
  } else if (action === 'remove' && productName) {
    summary = `Removed ${productName} from cart`;
  } else if (action === 'clear') {
    summary = `Cart cleared after checkout`;
  }
  return tabSync.broadcast('CART_CHANGED', { cart, action }, summary);
}

export function syncSaveForLaterAcrossTabs(
  items: SaveForLaterItem[],
  action: 'add' | 'remove',
  productName?: string
) {
  const summary = action === 'add'
    ? `Saved ${productName || 'compound'} for later`
    : `Removed item from Saved for Later`;
  return tabSync.broadcast('SAVE_FOR_LATER_CHANGED', { items, action }, summary);
}

export function syncSettingsAcrossTabs(settings: SiteSettings, summary = 'Global site configuration updated') {
  return tabSync.broadcast('SETTINGS_CHANGED', { settings }, summary);
}

export function syncProductsAcrossTabs(products?: Product[], summary = 'Catalog inventory & pricing synced') {
  return tabSync.broadcast('PRODUCTS_CHANGED', { products }, summary);
}

export function syncOrdersAcrossTabs(orders?: Order[], newOrder?: Order) {
  const summary = newOrder
    ? `New Order Placed: #${newOrder.order_number} ($${newOrder.total.toFixed(2)})`
    : 'Orders queue updated';
  return tabSync.broadcast('ORDERS_CHANGED', { orders, newOrder }, summary);
}

export function syncLanguageAcrossTabs(language: string) {
  return tabSync.broadcast('LANGUAGE_CHANGED', { language }, `Locale switched to ${language.toUpperCase()}`);
}

export function syncThemeAcrossTabs(themeId: string) {
  return tabSync.broadcast('THEME_CHANGED', { themeId }, `Dashboard theme updated to ${themeId}`);
}

export function syncAgeGateAcrossTabs(verified: boolean) {
  return tabSync.broadcast('AGE_GATE_CHANGED', { verified }, `Age verification verified: ${verified}`);
}

export function requestGlobalResync() {
  return tabSync.broadcast('FORCE_RESYNC_REQUEST', {}, 'Full multi-tab state resynchronization requested');
}
