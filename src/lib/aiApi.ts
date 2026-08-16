import {
  AiFeatureKey,
  AiMasterControlSettings,
  AiTelemetryLog,
  DEFAULT_AI_MASTER_CONTROL
} from '../types/ai';

export interface AiApiResponse<T = any> {
  success: boolean;
  disabled?: boolean;
  error?: string;
  data?: T;
  latency_ms?: number;
  [key: string]: any;
}

export const aiApi = {
  // 1. Fetch AI Master Control Config from Server
  getConfig: async (): Promise<{ success: boolean; config: AiMasterControlSettings }> => {
    try {
      const res = await fetch('/api/ai/config');
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Failed to fetch AI server config:', e);
    }
    return { success: true, config: DEFAULT_AI_MASTER_CONTROL };
  },

  // 2. Save Updated AI Master Control Settings
  saveConfig: async (updates: Partial<AiMasterControlSettings>): Promise<{ success: boolean; config: AiMasterControlSettings }> => {
    try {
      const res = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to save AI server config:', e);
    }
    return { success: false, config: DEFAULT_AI_MASTER_CONTROL };
  },

  // 3. Multi-Turn Chat
  chat: async (params: {
    messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>;
    model?: string;
    systemInstruction?: string;
    temperature?: number;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ reply: string; model: string }>> => {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const json = await res.json();
      return json;
    } catch (err: any) {
      return { success: false, error: err.message || 'Chat service connection error' };
    }
  },

  // 4. Thinking Mode & Deep Reasoning
  thinking: async (params: {
    prompt: string;
    systemInstruction?: string;
    thinkingBudget?: number;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ output: string; thoughts: string; model: string }>> => {
    try {
      const res = await fetch('/api/ai/thinking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Thinking service connection error' };
    }
  },

  // 5. Image Vision Analysis
  analyzeImage: async (params: {
    prompt?: string;
    imageBase64?: string;
    mimeType?: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ analysis: string }>> => {
    try {
      const res = await fetch('/api/ai/image/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Image analysis error' };
    }
  },

  // 6. Image Generation
  generateImage: async (params: {
    prompt: string;
    aspectRatio?: string;
    model?: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ imageUrl?: string; description?: string; model: string }>> => {
    try {
      const res = await fetch('/api/ai/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Image generation error' };
    }
  },

  // 7. Audio Transcription
  transcribeAudio: async (params: {
    audioBase64: string;
    mimeType?: string;
    prompt?: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ transcription: string }>> => {
    try {
      const res = await fetch('/api/ai/audio/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Transcription error' };
    }
  },

  // 8. Search Grounding
  groundedSearch: async (params: {
    query: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ answer: string; sources: Array<{ title: string; uri: string }> }>> => {
    try {
      const res = await fetch('/api/ai/grounding/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Search grounding error' };
    }
  },

  // 9. General Intelligence Task
  runIntelligenceTask: async (params: {
    task: string;
    inputData: any;
    model?: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ task: string; result: string }>> => {
    try {
      const res = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Intelligence task error' };
    }
  },

  // 10. Low Latency Fast Query
  fastQuery: async (params: {
    prompt: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ reply: string }>> => {
    try {
      const res = await fetch('/api/ai/fast-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Fast query error' };
    }
  },

  // 11. Veo Video Generation
  generateVideo: async (params: {
    prompt: string;
    durationSeconds?: number;
    aspectRatio?: string;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ status: string; videoPlaceholderUrl?: string; message: string }>> => {
    try {
      const res = await fetch('/api/ai/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Video generation error' };
    }
  },

  // 12. Lyria Music Generation
  generateMusic: async (params: {
    prompt?: string;
    genre?: string;
    durationSeconds?: number;
    forceAdminTest?: boolean;
    apiKeyOverride?: string;
  }): Promise<AiApiResponse<{ title: string; message: string; audioSimulationPreset: string }>> => {
    try {
      const res = await fetch('/api/ai/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Music generation error' };
    }
  }
};
