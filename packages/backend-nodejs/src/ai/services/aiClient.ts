/**
 * AI Product Description Generator — OpenAI HTTP Client
 *
 * A thin, typed wrapper around axios that handles:
 *   - Auth headers
 *   - Request construction
 *   - Error classification (rate-limit, invalid key, server error)
 *   - No business logic — only transport
 */

import axios, { AxiosError, AxiosInstance } from "axios";
import type {
  AIClientConfig,
  AIError,
  OpenAIRequest,
  OpenAIResponse,
} from "../types/ai.types.js";

// ---------------------------------------------------------------------------
// Config loader
// ---------------------------------------------------------------------------

/**
 * Reads AI configuration from environment variables.
 * Throws if OPENAI_API_KEY is missing so the server fails fast on startup.
 */
export function loadAIClientConfig(): AIClientConfig {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not set. " +
        "Add it to your .env file to enable AI description generation."
    );
  }

  return {
    apiKey,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS ?? "800", 10),
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE ?? "0.7"),
    baseUrl:
      process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
  };
}

// ---------------------------------------------------------------------------
// Axios instance factory
// ---------------------------------------------------------------------------

/**
 * Creates an axios instance pre-configured with auth headers and base URL.
 * A new instance per config keeps clients isolated and testable.
 */
export function createAxiosInstance(config: AIClientConfig): AxiosInstance {
  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    /** 30 s hard timeout — prevents hanging requests */
    timeout: 30_000,
  });
}

// ---------------------------------------------------------------------------
// Request body builder
// ---------------------------------------------------------------------------

/**
 * Constructs the OpenAI chat-completions request body.
 * Separating this from the HTTP call keeps both functions small.
 */
export function buildOpenAIRequestBody(
  config: AIClientConfig,
  messages: OpenAIRequest["messages"]
): OpenAIRequest {
  return {
    model: config.model,
    messages,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    /** Tell the model to always return valid JSON */
    response_format: { type: "json_object" },
  };
}

// ---------------------------------------------------------------------------
// Error classifier
// ---------------------------------------------------------------------------

/**
 * Converts an axios error into a structured AIError.
 * Distinguishes common OpenAI error codes so callers can react appropriately.
 */
export function classifyOpenAIError(err: AxiosError): AIError {
  const status = err.response?.status;

  if (status === 401) {
    return {
      code: "INVALID_KEY",
      message: "OpenAI API key is invalid or expired.",
      retryable: false,
    };
  }

  if (status === 429) {
    return {
      code: "RATE_LIMIT",
      message: "OpenAI rate limit reached. Please retry after a moment.",
      retryable: true,
    };
  }

  if (status === 400) {
    return {
      code: "BAD_REQUEST",
      message: "Invalid request sent to OpenAI API.",
      retryable: false,
    };
  }

  if (status !== undefined && status >= 500) {
    return {
      code: "OPENAI_SERVER_ERROR",
      message: "OpenAI server error. Please retry.",
      retryable: true,
    };
  }

  if (err.code === "ECONNABORTED") {
    return {
      code: "TIMEOUT",
      message: "OpenAI request timed out.",
      retryable: true,
    };
  }

  return {
    code: "UNKNOWN",
    message: err.message,
    retryable: false,
  };
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

/**
 * Sends a chat-completion request to OpenAI and returns the raw response.
 * Throws a structured AIError (not an AxiosError) so callers have clean types.
 */
export async function sendChatCompletion(
  config: AIClientConfig,
  messages: OpenAIRequest["messages"]
): Promise<OpenAIResponse> {
  const instance = createAxiosInstance(config);
  const body = buildOpenAIRequestBody(config, messages);

  try {
    const response = await instance.post<OpenAIResponse>(
      "/chat/completions",
      body
    );
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const aiError = classifyOpenAIError(err);
      /** Attach the structured code to the thrown Error for middleware */
      const error = new Error(aiError.message) as Error & {
        aiCode: string;
        retryable: boolean;
      };
      error.aiCode = aiError.code;
      error.retryable = aiError.retryable;
      throw error;
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Response text extractor
// ---------------------------------------------------------------------------

/**
 * Extracts the assistant's message text from an OpenAI response.
 * Returns null when the response is empty or the model refused.
 */
export function extractResponseText(response: OpenAIResponse): string | null {
  const choice = response.choices[0];

  if (!choice || choice.finish_reason === "content_filter") {
    return null;
  }

  return choice.message.content ?? null;
}
