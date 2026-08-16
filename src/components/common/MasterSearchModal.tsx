import React, { useState, useEffect } from 'react';
import { Search, X, Package, FileText, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { useTranslation, translateProduct, translateCategory } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface MasterSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: ProductCategory[];
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const MasterSearchModal: React.FC<MasterSearchModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onSelectProduct,
  onSelectCategory,
}) => {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState('');
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: isOpen,
    onClose
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const translatedProducts = products.map(p => translateProduct(p, language));
  const translatedCategories = categories.map(c => translateCategory(c, language));

  const cleanQuery = query.trim().toLowerCase();

  const matchingProducts = cleanQuery
    ? translatedProducts.filter(
        p =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.category_name?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingCategories = cleanQuery
    ? translatedCategories.filter(
        c =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.description?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchingFiles = cleanQuery
    ? translatedProducts.flatMap(p => (p.files || []).map(f => ({ ...f, product: p }))).filter(
        f => f.file_name.toLowerCase().includes(cleanQuery) || f.description?.toLowerCase().includes(cleanQuery)
      )
    : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-200 rounded-lg"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {!cleanQuery ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#002b29]/10 text-[#002b29] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {t('Search Products, SKUs, Categories & Certificates of Analysis')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {['BPC-157', 'TB-500', 'NAD+', 'CoA PDF', 'Cell Culture'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-full transition-colors"
                  >
                    {t(tag)}
                  </button>
                ))}
              </div>
            </div>
          ) : matchingProducts.length === 0 && matchingCategories.length === 0 && matchingFiles.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-slate-500 text-sm">{t('No research items found for "{query}".', { query })}</p>
              <p className="text-xs text-slate-400">{t('Try searching for broader keywords like "compound", "standard", or "buffer".')}</p>
            </div>
          ) : (
            <>
              {/* Product Matches */}
              {matchingProducts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" />
                    <span>{t('nav.products')} ({matchingProducts.length})</span>
                  </h3>
                  <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl overflow-hidden border border-slate-200/60">
                    {matchingProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="p-3 hover:bg-white flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 text-sm group-hover:text-[#002b29]">
                              {product.name}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2">
                              <span className="font-mono text-[11px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                                {product.sku}
                              </span>
                              <span>${product.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#002b29] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Matches */}
              {matchingCategories.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('nav.categories')} ({matchingCategories.length})
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {matchingCategories.map(cat => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          onSelectCategory(cat.slug);
                          onClose();
                        }}
                        className="p-3 bg-emerald-50/50 hover:bg-emerald-100/50 border border-emerald-200/60 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="text-xs font-semibold text-emerald-950">{cat.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File / CoA Matches */}
              {matchingFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('Documentation & Certificates')} ({matchingFiles.length})</span>
                  </h3>
                  <div className="space-y-1.5">
                    {matchingFiles.map(file => (
                      <div
                        key={file.id}
                        onClick={() => {
                          onSelectProduct(file.product);
                          onClose();
                        }}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium text-slate-800">{file.file_name}</span>
                          <span className="text-[10px] text-slate-400">({file.product.name})</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                          {t('View PDF')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
