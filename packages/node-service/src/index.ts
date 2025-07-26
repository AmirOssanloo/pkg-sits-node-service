// Type exports
export * from './types/index.js'
export type { EnrichedRequest, RequestContext } from './types/express.js'

// Core exports
export { default as NodeService } from './core/service.js'
export { default as createApp } from './core/app.js'
export { default as bootApp } from './core/boot.js'

// Middleware exports
export { default as validateRequestMiddleware } from './middleware/validation/validate-request.js'
export { default as errorHandlerMiddleware } from './middleware/error-handler/index.js'
export * from './middleware/validation/schemas.js'

// Error exports (excluding HttpError which is already exported from types)
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
