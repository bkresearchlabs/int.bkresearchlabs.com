import React, { useState } from 'react';
import { HomepageContent, SiteSettings, ProductCategory } from '../../types';
import { SingleImageEditor } from './SingleImageEditor';
import { VisualSpacingEditor } from './VisualSpacingEditor';
import { AdminPopupEditor } from './AdminPopupEditor';
import { 
  Save, FileText, Image as ImageIcon, Sparkles, Shield, 
  Award, Grid, Check, RefreshCw, Type, Megaphone, Sliders, Box, Layout, Zap, Layers
} from 'lucide-react';

interface AdminContentProps {
  homepage: HomepageContent;
  settings: SiteSettings;
  categories: ProductCategory[];
  onSaveHomepage: (content: Partial<HomepageContent>) => Promise<void> | void;
  onSaveSettings: (settings: Partial<SiteSettings>) => Promise<void> | void;
  onSaveCategory: (category: ProductCategory) => Promise<void> | void;
  onTestOpenPopup?: (popupKey: string) => void;
}

export const AdminContent: React.FC<AdminContentProps> = ({
  homepage,
  settings,
  categories,
  onSaveHomepage,
  onSaveSettings,
  onSaveCategory,
  onTestOpenPopup,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'popups' | 'categories' | 'branding' | 'compliance' | 'guarantees' | 'spacing'>('hero');
  const [showSpacingModal, setShowSpacingModal] = useState(false);
  
  // Local state for edits
  const [hpContent, setHpContent] = useState<HomepageContent>({ ...homepage });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ ...settings });
  const [catList, setCatList] = useState<ProductCategory[]>([...categories]);
  
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showNotification = (msg: string) => {
    setSavedSuccessMessage(msg);
    setTimeout(() => setSavedSuccessMessage(null), 3000);
  };

  const handleSaveHomepage = async () => {
    setIsSaving(true);
    await onSaveHomepage(hpContent);
    setIsSaving(false);
    showNotification('✓ Homepage media and copy updated successfully!');
  };

  const handleSaveBrandingSettings = async () => {
    setIsSaving(true);
    await onSaveSettings(siteSettings);
    setIsSaving(false);
    showNotification('✓ Branding, logo, and site copy updated successfully!');
  };

  const handleSaveCategoryEdit = async (cat: ProductCategory) => {
    setIsSaving(true);
    await onSaveCategory(cat);
    setIsSaving(false);
    showNotification(`✓ Category "${cat.name}" updated successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-800" />
            App-Wide Media & Copy Content Studio
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Customize all promotional graphics, homepage copy, site headers, category media, age gate text, quality guarantees, and element margins/paddings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowSpacingModal(true)}
            className="px-4 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all border border-emerald-700/50"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>⚡ Easy Visual Pop-Up Editor</span>
          </button>

          {savedSuccessMessage && (
            <div className="px-4 py-2 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold animate-fade-in flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700" />
              <span>{savedSuccessMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Studio Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'hero'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Homepage Hero & Banners</span>
        </button>

        <button
          onClick={() => setActiveTab('popups')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'popups'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Pop-Up Windows & Modals Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('spacing')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'spacing'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Box className="w-4 h-4 text-amber-400" />
          <span>📐 Margin & Padding Visual Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'categories'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-4 h-4 text-emerald-400" />
          <span>Category Media & Descriptions</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'branding'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Type className="w-4 h-4 text-emerald-400" />
          <span>Branding & Header Info</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'compliance'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Age Gate & Disclaimers</span>
        </button>

        <button
          onClick={() => setActiveTab('guarantees')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'guarantees'
              ? 'bg-[#002b29] text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Quality Guarantees Banner</span>
        </button>
      </div>

      {/* TAB 0: POP-UP WINDOWS & MODALS STUDIO */}
      {activeTab === 'popups' && (
        <AdminPopupEditor
          settings={siteSettings}
          onSaveSettings={async (s) => {
            await onSaveSettings(s);
            if (s.popups_config) {
              setSiteSettings(prev => ({ ...prev, popups_config: s.popups_config }));
            }
            showNotification('✓ Pop-up content, fields, and downloadable configurations saved successfully!');
          }}
          onTestOpenPopup={onTestOpenPopup}
        />
      )}

      {/* TAB 1: HERO & HOMEPAGE BANNERS */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-800" />
                  Hero Section Copy & Announcement Bar
                </h3>
                <p className="text-xs text-slate-500">Edit headlines, buttons, and top notification bar text.</p>
              </div>

              <button
                onClick={handleSaveHomepage}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Hero Changes</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Announcement Bar Top Text
                </label>
                <input
                  type="text"
                  value={hpContent.announcement_bar_text}
                  onChange={e => setHpContent({ ...hpContent, announcement_bar_text: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none"
                  placeholder="e.g. Free Express Shipping on orders above $150..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Title Headline
                </label>
                <input
                  type="text"
                  value={hpContent.hero_title}
                  onChange={e => setHpContent({ ...hpContent, hero_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-serif font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={3}
                  value={hpContent.hero_subtitle}
                  onChange={e => setHpContent({ ...hpContent, hero_subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={hpContent.hero_primary_cta_label}
                    onChange={e => setHpContent({ ...hpContent, hero_primary_cta_label: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Secondary CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={hpContent.hero_secondary_cta_label || 'View Quality Guarantees'}
                    onChange={e => setHpContent({ ...hpContent, hero_secondary_cta_label: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image Editor Component */}
          <SingleImageEditor
            imageUrl={hpContent.hero_image_url}
            onImageChange={(newUrl) => {
              const updated = { ...hpContent, hero_image_url: newUrl };
              setHpContent(updated);
              onSaveHomepage(updated);
            }}
            aspectRatioPreset="16:9"
            label="Hero Showcase Media Banner Editor"
            description="Upload custom laboratory or brand images from local device storage, crop in 16:9 widescreen format, adjust contrast/brightness, and set as front-page hero visual."
          />
        </div>
      )}

      {/* TAB 2: CATEGORY MEDIA & DESCRIPTIONS */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Grid className="w-5 h-5 text-emerald-800" />
                  Product Category Media & Copy Manager
                </h3>
                <p className="text-xs text-slate-500">Edit names, descriptions, and category showcase cover images.</p>
              </div>

              {/* Category Selector Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {catList.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      selectedCategoryIndex === idx
                        ? 'bg-emerald-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {catList[selectedCategoryIndex] && (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category Display Name
                    </label>
                    <input
                      type="text"
                      value={catList[selectedCategoryIndex].name}
                      onChange={e => {
                        const updated = [...catList];
                        updated[selectedCategoryIndex].name = e.target.value;
                        setCatList(updated);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Category URL Slug
                    </label>
                    <input
                      type="text"
                      value={catList[selectedCategoryIndex].slug}
                      onChange={e => {
                        const updated = [...catList];
                        updated[selectedCategoryIndex].slug = e.target.value;
                        setCatList(updated);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category Description
                  </label>
                  <textarea
                    rows={3}
                    value={catList[selectedCategoryIndex].description}
                    onChange={e => {
                      const updated = [...catList];
                      updated[selectedCategoryIndex].description = e.target.value;
                      setCatList(updated);
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveCategoryEdit(catList[selectedCategoryIndex])}
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Category Text</span>
                  </button>
                </div>

                {/* Category Image Editor */}
                <SingleImageEditor
                  imageUrl={catList[selectedCategoryIndex].image || ''}
                  onImageChange={(newUrl) => {
                    const updated = [...catList];
                    updated[selectedCategoryIndex].image = newUrl;
                    setCatList(updated);
                    handleSaveCategoryEdit(updated[selectedCategoryIndex]);
                  }}
                  aspectRatioPreset="4:3"
                  label={`Category Image Editor (${catList[selectedCategoryIndex].name})`}
                  description="Upload a photo for this category from device storage, edit dimensions/cropping, and save."
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BRANDING & HEADER INFO */}
      {activeTab === 'branding' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Type className="w-5 h-5 text-emerald-800" />
                  Storefront Branding & Header Details
                </h3>
                <p className="text-xs text-slate-500">Edit business name, contact info, and global branding details.</p>
              </div>

              <button
                onClick={handleSaveBrandingSettings}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Site Platform Title / Brand Name
                </label>
                <input
                  type="text"
                  value={siteSettings.site_name}
                  onChange={e => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={e => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support / Contact Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contact_email}
                  onChange={e => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Support Contact Phone
                </label>
                <input
                  type="text"
                  value={siteSettings.contact_phone}
                  onChange={e => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Laboratory Business Physical Address
              </label>
              <input
                type="text"
                value={siteSettings.address}
                onChange={e => setSiteSettings({ ...siteSettings, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Logo Media Editor */}
          <SingleImageEditor
            imageUrl={siteSettings.logo_url || 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=600'}
            onImageChange={(newUrl) => {
              const updated = { ...siteSettings, logo_url: newUrl };
              setSiteSettings(updated);
              onSaveSettings(updated);
            }}
            aspectRatioPreset="1:1"
            label="Brand Logo & Badge Media Editor"
            description="Upload or edit brand icon/logo artwork in 1:1 square ratio for header and document branding."
          />
        </div>
      )}

      {/* TAB 4: COMPLIANCE & AGE GATE */}
      {activeTab === 'compliance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-800" />
                Age Gate Verification & Compliance Disclaimer Copy
              </h3>
              <p className="text-xs text-slate-500">Edit legal popup title, disclaimer paragraphs, and age gate threshold.</p>
            </div>

            <button
              onClick={handleSaveBrandingSettings}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Disclaimers</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age Gate Modal Title
                </label>
                <input
                  type="text"
                  value={siteSettings.age_gate_title}
                  onChange={e => setSiteSettings({ ...siteSettings, age_gate_title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Minimum Verified Age Requirement
                </label>
                <input
                  type="number"
                  value={siteSettings.age_gate_min_age}
                  onChange={e => setSiteSettings({ ...siteSettings, age_gate_min_age: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age Verification Popup Body Message
              </label>
              <textarea
                rows={3}
                value={siteSettings.age_gate_message}
                onChange={e => setSiteSettings({ ...siteSettings, age_gate_message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 leading-relaxed focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QUALITY GUARANTEES */}
      {activeTab === 'guarantees' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-800" />
                Institutional Quality Architecture Copy
              </h3>
              <p className="text-xs text-slate-500">Edit titles and descriptions for the 3 homepage guarantee badges.</p>
            </div>

            <button
              onClick={handleSaveHomepage}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Save Guarantee Cards</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Guarantee 1 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Badge #1</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  defaultValue="Independent HPLC Analysis"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue="Every batch undergoes dual-stage HPLC chromatography and mass spectrometry testing prior to packaging."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Guarantee 2 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Badge #2</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  defaultValue="Fast Priority 1-3 Day"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue="Fast priority courier dispatch delivers your laboratory compounds directly to your facility within 1-3 business days."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            {/* Guarantee 3 */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Badge #3</span>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Title</label>
                <input
                  type="text"
                  defaultValue="Regulatory Compliance Gate"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Description</label>
                <textarea
                  rows={3}
                  defaultValue="Strict age verification and institutional research acknowledgments ensure safe, lawful supply chain integrity."
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SPACING & LAYOUT BOX MODEL */}
      {activeTab === 'spacing' && (
        <VisualSpacingEditor
          settings={settings}
          onSaveSettings={async (s) => {
            await onSaveSettings(s);
            showNotification('✓ App-wide spacing, margins, and paddings saved successfully!');
          }}
        />
      )}

      {/* EASY VISUAL POP-UP EDITOR MODAL */}
      {showSpacingModal && (
        <VisualSpacingEditor
          settings={settings}
          onSaveSettings={async (s) => {
            await onSaveSettings(s);
            showNotification('✓ App-wide spacing saved successfully!');
          }}
          isModal={true}
          onCloseModal={() => setShowSpacingModal(false)}
        />
      )}
    </div>
  );
};
