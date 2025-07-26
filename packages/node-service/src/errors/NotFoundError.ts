import { BasicError } from './BasicError.js'

/**
 * Not found error for missing resources
 */
export class NotFoundError extends BasicError {
  constructor(message: string = 'Resource not found', errors?: Record<string, any>) {
    super(message, 404, errors)
    this.name = 'NotFoundError'
  }
}
