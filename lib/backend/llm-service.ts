import { GoogleAuth } from 'google-auth-library';
import type { GenerationRequest, StreamChunk, ObservabilityLog } from './types';
import { logLLMCall } from './observability';
import { createHash } from 'crypto';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'aura-501017';
const LOCATION = 'global';
const MODEL = 'gemini-2.5-flash';
const BASE_URL = `https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}`;

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

interface CacheEntry {
  result: unknown;
  timestamp: number;
}

const TTL_MS = 30_000;
const responseCache = new Map<string, CacheEntry>();

function hashPrompt(prompt: string): string {
  return createHash('sha256').update(prompt).digest('hex').slice(0, 16);
}

function getCached<T>(key: string): T | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > TTL_MS) {
    responseCache.delete(key);
    return null;
  }
  return entry.result as T;
}

function setCache(key: string, result: unknown): void {
  if (responseCache.size > 200) {
    const oldest = responseCache.keys().next().value;
    if (oldest) responseCache.delete(oldest);
  }
  responseCache.set(key, { result, timestamp: Date.now() });
}

async function getAccessToken(): Promise<string> {
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  if (!token.token) throw new Error('Failed to get access token');
  return token.token;
}

function buildRequestBody(req: GenerationRequest): Record<string, unknown> {
  const parts: Array<Record<string, unknown>> = [];

  if (req.systemPrompt) {
    parts.push({ text: `System: ${req.systemPrompt}` });
  }

  if (req.examples?.length) {
    for (const ex of req.examples) {
      parts.push({ text: `${ex.role}: ${ex.content}` });
    }
  }

  if (req.schema) {
    parts.push({ text: `\n\nRespond with valid JSON matching this schema:\n${JSON.stringify(req.schema, null, 2)}` });
  }

  parts.push({ text: req.userMessage });

  return {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: req.temperature ?? 0.7,
      maxOutputTokens: req.maxOutputTokens ?? 1024,
    },
  };
}

export class LLMService {
  async generate<T>(req: GenerationRequest, meta?: { userId?: string; agentId?: string }): Promise<T> {
    const start = Date.now();
    const body = buildRequestBody(req);
    const bodyStr = JSON.stringify(body);
    const promptHash = hashPrompt(bodyStr);

    const cached = getCached<T>(promptHash);
    if (cached) return cached;

    const token = await getAccessToken();
    const response = await fetch(`${BASE_URL}:generateContent`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: bodyStr,
    });

    if (!response.ok) {
      const errText = await response.text();
      logLLMCall({
        userId: meta?.userId,
        agentId: meta?.agentId ?? 'unknown',
        promptHash,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - start,
        model: MODEL,
        success: false,
        error: `HTTP ${response.status}: ${errText}`,
      });
      throw new Error(`Vertex AI API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const usageMetadata = data?.usageMetadata ?? {};
    const latencyMs = Date.now() - start;

    let parsed: T;
    try {
      parsed = JSON.parse(text) as T;
    } catch {
      parsed = text as unknown as T;
    }

    logLLMCall({
      userId: meta?.userId,
      agentId: meta?.agentId ?? 'unknown',
      promptHash,
      promptTokens: usageMetadata.promptTokenCount ?? 0,
      completionTokens: usageMetadata.candidatesTokenCount ?? 0,
      latencyMs,
      model: MODEL,
      success: true,
    });

    setCache(promptHash, parsed);
    return parsed;
  }

  async *stream(req: GenerationRequest, meta?: { userId?: string; agentId?: string }): AsyncGenerator<StreamChunk> {
    const start = Date.now();
    const body = buildRequestBody(req);
    const bodyStr = JSON.stringify(body);
    const promptHash = hashPrompt(bodyStr);

    const token = await getAccessToken();
    const response = await fetch(`${BASE_URL}:streamGenerateContent?alt=sse`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: bodyStr,
    });

    if (!response.ok) {
      const errText = await response.text();
      logLLMCall({
        userId: meta?.userId,
        agentId: meta?.agentId ?? 'unknown',
        promptHash,
        promptTokens: 0,
        completionTokens: 0,
        latencyMs: Date.now() - start,
        model: MODEL,
        success: false,
        error: `HTTP ${response.status}: ${errText}`,
      });
      throw new Error(`Vertex AI API error ${response.status}: ${errText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body for streaming');

    const decoder = new TextDecoder();
    let buffer = '';
    let totalCompletion = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const json = JSON.parse(line.slice(6));
              const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
              if (text) {
                totalCompletion += text;
                yield { text, done: false };
              }
            } catch {
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    const latencyMs = Date.now() - start;
    logLLMCall({
      userId: meta?.userId,
      agentId: meta?.agentId ?? 'unknown',
      promptHash,
      promptTokens: 0,
      completionTokens: totalCompletion.length,
      latencyMs,
      model: MODEL,
      success: true,
    });

    yield { text: '', done: true };
  }
}

export const llmService = new LLMService();
