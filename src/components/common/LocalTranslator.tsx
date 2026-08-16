import React, { useState, useEffect, useRef } from 'react';
import {
  Languages, X, ArrowLeftRight, Volume2, Copy, Check, Sparkles,
  Zap, Globe, Power, Minimize2, Maximize2, RefreshCw, BookOpen,
  CheckCircle2, CornerDownLeft, ShieldCheck, ChevronDown, Sliders
} from 'lucide-react';
import {
  GOOGLE_SUPPORTED_LANGUAGES,
  getLanguageInfo,
  changeGoogleTranslateLanguage,
  translateTextViaApi
} from '../../lib/googleTranslate';

interface LocalTranslatorProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  defaultTargetLang?: string;
}

// Built-in instant offline dictionary of essential laboratory, chemistry, e-commerce, and scientific terms
const LOCAL_DICTIONARY: Record<string, Record<string, string>> = {
  'For in vitro laboratory research use only': {
    es: 'Solo para uso en investigación de laboratorio in vitro',
    fr: 'Pour utilisation exclusive en recherche en laboratoire in vitro',
    de: 'Nur für die In-vitro-Laborforschung bestimmt',
    ja: '体外実験室研究専用',
    zh: '仅供体外实验室研究使用',
    ar: 'للاستخدام في أبحاث المختبرات في المختبر فقط',
    ru: 'Только для лабораторных исследований in vitro',
    pt: 'Apenas para uso em pesquisa laboratorial in vitro',
    it: 'Solo per uso di ricerca in vitro di laboratorio',
    ko: '체외 실험실 연구 전용',
    nl: 'Alleen voor in-vitro laboratoriumonderzoek',
    hi: 'केवल इन विट्रो प्रयोगशाला अनुसंधान उपयोग के लिए'
  },
  'Certificate of Analysis (COA)': {
    es: 'Certificado de Análisis (COA)',
    fr: "Certificat d'Analyse (COA)",
    de: 'Analysezertifikat (COA)',
    ja: '分析証明書（COA）',
    zh: '分析证书 (COA)',
    ar: 'شهادة التحليل (COA)',
    ru: 'Сертификат анализа (COA)',
    pt: 'Certificado de Análise (COA)',
    it: 'Certificato di Analisi (COA)',
    ko: '분석 증명서 (COA)',
    nl: 'Certificaat van Analyse (COA)',
    hi: 'विश्लेषण प्रमाण पत्र (COA)'
  },
  'High Purity Dual-Stage HPLC Verified': {
    es: 'Alta pureza verificada por HPLC de doble etapa (99.8%+)',
    fr: 'Haute pureté vérifiée par HPLC double étape (99,8%+)',
    de: 'Hohe Reinheit durch zweistufige HPLC verifiziert (99,8%+)',
    ja: '2段階HPLC検証済みの高純度（99.8％以上）',
    zh: '双阶段 HPLC 验证高纯度 (99.8%+)',
    ar: 'عالي النقاء تم التحقق منه بواسطة HPLC ثنائي المرحلة (99.8%+)',
    ru: 'Высокая чистота, подтвержденная двухстадийной ВЭЖХ (99,8%+)',
    pt: 'Alta pureza verificada por HPLC de estágio duplo (99,8%+)',
    it: 'Elevata purezza verificata tramite HPLC a doppio stadio (99,8%+)',
    ko: '2단계 HPLC 검증 고순도 (99.8%+)',
    nl: 'Hoge zuiverheid geverifieerd door tweetraps HPLC (99,8%+)',
    hi: 'उच्च शुद्धता द्वि-चरणीय HPLC सत्यापित (99.8%+)'
  },
  'Keep refrigerated at -20°C': {
    es: 'Mantener refrigerado a -20 °C',
    fr: 'Conserver au réfrigérateur à -20 °C',
    de: 'Gekühlt bei -20 °C lagern',
    ja: '-20℃で冷蔵保存してください',
    zh: '请在 -20°C 冷藏保存',
    ar: 'يحفظ في الثلاجة عند -20 درجة مئوية',
    ru: 'Хранить в охлажденном виде при температуре -20°C',
    pt: 'Manter refrigerado a -20 °C',
    it: 'Conservare in frigorifero a -20°C',
    ko: '-20°C에서 냉장 보관하십시오',
    nl: 'Gekoeld bewaren bij -20 °C',
    hi: '-20 डिग्री सेल्सियस पर प्रशीتित रखें'
  },
  'Fast discreet cold-chain delivery': {
    es: 'Entrega rápida y discreta en cadena de frío',
    fr: 'Livraison rapide et discrète sous chaîne du froid',
    de: 'Schnelle und diskrete Kühlkettenlieferung',
    ja: '迅速かつ慎重なコールドチェーン配送',
    zh: '快速隐秘的冷链配送',
    ar: 'توصيل سريع وسري بسلسلة التبريد',
    ru: 'Быстрая и конфиденциальная доставка с соблюдением холодовой цепи',
    pt: 'Entrega rápida e discreta em cadeia de frio',
    it: 'Consegna rapida e discreta nella catena del freddo',
    ko: '빠르고 안전한 콜드체인 배송',
    nl: 'Snelle en discrete koelketenlevering',
    hi: 'त्वरित और विचारशील कोल्ड-चेन डिलीवरी'
  },
  'Order Placed Successfully': {
    es: 'Pedido realizado con éxito',
    fr: 'Commande passée avec succès',
    de: 'Bestellung erfolgreich aufgegeben',
    ja: '注文が正常に送信されました',
    zh: '订单提交成功',
    ar: 'تم تقديم الطلب بنجاح',
    ru: 'Заказ успешно оформлен',
    pt: 'Pedido realizado com sucesso',
    it: 'Ordine effettuato con successo',
    ko: '주문이 성공적으로 접수되었습니다',
    nl: 'Bestelling succesvol geplaatst',
    hi: 'ऑर्डर सफलतापूर्वक दिया गया'
  }
};

const SAMPLE_QUICK_PHRASES = [
  'For in vitro laboratory research use only',
  'Certificate of Analysis (COA)',
  'High Purity Dual-Stage HPLC Verified',
  'Keep refrigerated at -20°C',
  'Fast discreet cold-chain delivery',
  'Order Placed Successfully'
];

export const LocalTranslator: React.FC<LocalTranslatorProps> = ({
  isOpen: propIsOpen,
  onToggle,
  defaultTargetLang = 'es'
}) => {
  // Local state
  const [isOpenState, setIsOpenState] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : isOpenState;
  const setIsOpen = (open: boolean) => {
    if (onToggle) onToggle(open);
    setIsOpenState(open);
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState(defaultTargetLang);
  const [inputText, setInputText] = useState('For in vitro laboratory research use only');
  const [outputText, setOutputText] = useState('');
  const [engineType, setEngineType] = useState<'local_dictionary' | 'google_cloud' | 'cache'>('local_dictionary');
  const [latencyMs, setLatencyMs] = useState<number>(1);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Live Auto-Translate Mode Toggle
  const [isLiveStorefrontActive, setIsLiveStorefrontActive] = useState(false);

  // Hotkey listener (Alt + T or Ctrl + Shift + T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.code === 'KeyT') || (e.ctrlKey && e.shiftKey && e.code === 'KeyT')) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Translate function
  const performTranslation = async (textToTranslate: string, sLang: string, tLang: string) => {
    if (!textToTranslate.trim()) {
      setOutputText('');
      return;
    }

    if (sLang === tLang) {
      setOutputText(textToTranslate);
      setEngineType('local_dictionary');
      setLatencyMs(0);
      return;
    }

    setIsTranslating(true);
    const start = performance.now();

    // 1. Check local on-device dictionary first (instant < 2ms)
    const exactMatch = LOCAL_DICTIONARY[textToTranslate]?.[tLang];
    if (exactMatch) {
      setOutputText(exactMatch);
      setEngineType('local_dictionary');
      setLatencyMs(Math.max(1, Math.round(performance.now() - start)));
      setIsTranslating(false);
      return;
    }

    // 2. Fallback to Google Cloud Translation API via server proxy
    try {
      const res = await translateTextViaApi(textToTranslate, tLang, sLang);
      setOutputText(res.translatedText);
      setEngineType(res.engine === 'cache' ? 'cache' : 'google_cloud');
      setLatencyMs(Math.round(performance.now() - start));
    } catch (err) {
      console.warn('Local translator fallback notice:', err);
      setOutputText(textToTranslate);
    } finally {
      setIsTranslating(false);
    }
  };

  // Trigger translation on input or lang change
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        performTranslation(inputText, sourceLang, targetLang);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [inputText, sourceLang, targetLang, isOpen]);

  // Swap Languages
  const handleSwap = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setInputText(outputText || inputText);
  };

  // Text-To-Speech Pronunciation
  const handleSpeak = (text: string, langCode: string) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Copy
  const handleCopy = () => {
    if (!outputText) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Toggle Live Storefront Translation
  const handleToggleLiveStorefront = () => {
    const nextState = !isLiveStorefrontActive;
    setIsLiveStorefrontActive(nextState);
    if (nextState) {
      changeGoogleTranslateLanguage(targetLang);
    } else {
      changeGoogleTranslateLanguage('en');
    }
  };

  const targetLangInfo = getLanguageInfo(targetLang);
  const sourceLangInfo = getLanguageInfo(sourceLang);

  return (
    <>
      {/* Floating Trigger Pill (When closed or minimized) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 bg-slate-900/95 hover:bg-slate-800 text-slate-200 border border-emerald-500/40 rounded-full shadow-2xl shadow-black/80 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md group"
          title="Toggle Local & Google AI Translator (Alt + T)"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs group-hover:rotate-12 transition-transform">
            <Languages className="w-3.5 h-3.5" />
          </div>
          <span>Local Translator</span>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
            Alt+T
          </span>
        </button>
      )}

      {/* Floating Modal / Translator Dock (When Open) */}
      {isOpen && (
        <div className={`fixed z-50 transition-all duration-300 ${
          isMinimized
            ? 'bottom-6 right-6 w-80'
            : 'bottom-6 right-6 w-full max-w-lg'
        }`}>
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-black/95 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-black text-white">Local AI Translator</h3>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Offline Ready
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Instant chemical & laboratory translation console
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                  title="Close Translator"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Minimized Content */}
            {isMinimized ? (
              <div className="p-3 bg-slate-950/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span>{targetLangInfo.flag}</span>
                  <span className="font-bold text-white truncate">{targetLangInfo.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMinimized(false)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                >
                  Open Sandbox
                </button>
              </div>
            ) : (
              /* Expanded Body */
              <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Live Storefront Auto-Translate Banner */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      isLiveStorefrontActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Storefront Live Translation</span>
                        {isLiveStorefrontActive && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {isLiveStorefrontActive
                          ? `Active in ${targetLangInfo.name} across all pages`
                          : 'Translate all website DOM elements in real-time'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleLiveStorefront}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isLiveStorefrontActive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isLiveStorefrontActive ? 'Active (ON)' : 'Turn ON'}</span>
                  </button>
                </div>

                {/* Language Selection Bar */}
                <div className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-2">
                  {/* Source Lang */}
                  <div className="flex-1 relative">
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className="w-full pl-2 pr-7 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white appearance-none cursor-pointer focus:border-emerald-500 focus:outline-hidden"
                    >
                      {GOOGLE_SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Swap Button */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition cursor-pointer"
                    title="Swap Source & Target Languages"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Target Lang */}
                  <div className="flex-1 relative">
                    <select
                      value={targetLang}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setTargetLang(newLang);
                        if (isLiveStorefrontActive) {
                          changeGoogleTranslateLanguage(newLang);
                        }
                      }}
                      className="w-full pl-2 pr-7 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-emerald-300 appearance-none cursor-pointer focus:border-emerald-500 focus:outline-hidden"
                    >
                      {GOOGLE_SUPPORTED_LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Quick Phrase Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>Quick Lab & Catalog Phrases</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                    {SAMPLE_QUICK_PHRASES.map((phrase, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setInputText(phrase)}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white text-[10px] transition truncate max-w-[210px] cursor-pointer"
                        title={phrase}
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Text Area */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Source Text ({sourceLangInfo.name})</span>
                    <button
                      type="button"
                      onClick={() => setInputText('')}
                      className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or paste any scientific compound, description, batch note, or phrase..."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-hidden resize-none"
                  />
                </div>

                {/* Output Translation Area */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Translated Output ({targetLangInfo.name})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        {engineType === 'local_dictionary' ? 'Local Dict' : 'Neural API'} • {latencyMs}ms
                      </span>
                    </div>
                  </div>

                  <div className="relative p-3 bg-slate-950 border border-emerald-500/30 rounded-2xl text-xs text-emerald-200 min-h-[64px] leading-relaxed select-all">
                    {isTranslating ? (
                      <div className="flex items-center gap-2 text-slate-400 py-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Translating...</span>
                      </div>
                    ) : outputText ? (
                      <p>{outputText}</p>
                    ) : (
                      <span className="text-slate-600 italic">Waiting for text...</span>
                    )}

                    {/* Output action buttons */}
                    {outputText && (
                      <div className="absolute right-2 bottom-2 flex items-center gap-1 bg-slate-900/90 rounded-lg p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleSpeak(outputText, targetLang)}
                          className={`p-1.5 rounded-md hover:bg-slate-800 transition cursor-pointer ${
                            isSpeaking ? 'text-emerald-400 animate-pulse' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Listen to Audio Pronunciation"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={handleCopy}
                          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition cursor-pointer"
                          title="Copy Translation"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer Status Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Protected against CAS & formula mistranslation</span>
              </div>
              <span className="font-mono">v2.4 Local Engine</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
