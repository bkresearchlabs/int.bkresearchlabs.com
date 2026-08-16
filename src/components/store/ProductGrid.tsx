import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types';
import { PackageX } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface ProductGridProps {
  products: Product[];
  savedProductIds: string[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleSaveForLater: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  savedProductIds,
  onSelectProduct,
  onAddToCart,
  onToggleSaveForLater,
}) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="bg-[#0a0f0e] rounded-sm border border-white/10 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
          <PackageX className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-sans font-light text-white">{t('No Matching Compounds Found')}</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          {t('Try expanding your category filter or adjusting your search parameters to view additional analytical reference items.')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
          onAddToCart={onAddToCart}
          onToggleSaveForLater={onToggleSaveForLater}
          isSaved={savedProductIds.includes(product.id)}
        />
      ))}
    </div>
  );
};
