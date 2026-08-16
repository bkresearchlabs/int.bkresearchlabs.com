import React, { useState, useEffect } from 'react';
import { Database, Download, Copy, Check, ShieldCheck, Server, Key, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export const AdminDatabaseExport: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'needs_tables'>('checking');
  const [activeProject, setActiveProject] = useState({
    name: 'BK Web App',
    id: 'xqqjaylwikpkkngtprno',
    url: 'https://xqqjaylwikpkkngtprno.supabase.co',
    key: 'sb_publishable_UWuWJKCL82N07HbjtZNG6Q_i2WRUtIU'
  });

  useEffect(() => {
    async function checkSupabaseTables() {
      if (!isSupabaseConfigured || !supabase) {
        setConnectionStatus('needs_tables');
        return;
      }
      try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        if (!error) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('needs_tables');
        }
      } catch (err) {
        setConnectionStatus('needs_tables');
      }
    }
    checkSupabaseTables();
  }, []);

  const sqlSchema = `-- ====================================================================
-- BK RESEARCH LABS - FULL SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- Project: BK Web App (Project ID: xqqjaylwikpkkngtprno)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'authorized', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE fulfillment_status AS ENUM ('unfulfilled', 'processing', 'shipped', 'delivered', 'returned');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE po_status AS ENUM ('draft', 'ordered', 'partially_received', 'received', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
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

-- 4. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  inventory_quantity INT DEFAULT 0,
  inventory_tracking_enabled BOOLEAN DEFAULT true,
  category_id TEXT REFERENCES public.product_categories(id) ON DELETE SET NULL,
  category_name TEXT,
  status TEXT DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  requires_age_verification BOOLEAN DEFAULT true,
  requires_acknowledgment BOOLEAN DEFAULT true,
  acknowledgment_text TEXT DEFAULT 'I acknowledge that this chemical compound is purchased strictly for research purposes.',
  shipping_enabled BOOLEAN DEFAULT true,
  disclaimer TEXT DEFAULT 'For research purposes only.',
  images JSONB DEFAULT '[]'::jsonb,
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SAVE FOR LATER
CREATE TABLE IF NOT EXISTS public.save_for_later (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_product_save UNIQUE (user_id, product_id)
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'paid',
  fulfillment_status fulfillment_status DEFAULT 'unfulfilled',
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_amount NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT DEFAULT 'credit_card',
  payment_reference TEXT,
  tracking_number TEXT,
  acknowledgments_accepted BOOLEAN DEFAULT true,
  age_verified_at_checkout BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  sku_snapshot TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10,2) NOT NULL,
  image_snapshot TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PURCHASE ORDERS
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id TEXT PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  supplier_name TEXT NOT NULL,
  supplier_email TEXT,
  status po_status DEFAULT 'ordered',
  total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  expected_delivery_date TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. PURCHASE ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  po_id TEXT REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  product_id TEXT,
  product_name TEXT NOT NULL,
  sku TEXT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_cost NUMERIC(10,2) NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DISCOUNT CODES
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'percentage',
  value NUMERIC(10,2) NOT NULL,
  min_subtotal NUMERIC(10,2) DEFAULT 0,
  usage_limit INT DEFAULT 100,
  usage_count INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  admin_user_id TEXT,
  admin_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. SITE SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT DEFAULT 'BK Research Labs',
  support_email TEXT DEFAULT 'compliance@bkresearchlabs.com',
  currency TEXT DEFAULT 'USD',
  tax_rate_percentage NUMERIC(5,2) DEFAULT 8.25,
  standard_shipping_fee NUMERIC(10,2) DEFAULT 15.00,
  free_shipping_threshold NUMERIC(10,2) DEFAULT 200.00,
  min_age_requirement INT DEFAULT 21,
  enable_age_gate BOOLEAN DEFAULT true,
  coa_publicly_visible BOOLEAN DEFAULT true,
  disclaimer_text TEXT DEFAULT 'All chemicals and compounds supplied by BK Research Labs are intended strictly for laboratory and analytical research purposes.',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. HOMEPAGE CONTENT
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_title TEXT DEFAULT 'High-Purity Analytical Compounds for Scientific Excellence',
  hero_subtitle TEXT DEFAULT 'HPLC-verified research compounds with lot-specific Certificates of Analysis.',
  hero_badge TEXT DEFAULT 'ISO 9001:2015 Certified Compound Supply',
  hero_cta_text TEXT DEFAULT 'Explore Compound Catalog',
  banner_announcement TEXT DEFAULT '⚡ Fast Priority 1-3 Day Shipping on Orders Placed Before 2:00 PM EST',
  featured_category_ids JSONB DEFAULT '["cat-compounds"]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.save_for_later ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public categories read" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public site settings read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public homepage read" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Public discount read" ON public.discount_codes FOR SELECT USING (true);

CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow anon insert order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select order_items" ON public.order_items FOR SELECT USING (true);

CREATE POLICY "Allow anon manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow anon manage categories" ON public.product_categories FOR ALL USING (true);
CREATE POLICY "Allow anon manage POs" ON public.purchase_orders FOR ALL USING (true);
CREATE POLICY "Allow anon manage PO items" ON public.purchase_order_items FOR ALL USING (true);
CREATE POLICY "Allow anon manage audit_logs" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Allow anon manage settings" ON public.site_settings FOR ALL USING (true);
CREATE POLICY "Allow anon manage homepage" ON public.homepage_content FOR ALL USING (true);

-- 16. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('coas-and-documents', 'coas-and-documents', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access to COAs" ON storage.objects 
FOR SELECT USING (bucket_id = 'coas-and-documents');

CREATE POLICY "Public access to Product Images" ON storage.objects 
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow upload to storage" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id IN ('coas-and-documents', 'product-images'));

-- 17. SEED DATA BOOTSTRAP
INSERT INTO public.product_categories (id, name, slug, description, image, sort_order, active)
VALUES 
  ('cat-compounds', 'Analytical Compounds & Reference Standards', 'analytical-compounds', 'High-purity research compounds and reference standards.', 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800', 1, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, sku, name, slug, description, short_description, price, compare_at_price, currency, inventory_quantity, inventory_tracking_enabled, category_id, category_name, status, featured, requires_age_verification, requires_acknowledgment, acknowledgment_text, shipping_enabled, disclaimer, images, files)
VALUES
  ('prod-bpc157-10mg', 'BK-BPC-10MG', 'BPC-157 (10mg) Analytical Grade', 'bpc-157-10mg-analytical-grade', 'BPC-157 pentadecapeptide lyophilized powder produced under strict cGMP protocols. Mass spectrometry verified >99.2% purity.', 'HPLC-verified synthetic compound reference standard.', 49.99, 65.00, 'USD', 120, true, 'cat-compounds', 'Analytical Compounds & Reference Standards', 'published', true, true, true, 'I acknowledge that this chemical compound is purchased strictly for research purposes.', true, 'For research purposes only.', '["https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800"]'::jsonb, '[{"id":"coa-1","name":"BPC-157 Batch #2026-A1 COA.pdf","url":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf","type":"pdf","size_mb":1.2}]'::jsonb),
  ('prod-tb500-10mg', 'BK-TB500-10MG', 'TB-500 Thymosin Beta-4 (10mg)', 'tb-500-thymosin-beta-4-10mg', 'Synthetic Thymosin Beta-4 sequence analog for tissue repair modeling and biological cell assay research.', 'Thymosin Beta-4 biological reference compound.', 59.99, 75.00, 'USD', 85, true, 'cat-compounds', 'Analytical Compounds & Reference Standards', 'published', true, true, true, 'I acknowledge that this chemical compound is purchased strictly for research purposes.', true, 'For research purposes only.', '["https://images.unsplash.com/photo-1579165466741-7f35e4755660?auto=format&fit=crop&q=80&w=800"]'::jsonb, '[{"id":"coa-2","name":"TB-500 Batch #2026-B2 COA.pdf","url":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf","type":"pdf","size_mb":1.4}]'::jsonb),
  ('prod-glp3rt-10mg', 'BK-GLP3RT-10MG', 'Retatrutide GLP-3RT (10mg) Dual-Target Compound', 'retatrutide-glp3rt-10mg', 'Multi-receptor agonist peptide compound for metabolic signaling pathway investigation.', 'Triple-agonist metabolic study compound.', 89.99, 110.00, 'USD', 40, true, 'cat-compounds', 'Analytical Compounds & Reference Standards', 'published', true, true, true, 'I acknowledge that this chemical compound is purchased strictly for research purposes.', true, 'For research purposes only.', '["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800"]'::jsonb, '[{"id":"coa-3","name":"Retatrutide Batch #2026-C3 COA.pdf","url":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf","type":"pdf","size_mb":1.8}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, name, support_email, currency, tax_rate_percentage, standard_shipping_fee, free_shipping_threshold, min_age_requirement, enable_age_gate, coa_publicly_visible)
VALUES ('main', 'BK Research Labs', 'compliance@bkresearchlabs.com', 'USD', 8.25, 15.00, 200.00, 21, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.homepage_content (id, hero_title, hero_subtitle, hero_badge, hero_cta_text, banner_announcement)
VALUES ('main', 'High-Purity Analytical Compounds for Scientific Excellence', 'HPLC-verified research compounds with lot-specific Certificates of Analysis.', 'ISO 9001:2015 Certified Compound Supply', 'Explore Compound Catalog', '⚡ Fast Priority 1-3 Day Shipping on Orders Placed Before 2:00 PM EST')
ON CONFLICT (id) DO NOTHING;
`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sqlSchema).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bk-research-labs-supabase-schema.sql';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Active Supabase Connection Card */}
      <div className="bg-[#031c19] border border-emerald-900/50 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-serif font-bold text-white">
              Connected Supabase Backend: <span className="text-emerald-400 font-mono">{activeProject.name}</span>
            </h3>
            {connectionStatus === 'connected' ? (
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold text-[10px] rounded-full uppercase flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> Database Live & Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-950 border border-amber-800 text-amber-300 font-bold text-[10px] rounded-full uppercase flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400" /> Migration Pending (Execute SQL below)
              </span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300 font-mono pt-1">
            <div><strong className="text-slate-400">Project ID:</strong> {activeProject.id}</div>
            <div><strong className="text-slate-400">API Endpoint:</strong> {activeProject.url}</div>
          </div>
        </div>

        <a
          href={`https://supabase.com/dashboard/project/${activeProject.id}/sql/new`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all"
        >
          <span>Open Supabase SQL Editor</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* SQL Migration Generator Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900">Supabase SQL Migration Script</h2>
          <p className="text-xs text-slate-500 mt-1">
            Execute this complete migration script in your Supabase SQL Editor to instantly provision all 12+ tables, relationships, storage buckets, RLS security policies, and seed data.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Migration SQL!' : 'Copy SQL Script'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download .sql File</span>
          </button>
        </div>
      </div>

      {/* SQL Viewer */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto shadow-2xl space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-3 border-b border-slate-800 font-sans">
          <span className="flex items-center gap-1.5 font-bold text-slate-200">
            <Database className="w-4 h-4 text-emerald-400" /> bk-research-labs-supabase-schema.sql
          </span>
          <span>PostgreSQL 15+ / Supabase RLS & Storage Compatible</span>
        </div>
        <pre className="whitespace-pre leading-relaxed">{sqlSchema}</pre>
      </div>
    </div>
  );
};
