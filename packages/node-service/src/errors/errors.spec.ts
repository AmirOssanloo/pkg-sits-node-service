import {
  BasicError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
} from './index.js'

describe('Error Classes', () => {
  describe('BasicError', () => {
    it('should create error with message and status', () => {
      const error = new BasicError('Test error', 500)

      expect(error.message).toBe('Test error')
      expect(error.status).toBe(500)
      expect(error.name).toBe('BasicError')
      expect(error).toBeInstanceOf(Error)
      expect(error).toBeInstanceOf(BasicError)
    })

    it('should use default status 500', () => {
      const error = new BasicError('Test error')
      expect(error.status).toBe(500)
    })

    it('should include additional error details', () => {
      const errors = { field: 'Invalid value' }
      const error = new BasicError('Validation failed', 400, errors)

      expect(error.errors).toEqual(errors)
    })

    it('should serialize to JSON', () => {
      const error = new BasicError('Test error', 400, { field: 'Invalid' })
      const json = error.toJSON()

      expect(json).toEqual({
        name: 'BasicError',
        message: 'Test error',
        status: 400,
        errors: { field: 'Invalid' },
      })
    })
  })

  describe('ValidationError', () => {
    it('should create error with 400 status', () => {
      const error = new ValidationError('Invalid input')

      expect(error.message).toBe('Invalid input')
      expect(error.status).toBe(400)
      expect(error.name).toBe('ValidationError')
      expect(error).toBeInstanceOf(BasicError)
    })

    it('should include validation errors', () => {
      const errors = {
        email: 'Invalid email format',
        age: 'Must be a positive number',
      }
      const error = new ValidationError('Validation failed', errors)

      expect(error.errors).toEqual(errors)
    })
  })

  describe('AuthenticationError', () => {
    it('should create error with 401 status', () => {
      const error = new AuthenticationError()

      expect(error.message).toBe('Authentication required')
      expect(error.status).toBe(401)
      expect(error.name).toBe('AuthenticationError')
      expect(error).toBeInstanceOf(BasicError)
    })

    it('should accept custom message', () => {
      const error = new AuthenticationError('Invalid token')
      expect(error.message).toBe('Invalid token')
    })
  })

  describe('AuthorizationError', () => {
    it('should create error with 403 status', () => {
      const error = new AuthorizationError()

      expect(error.message).toBe('Access forbidden')
      expect(error.status).toBe(403)
      expect(error.name).toBe('AuthorizationError')
      expect(error).toBeInstanceOf(BasicError)
    })

    it('should accept custom message', () => {
      const error = new AuthorizationError('Insufficient permissions')
      expect(error.message).toBe('Insufficient permissions')
    })
  })

  describe('NotFoundError', () => {
    it('should create error with 404 status', () => {
      const error = new NotFoundError()

      expect(error.message).toBe('Resource not found')
      expect(error.status).toBe(404)
      expect(error.name).toBe('NotFoundError')
      expect(error).toBeInstanceOf(BasicError)
    })

    it('should accept custom message', () => {
      const error = new NotFoundError('User not found')
      expect(error.message).toBe('User not found')
    })
  })

  describe('ConflictError', () => {
    it('should create error with 409 status', () => {
      const error = new ConflictError()

      expect(error.message).toBe('Resource conflict')
      expect(error.status).toBe(409)
      expect(error.name).toBe('ConflictError')
      expect(error).toBeInstanceOf(BasicError)
    })

    it('should accept custom message', () => {
      const error = new ConflictError('Email already exists')
      expect(error.message).toBe('Email already exists')
    })
  })

  describe('Error inheritance', () => {
    it('should maintain proper prototype chain', () => {
      const error = new ValidationError('Test')

      expect(error instanceof Error).toBe(true)
      expect(error instanceof BasicError).toBe(true)
      expect(error instanceof ValidationError).toBe(true)
      expect(error.stack).toBeDefined()
    })
  })
})
