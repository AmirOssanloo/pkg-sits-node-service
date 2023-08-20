import applyEnv from './applyEnv'
import assembleConfig from './assembleConfig'

const config = assembleConfig('config')

export default applyEnv(config)
