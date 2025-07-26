import { EnrichedRequest } from '../../typings/request.js'
import isSecurePath from './isSecurePath.js'

// Mock the config module
jest.mock('../../config', () => ({
  sns: {
    auth: {
      jwt: {
        securePaths: ['/api/v1'],
        excludedPaths: ['/api/v1/auth/login'],
      },
    },
  },
}))

describe('isSecurePath', () => {
  it('should return true if the path is secure', () => {
    const req = { originalUrl: '/api/v1' } as unknown as EnrichedRequest
    const result = isSecurePath(req)
    expect(result).toBe(true)
  })

  it('should return false if the path is excluded', () => {
    const req = { originalUrl: '/api/v1/auth/login' } as unknown as EnrichedRequest
    const result = isSecurePath(req)
    expect(result).toBe(false)
  })

  it('should return false if the path is not secure', () => {
    const req = { originalUrl: '/public' } as unknown as EnrichedRequest
    const result = isSecurePath(req)
    expect(result).toBe(false)
  })
})
