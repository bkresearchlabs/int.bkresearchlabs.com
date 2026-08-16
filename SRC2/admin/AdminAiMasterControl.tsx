import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Power,
  Shield,
  Sliders,
  Terminal,
  Cpu,
  BrainCircuit,
  Image as ImageIcon,
  Video,
  Mic,
  Volume2,
  Search,
  MapPin,
  Music,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Send,
  Lock,
  Unlock,
  Key,
  Database,
  Layers,
  FileCode,
  Activity,
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Play,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import {
  AiMasterControlSettings,
  AiFeatureKey,
  AiFeatureConfig,
  DEFAULT_AI_MASTER_CONTROL,
  DEFAULT_AI_FEATURES_CONFIG
} from '../../types/ai';
import { SiteSettings } from '../../types';
import { aiApi } from '../../lib/aiApi';

interface AdminAiMasterControlProps {
  settings: SiteSettings;
  onSaveSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

type AiTabKey =
  | 'overview'
  | 'chat'
  | 'thinking'
  | 'vision'
  | 'video'
  | 'audio'
  | 'grounding'
  | 'music'
  | 'low_latency'
  | 'telemetry';

export const AdminAiMasterControl: React.FC<AdminAiMasterControlProps> = ({
  settings,
  onSaveSettings
}) => {
  const [aiConfig, setAiConfig] = useState<AiMasterControlSettings>(() => {
    return settings.ai_master_control || DEFAULT_AI_MASTER_CONTROL;
  });

  const [activeTab, setActiveTab] = useState<AiTabKey>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Live test sandboxes states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'BK Research Labs AI Specialist standby. Enter a prompt to test conversational logic.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [thinkingPrompt, setThinkingPrompt] = useState('Analyze HPLC retention factors for BPC-157 vs oxidized impurities.');
  const [thinkingResult, setThinkingResult] = useState<{ output: string; latency_ms?: number } | null>(null);
  const [isThinkingLoading, setIsThinkingLoading] = useState(false);

  const [imagePrompt, setImagePrompt] = useState('3D molecular render of MOTS-c mitochondrial peptide in sterile lab borosilicate vial');
  const [imageResult, setImageResult] = useState<{ url?: string; desc?: string } | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [searchPrompt, setSearchPrompt] = useState('Latest HPLC purity standards for synthetic research peptides 2026');
  const [searchResult, setSearchResult] = useState<{ answer: string; sources: any[] } | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const [fastPrompt, setFastPrompt] = useState('CAS number for Semaglutide');
  const [fastResult, setFastResult] = useState<{ reply: string; latency_ms: number } | null>(null);
  const [isFastLoading, setIsFastLoading] = useState(false);

  const [musicPrompt, setMusicPrompt] = useState('432Hz ambient cleanroom focus synth wave');
  const [musicResult, setMusicResult] = useState<any>(null);
  const [isMusicLoading, setIsMusicLoading] = useState(false);

  // Sync with server on load
  useEffect(() => {
    aiApi.getConfig().then(res => {
      if (res.config) {
        setAiConfig(prev => ({
          ...DEFAULT_AI_MASTER_CONTROL,
          ...prev,
          ...res.config,
          features: {
            ...DEFAULT_AI_FEATURES_CONFIG,
            ...(prev?.features || {}),
            ...(res.config.features || {})
          }
        }));
      }
    });
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleSave = async (customConfig?: AiMasterControlSettings) => {
    setIsSaving(true);
    const target = customConfig || aiConfig;
    try {
      await aiApi.saveConfig(target);
      await onSaveSettings({ ai_master_control: target });
      triggerToast('✓ AI Master Control configuration synced & saved across server');
    } catch (err: any) {
      triggerToast('❌ Error saving configuration: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleGlobal = (enabled: boolean) => {
    const updated: AiMasterControlSettings = {
      ...aiConfig,
      global_enabled: enabled
    };
    setAiConfig(updated);
    handleSave(updated);
  };

  const handleToggleFeature = (featureKey: AiFeatureKey, enabled: boolean) => {
    const currentFeat = aiConfig.features[featureKey] || DEFAULT_AI_FEATURES_CONFIG[featureKey];
    const updated: AiMasterControlSettings = {
      ...aiConfig,
      features: {
        ...aiConfig.features,
        [featureKey]: {
          ...currentFeat,
          enabled
        }
      }
    };
    setAiConfig(updated);
    handleSave(updated);
  };

  const handleUpdateFeatureConfig = (featureKey: AiFeatureKey, partial: Partial<AiFeatureConfig>) => {
    const currentFeat = aiConfig.features[featureKey] || DEFAULT_AI_FEATURES_CONFIG[featureKey];
    const updated: AiMasterControlSettings = {
      ...aiConfig,
      features: {
        ...aiConfig.features,
        [featureKey]: {
          ...currentFeat,
          ...partial
        }
      }
    };
    setAiConfig(updated);
  };

  const handleAllOff = () => {
    const updatedFeatures = { ...aiConfig.features };
    Object.keys(updatedFeatures).forEach(k => {
      updatedFeatures[k as AiFeatureKey] = {
        ...updatedFeatures[k as AiFeatureKey],
        enabled: false
      };
    });
    const updated: AiMasterControlSettings = {
      ...aiConfig,
      global_enabled: false,
      features: updatedFeatures
    };
    setAiConfig(updated);
    handleSave(updated);
    triggerToast('✓ All AI modules turned OFF (Master Standby Mode)');
  };

  const handleStandardPreset = () => {
    const updatedFeatures = { ...aiConfig.features };
    const standardKeys: AiFeatureKey[] = ['chat', 'general_intelligence', 'grounding_search', 'low_latency'];
    Object.keys(updatedFeatures).forEach(k => {
      const key = k as AiFeatureKey;
      updatedFeatures[key] = {
        ...updatedFeatures[key],
        enabled: standardKeys.includes(key)
      };
    });
    const updated: AiMasterControlSettings = {
      ...aiConfig,
      global_enabled: true,
      features: updatedFeatures
    };
    setAiConfig(updated);
    handleSave(updated);
    triggerToast('✓ Activated Standard Flash AI Preset (Chat, Search Grounding, General AI)');
  };

  const handleFullSuitePreset = () => {
    const updatedFeatures = { ...aiConfig.features };
    Object.keys(updatedFeatures).forEach(k => {
      const key = k as AiFeatureKey;
      updatedFeatures[key] = {
        ...updatedFeatures[key],
        enabled: true
      };
    });
    const updated: AiMasterControlSettings = {
      ...aiConfig,
      global_enabled: true,
      features: updatedFeatures
    };
    setAiConfig(updated);
    handleSave(updated);
    triggerToast('✓ Activated Full Pro & Creative Suite (All 15 AI Modules)');
  };

  // Test Handlers
  const handleTestChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user' as const, content: chatInput };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setIsChatLoading(true);

    const feat = aiConfig.features.chat;
    const res = await aiApi.chat({
      messages: newHistory,
      model: feat?.model || 'gemini-3.5-flash',
      systemInstruction: feat?.systemInstruction,
      temperature: feat?.temperature,
      forceAdminTest: true,
      apiKeyOverride: aiConfig.api_key_override
    });

    setIsChatLoading(false);
    if (res.success && res.reply) {
      setChatMessages([...newHistory, { role: 'assistant', content: res.reply }]);
    } else {
      setChatMessages([...newHistory, { role: 'assistant', content: `[AI Error]: ${res.error || 'Unknown failure'}` }]);
    }
  };

  const handleTestThinking = async () => {
    setIsThinkingLoading(true);
    setThinkingResult(null);
    const feat = aiConfig.features.thinking_mode;
    const res = await aiApi.thinking({
      prompt: thinkingPrompt,
      systemInstruction: feat?.systemInstruction,
      thinkingBudget: 2048,
      forceAdminTest: true,
      apiKeyOverride: aiConfig.api_key_override
    });
    setIsThinkingLoading(false);
    if (res.success) {
      setThinkingResult({ output: res.output, latency_ms: res.latency_ms });
    } else {
      setThinkingResult({ output: `Error: ${res.error || 'Execution failed'}` });
    }
  };

  const handleTestImage = async () => {
    setIsImageLoading(true);
    setImageResult(null);
    const feat = aiConfig.features.image_generation;
    const res = await aiApi.generateImage({
      prompt: imagePrompt,
      model: feat?.model || 'gemini-3.1-flash-image-preview',
      forceAdminTest: true,
      apiKeyOverride: aiConfig.api_key_override
    });
    setIsImageLoading(false);
    if (res.success) {
      setImageResult({ url: res.imageUrl, desc: res.description });
    } else {
      setImageResult({ desc: `Generation error: ${res.error}` });
    }
  };

  const handleTestSearch = async () => {
    setIsSearchLoading(true);
    setSearchResult(null);
    const res = await aiApi.groundedSearch({
      query: searchPrompt,
      forceAdminTest: true,
      apiKeyOverride: aiConfig.api_key_override
    });
    setIsSearchLoading(false);
    if (res.success) {
      setSearchResult({ answer: res.answer, sources: res.sources || [] });
    } else {
      setSearchResult({ answer: `Search error: ${res.error}`, sources: [] });
    }
  };

  const handleTestFast = async () => {
    setIsFastLoading(true);
    setFastResult(null);
    const res = await aiApi.fastQuery({
      prompt: fastPrompt,
      forceAdminTest: true,
      apiKeyOverride: aiConfig.api_key_override
    });
    setIsFastLoading(false);
    if (res.success) {
      setFastResult({ reply: res.reply, latency_ms: res.latency_ms || 180 });
    } else {
      setFastResult({ reply: `Fast query error: ${res.error}`, latency_ms: 0 });
    }
  };

  const handleTestMusic = async () => {
    setIsMusicLoading(true);
    setMusicResult(null);
    const res = await aiApi.generateMusic({
      prompt: musicPrompt,
      forceAdminTest: true,
      apiKeyOverride: aiConfig.api_key_override
    });
    setIsMusicLoading(false);
    if (res.success) {
      setMusicResult(res);
    } else {
      setMusicResult({ message: `Lyria error: ${res.error}` });
    }
  };

  const activeFeatureCount = (Object.values(aiConfig.features || {}) as AiFeatureConfig[]).filter(f => f.enabled).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 text-xs animate-bounce font-medium">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Banner: Master Global AI Kill Switch & Status */}
      <div className={`p-6 rounded-3xl border transition-all duration-300 ${
        aiConfig.global_enabled
          ? 'bg-gradient-to-r from-[#002b29] via-[#003835] to-[#014d48] border-emerald-500/50 shadow-xl shadow-emerald-950/20 text-white'
          : 'bg-slate-900 border-slate-700 text-slate-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${aiConfig.global_enabled ? 'bg-emerald-500 text-[#002b29]' : 'bg-slate-800 text-slate-400'}`}>
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-serif font-bold tracking-tight">AI Master Control Dashboard</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    aiConfig.global_enabled
                      ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                  }`}>
                    {aiConfig.global_enabled ? '● Active Engine' : '○ Standby Lock (OFF)'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Universal governance over all local and global AI capabilities, neural models, reasoning engines, and API endpoints.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>API Key: <strong className="text-emerald-300">{aiConfig.master_api_key_configured ? 'Configured' : 'Missing'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Modules: <strong className="text-emerald-300">{aiConfig.global_enabled ? `${activeFeatureCount} / 15` : '0 (Kill-Switch Active)'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safety: <strong className="text-emerald-300">{aiConfig.safety_threshold}</strong></span>
              </div>
            </div>
          </div>

          {/* Master Global Switch & Quick Presets */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-200">Master AI Kill Switch</div>
                <div className="text-[10px] text-slate-400">{aiConfig.global_enabled ? 'AI APIs Online' : 'Locked Off by Default'}</div>
              </div>
              <button
                id="ai-master-toggle-btn"
                onClick={() => handleToggleGlobal(!aiConfig.global_enabled)}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  aiConfig.global_enabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    aiConfig.global_enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="h-px sm:h-8 sm:w-px bg-white/10" />

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleAllOff}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                title="Lock all AI capabilities off"
              >
                All Off
              </button>
              <button
                onClick={handleStandardPreset}
                className="px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                title="Turn on Chat & Standard AI"
              >
                Standard Flash
              </button>
              <button
                onClick={handleFullSuitePreset}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-[#002b29] font-bold rounded-xl text-xs cursor-pointer transition-colors"
                title="Turn on all 15 AI modules"
              >
                Full Suite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-3 no-scrollbar text-xs font-medium">
        {[
          { id: 'overview', label: '1. Settings & API Vault', icon: Sliders },
          { id: 'chat', label: '2. Multi-Turn Chat', icon: Bot },
          { id: 'thinking', label: '3. Thinking & Reasoning', icon: BrainCircuit },
          { id: 'vision', label: '4. Vision & Images', icon: ImageIcon },
          { id: 'video', label: '5. Veo Video Studio', icon: Video },
          { id: 'audio', label: '6. Audio & Transcribe', icon: Mic },
          { id: 'grounding', label: '7. Search & Maps Grounding', icon: Search },
          { id: 'music', label: '8. Lyria Music & Focus', icon: Music },
          { id: 'low_latency', label: '9. Fast Response Engine', icon: Zap },
          { id: 'telemetry', label: '10. Audit & Logs', icon: Terminal },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AiTabKey)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#002b29] text-emerald-300 font-bold shadow-md shadow-emerald-950/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & GLOBAL SETTINGS */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Master Parameters */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-lg">AI Engine Master Parameters</h3>
                  <p className="text-slate-500 text-xs">Configure global AI gateway credentials, rate limits, and brand safety policies.</p>
                </div>
                <button
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Parameters'}</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Master Gemini API Key Override (Optional)</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={aiConfig.api_key_override || ''}
                      onChange={e => setAiConfig({ ...aiConfig, api_key_override: e.target.value })}
                      placeholder="Uses process.env.GEMINI_API_KEY by default"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                    />
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Leave blank to use server environment secret automatically.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Default Model Family Tier</label>
                  <select
                    value={aiConfig.default_model_tier}
                    onChange={e => setAiConfig({ ...aiConfig, default_model_tier: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                  >
                    <option value="flash">Gemini 3.5 Flash (Balanced speed & STEM accuracy)</option>
                    <option value="pro">Gemini 3.1 Pro (Complex reasoning & deep logic)</option>
                    <option value="flash_lite">Gemini 3.1 Flash Lite (Lowest latency & highest throughput)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Global Rate Limit (RPM)</label>
                  <input
                    type="number"
                    value={aiConfig.rate_limit_rpm}
                    onChange={e => setAiConfig({ ...aiConfig, rate_limit_rpm: Number(e.target.value) || 60 })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Safety & Harm Threshold</label>
                  <select
                    value={aiConfig.safety_threshold}
                    onChange={e => setAiConfig({ ...aiConfig, safety_threshold: e.target.value as any })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-xs"
                  >
                    <option value="BLOCK_MEDIUM_AND_ABOVE">Block Medium & High (Recommended)</option>
                    <option value="BLOCK_LOW_AND_ABOVE">Strict Block Low & Above</option>
                    <option value="BLOCK_ONLY_HIGH">Permissive Block Only High</option>
                    <option value="BLOCK_NONE">Unfiltered Research Mode</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Customer-Facing AI Assistant Widget</div>
                    <div className="text-slate-500 text-[11px]">Display floating AI Laboratory Assistant on storefront and customer portal.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiConfig.enable_customer_facing_chat}
                    onChange={e => setAiConfig({ ...aiConfig, enable_customer_facing_chat: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Admin Document & Synthesis Copilot</div>
                    <div className="text-slate-500 text-[11px]">Enable AI description generator and CoA analysis inside Document Center and Products.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiConfig.enable_admin_document_assistant}
                    onChange={e => setAiConfig({ ...aiConfig, enable_admin_document_assistant: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Log AI Telemetry & Audit Trail</div>
                    <div className="text-slate-500 text-[11px]">Record response latency, token consumption, and safety filter events.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiConfig.log_ai_telemetry}
                    onChange={e => setAiConfig({ ...aiConfig, log_ai_telemetry: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* System Instructions & Brand Safety */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">Default Laboratory Persona & Compliance Directives</h4>
                <div>
                  <label className="block text-slate-600 text-[11px] mb-1 font-medium">Default System Persona</label>
                  <input
                    type="text"
                    value={aiConfig.system_instructions?.default_persona || ''}
                    onChange={e => setAiConfig({
                      ...aiConfig,
                      system_instructions: {
                        ...aiConfig.system_instructions,
                        default_persona: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-[11px] mb-1 font-medium">Mandatory Research Disclaimer Appended to Responses</label>
                  <textarea
                    rows={2}
                    value={aiConfig.system_instructions?.brand_safety_disclaimer || ''}
                    onChange={e => setAiConfig({
                      ...aiConfig,
                      system_instructions: {
                        ...aiConfig.system_instructions,
                        brand_safety_disclaimer: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Feature Switch Matrix */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-slate-900 text-base">Module Switch Matrix</h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {activeFeatureCount} Active
                </span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {(Object.entries(aiConfig.features || DEFAULT_AI_FEATURES_CONFIG) as [AiFeatureKey, AiFeatureConfig][]).map(([key, feat]) => {
                  const fKey = key as AiFeatureKey;
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        feat.enabled && aiConfig.global_enabled
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                          : 'bg-slate-50/60 border-slate-200/80 text-slate-500'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{feat.name}</span>
                          {feat.requiresPaidTier && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-sm font-medium">Pro</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{feat.model}</div>
                      </div>

                      <input
                        type="checkbox"
                        checked={feat.enabled}
                        onChange={e => handleToggleFeature(fKey, e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-TURN CHATBOT */}
      {activeTab === 'chat' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-600" />
                <h3 className="font-serif font-bold text-slate-900 text-base">Chatbot Engine Configuration</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Feature Active:</span>
                <input
                  type="checkbox"
                  checked={aiConfig.features.chat?.enabled || false}
                  onChange={e => handleToggleFeature('chat', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Model Alias</label>
                <select
                  value={aiConfig.features.chat?.model || 'gemini-3.5-flash'}
                  onChange={e => handleUpdateFeatureConfig('chat', { model: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (Recommended default)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Paid Tier / High reasoning)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra low latency)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Temperature ({aiConfig.features.chat?.temperature || 0.7})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={aiConfig.features.chat?.temperature ?? 0.7}
                  onChange={e => handleUpdateFeatureConfig('chat', { temperature: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0.0 (Deterministic / Scientific)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">System Instructions</label>
                <textarea
                  rows={4}
                  value={aiConfig.features.chat?.systemInstruction || ''}
                  onChange={e => handleUpdateFeatureConfig('chat', { systemInstruction: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  placeholder="Define role, constraints, and research compound disclaimers..."
                />
              </div>

              <button
                onClick={() => handleSave()}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Chat Configuration</span>
              </button>
            </div>
          </div>

          {/* Interactive Chat Sandbox */}
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-slate-200 flex flex-col h-[520px] shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Live Chat Sandbox</span>
              </div>
              <button
                onClick={() => setChatMessages([{ role: 'assistant', content: 'Chat history cleared. Standby for query.' }])}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs font-mono">
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl max-w-[85%] ${
                    m.role === 'user'
                      ? 'ml-auto bg-emerald-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-60 mb-1">{m.role === 'user' ? 'Admin Test User' : 'Gemini Model'}</div>
                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                </div>
              ))}
              {isChatLoading && (
                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-400 text-xs animate-pulse flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Gemini synthesizing laboratory response...</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTestChat()}
                placeholder="Ask about CAS numbers, peptide reconstitution, or HPLC specs..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleTestChat}
                disabled={isChatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#002b29] font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THINKING & DEEP REASONING */}
      {activeTab === 'thinking' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Thinking & Deep Reasoning Mode</h3>
                <p className="text-slate-500 text-xs">High-level chain-of-thought calculation using <strong>gemini-3.1-pro-preview</strong> for advanced biochemical modeling.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Enable Thinking Mode:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.thinking_mode?.enabled || false}
                onChange={e => handleToggleFeature('thinking_mode', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reasoning Prompt / Computational Assay</label>
                <textarea
                  rows={4}
                  value={thinkingPrompt}
                  onChange={e => setThinkingPrompt(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Thinking Budget (Tokens)</label>
                <input
                  type="number"
                  value={2048}
                  readOnly
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Configured for 2048 high-depth analytical reasoning steps.</p>
              </div>

              <button
                onClick={handleTestThinking}
                disabled={isThinkingLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-900/10"
              >
                {isThinkingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{isThinkingLoading ? 'Executing Deep Reasoning Chain...' : 'Run Thinking Mode Test'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-200 flex flex-col h-[320px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-xs text-slate-400">
                <span>Reasoning Output</span>
                {thinkingResult?.latency_ms && <span className="text-emerald-400 font-mono">{thinkingResult.latency_ms}ms</span>}
              </div>
              <div className="flex-1 overflow-y-auto text-xs font-mono whitespace-pre-wrap text-slate-300 leading-relaxed pr-2">
                {thinkingResult ? thinkingResult.output : 'Ready. Click "Run Thinking Mode Test" to trigger chain-of-thought analysis.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VISION & IMAGES */}
      {activeTab === 'vision' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Vision & Image Studio</h3>
                <p className="text-slate-500 text-xs">Generate compound visualization renders and inspect molecular structures with <strong>gemini-3.1-flash-image-preview</strong> & <strong>gemini-3.1-pro-preview</strong>.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Image Generation Active:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.image_generation?.enabled || false}
                onChange={e => handleToggleFeature('image_generation', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Generation Prompt</label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Model</label>
                <select
                  value={aiConfig.features.image_generation?.model || 'gemini-3.1-flash-image-preview'}
                  onChange={e => handleUpdateFeatureConfig('image_generation', { model: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="gemini-3.1-flash-image-preview">gemini-3.1-flash-image-preview (High Quality & Fast)</option>
                  <option value="gemini-3-pro-image-preview">gemini-3-pro-image-preview (4K Maximum Resolution)</option>
                  <option value="gemini-3.1-flash-lite-image">gemini-3.1-flash-lite-image (Rapid Prototyping)</option>
                </select>
              </div>

              <button
                onClick={handleTestImage}
                disabled={isImageLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isImageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isImageLoading ? 'Rendering Compound Visual...' : 'Generate Laboratory Visual'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-200 flex flex-col items-center justify-center min-h-[280px]">
              {imageResult?.url ? (
                <div className="space-y-2 text-center">
                  <img src={imageResult.url} alt="Generated visual" className="max-h-[220px] rounded-xl object-contain border border-slate-700" />
                  <p className="text-[11px] text-slate-400 font-mono">{imageResult.desc}</p>
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-500 text-xs">
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-700" />
                  <p>{imageResult?.desc || 'Image output preview area. Click "Generate Laboratory Visual" to synthesize asset.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VEO VIDEO STUDIO */}
      {activeTab === 'video' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Veo Video Studio & Dynamics</h3>
                <p className="text-slate-500 text-xs">High-definition 3D molecular rotations and reaction kinetics with <strong>veo-3.1-fast-generate-preview</strong>.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Veo Video Active:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.video_generation?.enabled || false}
                onChange={e => handleToggleFeature('video_generation', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="font-bold text-slate-900">Supported Veo Capabilities:</div>
            <div className="grid sm:grid-cols-3 gap-3 text-slate-600">
              <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                <strong>1. Text-to-Video:</strong> Generate 1080p clips of chemical compound dissolution and sterile cleanroom procedures.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                <strong>2. Image-to-Video:</strong> Animate static 2D molecular structures into rotating 3D ball-and-stick spatial videos.
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/60">
                <strong>3. Video Inspection:</strong> Analyze laboratory camera feeds to detect fluid level changes and precipitation.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIO & VOICE */}
      {activeTab === 'audio' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Audio & Speech Transcription</h3>
                <p className="text-slate-500 text-xs">Laboratory dictation speech-to-text and live voice interactions using <strong>gemini-3.5-flash</strong> & <strong>gemini-3.1-flash-live-preview</strong>.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Audio Transcribe Active:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.audio_transcription?.enabled || false}
                onChange={e => handleToggleFeature('audio_transcription', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-emerald-600" />
                <span>Cleanroom Voice Dictation</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Transcribes voice recordings of chemical batch preparations directly into structured JSON records for Quality Assurance logs.
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span>Text-to-Speech (TTS) Voice Guidance</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Provides hands-free audio readouts of safety handling procedures and reconstitution ratios for sterile glovebox operators.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SEARCH & MAPS GROUNDING */}
      {activeTab === 'grounding' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Google Search & Maps Grounding</h3>
                <p className="text-slate-500 text-xs">Anchor AI responses with real-time web citations from Google Search and institutional laboratory logistics from Google Maps.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Search Grounding Active:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.grounding_search?.enabled || false}
                onChange={e => handleToggleFeature('grounding_search', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grounded Search Query</label>
                <input
                  type="text"
                  value={searchPrompt}
                  onChange={e => setSearchPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <button
                onClick={handleTestSearch}
                disabled={isSearchLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSearchLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>{isSearchLoading ? 'Querying Google Search Grounding...' : 'Test Grounded Query'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-200 flex flex-col h-[300px]">
              <div className="border-b border-slate-800 pb-2 mb-2 text-xs font-bold text-emerald-400">
                Grounded Web Response with Citations
              </div>
              <div className="flex-1 overflow-y-auto text-xs space-y-3 pr-2">
                <p className="text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {searchResult?.answer || 'Search grounding output will appear here with live citation links.'}
                </p>
                {searchResult?.sources && searchResult.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Web Sources:</div>
                    {searchResult.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-[11px] text-emerald-400 hover:underline truncate"
                      >
                        ↗ {src.title || src.uri}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: LYRIA MUSIC & FOCUS */}
      {activeTab === 'music' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Music className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Lyria Music & Focus Soundscapes</h3>
                <p className="text-slate-500 text-xs">Generate ambient 432Hz focus audio and study soundscapes with <strong>lyria-3-clip-preview</strong>.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Lyria Audio Active:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.music_generation?.enabled || false}
                onChange={e => handleToggleFeature('music_generation', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Soundscape Theme / Mood</label>
                <input
                  type="text"
                  value={musicPrompt}
                  onChange={e => setMusicPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                onClick={handleTestMusic}
                disabled={isMusicLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isMusicLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                <span>{isMusicLoading ? 'Synthesizing Soundscape...' : 'Synthesize Audio Track'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-200 flex flex-col justify-center items-center text-center space-y-3">
              <Music className="w-8 h-8 text-emerald-400" />
              <div className="text-xs font-bold text-slate-200">{musicResult?.title || 'Ambient Laboratory Synthesizer'}</div>
              <p className="text-[11px] text-slate-400 max-w-sm">{musicResult?.message || 'Click "Synthesize Audio Track" to generate ambient binaural frequencies.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: LOW LATENCY STREAM */}
      {activeTab === 'low_latency' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-lg">Ultra Low-Latency Response Engine</h3>
                <p className="text-slate-500 text-xs">High-speed autocomplete and instant chemical synonyms with <strong>gemini-3.1-flash-lite</strong>.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Fast Lite Active:</span>
              <input
                type="checkbox"
                checked={aiConfig.features.low_latency?.enabled || false}
                onChange={e => handleToggleFeature('low_latency', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fast Query String</label>
                <input
                  type="text"
                  value={fastPrompt}
                  onChange={e => setFastPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <button
                onClick={handleTestFast}
                disabled={isFastLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {isFastLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isFastLoading ? 'Measuring Latency...' : 'Benchmark Fast Response (<300ms)'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 text-slate-200 flex flex-col justify-between h-[180px]">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Response</span>
                {fastResult && <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md font-mono text-[11px]">{fastResult.latency_ms} ms</span>}
              </div>
              <div className="text-xs font-mono text-slate-200 whitespace-pre-wrap">
                {fastResult ? fastResult.reply : 'Output benchmark will appear here.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: TELEMETRY & AUDIT */}
      {activeTab === 'telemetry' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-lg">AI Telemetry & Request Audit Logs</h3>
              <p className="text-slate-500 text-xs">Real-time trace of AI inferences, execution latencies, and security filter decisions.</p>
            </div>
            <button
              onClick={() => {
                aiApi.getConfig().then(res => {
                  if (res.config?.telemetry_logs) {
                    setAiConfig(prev => ({ ...prev, telemetry_logs: res.config.telemetry_logs }));
                  }
                });
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Feature</th>
                  <th className="py-2.5 px-3">Model</th>
                  <th className="py-2.5 px-3">Latency</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(aiConfig.telemetry_logs || []).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{log.feature}</td>
                    <td className="py-2.5 px-3 text-emerald-800">{log.model}</td>
                    <td className="py-2.5 px-3">{log.latency_ms}ms</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'success' ? 'bg-emerald-100 text-emerald-800' :
                        log.status === 'disabled' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{log.prompt_preview}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
