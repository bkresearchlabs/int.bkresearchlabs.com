import React from 'react';
import { UserRole } from '../types';

export type AppView =
  | 'home'
  | 'shop'
  | 'save-for-later'
  | 'customer-portal'
  | 'admin'
  | 'checkout'
  | 'custom-page'
  | 'guide';

export interface AppNavigationState {
  view?: AppView;
  tab?: string;
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
  productId?: string;
  orderId?: string;
  deviceMode?: string;
  lang?: string;
  role?: string;
}

/**
 * Returns the default dashboard URL for a given role or guest.
 */
export function getRoleDefaultDashboardUrl(role?: UserRole | null): string {
  if (!role) {
    return '?view=home';
  }
  switch (role) {
    case 'owner':
      return '?view=admin&tab=overview';
    case 'admin':
      return '?view=admin&tab=overview';
    case 'security_admin':
      return '?view=admin&tab=security';
    case 'employee':
      return '?view=admin&tab=orders';
    case 'customer':
      return '?view=customer-portal&tab=overview';
    default:
      return '?view=home';
  }
}

/**
 * Returns the human-readable dashboard label for a given role.
 */
export function getRoleDashboardLabel(role?: UserRole | null): { title: string; subtitle: string; icon: string } {
  if (!role) {
    return {
      title: 'Store Dashboard',
      subtitle: 'Browse Catalog & Orders',
      icon: '🏪'
    };
  }
  switch (role) {
    case 'owner':
      return {
        title: 'Executive Owner Portal',
        subtitle: 'Full System Control & Financial Oversight',
        icon: '👑'
      };
    case 'admin':
      return {
        title: 'Admin Control Center',
        subtitle: 'Catalog, System & Inventory Hub',
        icon: '⚡'
      };
    case 'security_admin':
      return {
        title: 'SecOps Dashboard',
        subtitle: 'Security Telemetry, WAF & Audit Logs',
        icon: '🛡️'
      };
    case 'employee':
      return {
        title: 'Fulfillment Station',
        subtitle: 'Orders, Inventory & Communication',
        icon: '📦'
      };
    case 'customer':
      return {
        title: 'Customer Portal',
        subtitle: 'Order History, COAs & Saved Compounds',
        icon: '🔬'
      };
    default:
      return {
        title: 'Dashboard',
        subtitle: 'Member Portal',
        icon: '📊'
      };
  }
}

/**
 * Builds a clean query URL string for app navigation.
 */
export function buildAppUrl(params: AppNavigationState): string {
  const searchParams = new URLSearchParams();

  if (params.view && params.view !== 'home') {
    searchParams.set('view', params.view);
  } else if (params.view === 'home') {
    searchParams.set('view', 'home');
  }

  if (params.tab) {
    searchParams.set('tab', params.tab);
  }
  if (params.category) {
    searchParams.set('category', params.category);
  }
  if (params.search) {
    searchParams.set('search', params.search);
  }
  if (params.sort && params.sort !== 'featured') {
    searchParams.set('sort', params.sort);
  }
  if (params.page) {
    searchParams.set('page', params.page);
  }
  if (params.productId) {
    searchParams.set('product', params.productId);
  }
  if (params.orderId) {
    searchParams.set('order', params.orderId);
  }
  if (params.deviceMode && params.deviceMode !== 'web') {
    searchParams.set('device', params.deviceMode);
  }
  if (params.lang && params.lang !== 'en') {
    searchParams.set('lang', params.lang);
  }
  if (params.role) {
    searchParams.set('role', params.role);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '/';
}

/**
 * Parses query parameters from window.location.search or custom search string.
 */
export function parseAppUrl(searchString?: string): AppNavigationState {
  const search = searchString ?? (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(search);

  const rawView = params.get('view');
  let view: AppView | undefined = undefined;
  if (
    rawView === 'home' ||
    rawView === 'shop' ||
    rawView === 'save-for-later' ||
    rawView === 'customer-portal' ||
    rawView === 'admin' ||
    rawView === 'checkout' ||
    rawView === 'custom-page' ||
    rawView === 'guide'
  ) {
    view = rawView;
  }

  return {
    view,
    tab: params.get('tab') || undefined,
    category: params.get('category') || undefined,
    search: params.get('search') || undefined,
    sort: params.get('sort') || undefined,
    page: params.get('page') || undefined,
    productId: params.get('product') || undefined,
    orderId: params.get('order') || undefined,
    deviceMode: params.get('device') || undefined,
    lang: params.get('lang') || undefined,
    role: params.get('role') || undefined,
  };
}

/**
 * Smart Link click handler that checks for Ctrl/Cmd modifier keys.
 * If user is holding Ctrl (Windows/Linux) or Cmd (macOS) or clicking middle mouse button,
 * lets browser handle native tab opening.
 * Otherwise, prevents default navigation, updates browser history, and triggers in-app state handler.
 */
export function handleSmartLinkClick(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  targetUrl: string,
  onNavigate: () => void
): void {
  // Check if modifier key is pressed or if middle click (button 1)
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
    // Native browser behavior will open in new tab/window. Do not preventDefault!
    return;
  }

  // Left click without modifier keys -> handle client-side SPA navigation
  e.preventDefault();
  try {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', targetUrl);
    }
  } catch (err) {
    // Non-blocking history push fallback
  }
  onNavigate();
}

/**
 * Explicitly opens a target feature or URL in a new browser tab.
 */
export function openInNewTab(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
