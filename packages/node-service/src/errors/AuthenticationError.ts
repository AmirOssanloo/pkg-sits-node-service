import { BasicError } from './BasicError.js'

/**
 * Authentication error for unauthorized access attempts
 */
export class AuthenticationError extends BasicError {
  constructor(message: string = 'Authentication required', errors?: Record<string, any>) {
    super(message, 401, errors)
    this.name = 'AuthenticationError'
  }
}
