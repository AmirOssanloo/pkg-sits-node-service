import { jest } from '@jest/globals'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { ValidationError } from '../../errors/ValidationError.js'
import validateRequestMiddleware from './validate-request.js'

describe('validateRequestMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      validated: {},
    }
    res = {}
    next = jest.fn()
  })

  describe('body validation', () => {
    it('should validate body and attach to req.validated', () => {
      const schema = {
        body: z.object({
          name: z.string().min(1),
          age: z.number().positive(),
        }),
      }

      req.body = { name: 'John', age: 25 }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(req.validated).toEqual({
        body: { name: 'John', age: 25 },
      })
      expect(next).toHaveBeenCalledWith()
    })

    it('should call next with ValidationError on invalid body', () => {
      const schema = {
        body: z.object({
          name: z.string().min(1),
          age: z.number().positive(),
        }),
      }

      req.body = { name: '', age: -5 }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError))
      const error = (next as jest.Mock).mock.calls[0][0]
      expect(error.message).toContain('Too small: expected string to have >=1 characters')
    })
  })

  describe('query validation', () => {
    it('should validate query parameters', () => {
      const schema = {
        query: z.object({
          page: z.string().transform(Number).pipe(z.number().positive()),
          limit: z.string().transform(Number).pipe(z.number().positive().max(100)),
        }),
      }

      req.query = { page: '2', limit: '20' }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(req.validated).toEqual({
        query: { page: 2, limit: 20 },
      })
      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('params validation', () => {
    it('should validate route params', () => {
      const schema = {
        params: z.object({
          id: z.string().uuid(),
        }),
      }

      req.params = { id: '123e4567-e89b-12d3-a456-426614174000' }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(req.validated).toEqual({
        params: { id: '123e4567-e89b-12d3-a456-426614174000' },
      })
      expect(next).toHaveBeenCalledWith()
    })

    it('should reject invalid UUID', () => {
      const schema = {
        params: z.object({
          id: z.string().uuid(),
        }),
      }

      req.params = { id: 'not-a-uuid' }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError))
    })
  })

  describe('multiple validations', () => {
    it('should validate body, query, and params together', () => {
      const schema = {
        body: z.object({
          name: z.string(),
        }),
        query: z.object({
          filter: z.string().optional(),
        }),
        params: z.object({
          id: z.string(),
        }),
      }

      req.body = { name: 'Test' }
      req.query = { filter: 'active' }
      req.params = { id: '123' }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(req.validated).toEqual({
        body: { name: 'Test' },
        query: { filter: 'active' },
        params: { id: '123' },
      })
      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('error handling', () => {
    it('should format validation errors with path information', () => {
      const schema = {
        body: z.object({
          user: z.object({
            email: z.string().email(),
            age: z.number().min(18),
          }),
        }),
      }

      req.body = { user: { email: 'invalid', age: 16 } }

      const middleware = validateRequestMiddleware(schema)
      middleware(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(expect.any(ValidationError))
      const error = (next as jest.Mock).mock.calls[0][0]
      expect(error.errors).toBeDefined()
      expect(Object.keys(error.errors)).toContain('user.email')
    })
  })
})
