export type AiFeatureKey =
  | 'chat'
  | 'video_analysis'
  | 'video_generation'
  | 'video_animation'
  | 'thinking_mode'
  | 'audio_transcription'
  | 'voice_conversations'
  | 'image_analysis'
  | 'image_generation'
  | 'image_editing'
  | 'general_intelligence'
  | 'grounding_search'
  | 'grounding_maps'
  | 'music_generation'
  | 'low_latency';

export type AiFeatureCategory =
  | 'chat_conversation'
  | 'video_media'
  | 'reasoning_thinking'
  | 'audio_voice'
  | 'image_vision'
  | 'intelligence_synthesis'
  | 'grounding_search'
  | 'music_audio'
  | 'performance_speed';

export interface AiFeatureConfig {
  id: AiFeatureKey;
  name: string;
  category: AiFeatureCategory;
  enabled: boolean; // Default FALSE
  model: string;
  supportedModels: string[];
  description: string;
  temperature: number;
  maxTokens?: number;
  systemInstruction?: string;
  quotaLimitPerHour?: number;
  customPromptPrefix?: string;
  enableLocalSandbox?: boolean;
  requiresPaidTier?: boolean;
}

export interface AiTelemetryLog {
  id: string;
  feature: AiFeatureKey;
  model: string;
  latency_ms: number;
  status: 'success' | 'blocked' | 'error' | 'disabled';
  prompt_preview: string;
  response_preview?: string;
  timestamp: string;
}

export interface AiMasterControlSettings {
  global_enabled: boolean; // Default FALSE (master kill-switch)
  master_api_key_configured: boolean;
  api_key_override?: string;
  default_model_tier: 'flash' | 'pro' | 'flash_lite';
  rate_limit_rpm: number;
  safety_threshold: 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_NONE';
  log_ai_telemetry: boolean;
  cache_responses: boolean;
  enable_customer_facing_chat: boolean;
  enable_admin_document_assistant: boolean;
  features: Record<AiFeatureKey, AiFeatureConfig>;
  system_instructions: {
    default_persona: string;
    scientific_strictness: 'high' | 'standard' | 'relaxed';
    allow_speculative_chemistry: boolean;
    brand_safety_disclaimer: string;
  };
  telemetry_logs?: AiTelemetryLog[];
}

export const DEFAULT_AI_FEATURES_CONFIG: Record<AiFeatureKey, AiFeatureConfig> = {
  chat: {
    id: 'chat',
    name: 'Multi-Turn Gemini Chatbot',
    category: 'chat_conversation',
    enabled: false, // Default OFF
    model: 'gemini-3.5-flash',
    supportedModels: ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'],
    description: 'Conversational assistant for chemical inquiries, product specs, lab handling protocols, and order queries.',
    temperature: 0.7,
    maxTokens: 2048,
    systemInstruction: 'You are the BK Research Labs Analytical AI Specialist. Assist researchers with verified biochemical properties, storage protocols, and HPLC standards. Always emphasize that compounds are strictly for in vitro laboratory research.',
    quotaLimitPerHour: 120,
    enableLocalSandbox: true,
    requiresPaidTier: false
  },
  thinking_mode: {
    id: 'thinking_mode',
    name: 'High-Level Thinking & Reasoning Mode',
    category: 'reasoning_thinking',
    enabled: false, // Default OFF
    model: 'gemini-3.1-pro-preview',
    supportedModels: ['gemini-3.1-pro-preview'],
    description: 'Deep chain-of-thought analysis for complex biochemical pathways, peptide synthesis validation, and assay design.',
    temperature: 0.2,
    maxTokens: 4096,
    systemInstruction: 'You are an advanced computational biochemist. Perform thorough, step-by-step reasoning on molecular mass calibration, HPLC retention kinetics, and solubility optimization.',
    quotaLimitPerHour: 60,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  video_analysis: {
    id: 'video_analysis',
    name: 'Video & Fluid Motion Analysis',
    category: 'video_media',
    enabled: false, // Default OFF
    model: 'gemini-3.1-pro-preview',
    supportedModels: ['gemini-3.1-pro-preview'],
    description: 'Inspect laboratory video feeds, dissolution rates, pipette dispensing accuracy, and reaction kinetics over time.',
    temperature: 0.4,
    maxTokens: 2048,
    quotaLimitPerHour: 40,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  video_generation: {
    id: 'video_generation',
    name: 'Veo Video Generation',
    category: 'video_media',
    enabled: false, // Default OFF
    model: 'veo-3.1-fast-generate-preview',
    supportedModels: ['veo-3.1-fast-generate-preview', 'veo-3.1-lite-generate-preview', 'veo-3.1-generate-preview'],
    description: 'Generate high-definition 3D molecular rotations, chemical reaction animations, and laboratory product showcase clips.',
    temperature: 0.7,
    quotaLimitPerHour: 20,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  video_animation: {
    id: 'video_animation',
    name: 'Veo Image-to-Video Animation',
    category: 'video_media',
    enabled: false, // Default OFF
    model: 'veo-3.1-fast-generate-preview',
    supportedModels: ['veo-3.1-fast-generate-preview', 'veo-3.1-lite-generate-preview'],
    description: 'Transform static compound vial photos and chemical structure diagrams into fluidly animated video clips.',
    temperature: 0.7,
    quotaLimitPerHour: 20,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  audio_transcription: {
    id: 'audio_transcription',
    name: 'Audio Transcription (Speech-to-Text)',
    category: 'audio_voice',
    enabled: false, // Default OFF
    model: 'gemini-3.5-flash',
    supportedModels: ['gemini-3.5-flash', 'gemini-3.1-flash-lite'],
    description: 'Transcribe laboratory audio dictations, researcher voice notes, and phone call support recordings.',
    temperature: 0.1,
    maxTokens: 2048,
    quotaLimitPerHour: 100,
    enableLocalSandbox: true,
    requiresPaidTier: false
  },
  voice_conversations: {
    id: 'voice_conversations',
    name: 'Voice Conversations & Live Audio',
    category: 'audio_voice',
    enabled: false, // Default OFF
    model: 'gemini-3.1-flash-live-preview',
    supportedModels: ['gemini-3.1-flash-live-preview', 'gemini-3.1-flash-tts-preview'],
    description: 'Interactive voice communications with real-time text-to-speech audio streaming for hands-free cleanroom use.',
    temperature: 0.6,
    quotaLimitPerHour: 60,
    enableLocalSandbox: true,
    requiresPaidTier: false
  },
  image_analysis: {
    id: 'image_analysis',
    name: 'Vision & Chemical Structure Analysis',
    category: 'image_vision',
    enabled: false, // Default OFF
    model: 'gemini-3.1-pro-preview',
    supportedModels: ['gemini-3.1-pro-preview', 'gemini-3.5-flash'],
    description: 'Extract chemical formulas from molecular diagrams, parse HPLC chromatogram charts, and inspect vial label barcodes.',
    temperature: 0.2,
    maxTokens: 2048,
    quotaLimitPerHour: 120,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  image_generation: {
    id: 'image_generation',
    name: 'High-Fidelity Image Generation',
    category: 'image_vision',
    enabled: false, // Default OFF
    model: 'gemini-3.1-flash-image-preview',
    supportedModels: ['gemini-3-pro-image-preview', 'gemini-3.1-flash-image-preview', 'gemini-3.1-flash-lite-image'],
    description: 'Generate photorealistic chemical vial product renders, 3D molecular lattice visuals, and laboratory banner graphics.',
    temperature: 0.8,
    quotaLimitPerHour: 50,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  image_editing: {
    id: 'image_editing',
    name: 'Image Inpainting & Visual Editing',
    category: 'image_vision',
    enabled: false, // Default OFF
    model: 'gemini-3.1-flash-image-preview',
    supportedModels: ['gemini-3.1-flash-image-preview', 'gemini-3.1-flash-lite-image'],
    description: 'Modify vial labels, replace backgrounds, and adjust visual color temperatures of compound mockups.',
    temperature: 0.5,
    quotaLimitPerHour: 50,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  general_intelligence: {
    id: 'general_intelligence',
    name: 'General Gemini Intelligence & Synthesis',
    category: 'intelligence_synthesis',
    enabled: false, // Default OFF
    model: 'gemini-3.5-flash',
    supportedModels: ['gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'],
    description: 'Automatic batch product description writing, COA data summarization, and compound taxonomy classification.',
    temperature: 0.5,
    maxTokens: 2048,
    quotaLimitPerHour: 200,
    enableLocalSandbox: true,
    requiresPaidTier: false
  },
  grounding_search: {
    id: 'grounding_search',
    name: 'Google Search Grounding',
    category: 'grounding_search',
    enabled: false, // Default OFF
    model: 'gemini-3.5-flash',
    supportedModels: ['gemini-3.5-flash', 'gemini-3.1-pro-preview'],
    description: 'Anchor AI responses with live Google Search citations, recent academic publications (PubMed/bioRxiv), and vendor pricing.',
    temperature: 0.3,
    maxTokens: 2048,
    quotaLimitPerHour: 80,
    enableLocalSandbox: true,
    requiresPaidTier: false
  },
  grounding_maps: {
    id: 'grounding_maps',
    name: 'Google Maps Grounding & Logistics',
    category: 'grounding_search',
    enabled: false, // Default OFF
    model: 'gemini-3.5-flash',
    supportedModels: ['gemini-3.5-flash'],
    description: 'Ground cold-chain transport queries with verified institutional laboratory addresses and geographical dispatch routing.',
    temperature: 0.2,
    maxTokens: 1024,
    quotaLimitPerHour: 80,
    enableLocalSandbox: true,
    requiresPaidTier: false
  },
  music_generation: {
    id: 'music_generation',
    name: 'Lyria Music & Focus Soundscape Generator',
    category: 'music_audio',
    enabled: false, // Default OFF
    model: 'lyria-3-clip-preview',
    supportedModels: ['lyria-3-clip-preview', 'lyria-3-pro-preview'],
    description: 'Generate ambient laboratory focus soundscapes, binaural research study beats, and brand audio clips.',
    temperature: 0.7,
    quotaLimitPerHour: 30,
    enableLocalSandbox: true,
    requiresPaidTier: true
  },
  low_latency: {
    id: 'low_latency',
    name: 'Ultra Low-Latency Quick Responses',
    category: 'performance_speed',
    enabled: false, // Default OFF
    model: 'gemini-3.1-flash-lite',
    supportedModels: ['gemini-3.1-flash-lite', 'gemini-3.5-flash'],
    description: 'Sub-second real-time search autocompletion, instant chemical synonyms lookup, and quick unit conversions.',
    temperature: 0.2,
    maxTokens: 512,
    quotaLimitPerHour: 300,
    enableLocalSandbox: true,
    requiresPaidTier: false
  }
};

export const DEFAULT_AI_MASTER_CONTROL: AiMasterControlSettings = {
  global_enabled: false, // OFF by default
  master_api_key_configured: true,
  default_model_tier: 'flash',
  rate_limit_rpm: 60,
  safety_threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  log_ai_telemetry: true,
  cache_responses: true,
  enable_customer_facing_chat: false,
  enable_admin_document_assistant: false,
  features: DEFAULT_AI_FEATURES_CONFIG,
  system_instructions: {
    default_persona: 'BK Research Labs Principal AI Science Specialist',
    scientific_strictness: 'high',
    allow_speculative_chemistry: false,
    brand_safety_disclaimer: 'All chemical compounds and reagents are strictly engineered for in vitro research and laboratory calibration. Not for human or veterinary use.'
  },
  telemetry_logs: [
    {
      id: 'log-init-1',
      feature: 'chat',
      model: 'gemini-3.5-flash',
      latency_ms: 320,
      status: 'disabled',
      prompt_preview: 'System initialized in Safe Standby mode. All AI modules are locked off by default.',
      timestamp: new Date().toISOString()
    }
  ]
};
