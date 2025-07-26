/**
 * Base error class for all service errors
 * Extends Error with HTTP status code and additional error details
 */
export class BasicError extends Error {
  public readonly status: number
  public readonly errors?: Record<string, any>

  constructor(message: string, status: number = 500, errors?: Record<string, any>) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.errors = errors

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Converts error to JSON representation
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      errors: this.errors,
    }
  }
}