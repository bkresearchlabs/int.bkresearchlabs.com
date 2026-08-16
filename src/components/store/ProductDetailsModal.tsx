import React, { useState } from 'react';
import { X, FileText, Download, ShieldAlert, ShoppingBag, Bookmark, Check, Truck, AlertCircle, ShieldCheck, Lock } from 'lucide-react';
import { Product, SiteSettings } from '../../types';
import { useTranslation, translateProduct } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';
import { shouldPreserveProductBlock } from '../../lib/googleTranslate';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleSaveForLater: (product: Product) => void;
  isSaved: boolean;
  settings?: SiteSettings;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleSaveForLater,
  isSaved,
  settings,
}) => {
  const { t, language } = useTranslation();
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: !!product,
    onClose
  });

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [ackChecked, setAckChecked] = useState(true);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Sync state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || '');
      setQuantity(1);
      setAckChecked(!product.requires_acknowledgment);
      setDownloadNotice(null);
    }
  }, [product]);

  if (!product) return null;

  const localizedProduct = translateProduct(product, language);

  const quickViewSpacing = settings?.spacing_config?.product_quick_view;
  const quickViewConfig = settings?.popups_config?.product_quick_view;

  const isOutOfStock = localizedProduct.inventory_tracking_enabled && localizedProduct.inventory_quantity <= 0;
  const canAddToCart = !isOutOfStock && ackChecked;

  const preserveDescription = shouldPreserveProductBlock(product.id, 'description', settings);
  const preserveDisclaimer = shouldPreserveProductBlock(product.id, 'disclaimer', settings);
  const preserveCoa = shouldPreserveProductBlock(product.id, 'coa_specifications', settings);
  const preserveCompliance = shouldPreserveProductBlock(product.id, 'compliance_terms', settings);

  const handleDownloadCoA = (file: { file_name: string; description?: string }) => {
    const dummyCoaContent = `BK RESEARCH LABS - CERTIFICATE OF ANALYSIS
Product: ${localizedProduct.name}
SKU: ${localizedProduct.sku}
Batch/Lot: BKRL-${new Date().getFullYear()}-${localizedProduct.sku.replace(/[^0-9]/g, '') || '9041'}
Purity: 99.8% (HPLC Tested)
Document: ${file.file_name}
Authorized Quality Assurance: Verified ISO-17025 Standards
Issued: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([dummyCoaContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.file_name.endsWith('.txt') || file.file_name.endsWith('.pdf') ? file.file_name : `${file.file_name}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadNotice(`${t('details.download_coa')}: ${file.file_name}`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    onAddToCart(localizedProduct, quantity);
  };

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200 pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-[#0a0f0e] text-slate-200 shadow-2xl border border-white/10 w-full overflow-hidden flex flex-col my-8 max-h-[90vh] pointer-events-auto"
        onClick={e => e.stopPropagation()}
        style={{
          marginTop: quickViewSpacing?.marginTop !== undefined ? `${quickViewSpacing.marginTop}px` : undefined,
          marginRight: quickViewSpacing?.marginRight !== undefined ? `${quickViewSpacing.marginRight}px` : undefined,
          marginBottom: quickViewSpacing?.marginBottom !== undefined ? `${quickViewSpacing.marginBottom}px` : undefined,
          marginLeft: quickViewSpacing?.marginLeft !== undefined ? `${quickViewSpacing.marginLeft}px` : undefined,
          borderRadius: quickViewSpacing?.borderRadius !== undefined ? `${quickViewSpacing.borderRadius}px` : '16px',
          maxWidth: quickViewSpacing?.maxWidth ? `${quickViewSpacing.maxWidth}px` : '56rem', // max-w-4xl
        }}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#050807] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span className="font-bold text-emerald-400">{localizedProduct.category_name || t('nav.products')}</span>
            <span>•</span>
            <span>{t('product.sku')}: {localizedProduct.sku}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadNotice && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{downloadNotice}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div 
          className="overflow-y-auto grid md:grid-cols-2"
          style={{
            paddingTop: quickViewSpacing?.paddingTop !== undefined ? `${quickViewSpacing.paddingTop}px` : '24px',
            paddingRight: quickViewSpacing?.paddingRight !== undefined ? `${quickViewSpacing.paddingRight}px` : '32px',
            paddingBottom: quickViewSpacing?.paddingBottom !== undefined ? `${quickViewSpacing.paddingBottom}px` : '32px',
            paddingLeft: quickViewSpacing?.paddingLeft !== undefined ? `${quickViewSpacing.paddingLeft}px` : '32px',
            gap: quickViewSpacing?.gap !== undefined ? `${quickViewSpacing.gap}px` : '32px',
          }}
        >
          {/* Left: Image Gallery & CoA Downloads */}
          <div className="space-y-4">
            <div className="aspect-square bg-emerald-950/20 rounded-sm overflow-hidden border border-white/10 relative">
              <img
                src={selectedImage || localizedProduct.images[0]}
                alt={localizedProduct.name}
                className="w-full h-full object-cover opacity-90"
              />
              {localizedProduct.featured && (
                <span className="absolute top-3 left-3 bg-[#002b29] text-emerald-300 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 border border-emerald-700/50">
                  {t('product.featured')}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {localizedProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {localizedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-sm overflow-hidden border transition-all shrink-0 ${
                      selectedImage === img ? 'border-emerald-500 scale-95' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Documentation & CoA Download Box */}
            {localizedProduct.files && localizedProduct.files.length > 0 && (
              <div 
                className={`bg-emerald-950/40 border border-emerald-900/50 rounded-sm p-4 space-y-3 ${preserveCoa ? 'notranslate' : ''}`}
                translate={preserveCoa ? 'no' : undefined}
              >
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-widest">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>{t('product.coa_verified')}</span>
                  {preserveCoa && (
                    <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1 ml-auto">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Lab Specs (EN)</span>
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {localizedProduct.files.map(file => (
                    <div
                      key={file.id}
                      className="bg-white/5 p-3 rounded-sm border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-white">{file.file_name}</div>
                        <div className="text-[11px] text-slate-400">{t(file.description || '')} ({file.file_size})</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownloadCoA(file);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold uppercase tracking-wider rounded-none text-[10px] flex items-center gap-1 hover:bg-emerald-500 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t('common.download')}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-sans font-light text-white leading-snug">
                {localizedProduct.name}
              </h1>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  ${localizedProduct.price.toFixed(2)}
                </span>
                {localizedProduct.compare_at_price && (
                  <span className="text-sm text-slate-500 line-through">
                    ${localizedProduct.compare_at_price.toFixed(2)}
                  </span>
                )}
                <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 border ${
                  isOutOfStock ? 'bg-red-950/60 border-red-800 text-red-300' : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                }`}>
                  {isOutOfStock ? t('product.out_of_stock') : `${t('product.in_stock')} (${localizedProduct.inventory_quantity})`}
                </span>
              </div>
            </div>

            {/* Description */}
            <div 
              className={`text-slate-300 text-sm leading-relaxed space-y-2 border-t border-white/10 pt-4 ${preserveDescription ? 'notranslate' : ''}`}
              translate={preserveDescription ? 'no' : undefined}
            >
              {preserveDescription && (
                <div className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-1">
                  <Lock className="w-2.5 h-2.5 text-amber-400" />
                  <span>Chemical / Analytical Description Preserved</span>
                </div>
              )}
              <p>{localizedProduct.description}</p>
            </div>

            {/* Regulatory Disclaimer Box */}
            <div 
              className={`bg-amber-950/30 border border-amber-900/50 rounded-sm p-4 text-xs text-amber-200/90 space-y-2 ${preserveDisclaimer ? 'notranslate' : ''}`}
              translate={preserveDisclaimer ? 'no' : undefined}
            >
              <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wide">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('details.disclaimer_title')}</span>
                {preserveDisclaimer && (
                  <span className="text-[10px] text-amber-300 font-mono ml-auto flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Statutory Text</span>
                  </span>
                )}
              </div>
              <p className="leading-relaxed">
                {localizedProduct.disclaimer || t('details.disclaimer_text')}
              </p>
            </div>

            {/* Compliance Acknowledgment Checkbox */}
            {localizedProduct.requires_acknowledgment && (
              <div 
                className={`bg-white/5 border border-white/10 rounded-sm p-4 space-y-2 ${preserveCompliance ? 'notranslate' : ''}`}
                translate={preserveCompliance ? 'no' : undefined}
              >
                <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-200 font-medium leading-relaxed select-none">
                  <input
                    type="checkbox"
                    checked={ackChecked}
                    onChange={e => setAckChecked(e.target.checked)}
                    className="w-4 h-4 rounded-none border-white/20 bg-white/5 text-emerald-600 focus:ring-emerald-500 mt-0.5 shrink-0"
                  />
                  <span>
                    {localizedProduct.acknowledgment_text || t('details.compliance_ack')}
                  </span>
                </label>
                {!ackChecked && (
                  <p className="text-[11px] text-amber-400 font-semibold pl-7 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{t('Compliance acknowledgment required prior to ordering.')}</span>
                  </p>
                )}
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-white/10 bg-white/5 px-3 py-2 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-300 hover:text-white px-2 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-300 hover:text-white px-2 font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`flex-1 py-3.5 px-6 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${
                    canAddToCart
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-98 cursor-pointer'
                      : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? t('product.out_of_stock') : t('product.add_to_cart')}</span>
                </button>
              </div>

              {/* Save for Later Button */}
              <button
                onClick={() => onToggleSaveForLater(localizedProduct)}
                className={`w-full py-3 text-xs uppercase tracking-widest font-bold border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                  isSaved
                    ? 'bg-amber-500 border-amber-500 text-slate-950'
                    : 'bg-white/5 border-white/10 hover:border-amber-500/50 text-slate-300 hover:text-amber-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? t('product.saved') : t('product.save_for_later')}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-400" /> {t('Express Cold-Chain Shipping')}
              </span>
              <span>{t('Lot-Specific HPLC Batch Verified')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
