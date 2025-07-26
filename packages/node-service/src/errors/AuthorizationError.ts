import { BasicError } from './BasicError.js'

/**
 * Authorization error for forbidden access attempts
 */
export class AuthorizationError extends BasicError {
  constructor(message: string = 'Access forbidden', errors?: Record<string, any>) {
    super(message, 403, errors)
    this.name = 'AuthorizationError'
  }
}