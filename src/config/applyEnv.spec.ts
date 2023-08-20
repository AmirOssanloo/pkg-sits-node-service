import applyEnv from './applyEnv'

const CONFIG = {
  name: 'service',
  env: {
    SECRET: 'secret',
  },
}

describe('applyEnv', () => {
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

  it('should have values from base configuration', () => {
    applyEnv({ ...CONFIG })
    expect(process.env.SECRET).toBe(CONFIG.env.SECRET)
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
