/**
 * AI Product Description Generator — Type Definitions
 *
 * All strict TypeScript interfaces and types used across the AI module.
 * No runtime logic here — pure type contracts only.
 */

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

/** Tone for the generated description */
export type DescriptionTone = "formal" | "poetic" | "simple" | "devotional";

/** Language target for generation */
export type DescriptionLanguage = "en" | "ta" | "both";

/**
 * All the product data the caller must supply to trigger AI generation.
 * Mirrors relevant fields from the Product model (see models/Product.ts).
 */
export interface ProductDescriptionInput {
  /** Product display name */
  name: string;
  /** Category label e.g. "Garlands", "Loose Flowers", "Pooja Items" */
  category: string;
  /** Selling price in INR */
  price: number;
  /** Whether the product is freshly harvested */
  isFresh?: boolean;
  /** Whether the product is available only in a season */
  isSeasonal?: boolean;
  /** Whether the product is tied to a specific festival */
  isFestivalSpecial?: boolean;
  /** Temple/deity association e.g. "Lord Murugan", "Goddess Lakshmi" */
  templeUsage?: string;
  /** Festival name when isFestivalSpecial is true */
  festivalName?: string;
  /** Additional keywords to weave into the description */
  keywords?: string[];
  /** Desired writing tone — defaults to "devotional" */
  tone?: DescriptionTone;
  /** Language(s) to generate — defaults to "en" */
  language?: DescriptionLanguage;
}

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

/**
 * A single language-specific product description block.
 */
export interface GeneratedDescription {
  /** ISO language code e.g. "en" or "ta" */
  language: string;
  /** 1-2 sentence teaser shown on product cards */
  short: string;
  /** Full paragraph shown on the product detail page */
  long: string;
  /** Bullet-point feature highlights */
  features: string[];
  /** SEO-optimised page title */
  seoTitle: string;
  /** 155-char SEO meta description */
  metaDescription: string;
}

/**
 * The complete result returned to the API caller.
 */
export interface AIGenerationResult {
  /** Original product name */
  productName: string;
  /** One entry per requested language */
  descriptions: GeneratedDescription[];
  /** ISO timestamp of when generation happened */
  generatedAt: string;
  /** AI model identifier e.g. "gpt-4o-mini" */
  model: string;
  /** Total tokens consumed by the request */
  tokensUsed: number;
}

// ---------------------------------------------------------------------------
// Batch input / output
// ---------------------------------------------------------------------------

/** Bulk generate descriptions for multiple products at once */
export interface BatchDescriptionInput {
  /** List of products — max 10 per batch */
  products: ProductDescriptionInput[];
}

/** Result for one product inside a batch response */
export interface BatchDescriptionResult {
  /** Index of the product in the input array */
  index: number;
  /** Whether this individual item succeeded */
  success: boolean;
  /** Populated on success */
  result?: AIGenerationResult;
  /** Populated on per-item failure */
  error?: string;
}

/** Full batch response */
export interface BatchGenerationResult {
  total: number;
  succeeded: number;
  failed: number;
  results: BatchDescriptionResult[];
}

// ---------------------------------------------------------------------------
// OpenAI wire types (raw HTTP API shapes)
// ---------------------------------------------------------------------------

/** A single message in a chat-completion conversation */
export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Request body sent to /v1/chat/completions */
export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  /** Sampling temperature 0-2; lower = more deterministic */
  temperature: number;
  max_tokens: number;
  /** Force structured JSON output */
  response_format?: { type: "json_object" };
}

/** One completion choice returned by the API */
export interface OpenAIChoice {
  message: OpenAIMessage;
  finish_reason: "stop" | "length" | "content_filter";
}

/** Token usage stats returned by the API */
export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/** Full response body from /v1/chat/completions */
export interface OpenAIResponse {
  id: string;
  model: string;
  choices: OpenAIChoice[];
  usage: OpenAIUsage;
}

// ---------------------------------------------------------------------------
// AI client configuration
// ---------------------------------------------------------------------------

/** Runtime config for the OpenAI HTTP client */
export interface AIClientConfig {
  apiKey: string;
  /** Model name e.g. "gpt-4o-mini" */
  model: string;
  /** Upper bound on generated tokens */
  maxTokens: number;
  /** Creativity/randomness 0-2 */
  temperature: number;
  /** Base URL — override for Azure or proxies */
  baseUrl: string;
}

// ---------------------------------------------------------------------------
// Error contract
// ---------------------------------------------------------------------------

/** Structured AI error forwarded to the error handler middleware */
export interface AIError {
  /** Short machine-readable code e.g. "RATE_LIMIT", "INVALID_KEY" */
  code: string;
  /** Human-readable message */
  message: string;
  /** Whether the client should retry the request */
  retryable: boolean;
}

// ---------------------------------------------------------------------------
// Parsed raw AI output (intermediate internal type)
// ---------------------------------------------------------------------------

/**
 * Shape we expect the AI to return as JSON inside its response message.
 * The parser validates each field before constructing GeneratedDescription.
 */
export interface RawAIDescriptionOutput {
  short: string;
  long: string;
  features: string[];
  seoTitle: string;
  metaDescription: string;
}
