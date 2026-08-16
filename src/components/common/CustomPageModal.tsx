import React from 'react';
import { X, FileText, Calendar, User, ShieldCheck, ArrowRight, Printer, Share2 } from 'lucide-react';
import { CustomPage, SiteSettings } from '../../types';
import { useTranslation, translatePage } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface CustomPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: CustomPage | null;
  settings: SiteSettings;
  onNavigateToFullPage?: (slug: string) => void;
}

export const CustomPageModal: React.FC<CustomPageModalProps> = ({
  isOpen,
  onClose,
  page,
  settings,
  onNavigateToFullPage,
}) => {
  const { t, language } = useTranslation();
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: isOpen && !!page,
    onClose
  });

  if (!isOpen || !page) return null;

  const localizedPage = translatePage(page, language);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col my-6 max-h-[90vh] pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-bold uppercase">
                  {localizedPage.category}
                </span>
                <span className="text-slate-400 text-xs font-mono">/{localizedPage.slug}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-white mt-0.5">{localizedPage.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 text-xs sm:text-sm">
          {localizedPage.summary && (
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-emerald-900 font-medium leading-relaxed">
              {localizedPage.summary}
            </div>
          )}

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
            {localizedPage.content}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              {localizedPage.author && <span>{t('Author')}: <strong>{localizedPage.author}</strong></span>}
              <span>{t('Updated')}: {new Date(localizedPage.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{t('BKRL Verified')}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs">
            {t('common.close')}
          </button>

          {onNavigateToFullPage && (
            <button
              onClick={() => {
                onClose();
                onNavigateToFullPage(localizedPage.slug);
              }}
              className="px-5 py-2.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-105 shadow-md"
            >
              <span>{t('Open in Full Page Mode')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
