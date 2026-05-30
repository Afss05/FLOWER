/**
 * AI Product Description Generator — HTTP Controller
 *
 * Handles three endpoints:
 *   POST /api/ai/generate         — single product, real AI call
 *   POST /api/ai/generate/batch   — multiple products, real AI calls
 *   POST /api/ai/preview          — single product, mock (no API key needed)
 *
 * Each handler is a small standalone function:
 *   1. Parse + validate request body (throws ZodError on bad input)
 *   2. Delegate to the generator service
 *   3. Send success response
 *
 * Errors bubble up to the global errorHandler middleware.
 */

import { Response } from "express";
import { ZodError } from "zod";
import type { AuthRequest } from "../../middleware/authenticate.js";
import { sendSuccess } from "../../utils/helpers.js";
import {
  generateProductDescription,
  generateBatchDescriptions,
  generateMockDescription,
} from "../services/descriptionGenerator.js";
import {
  parseGenerateRequest,
  parseBatchRequest,
  parsePreviewRequest,
  formatZodErrors,
} from "../validators/ai.validator.js";

// ---------------------------------------------------------------------------
// Handler: generate single product description (live AI)
// ---------------------------------------------------------------------------

/**
 * POST /api/ai/generate
 *
 * Body: ProductDescriptionInput (see ai.validator.ts)
 * Response: AIGenerationResult
 *
 * Requires OPENAI_API_KEY to be set.
 * Authentication is required (admin or super_admin role).
 */
export async function handleGenerate(
  req: AuthRequest,
  res: Response
): Promise<void> {
  /** Validate request body — throws ZodError on bad input */
  const input = parseGenerateRequest(req.body);

  /** Delegate to service — may throw on AI/network errors */
  const result = await generateProductDescription(input);

  sendSuccess(res, result, "Product description generated successfully");
}

// ---------------------------------------------------------------------------
// Handler: batch generate descriptions (live AI)
// ---------------------------------------------------------------------------

/**
 * POST /api/ai/generate/batch
 *
 * Body: { products: ProductDescriptionInput[] }  (max 10 items)
 * Response: BatchGenerationResult
 *
 * Per-product failures are captured in the result rather than throwing,
 * so a single bad product doesn't cancel the whole batch.
 */
export async function handleBatchGenerate(
  req: AuthRequest,
  res: Response
): Promise<void> {
  /** Validate the batch body */
  const batch = parseBatchRequest(req.body);

  /** Run batch — individual errors are captured inside the result */
  const result = await generateBatchDescriptions(batch);

  const message =
    result.failed === 0
      ? `All ${result.succeeded} descriptions generated successfully`
      : `${result.succeeded} succeeded, ${result.failed} failed`;

  sendSuccess(res, result, message);
}

// ---------------------------------------------------------------------------
// Handler: preview (mock, no API key needed)
// ---------------------------------------------------------------------------

/**
 * POST /api/ai/preview
 *
 * Body: ProductDescriptionInput
 * Response: AIGenerationResult (mock data)
 *
 * Safe to call in any environment — does not consume AI tokens.
 * Useful for UI prototyping and testing description layouts.
 */
export async function handlePreview(
  req: AuthRequest,
  res: Response
): Promise<void> {
  /** Same validation as generate so the client learns the correct shape */
  const input = parsePreviewRequest(req.body);

  /** Return deterministic mock without hitting OpenAI */
  const result = generateMockDescription(input);

  sendSuccess(res, result, "Mock description generated (preview mode)");
}

// ---------------------------------------------------------------------------
// Error handler: ZodError → 422 with field-level errors
// ---------------------------------------------------------------------------

/**
 * Converts a ZodError caught in any of the above handlers into a 422 response.
 * Call this from a try/catch or let the global middleware handle it —
 * the global handler re-uses this for consistent formatting.
 */
export function sendValidationError(
  res: Response,
  error: ZodError
): Response {
  const errors = formatZodErrors(error);
  return res.status(422).json({
    success: false,
    message: "Validation failed",
    errors,
  });
}
