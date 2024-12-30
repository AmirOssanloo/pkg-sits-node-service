export class BasicError extends Error {
  readonly status: number
  readonly errors: any[]

  constructor(name: string, message: string, status: number, errors = []) {
    super(message)

    this.name = name
    this.status = status
    this.errors = errors
  }
}

export class BadRequestError extends BasicError {
  constructor(message: string, errors = []) {
    super('BAD_REQUEST', message, 400, errors)
  }
}

export class UnauthorizedError extends BasicError {
  constructor(message: string, errors = []) {
    super('UNAUTHORIZED', message, 401, errors)
  }
}

export class ValidationError extends BasicError {
  constructor(message: string, errors = []) {
    super('VALIDATION_ERROR', message, 403, errors)
  }
}

export class NotFoundError extends BasicError {
  constructor(message = 'Not found', errors = []) {
    super('NOT_FOUND', message, 404, errors)
  }
}

export class AlreadyExistsError extends BasicError {
  constructor(message = 'Already exists', errors = []) {
    super('ALREADY_EXISTS', message, 409, errors)
  }
}

export class UnsupportedMediaTypeError extends BasicError {
  constructor(message: string, errors = []) {
    super('UNSUPPORTED_MEDIA_TYPE', message, 415, errors)
  }
}

export class ServiceError extends BasicError {
  constructor(message: string, errors = []) {
    super('ERROR', message, 500, errors)
  }
}
