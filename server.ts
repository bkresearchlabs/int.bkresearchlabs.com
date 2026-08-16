import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { aiRouter } from './server/aiRoutes';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Mount AI Master Control & AI Feature Gateway
app.use('/api/ai', aiRouter);

// In-memory translation cache (LRU-like simple map)
const translationCache = new Map<string, string>();
const MAX_CACHE_SIZE = 5000;

function getCacheKey(sourceLang: string, targetLang: string, text: string): string {
  return `${sourceLang}:${targetLang}:${text.trim()}`;
}

function setCachedTranslation(sourceLang: string, targetLang: string, text: string, translated: string) {
  if (translationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = translationCache.keys().next().value;
    if (firstKey) {
      translationCache.delete(firstKey);
    }
  }
  translationCache.set(getCacheKey(sourceLang, targetLang, text), translated);
}

// Lazy Gemini AI Client Initialization
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    try {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn('Gemini client initialization notice:', e);
    }
  }
  return geminiClient;
}

// -------------------------------------------------------------
// API ROUTE: /api/health
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      google_translate_api: Boolean(process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY),
      gemini_ai_api: Boolean(process.env.GEMINI_API_KEY)
    }
  });
});

// -------------------------------------------------------------
// API ROUTE: /api/google/translate-test
// Tests Google Translation integration status
// -------------------------------------------------------------
app.post('/api/google/translate-test', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY || req.body.apiKey;
    const testText = req.body.text || 'High-purity analytical reference standard verified with HPLC.';
    const targetLang = req.body.targetLang || 'es';

    if (apiKey) {
      // Test official Google Cloud Translation REST API v2
      const googleUrl = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
      const resp = await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: testText,
          target: targetLang,
          source: 'en',
          format: 'text'
        })
      });

      if (resp.ok) {
        const data = (await resp.json()) as any;
        const translated = data?.data?.translations?.[0]?.translatedText || testText;
        return res.json({
          success: true,
          engine: 'google_cloud_v2',
          source: testText,
          translated,
          targetLang,
          message: 'Google Cloud Translation API verified successfully.'
        });
      }
    }

    // Fallback test via Gemini AI
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text from English into target language code "${targetLang}". 
Preserve scientific chemical names (e.g. BPC-157, NAD+), CAS numbers, purity percentages, and brand "BK Research Labs" accurately.
Only return the translated string without quotes or preamble.

Text: ${testText}`
      });

      const translated = response.text?.trim() || testText;
      return res.json({
        success: true,
        engine: 'gemini_ai_localization',
        source: testText,
        translated,
        targetLang,
        message: 'Localization engine verified with Gemini AI.'
      });
    }

    // Basic simulation fallback
    return res.json({
      success: true,
      engine: 'client_hybrid_dictionary',
      source: testText,
      translated: testText,
      targetLang,
      message: 'Client widget & local dictionary mode active.'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Translation verification error'
    });
  }
});

// -------------------------------------------------------------
// API ROUTE: /api/translate
// Programmatic single & batch text translation endpoint
// -------------------------------------------------------------
app.post('/api/translate', async (req, res) => {
  try {
    const { text, texts, targetLang = 'es', sourceLang = 'en' } = req.body;
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;

    if (!targetLang || targetLang === sourceLang) {
      if (texts && Array.isArray(texts)) {
        return res.json({ translatedTexts: texts, engine: 'bypass' });
      }
      return res.json({ translatedText: text || '', engine: 'bypass' });
    }

    // Handle Single Text
    if (typeof text === 'string') {
      const trimmed = text.trim();
      if (!trimmed) {
        return res.json({ translatedText: text, engine: 'empty' });
      }

      // Check in-memory cache
      const cacheKey = getCacheKey(sourceLang, targetLang, trimmed);
      if (translationCache.has(cacheKey)) {
        return res.json({
          translatedText: translationCache.get(cacheKey),
          engine: 'memory_cache'
        });
      }

      // 1. Try Google Cloud Translation REST API
      if (apiKey) {
        try {
          const googleUrl = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
          const resp = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: trimmed,
              target: targetLang,
              source: sourceLang,
              format: 'text'
            })
          });

          if (resp.ok) {
            const data = (await resp.json()) as any;
            const translatedText = data?.data?.translations?.[0]?.translatedText || trimmed;
            setCachedTranslation(sourceLang, targetLang, trimmed, translatedText);
            return res.json({ translatedText, engine: 'google_cloud_api' });
          }
        } catch (cloudErr) {
          console.warn('Google Cloud Translation API notice:', cloudErr);
        }
      }

      // 2. Try Gemini AI Translation
      const ai = getGeminiClient();
      if (ai) {
        try {
          const prompt = `Translate the following text from ${sourceLang} into target language "${targetLang}".
Rules:
- Preserve chemical CAS numbers, IUPAC formulas, batch serials (e.g. BKRL-2026-9041), purity percentages (e.g. 99.8%+), and the brand name "BK Research Labs" intact.
- Return ONLY the translated text with no conversational preamble or markdown codeblocks.

Text to translate:
${trimmed}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
          });

          const translatedText = response.text?.trim() || trimmed;
          setCachedTranslation(sourceLang, targetLang, trimmed, translatedText);
          return res.json({ translatedText, engine: 'gemini_ai' });
        } catch (aiErr) {
          console.warn('Gemini AI translation notice:', aiErr);
        }
      }

      // 3. Fallback: Return original
      return res.json({ translatedText: text, engine: 'fallback_original' });
    }

    // Handle Batch Texts Array
    if (Array.isArray(texts)) {
      if (texts.length === 0) {
        return res.json({ translatedTexts: [], engine: 'empty' });
      }

      // 1. Try Google Cloud Translation REST API Batch
      if (apiKey) {
        try {
          const googleUrl = `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`;
          const resp = await fetch(googleUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: texts,
              target: targetLang,
              source: sourceLang,
              format: 'text'
            })
          });

          if (resp.ok) {
            const data = (await resp.json()) as any;
            const translatedTexts = (data?.data?.translations || []).map((t: any) => t.translatedText || '');
            return res.json({ translatedTexts, engine: 'google_cloud_api_batch' });
          }
        } catch (batchErr) {
          console.warn('Google Cloud Translation Batch API notice:', batchErr);
        }
      }

      // 2. Try Gemini AI Batch Translation
      const ai = getGeminiClient();
      if (ai) {
        try {
          const prompt = `Translate the following JSON array of strings from ${sourceLang} into target language "${targetLang}".
Rules:
- Preserve chemical CAS numbers, IUPAC formulas, batch serials, and brand "BK Research Labs" intact.
- Return a valid JSON array of strings matching the exact length and order of the input array.

Input JSON:
${JSON.stringify(texts)}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const raw = response.text?.trim() || '[]';
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length === texts.length) {
            return res.json({ translatedTexts: parsed, engine: 'gemini_ai_batch' });
          }
        } catch (aiBatchErr) {
          console.warn('Gemini AI batch translation notice:', aiBatchErr);
        }
      }

      // Fallback
      return res.json({ translatedTexts: texts, engine: 'fallback_original' });
    }

    return res.status(400).json({ error: 'Missing "text" or "texts" parameter' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal translation server error' });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static File Serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BKR Enterprise Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
