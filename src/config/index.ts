import applyEnv from './applyEnv'
import assembleConfig from './assembleConfig'

const config = assembleConfig('config')
const envConfig = applyEnv(config)

export default envConfig
