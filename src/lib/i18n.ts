import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, Product, ProductCategory, CustomPage, SiteSettings } from '../types';
import {
  CATEGORY_TRANSLATIONS,
  PRODUCT_TRANSLATIONS,
  CUSTOM_PAGE_TRANSLATIONS
} from './translationsData';

export {
  CATEGORY_TRANSLATIONS,
  PRODUCT_TRANSLATIONS,
  CUSTOM_PAGE_TRANSLATIONS
};

export interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (keyOrPhrase: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (text) => text,
  dir: 'ltr',
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);
export const useTranslation = useLanguage;

// Canonical structured key-value translations for all 5 supported languages
export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav & Header
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.categories': 'Categories',
    'nav.save_for_later': 'Save for Later',
    'nav.orders': 'Orders & COAs',
    'nav.account': 'My Account',
    'nav.guide': 'User Guide',
    'nav.search_placeholder': 'Search products, COAs, categories, CAS...',
    'nav.cart': 'Cart',
    'nav.sign_in': 'Sign In / Register',
    'nav.sign_out': 'Sign Out',
    'nav.admin_panel': 'Admin Portal',
    'nav.qr_app': 'Mobile Apps & QR',
    'nav.search': 'Search',
    'nav.products': 'Research Products',

    // Hero Section
    'hero.badge': 'ISO 17025 Certified Reference Standards',
    'hero.title': 'Precision Chemical Standards for In Vitro Laboratory Research',
    'hero.subtitle': 'Dual-stage HPLC verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.',
    'hero.primary_cta': 'Explore Research Catalog',
    'hero.secondary_cta': 'View Quality Guarantees',
    'hero.stat_purity': '99.8%+ Purity',
    'hero.stat_purity_desc': 'HPLC & Mass Spec Verified',
    'hero.stat_shipping': 'Fast Priority 1-3 Day',
    'hero.stat_shipping_desc': '1-3 Business Day Delivery',
    'hero.stat_coa': 'Lot-Specific CoA',
    'hero.stat_coa_desc': 'Included with Every Standard',
    'hero.card_batch': 'HPLC BATCH #BKRL-2026-9041',
    'hero.card_purity': 'PURITY: 99.84%',
    'hero.card_desc': 'Analytical Certificate of Analysis verified under ISO 17025 laboratory standards.',

    // Catalog & Filters
    'catalog.eyebrow': 'Certified Catalog',
    'catalog.title': 'Analytical Standards & Compounds',
    'catalog.subtitle': 'High-purity reference materials, compound compounds, and laboratory standards accompanied by lot-specific documentation.',
    'filter.title': 'Catalog Filters',
    'filter.reset': 'Reset Filters',
    'filter.category': 'Research Category',
    'filter.all_products': 'All Products',
    'filter.sort_order': 'Sort Order',
    'filter.sort_featured': 'Featured Standards',
    'filter.sort_price_asc': 'Price: Low to High',
    'filter.sort_price_desc': 'Price: High to Low',
    'filter.sort_newest': 'Newest Compounds',
    'filter.sort_name': 'Product Name (A-Z)',
    'filter.in_stock_only': 'In-Stock Only',
    'filter.featured_only': 'Featured Compounds Only',

    // Product Cards & Badges
    'product.featured': 'Featured Standard',
    'product.coa_verified': 'CoA Verified',
    'product.quick_view': 'Quick View',
    'product.sku': 'SKU',
    'product.save_for_later': 'Save for Later',
    'product.saved': 'Saved',
    'product.age_required': '21+ Required',
    'product.add_to_cart': 'Add to Cart',
    'product.in_stock': 'In Stock',
    'product.out_of_stock': 'Out of Stock',
    'product.view_details': 'View Details',
    'product.purity': 'Purity',
    'product.cas': 'CAS Number',
    'product.formula': 'Molecular Formula',
    'product.storage': 'Storage Conditions',

    // Product Details Modal
    'details.sku': 'SKU',
    'details.category': 'Category',
    'details.chemical_specs': 'Chemical Specifications',
    'details.compliance_ack': 'I confirm that this purchase is strictly intended for scientific laboratory research and in vitro testing.',
    'details.download_coa': 'Download Verified CoA',
    'details.quantity': 'Quantity',
    'details.total_price': 'Total Price',
    'details.add_cart_btn': 'Add to Research Order',
    'details.out_of_stock_btn': 'Currently Unavailable',
    'details.disclaimer_title': 'Laboratory Research Use Only',
    'details.disclaimer_text': 'All chemical compounds and analytical reference materials supplied by BK Research Labs are intended strictly for in vitro laboratory analysis and research purposes. Not for human, veterinary, or household consumption.',

    // Quality Guarantees
    'guarantees.eyebrow': 'Quality Architecture',
    'guarantees.heading': 'Why Research Institutions Choose BKRL',
    'guarantees.card1_title': 'Independent HPLC Analysis',
    'guarantees.card1_desc': 'Every batch undergoes dual-stage HPLC chromatography and mass spectrometry testing prior to packaging.',
    'guarantees.card2_title': 'Fast Priority 1-3 Day',
    'guarantees.card2_desc': 'Fast priority courier dispatch delivers your laboratory compounds directly to your facility within 1-3 business days.',
    'guarantees.card3_title': 'Regulatory Compliance Gate',
    'guarantees.card3_desc': 'Strict age verification and institutional research acknowledgments ensure safe, lawful supply chain integrity.',

    // Footer
    'footer.brand_desc': 'Precision chemical compounds and analytical reference standards for qualified research institutions worldwide.',
    'footer.products_title': 'Research Products',
    'footer.account_title': 'Account & Compliance',
    'footer.save_for_later': 'Save for Later',
    'footer.account_portal': 'Customer Account Portal',
    'footer.user_guide': 'User Laboratory Guide',
    'footer.admin_gateway': 'Administrator Gateway',
    'footer.disclaimer_title': 'Regulatory Notice',
    'footer.disclaimer_text': 'All chemical standards are intended strictly for in vitro laboratory research and analytical calibration. Not for human or therapeutic use.',
    'footer.copyright': '© 2026 BK Research Labs. All chemical compounds are intended strictly for laboratory and scientific in vitro research.',

    // Cart Drawer
    'cart.title': 'Research Cart',
    'cart.empty_title': 'Your Cart is Empty',
    'cart.empty_desc': 'Explore our catalog of certified reference standards and analytical compounds.',
    'cart.free_shipping_qualified': '🎉 You qualify for FREE Express Shipping!',
    'cart.free_shipping_needed': 'Add ${amount} more for FREE Express Shipping',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Estimated Shipping',
    'cart.shipping_free': 'FREE',
    'cart.tax': 'Estimated Tax',
    'cart.total': 'Total',
    'cart.checkout_btn': 'Proceed to Secure Checkout',
    'cart.remove': 'Remove',
    'cart.move_to_sfl': 'Save for Later',
    'cart.continue_shopping': 'Continue Shopping',

    // Checkout Flow
    'checkout.title': 'Secure Research Order Checkout',
    'checkout.step_address': 'Shipping Address',
    'checkout.step_compliance': 'Compliance Review',
    'checkout.step_payment': 'Payment Method',
    'checkout.step_confirmation': 'Confirmation',
    'checkout.facility_info': 'Facility & Delivery Address',
    'checkout.first_name': 'First Name / Title',
    'checkout.last_name': 'Last Name',
    'checkout.address1': 'Address Line 1 (Facility / Lab)',
    'checkout.city': 'City',
    'checkout.state': 'State / Province',
    'checkout.zip': 'Postal Code',
    'checkout.country': 'Country',
    'checkout.phone': 'Contact Phone Number',
    'checkout.continue_to_compliance': 'Proceed to Compliance Review',
    'checkout.compliance_title': 'Institutional Compliance & Verification',
    'checkout.compliance_age': 'I certify that I am at least 21 years of age and authorized to purchase laboratory chemicals.',
    'checkout.compliance_research': 'I acknowledge and agree that all purchased substances are strictly for laboratory and scientific in vitro research.',
    'checkout.compliance_shipping': 'I confirm that the shipping destination is a verified laboratory, academic institution, or commercial research facility.',
    'checkout.continue_to_payment': 'Proceed to Payment Method',
    'checkout.payment_title': 'Select Payment Method',
    'checkout.discount_placeholder': 'Discount / Institutional Promo Code',
    'checkout.apply_discount': 'Apply Code',
    'checkout.card_name': 'Name on Card',
    'checkout.card_number': 'Card Number',
    'checkout.card_expiry': 'Expiry Date (MM/YY)',
    'checkout.card_cvc': 'CVC Security Code',
    'checkout.po_number': 'Institutional PO Reference Number',
    'checkout.place_order': 'Authorize & Place Order',
    'checkout.processing': 'Processing Order...',
    'checkout.order_success': 'Order Confirmed & Authorized',
    'checkout.order_thankyou': 'Thank you for your institutional order with BK Research Labs.',
    'checkout.order_number': 'Order Reference Number',
    'checkout.tracking_number': 'Courier Tracking Number',
    'checkout.download_invoice': 'Download Laboratory Invoice',
    'checkout.return_to_store': 'Return to Storefront',

    // Save For Later
    'sfl.title': 'Save for Later',
    'sfl.eyebrow': 'Customer Bookmark Manager',
    'sfl.subtitle': 'Review saved research items, check current analytical pricing, and move products directly into your cart.',
    'sfl.empty_title': 'Your Save for Later list is empty',
    'sfl.empty_desc': 'Browse the catalog to bookmark certified reference standards and compounds for future research orders.',
    'sfl.move_to_cart': 'Move to Cart',
    'sfl.remove': 'Remove from Saved',
    'sfl.browse_catalog': 'Browse Shop Products',

    // Age Gate
    'agegate.title': 'Institutional Age Verification',
    'agegate.message': 'In compliance with chemical laboratory supply regulations, access to analytical reference standards requires verification of legal age.',
    'agegate.warning': 'By proceeding, you verify that you meet the minimum age requirement of 21 years and acknowledge that all chemical items are restricted to laboratory in vitro research.',
    'agegate.btn_over21': 'I am 21 or older',
    'agegate.btn_under21': 'I am under 21',
    'agegate.restricted_title': 'Access Restricted',
    'agegate.restricted_desc': 'In compliance with research compound guidelines, visitors under 21 years of age cannot access BK Research Labs product catalog or ordering services.',
    'agegate.back_btn': 'Back to Age Verification',

    // Auth Modal
    'auth.signin_title': 'Sign In to BKRL Portal',
    'auth.register_title': 'Register Institutional Account',
    'auth.tab_signin': 'Sign In',
    'auth.tab_register': 'Register New Account',
    'auth.email': 'Email Address / Username',
    'auth.password': 'Account Password',
    'auth.first_name': 'First Name / Title',
    'auth.last_name': 'Last Name',
    'auth.signin_btn': 'Sign In to Account',
    'auth.register_btn': 'Create Institutional Account',
    'auth.google_signin': 'Continue with Google',
    'auth.google_signup': 'Sign Up with Google',
    'auth.or': 'OR',
    'auth.or_password': 'OR WITH PASSWORD',

    // Search Modal
    'search.title': 'Search Research Catalog',
    'search.placeholder': 'Search compounds, CAS, formulas, categories, COAs...',
    'search.products_tab': 'Compounds & Standards',
    'search.coa_tab': 'COA Documents',
    'search.no_results': 'No matching research items found.',
    'guide.no_search_results_desc': 'No SOP steps or features matched "{query}". Try searching for broader terms like "order", "label", "email", "payment", or reset search.',

    // Common
    'common.language': 'Language',
    'common.device_mode': 'Device View',
    'common.in_stock': 'In Stock',
    'common.out_of_stock': 'Out of Stock',
    'common.download': 'Download',
    'common.close': 'Close',
    'common.back': 'Back',
  },

  ar: {
    // Nav & Header
    'nav.home': 'الرئيسية',
    'nav.shop': 'المتجر',
    'nav.categories': 'الفئات',
    'nav.save_for_later': 'حفظ لوقت لاحق',
    'nav.orders': 'الطلبات وشهادات التحليل',
    'nav.account': 'حسابي',
    'nav.guide': 'دليل الاستخدام',
    'nav.search_placeholder': 'البحث عن المركبات، شهادات التحليل، الفئات...',
    'nav.cart': 'السلة',
    'nav.sign_in': 'تسجيل الدخول / إنشاء حساب',
    'nav.sign_out': 'تسجيل الخروج',
    'nav.admin_panel': 'بوابة الإدارة',
    'nav.qr_app': 'تطبيق الجوال QR',
    'nav.search': 'بحث',
    'nav.products': 'المنتجات البحثية',

    // Hero Section
    'hero.badge': 'معايير مرجعية معتمدة وفق ISO 17025',
    'hero.title': 'معايير كيميائية عالية الدقة للبحوث المخبرية المتخصصة',
    'hero.subtitle': 'مركبات كيميائية ومعايير جزيئية موثقة باختبارات HPLC المزدوجة، يتم توريدها مباشرة إلى المراكز البحثية والمختبرات المعتمدة حول العالم.',
    'hero.primary_cta': 'استكشاف دليل المركبات',
    'hero.secondary_cta': 'عرض ضمانات الجودة',
    'hero.stat_purity': 'نقاء 99.8%+',
    'hero.stat_purity_desc': 'موثق باختبارات HPLC ومطياف الكتلة',
    'hero.stat_shipping': 'شحن سريع 1-3 أيام',
    'hero.stat_shipping_desc': 'توصيل مباشر خلال 1-3 أيام عمل',
    'hero.stat_coa': 'شهادة تحليل لكل دفعة',
    'hero.stat_coa_desc': 'مرفقة مع كل مركب قياسي',
    'hero.card_batch': 'دفعة HPLC #BKRL-2026-9041',
    'hero.card_purity': 'نسبة النقاء: 99.84%',
    'hero.card_desc': 'شهادة تحليل معتمدة ومطابقة لمعايير مختبرات ISO 17025 الدولية.',

    // Catalog & Filters
    'catalog.eyebrow': 'الكتالوج المعتمد',
    'catalog.title': 'المعايير والأنماط الكيميائية التحليلية',
    'catalog.subtitle': 'مواد مرجعية فائقة النقاء، ومركبات مخبرية مدعومة بالتوثيق الشامل لكل دفعة تشغيلية.',
    'filter.title': 'تصفية الكتالوج',
    'filter.reset': 'إعادة ضبط الفلاتر',
    'filter.category': 'الفئة البحثية',
    'filter.all_products': 'جميع المنتجات',
    'filter.sort_order': 'ترتيب حسب',
    'filter.sort_featured': 'المركبات المميزة',
    'filter.sort_price_asc': 'السعر: من الأقل للأعلى',
    'filter.sort_price_desc': 'السعر: من الأعلى للأقل',
    'filter.sort_newest': 'أحدث المركبات المضافة',
    'filter.sort_name': 'اسم المنتج (أ-ي)',
    'filter.in_stock_only': 'المتوفر بالمخزون فقط',
    'filter.featured_only': 'المركبات المميزة فقط',

    // Product Cards & Badges
    'product.featured': 'معيار مميز',
    'product.coa_verified': 'موثق بشهادة CoA',
    'product.quick_view': 'معاينة سريعة',
    'product.sku': 'رمز المنتج SKU',
    'product.save_for_later': 'حفظ لوقت لاحق',
    'product.saved': 'محفوظ',
    'product.age_required': 'يتطلب 21 عاماً فأكثر',
    'product.add_to_cart': 'إضافة إلى السلة',
    'product.in_stock': 'متوفر بالمخزون',
    'product.out_of_stock': 'نفد من المخزون',
    'product.view_details': 'عرض التفاصيل',
    'product.purity': 'درجة النقاء',
    'product.cas': 'رقم تسجيل CAS',
    'product.formula': 'الصيغة الجزيئية',
    'product.storage': 'شروط التخزين والحفظ',

    // Product Details Modal
    'details.sku': 'رمز المنتج',
    'details.category': 'الفئة',
    'details.chemical_specs': 'المواصفات الكيميائية والفيزيائية',
    'details.compliance_ack': 'أؤكد بموجب هذا أن عملية الشراء مخصصة حصرياً للأبحاث العلمية المخبرية والتجارب الأنبوبية (In Vitro).',
    'details.download_coa': 'تحميل شهادة التحليل المعتمدة (CoA)',
    'details.quantity': 'الكمية المطلوبة',
    'details.total_price': 'السعر الإجمالي',
    'details.add_cart_btn': 'إضافة إلى طلب البحث',
    'details.out_of_stock_btn': 'غير متوفر حالياً',
    'details.disclaimer_title': 'مخصص للأغراض البحثية المخبرية فقط',
    'details.disclaimer_text': 'جميع المركبات الكيميائية والمواد المرجعية الموردة من مختبرات BK مخصصة حصرياً للتحليل المخبري والبحث العلمي. غير مخصصة للاستهلاك البشري أو البيطري أو المنزلي.',

    // Quality Guarantees
    'guarantees.eyebrow': 'بنية الجودة المعتمدة',
    'guarantees.heading': 'لماذا تختار المؤسسات والمراكز البحثية مختبرات BKRL؟',
    'guarantees.card1_title': 'تحليل HPLC مستقل ومعتمد',
    'guarantees.card1_desc': 'تخضع كل دفعة إنتاجية لاختبارات الفصل الكروماتوغرافي السائل عالي الأداء ومطياف الكتلة قبل التعبئة.',
    'guarantees.card2_title': 'شحن سريع ذو أولوية 1-3 أيام',
    'guarantees.card2_desc': 'خدمة التوصيل السريع المباشر تضمن وصول المركبات الكيميائية إلى مقر مختبركم خلال 1 إلى 3 أيام عمل.',
    'guarantees.card3_title': 'بوابة التحقق والامتثال التنظيمي',
    'guarantees.card3_desc': 'إجراءات صارمة للتحقق من السن وتأكيد الصفة البحثية لضمان سلامة وقانونية سلسلة التوريد.',

    // Footer
    'footer.brand_desc': 'مركبات كيميائية دقيقة ومعايير مرجعية معتمدة للمؤسسات البحثية والجامعات حول العالم.',
    'footer.products_title': 'المنتجات البحثية',
    'footer.account_title': 'الحساب والامتثال',
    'footer.save_for_later': 'حفظ لوقت لاحق',
    'footer.account_portal': 'بوابة حساب العميل',
    'footer.user_guide': 'دليل بروتوكولات المختبر',
    'footer.admin_gateway': 'بوابة المسؤولين',
    'footer.disclaimer_title': 'إشعار الامتثال التنظيمي',
    'footer.disclaimer_text': 'جميع المعايير والمركبات الكيميائية مخصصة حصرياً للأبحاث العلمية المخبرية والمعايرة التحليلية. غير مخصصة للاستخدام العلاجي أو البشري.',
    'footer.copyright': '© 2026 مختبرات BK للبحوث. جميع المركبات الكيميائية مخصصة حصرياً للأبحاث العلمية المخبرية.',

    // Cart Drawer
    'cart.title': 'سلة المشتريات البحثية',
    'cart.empty_title': 'سلة التسوق فارغة حالياً',
    'cart.empty_desc': 'تفضل باستعراض الكتالوج لاختيار المعايير التحليلية والمركبات المطلوبة لأبحاثك.',
    'cart.free_shipping_qualified': '🎉 مبروك! طلبك مؤهل للشحن السريع المجاني!',
    'cart.free_shipping_needed': 'أضف ${amount} إضافية للحصول على شحن سريع مجاني',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.shipping': 'الشحن التقديري',
    'cart.shipping_free': 'مجاناً',
    'cart.tax': 'الضريبة التقديرية',
    'cart.total': 'الإجمالي النهائي',
    'cart.checkout_btn': 'المتابعة لإتمام الطلب والدفع',
    'cart.remove': 'إزالة',
    'cart.move_to_sfl': 'حفظ لوقت لاحق',
    'cart.continue_shopping': 'متابعة التسوق',

    // Checkout Flow
    'checkout.title': 'إتمام الطلب والدفع الآمن',
    'checkout.step_address': 'عنوان الشحن والمنشأة',
    'checkout.step_compliance': 'مراجعة الامتثال',
    'checkout.step_payment': 'طريقة الدفع',
    'checkout.step_confirmation': 'تأكيد الطلب',
    'checkout.facility_info': 'بيانات المنشأة البحثية وعنوان التسليم',
    'checkout.first_name': 'الاسم الأول / اللقب',
    'checkout.last_name': 'اسم العائلة',
    'checkout.address1': 'العنوان الأول (المختبر / المؤسسة)',
    'checkout.city': 'المدينة',
    'checkout.state': 'الولاية / المقاطعة',
    'checkout.zip': 'الرمز البريدي',
    'checkout.country': 'الدولة',
    'checkout.phone': 'رقم هاتف التواصل',
    'checkout.continue_to_compliance': 'المتابعة لمراجعة الامتثال',
    'checkout.compliance_title': 'الإقرارات والامتثال المؤسسي',
    'checkout.compliance_age': 'أقر بأن عمري لا يقل عن 21 عاماً ومخول نظامياً بشراء المواد الكيميائية البحثية.',
    'checkout.compliance_research': 'أوافق على أن جميع المواد المشتراة مخصصة حصرياً للأبحاث العلمية والتجارب المخبرية.',
    'checkout.compliance_shipping': 'أؤكد أن وجهة الشحن هي مختبر معتمد أو مؤسسة أكاديمية أو منشأة أبحاث تجارية.',
    'checkout.continue_to_payment': 'المتابعة لاختيار طريقة الدفع',
    'checkout.payment_title': 'اختر طريقة الدفع المعتمدة',
    'checkout.discount_placeholder': 'كود الخصم أو الرمز الترويجي المؤسسي',
    'checkout.apply_discount': 'تطبيق الرمز',
    'checkout.card_name': 'الاسم المطبوع على البطاقة',
    'checkout.card_number': 'رقم البطاقة الائتمانية',
    'checkout.card_expiry': 'تاريخ الانتهاء (شهر/سنة)',
    'checkout.card_cvc': 'رمز الأمان (CVC)',
    'checkout.po_number': 'رقم أمر الشراء المؤسسي (PO)',
    'checkout.place_order': 'تأكيد وإرسال الطلب',
    'checkout.processing': 'جاري معالجة الطلب...',
    'checkout.order_success': 'تم تأكيد الطلب بنجاح',
    'checkout.order_thankyou': 'شكراً لتعاملكم المؤسسي مع مختبرات BK للبحوث.',
    'checkout.order_number': 'رقم مرجع الطلب',
    'checkout.tracking_number': 'رقم تتبع الشحنة',
    'checkout.download_invoice': 'تحميل الفاتورة المخبرية',
    'checkout.return_to_store': 'العودة إلى المتجر',

    // Save For Later
    'sfl.title': 'حفظ لوقت لاحق',
    'sfl.eyebrow': 'مدير الإشارات المرجعية للعميل',
    'sfl.subtitle': 'مراجعة المواد البحثية المحفوظة، ومتابعة الأسعار، ونقل المركبات مباشرة إلى السلة.',
    'sfl.empty_title': 'قائمة الحفظ لوقت لاحق فارغة',
    'sfl.empty_desc': 'تصفح الكتالوج لحفظ المعايير المرجعية والمركبات المطلوبة لطلبياتك القادمة.',
    'sfl.move_to_cart': 'نقل إلى السلة',
    'sfl.remove': 'حذف من المحفوظات',
    'sfl.browse_catalog': 'استعراض منتجات المتجر',

    // Age Gate
    'agegate.title': 'التحقق من السن القانوني للمنشأة',
    'agegate.message': 'امتثالاً للوائح توريد المواد الكيميائية المخبرية، يتطلب الدخول إلى كتالوج المعايير التحليلية تأكيد السن القانوني.',
    'agegate.warning': 'بالمتابعة، فإنك تقر بأنك تبلغ من العمر 21 عاماً على الأقل وتوافق على أن جميع المواد مقصورة على الأبحاث المخبرية.',
    'agegate.btn_over21': 'عمري 21 عاماً أو أكثر',
    'agegate.btn_under21': 'عمري أقل من 21 عاماً',
    'agegate.restricted_title': 'الوصول مقيد',
    'agegate.restricted_desc': 'امتثالاً لتعليمات المواد البحثية، لا يُسمح للزوار دون سن 21 عاماً بالوصول إلى خدمات وكتالوج مختبرات BK للبحوث.',
    'agegate.back_btn': 'العودة إلى نافذة التحقق',

    // Auth Modal
    'auth.signin_title': 'تسجيل الدخول إلى بوابة BKRL',
    'auth.register_title': 'تسجيل حساب مؤسسي جديد',
    'auth.tab_signin': 'تسجيل الدخول',
    'auth.tab_register': 'تسجيل حساب جديد',
    'auth.email': 'البريد الإلكتروني / اسم المستخدم',
    'auth.password': 'كلمة مرور الحساب',
    'auth.first_name': 'الاسم الأول / الصفة',
    'auth.last_name': 'اسم العائلة',
    'auth.signin_btn': 'تسجيل الدخول إلى الحساب',
    'auth.register_btn': 'إنشاء الحساب المؤسسي',
    'auth.google_signin': 'المتابعة باستخدام Google',
    'auth.google_signup': 'التسجيل باستخدام Google',
    'auth.or': 'أو',
    'auth.or_password': 'أو المتابعة بكلمة المرور',

    // Search Modal
    'search.title': 'البحث في كتالوج الأبحاث',
    'search.placeholder': 'ابحث عن المركبات، أرقام CAS، الصيغ الكيميائية، شهادات التحليل...',
    'search.products_tab': 'المركبات والمعايير القياسية',
    'search.coa_tab': 'وثائق شهادات التحليل (CoA)',
    'search.no_results': 'لم يتم العثور على مركبات مطابقة.',
    'guide.no_search_results_desc': 'لم تتطابق أي خطوات أو ميزات مع "{query}". جرب البحث بمصطلحات أوسع مثل "طلب" أو "ملصق" أو "بريد" أو "دفع"، أو أعد ضبط البحث.',

    // Common
    'common.language': 'اللغة',
    'common.device_mode': 'معاينة الجهاز',
    'common.in_stock': 'متوفر بالمخزون',
    'common.out_of_stock': 'نفد من المخزون',
    'common.download': 'تحميل',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
  },

  es: {
    // Nav & Header
    'nav.home': 'Inicio',
    'nav.shop': 'Tienda',
    'nav.categories': 'Categorías',
    'nav.save_for_later': 'Guardar para después',
    'nav.orders': 'Pedidos y CoA',
    'nav.account': 'Mi Cuenta',
    'nav.guide': 'Guía de Usuario',
    'nav.search_placeholder': 'Buscar productos, CoA, categorías, CAS...',
    'nav.cart': 'Carrito',
    'nav.sign_in': 'Iniciar Sesión / Registro',
    'nav.sign_out': 'Cerrar Sesión',
    'nav.admin_panel': 'Panel de Administración',
    'nav.qr_app': 'App Móvil y QR',
    'nav.search': 'Buscar',
    'nav.products': 'Productos de Investigación',

    // Hero Section
    'hero.badge': 'Estándares de Referencia Certificados ISO 17025',
    'hero.title': 'Estándares Químicos de Precisión para Investigación de Laboratorio',
    'hero.subtitle': 'Compuestos verificados por HPLC en dos etapas y productos químicos analíticos suministrados directamente a centros de investigación autorizados.',
    'hero.primary_cta': 'Explorar Catálogo Científico',
    'hero.secondary_cta': 'Ver Garantías de Calidad',
    'hero.stat_purity': '99.8%+ Pureza',
    'hero.stat_purity_desc': 'Verificado por HPLC y Espectrometría',
    'hero.stat_shipping': 'Envío Prioritario 1-3 Días',
    'hero.stat_shipping_desc': 'Entrega en 1-3 Días Hábiles',
    'hero.stat_coa': 'CoA Específico por Lote',
    'hero.stat_coa_desc': 'Incluido con Cada Estándar',
    'hero.card_batch': 'LOTE HPLC #BKRL-2026-9041',
    'hero.card_purity': 'PUREZA: 99.84%',
    'hero.card_desc': 'Certificado de Análisis analítico verificado bajo estándares de laboratorio ISO 17025.',

    // Catalog & Filters
    'catalog.eyebrow': 'Catálogo Certificado',
    'catalog.title': 'Estándares y Compuestos Analíticos',
    'catalog.subtitle': 'Materiales de referencia de alta pureza y estándares de laboratorio acompañados de documentación analítica completa.',
    'filter.title': 'Filtros del Catálogo',
    'filter.reset': 'Restablecer Filtros',
    'filter.category': 'Categoría de Investigación',
    'filter.all_products': 'Todos los Productos',
    'filter.sort_order': 'Ordenar por',
    'filter.sort_featured': 'Estándares Destacados',
    'filter.sort_price_asc': 'Precio: Menor a Mayor',
    'filter.sort_price_desc': 'Precio: Mayor a Menor',
    'filter.sort_newest': 'Compuestos más Nuevos',
    'filter.sort_name': 'Nombre del Producto (A-Z)',
    'filter.in_stock_only': 'Solo en Stock',
    'filter.featured_only': 'Solo Compuestos Destacados',

    // Product Cards & Badges
    'product.featured': 'Estándar Destacado',
    'product.coa_verified': 'CoA Verificado',
    'product.quick_view': 'Vista Rápida',
    'product.sku': 'SKU',
    'product.save_for_later': 'Guardar para después',
    'product.saved': 'Guardado',
    'product.age_required': 'Mayor de 21 Requerido',
    'product.add_to_cart': 'Añadir al Carrito',
    'product.in_stock': 'En Stock',
    'product.out_of_stock': 'Agotado',
    'product.view_details': 'Ver Detalles',
    'product.purity': 'Pureza',
    'product.cas': 'Número CAS',
    'product.formula': 'Fórmula Molecular',
    'product.storage': 'Condiciones de Almacenamiento',

    // Product Details Modal
    'details.sku': 'SKU',
    'details.category': 'Categoría',
    'details.chemical_specs': 'Especificaciones Químicas',
    'details.compliance_ack': 'Confirmo que esta compra está estrictamente destinada a investigación científica de laboratorio in vitro.',
    'details.download_coa': 'Descargar CoA Verificado',
    'details.quantity': 'Cantidad',
    'details.total_price': 'Precio Total',
    'details.add_cart_btn': 'Añadir al Pedido de Investigación',
    'details.out_of_stock_btn': 'No Disponible Actualmente',
    'details.disclaimer_title': 'Solo para Uso de Investigación de Laboratorio',
    'details.disclaimer_text': 'Todos los compuestos químicos suministrados por BK Research Labs están destinados estrictamente para análisis e investigación de laboratorio in vitro. No para consumo humano o veterinario.',

    // Quality Guarantees
    'guarantees.eyebrow': 'Arquitectura de Calidad',
    'guarantees.heading': 'Por Qué las Instituciones Eligen BKRL',
    'guarantees.card1_title': 'Análisis HPLC Independiente',
    'guarantees.card1_desc': 'Cada lote se somete a pruebas de cromatografía HPLC y espectrometría de masas en dos etapas.',
    'guarantees.card2_title': 'Envío Prioritario en 1-3 Días',
    'guarantees.card2_desc': 'El servicio de mensajería urgente entrega sus compuestos directamente a su instalación en 1-3 días hábiles.',
    'guarantees.card3_title': 'Filtro de Cumplimiento Normativo',
    'guarantees.card3_desc': 'La estricta verificación de edad y acreditación institucional garantizan una cadena de suministro segura y legal.',

    // Footer
    'footer.brand_desc': 'Compuestos químicos de precisión y estándares de referencia para centros de investigación cualificados en todo el mundo.',
    'footer.products_title': 'Productos de Investigación',
    'footer.account_title': 'Cuenta y Cumplimiento',
    'footer.save_for_later': 'Guardar para después',
    'footer.account_portal': 'Portal de Cuenta de Cliente',
    'footer.user_guide': 'Guía de Protocolo de Laboratorio',
    'footer.admin_gateway': 'Portal de Administrador',
    'footer.disclaimer_title': 'Aviso Normativo',
    'footer.disclaimer_text': 'Todos los estándares químicos son estrictamente para investigación in vitro y calibración de laboratorio. No para uso humano.',
    'footer.copyright': '© 2026 BK Research Labs. Todos los compuestos químicos están destinados estrictamente a la investigación in vitro.',

    // Cart Drawer
    'cart.title': 'Carrito de Investigación',
    'cart.empty_title': 'Su Carrito está Vacío',
    'cart.empty_desc': 'Explore nuestro catálogo de estándares de referencia certificados y compuestos analíticos.',
    'cart.free_shipping_qualified': '🎉 ¡Califica para Envío Exprés GRATIS!',
    'cart.free_shipping_needed': 'Añada ${amount} más para Envío Exprés GRATIS',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Envío Estimado',
    'cart.shipping_free': 'GRATIS',
    'cart.tax': 'Impuesto Estimado',
    'cart.total': 'Total',
    'cart.checkout_btn': 'Proceder al Pago Seguro',
    'cart.remove': 'Eliminar',
    'cart.move_to_sfl': 'Guardar para después',
    'cart.continue_shopping': 'Continuar Comprando',

    // Checkout Flow
    'checkout.title': 'Pago Seguro de Pedido de Investigación',
    'checkout.step_address': 'Dirección de Envío',
    'checkout.step_compliance': 'Revisión de Cumplimiento',
    'checkout.step_payment': 'Método de Pago',
    'checkout.step_confirmation': 'Confirmación',
    'checkout.facility_info': 'Información de la Instalación y Envío',
    'checkout.first_name': 'Nombre / Título',
    'checkout.last_name': 'Apellido',
    'checkout.address1': 'Dirección 1 (Laboratorio / Instalación)',
    'checkout.city': 'Ciudad',
    'checkout.state': 'Estado / Provincia',
    'checkout.zip': 'Código Postal',
    'checkout.country': 'País',
    'checkout.phone': 'Teléfono de Contacto',
    'checkout.continue_to_compliance': 'Continuar a Revisión de Cumplimiento',
    'checkout.compliance_title': 'Cumplimiento y Verificación Institucional',
    'checkout.compliance_age': 'Certifico que tengo al menos 21 años y estoy autorizado para comprar químicos de laboratorio.',
    'checkout.compliance_research': 'Reconozco y acepto que todas las sustancias son estrictamente para investigación in vitro.',
    'checkout.compliance_shipping': 'Confirmo que el destino de envío es un laboratorio o centro de investigación verificado.',
    'checkout.continue_to_payment': 'Proceder al Método de Pago',
    'checkout.payment_title': 'Seleccionar Método de Pago',
    'checkout.discount_placeholder': 'Código de Descuento Institucional',
    'checkout.apply_discount': 'Aplicar',
    'checkout.card_name': 'Nombre en la Tarjeta',
    'checkout.card_number': 'Número de Tarjeta',
    'checkout.card_expiry': 'Fecha de Vencimiento (MM/AA)',
    'checkout.card_cvc': 'Código de Seguridad CVC',
    'checkout.po_number': 'Número de Orden de Compra (PO)',
    'checkout.place_order': 'Autorizar y Realizar Pedido',
    'checkout.processing': 'Procesando Pedido...',
    'checkout.order_success': 'Pedido Confirmado y Autorizado',
    'checkout.order_thankyou': 'Gracias por su pedido institucional con BK Research Labs.',
    'checkout.order_number': 'Número de Referencia de Pedido',
    'checkout.tracking_number': 'Número de Seguimiento de Envío',
    'checkout.download_invoice': 'Descargar Factura de Laboratorio',
    'checkout.return_to_store': 'Volver a la Tienda',

    // Save For Later
    'sfl.title': 'Guardar para después',
    'sfl.eyebrow': 'Gestor de Marcadores de Cliente',
    'sfl.subtitle': 'Revise los artículos de investigación guardados y muévalos directamente a su carrito.',
    'sfl.empty_title': 'Su lista de guardados está vacía',
    'sfl.empty_desc': 'Explore el catálogo para marcar estándares de referencia para pedidos futuros.',
    'sfl.move_to_cart': 'Mover al Carrito',
    'sfl.remove': 'Eliminar de Guardados',
    'sfl.browse_catalog': 'Explorar Catálogo',

    // Age Gate
    'agegate.title': 'Verificación Institucional de Edad',
    'agegate.message': 'En cumplimiento con las regulaciones de suministro químico, el acceso requiere verificación de mayoría de edad legal.',
    'agegate.warning': 'Al continuar, certifica que tiene al menos 21 años y que todos los productos son para investigación in vitro.',
    'agegate.btn_over21': 'Tengo 21 años o más',
    'agegate.btn_under21': 'Tengo menos de 21 años',
    'agegate.restricted_title': 'Acceso Restringido',
    'agegate.restricted_desc': 'Los visitantes menores de 21 años no pueden acceder al catálogo ni a los servicios de pedidos de BK Research Labs.',
    'agegate.back_btn': 'Volver a Verificación',

    // Auth Modal
    'auth.signin_title': 'Iniciar Sesión en el Portal BKRL',
    'auth.register_title': 'Registrar Cuenta Institucional',
    'auth.tab_signin': 'Iniciar Sesión',
    'auth.tab_register': 'Crear Cuenta',
    'auth.email': 'Correo Electrónico / Usuario',
    'auth.password': 'Contraseña de la Cuenta',
    'auth.first_name': 'Nombre / Título',
    'auth.last_name': 'Apellido',
    'auth.signin_btn': 'Iniciar Sesión',
    'auth.register_btn': 'Crear Cuenta Institucional',
    'auth.google_signin': 'Continuar con Google',
    'auth.google_signup': 'Registrarse con Google',
    'auth.or': 'O',
    'auth.or_password': 'O CON CONTRASEÑA',

    // Search Modal
    'search.title': 'Buscar en el Catálogo de Investigación',
    'search.placeholder': 'Buscar compuestos, CAS, fórmulas, CoA...',
    'search.products_tab': 'Compuestos y Estándares',
    'search.coa_tab': 'Documentos CoA',
    'search.no_results': 'No se encontraron resultados coincidentes.',
    'guide.no_search_results_desc': 'No se encontraron pasos de SOP o funciones que coincidan con "{query}". Intente buscar términos más amplios o restablecer la búsqueda.',

    // Common
    'common.language': 'Idioma',
    'common.device_mode': 'Vista de Dispositivo',
    'common.in_stock': 'En Stock',
    'common.out_of_stock': 'Agotado',
    'common.download': 'Descargar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
  },

  fr: {
    // Nav & Header
    'nav.home': 'Accueil',
    'nav.shop': 'Boutique',
    'nav.categories': 'Catégories',
    'nav.save_for_later': 'Mettre de côté',
    'nav.orders': 'Commandes & CoA',
    'nav.account': 'Mon Compte',
    'nav.guide': 'Guide Utilisateur',
    'nav.search_placeholder': 'Rechercher des produits, CoA, catégories...',
    'nav.cart': 'Panier',
    'nav.sign_in': 'Connexion / Inscription',
    'nav.sign_out': 'Déconnexion',
    'nav.admin_panel': 'Portail Admin',
    'nav.qr_app': 'Application Mobile & QR',
    'nav.search': 'Recherche',
    'nav.products': 'Produits de Recherche',

    // Hero Section
    'hero.badge': 'Normes de Référence Certifiées ISO 17025',
    'hero.title': 'Standards Chimiques de Haute Précision pour la Recherche en Laboratoire',
    'hero.subtitle': 'Composés vérifiés par HPLC à double étage et produits chimiques analytiques livrés directement aux laboratoires agréés du monde entier.',
    'hero.primary_cta': 'Explorer le Catalogue',
    'hero.secondary_cta': 'Voir les Garanties de Qualité',
    'hero.stat_purity': 'Pureté 99.8%+',
    'hero.stat_purity_desc': 'Vérifié par HPLC et Spectrométrie de Masse',
    'hero.stat_shipping': 'Livraison Prioritaire 1-3 Jours',
    'hero.stat_shipping_desc': 'Livraison en 1-3 Jours Ouvrés',
    'hero.stat_coa': 'CoA Spécifique par Lot',
    'hero.stat_coa_desc': 'Inclus avec Chaque Produit',
    'hero.card_batch': 'LOT HPLC #BKRL-2026-9041',
    'hero.card_purity': 'PURETÉ: 99.84%',
    'hero.card_desc': 'Certificat d\'Analyse validé selon les normes de laboratoire ISO 17025.',

    // Catalog & Filters
    'catalog.eyebrow': 'Catalogue Certifié',
    'catalog.title': 'Standards et Composés Analytiques',
    'catalog.subtitle': 'Matériaux de référence de haute pureté et réactifs de laboratoire avec documentation analytique intégrale.',
    'filter.title': 'Filtres du Catalogue',
    'filter.reset': 'Réinitialiser les Filtres',
    'filter.category': 'Catégorie de Recherche',
    'filter.all_products': 'Tous les Produits',
    'filter.sort_order': 'Trier par',
    'filter.sort_featured': 'Standards en Vedette',
    'filter.sort_price_asc': 'Prix: Croissant',
    'filter.sort_price_desc': 'Prix: Décroissant',
    'filter.sort_newest': 'Nouveaux Composés',
    'filter.sort_name': 'Nom du Produit (A-Z)',
    'filter.in_stock_only': 'En Stock Uniquement',
    'filter.featured_only': 'Composés en Vedette Uniquement',

    // Product Cards & Badges
    'product.featured': 'Standard en Vedette',
    'product.coa_verified': 'CoA Vérifié',
    'product.quick_view': 'Aperçu Rapide',
    'product.sku': 'SKU',
    'product.save_for_later': 'Mettre de côté',
    'product.saved': 'Enregistré',
    'product.age_required': '21+ Requis',
    'product.add_to_cart': 'Ajouter au Panier',
    'product.in_stock': 'En Stock',
    'product.out_of_stock': 'Rupture de Stock',
    'product.view_details': 'Voir Détails',
    'product.purity': 'Pureté',
    'product.cas': 'Numéro CAS',
    'product.formula': 'Formule Moléculaire',
    'product.storage': 'Conditions de Stockage',

    // Product Details Modal
    'details.sku': 'SKU',
    'details.category': 'Catégorie',
    'details.chemical_specs': 'Spécifications Chimiques',
    'details.compliance_ack': 'Je confirme que cet achat est strictement destiné à la recherche scientifique en laboratoire in vitro.',
    'details.download_coa': 'Télécharger le CoA Certifié',
    'details.quantity': 'Quantité',
    'details.total_price': 'Prix Total',
    'details.add_cart_btn': 'Ajouter à la Commande',
    'details.out_of_stock_btn': 'Actuellement Indisponible',
    'details.disclaimer_title': 'Usage Exclusif en Recherche de Laboratoire',
    'details.disclaimer_text': 'Tous les composés chimiques fournis par BK Research Labs sont strictement réservés à la recherche in vitro. Non destinés à la consommation humaine ou animale.',

    // Quality Guarantees
    'guarantees.eyebrow': 'Architecture Qualité',
    'guarantees.heading': 'Pourquoi les Laboratoires Choisissent BKRL',
    'guarantees.card1_title': 'Analyse HPLC Indépendante',
    'guarantees.card1_desc': 'Chaque lot subit une double analyse HPLC et spectrométrie de masse avant son conditionnement.',
    'guarantees.card2_title': 'Livraison Prioritaire en 1-3 Jours',
    'guarantees.card2_desc': 'Notre service de messagerie rapide livre vos réactifs directement à vos installations en 1-3 jours ouvrés.',
    'guarantees.card3_title': 'Contrôle de Conformité Réglementaire',
    'guarantees.card3_desc': 'La vérification d\'âge et l\'authentification institutionnelle assurent la sécurité et la légalité des approvisionnements.',

    // Footer
    'footer.brand_desc': 'Composés chimiques de haute précision et standards de référence pour les centres de recherche agréés du monde entier.',
    'footer.products_title': 'Produits de Recherche',
    'footer.account_title': 'Compte & Conformité',
    'footer.save_for_later': 'Mettre de côté',
    'footer.account_portal': 'Portail de Compte Client',
    'footer.user_guide': 'Guide des Protocoles de Laboratoire',
    'footer.admin_gateway': 'Passerelle Administrateur',
    'footer.disclaimer_title': 'Avis Réglementaire',
    'footer.disclaimer_text': 'Tous les étalons chimiques sont exclusivement destinés à la recherche in vitro et aux étalonnages analytiques.',
    'footer.copyright': '© 2026 BK Research Labs. Tous les composés sont exclusivement réservés à la recherche in vitro.',

    // Cart Drawer
    'cart.title': 'Panier de Recherche',
    'cart.empty_title': 'Votre Panier est Vide',
    'cart.empty_desc': 'Parcourez notre catalogue de standards certifiés et de composés pour vos travaux de recherche.',
    'cart.free_shipping_qualified': '🎉 Vous bénéficiez de la livraison express GRATUITE !',
    'cart.free_shipping_needed': 'Ajoutez ${amount} supplémentaires pour la livraison GRATUITE',
    'cart.subtotal': 'Sous-total',
    'cart.shipping': 'Livraison Estimée',
    'cart.shipping_free': 'GRATUIT',
    'cart.tax': 'Taxe Estimée',
    'cart.total': 'Total',
    'cart.checkout_btn': 'Passer à la Caisse Sécurisée',
    'cart.remove': 'Supprimer',
    'cart.move_to_sfl': 'Mettre de côté',
    'cart.continue_shopping': 'Continuer les Achats',

    // Checkout Flow
    'checkout.title': 'Commande Sécurisée de Laboratoire',
    'checkout.step_address': 'Adresse de Livraison',
    'checkout.step_compliance': 'Revue de Conformité',
    'checkout.step_payment': 'Mode de Paiement',
    'checkout.step_confirmation': 'Confirmation',
    'checkout.facility_info': 'Coordonnées de l\'Établissement & Livraison',
    'checkout.first_name': 'Prénom / Titre',
    'checkout.last_name': 'Nom de Famille',
    'checkout.address1': 'Adresse Ligne 1 (Laboratoire / Centre)',
    'checkout.city': 'Ville',
    'checkout.state': 'Région / Département',
    'checkout.zip': 'Code Postal',
    'checkout.country': 'Pays',
    'checkout.phone': 'Téléphone de Contact',
    'checkout.continue_to_compliance': 'Passer à la Conformité',
    'checkout.compliance_title': 'Attestation de Conformité Institutionnelle',
    'checkout.compliance_age': 'J\'atteste avoir au moins 21 ans et être autorisé à commander des réactifs de laboratoire.',
    'checkout.compliance_research': 'Je reconnais que tous les produits sont exclusivement réservés à la recherche in vitro.',
    'checkout.compliance_shipping': 'Je certifie que le lieu de livraison est un laboratoire ou un établissement de recherche vérifié.',
    'checkout.continue_to_payment': 'Passer au Mode de Paiement',
    'checkout.payment_title': 'Sélectionner le Mode de Paiement',
    'checkout.discount_placeholder': 'Code Promotionnel Institutionnel',
    'checkout.apply_discount': 'Appliquer',
    'checkout.card_name': 'Nom sur la Carte',
    'checkout.card_number': 'Numéro de Carte',
    'checkout.card_expiry': 'Date d\'Expiration (MM/AA)',
    'checkout.card_cvc': 'Code de Sécurité CVC',
    'checkout.po_number': 'Numéro de Bon de Commande (PO)',
    'checkout.place_order': 'Valider et Payer la Commande',
    'checkout.processing': 'Traitement de la commande en cours...',
    'checkout.order_success': 'Commande Validée et Confirmée',
    'checkout.order_thankyou': 'Merci pour votre commande auprès de BK Research Labs.',
    'checkout.order_number': 'Référence de Commande',
    'checkout.tracking_number': 'Numéro de Suivi Colis',
    'checkout.download_invoice': 'Télécharger la Facture Proforma',
    'checkout.return_to_store': 'Retourner à la Boutique',

    // Save For Later
    'sfl.title': 'Mettre de côté',
    'sfl.eyebrow': 'Gestionnaire des Favoris',
    'sfl.subtitle': 'Consultez vos articles de recherche sauvegardés et transférez-les facilement vers votre panier.',
    'sfl.empty_title': 'Votre liste est vide',
    'sfl.empty_desc': 'Consultez le catalogue pour sauvegarder des composés en prévision de vos futures recherches.',
    'sfl.move_to_cart': 'Déplacer dans le Panier',
    'sfl.remove': 'Supprimer des Favoris',
    'sfl.browse_catalog': 'Consulter le Catalogue',

    // Age Gate
    'agegate.title': 'Vérification de l\'Âge Légal',
    'agegate.message': 'Conformément aux directives sur les produits chimiques, l\'accès aux références requiert une vérification d\'âge.',
    'agegate.warning': 'En continuant, vous attestez avoir au moins 21 ans et acceptez l\'utilisation strictement in vitro des produits.',
    'agegate.btn_over21': 'J\'ai 21 ans ou plus',
    'agegate.btn_under21': 'J\'ai moins de 21 ans',
    'agegate.restricted_title': 'Accès Restreint',
    'agegate.restricted_desc': 'L\'accès au catalogue et aux services BK Research Labs est strictement interdit aux moins de 21 ans.',
    'agegate.back_btn': 'Retour à la Vérification',

    // Auth Modal
    'auth.signin_title': 'Connexion au Portail BKRL',
    'auth.register_title': 'Créer un Compte Institutionnel',
    'auth.tab_signin': 'Connexion',
    'auth.tab_register': 'Créer un Compte',
    'auth.email': 'Adresse E-mail / Identifiant',
    'auth.password': 'Mot de Passe',
    'auth.first_name': 'Prénom / Titre',
    'auth.last_name': 'Nom de Famille',
    'auth.signin_btn': 'Se Connecter',
    'auth.register_btn': 'Créer mon Compte',
    'auth.google_signin': 'Continuer avec Google',
    'auth.or': 'OU',

    // Search Modal
    'search.title': 'Rechercher dans le Catalogue',
    'search.placeholder': 'Rechercher composés, CAS, formules, CoA...',
    'search.products_tab': 'Composés & Standards',
    'search.coa_tab': 'Documents CoA',
    'search.no_results': 'Aucun résultat trouvé.',
    'guide.no_search_results_desc': 'Aucune étape de SOP ou fonctionnalité ne correspond à "{query}". Essayez d\'élargir vos termes de recherche ou de réinitialiser.',

    // Common
    'common.language': 'Langue',
    'common.device_mode': 'Affichage Appareil',
    'common.in_stock': 'En Stock',
    'common.out_of_stock': 'Rupture de Stock',
    'common.download': 'Télécharger',
    'common.close': 'Fermer',
    'common.back': 'Retour',
  },

  de: {
    // Nav & Header
    'nav.home': 'Startseite',
    'nav.shop': 'Shop',
    'nav.categories': 'Kategorien',
    'nav.save_for_later': 'Für später speichern',
    'nav.orders': 'Bestellungen & CoA',
    'nav.account': 'Mein Konto',
    'nav.guide': 'Benutzerhandbuch',
    'nav.search_placeholder': 'Produkte, CoA, Kategorien, CAS suchen...',
    'nav.cart': 'Warenkorb',
    'nav.sign_in': 'Anmelden / Registrieren',
    'nav.sign_out': 'Abmelden',
    'nav.admin_panel': 'Admin-Portal',
    'nav.qr_app': 'Mobile App & QR',
    'nav.search': 'Suchen',
    'nav.products': 'Forschungsprodukte',

    // Hero Section
    'hero.badge': 'ISO 17025 Zertifizierte Referenzstandards',
    'hero.title': 'Präzisions-Chemikalienstandards für die Laborforschung',
    'hero.subtitle': 'Doppelstufig HPLC-geprüfte Substanzen und analytische Standards für autorisierte Forschungseinrichtungen weltweit.',
    'hero.primary_cta': 'Katalog Durchsuchen',
    'hero.secondary_cta': 'Qualitätsgarantien Einsehen',
    'hero.stat_purity': '99.8%+ Reinheit',
    'hero.stat_purity_desc': 'HPLC- & Massenspektrometrie-geprüft',
    'hero.stat_shipping': 'Express-Lieferung 1-3 Tage',
    'hero.stat_shipping_desc': '1-3 Werktage Lieferzeit',
    'hero.stat_coa': 'Chargenspezifisches CoA',
    'hero.stat_coa_desc': 'Bei Jedem Standard Enthalten',
    'hero.card_batch': 'HPLC CHARGE #BKRL-2026-9041',
    'hero.card_purity': 'REINHEIT: 99.84%',
    'hero.card_desc': 'Analysenzertifikat gemäß ISO 17025 Laborstandards validiert.',

    // Catalog & Filters
    'catalog.eyebrow': 'Zertifizierter Katalog',
    'catalog.title': 'Analytische Standards & Substanzen',
    'catalog.subtitle': 'Hochreine Referenzmaterialien und Laborstandards mit vollständiger chargenbezogener Dokumentation.',
    'filter.title': 'Katalogfilter',
    'filter.reset': 'Filter Zurücksetzen',
    'filter.category': 'Forschungskategorie',
    'filter.all_products': 'Alle Produkte',
    'filter.sort_order': 'Sortieren Nach',
    'filter.sort_featured': 'Hervorgehobene Standards',
    'filter.sort_price_asc': 'Preis: Aufsteigend',
    'filter.sort_price_desc': 'Preis: Absteigend',
    'filter.sort_newest': 'Neueste Substanzen',
    'filter.sort_name': 'Produktname (A-Z)',
    'filter.in_stock_only': 'Nur Verfügbare Artikel',
    'filter.featured_only': 'Nur Hervorgehobene Artikel',

    // Product Cards & Badges
    'product.featured': 'Hervorgehobener Standard',
    'product.coa_verified': 'CoA Verifiziert',
    'product.quick_view': 'Schnellansicht',
    'product.sku': 'SKU',
    'product.save_for_later': 'Für später speichern',
    'product.saved': 'Gespeichert',
    'product.age_required': 'Ab 21 Jahren',
    'product.add_to_cart': 'In den Warenkorb',
    'product.in_stock': 'Auf Lager',
    'product.out_of_stock': 'Ausverkauft',
    'product.view_details': 'Details Anzeigen',
    'product.purity': 'Reinheit',
    'product.cas': 'CAS-Nummer',
    'product.formula': 'Summenformel',
    'product.storage': 'Lagerbedingungen',

    // Product Details Modal
    'details.sku': 'SKU',
    'details.category': 'Kategorie',
    'details.chemical_specs': 'Chemische Spezifikationen',
    'details.compliance_ack': 'Ich bestätige, dass dieser Erwerb ausschließlich für wissenschaftliche In-vitro-Laboranalysen bestimmt ist.',
    'details.download_coa': 'Geprüftes CoA Herunterladen',
    'details.quantity': 'Menge',
    'details.total_price': 'Gesamtpreis',
    'details.add_cart_btn': 'Zur Forschungsbestellung Hinzufügen',
    'details.out_of_stock_btn': 'Derzeit Nicht Verfügbar',
    'details.disclaimer_title': 'Nur für Wissenschaftliche Laborforschung',
    'details.disclaimer_text': 'Alle von BK Research Labs gelieferten Chemikalien sind ausschließlich für wissenschaftliche Labor- und In-vitro-Forschung vorgesehen. Nicht für den menschlichen oder tierischen Verzehr.',

    // Quality Guarantees
    'guarantees.eyebrow': 'Qualitätsarchitektur',
    'guarantees.heading': 'Warum Forschungsinstitute BKRL Wählen',
    'guarantees.card1_title': 'Unabhängige HPLC-Prüfung',
    'guarantees.card1_desc': 'Jede Charge wird vor dem Abfüllen zweistufig mittels HPLC und Massenspektrometrie verifiziert.',
    'guarantees.card2_title': 'Prioritärer Express-Versand in 1-3 Tagen',
    'guarantees.card2_desc': 'Direkte Expresszustellung liefert Laborchemikalien innerhalb von 1-3 Werktagen an Ihre Einrichtung.',
    'guarantees.card3_title': 'Regulatorische Konformitätsprüfung',
    'guarantees.card3_desc': 'Strenge Altersverifikation und institutionelle Bestätigungen sichern eine gesetzeskonforme Lieferkette.',

    // Footer
    'footer.brand_desc': 'Präzisions-Chemikalien und analytische Standards für autorisierte Forschungseinrichtungen weltweit.',
    'footer.products_title': 'Forschungsprodukte',
    'footer.account_title': 'Konto & Konformität',
    'footer.save_for_later': 'Für später speichern',
    'footer.account_portal': 'Kunden-Portal',
    'footer.user_guide': 'Labor-Handbuch',
    'footer.admin_gateway': 'Administrator-Zugang',
    'footer.disclaimer_title': 'Gesetzlicher Hinweis',
    'footer.disclaimer_text': 'Alle Chemikalienstandards sind ausschließlich für die In-vitro-Laborforschung und analytische Kalibrierung vorgesehen.',
    'footer.copyright': '© 2026 BK Research Labs. Alle Substanzen sind ausschließlich für wissenschaftliche In-vitro-Forschung bestimmt.',

    // Cart Drawer
    'cart.title': 'Warenkorb',
    'cart.empty_title': 'Ihr Warenkorb ist Leer',
    'cart.empty_desc': 'Durchstöbern Sie unseren Katalog nach zertifizierten Standards und Referenzmaterialien.',
    'cart.free_shipping_qualified': '🎉 Sie qualifizieren sich für KOSTENLOSEN Expressversand!',
    'cart.free_shipping_needed': 'Fügen Sie noch ${amount} hinzu für KOSTENLOSEN Versand',
    'cart.subtotal': 'Zwischensumme',
    'cart.shipping': 'Geschätzter Versand',
    'cart.shipping_free': 'KOSTENLOS',
    'cart.tax': 'Geschätzte Steuer',
    'cart.total': 'Gesamtsumme',
    'cart.checkout_btn': 'Zur Sicheren Kasse',
    'cart.remove': 'Entfernen',
    'cart.move_to_sfl': 'Für später speichern',
    'cart.continue_shopping': 'Weiter Einkaufen',

    // Checkout Flow
    'checkout.title': 'Sichere Laborbestellung & Kasse',
    'checkout.step_address': 'Lieferadresse',
    'checkout.step_compliance': 'Konformitätsprüfung',
    'checkout.step_payment': 'Zahlungsart',
    'checkout.step_confirmation': 'Bestätigung',
    'checkout.facility_info': 'Einrichtungsdaten & Lieferanschrift',
    'checkout.first_name': 'Vorname / Titel',
    'checkout.last_name': 'Nachname',
    'checkout.address1': 'Adresszeile 1 (Labor / Institut)',
    'checkout.city': 'Stadt',
    'checkout.state': 'Bundesland / Region',
    'checkout.zip': 'Postleitzahl',
    'checkout.country': 'Land',
    'checkout.phone': 'Telefonnummer',
    'checkout.continue_to_compliance': 'Weiter zur Konformitätsprüfung',
    'checkout.compliance_title': 'Institutionelle Konformitätserklärung',
    'checkout.compliance_age': 'Ich bestätige, dass ich mindestens 21 Jahre alt und zum Bezug von Laborchemikalien berechtigt bin.',
    'checkout.compliance_research': 'Ich stimme zu, dass alle Substanzen ausschließlich für wissenschaftliche In-vitro-Forschung bestimmt sind.',
    'checkout.compliance_shipping': 'Ich bestätige, dass die Lieferadresse eine verifizierte Forschungs- oder Laboreinrichtung ist.',
    'checkout.continue_to_payment': 'Weiter zur Zahlungsart',
    'checkout.payment_title': 'Zahlungsart Auswählen',
    'checkout.discount_placeholder': 'Gutschein- / Rabattcode',
    'checkout.apply_discount': 'Anwenden',
    'checkout.card_name': 'Name auf der Karte',
    'checkout.card_number': 'Kartennummer',
    'checkout.card_expiry': 'Gültig bis (MM/JJ)',
    'checkout.card_cvc': 'Sicherheitscode (CVC)',
    'checkout.po_number': 'Bestellnummer / PO-Referenz',
    'checkout.place_order': 'Verbindlich Bestellen',
    'checkout.processing': 'Bestellung wird verarbeitet...',
    'checkout.order_success': 'Bestellung Erfolgreich Bestätigt',
    'checkout.order_thankyou': 'Vielen Dank für Ihren Auftrag bei BK Research Labs.',
    'checkout.order_number': 'Bestellreferenznummer',
    'checkout.tracking_number': 'Sendungsverfolgungsnummer',
    'checkout.download_invoice': 'Labor-Rechnung Herunterladen',
    'checkout.return_to_store': 'Zurück zum Shop',

    // Save For Later
    'sfl.title': 'Für später speichern',
    'sfl.eyebrow': 'Merkliste & Favoriten',
    'sfl.subtitle': 'Überprüfen Sie gespeicherte Forschungsartikel und verschieben Sie diese direkt in den Warenkorb.',
    'sfl.empty_title': 'Ihre Merkliste ist leer',
    'sfl.empty_desc': 'Entdecken Sie den Katalog, um Standards für zukünftige Aufträge vorzumerken.',
    'sfl.move_to_cart': 'In den Warenkorb',
    'sfl.remove': 'Aus Merkliste Entfernen',
    'sfl.browse_catalog': 'Katalog Erkunden',

    // Age Gate
    'agegate.title': 'Institutionelle Altersverifikation',
    'agegate.message': 'Gemäß den Vorschriften für Laborchemikalien erfordert der Zugriff die Bestätigung der Volljährigkeit.',
    'agegate.warning': 'Mit dem Fortfahren bestätigen Sie, dass Sie mindestens 21 Jahre alt sind und die Artikel ausschließlich für In-vitro-Forschung verwenden.',
    'agegate.btn_over21': 'Ich bin 21 Jahre oder älter',
    'agegate.btn_under21': 'Ich bin unter 21 Jahre alt',
    'agegate.restricted_title': 'Zugriff Beschränkt',
    'agegate.restricted_desc': 'Personen unter 21 Jahren ist der Zugriff auf den Katalog und die Dienste von BK Research Labs nicht gestattet.',
    'agegate.back_btn': 'Zurück zur Verifikation',

    // Auth Modal
    'auth.signin_title': 'Anmeldung zum BKRL-Portal',
    'auth.register_title': 'Institutionskonto Registrieren',
    'auth.tab_signin': 'Anmelden',
    'auth.tab_register': 'Konto Erstellen',
    'auth.email': 'E-Mail-Adresse / Benutzername',
    'auth.password': 'Passwort',
    'auth.first_name': 'Vorname / Titel',
    'auth.last_name': 'Nachname',
    'auth.signin_btn': 'Anmelden',
    'auth.register_btn': 'Institutionskonto Anlegen',
    'auth.google_signin': 'Mit Google fortfahren',
    'auth.or': 'ODER',

    // Search Modal
    'search.title': 'Forschungskatalog Durchsuchen',
    'search.placeholder': 'Substanzen, CAS, Formeln, CoA suchen...',
    'search.products_tab': 'Substanzen & Standards',
    'search.coa_tab': 'CoA-Dokumente',
    'search.no_results': 'Keine passenden Artikel gefunden.',
    'guide.no_search_results_desc': 'Keine SOP-Schritte oder Funktionen stimmen mit "{query}" überein. Versuchen Sie allgemeinere Suchbegriffe.',

    // Common
    'common.language': 'Sprache',
    'common.device_mode': 'Geräteansicht',
    'common.in_stock': 'Auf Lager',
    'common.out_of_stock': 'Ausverkauft',
    'common.download': 'Herunterladen',
    'common.close': 'Schließen',
    'common.back': 'Zurück',
  }
};

// Aliases mapping old or variation keys directly to canonical keys
const KEY_ALIASES: Record<string, string> = {
  'home.announcement': 'hero.badge',
  'home.hero_title': 'hero.title',
  'home.hero_subtitle': 'hero.subtitle',
  'home.shop_now': 'hero.primary_cta',
  'home.view_guarantees': 'hero.secondary_cta',
  'home.explore_catalog': 'hero.primary_cta',
  'nav.products': 'nav.products',
  'nav.products_title': 'footer.products_title',
  'guarantees.title': 'guarantees.heading',
  'hero.eyebrow': 'catalog.eyebrow',
  'details.purity_guarantee': 'hero.stat_purity_desc',
  'cart.discount': 'checkout.discount_placeholder',
  'auth.email_user': 'auth.email',
  'auth.btn_signin': 'auth.signin_btn',
  'auth.btn_register': 'auth.register_btn',
  'age_gate.title': 'agegate.title',
  'age_gate.message': 'agegate.message',
  'age_gate.warning': 'agegate.warning',
  'age_gate.badge': 'agegate.title',
  'age_gate.verify_notice': 'agegate.message',
  'age_gate.confirm_over': 'agegate.btn_over21',
  'age_gate.confirm_under': 'agegate.btn_under21',
  'age_gate.restricted_title': 'agegate.restricted_title',
  'age_gate.restricted_desc': 'agegate.restricted_desc',
  'age_gate.back_btn': 'agegate.back_btn',
  'age_gate.disclaimer': 'details.disclaimer_text',
  'product.back_catalog': 'nav.products',
  'filter.all_categories': 'filter.all_products',
};

// Comprehensive product, category, and direct phrase dictionary for all 5 languages
export const PHRASE_DICTIONARY: Record<LanguageCode, Record<string, string>> = {
  en: {},
  ar: {
    // Categories
    'brain': 'المخ والأعصاب',
    'cellular': 'الخلوية وعوامل الحيوية',
    'growth hormone': 'هرمون النمو والمحفزات',
    'hormone': 'الهرمونات والمستقبلات',
    'metabolic': 'الأيض والتمثيل الغذائي',
    'skin/tissue': 'الجلد وتجديد الأنسجة',
    'skin tissue': 'الجلد والأنسجة',
    'compounds & consumables': 'المركبات والمستهلكات المخبرية',
    'compounds and consumables': 'المركبات والمستهلكات المخبرية',
    'all products': 'جميع المنتجات والمعايير',
    'all standards': 'جميع المعايير القياسية',
    'featured standards': 'المعايير المميزة',

    // Specific Product Names
    'tesamorelin 10mg lyophilized powder': 'تيساموريلين 10 ملغ بودرة مجففة بالتجميد',
    'nad+ 500mg lyophilized powder': 'NAD+ 500 ملغ بودرة مجففة بالتجميد',
    'mots-c 10mg lyophilized powder': 'MOTS-c 10 ملغ بودرة مجففة بالتجميد',
    'bpc-157 10mg standard': 'BPC-157 10 ملغ معيار تحليلي',
    'bpc-157 10mg lyophilized powder': 'BPC-157 10 ملغ بودرة مجففة بالتجميد',
    'tb-500 10mg research vial': 'TB-500 10 ملغ قارورة بحثية',
    'tb-500 10mg lyophilized powder': 'TB-500 10 ملغ بودرة مجففة بالتجميد',
    'semax 30mg solution': 'سيماكس 30 ملغ محلول مخبري',
    'selank 30mg solution': 'سيلانك 30 ملغ محلول مخبري',
    'epithalon 50mg vial': 'إبيثالون 50 ملغ قارورة مرجعية',
    'epithalon 50mg lyophilized powder': 'إبيثالون 50 ملغ بودرة مجففة بالتجميد',
    'ghk-cu 50mg tripeptide': 'GHK-Cu 50 ملغ ببتيد ثلاثي النحاس',
    'cjc-1295 (no dac) 5mg': 'CJC-1295 (بدون DAC) 5 ملغ',
    'ipamorelin 5mg vial': 'إيباموريلين 5 ملغ قارورة تحليلية',
    'retatrutide 10mg lyophilized powder': 'ريتاتروتايد 10 ملغ بودرة مجففة بالتجميد',
    'tirzepatide 10mg lyophilized powder': 'تيرزيباتيد 10 ملغ بودرة مجففة بالتجميد',
    'semaglutide 5mg lyophilized powder': 'سيماجلوتايد 5 ملغ بودرة مجففة بالتجميد',
    'bac water 30ml bacteriostatic reconstitution water': 'ماء بكتيريوستاتيك معقم لإعادة التركيب 30 مل',
    'sterile acetic acid 0.6% dilution buffer 30ml': 'محلول حمض الخليك المعقم 0.6% للتخفيف 30 مل',
    'aod-9604 5mg lyophilized powder': 'AOD-9604 5 ملغ بودرة مجففة بالتجميد',

    // Generic Product Phrases & Descriptions
    'lyophilized powder': 'بودرة مجففة بالتجميد',
    'research vial': 'قارورة بحثية مخبرية',
    'solution': 'محلول مخبري',
    'standard': 'معيار قياسي تحليلي',
    'tripeptide': 'ببتيد ثلاثي',
    'independent lab tested, lot verified': 'تم الفحص في مختبرات مستقلة مع توثيق الدفعة',
    'for research use only': 'للاستخدام البحثي المخبري فقط',
    'not for human use': 'غير مخصص للاستخدام البشري',
    'strictly for laboratory and research use only. not for human consumption.': 'مخصص حصرياً للاستخدام المخبري والأبحاث العلمية. غير مخصص للاستهلاك البشري.',
    'for research use only. store desiccated at 2-8°c.': 'للاستخدام البحثي فقط. يحفظ مجففاً في درجة حرارة 2-8 مئوية.',
    'precision analytical compounds & research materials': 'مركبات تحليلية دقيقة ومواد بحثية معتمدة',
    'precision compounds & certified reference standards': 'مركبات عالية الدقة ومعايير مرجعية معتمدة',
    'precision chemical standards for in vitro laboratory research': 'معايير كيميائية عالية الدقة للبحوث المخبرية المتخصصة',
    'dual-stage hplc verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.': 'مركبات كيميائية ومعايير جزيئية موثقة باختبارات HPLC المزدوجة، يتم توريدها مباشرة إلى المراكز البحثية والمختبرات المعتمدة حول العالم.',
    '99.8%+ purity': 'نقاء 99.8%+',
    'hplc & mass spec verified': 'موثق باختبارات HPLC ومطياف الكتلة',
    'fast priority 1-3 day': 'شحن سريع ذو أولوية 1-3 أيام',
    '1-3 business day delivery': 'توصيل مباشر خلال 1-3 أيام عمل',
    'lot-specific coa': 'شهادة تحليل لكل دفعة',
    'included with every standard': 'مرفقة مع كل مركب قياسي',
    'hplc batch #bkrl-2026-9041': 'دفعة HPLC #BKRL-2026-9041',
    'purity: 99.84%': 'نسبة النقاء: 99.84%',
    'analytical certificate of analysis verified under iso 17025 laboratory standards.': 'شهادة تحليل معتمدة ومطابقة لمعايير مختبرات ISO 17025 الدولية.',
    'iso 17025 certified reference standards': 'معايير مرجعية معتمدة وفق ISO 17025',
    'explore research catalog': 'استكشاف دليل المركبات',
    'view quality guarantees': 'عرض ضمانات الجودة',
    'i acknowledge that this chemical compound is purchased exclusively for laboratory research.': 'أقر بأن هذا المركب الكيميائي تم شراؤه حصرياً للأبحاث المخبرية العلمية.',
    'i confirm that this purchase is strictly intended for scientific laboratory research and in vitro testing.': 'أؤكد بموجب هذا أن عملية الشراء مخصصة حصرياً للأبحاث العلمية المخبرية والتجارب الأنبوبية (In Vitro).',
    'apps & qr': 'تطبيقات الجوال والتحقق QR',
    'mobile apps & qr code scanner': 'تطبيقات الجوال وماسح رموز QR للمركبات',
    'qr scanner': 'ماسح رمز الاستجابة السريعة (QR)',
    'user guide': 'دليل بروتوكولات المختبر',
    'user laboratory guide': 'دليل بروتوكولات المختبر',
    'back to store': 'العودة إلى المتجر',
    'link copied': 'تم نسخ الرابط بنجاح',
    'author': 'المؤلف',
    'updated': 'تم التحديث',
    'bkrl verified': 'معتمد من مختبرات BKRL',
    'open in full page mode': 'فتح في وضع الصفحة الكاملة',
    'ssl 256-bit encrypted & tokenized checkout': 'دفع مشفر ومؤمن بنظام تشفير SSL 256 بت',
    'share link': 'مشاركة الرابط',
    'print documentation': 'طباعة الوثائق',
    'verified scientific documentation': 'وثائق علمية معتمدة',
    'need analytical standards or coas?': 'هل تحتاج إلى معايير تحليلية أو شهادات تحليل (CoA)؟',
    'explore our full catalog of hplc tested analytical reference compounds.': 'استكشف كتالوجنا الكامل للمركبات المرجعية التحليلية المختبرة بنظام HPLC.',
    'explore store catalog': 'استكشاف كتالوج المتجر',
    'compliance acknowledgment required prior to ordering.': 'إقرار الامتثال التنظيمي مطلوب قبل تقديم الطلب.',
    'express cold-chain shipping': 'شحن سريع بسلسلة التبريد الفائقة',
    'lot-specific hplc batch verified': 'تم التحقق من دفعة HPLC الخاصة بالتشغيلة',
    'no matching compounds found': 'لم يتم العثور على مركبات مطابقة',
    'try expanding your category filter or adjusting your search parameters to view additional analytical reference items.': 'جرب توسيع فلتر الفئات أو ضبط معايير البحث لعرض مواد مرجعية تحليلية إضافية.',

    // Popups and Titles
    'research compounds & product catalog': 'كتالوج المركبات الكيميائية والمنتجات البحثية',
    'chemical categories & scientific disciplines': 'الفئات الكيميائية والتخصصات العلمية',
    'saved compounds & reference standards': 'المركبات المحفوظة والمعايير القياسية',
    'customer orders & lot coa vault': 'طلبات العملاء وخزينة شهادات التحليل (CoA)',
    'platform user guide & role documentation': 'دليل مستخدم المنصة وتوثيق الأدوار التشغيلية',
    'bkrl apple ios mobile application': 'تطبيق مختبرات BK لنظام Apple iOS',
    'bkrl android mobile application': 'تطبيق مختبرات BK لنظام Android',
    'mobile scanner & lot qr verification': 'الماسح الضوئي للجوال والتحقق من رمز الدفعة (QR)',
    'search products, skus, categories & certificates of analysis': 'ابحث عن المنتجات، رموز SKU، الفئات وشهادات التحليل',
    'documentation & certificates': 'الوثائق وشهادات التحليل',
    'view pdf': 'عرض PDF',
    'no research items found for "{query}".': 'لم يتم العثور على مركبات بحثية تطابق "{query}".',
    'try searching for broader keywords like "compound", "standard", or "buffer".': 'جرب البحث باستخدام كلمات عامة مثل "مركب" أو "معيار" أو "محلول".',

    // User Guide & SOPs
    'complete role operations & user manuals': 'أدلة التشغيل الشاملة وكتيبات المستخدمين',
    'real-time auto-compiled • live fleet sync': '⚡ تجميع تلقائي فوري • مزامنة حية',
    'bk research labs operating guide & sops': 'دليل تشغيل مختبرات BK للبحوث وإجراءات العمل القياسية (SOPs)',
    'instant search across every operational feature, step-by-step sops, system controls, and official pdf manual downloads for owner, admin, employee, and customer roles.': 'بحث فوري في جميع الميزات التشغيلية، وإجراءات العمل المعيارية، وعناصر التحكم، وتنزيل الأدلة بصيغة PDF لأدوار المالك والمسؤول والموظف والعميل.',
    'download owner guide (pdf)': 'تحميل دليل المالك (PDF)',
    'download admin guide (pdf)': 'تحميل دليل المسؤول (PDF)',
    'download employee guide (pdf)': 'تحميل دليل الموظف (PDF)',
    'download customer guide (pdf)': 'تحميل دليل العميل (PDF)',
    'generating pdf...': 'جاري إنشاء ملف PDF...',
    'profile role': 'دور الحساب',
    '1. owner manual': '1. دليل المالك',
    '2. admin manual': '2. دليل المسؤول',
    '3. employee manual': '3. دليل الموظف',
    '4. customer guide': '4. دليل العميل',
    'export pdf': 'تصدير PDF',
    'download pdf for': 'تحميل PDF لـ',
    'search': 'بحث',
    'topics, features, keywords (e.g., \'shipping\', \'database\', \'coa\', \'payments\')...': 'المواضيع والميزات والكلمات المفتاحية (مثل الشحن، قاعدة البيانات، شهادات التحليل، المدفوعات)...',
    'showing': 'عرض',
    'topics for': 'موضوع لملف',
    'profile': 'الشخصي',
    'reset search filter': 'إعادة ضبط فلتر البحث',
    'no matching topics found': 'لم يتم العثور على مواضيع مطابقة',
    'clear search': 'مسح البحث',
    'operating instructions & sop': 'تعليمات التشغيل وإجراءات العمل القياسية (SOP)',
    'keywords': 'الكلمات المفتاحية',
    'governance': 'الحوكمة والإشراف',
    'finance': 'المالية والمدفوعات',
    'inventory': 'المخزون والمنتجات',
    'operations': 'العمليات واللوجستيات',
    'compliance': 'الامتثال والجودة',
    'support': 'الدعم والخدمات',
    'catalog': 'الكتالوج والبحث',
    'orders': 'الطلبات والمشتريات',
    'security': 'الأمان والحساب',
    'reference': 'المراجع والتوثيق',
  },

  es: {
    // Categories
    'brain': 'Cerebro y Neuroquímica',
    'cellular': 'Celular y Longevidad',
    'growth hormone': 'Hormona de Crecimiento',
    'hormone': 'Hormonas y Receptores',
    'metabolic': 'Metabólico y Regulación',
    'skin/tissue': 'Piel y Tejidos',
    'skin tissue': 'Piel y Tejidos',
    'compounds & consumables': 'Compuestos y Consumibles',
    'compounds and consumables': 'Compuestos y Consumibles',
    'all products': 'Todos los Productos',
    'all standards': 'Todos los Estándares',
    'featured standards': 'Estándares Destacados',

    // Specific Product Names
    'tesamorelin 10mg lyophilized powder': 'TESAMORELINA 10mg Polvo Liofilizado',
    'nad+ 500mg lyophilized powder': 'NAD+ 500mg Polvo Liofilizado',
    'mots-c 10mg lyophilized powder': 'MOTS-c 10mg Polvo Liofilizado',
    'bpc-157 10mg standard': 'BPC-157 10mg Estándar Analítico',
    'bpc-157 10mg lyophilized powder': 'BPC-157 10mg Polvo Liofilizado',
    'tb-500 10mg research vial': 'TB-500 10mg Vial de Investigación',
    'tb-500 10mg lyophilized powder': 'TB-500 10mg Polvo Liofilizado',
    'semax 30mg solution': 'SEMAX 30mg Solución de Laboratorio',
    'selank 30mg solution': 'SELANK 30mg Solución de Laboratorio',
    'epithalon 50mg vial': 'EPITHALON 50mg Vial de Referencia',
    'epithalon 50mg lyophilized powder': 'EPITHALON 50mg Polvo Liofilizado',
    'ghk-cu 50mg tripeptide': 'GHK-Cu 50mg Tripéptido de Cobre',
    'cjc-1295 (no dac) 5mg': 'CJC-1295 (Sin DAC) 5mg',
    'ipamorelin 5mg vial': 'IPAMORELINA 5mg Vial',
    'retatrutide 10mg lyophilized powder': 'RETATRUTIDA 10mg Polvo Liofilizado',
    'tirzepatide 10mg lyophilized powder': 'TIRZEPATIDA 10mg Polvo Liofilizado',
    'semaglutide 5mg lyophilized powder': 'SEMAGLUTIDA 5mg Polvo Liofilizado',
    'bac water 30ml bacteriostatic reconstitution water': 'Agua Bacteriostática 30ml para Reconstitución',
    'sterile acetic acid 0.6% dilution buffer 30ml': 'Tampón Ácido Acético Estéril 0.6% 30ml',
    'aod-9604 5mg lyophilized powder': 'AOD-9604 5mg Polvo Liofilizado',

    // Generic Product Phrases & Descriptions
    'lyophilized powder': 'Polvo Liofilizado',
    'research vial': 'Vial de Investigación',
    'solution': 'Solución de Laboratorio',
    'standard': 'Estándar de Referencia',
    'tripeptide': 'Tripéptido',
    'independent lab tested, lot verified': 'Probado en laboratorio independiente, lote verificado',
    'for research use only': 'Solo para uso de investigación',
    'not for human use': 'No para uso humano',
    'strictly for laboratory and research use only. not for human consumption.': 'Estrictamente para uso de laboratorio e investigación. No para consumo humano.',
    'for research use only. store desiccated at 2-8°c.': 'Solo para investigación. Almacenar desecado a 2-8°C.',
    'precision analytical compounds & research materials': 'Compuestos analíticos de precisión y materiales de investigación',
    'precision compounds & certified reference standards': 'Compuestos de precisión y estándares de referencia certificados',
    'precision chemical standards for in vitro laboratory research': 'Estándares Químicos de Precisión para Investigación de Laboratorio',
    'dual-stage hplc verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.': 'Compuestos verificados por HPLC en dos etapas y productos químicos analíticos suministrados directamente a centros de investigación autorizados.',
    '99.8%+ purity': '99.8%+ Pureza',
    'hplc & mass spec verified': 'Verificado por HPLC y Espectrometría',
    'fast priority 1-3 day': 'Envío Prioritario 1-3 Días',
    '1-3 business day delivery': 'Entrega en 1-3 Días Hábiles',
    'lot-specific coa': 'CoA Específico por Lote',
    'included with every standard': 'Incluido con Cada Estándar',
    'hplc batch #bkrl-2026-9041': 'LOTE HPLC #BKRL-2026-9041',
    'purity: 99.84%': 'PUREZA: 99.84%',
    'analytical certificate of analysis verified under iso 17025 laboratory standards.': 'Certificado de Análisis analítico verificado bajo estándares de laboratorio ISO 17025.',
    'iso 17025 certified reference standards': 'Estándares de Referencia Certificados ISO 17025',
    'explore research catalog': 'Explorar Catálogo Científico',
    'view quality guarantees': 'Ver Garantías de Calidad',
    'i acknowledge that this chemical compound is purchased exclusively for laboratory research.': 'Reconozco que este compuesto químico se adquiere exclusivamente para investigación de laboratorio.',
    'i confirm that this purchase is strictly intended for scientific laboratory research and in vitro testing.': 'Confirmo que esta compra está estrictamente destinada a investigación científica de laboratorio in vitro.',
    'apps & qr': 'App Móvil y QR',
    'mobile apps & qr code scanner': 'Aplicaciones Móviles y Escáner QR de Lotes',
    'qr scanner': 'Escáner QR',
    'user guide': 'Guía de Usuario',
    'user laboratory guide': 'Guía de Protocolo de Laboratorio',
    'back to store': 'Volver a la Tienda',
    'link copied': 'Enlace Copiado',
    'author': 'Autor',
    'updated': 'Actualizado',
    'bkrl verified': 'Verificado por BKRL',
    'open in full page mode': 'Abrir en Modo de Página Completa',
    'ssl 256-bit encrypted & tokenized checkout': 'Pago Encriptado y Tokenizado SSL de 256 bits',
    'share link': 'Compartir Enlace',
    'print documentation': 'Imprimir Documentación',
    'verified scientific documentation': 'Documentación Científica Verificada',
    'need analytical standards or coas?': '¿Necesita Estándares Analíticos o CoA?',
    'explore our full catalog of hplc tested analytical reference compounds.': 'Explore nuestro catálogo completo de compuestos de referencia analíticos probados por HPLC.',
    'explore store catalog': 'Explorar Catálogo de la Tienda',
    'compliance acknowledgment required prior to ordering.': 'Reconocimiento de cumplimiento requerido antes de realizar el pedido.',
    'express cold-chain shipping': 'Envío Exprés con Cadena de Frío',
    'lot-specific hplc batch verified': 'Lote Verificado por HPLC Específico del Lote',
    'no matching compounds found': 'No se Encontraron Compuestos Coincidentes',
    'try expanding your category filter or adjusting your search parameters to view additional analytical reference items.': 'Intente ampliar su filtro de categoría o ajustar sus parámetros de búsqueda para ver elementos de referencia adicionales.',
  },

  fr: {
    // Categories
    'brain': 'Cerveau & Neurobiologie',
    'cellular': 'Cellulaire & Longévité',
    'growth hormone': 'Hormone de Croissance',
    'hormone': 'Hormones & Récepteurs',
    'metabolic': 'Métabolique & Régulation',
    'skin/tissue': 'Peau & Tissus',
    'skin tissue': 'Peau & Tissus',
    'compounds & consumables': 'Composés & Consommables',
    'compounds and consumables': 'Composés & Consommables',
    'all products': 'Tous les Produits',
    'all standards': 'Tous les Standards',
    'featured standards': 'Standards en Vedette',

    // Specific Product Names
    'tesamorelin 10mg lyophilized powder': 'TÉSAMORÉLINE 10mg Poudre Lyophilisée',
    'nad+ 500mg lyophilized powder': 'NAD+ 500mg Poudre Lyophilisée',
    'mots-c 10mg lyophilized powder': 'MOTS-c 10mg Poudre Lyophilisée',
    'bpc-157 10mg standard': 'BPC-157 10mg Standard Analytique',
    'bpc-157 10mg lyophilized powder': 'BPC-157 10mg Poudre Lyophilisée',
    'tb-500 10mg research vial': 'TB-500 10mg Flacon de Recherche',
    'tb-500 10mg lyophilized powder': 'TB-500 10mg Poudre Lyophilisée',
    'semax 30mg solution': 'SEMAX 30mg Solution de Laboratoire',
    'selank 30mg solution': 'SELANK 30mg Solution de Laboratoire',
    'epithalon 50mg vial': 'ÉPITHALON 50mg Flacon de Référence',
    'epithalon 50mg lyophilized powder': 'ÉPITHALON 50mg Poudre Lyophilisée',
    'ghk-cu 50mg tripeptide': 'GHK-Cu 50mg Tripeptide Cuivré',
    'cjc-1295 (no dac) 5mg': 'CJC-1295 (Sans DAC) 5mg',
    'ipamorelin 5mg vial': 'IPAMORÉLINE 5mg Flacon',
    'retatrutide 10mg lyophilized powder': 'RÉTATRUTIDE 10mg Poudre Lyophilisée',
    'tirzepatide 10mg lyophilized powder': 'TIRZÉPATIDE 10mg Poudre Lyophilisée',
    'semaglutide 5mg lyophilized powder': 'SÉMAGLUTIDE 5mg Poudre Lyophilisée',
    'bac water 30ml bacteriostatic reconstitution water': 'Eau Bactériostatique 30ml pour Reconstitution',
    'sterile acetic acid 0.6% dilution buffer 30ml': 'Tampon Acide Acétique Stérile 0.6% 30ml',
    'aod-9604 5mg lyophilized powder': 'AOD-9604 5mg Poudre Lyophilisée',

    // Generic Product Phrases & Descriptions
    'lyophilized powder': 'Poudre Lyophilisée',
    'research vial': 'Flacon de Recherche',
    'solution': 'Solution de Laboratoire',
    'standard': 'Standard de Référence',
    'tripeptide': 'Tripeptide',
    'independent lab tested, lot verified': 'Testé en laboratoire indépendant, lot vérifié',
    'for research use only': 'Usage réservé à la recherche',
    'not for human use': 'Non destiné à l\'usage humain',
    'strictly for laboratory and research use only. not for human consumption.': 'Strictement réservé à la recherche en laboratoire. Non destiné à la consommation humaine.',
    'for research use only. store desiccated at 2-8°c.': 'Réservé à la recherche. Conserver desséché à 2-8°C.',
    'precision analytical compounds & research materials': 'Composés analytiques de précision et matériels de recherche',
    'precision compounds & certified reference standards': 'Composés de haute précision et standards certifiés',
    'precision chemical standards for in vitro laboratory research': 'Standards Chimiques de Haute Précision pour la Recherche en Laboratoire',
    'dual-stage hplc verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.': 'Composés vérifiés par HPLC à double étage et produits chimiques analytiques livrés directement aux laboratoires agréés du monde entier.',
    '99.8%+ purity': 'Pureté 99.8%+',
    'hplc & mass spec verified': 'Vérifié par HPLC et Spectrométrie de Masse',
    'fast priority 1-3 day': 'Livraison Prioritaire 1-3 Jours',
    '1-3 business day delivery': 'Livraison en 1-3 Jours Ouvrés',
    'lot-specific coa': 'CoA Spécifique par Lot',
    'included with every standard': 'Inclus avec Chaque Produit',
    'hplc batch #bkrl-2026-9041': 'LOT HPLC #BKRL-2026-9041',
    'purity: 99.84%': 'PURETÉ: 99.84%',
    'analytical certificate of analysis verified under iso 17025 laboratory standards.': 'Certificat d\'Analyse validé selon les normes de laboratoire ISO 17025.',
    'iso 17025 certified reference standards': 'Normes de Référence Certifiées ISO 17025',
    'explore research catalog': 'Explorer le Catalogue',
    'view quality guarantees': 'Voir les Garanties de Qualité',
    'i acknowledge that this chemical compound is purchased exclusively for laboratory research.': 'Je reconnais que ce composé chimique est acheté exclusivement pour la recherche en laboratoire.',
    'i confirm that this purchase is strictly intended for scientific laboratory research and in vitro testing.': 'Je confirme que cet achat est strictement destiné à la recherche scientifique en laboratoire in vitro.',
    'apps & qr': 'App Mobile & QR',
    'mobile apps & qr code scanner': 'Applications Mobiles et Scanner QR de Lots',
    'qr scanner': 'Scanner QR',
    'user guide': 'Guide Utilisateur',
    'user laboratory guide': 'Guide des Protocoles de Laboratoire',
    'back to store': 'Retourner à la Boutique',
    'link copied': 'Lien Copié',
    'author': 'Auteur',
    'updated': 'Mis à jour',
    'bkrl verified': 'Vérifié par BKRL',
    'open in full page mode': 'Ouvrir en Mode Pleine Page',
    'ssl 256-bit encrypted & tokenized checkout': 'Paiement Sécurisé et Tokenisé SSL 256 bits',
    'share link': 'Partager le Lien',
    'print documentation': 'Imprimer la Documentation',
    'verified scientific documentation': 'Documentation Scientifique Vérifiée',
    'need analytical standards or coas?': 'Besoin d\'Étalons Analytiques ou de CoA ?',
    'explore our full catalog of hplc tested analytical reference compounds.': 'Explorez notre catalogue complet de composés de référence analytiques testés par HPLC.',
    'explore store catalog': 'Explorer le Catalogue du Magasin',
    'compliance acknowledgment required prior to ordering.': 'Confirmation de conformité requise avant de commander.',
    'express cold-chain shipping': 'Expédition Express par Chaîne du Froid',
    'lot-specific hplc batch verified': 'Lot Vérifié par HPLC Spécifique au Lot',
    'no matching compounds found': 'Aucun Composé Correspondant Trouvé',
    'try expanding your category filter or adjusting your search parameters to view additional analytical reference items.': 'Essayez d\'élargir votre filtre de catégorie ou d\'ajuster vos paramètres de recherche pour voir des articles supplémentaires.',
  },

  de: {
    // Categories
    'brain': 'Gehirn & Neurobiologie',
    'cellular': 'Zellulär & Langlebigkeit',
    'growth hormone': 'Wachstumshormon',
    'hormone': 'Hormone & Rezeptoren',
    'metabolic': 'Stoffwechsel & Regulation',
    'skin/tissue': 'Haut & Gewebe',
    'skin tissue': 'Haut & Gewebe',
    'compounds & consumables': 'Substanzen & Verbrauchsmaterialien',
    'compounds and consumables': 'Substanzen & Verbrauchsmaterialien',
    'all products': 'Alle Produkte',
    'all standards': 'Alle Standards',
    'featured standards': 'Hervorgehobene Standards',

    // Specific Product Names
    'tesamorelin 10mg lyophilized powder': 'TESAMORELIN 10mg Gefriergetrocknetes Pulver',
    'nad+ 500mg lyophilized powder': 'NAD+ 500mg Gefriergetrocknetes Pulver',
    'mots-c 10mg lyophilized powder': 'MOTS-c 10mg Gefriergetrocknetes Pulver',
    'bpc-157 10mg standard': 'BPC-157 10mg Analytischer Standard',
    'bpc-157 10mg lyophilized powder': 'BPC-157 10mg Gefriergetrocknetes Pulver',
    'tb-500 10mg research vial': 'TB-500 10mg Forschungsampulle',
    'tb-500 10mg lyophilized powder': 'TB-500 10mg Gefriergetrocknetes Pulver',
    'semax 30mg solution': 'SEMAX 30mg Laborlösung',
    'selank 30mg solution': 'SELANK 30mg Laborlösung',
    'epithalon 50mg vial': 'EPITHALON 50mg Referenzampulle',
    'epithalon 50mg lyophilized powder': 'EPITHALON 50mg Gefriergetrocknetes Pulver',
    'ghk-cu 50mg tripeptide': 'GHK-Cu 50mg Kupfer-Tripeptid',
    'cjc-1295 (no dac) 5mg': 'CJC-1295 (Ohne DAC) 5mg',
    'ipamorelin 5mg vial': 'IPAMORELIN 5mg Ampulle',
    'retatrutide 10mg lyophilized powder': 'RETATRUTID 10mg Gefriergetrocknetes Pulver',
    'tirzepatide 10mg lyophilized powder': 'TIRZEPATID 10mg Gefriergetrocknetes Pulver',
    'semaglutide 5mg lyophilized powder': 'SEMAGLUTID 5mg Gefriergetrocknetes Pulver',
    'bac water 30ml bacteriostatic reconstitution water': 'Bakteriostatisches Wasser 30ml zur Rekonstitution',
    'sterile acetic acid 0.6% dilution buffer 30ml': 'Steriler Essigsäurepuffer 0.6% 30ml',
    'aod-9604 5mg lyophilized powder': 'AOD-9604 5mg Gefriergetrocknetes Pulver',

    // Generic Product Phrases & Descriptions
    'lyophilized powder': 'Gefriergetrocknetes Pulver',
    'research vial': 'Forschungsampulle',
    'solution': 'Laborlösung',
    'standard': 'Referenzstandard',
    'tripeptide': 'Tripeptid',
    'independent lab tested, lot verified': 'Unabhängig laborgeprüft, chargenverifiziert',
    'for research use only': 'Nur für Forschungszwecke',
    'not for human use': 'Nicht für den menschlichen Gebrauch',
    'strictly for laboratory and research use only. not for human consumption.': 'Ausschließlich für Labor- und Forschungszwecke. Nicht für den menschlichen Verzehr.',
    'for research use only. store desiccated at 2-8°c.': 'Nur für Forschungszwecke. Trocken bei 2-8°C lagern.',
    'precision analytical compounds & research materials': 'Präzisions-Chemikalien & Forschungsmaterialien',
    'precision compounds & certified reference standards': 'Präzisions-Substanzen & Zertifizierte Referenzstandards',
    'precision chemical standards for in vitro laboratory research': 'Präzisions-Chemikalienstandards für die Laborforschung',
    'dual-stage hplc verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.': 'Doppelstufig HPLC-geprüfte Substanzen und analytische Standards für autorisierte Forschungseinrichtungen weltweit.',
    '99.8%+ purity': '99.8%+ Reinheit',
    'hplc & mass spec verified': 'HPLC- & Massenspektrometrie-geprüft',
    'fast priority 1-3 day': 'Express-Lieferung 1-3 Tage',
    '1-3 business day delivery': '1-3 Werktage Lieferzeit',
    'lot-specific coa': 'Chargenspezifisches CoA',
    'included with every standard': 'Bei Jedem Standard Enthalten',
    'hplc batch #bkrl-2026-9041': 'HPLC CHARGE #BKRL-2026-9041',
    'purity: 99.84%': 'REINHEIT: 99.84%',
    'analytical certificate of analysis verified under iso 17025 laboratory standards.': 'Analysenzertifikat gemäß ISO 17025 Laborstandards validiert.',
    'iso 17025 certified reference standards': 'ISO 17025 Zertifizierte Referenzstandards',
    'explore research catalog': 'Katalog Durchsuchen',
    'view quality guarantees': 'Qualitätsgarantien Einsehen',
    'i acknowledge that this chemical compound is purchased exclusively for laboratory research.': 'Ich bestätige, dass diese chemische Substanz ausschließlich für die Laborforschung erworben wird.',
    'i confirm that this purchase is strictly intended for scientific laboratory research and in vitro testing.': 'Ich bestätige, dass dieser Erwerb ausschließlich für wissenschaftliche In-vitro-Laboranalysen bestimmt ist.',
    'apps & qr': 'Mobile App & QR',
    'mobile apps & qr code scanner': 'Mobile Apps & Chargen-QR-Code-Scanner',
    'qr scanner': 'QR-Scanner',
    'user guide': 'Benutzerhandbuch',
    'user laboratory guide': 'Labor-Handbuch',
    'back to store': 'Zurück zum Shop',
    'link copied': 'Link Kopiert',
    'author': 'Autor',
    'updated': 'Aktualisiert',
    'bkrl verified': 'BKRL Verifiziert',
    'open in full page mode': 'Im Vollseitenmodus öffnen',
    'ssl 256-bit encrypted & tokenized checkout': '256-Bit-SSL-verschlüsselte und tokenisierte Kasse',
    'share link': 'Link Teilen',
    'print documentation': 'Dokumentation Drucken',
    'verified scientific documentation': 'Geprüfte Wissenschaftliche Dokumentation',
    'need analytical standards or coas?': 'Benötigen Sie Analysestandards oder CoA?',
    'explore our full catalog of hplc tested analytical reference compounds.': 'Entdecken Sie unseren vollständigen Katalog von HPLC-geprüften analytischen Referenzsubstanzen.',
    'explore store catalog': 'Shop-Katalog Erkunden',
    'compliance acknowledgment required prior to ordering.': 'Bestätigung der Konformität vor der Bestellung erforderlich.',
    'express cold-chain shipping': 'Express-Kühlkettenversand',
    'lot-specific hplc batch verified': 'Chargenspezifisch HPLC-verifiziert',
    'no matching compounds found': 'Keine passenden Substanzen gefunden',
    'try expanding your category filter or adjusting your search parameters to view additional analytical reference items.': 'Versuchen Sie, Ihren Kategoriefilter zu erweitern oder Ihre Suchparameter anzupassen.',
  }
};

/**
 * Translate an entire Product object into the target language.
 */
export function translateProduct(product: Product, lang: LanguageCode = 'en'): Product {
  if (!product) return product;
  if (lang === 'en') return product;

  const prodDict = PRODUCT_TRANSLATIONS[lang]?.[product.id] ||
                   PRODUCT_TRANSLATIONS[lang]?.[`prod-${product.sku?.toLowerCase().replace(/[^a-z0-9]/g, '')}`];

  const catDict = product.category_id ? CATEGORY_TRANSLATIONS[lang]?.[product.category_id] : null;

  return {
    ...product,
    name: prodDict?.name || getTranslation(lang, product.name),
    short_description: prodDict?.short_description || getTranslation(lang, product.short_description || ''),
    description: prodDict?.description || getTranslation(lang, product.description),
    category_name: catDict?.name || (product.category_name ? getTranslation(lang, product.category_name) : product.category_name),
    disclaimer: prodDict?.disclaimer || (product.disclaimer ? getTranslation(lang, product.disclaimer) : product.disclaimer),
    acknowledgment_text: prodDict?.acknowledgment_text || (product.acknowledgment_text ? getTranslation(lang, product.acknowledgment_text) : product.acknowledgment_text),
  };
}

/**
 * Translate an entire ProductCategory object into the target language.
 */
export function translateCategory(category: ProductCategory, lang: LanguageCode = 'en'): ProductCategory {
  if (!category) return category;
  if (lang === 'en') return category;

  const catDict = CATEGORY_TRANSLATIONS[lang]?.[category.id] ||
                   CATEGORY_TRANSLATIONS[lang]?.[`cat-${category.slug?.toLowerCase()}`];

  return {
    ...category,
    name: catDict?.name || getTranslation(lang, category.name),
    description: catDict?.description || getTranslation(lang, category.description || ''),
  };
}

/**
 * Translate an entire CustomPage object into the target language.
 */
export function translatePage(page: CustomPage, lang: LanguageCode = 'en'): CustomPage {
  if (!page) return page;
  if (lang === 'en') return page;

  const pageDict = CUSTOM_PAGE_TRANSLATIONS[lang]?.[page.id] ||
                   CUSTOM_PAGE_TRANSLATIONS[lang]?.[`page-${page.slug?.toLowerCase().replace(/[^a-z0-9]/g, '')}`];

  return {
    ...page,
    title: pageDict?.title || getTranslation(lang, page.title),
    category: page.category,
    summary: pageDict?.summary || (page.summary ? getTranslation(lang, page.summary) : page.summary),
    content: pageDict?.content || getTranslation(lang, page.content),
  };
}

/**
 * Translate homepage content and site settings for the target language.
 */
export function translateHomePageContent(content: any, lang: LanguageCode = 'en'): any {
  if (!content) return content;
  if (lang === 'en') return content;

  return {
    ...content,
    hero_badge: getTranslation(lang, content.hero_badge || 'ISO 17025 Certified Reference Standards'),
    hero_title: getTranslation(lang, content.hero_title || 'Precision Chemical Standards for In Vitro Laboratory Research'),
    hero_subtitle: getTranslation(lang, content.hero_subtitle || 'Dual-stage HPLC verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.'),
    hero_primary_cta: getTranslation(lang, content.hero_primary_cta || 'Explore Research Catalog'),
    hero_secondary_cta: getTranslation(lang, content.hero_secondary_cta || 'View Quality Guarantees'),
    announcement_bar_text: getTranslation(lang, content.announcement_bar_text || '⚡ Priority Cold-Chain Dispatch: Next-day dispatch active on all analytical reference peptides.'),
    stats: (content.stats || []).map((s: any) => ({
      ...s,
      value: getTranslation(lang, s.value),
      label: getTranslation(lang, s.label),
      sublabel: getTranslation(lang, s.sublabel),
    })),
    guarantee_cards: (content.guarantee_cards || []).map((c: any) => ({
      ...c,
      title: getTranslation(lang, c.title),
      description: getTranslation(lang, c.description),
    })),
  };
}

/**
 * Helper to resolve nested property path in an object (e.g. "a.b.c" or "products.prod-bpc.desc")
 */
function resolveObjectPath(obj: any, path: string): any {
  if (!obj || typeof obj !== 'object' || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * Resolves a product localized field by productId/sku/name and field name across languages.
 */
export function translateProductField(
  productIdOrSkuOrName: string,
  field: 'name' | 'short_description' | 'description' | 'disclaimer' | 'acknowledgment_text' | string,
  lang: LanguageCode = 'en',
  fallbackText?: string
): string {
  if (!productIdOrSkuOrName) return fallbackText || '';
  
  const rawId = productIdOrSkuOrName.trim();
  const normalizedId = rawId.toLowerCase().replace(/[^a-z0-9]/g, '');

  const findInDict = (targetLang: LanguageCode): string | undefined => {
    const dict = PRODUCT_TRANSLATIONS[targetLang];
    if (!dict) return undefined;

    // 1. Direct ID match
    if (dict[rawId] && (dict[rawId] as any)[field]) {
      return (dict[rawId] as any)[field];
    }
    // 2. Prefixed prod- match
    const prefixed = `prod-${normalizedId}`;
    if (dict[prefixed] && (dict[prefixed] as any)[field]) {
      return (dict[prefixed] as any)[field];
    }
    // 3. Scan all products for matching ID or normalized SKU
    for (const [pId, pData] of Object.entries(dict)) {
      const pNorm = pId.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (pNorm === normalizedId || pNorm === `prod${normalizedId}` || normalizedId === `prod${pNorm}`) {
        if ((pData as any)[field]) return (pData as any)[field];
      }
      // Check if English name matches
      const enData = PRODUCT_TRANSLATIONS.en?.[pId];
      if (enData && enData.name.toLowerCase() === rawId.toLowerCase()) {
        if ((pData as any)[field]) return (pData as any)[field];
      }
    }
    return undefined;
  };

  // Try target language first
  if (lang !== 'en') {
    const localized = findInDict(lang);
    if (localized) return localized;
  }

  // Fallback to English
  const enLocalized = findInDict('en');
  if (enLocalized) return enLocalized;

  return fallbackText || '';
}

/**
 * Direct helper for translating product description.
 */
export function translateProductDescription(
  productIdOrSkuOrName: string,
  lang: LanguageCode = 'en',
  fallbackText?: string
): string {
  return translateProductField(productIdOrSkuOrName, 'description', lang, fallbackText);
}

/**
 * Universal translation function. Translates either a translation key (e.g. 'nav.home', 'products.prod-bpc15710mg.description')
 * or a direct English phrase (e.g. 'Add to Cart', 'In Stock', 'Why Research Institutions Choose BKRL').
 */
export function getTranslation(
  lang: LanguageCode,
  keyOrPhrase: string,
  params?: Record<string, string | number>
): string {
  if (!keyOrPhrase || typeof keyOrPhrase !== 'string') return '';

  const cleanKey = keyOrPhrase.trim();
  if (!cleanKey) return '';

  // 1. Complex Nested Dot-Path Lookups (products.<id>.<field>, categories.<id>.<field>, pages.<id>.<field>)
  const dotParts = cleanKey.split('.');
  if (dotParts.length >= 3) {
    const rootScope = dotParts[0].toLowerCase();
    const entityId = dotParts.slice(1, dotParts.length - 1).join('.');
    const field = dotParts[dotParts.length - 1];

    if (rootScope === 'products' || rootScope === 'product' || rootScope === 'prod') {
      const translatedField = translateProductField(entityId, field, lang);
      if (translatedField) {
        let result = translatedField;
        if (params) {
          Object.entries(params).forEach(([pk, pv]) => {
            result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
            result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
          });
        }
        return result;
      }
    }

    if (rootScope === 'categories' || rootScope === 'category' || rootScope === 'cat') {
      const catDict = CATEGORY_TRANSLATIONS[lang]?.[entityId] ||
                       CATEGORY_TRANSLATIONS[lang]?.[`cat-${entityId.toLowerCase()}`] ||
                       CATEGORY_TRANSLATIONS.en?.[entityId];
      if (catDict && (catDict as any)[field]) {
        let result = (catDict as any)[field];
        if (params) {
          Object.entries(params).forEach(([pk, pv]) => {
            result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
            result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
          });
        }
        return result;
      }
    }

    if (rootScope === 'pages' || rootScope === 'page') {
      const pageDict = CUSTOM_PAGE_TRANSLATIONS[lang]?.[entityId] ||
                        CUSTOM_PAGE_TRANSLATIONS[lang]?.[`page-${entityId.toLowerCase()}`] ||
                        CUSTOM_PAGE_TRANSLATIONS.en?.[entityId];
      if (pageDict && (pageDict as any)[field]) {
        let result = (pageDict as any)[field];
        if (params) {
          Object.entries(params).forEach(([pk, pv]) => {
            result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
            result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
          });
        }
        return result;
      }
    }
  }

  // 2. Reverse Phrase & Full Description Direct Lookup
  if (lang !== 'en') {
    for (const [prodId, prodData] of Object.entries(PRODUCT_TRANSLATIONS[lang] || {})) {
      const enData = PRODUCT_TRANSLATIONS.en?.[prodId];
      if (enData) {
        if (enData.name === cleanKey) return prodData.name;
        if (enData.short_description === cleanKey) return prodData.short_description;
        if (enData.description === cleanKey) return prodData.description;
        if (enData.disclaimer === cleanKey && prodData.disclaimer) return prodData.disclaimer;
        if (enData.acknowledgment_text === cleanKey && prodData.acknowledgment_text) return prodData.acknowledgment_text;
      }
    }

    // Check category direct lookup
    for (const [catId, catData] of Object.entries(CATEGORY_TRANSLATIONS[lang] || {})) {
      const enData = CATEGORY_TRANSLATIONS.en?.[catId];
      if (enData) {
        if (enData.name === cleanKey) return catData.name;
        if (enData.description === cleanKey) return catData.description;
      }
    }

    // Check custom page direct lookup
    for (const [pageId, pageData] of Object.entries(CUSTOM_PAGE_TRANSLATIONS[lang] || {})) {
      const enData = CUSTOM_PAGE_TRANSLATIONS.en?.[pageId];
      if (enData) {
        if (enData.title === cleanKey) return pageData.title;
        if (enData.summary === cleanKey) return pageData.summary;
        if (enData.content === cleanKey) return pageData.content;
      }
    }
  }

  // 3. Check Dictionary with Key Aliases
  const targetDict = TRANSLATIONS[lang] || TRANSLATIONS.en;

  let resolvedKey = cleanKey;
  if (KEY_ALIASES[resolvedKey]) {
    resolvedKey = KEY_ALIASES[resolvedKey];
  }

  // Direct dictionary lookup for structured key
  if (targetDict[resolvedKey]) {
    let result = targetDict[resolvedKey];
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
        result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
      });
    }
    return result;
  }

  // Deep Object Path fallback if TRANSLATIONS has nested objects
  const nestedVal = resolveObjectPath(targetDict, resolvedKey);
  if (typeof nestedVal === 'string') {
    let result = nestedVal;
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
        result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
      });
    }
    return result;
  }

  // 4. Direct phrase table lookup
  const normalizedPhrase = cleanKey.toLowerCase().trim();
  if (lang !== 'en' && PHRASE_DICTIONARY[lang] && PHRASE_DICTIONARY[lang][normalizedPhrase]) {
    let result = PHRASE_DICTIONARY[lang][normalizedPhrase];
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
        result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
      });
    }
    return result;
  }

  // 5. Check English translations dictionary to see if key exists in EN
  if (TRANSLATIONS.en[resolvedKey]) {
    const enText = TRANSLATIONS.en[resolvedKey].toLowerCase().trim();
    if (lang !== 'en' && PHRASE_DICTIONARY[lang] && PHRASE_DICTIONARY[lang][enText]) {
      return PHRASE_DICTIONARY[lang][enText];
    }
    let result = TRANSLATIONS.en[resolvedKey];
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        result = result.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
        result = result.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
      });
    }
    return result;
  }

  // 6. Graceful fallbacks for home/hero/product/cart prefixes
  if (cleanKey.startsWith('home.') || cleanKey.startsWith('hero.') || cleanKey.startsWith('product.') || cleanKey.startsWith('cart.')) {
    if (cleanKey === 'home.announcement' || cleanKey === 'hero.badge') return targetDict['hero.badge'] || 'ISO 17025 Certified Reference Standards';
    if (cleanKey === 'home.hero_title' || cleanKey === 'hero.title') return targetDict['hero.title'] || 'Precision Chemical Standards for In Vitro Laboratory Research';
    if (cleanKey === 'home.hero_subtitle' || cleanKey === 'hero.subtitle') return targetDict['hero.subtitle'] || 'Dual-stage HPLC verified compounds, molecular standards, and analytical chemicals supplied directly to authorized research facilities worldwide.';
    if (cleanKey === 'home.shop_now' || cleanKey === 'hero.primary_cta') return targetDict['hero.primary_cta'] || 'Explore Research Catalog';
    if (cleanKey === 'home.view_guarantees' || cleanKey === 'hero.secondary_cta') return targetDict['hero.secondary_cta'] || 'View Quality Guarantees';
    if (cleanKey === 'product.back_catalog') return targetDict['nav.products'] || 'Compounds & Catalog';
  }

  // 7. Intelligent translation of compound units and product text for non-English
  if (lang !== 'en') {
    let candidate = cleanKey;
    const phraseMap = PHRASE_DICTIONARY[lang];
    if (phraseMap) {
      for (const [enTerm, transTerm] of Object.entries(phraseMap)) {
        if (enTerm.length > 3 && candidate.toLowerCase().includes(enTerm)) {
          candidate = candidate.replace(new RegExp(enTerm, 'gi'), transTerm);
        }
      }
      if (candidate !== cleanKey) {
        if (params) {
          Object.entries(params).forEach(([pk, pv]) => {
            candidate = candidate.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
            candidate = candidate.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
          });
        }
        return candidate;
      }
    }
  }

  // Apply param interpolation to cleanKey as fallback
  let finalResult = cleanKey;
  if (params) {
    Object.entries(params).forEach(([pk, pv]) => {
      finalResult = finalResult.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
      finalResult = finalResult.replace(new RegExp(`\\$?\\{${pk}\\}`, 'g'), String(pv));
    });
  }

  return finalResult;
}

export const t = getTranslation;

// Local storage key for dynamic user/admin translation overrides
const OVERRIDES_STORAGE_KEY = 'bkrl_i18n_custom_overrides';

export function getAllCustomTranslationOverrides(): Record<string, Record<string, string>> {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (e) {
    return {};
  }
}

export function getCustomTranslationOverrides(lang?: string): Record<string, string> {
  try {
    const all = getAllCustomTranslationOverrides();
    if (lang) {
      return all[lang] || {};
    }
    const currentLangOverrides: Record<string, string> = {};
    Object.values(all).forEach(dict => {
      Object.assign(currentLangOverrides, dict);
    });
    return currentLangOverrides;
  } catch (e) {
    return {};
  }
}

export function registerTranslationOverride(lang: LanguageCode, key: string, value: string): void {
  try {
    if (!TRANSLATIONS[lang]) {
      TRANSLATIONS[lang] = {};
    }
    TRANSLATIONS[lang][key] = value;

    const currentOverrides = getAllCustomTranslationOverrides();
    if (!currentOverrides[lang]) {
      currentOverrides[lang] = {};
    }
    currentOverrides[lang][key] = value;
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(currentOverrides));

    // Dispatch notification
    window.dispatchEvent(new CustomEvent('bkrl_language_change', { detail: { language: lang } }));
  } catch (e) {
    console.error('Failed to register translation override:', e);
  }
}

export function clearCustomTranslationOverrides(lang?: LanguageCode): void {
  try {
    if (lang) {
      const current = getAllCustomTranslationOverrides();
      delete current[lang];
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(current));
    } else {
      localStorage.removeItem(OVERRIDES_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('bkrl_language_change', { detail: { language: lang || 'en' } }));
  } catch (e) {
    console.error('Failed to clear translation overrides:', e);
  }
}

// Auto-hydrate overrides at load time
try {
  if (typeof window !== 'undefined') {
    const storedOverrides = getAllCustomTranslationOverrides();
    Object.entries(storedOverrides).forEach(([langCode, keyMap]) => {
      const l = langCode as LanguageCode;
      if (!TRANSLATIONS[l]) {
        TRANSLATIONS[l] = {};
      }
      if (typeof keyMap === 'object' && keyMap !== null) {
        Object.entries(keyMap).forEach(([k, v]) => {
          if (typeof v === 'string') {
            TRANSLATIONS[l][k] = v;
          }
        });
      }
    });
  }
} catch (e) {}

/**
 * Normalizes customer input to English for backend canonical storage.
 */
export function normalizeToEnglishForBackend(text: string): string {
  return text.trim();
}

/**
 * React Context Provider for global application-wide i18n
 */
export const LanguageProvider: React.FC<{
  children: ReactNode;
  initialLanguage?: LanguageCode;
  language?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}> = ({ children, initialLanguage = 'en', language: controlledLanguage, onLanguageChange }) => {
  const getStoredLanguage = (): LanguageCode => {
    try {
      const stored = localStorage.getItem('bkrl_user_language') as LanguageCode;
      if (stored && typeof stored === 'string' && stored.length >= 2) {
        return stored;
      }
    } catch (e) {}
    return controlledLanguage || initialLanguage || 'en';
  };

  const [languageState, setLanguageState] = useState<LanguageCode>(getStoredLanguage);

  const activeLanguage = controlledLanguage || languageState;

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    const langStr = String(newLang).toLowerCase();
    try {
      localStorage.setItem('bkrl_user_language', langStr);
    } catch (e) {}

    // Update HTML attributes
    document.documentElement.lang = langStr;
    document.documentElement.dir = (langStr === 'ar' || langStr === 'he' || langStr === 'fa' || langStr === 'ur') ? 'rtl' : 'ltr';

    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    // Dispatch global custom event for external sub-trees
    try {
      window.dispatchEvent(new CustomEvent('bkrl_language_change', { detail: { language: newLang } }));
    } catch (e) {}
  };

  useEffect(() => {
    if (controlledLanguage && controlledLanguage !== languageState) {
      setLanguageState(controlledLanguage);
    }
  }, [controlledLanguage]);

  useEffect(() => {
    const langStr = String(activeLanguage).toLowerCase();
    document.documentElement.lang = langStr;
    document.documentElement.dir = (langStr === 'ar' || langStr === 'he' || langStr === 'fa' || langStr === 'ur') ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('bkrl_user_language', langStr);
    } catch (e) {}
  }, [activeLanguage]);

  const translate = (keyOrPhrase: string, params?: Record<string, string | number>) => {
    return getTranslation(activeLanguage, keyOrPhrase, params);
  };

  const isRTL = activeLanguage === 'ar' || activeLanguage === 'he' || activeLanguage === 'fa' || activeLanguage === 'ur';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

  return React.createElement(
    LanguageContext.Provider,
    { value: { language: activeLanguage, setLanguage, t: translate, dir, isRTL } },
    children
  );
};
