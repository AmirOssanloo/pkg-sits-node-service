import * as path from 'path'
import { mergeDeepRight } from 'ramda'
import readConfigFile from '../loaders/yaml.js'
import type { Config, UserConfig } from '../types.js'
import { validateConfig as validateConfigSchema } from '../validation/validator.js'
import { mergeWithDefaults } from './merge.js'

const { NODE_ENV } = process.env

const assembleConfig = (configPath: string): Config => {
  if (!NODE_ENV) {
    throw new Error('NODE_ENV is not defined')
  }

  const projectDir = process.cwd()
  const configDir = path.join(projectDir, configPath)

  // Read base configuration (required)
  const baseConfigFilePath = path.join(configDir, 'index.yaml')
  const baseConfig = readConfigFile(baseConfigFilePath, false)

  // Read environment-specific configuration (optional)
  const envConfigFilePath = path.join(configDir, `node.${NODE_ENV}.yaml`)
  const envConfig = readConfigFile(envConfigFilePath, true)

  // Merge configs: defaults -> base -> environment
  const mergedUserConfig = mergeDeepRight(baseConfig, envConfig) as UserConfig
  const finalConfig = mergeWithDefaults(mergedUserConfig)

  // Validate the final configuration with schema
  const validatedConfig = validateConfigSchema(finalConfig)

  return validatedConfig
}

export default assembleConfig
