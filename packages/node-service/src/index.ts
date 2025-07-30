// Type exports
export * from './types/index.js'
export type {
  EnrichedRequest,
  RequestContext,
  ValidationSchema,
  InferValidatedRequest,
  InferZodSchema,
} from './types/request.js'
export type { AuthIdentity } from './types/auth.js'

// Core exports
export { default as createNodeService } from './core/service.js'
export { default as createApp } from './core/app.js'
export { default as bootApp } from './core/boot.js'

// Middleware exports
export { default as validateRequestMiddleware } from './middleware/validation/validate-request.js'

// Error exports
export {
  BasicError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from './errors/index.js'

// Re-export configuration
export { default as config } from '@sits/configuration'
