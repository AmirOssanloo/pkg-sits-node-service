// Export all error classes
export { BasicError } from './BasicError.js'
export { ValidationError } from './ValidationError.js'
export { AuthenticationError } from './AuthenticationError.js'
export { AuthorizationError } from './AuthorizationError.js'
export { NotFoundError } from './NotFoundError.js'
export { ConflictError } from './ConflictError.js'

// Export type for error with status
export interface HttpError extends Error {
  status: number
  errors?: Record<string, any>
}
