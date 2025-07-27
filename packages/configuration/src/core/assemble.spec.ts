import assembleConfig from './assemble.js'

const configDir = '../../config'

describe('assembleConfig', () => {
  const NODE_ENV = 'test'
  const PROCESS_ENV = process.env

  beforeEach(() => {
    jest.resetModules()

    process.env = {
      ...PROCESS_ENV,
      NODE_ENV,
    }
  })

  afterEach(() => {
    process.env = PROCESS_ENV
  })

  it('should have values from defaults', () => {
    const config = assembleConfig(configDir)
    expect(config.core.server.host).toBe('0.0.0.0')
  })

  it('should have values from base configuration', () => {
    const config = assembleConfig(configDir)
    expect(config.name).toBe('node-service')
  })

  it('should overwrite values from environment configuration', () => {
    const config = assembleConfig(configDir)
    expect(config.environment).toBe('test')
  })
})
