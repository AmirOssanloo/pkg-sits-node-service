import assembleConfig from './assemble.js'

const configDir = '../../config'

describe('assembleConfig', () => {
  const NODE_ENV = 'test'
  const PROCESS_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...PROCESS_ENV,
      NODE_ENV,
    }
  })

  afterEach(() => {
    process.env = PROCESS_ENV
  })

  it('should have values from base configuration', () => {
    const config = assembleConfig(configDir)
    expect(config.name).toBe('service')
  })

  it('should overwrite values from environment configuration', () => {
    const config = assembleConfig(configDir)
    expect(config.env?.JWT_SECRET).toBe('test')
  })
})
