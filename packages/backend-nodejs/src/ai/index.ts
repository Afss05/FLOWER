/**
 * AI Product Description Generator — Module Public API
 *
 * This barrel file defines what is exported from the `ai/` module.
 * Import from here instead of from individual sub-files.
 *
 * @example
 * import { generateProductDescription, aiRouter } from './ai/index.js';
 */

// Types
export type {
  ProductDescriptionInput,
  GeneratedDescription,
  AIGenerationResult,
  BatchDescriptionInput,
  BatchDescriptionResult,
  BatchGenerationResult,
  DescriptionTone,
  DescriptionLanguage,
  AIClientConfig,
  AIError,
} from "./types/ai.types.js";

// Generator service — the main programmatic API
export {
  generateProductDescription,
  generateBatchDescriptions,
  generateMockDescription,
} from "./services/descriptionGenerator.js";

// AI client helpers (useful for custom integrations)
export {
  loadAIClientConfig,
  sendChatCompletion,
} from "./services/aiClient.js";

// Validators (useful for other modules that compose with AI input)
export {
  parseGenerateRequest,
  parseBatchRequest,
  parsePreviewRequest,
  formatZodErrors,
} from "./validators/ai.validator.js";

// Express router — mount this in src/index.ts
export { default as aiRouter } from "./routes/ai.js";
