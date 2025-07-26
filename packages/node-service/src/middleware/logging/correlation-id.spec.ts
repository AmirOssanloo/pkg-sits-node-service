import { jest } from '@jest/globals'
import { Response } from 'express'
import { EnrichedRequest } from '../../types/express.js'
import correlationIdMiddleware, { CORRELATION_ID } from './correlation-id.js'

describe('correlationIdMiddleware', () => {
  describe('request does not have a correlation id', () => {
    it('should add a correlation id to the request', () => {
      const req = {} as EnrichedRequest
      const res = { setHeader: jest.fn() } as unknown as Response
      const next = jest.fn()

      correlationIdMiddleware()(req, res, next)

      expect(res.setHeader).toHaveBeenCalledWith(CORRELATION_ID, expect.any(String))
      expect(req.correlation_id).toBeDefined()
    })
  })

  describe('request has a correlation id', () => {
    it('should forward the correlation id from the request context object', () => {
      const req = { correlation_id: '123' } as unknown as EnrichedRequest
      const res = { setHeader: jest.fn() } as unknown as Response
      const next = jest.fn()

      correlationIdMiddleware()(req, res, next)

      expect(res.setHeader).toHaveBeenCalledWith(CORRELATION_ID, '123')
      expect(req.correlation_id).toBe('123')
    })
  })
})
