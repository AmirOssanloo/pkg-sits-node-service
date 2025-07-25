import path from 'path'
import { mergeDeepRight } from 'ramda'
import readConfigFile from './readConfigFile.js'

const { NODE_ENV } = process.env

const assembleConfig = (configPath: string) => {
  if (!NODE_ENV) {
    throw new Error('NODE_ENV is not defined')
  }

  const projectDir = process.cwd()
  const configDir = path.join(projectDir, configPath)

  const baseConfigFilePath = path.join(configDir, 'index.yaml')
  const baseConfig = readConfigFile(baseConfigFilePath)

  const envConfigFilePath = path.join(configDir, `node.${NODE_ENV}.yaml`)
  const envConfig = readConfigFile(envConfigFilePath)

  return mergeDeepRight(baseConfig, envConfig)
}

export default assembleConfig
