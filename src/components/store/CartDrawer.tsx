import React from 'react';
import { X, Trash2, Bookmark, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartItem, SiteSettings } from '../../types';
import { useTranslation, translateProduct } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveToSaveForLater: (item: CartItem) => void;
  onProceedToCheckout: () => void;
  settings: SiteSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToSaveForLater,
  onProceedToCheckout,
  settings,
}) => {
  const { t, language } = useTranslation();
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: isOpen,
    onClose
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingNeeded = Math.max(0, settings.free_shipping_threshold - subtotal);
  const estimatedShipping = subtotal >= settings.free_shipping_threshold || cartItems.length === 0 ? 0 : settings.standard_shipping_fee;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200 pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-[#0a0f0e] text-slate-200 h-full shadow-2xl flex flex-col justify-between border-l border-white/10 animate-in slide-in-from-right duration-300 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#050807]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h2 className="font-sans font-light text-lg text-white">{t('cart.title')}</h2>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-emerald-950/60 p-3 border-b border-emerald-900/50 text-xs text-emerald-200 space-y-1.5">
          <div className="flex justify-between font-medium">
            <span>
              {freeShippingNeeded <= 0
                ? t('cart.free_shipping_qualified')
                : t('cart.free_shipping_needed', { amount: freeShippingNeeded.toFixed(2) })}
            </span>
          </div>
          <div className="w-full bg-[#002b29] h-1.5 rounded-full overflow-hidden border border-emerald-800/40">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / settings.free_shipping_threshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-white/10">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-white font-sans font-light text-base">{t('cart.empty_title')}</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {t('cart.empty_desc')}
              </p>
            </div>
          ) : (
            cartItems.map(item => {
              const locProduct = translateProduct(item.product, language);
              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3">
                  <img
                    src={locProduct.images[0]}
                    alt={locProduct.name}
                    className="w-16 h-16 object-cover rounded-sm border border-white/10 shrink-0 opacity-90"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-sans font-medium text-white text-xs line-clamp-2 leading-tight">
                        {locProduct.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-400 p-1 cursor-pointer"
                        title={t('cart.remove')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                      {t('product.sku')}: {locProduct.sku}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-white/10 bg-white/5 px-2 py-0.5 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-1 font-bold text-slate-300 hover:text-white cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-1 font-bold text-slate-300 hover:text-white cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-emerald-400">
                          ${(locProduct.price * item.quantity).toFixed(2)}
                        </div>
                        <button
                          onClick={() => onMoveToSaveForLater(item)}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 justify-end mt-0.5 cursor-pointer"
                        >
                          <Bookmark className="w-2.5 h-2.5" />
                          <span>{t('cart.move_to_sfl')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 bg-[#050807] border-t border-white/10 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-mono font-semibold text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {estimatedShipping === 0 ? t('cart.shipping_free') : `${estimatedShipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>{t('cart.total')}</span>
                <span className="font-mono text-emerald-400">${(subtotal + estimatedShipping).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <span>{t('cart.checkout_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{t('SSL 256-bit Encrypted & Tokenized Checkout')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
