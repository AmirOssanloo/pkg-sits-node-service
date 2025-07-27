import assembleConfig from './core/assemble.js'
import applyEnv from './processors/env.js'

const config = assembleConfig('config')
const envConfig = applyEnv(config)

export default envConfig
