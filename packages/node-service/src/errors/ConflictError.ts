import { BasicError } from './BasicError.js'

/**
 * Conflict error for resource conflicts
 */
export class ConflictError extends BasicError {
  constructor(message: string = 'Resource conflict', errors?: Record<string, any>) {
    super(message, 409, errors)
    this.name = 'ConflictError'
  }
}
