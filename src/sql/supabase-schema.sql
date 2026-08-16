-- ====================================================================
-- BK RESEARCH LABS - FULL SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
CREATE TYPE user_role AS ENUM ('customer', 'employee', 'owner', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'authorized', 'refunded', 'failed');
CREATE TYPE fulfillment_status AS ENUM ('unfulfilled', 'processing', 'shipped', 'delivered', 'returned');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCT CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  inventory_quantity INT NOT NULL DEFAULT 0,
  inventory_tracking_enabled BOOLEAN NOT NULL DEFAULT true,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'published',
  featured BOOLEAN NOT NULL DEFAULT false,
  requires_age_verification BOOLEAN NOT NULL DEFAULT true,
  requires_acknowledgment BOOLEAN NOT NULL DEFAULT true,
  acknowledgment_text TEXT,
  geographic_restrictions TEXT[],
  shipping_enabled BOOLEAN NOT NULL DEFAULT true,
  disclaimer TEXT,
  images TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PRODUCT FILES TABLE (CoA PDFs, MSDS, Manuals)
CREATE TABLE IF NOT EXISTS public.product_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size TEXT,
  description TEXT,
  customer_accessible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SAVE FOR LATER TABLE
CREATE TABLE IF NOT EXISTS public.save_for_later (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_product_save UNIQUE (user_id, product_id)
);

-- 8. CARTS & CART ITEMS
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  fulfillment_status fulfillment_status NOT NULL DEFAULT 'unfulfilled',
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_reference TEXT,
  tracking_number TEXT,
  carrier TEXT,
  acknowledgments_accepted BOOLEAN NOT NULL DEFAULT false,
  age_verified_at_checkout BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  image_snapshot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SITE SETTINGS & CONTENT
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  site_name TEXT NOT NULL,
  tagline TEXT,
  primary_color TEXT DEFAULT '#002b29',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  age_gate_enabled BOOLEAN DEFAULT true,
  age_gate_min_age INT DEFAULT 21,
  age_gate_title TEXT,
  age_gate_message TEXT,
  currency TEXT DEFAULT 'USD',
  tax_rate_percentage NUMERIC(5,2) DEFAULT 6.50,
  free_shipping_threshold NUMERIC(10,2) DEFAULT 150.00,
  standard_shipping_fee NUMERIC(10,2) DEFAULT 12.50,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DOWNLOADABLE CONTENT & APK MANAGEMENT TABLE
CREATE TABLE IF NOT EXISTS public.downloadable_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size TEXT NOT NULL,
  version TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'app',
  platform TEXT NOT NULL DEFAULT 'android',
  description TEXT,
  download_url TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true,
  requires_auth BOOLEAN NOT NULL DEFAULT false,
  download_count INT NOT NULL DEFAULT 0,
  release_notes TEXT,
  md5_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES public.profiles(id),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. PAYMENT GATEWAYS TABLE
CREATE TABLE IF NOT EXISTS public.payment_gateways (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'CreditCard',
  enabled BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  display_order INT NOT NULL DEFAULT 1,
  test_mode BOOLEAN NOT NULL DEFAULT true,
  badge_text TEXT,
  authorize_net JSONB,
  stripe JSONB,
  paypal JSONB,
  bank_wire JSONB,
  crypto JSONB,
  apple_pay JSONB,
  custom_fields JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. PURCHASE ORDERS & PURCHASE ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expected_delivery_date TIMESTAMPTZ,
  received_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id TEXT PRIMARY KEY,
  po_id TEXT NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(10,2) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL
);

-- 15. USER ASSET GRANTS TABLE
CREATE TABLE IF NOT EXISTS public.user_asset_grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  asset_id UUID REFERENCES public.downloadable_content(id) ON DELETE CASCADE,
  asset_title TEXT NOT NULL,
  filename TEXT NOT NULL,
  granted_by TEXT NOT NULL DEFAULT 'admin',
  granted_by_detail TEXT,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  download_count INT NOT NULL DEFAULT 0,
  max_downloads INT,
  last_downloaded_at TIMESTAMPTZ
);

-- 16. ASSET EMAIL DISPATCH LOGS
CREATE TABLE IF NOT EXISTS public.asset_email_logs (
  id TEXT PRIMARY KEY,
  asset_id UUID REFERENCES public.downloadable_content(id) ON DELETE CASCADE,
  asset_title TEXT NOT NULL,
  filename TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  sent_by_user_id TEXT,
  sent_by_email TEXT,
  trigger_source TEXT NOT NULL DEFAULT 'user_request',
  status TEXT NOT NULL DEFAULT 'sent',
  details TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. COMMUNICATION PROFILES & NOTIFICATIONS (EMAIL & SMS)
CREATE TABLE IF NOT EXISTS public.email_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  company_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  reply_to_email TEXT,
  provider_type TEXT NOT NULL DEFAULT 'gmail',
  smtp_host TEXT,
  smtp_port INT,
  smtp_user TEXT,
  smtp_pass TEXT,
  smtp_security TEXT DEFAULT 'tls',
  api_key TEXT,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'connected',
  last_tested_at TIMESTAMPTZ,
  last_error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_notification_rules (
  id TEXT PRIMARY KEY,
  template_type TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  trigger_event TEXT NOT NULL,
  recipient_target TEXT NOT NULL DEFAULT 'customer',
  custom_recipient_email TEXT,
  assigned_profile_id TEXT,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  available_variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inbound_email_messages (
  id TEXT PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'customer_service',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  priority TEXT NOT NULL DEFAULT 'normal',
  assigned_role user_role,
  replies JSONB DEFAULT '[]'::jsonb,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
  id TEXT PRIMARY KEY,
  direction TEXT NOT NULL DEFAULT 'outgoing',
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT,
  status TEXT NOT NULL DEFAULT 'delivered',
  details TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sms_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  provider_type TEXT NOT NULL DEFAULT 'twilio',
  account_sid TEXT,
  auth_token TEXT,
  from_phone_number TEXT NOT NULL,
  messaging_service_sid TEXT,
  api_key TEXT,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'connected',
  last_tested_at TIMESTAMPTZ,
  last_error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sms_notification_rules (
  id TEXT PRIMARY KEY,
  template_type TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  trigger_event TEXT NOT NULL,
  recipient_target TEXT NOT NULL DEFAULT 'customer',
  custom_recipient_phone TEXT,
  assigned_sms_profile_id TEXT,
  message_body TEXT NOT NULL,
  available_variables TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sms_logs (
  id TEXT PRIMARY KEY,
  direction TEXT NOT NULL DEFAULT 'outgoing',
  from_phone TEXT NOT NULL,
  to_phone TEXT NOT NULL,
  message_body TEXT NOT NULL,
  template_type TEXT,
  provider_used TEXT NOT NULL,
  segment_count INT NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'delivered',
  details TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.save_for_later ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin or staff
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_user_id = auth.uid() AND role IN ('admin', 'owner', 'employee')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products: Anyone can read published products, only admins can modify
CREATE POLICY "Public products viewable by anyone" ON public.products
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins full management on products" ON public.products
  FOR ALL USING (public.is_admin());

-- Save for Later: Users manage their own saved items
CREATE POLICY "Users read own save_for_later" ON public.save_for_later
  FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Users insert own save_for_later" ON public.save_for_later
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users delete own save_for_later" ON public.save_for_later
  FOR DELETE USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()));

-- Orders: Users read own orders, Admins manage all
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()) OR public.is_admin());

CREATE POLICY "Users create own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins manage all orders" ON public.orders
  FOR ALL USING (public.is_admin());

-- ====================================================================
-- INITIAL SEED DATA
-- ====================================================================

INSERT INTO public.site_settings (
  id, site_name, tagline, primary_color, contact_email, contact_phone,
  address, age_gate_enabled, age_gate_min_age, age_gate_title, age_gate_message
) VALUES (
  'main',
  'BK Research Labs',
  'Precision Analytical Compounds & Research Materials',
  '#002b29',
  'support@bkresearchlabs.com',
  '+1 (800) 555-BKRL',
  '100 Research Parkway, Suite 400, Cambridge, MA 02142',
  true,
  21,
  'Welcome to BK Research Labs',
  'By entering this laboratory store, you confirm that you are at least 21 years of age.'
) ON CONFLICT (id) DO NOTHING;
