import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  FileText,
  Building2,
  Wallet,
  Coins,
  Smartphone,
  Zap,
  Copy,
  Check,
  Landmark
} from 'lucide-react';
import { CartItem, SiteSettings, UserProfile, Address, Order, PaymentGateway } from '../../types';
import { api } from '../../lib/supabase';
import { useTranslation, translateProduct } from '../../lib/i18n';

interface CheckoutFlowProps {
  cartItems: CartItem[];
  user: UserProfile | null;
  settings: SiteSettings;
  onOrderComplete: (order: Order) => void;
  onCancel: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({
  cartItems,
  user,
  settings,
  onOrderComplete,
  onCancel,
}) => {
  const { t, language } = useTranslation();
  const [step, setStep] = useState<'address' | 'compliance' | 'payment' | 'confirmation'>('address');

  // Form States
  const [address, setAddress] = useState<Address>({
    id: 'addr-new',
    user_id: user?.id || 'guest',
    type: 'shipping',
    first_name: user?.first_name || 'Dr. Sarah',
    last_name: user?.last_name || 'Jenkins',
    address_line_1: '750 Main Street, Suite 302',
    city: 'Cambridge',
    state: 'MA',
    postal_code: '02139',
    country: 'United States',
    phone: user?.phone || '+1 (617) 555-0192',
    is_default: true,
  });

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [discountMessage, setDiscountMessage] = useState('');

  // Compliance checkboxes
  const [ageCheck, setAgeCheck] = useState(true);
  const [researchCheck, setResearchCheck] = useState(false);
  const [shippingCheck, setShippingCheck] = useState(true);

  // Payment Gateways State
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('authorize_net');
  const [selectedCoin, setSelectedCoin] = useState<'btc' | 'eth' | 'usdt'>('btc');
  const [poReference, setPoReference] = useState('');
  const [cardName, setCardName] = useState(user ? `${user.first_name} ${user.last_name}` : 'Dr. Sarah Jenkins');
  const [cardNumber, setCardNumber] = useState('4007 0000 0002 7426');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('882');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    api.getPaymentGateways().then(data => {
      const enabledOnly = data.filter(g => g.enabled);
      setGateways(enabledOnly);
      if (enabledOnly.length > 0) {
        setSelectedGatewayId(enabledOnly[0].id);
      }
    });
  }, []);

  const selectedGateway = gateways.find(g => g.id === selectedGatewayId) || gateways[0];

  const handleCopy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFillTestCard = () => {
    setCardName('Dr. Sarah Jenkins (Test Account)');
    setCardNumber('4007 0000 0002 7426');
    setCardExpiry('12/28');
    setCardCvc('882');
  };

  // Authoritative Calculations
  const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const shippingFee = subtotal >= settings.free_shipping_threshold ? 0 : settings.standard_shipping_fee;
  const discountVal = appliedDiscount;
  const taxableSubtotal = Math.max(0, subtotal - discountVal);
  const taxAmount = Number(((taxableSubtotal * settings.tax_rate_percentage) / 100).toFixed(2));
  const grandTotal = Number((taxableSubtotal + shippingFee + taxAmount).toFixed(2));

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME10') {
      const disc = (subtotal * 10) / 100;
      setAppliedDiscount(disc);
      setDiscountMessage('Code WELCOME10 applied (10% Off)!');
    } else if (discountCode.toUpperCase() === 'LAB25' && subtotal >= 200) {
      setAppliedDiscount(25);
      setDiscountMessage('Code LAB25 applied ($25 Off)!');
    } else {
      setErrorMsg('Invalid discount code or minimum order amount not met.');
    }
  };

  const handleProcessOrder = async () => {
    if (!researchCheck) {
      setErrorMsg('You must accept the institutional research compliance acknowledgment.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      await new Promise(r => setTimeout(r, 1200));

      let pMethodName = 'Credit Card Payment';
      let pReference = 'tx_' + Date.now();

      if (selectedGateway) {
        if (selectedGateway.provider === 'authorize_net') {
          pMethodName = `Authorize.Net (${selectedGateway.authorize_net?.mode === 'sandbox' ? 'Sandbox Auth & Capture' : 'Live Auth & Capture'})`;
          pReference = `auth_net_trans_${Math.floor(Math.random() * 89999999 + 10000000)}`;
        } else if (selectedGateway.provider === 'bank_wire') {
          pMethodName = `Online Banking / Wire Transfer (${selectedGateway.bank_wire?.bank_name || 'Chase Bank'})`;
          pReference = poReference ? `PO-${poReference}` : `WIRE-REF-${Math.floor(Math.random() * 899999 + 100000)}`;
        } else if (selectedGateway.provider === 'stripe') {
          pMethodName = 'Stripe Credit Card PaymentIntents';
          pReference = `pi_${Math.random().toString(36).substring(2, 15)}`;
        } else if (selectedGateway.provider === 'paypal') {
          pMethodName = 'PayPal Express Checkout';
          pReference = `PAYID-${Math.random().toString(36).toUpperCase().substring(2, 12)}`;
        } else if (selectedGateway.provider === 'crypto') {
          pMethodName = `Cryptocurrency (${selectedCoin.toUpperCase()})`;
          pReference = `tx_hash_0x${Math.random().toString(16).substring(2, 18)}`;
        } else if (selectedGateway.provider === 'apple_pay') {
          pMethodName = 'Apple Pay Express Biometric Authorization';
          pReference = `apple_token_${Math.random().toString(36).substring(2, 10)}`;
        } else {
          pMethodName = selectedGateway.name;
          pReference = `custom_ref_${Date.now()}`;
        }
      }

      const newOrder = await api.createOrder({
        cartItems,
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: pMethodName,
        discountCode: discountCode || undefined,
        acknowledgmentsAccepted: researchCheck,
        ageVerified: ageCheck,
      });

      // Update payment reference
      newOrder.payment_reference = pReference;

      setCompletedOrder(newOrder);
      setStep('confirmation');
      onOrderComplete(newOrder);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please re-verify cart details.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'confirmation' && completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-md">
            <PackageCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full uppercase">
              {t('checkout.order_success')}
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              {t('checkout.order_thankyou')}
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              {t('checkout.order_number')}: <strong className="text-[#002b29] font-mono">{completedOrder.order_number}</strong>
            </p>
          </div>

          {/* Order Summary Snapshot */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4">
            <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-3 font-semibold text-slate-700">
              <span>{t('checkout.order_number')}: {completedOrder.id}</span>
              <span>{t('cart.total')}: ${completedOrder.total.toFixed(2)} USD</span>
            </div>

            <div className="space-y-3">
              {completedOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{item.product_name_snapshot}</span>
                    <span className="text-slate-400 font-mono block">{t('product.sku')}: {item.sku_snapshot} × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-slate-900">${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <div><strong>{t('checkout.step_address')}:</strong> {completedOrder.shipping_address.first_name} {completedOrder.shipping_address.last_name}, {completedOrder.shipping_address.address_line_1}, {completedOrder.shipping_address.city}, {completedOrder.shipping_address.state} {completedOrder.shipping_address.postal_code}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onCancel()}
              className="px-6 py-3.5 bg-[#002b29] hover:bg-[#003d3a] text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
            >
              {t('checkout.return_to_store')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#002b29] text-white rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-slate-900">{t('checkout.title')}</h1>
            <p className="text-xs text-slate-500">{t('hero.eyebrow')}</p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100"
        >
          {t('common.back')}
        </button>
      </div>

      {/* Progress Steps Header */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <div className={`p-3 rounded-xl border transition-all ${
          step === 'address' ? 'bg-[#002b29] text-white border-[#002b29]' : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          1. {t('checkout.step_address')}
        </div>
        <div className={`p-3 rounded-xl border transition-all ${
          step === 'compliance' ? 'bg-[#002b29] text-white border-[#002b29]' : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          2. {t('checkout.step_compliance')}
        </div>
        <div className={`p-3 rounded-xl border transition-all ${
          step === 'payment' ? 'bg-[#002b29] text-white border-[#002b29]' : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          3. {t('checkout.step_payment')}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Step Content */}
        <div className="lg:col-span-2 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Address */}
          {step === 'address' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#002b29]" />
                <span>{t('checkout.facility_info')}</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.first_name')}</label>
                  <input
                    type="text"
                    value={address.first_name}
                    onChange={e => setAddress({ ...address, first_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.last_name')}</label>
                  <input
                    type="text"
                    value={address.last_name}
                    onChange={e => setAddress({ ...address, last_name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.address1')}</label>
                  <input
                    type="text"
                    value={address.address_line_1}
                    onChange={e => setAddress({ ...address, address_line_1: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.city')}</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={e => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.state')}</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.zip')}</label>
                  <input
                    type="text"
                    value={address.postal_code}
                    onChange={e => setAddress({ ...address, postal_code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('checkout.country')}</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={e => setAddress({ ...address, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#002b29]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep('compliance')}
                  className="px-6 py-3 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all"
                >
                  <span>{t('checkout.continue_to_compliance')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Compliance */}
          {step === 'compliance' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>{t('checkout.compliance_title')}</span>
              </h2>

              <p className="text-xs text-slate-500 leading-relaxed">
                {t('agegate.message')}
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-800 leading-snug">
                  <input
                    type="checkbox"
                    checked={ageCheck}
                    onChange={e => setAgeCheck(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#002b29] focus:ring-[#002b29] mt-0.5"
                  />
                  <span>{t('checkout.compliance_age')}</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-800 leading-snug">
                  <input
                    type="checkbox"
                    checked={researchCheck}
                    onChange={e => setResearchCheck(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#002b29] focus:ring-[#002b29] mt-0.5"
                  />
                  <span>{t('checkout.compliance_research')}</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold text-slate-800 leading-snug">
                  <input
                    type="checkbox"
                    checked={shippingCheck}
                    onChange={e => setShippingCheck(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#002b29] focus:ring-[#002b29] mt-0.5"
                  />
                  <span>{t('checkout.compliance_shipping')}</span>
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setStep('address')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('common.back')}</span>
                </button>

                <button
                  onClick={() => {
                    if (!researchCheck) {
                      setErrorMsg(t('checkout.compliance_research'));
                      return;
                    }
                    setErrorMsg('');
                    setStep('payment');
                  }}
                  className="px-6 py-3 bg-[#002b29] hover:bg-[#003d3a] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all"
                >
                  <span>{t('checkout.continue_to_payment')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#002b29]" />
                    <span>{t('checkout.payment_title')}</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t('details.purity_guarantee')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-bit TLS</span>
                </div>
              </div>

              {/* Payment Gateway Option Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gateways.map(gw => {
                  const isSelected = gw.id === selectedGatewayId;
                  return (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGatewayId(gw.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#002b29] text-white border-[#002b29] shadow-md ring-2 ring-[#002b29]/20'
                          : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {gw.provider === 'authorize_net' && <CreditCard className="w-5 h-5" />}
                          {gw.provider === 'bank_wire' && <Landmark className="w-5 h-5" />}
                          {gw.provider === 'stripe' && <CreditCard className="w-5 h-5" />}
                          {gw.provider === 'paypal' && <Wallet className="w-5 h-5" />}
                          {gw.provider === 'crypto' && <Coins className="w-5 h-5" />}
                          {gw.provider === 'apple_pay' && <Smartphone className="w-5 h-5" />}
                        </div>

                        <div>
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            <span>{gw.name}</span>
                            {gw.badge_text && (
                              <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono font-black ${
                                isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {gw.badge_text}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            {gw.description}
                          </p>
                        </div>
                      </div>

                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* DYNAMIC GATEWAY FORM INTERFACES */}

              {/* 1. AUTHORIZE.NET CREDIT CARD FORM */}
              {selectedGateway?.provider === 'authorize_net' && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#002b29]" />
                      <span className="font-bold text-xs text-slate-900">{t('Direct Card Tokenization')}</span>
                    </div>

                    {selectedGateway.authorize_net?.mode === 'sandbox' && (
                      <button
                        type="button"
                        onClick={handleFillTestCard}
                        className="text-[10px] font-mono font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-300 transition-all flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3 text-amber-600" />
                        <span>{t('Sandbox Test Card')}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('checkout.card_name')}</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#002b29]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-bold text-slate-600">{t('checkout.card_number')}</label>
                        <div className="flex items-center gap-1">
                          {(selectedGateway.authorize_net?.supported_cards || ['visa', 'mastercard', 'amex', 'discover']).map(c => (
                            <span key={c} className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 border border-slate-300">
                              {c === 'visa' ? 'Visa' : c === 'mastercard' ? 'MasterCard' : c === 'amex' ? 'Amex' : c === 'discover' ? 'Discover' : c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        required
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('checkout.card_expiry')}</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('checkout.card_cvc')}</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                          required
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('Encrypted TLS Transaction Channel')}</span>
                  </div>
                </div>
              )}

              {/* 2. ONLINE BANKING & WIRE TRANSFER INSTRUCTIONS */}
              {selectedGateway?.provider === 'bank_wire' && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-[#002b29]" />
                    <span className="font-bold text-xs text-slate-900">{t('Online Banking, ACH & Wire Settlement Details')}</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-sans">{t('Bank Name:')}</span>
                      <span className="font-bold text-[#002b29]">{selectedGateway.bank_wire?.bank_name || 'JPMorgan Chase Bank'}</span>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-sans">{t('Account Holder:')}</span>
                      <span className="font-bold text-slate-800">{selectedGateway.bank_wire?.account_name || 'BK Research Labs LLC'}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-sans">{t('Routing (ABA) #:')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{selectedGateway.bank_wire?.routing_number}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedGateway.bank_wire?.routing_number || '', 'routing')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        >
                          {copiedKey === 'routing' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-sans">{t('Account #:')}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{selectedGateway.bank_wire?.account_number}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedGateway.bank_wire?.account_number || '', 'account')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500"
                        >
                          {copiedKey === 'account' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-sans">SWIFT / BIC:</span>
                      <span className="font-bold text-slate-800">{selectedGateway.bank_wire?.swift_bic}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">{t('checkout.po_number')}</label>
                    <input
                      type="text"
                      value={poReference}
                      onChange={e => setPoReference(e.target.value)}
                      placeholder="e.g. PO-981204 or Wire Memo ID"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                    />
                  </div>
                </div>
              )}

              {/* 3. STRIPE FORM */}
              {selectedGateway?.provider === 'stripe' && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Stripe</span>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder={t('checkout.card_number')}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder={t('checkout.card_expiry')}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                      />
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        placeholder={t('checkout.card_cvc')}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#002b29]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PAYPAL EXPRESS FORM */}
              {selectedGateway?.provider === 'paypal' && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">PayPal Express</h4>
                  </div>
                  <div className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 px-6 rounded-2xl text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md">
                    <span>PayPal Express</span>
                  </div>
                </div>
              )}

              {/* 5. CRYPTOCURRENCY FORM */}
              {selectedGateway?.provider === 'crypto' && selectedGateway.crypto && (
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-amber-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-400">
                      <Coins className="w-4 h-4" />
                      <span>{t('Cryptocurrency Settlement Portal')}</span>
                    </div>

                    {/* Coin selector */}
                    <div className="flex gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[11px] font-mono">
                      <button
                        type="button"
                        onClick={() => setSelectedCoin('btc')}
                        className={`px-2.5 py-1 rounded-lg font-bold ${selectedCoin === 'btc' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        BTC
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCoin('eth')}
                        className={`px-2.5 py-1 rounded-lg font-bold ${selectedCoin === 'eth' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        ETH
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedCoin('usdt')}
                        className={`px-2.5 py-1 rounded-lg font-bold ${selectedCoin === 'usdt' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        USDT
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-[11px] text-slate-400">{t('Send Payment To Address:')}</div>
                    <div className="bg-black p-3 rounded-xl border border-white/20 flex items-center justify-between gap-2">
                      <span className="text-emerald-300 truncate font-bold text-[11px]">
                        {selectedCoin === 'btc' && selectedGateway.crypto.btc_wallet_address}
                        {selectedCoin === 'eth' && selectedGateway.crypto.eth_wallet_address}
                        {selectedCoin === 'usdt' && selectedGateway.crypto.usdt_trc20_address}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(
                          selectedCoin === 'btc' ? selectedGateway.crypto!.btc_wallet_address :
                          selectedCoin === 'eth' ? selectedGateway.crypto!.eth_wallet_address :
                          selectedGateway.crypto!.usdt_trc20_address,
                          'crypto_addr'
                        )}
                        className="px-2 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg text-[10px] font-bold shrink-0 flex items-center gap-1"
                      >
                        {copiedKey === 'crypto_addr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{t('Copy Address')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. APPLE PAY / GOOGLE PAY */}
              {selectedGateway?.provider === 'apple_pay' && (
                <div className="bg-slate-950 text-white rounded-2xl p-6 border border-slate-800 text-center space-y-3">
                  <Smartphone className="w-8 h-8 text-white mx-auto" />
                  <h4 className="font-bold text-sm">{t('Biometric 1-Touch Express Checkout')}</h4>
                  <p className="text-xs text-slate-400">
                    ${grandTotal.toFixed(2)} USD
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep('compliance')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('common.back')}</span>
                </button>

                <button
                  onClick={handleProcessOrder}
                  disabled={isProcessing}
                  className={`px-8 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                    isProcessing
                      ? 'bg-slate-300 text-slate-500 cursor-wait'
                      : 'bg-[#002b29] hover:bg-[#003d3a] text-white shadow-[#002b29]/20'
                  }`}
                >
                  <span>{isProcessing ? t('checkout.processing') : `${t('checkout.place_order')} (${grandTotal.toFixed(2)} USD)`}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary Box */}
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-200 pb-3">
              {t('cart.title')} ({cartItems.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100">
              {cartItems.map(item => {
                const locProduct = translateProduct(item.product, language);
                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex justify-between items-start text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{locProduct.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Qty: {item.quantity} × ${item.product.price.toFixed(2)}</div>
                    </div>
                    <div className="font-bold text-slate-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discount Code Input */}
            <div className="pt-2 border-t border-slate-200">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">{t('checkout.discount_placeholder')}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  placeholder="WELCOME10"
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono uppercase focus:outline-none"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="px-3 py-1.5 bg-[#002b29] text-white text-xs font-semibold rounded-xl"
                >
                  {t('checkout.apply_discount')}
                </button>
              </div>
              {discountMessage && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1">{discountMessage}</p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t('cart.discount')}</span>
                  <span>-${appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>{shippingFee === 0 ? t('cart.shipping_free') : `${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.tax')} ({settings.tax_rate_percentage}%)</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>{t('cart.total')}</span>
                <span>${grandTotal.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
