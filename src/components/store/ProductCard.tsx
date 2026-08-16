import React from 'react';
import { ShoppingBag, Bookmark, FileText, Eye, ShieldAlert, Check } from 'lucide-react';
import { Product } from '../../types';
import { useTranslation, translateProduct } from '../../lib/i18n';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleSaveForLater: (product: Product) => void;
  isSaved: boolean;
  currencySymbol?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onToggleSaveForLater,
  isSaved,
  currencySymbol = '$',
}) => {
  const { t, language } = useTranslation();
  const localizedProduct = translateProduct(product, language);
  const isOutOfStock = localizedProduct.inventory_tracking_enabled && localizedProduct.inventory_quantity <= 0;
  const hasCoA = localizedProduct.files && localizedProduct.files.some(f => f.file_type === 'coa');

  return (
    <div className="group bg-white/5 border border-white/10 rounded-sm hover:border-emerald-500/50 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Image Box */}
      <div className="relative aspect-square overflow-hidden bg-emerald-950/20 cursor-pointer" onClick={() => onSelect(localizedProduct)}>
        <img
          src={localizedProduct.images[0] || 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800'}
          alt={localizedProduct.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {localizedProduct.featured && (
            <span className="bg-[#002b29] text-emerald-300 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border border-emerald-700/50 shadow-md">
              {t('product.featured')}
            </span>
          )}
          {hasCoA && (
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 shadow-md">
              <FileText className="w-3 h-3 text-emerald-400" />
              <span>{t('product.coa_verified')}</span>
            </span>
          )}
        </div>

        {/* Save for Later Top Right Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSaveForLater(localizedProduct);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'bg-black/50 text-slate-300 hover:bg-black/80 hover:text-amber-400 border border-white/10'
          }`}
          title={isSaved ? t('product.saved') : t('product.save_for_later')}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(localizedProduct);
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-none shadow-xl flex items-center gap-1.5 hover:bg-emerald-500 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('product.quick_view')}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
            <span>{t('product.sku')}: {localizedProduct.sku}</span>
            <span className="text-emerald-400 font-semibold truncate max-w-[120px]">
              {localizedProduct.category_name || t('nav.products')}
            </span>
          </div>

          <h3
            onClick={() => onSelect(localizedProduct)}
            className="font-sans font-medium text-white text-sm leading-snug line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors"
          >
            {localizedProduct.name}
          </h3>

          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {localizedProduct.short_description || localizedProduct.description}
          </p>
        </div>

        {/* Price & Add To Cart Button */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-emerald-400 text-sm font-bold">
                {currencySymbol}{localizedProduct.price.toFixed(2)}
              </span>
              {localizedProduct.compare_at_price && (
                <span className="text-xs text-slate-500 line-through">
                  {currencySymbol}{localizedProduct.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
            {localizedProduct.requires_age_verification && (
              <span className="text-[9px] text-amber-400 flex items-center gap-0.5 mt-0.5 uppercase tracking-tighter">
                <ShieldAlert className="w-2.5 h-2.5 shrink-0" />
                <span>{t('product.age_required')}</span>
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(localizedProduct)}
            disabled={isOutOfStock}
            className={`px-3 py-2 text-[10px] uppercase font-bold tracking-widest transition-all ${
              isOutOfStock
                ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                : 'bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-600 text-white active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 inline mr-1" />
            <span>{isOutOfStock ? t('product.out_of_stock') : t('product.add_to_cart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
