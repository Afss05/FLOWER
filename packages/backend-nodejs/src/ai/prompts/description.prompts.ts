/**
 * AI Product Description Generator — Prompt Templates
 *
 * Builds the system and user prompt strings that are sent to the AI.
 * Every function is small and pure — no side effects, no I/O.
 */

import type { ProductDescriptionInput, DescriptionLanguage } from "../types/ai.types.js";

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

/**
 * Returns the system prompt for English description generation.
 * Establishes the AI's persona as a South Indian flower shop copywriter.
 */
export function buildEnglishSystemPrompt(): string {
  return `You are an expert product copywriter specialising in South Indian flowers, garlands, 
and pooja items. Your writing is warm, devotional, culturally accurate, and SEO-friendly. 
You understand the significance of flowers in Hindu rituals, temple offerings, and festivals.

Always respond with ONLY a valid JSON object matching this exact shape:
{
  "short": "1-2 sentence teaser",
  "long": "full paragraph (60-120 words)",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4"],
  "seoTitle": "SEO page title under 60 chars",
  "metaDescription": "SEO meta description under 155 chars"
}`;
}

/**
 * Returns the system prompt for Tamil description generation.
 * Instructs the AI to write in Tamil script with proper cultural tone.
 */
export function buildTamilSystemPrompt(): string {
  return `நீங்கள் தென்னிந்திய மலர் மற்றும் பூஜை பொருட்களில் நிபுணத்துவம் வாய்ந்த ஒரு 
தயாரிப்பு எழுத்தாளர். உங்கள் எழுத்து பக்தி நிறைந்தது, கலாச்சார ரீதியாக சரியானது.

Always respond with ONLY a valid JSON object matching this exact shape:
{
  "short": "1-2 sentence teaser in Tamil",
  "long": "full paragraph in Tamil (60-120 words)",
  "features": ["feature 1 in Tamil", "feature 2 in Tamil", "feature 3 in Tamil", "feature 4 in Tamil"],
  "seoTitle": "SEO page title in Tamil under 60 chars",
  "metaDescription": "SEO meta description in Tamil under 155 chars"
}`;
}

// ---------------------------------------------------------------------------
// Context line builders (small pure helpers)
// ---------------------------------------------------------------------------

/** Formats the freshness line when the product is freshly harvested */
function buildFreshnessLine(isFresh: boolean): string {
  return isFresh
    ? "- Freshness: Freshly harvested, same-day delivery available"
    : "";
}

/** Formats the seasonal availability line */
function buildSeasonalLine(isSeasonal: boolean): string {
  return isSeasonal ? "- Availability: Seasonal item — limited stock" : "";
}

/** Formats the festival context line */
function buildFestivalLine(
  isFestivalSpecial: boolean,
  festivalName: string | undefined
): string {
  if (!isFestivalSpecial) return "";
  const name = festivalName ?? "various Hindu festivals";
  return `- Festival: Specially curated for ${name}`;
}

/** Formats the temple/deity usage line */
function buildTempleUsageLine(templeUsage: string | undefined): string {
  return templeUsage
    ? `- Temple / Deity association: ${templeUsage}`
    : "";
}

/** Formats the optional keywords line */
function buildKeywordsLine(keywords: string[] | undefined): string {
  return keywords && keywords.length > 0
    ? `- Keywords to include: ${keywords.join(", ")}`
    : "";
}

/** Maps a tone value to a natural-language instruction */
function buildToneLine(tone: ProductDescriptionInput["tone"]): string {
  const toneMap: Record<NonNullable<ProductDescriptionInput["tone"]>, string> = {
    formal: "Use formal, professional language.",
    poetic: "Use rich, poetic, and evocative language.",
    simple: "Use simple, clear, everyday language.",
    devotional: "Use warm, devotional, spiritually uplifting language.",
  };
  return `- Writing tone: ${toneMap[tone ?? "devotional"]}`;
}

// ---------------------------------------------------------------------------
// User prompt builders
// ---------------------------------------------------------------------------

/**
 * Assembles the English user prompt from a ProductDescriptionInput.
 * Filters out empty context lines so the prompt stays clean.
 */
export function buildEnglishUserPrompt(input: ProductDescriptionInput): string {
  const contextLines = [
    `- Product name: ${input.name}`,
    `- Category: ${input.category}`,
    `- Price: ₹${input.price}`,
    buildTempleUsageLine(input.templeUsage),
    buildFreshnessLine(input.isFresh ?? false),
    buildSeasonalLine(input.isSeasonal ?? false),
    buildFestivalLine(input.isFestivalSpecial ?? false, input.festivalName),
    buildKeywordsLine(input.keywords),
    buildToneLine(input.tone),
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n");

  return `Generate a product description for the following flower shop product:

${contextLines}

Return only the JSON object — no markdown, no extra text.`;
}

/**
 * Assembles the Tamil user prompt from a ProductDescriptionInput.
 * Passes English product details so the AI can translate and adapt them.
 */
export function buildTamilUserPrompt(input: ProductDescriptionInput): string {
  const contextLines = [
    `- Product name: ${input.name}`,
    `- Category: ${input.category}`,
    `- Price: ₹${input.price}`,
    buildTempleUsageLine(input.templeUsage),
    buildFreshnessLine(input.isFresh ?? false),
    buildSeasonalLine(input.isSeasonal ?? false),
    buildFestivalLine(input.isFestivalSpecial ?? false, input.festivalName),
    buildKeywordsLine(input.keywords),
  ]
    .filter((line) => line.trim().length > 0)
    .join("\n");

  return `கீழ்கண்ட தகவல்களை பயன்படுத்தி தமிழில் தயாரிப்பு விளக்கம் உருவாக்கவும்:

${contextLines}

JSON மட்டும் திரும்ப அனுப்பவும் — வேறு எந்த உரையும் வேண்டாம்.`;
}

// ---------------------------------------------------------------------------
// Prompt selector
// ---------------------------------------------------------------------------

/**
 * Picks the correct system/user prompt pair for the requested language.
 * Returns an array ready to pass as the `messages` field to the AI API.
 */
export function buildPromptMessages(
  input: ProductDescriptionInput,
  language: DescriptionLanguage
): Array<{ role: "system" | "user"; content: string }> {
  const isTamil = language === "ta";

  return [
    {
      role: "system" as const,
      content: isTamil
        ? buildTamilSystemPrompt()
        : buildEnglishSystemPrompt(),
    },
    {
      role: "user" as const,
      content: isTamil
        ? buildTamilUserPrompt(input)
        : buildEnglishUserPrompt(input),
    },
  ];
}
