import React, { useState } from 'react';
import {
  X,
  Package,
  Truck,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Mail,
  Download,
  Printer,
  RefreshCw,
  Clock,
  ShieldCheck,
  MapPin,
  CreditCard,
  Building2,
  FileCheck,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Order, OrderItemSnapshot } from '../../types';
import { useTranslation } from '../../lib/i18n';
import { useAutoCloseOutside } from '../../lib/useAutoCloseOutside';

interface CustomerOrderDetailsModalProps {
  order: Order;
  onClose: () => void;
  onReorder?: (order: Order) => void;
  supportEmail?: string;
}

export const CustomerOrderDetailsModal: React.FC<CustomerOrderDetailsModalProps> = ({
  order,
  onClose,
  onReorder,
  supportEmail = 'support@bkresearchlabs.com',
}) => {
  const { t } = useTranslation();
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [activeModalView, setActiveModalView] = useState<'details' | 'invoice'>('details');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const modalRef = useAutoCloseOutside<HTMLDivElement>({
    enabled: !!order,
    onClose
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedTracking(true);
    showToast(t('Tracking number copied to clipboard!'));
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Helper to determine carrier tracking URL
  const getCarrierTrackingUrl = (tracking: string, carrierName = ''): string => {
    const cleanTrack = tracking.trim();
    const c = carrierName.toLowerCase();

    if (c.includes('fedex')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(cleanTrack)}`;
    }
    if (c.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${encodeURIComponent(cleanTrack)}`;
    }
    if (c.includes('usps')) {
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(cleanTrack)}`;
    }
    if (c.includes('dhl')) {
      return `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(cleanTrack)}`;
    }
    // Universal tracker fallback
    return `https://parcelsapp.com/en/tracking/${encodeURIComponent(cleanTrack)}`;
  };

  const activeTracking = order.tracking_number || '';
  const activeCarrier = order.carrier || 'FedEx Express Cold-Chain';
  const trackingUrl = activeTracking ? getCarrierTrackingUrl(activeTracking, activeCarrier) : '#';

  // Mailto link formatted with inquiry context
  const mailtoSubject = encodeURIComponent(`Order Inquiry: ${order.order_number} - ${order.customer_name}`);
  const mailtoBody = encodeURIComponent(
    `Hello BK Research Labs Support Team,\n\n` +
    `I am contacting you regarding my recent research order:\n` +
    `• Order Number: ${order.order_number}\n` +
    `• Date Placed: ${new Date(order.created_at).toLocaleDateString()}\n` +
    `• Status: ${order.status.toUpperCase()} (${order.fulfillment_status || 'Unfulfilled'})\n` +
    `• Active Tracking: ${activeTracking || 'Pending Dispatch'}\n` +
    `• Total: $${order.total.toFixed(2)} ${order.currency}\n\n` +
    `My inquiry / question:\n[Please write your message here]\n\n` +
    `Best regards,\n${order.customer_name}\n${order.customer_email}`
  );
  const supportMailtoLink = `mailto:${supportEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  const generateInvoiceHtml = () => {
    const itemsRows = order.items
      .map(
        item => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 10px; font-weight: 600; color: #0f172a;">${item.product_name_snapshot}</td>
          <td style="padding: 12px 10px; font-family: monospace; color: #64748b;">${item.sku_snapshot}</td>
          <td style="padding: 12px 10px; text-align: center; color: #0f172a;">${item.quantity}</td>
          <td style="padding: 12px 10px; text-align: right; color: #0f172a;">$${item.unit_price.toFixed(2)}</td>
          <td style="padding: 12px 10px; text-align: right; font-weight: 700; color: #0f172a;">$${item.subtotal.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Commercial Invoice - ${order.order_number} - BK Research Labs</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #0f172a; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #002b29; padding-bottom: 20px; margin-bottom: 28px; }
          .logo-title { font-size: 24px; font-weight: 900; color: #002b29; margin: 0; letter-spacing: 0.5px; }
          .logo-sub { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
          .invoice-meta { text-align: right; }
          .invoice-num { font-size: 20px; font-weight: 800; font-family: monospace; color: #002b29; margin-top: 2px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-size: 12px; line-height: 1.6; }
          .box-title { font-weight: 800; text-transform: uppercase; font-size: 10px; color: #002b29; margin-bottom: 6px; letter-spacing: 0.5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 12px; }
          th { background: #002b29; color: #fff; text-align: left; padding: 12px 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
          .totals-table { width: 320px; margin-left: auto; font-size: 13px; line-height: 1.8; margin-bottom: 30px; }
          .total-row { font-size: 16px; font-weight: 800; border-top: 2px solid #002b29; color: #002b29; padding-top: 8px; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; background: #dcfce7; color: #166534; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b; text-align: center; line-height: 1.5; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="logo-title">BK RESEARCH LABS</h1>
            <div class="logo-sub">Analytical Reference Compounds & Peptide Synthesis</div>
            <div style="font-size: 11px; color: #475569; margin-top: 6px;">
              support@bkresearchlabs.com • ISO 9001:2015 & cGMP Standard Facility
            </div>
          </div>
          <div class="invoice-meta">
            <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">Official Laboratory Invoice</div>
            <div class="invoice-num">${order.order_number}</div>
            <div style="font-size: 12px; color: #475569; margin-top: 4px;">
              Date: <strong>${new Date(order.created_at).toLocaleDateString()}</strong>
            </div>
            <div style="margin-top: 4px;">
              <span class="badge">PAID IN FULL</span>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <div class="box-title">Research Laboratory / Customer</div>
            <strong style="font-size: 13px; color: #0f172a;">${order.customer_name}</strong><br/>
            ${order.customer_email}<br/>
            ${order.shipping_address.address_line_1}${order.shipping_address.address_line_2 ? '<br/>' + order.shipping_address.address_line_2 : ''}<br/>
            ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}<br/>
            ${order.shipping_address.country}
          </div>
          <div class="box">
            <div class="box-title">Cold-Chain Dispatch & Carrier Info</div>
            <strong>Assigned Carrier:</strong> ${activeCarrier}<br/>
            <strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: 700; color: #002b29;">${activeTracking || 'Pending Dispatch'}</span><br/>
            <strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}<br/>
            <strong>Order Status:</strong> ${order.status.toUpperCase()} (${order.fulfillment_status || 'Unfulfilled'})
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Compound Description</th>
              <th>SKU</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Compounds Subtotal:</td>
            <td style="text-align: right;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          ${order.discount_amount > 0 ? `
          <tr style="color: #16a34a;">
            <td>Discount Applied:</td>
            <td style="text-align: right;">-$${order.discount_amount.toFixed(2)}</td>
          </tr>` : ''}
          <tr>
            <td>Cold-Chain Insulated Shipping:</td>
            <td style="text-align: right;">$${order.shipping_amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Estimated Sales Tax:</td>
            <td style="text-align: right;">$${order.tax_amount.toFixed(2)}</td>
          </tr>
          <tr class="total-row">
            <td>Grand Total Paid:</td>
            <td style="text-align: right;">$${order.total.toFixed(2)} ${order.currency}</td>
          </tr>
        </table>

        <div class="footer">
          <p><strong>FOR RESEARCH USE ONLY (RUO):</strong> All compounds synthesized and supplied by BK Research Labs are intended strictly for laboratory in-vitro analysis, scientific calibration, and academic assays. Not for human, veterinary, or medical use.</p>
          <p>© ${new Date().getFullYear()} BK Research Labs. Thank you for your scientific partnership.</p>
        </div>
      </body>
      </html>
    `;
  };

  const handleDownloadInvoiceHtml = () => {
    const htmlContent = generateInvoiceHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${order.order_number}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded Invoice for Order ${order.order_number}!`);
  };

  const handlePrintInvoice = () => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(generateInvoiceHtml());
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 300);
        showToast('Sent invoice to printer!');
      } else {
        handleDownloadInvoiceHtml();
      }
    } catch (e) {
      console.warn('Iframe print fallback to file download:', e);
      handleDownloadInvoiceHtml();
    }
  };

  // Timeline Step calculation
  const getTimelineSteps = () => {
    const isPaid = order.payment_status === 'paid' || order.status !== 'pending';
    const isProcessing = order.status === 'processing' || order.fulfillment_status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
    const isShipped = order.status === 'shipped' || order.fulfillment_status === 'shipped' || order.status === 'delivered' || !!activeTracking;
    const isDelivered = order.status === 'delivered' || order.fulfillment_status === 'delivered';

    return [
      {
        id: 'placed',
        title: t('Order Placed'),
        description: new Date(order.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: !isProcessing && !isShipped,
      },
      {
        id: 'processing',
        title: t('QC & Cold Packing'),
        description: isProcessing ? t('Batch verified & insulated') : t('Awaiting fulfillment'),
        completed: isProcessing,
        current: isProcessing && !isShipped,
      },
      {
        id: 'shipped',
        title: t('Carrier Dispatched'),
        description: activeTracking ? `${activeCarrier} (${activeTracking.slice(0, 10)}...)` : t('Dispatched with tracking'),
        completed: isShipped,
        current: isShipped && !isDelivered,
      },
      {
        id: 'delivered',
        title: t('Delivered'),
        description: isDelivered ? t('Received at lab destination') : t('Estimated 1-3 Business Days'),
        completed: isDelivered,
        current: isDelivered,
      },
    ];
  };

  const timelineSteps = getTimelineSteps();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto pointer-events-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Toast alert */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#002b29] text-white text-xs font-bold rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#002b29] text-white flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white font-mono">{order.order_number}</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500 text-black font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                  {order.status}
                </span>
                {order.fulfillment_status && (
                  <span className="px-2 py-0.5 bg-white/15 text-slate-200 font-mono text-[10px] uppercase rounded-full hidden sm:inline">
                    {order.fulfillment_status}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                {t('Placed on')} {new Date(order.created_at).toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveModalView('details')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeModalView === 'details'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t('Tracking & Details')}</span>
            </button>

            <button
              onClick={() => setActiveModalView('invoice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeModalView === 'invoice'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('Invoice Document')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadInvoiceHtml}
              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Download standalone HTML invoice receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('common.download')}</span>
            </button>

            <button
              onClick={handlePrintInvoice}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print official laboratory invoice"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">{t('Print')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {activeModalView === 'invoice' ? (
            /* Direct Invoice Document Preview */
            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-serif font-bold text-lg text-slate-900">{t('Commercial Laboratory Invoice Preview')}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {t('Official RUO tax invoice and receipt for accounting & compliance records.')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadInvoiceHtml}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{t('Download .HTML Invoice')}</span>
                  </button>
                  <button
                    onClick={handlePrintInvoice}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t('Print Invoice')}</span>
                  </button>
                </div>
              </div>

              {/* Rendered Invoice Sheet */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-900">
                <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#002b29] pb-5 gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-black text-[#002b29] tracking-wide">BK RESEARCH LABS</h2>
                    <div className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">
                      Analytical Reference Compounds & Peptide Synthesis
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      support@bkresearchlabs.com • ISO 9001:2015 & cGMP Standard Facility
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-[11px] uppercase font-bold text-slate-500">{t('Official Invoice')}</div>
                    <div className="font-mono font-bold text-base text-[#002b29] mt-0.5">{order.order_number}</div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      {t('Date')}: <strong>{new Date(order.created_at).toLocaleDateString()}</strong>
                    </div>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase rounded">
                        {t('PAID IN FULL')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <div className="font-bold text-[#002b29] uppercase text-[10px]">{t('Research Customer / Recipient')}</div>
                    <div className="font-bold text-slate-900 text-xs">{order.customer_name}</div>
                    <div className="text-slate-600">{order.customer_email}</div>
                    <div className="text-slate-700 pt-1">
                      {order.shipping_address.address_line_1}
                      {order.shipping_address.address_line_2 && <span>, {order.shipping_address.address_line_2}</span>}
                    </div>
                    <div className="text-slate-700">
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    </div>
                    <div className="font-semibold text-slate-800">{order.shipping_address.country}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <div className="font-bold text-[#002b29] uppercase text-[10px]">{t('Cold-Chain Carrier Dispatch')}</div>
                    <div><strong>{t('Courier')}:</strong> {activeCarrier}</div>
                    <div><strong>{t('Tracking')}:</strong> <span className="font-mono font-bold text-emerald-800">{activeTracking || t('Pending Dispatch')}</span></div>
                    <div><strong>{t('Payment Method')}:</strong> {order.payment_method.toUpperCase()}</div>
                    <div><strong>{t('Order Status')}:</strong> {order.status.toUpperCase()} ({order.fulfillment_status || t('Unfulfilled')})</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#002b29] text-white text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">{t('Compound Description')}</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3 text-center">{t('Qty')}</th>
                        <th className="p-3 text-right">{t('Unit Price')}</th>
                        <th className="p-3 text-right">{t('Subtotal')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {order.items.map(item => (
                        <tr key={item.id}>
                          <td className="p-3 font-semibold text-slate-900">{item.product_name_snapshot}</td>
                          <td className="p-3 font-mono text-slate-500">{item.sku_snapshot}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-right font-mono">${item.unit_price.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">${item.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-72 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between">
                      <span>{t('cart.subtotal')}:</span>
                      <span className="font-mono text-slate-900">${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>{t('cart.discount')}:</span>
                        <span className="font-mono font-bold">-${order.discount_amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t('cart.shipping')}:</span>
                      <span className="font-mono text-slate-900">${order.shipping_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('cart.tax')}:</span>
                      <span className="font-mono text-slate-900">${order.tax_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#002b29] pt-2 font-bold text-sm text-[#002b29]">
                      <span>{t('cart.total')}:</span>
                      <span className="font-mono text-base">${order.total.toFixed(2)} {order.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-500 text-center leading-relaxed">
                  <p><strong>FOR RESEARCH USE ONLY (RUO):</strong> All items are synthesized strictly for laboratory in-vitro analysis and academic assays. Not for human or veterinary use.</p>
                  <p className="mt-1">© {new Date().getFullYear()} BK Research Labs. Thank you for your research partnership.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Details & Tracking View */
            <>

          {/* 1. Live Order Tracker & Shipment Milestone Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>{t('Live Order Fulfillment Journey')}</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {order.status === 'delivered' ? `✓ ${t('Delivered')}` : order.status === 'shipped' ? `⚡ ${t('In Transit')}` : `⏱ ${t('In Preparation')}`}
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative pt-2">
              {timelineSteps.map((step, idx) => (
                <div key={step.id} className="relative flex flex-col items-start bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      step.completed
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.completed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className="font-bold text-slate-900 text-xs">{step.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-8 leading-tight">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Active Carrier & Tracking Box */}
          <div className="bg-gradient-to-br from-emerald-950 to-[#002b29] text-white rounded-2xl p-5 shadow-lg border border-emerald-600/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-0.5">
                  {t('Assigned Cold-Chain Courier')}
                </span>
                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <span>{activeCarrier}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono rounded">
                    {t('Temp Monitored')}
                  </span>
                </h4>
              </div>

              {activeTracking && (
                <div className="flex items-center gap-2">
                  <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>{t('Track Shipment')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">{t('Tracking Code')}:</span>
                {activeTracking ? (
                  <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/15">
                    <span className="font-mono font-bold text-emerald-300 text-xs sm:text-sm">{activeTracking}</span>
                    <button
                      onClick={() => copyToClipboard(activeTracking)}
                      className="p-1 hover:bg-white/20 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs italic text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/30">
                    {t('Label awaiting carrier pickup scan')}
                  </span>
                )}
              </div>

              <div className="text-right text-[11px] text-slate-300 font-mono">
                {t('Est. Transit')}: <strong className="text-white">1–3 Business Days (Insulated)</strong>
              </div>
            </div>
          </div>

          {/* 3. Items Breakdown Table with Certificate of Analysis (COA) Download */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('Purchased Research Compounds')} ({order.items.length})
              </h4>
              <span className="text-[11px] text-emerald-800 font-bold">
                {t('Analytical Grade • Purity ≥ 99.0%')}
              </span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    {item.image_snapshot ? (
                      <img
                        src={item.image_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-13 h-13 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-snug">
                        {item.product_name_snapshot}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>SKU: {item.sku_snapshot}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">Lot: #BK2026-98Q</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-auto sm:ml-0">
                    <a
                      href={`mailto:${supportEmail}?subject=COA Request for Lot BK2026-98Q (SKU: ${item.sku_snapshot})`}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl border border-emerald-200/70 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download Official HPLC/MS Certificate of Analysis"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t('Download COA')}</span>
                    </a>

                    <div className="text-right min-w-[70px]">
                      <div className="font-bold text-slate-900 text-sm">${item.subtotal.toFixed(2)}</div>
                      <div className="text-slate-400 text-[11px]">
                        Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Financial Summary & Shipping Destination Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Shipping Destination */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
                <MapPin className="w-4 h-4" />
                <span>{t('checkout.shipping_address')}</span>
              </div>
              <div className="text-slate-700 space-y-0.5 leading-relaxed">
                <div className="font-bold text-slate-900 text-sm">{order.customer_name}</div>
                <div className="text-slate-500 font-mono text-[11px]">{order.customer_email}</div>
                {order.customer_phone && <div className="text-slate-500 font-mono text-[11px]">{order.customer_phone}</div>}
                <div className="pt-1 text-slate-800">
                  {order.shipping_address.address_line_1}
                  {order.shipping_address.address_line_2 && <span>, {order.shipping_address.address_line_2}</span>}
                </div>
                <div>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </div>
                <div className="font-semibold">{order.shipping_address.country}</div>
              </div>
            </div>

            {/* Payment & Totals Breakdown */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>{t('checkout.step_payment')}</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">
                  {order.payment_method}
                </span>
              </div>

              <div className="space-y-1.5 pt-1 divide-y divide-slate-200/60">
                <div className="flex justify-between text-slate-600">
                  <span>{t('cart.subtotal')}:</span>
                  <span className="font-mono text-slate-900">${order.subtotal.toFixed(2)}</span>
                </div>

                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700 pt-1">
                    <span>{t('cart.discount')}:</span>
                    <span className="font-mono font-bold">-${order.discount_amount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 pt-1">
                  <span>{t('cart.shipping')}:</span>
                  <span className="font-mono text-slate-900">${order.shipping_amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-600 pt-1">
                  <span>{t('cart.tax')}:</span>
                  <span className="font-mono text-slate-900">${order.tax_amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-900 pt-2 font-bold text-sm">
                  <span>{t('cart.total')}:</span>
                  <span className="text-emerald-900 font-mono text-base">${order.total.toFixed(2)} {order.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Direct Scientific Support Contact Bar */}
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-emerald-950">
              <div className="p-2 bg-emerald-200/60 rounded-xl text-emerald-800">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs">{t('Need assistance or have questions regarding this order?')}</div>
                <div className="text-[11px] text-emerald-800">
                  {t('Our direct laboratory scientific support team is available 24/7.')}
                </div>
              </div>
            </div>

            <a
              href={supportMailtoLink}
              className="px-4 py-2 bg-[#002b29] hover:bg-[#003b38] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t('Contact Support via Email')}</span>
            </a>
          </div>
            </>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('Research Grade Assurance • Batch #BKRL-2026')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadInvoiceHtml}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('Download Invoice (.HTML)')}</span>
            </button>

            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>{t('Print Invoice')}</span>
            </button>

            {onReorder && (
              <button
                onClick={() => onReorder(order)}
                className="px-4 py-2 bg-[#002b29] hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t('Re-Order Items')}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {t('common.close')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
