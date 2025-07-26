import { BasicError } from './BasicError.js'

/**
 * Validation error for request validation failures
 */
export class ValidationError extends BasicError {
  constructor(message: string, errors?: Record<string, any>) {
    super(message, 400, errors)
    this.name = 'ValidationError'
  }
}