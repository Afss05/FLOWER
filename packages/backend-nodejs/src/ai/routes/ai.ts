/**
 * AI Product Description Generator — Express Routes
 *
 * Mounts:
 *   POST /api/ai/generate          — generate single description (auth required)
 *   POST /api/ai/generate/batch    — generate batch descriptions (auth required)
 *   POST /api/ai/preview           — mock preview (auth required, no API key needed)
 *   GET  /api/ai/health            — health-check for the AI module (public)
 *
 * All generate routes require a valid JWT and admin/super_admin role.
 * ZodErrors are caught here and converted to clean 422 responses.
 */

import { Router, Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { authenticate, authorize } from "../../middleware/authenticate.js";
import type { AuthRequest } from "../../middleware/authenticate.js";
import {
  handleGenerate,
  handleBatchGenerate,
  handlePreview,
  sendValidationError,
} from "../controllers/AIController.js";

const router: Router = Router();

// ---------------------------------------------------------------------------
// Helper: wraps async handlers and intercepts ZodErrors before the global
// error middleware sees them, so they always return 422 instead of 500.
// ---------------------------------------------------------------------------

/**
 * Wraps an async route handler.
 * - Catches ZodError → 422 validation response
 * - All other errors → forwarded to global errorHandler middleware via next()
 */
function asyncRoute(
  handler: (req: AuthRequest, res: Response) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req as AuthRequest, res).catch((err: unknown) => {
      if (err instanceof ZodError) {
        sendValidationError(res, err);
        return;
      }
      next(err);
    });
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * GET /api/ai/health
 *
 * Public endpoint — confirms the AI module is loaded and the environment
 * variable is present (key value is never exposed).
 */
router.get("/health", (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    success: true,
    module: "ai-description-generator",
    apiKeyConfigured: hasKey,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/ai/preview
 *
 * Returns a mock description — no OpenAI call made.
 * Useful for admins to see the output shape before spending tokens.
 * Requires authentication but no API key.
 */
router.post(
  "/preview",
  authenticate,
  authorize("admin", "super_admin"),
  asyncRoute(handlePreview)
);

/**
 * POST /api/ai/generate
 *
 * Generates a real AI description for a single product.
 * Requires OPENAI_API_KEY in environment.
 * Restricted to admin / super_admin roles.
 */
router.post(
  "/generate",
  authenticate,
  authorize("admin", "super_admin"),
  asyncRoute(handleGenerate)
);

/**
 * POST /api/ai/generate/batch
 *
 * Generates real AI descriptions for up to 10 products at once.
 * Requires OPENAI_API_KEY in environment.
 * Restricted to admin / super_admin roles.
 */
router.post(
  "/generate/batch",
  authenticate,
  authorize("admin", "super_admin"),
  asyncRoute(handleBatchGenerate)
);

export default router;
