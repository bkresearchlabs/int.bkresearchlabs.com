import React from 'react';
import { Filter, SlidersHorizontal, Check } from 'lucide-react';
import { ProductCategory } from '../../types';
import { useTranslation, translateCategory } from '../../lib/i18n';

interface ProductFilterProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  sortBy: string;
  onSelectSortBy: (sort: string) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  featuredOnly: boolean;
  onToggleFeaturedOnly: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSortBy,
  inStockOnly,
  onToggleInStockOnly,
  featuredOnly,
  onToggleFeaturedOnly,
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="bg-[#0a0f0e] rounded-sm border border-white/10 p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-sans text-xs uppercase tracking-widest font-bold">
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span>{t('filter.title')}</span>
        </div>
        {(selectedCategory || inStockOnly || featuredOnly) && (
          <button
            onClick={() => {
              onSelectCategory('');
              if (inStockOnly) onToggleInStockOnly();
              if (featuredOnly) onToggleFeaturedOnly();
            }}
            className="text-xs text-emerald-400 hover:underline font-mono cursor-pointer"
          >
            {t('filter.reset')}
          </button>
        )}
      </div>

      {/* Categories Horizontal Filter Chips */}
      <div>
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {t('filter.category')}
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === ''
                ? 'bg-emerald-600 text-white border border-emerald-500'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            {t('filter.all_products')}
          </button>
          {categories.map(cat => {
            const locCat = translateCategory(cat, language);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white border border-emerald-500'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {locCat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting & Quick Toggles */}
      <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-white/5">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {t('filter.sort_order')}
          </label>
          <select
            value={sortBy}
            onChange={e => onSelectSortBy(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-slate-200 text-xs font-mono rounded-none px-3 py-2 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="featured" className="bg-[#0a0f0e] text-white">{t('filter.sort_featured')}</option>
            <option value="price-asc" className="bg-[#0a0f0e] text-white">{t('filter.sort_price_asc')}</option>
            <option value="price-desc" className="bg-[#0a0f0e] text-white">{t('filter.sort_price_desc')}</option>
            <option value="newest" className="bg-[#0a0f0e] text-white">{t('filter.sort_newest')}</option>
            <option value="name" className="bg-[#0a0f0e] text-white">{t('filter.sort_name')}</option>
          </select>
        </div>

        <div className="flex items-center pt-3 sm:pt-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={onToggleInStockOnly}
              className="w-4 h-4 rounded-none border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500"
            />
            <span>{t('filter.in_stock_only')}</span>
          </label>
        </div>

        <div className="flex items-center pt-3 sm:pt-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300 select-none">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={onToggleFeaturedOnly}
              className="w-4 h-4 rounded-none border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500"
            />
            <span>{t('filter.featured_only')}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
