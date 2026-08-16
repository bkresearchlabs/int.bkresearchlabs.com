import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Eye, ShieldCheck, Tag, FileText, ChevronRight, Share2, Printer, Check, Lock, Languages, Globe } from 'lucide-react';
import { CustomPage, SiteSettings } from '../../types';
import { useTranslation, translatePage } from '../../lib/i18n';
import { isPageTranslationEnabled } from '../../lib/googleTranslate';

interface CustomPageViewProps {
  page: CustomPage;
  settings: SiteSettings;
  onBack: () => void;
  onNavigateToShop: () => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({
  page,
  settings,
  onBack,
  onNavigateToShop,
}) => {
  const { t, language } = useTranslation();
  const translationAllowed = isPageTranslationEnabled(page.slug, page, settings);
  const localizedPage = translationAllowed ? translatePage(page, language) : page;
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPreservedOriginal = !translationAllowed;
  const docLang = page.original_language || 'en';

  return (
    <div 
      className={`min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 ${isPreservedOriginal ? 'notranslate' : ''}`}
      translate={isPreservedOriginal ? 'no' : undefined}
      lang={docLang}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumbs & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700/60 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Back to Store')}</span>
          </button>

          <div className="flex items-center gap-2">
            {isPreservedOriginal && (
              <div 
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono"
                title="This page is locked in its original laboratory-certified language according to site compliance policy."
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Original Lab Text ({docLang.toUpperCase()})</span>
              </div>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-1.5 text-xs cursor-pointer"
              title={t('Share Link')}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copied && <span className="text-emerald-400 font-bold text-[11px]">{t('Link Copied')}</span>}
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title={t('Print Documentation')}
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page Hero & Header */}
        <div className="bg-gradient-to-b from-[#002b29] to-slate-900 p-8 sm:p-10 rounded-3xl border border-emerald-800/40 shadow-2xl relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-bold text-xs uppercase tracking-wider">
              {localizedPage.category}
            </span>
            <span className="px-3 py-1 bg-slate-800/80 text-slate-300 border border-slate-700 rounded-full font-mono text-xs">
              /{localizedPage.slug}
            </span>
            {isPreservedOriginal && (
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Protected Original</span>
              </span>
            )}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {localizedPage.title}
          </h1>

          {localizedPage.summary && (
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {localizedPage.summary}
            </p>
          )}

          {/* Metadata Footer */}
          <div className="pt-4 border-t border-emerald-800/40 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            {localizedPage.author && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-400" />
                <span>{localizedPage.author}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{t('Updated')}: {new Date(localizedPage.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Verified Scientific Documentation')}</span>
            </div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className={`bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 ${isPreservedOriginal ? 'notranslate' : ''}`}>
          <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:text-slate-900 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3 prose-h3:text-lg prose-h3:text-slate-800 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 whitespace-pre-wrap font-sans text-sm sm:text-base">
            {localizedPage.content}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-6 sm:p-8 bg-slate-800/80 rounded-3xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-lg text-white">{t('Need Analytical Standards or COAs?')}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{t('Explore our full catalog of HPLC tested analytical reference compounds.')}</p>
          </div>
          <button
            onClick={onNavigateToShop}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-transform hover:scale-105 shadow-md flex items-center gap-2 self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>{t('Explore Store Catalog')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
