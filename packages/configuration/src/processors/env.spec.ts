import { getDefaultConfig } from '../core/defaults.js'
import applyEnv from './env.js'

const CONFIG = {
  ...getDefaultConfig(),
  name: 'service',
  env: {
    JWT_SECRET: 'secret',
  },
}

describe('applyEnv', () => {
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
    applyEnv({ ...CONFIG })
    expect(process.env.JWT_SECRET).toBe(CONFIG.env.JWT_SECRET)
  })

  it('should delete env from config when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production'
    const config = applyEnv({ ...CONFIG })

    expect(config.env).toBe(undefined)
  })

  it('should not delete env from config when NODE_ENV is development', () => {
    process.env.NODE_ENV = 'development'
    const config = applyEnv({ ...CONFIG })

    expect(config.env).toEqual(CONFIG.env)
  })
})
