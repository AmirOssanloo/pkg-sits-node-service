import { jest } from '@jest/globals'
import { Response } from 'express'
import { EnrichedRequest } from '../../types/express.js'

// Mock modules before importing
const mockIsSecurePath = jest.fn()
const mockJwtVerify = jest.fn()

jest.unstable_mockModule('./isSecurePath.js', () => ({
  default: mockIsSecurePath,
}))

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: mockJwtVerify,
    sign: jest.fn(),
    decode: jest.fn(),
  },
  verify: mockJwtVerify,
  sign: jest.fn(),
  decode: jest.fn(),
}))

jest.unstable_mockModule('@sits/configuration', () => ({
  default: {
    env: {
      JWT_SECRET: 'test-secret',
    },
  },
}))

// Import after mocking
const authMiddleware = (await import('./auth.js')).default

describe('authMiddleware', () => {
  let req: EnrichedRequest
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    req = {
      headers: {},
      context: {},
    } as EnrichedRequest

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response

    next = jest.fn()
    jest.clearAllMocks()
  })

  describe('non-secure path', () => {
    beforeEach(() => {
      mockIsSecurePath.mockReturnValue(false)
    })

    it('should call next without authentication', async () => {
      await authMiddleware()(req, res, next)

      expect(mockIsSecurePath).toHaveBeenCalledWith(req)
      expect(next).toHaveBeenCalled()
      expect(mockJwtVerify).not.toHaveBeenCalled()
    })
  })

  describe('secure path', () => {
    beforeEach(() => {
      mockIsSecurePath.mockReturnValue(true)
    })

    it('should return 401 when no authorization header is present', async () => {
      await authMiddleware()(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toHaveBeenCalledWith('Unauthorized request')
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 when authorization header does not start with Bearer', async () => {
      req.headers.authorization = 'Invalid token'

      await authMiddleware()(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toHaveBeenCalledWith('Unauthorized request')
      expect(next).not.toHaveBeenCalled()
    })

    it('should set user context and call next when token is valid', async () => {
      const mockPayload = { personaId: '123', market: 'US' }
      req.headers.authorization = 'Bearer ValidToken'
      mockJwtVerify.mockResolvedValue(mockPayload)

      await authMiddleware()(req, res, next)

      expect(req.context.user).toEqual(mockPayload)
      expect(next).toHaveBeenCalled()
    })

    it('should return 401 when token verification fails', async () => {
      req.headers.authorization = 'Bearer InvalidToken'
      mockJwtVerify.mockRejectedValue(new Error('Invalid token'))

      await authMiddleware()(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toHaveBeenCalledWith('Unauthorized request')
      expect(next).not.toHaveBeenCalled()
    })

    it('should return 401 when token payload is invalid', async () => {
      req.headers.authorization = 'Bearer ValidToken'
      mockJwtVerify.mockResolvedValue('Invalid payload')

      await authMiddleware()(req, res, next)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.send).toHaveBeenCalledWith('Unauthorized request')
      expect(next).not.toHaveBeenCalled()
    })
  })
})
