import React from 'react';
import { Bookmark, ShoppingBag, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { SaveForLaterItem } from '../../types';
import { useTranslation, translateProduct } from '../../lib/i18n';

interface SaveForLaterViewProps {
  items: SaveForLaterItem[];
  onMoveToCart: (sflId: string) => void;
  onRemoveItem: (sflId: string) => void;
  onNavigateToShop: () => void;
}

export const SaveForLaterView: React.FC<SaveForLaterViewProps> = ({
  items,
  onMoveToCart,
  onRemoveItem,
  onNavigateToShop,
}) => {
  const { t, language } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>{t('sfl.eyebrow')}</span>
          </div>
          <h1 className="text-3xl font-sans font-light text-white">{t('sfl.title')}</h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('sfl.subtitle')}
          </p>
        </div>

        <button
          onClick={onNavigateToShop}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>{t('cart.continue_shopping')}</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Items Grid / Empty State */}
      {items.length === 0 ? (
        <div className="bg-[#0a0f0e] rounded-sm border border-white/10 p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-sans font-light text-white">{t('sfl.empty_title')}</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            {t('sfl.empty_desc')}
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              {t('sfl.browse_catalog')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const rawProduct = item.product;
            if (!rawProduct) return null;
            const product = translateProduct(rawProduct, language);

            const isOutOfStock = product.inventory_tracking_enabled && product.inventory_quantity <= 0;

            return (
              <div
                key={item.id}
                className="bg-white/5 rounded-sm border border-white/10 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-sm border border-white/10 shrink-0 opacity-90"
                  />
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                      {t('product.sku')}: {product.sku}
                    </span>
                    <h3 className="font-sans font-medium text-sm text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      ${product.price.toFixed(2)}
                    </div>
                    <span className={`inline-block text-[9px] uppercase font-bold px-2 py-0.5 border ${
                      isOutOfStock ? 'bg-red-950/60 border-red-800 text-red-300' : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    }`}>
                      {isOutOfStock ? t('product.out_of_stock') : t('product.in_stock')}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => onMoveToCart(item.id)}
                    disabled={isOutOfStock}
                    className={`flex-1 py-2.5 px-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('sfl.move_to_cart')}</span>
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2.5 bg-white/5 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                    title={t('sfl.remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
