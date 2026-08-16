import React, { useState, useEffect } from 'react';
import { 
  Download, FileText, CheckCircle2, ShieldCheck, Sparkles, 
  ExternalLink, Lock, HardDrive, Smartphone, Cpu, Box, AlertCircle, FileArchive, Check
} from 'lucide-react';
import { DownloadableItem, IndividualPopupDownloadableSettings } from '../../types';
import { api } from '../../lib/supabase';
import { INITIAL_DOWNLOADABLES } from '../../data/initialData';

interface PopupDownloadablesShowcaseProps {
  config?: IndividualPopupDownloadableSettings;
  fallbackItems?: DownloadableItem[];
  className?: string;
  onDownloadTriggered?: (item: DownloadableItem) => void;
}

export const PopupDownloadablesShowcase: React.FC<PopupDownloadablesShowcaseProps> = ({
  config,
  fallbackItems,
  className = '',
  onDownloadTriggered
}) => {
  const [items, setItems] = useState<DownloadableItem[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const all = await api.getDownloadables();
        setItems(all && all.length > 0 ? all : INITIAL_DOWNLOADABLES);
      } catch {
        setItems(fallbackItems || INITIAL_DOWNLOADABLES);
      }
    };
    loadItems();
  }, [fallbackItems]);

  if (!config || !config.show_downloadables) return null;

  // Filter items matching the selected IDs
  const displayItems = items.filter(item => {
    if (config.selected_downloadable_ids && config.selected_downloadable_ids.length > 0) {
      return config.selected_downloadable_ids.includes(item.id);
    }
    return true; // default show first items if none specified
  }).slice(0, 6);

  if (displayItems.length === 0) return null;

  const handleDownload = (item: DownloadableItem) => {
    setDownloadingId(item.id);
    if (onDownloadTriggered) {
      onDownloadTriggered(item);
    }
    
    // Simulate real download trigger with file creation
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(item.id);

      // Create a virtual download link for client feedback
      try {
        const dummyContent = `BK RESEARCH LABS - OFFICIAL DOWNLOADABLE ASSET\nTitle: ${item.title}\nFilename: ${item.filename}\nVersion: ${item.version}\nPlatform: ${item.platform}\nMD5: ${item.md5_hash || '7a8b9c0d1e2f34567890123456789abc'}\nVerification: 100% Verified Pure Research Reference\nGenerated: ${new Date().toISOString()}`;
        const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.log('Virtual download generated:', item.filename);
      }

      setTimeout(() => {
        setDownloadSuccessId(null);
      }, 3000);
    }, 600);
  };

  const getItemIcon = (item: DownloadableItem) => {
    if (item.platform === 'ios') return <Smartphone className="w-4 h-4 text-blue-400" />;
    if (item.platform === 'android') return <Smartphone className="w-4 h-4 text-emerald-400" />;
    if (item.category === 'coa') return <ShieldCheck className="w-4 h-4 text-emerald-300" />;
    if (item.category === 'dataset') return <Cpu className="w-4 h-4 text-cyan-300" />;
    if (item.category === 'software') return <HardDrive className="w-4 h-4 text-purple-300" />;
    return <FileText className="w-4 h-4 text-amber-300" />;
  };

  const getAccessBadge = (item: DownloadableItem) => {
    if (!config.show_access_rules) return null;
    if (item.access_rule === 'public' || item.is_public) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">Public Access</span>;
    }
    if (item.access_rule === 'registered_only') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">Verified Accounts</span>;
    }
    if (item.access_rule === 'product_purchase_required') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">Granted via Order</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">Admin Granted</span>;
  };

  return (
    <div className={`mt-6 pt-6 border-t border-white/10 ${className}`}>
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              {config.section_title || 'Laboratory Reference Content & Downloadables'}
            </h4>
            {config.custom_badge_text && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                {config.custom_badge_text}
              </span>
            )}
          </div>
          {config.section_subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{config.section_subtitle}</p>
          )}
        </div>
        <span className="text-[11px] text-emerald-400 font-mono self-start sm:self-auto bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800/40">
          {displayItems.length} Authorized {displayItems.length === 1 ? 'Asset' : 'Assets'}
        </span>
      </div>

      {/* RENDER STYLE 1: CARDS GRID */}
      {config.display_style === 'cards_grid' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayItems.map(item => {
            const isDownloading = downloadingId === item.id;
            const isSuccess = downloadSuccessId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-[#0f1715]/90 border border-emerald-500/20 hover:border-emerald-400/50 rounded-2xl p-3.5 flex flex-col justify-between gap-3 transition-all duration-200 group hover:shadow-lg hover:shadow-emerald-950/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-700/40 group-hover:scale-105 transition-transform shrink-0">
                      {getItemIcon(item)}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 justify-end">
                      {getAccessBadge(item)}
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {item.title}
                  </h5>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {config.show_file_size_and_version ? (
                      <span>{item.file_size} • {item.version}</span>
                    ) : (
                      <span className="truncate max-w-[110px] inline-block">{item.filename}</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                      isSuccess
                        ? 'bg-emerald-500 text-[#002b29]'
                        : isDownloading
                        ? 'bg-emerald-900/60 text-emerald-200'
                        : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#002b29] border border-emerald-400/30'
                    }`}
                  >
                    {isSuccess ? (
                      <>
                        <Check className="w-3 h-3 text-[#002b29]" />
                        <span>Saved</span>
                      </>
                    ) : isDownloading ? (
                      <>
                        <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span>Downloading</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER STYLE 2: COMPACT LIST */}
      {config.display_style === 'compact_list' && (
        <div className="space-y-2">
          {displayItems.map(item => {
            const isDownloading = downloadingId === item.id;
            const isSuccess = downloadSuccessId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-[#0d1413]/80 border border-emerald-500/20 hover:border-emerald-400/40 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40 shrink-0">
                    {getItemIcon(item)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-xs font-bold text-slate-200 truncate">
                        {item.title}
                      </h5>
                      {getAccessBadge(item)}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>{item.filename}</span>
                      {config.show_file_size_and_version && (
                        <>
                          <span>•</span>
                          <span>{item.file_size}</span>
                          <span>•</span>
                          <span>{item.version}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(item)}
                  disabled={isDownloading}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                    isSuccess
                      ? 'bg-emerald-500 text-[#002b29]'
                      : isDownloading
                      ? 'bg-emerald-900/60 text-emerald-200'
                      : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#002b29] border border-emerald-400/30'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-[#002b29]" />
                      <span>Downloaded</span>
                    </>
                  ) : isDownloading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span>Saving</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* RENDER STYLE 3: FEATURED BANNER */}
      {config.display_style === 'featured_banner' && (
        <div className="space-y-3">
          {displayItems.slice(0, 2).map(item => {
            const isDownloading = downloadingId === item.id;
            const isSuccess = downloadSuccessId === item.id;

            return (
              <div 
                key={item.id}
                className="bg-gradient-to-r from-emerald-950/80 via-[#062420] to-[#041916] border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/30"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-300 shrink-0">
                    {getItemIcon(item)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-serif font-bold text-white">
                        {item.title}
                      </h5>
                      {getAccessBadge(item)}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 max-w-xl">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-emerald-400 font-mono mt-1.5">
                      <span>📁 {item.filename}</span>
                      <span>📦 {item.file_size}</span>
                      <span>🏷️ {item.version}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(item)}
                  disabled={isDownloading}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0 ${
                    isSuccess
                      ? 'bg-emerald-400 text-[#002b29]'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-[#002b29] shadow-emerald-500/20'
                  }`}
                >
                  {isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#002b29]" />
                      <span>Asset Saved</span>
                    </>
                  ) : isDownloading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#002b29] border-t-transparent rounded-full animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Package</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
