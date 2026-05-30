/**
 * AI Product Description Generator — Description Generator Service
 *
 * Orchestrates the full generation pipeline:
 *   1. Build prompts  (prompts/description.prompts.ts)
 *   2. Call the AI    (services/aiClient.ts)
 *   3. Parse & validate the raw JSON reply
 *   4. Return a typed AIGenerationResult
 *
 * Each step is a small, focused function. The top-level exported
 * functions are the only things controllers should call.
 */

import type {
  ProductDescriptionInput,
  AIGenerationResult,
  GeneratedDescription,
  RawAIDescriptionOutput,
  BatchDescriptionInput,
  BatchGenerationResult,
  BatchDescriptionResult,
  DescriptionLanguage,
} from "../types/ai.types.js";

import {
  buildPromptMessages,
} from "../prompts/description.prompts.js";

import {
  loadAIClientConfig,
  sendChatCompletion,
  extractResponseText,
} from "./aiClient.js";

// ---------------------------------------------------------------------------
// JSON parser
// ---------------------------------------------------------------------------

/**
 * Parses the raw text returned by the AI into a RawAIDescriptionOutput.
 * Returns null when the text is not valid JSON or is missing required fields.
 */
function parseAIJson(raw: string): RawAIDescriptionOutput | null {
  try {
    const parsed = JSON.parse(raw) as Partial<RawAIDescriptionOutput>;

    /** Validate all required keys are present and non-empty strings/arrays */
    if (
      typeof parsed.short !== "string" ||
      typeof parsed.long !== "string" ||
      !Array.isArray(parsed.features) ||
      typeof parsed.seoTitle !== "string" ||
      typeof parsed.metaDescription !== "string"
    ) {
      return null;
    }

    return {
      short: parsed.short.trim(),
      long: parsed.long.trim(),
      features: parsed.features.map((f) => String(f).trim()),
      seoTitle: parsed.seoTitle.trim(),
      metaDescription: parsed.metaDescription.trim(),
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Single-language generation
// ---------------------------------------------------------------------------

/**
 * Generates a description for one language.
 * Calls the AI, extracts text, parses JSON.
 * Throws when the AI returns an unparseable response.
 */
async function generateForLanguage(
  input: ProductDescriptionInput,
  language: DescriptionLanguage
): Promise<GeneratedDescription> {
  const config = loadAIClientConfig();

  /** Build the system + user message array */
  const messages = buildPromptMessages(input, language);

  /** Send to OpenAI */
  const apiResponse = await sendChatCompletion(config, messages);

  /** Pull out the text content */
  const rawText = extractResponseText(apiResponse);

  if (!rawText) {
    throw new Error(
      `AI returned an empty response for language "${language}".`
    );
  }

  /** Parse the JSON structure */
  const parsed = parseAIJson(rawText);

  if (!parsed) {
    throw new Error(
      `AI response for language "${language}" could not be parsed as valid JSON. ` +
        `Raw response: ${rawText.slice(0, 200)}`
    );
  }

  return {
    language,
    short: parsed.short,
    long: parsed.long,
    features: parsed.features,
    seoTitle: parsed.seoTitle,
    metaDescription: parsed.metaDescription,
  };
}

// ---------------------------------------------------------------------------
// Language list resolver
// ---------------------------------------------------------------------------

/**
 * Converts a DescriptionLanguage value into the individual language codes
 * that need to be generated. "both" expands to ["en", "ta"].
 */
function resolveLanguageCodes(
  language: DescriptionLanguage
): Array<"en" | "ta"> {
  if (language === "both") return ["en", "ta"];
  return [language];
}

// ---------------------------------------------------------------------------
// Token accumulator helper
// ---------------------------------------------------------------------------

/**
 * Sums token usage from multiple API calls.
 * Used when generating "both" languages to report total consumption.
 */
function sumTokens(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

// ---------------------------------------------------------------------------
// Public: single product generation
// ---------------------------------------------------------------------------

/**
 * Generates AI product descriptions for a single product.
 *
 * @param input - Product data and generation options
 * @returns AIGenerationResult with one GeneratedDescription per language
 *
 * @example
 * const result = await generateProductDescription({
 *   name: "Rose Garland",
 *   category: "Garlands",
 *   price: 120,
 *   templeUsage: "Lord Ganesha",
 *   language: "both",
 *   tone: "devotional",
 * });
 */
export async function generateProductDescription(
  input: ProductDescriptionInput
): Promise<AIGenerationResult> {
  const config = loadAIClientConfig();
  const language = input.language ?? "en";
  const languageCodes = resolveLanguageCodes(language);

  /** Run each language sequentially to respect rate limits */
  const descriptions: GeneratedDescription[] = [];
  const tokenCounts: number[] = [];

  for (const lang of languageCodes) {
    const messages = buildPromptMessages(input, lang);
    const apiResponse = await sendChatCompletion(config, messages);
    const rawText = extractResponseText(apiResponse);

    if (!rawText) {
      throw new Error(`AI returned empty content for language "${lang}".`);
    }

    const parsed = parseAIJson(rawText);
    if (!parsed) {
      throw new Error(`Failed to parse AI JSON for language "${lang}".`);
    }

    descriptions.push({
      language: lang,
      short: parsed.short,
      long: parsed.long,
      features: parsed.features,
      seoTitle: parsed.seoTitle,
      metaDescription: parsed.metaDescription,
    });

    tokenCounts.push(apiResponse.usage?.total_tokens ?? 0);
  }

  return {
    productName: input.name,
    descriptions,
    generatedAt: new Date().toISOString(),
    model: config.model,
    tokensUsed: sumTokens(tokenCounts),
  };
}

// ---------------------------------------------------------------------------
// Public: batch generation
// ---------------------------------------------------------------------------

/**
 * Generates descriptions for multiple products.
 * Each product is processed independently — a failure on one does not
 * stop others. Per-item errors are captured in the result.
 *
 * @param batch - Object containing an array of ProductDescriptionInput
 * @returns BatchGenerationResult with per-item success/failure details
 */
export async function generateBatchDescriptions(
  batch: BatchDescriptionInput
): Promise<BatchGenerationResult> {
  const results: BatchDescriptionResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < batch.products.length; i++) {
    try {
      const result = await generateProductDescription(batch.products[i]);
      results.push({ index: i, success: true, result });
      succeeded++;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown generation error";
      results.push({ index: i, success: false, error: message });
      failed++;
    }
  }

  return {
    total: batch.products.length,
    succeeded,
    failed,
    results,
  };
}

// ---------------------------------------------------------------------------
// Public: mock generation (for dev/test without an API key)
// ---------------------------------------------------------------------------

/**
 * Returns a deterministic mock result when OPENAI_API_KEY is not set.
 * Useful for local development and integration tests.
 */
export function generateMockDescription(
  input: ProductDescriptionInput
): AIGenerationResult {
  const language = input.language ?? "en";
  const languageCodes = resolveLanguageCodes(language);

  const descriptions: GeneratedDescription[] = languageCodes.map((lang) => ({
    language: lang,
    short: `${input.name} — a beautiful offering for your ${input.templeUsage ?? "daily pooja"}.`,
    long: `Experience the divine fragrance of our ${input.name}. Sourced fresh from local farms, ` +
      `each piece is carefully selected for quality and spiritual purity. Perfect for ${
        input.templeUsage ?? "home and temple offerings"
      }, this ${input.category.toLowerCase()} brings peace and devotion to your worship.`,
    features: [
      `Fresh ${input.category.toLowerCase()} sourced daily`,
      input.isFresh ? "Same-day freshness guaranteed" : "Premium quality",
      input.templeUsage ? `Ideal for ${input.templeUsage} offerings` : "Suitable for all occasions",
      input.isFestivalSpecial
        ? `Special edition for ${input.festivalName ?? "festivals"}`
        : "Available year-round",
    ],
    seoTitle: `${input.name} | Buy Fresh Flowers Online — FlowerShop`,
    metaDescription: `Buy fresh ${input.name} online. Premium quality ${input.category.toLowerCase()} ` +
      `for pooja and temple offerings. Starting from ₹${input.price}.`,
  }));

  return {
    productName: input.name,
    descriptions,
    generatedAt: new Date().toISOString(),
    model: "mock",
    tokensUsed: 0,
  };
}
