/**
 * AI Product Description Generator — Request Validators
 *
 * Zod schemas that validate all incoming HTTP request bodies before
 * they reach the controller. Strict mode — unknown keys are rejected.
 *
 * Usage:
 *   const validated = parseGenerateRequest(req.body);  // throws ZodError on invalid input
 */

import { z } from "zod";
import type {
  ProductDescriptionInput,
  BatchDescriptionInput,
} from "../types/ai.types.js";

// ---------------------------------------------------------------------------
// Enum schemas (reused across schemas)
// ---------------------------------------------------------------------------

/** Valid tone values */
const toneSchema = z.enum(["formal", "poetic", "simple", "devotional"], {
  errorMap: () => ({
    message: 'tone must be one of: "formal", "poetic", "simple", "devotional"',
  }),
});

/** Valid language values */
const languageSchema = z.enum(["en", "ta", "both"], {
  errorMap: () => ({
    message: 'language must be one of: "en", "ta", "both"',
  }),
});

// ---------------------------------------------------------------------------
// Single product schema
// ---------------------------------------------------------------------------

/**
 * Validates the body for POST /api/ai/generate.
 * All optional fields default gracefully in the generator — we keep them
 * optional here too so the API stays easy to call.
 */
export const generateRequestSchema = z
  .object({
    /** Human-readable product name */
    name: z
      .string({ required_error: "name is required" })
      .min(2, "name must be at least 2 characters")
      .max(200, "name must not exceed 200 characters")
      .trim(),

    /** Product category label */
    category: z
      .string({ required_error: "category is required" })
      .min(2, "category must be at least 2 characters")
      .max(100, "category must not exceed 100 characters")
      .trim(),

    /** Selling price in INR — must be a positive number */
    price: z
      .number({ required_error: "price is required" })
      .positive("price must be a positive number"),

    /** Whether the product is freshly harvested */
    isFresh: z.boolean().optional(),

    /** Whether the product is seasonal */
    isSeasonal: z.boolean().optional(),

    /** Whether the product is tied to a festival */
    isFestivalSpecial: z.boolean().optional(),

    /** Temple or deity association */
    templeUsage: z.string().max(200).trim().optional(),

    /** Festival name — meaningful only when isFestivalSpecial is true */
    festivalName: z.string().max(100).trim().optional(),

    /**
     * Up to 10 keywords to weave into the description.
     * Each keyword is trimmed and must be non-empty.
     */
    keywords: z
      .array(
        z
          .string()
          .min(1, "keyword must not be empty")
          .max(50, "keyword must not exceed 50 characters")
          .trim()
      )
      .max(10, "keywords array must not exceed 10 items")
      .optional(),

    /** Writing tone */
    tone: toneSchema.optional(),

    /** Target language(s) for generation */
    language: languageSchema.optional(),
  })
  .strict(); /** Reject any extra keys not listed above */

// ---------------------------------------------------------------------------
// Batch schema
// ---------------------------------------------------------------------------

/**
 * Validates the body for POST /api/ai/generate/batch.
 * Max 10 products per batch to prevent excessive API usage.
 */
export const batchRequestSchema = z
  .object({
    products: z
      .array(generateRequestSchema, {
        required_error: "products array is required",
      })
      .min(1, "products array must contain at least 1 item")
      .max(10, "products array must not exceed 10 items"),
  })
  .strict();

// ---------------------------------------------------------------------------
// Preview schema (returns mock without calling OpenAI)
// ---------------------------------------------------------------------------

/**
 * Validates the body for POST /api/ai/preview.
 * Same shape as generateRequestSchema — kept as a separate export
 * so callers can distinguish intent.
 */
export const previewRequestSchema = generateRequestSchema;

// ---------------------------------------------------------------------------
// Parse helpers — throw AppError-compatible errors on failure
// ---------------------------------------------------------------------------

/**
 * Parses and validates a single generate request body.
 * Returns a strongly-typed ProductDescriptionInput or throws a ZodError.
 */
export function parseGenerateRequest(body: unknown): ProductDescriptionInput {
  return generateRequestSchema.parse(body) as ProductDescriptionInput;
}

/**
 * Parses and validates a batch generate request body.
 * Returns a strongly-typed BatchDescriptionInput or throws a ZodError.
 */
export function parseBatchRequest(body: unknown): BatchDescriptionInput {
  return batchRequestSchema.parse(body) as BatchDescriptionInput;
}

/**
 * Parses a preview request body (same rules as generate).
 */
export function parsePreviewRequest(body: unknown): ProductDescriptionInput {
  return previewRequestSchema.parse(body) as ProductDescriptionInput;
}

// ---------------------------------------------------------------------------
// Zod error formatter
// ---------------------------------------------------------------------------

/**
 * Converts a ZodError into a flat array of human-readable error messages.
 * Used by the controller to send a clean 422 response body.
 */
export function formatZodErrors(
  error: z.ZodError
): Array<{ field: string; message: string }> {
  return error.errors.map((e) => ({
    field: e.path.join(".") || "body",
    message: e.message,
  }));
}
