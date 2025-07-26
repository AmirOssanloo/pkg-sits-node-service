import { Response } from 'express'
import jwt from 'jsonwebtoken'
import { EnrichedRequest } from '../../typings/request.js'
import authMiddleware from './auth.js'
import isSecurePath from './isSecurePath.js'

jest.mock('./isSecurePath.js')
jest.mock('jsonwebtoken')

const mockIsSecurePath = isSecurePath as jest.Mock
const mockJwtVerify = jwt.verify as jest.Mock

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
    mockIsSecurePath.mockReset()
    mockJwtVerify.mockReset()
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
