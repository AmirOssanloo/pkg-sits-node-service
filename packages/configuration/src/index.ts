import applyEnv from './applyEnv.js'
import assembleConfig from './assembleConfig.js'

const config = assembleConfig('config')
const envConfig = applyEnv(config)

export default envConfig
