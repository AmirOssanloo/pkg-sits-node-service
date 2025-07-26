import { jest } from '@jest/globals'
import { EnrichedRequest } from '../../types/express.js'

// Mock the config module before importing
jest.unstable_mockModule('@sits/configuration', () => ({
  default: {
    sns: {
      auth: {
        jwt: {
          securePaths: ['/api/v1'],
          excludedPaths: ['/api/v1/auth/login'],
        },
      },
    },
  },
}))

// Import after mocking
const isSecurePath = (await import('./isSecurePath.js')).default

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
