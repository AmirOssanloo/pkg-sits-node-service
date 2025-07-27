import * as path from 'path'
import { mergeDeepRight } from 'ramda'
import readYamlConfigFile from '../loaders/yaml.js'
import type { UserConfig } from '../types.js'
import { validateConfig as validateConfigSchema } from '../validation/validator.js'
import { getDefaultConfig } from './defaults.js'

const { NODE_ENV } = process.env

const assembleConfig = (configPath: string): UserConfig => {
  if (!NODE_ENV) {
    throw new Error('NODE_ENV is not defined')
  }

  const projectDir = process.cwd()
  const configDir = path.join(projectDir, configPath)
  const defaults = getDefaultConfig()

  // Read base configuration (required)
  const baseConfigFilePath = path.join(configDir, 'index.yaml')
  const baseConfig = readYamlConfigFile(baseConfigFilePath) as UserConfig

  // Read environment-specific configuration
  const envConfigFilePath = path.join(configDir, `node.${NODE_ENV}.yaml`)
  const envConfig = readYamlConfigFile(envConfigFilePath) as UserConfig

  // Merge configs: defaults -> base -> environment
  const mergedConfig = mergeDeepRight(baseConfig, envConfig)
  const finalConfig = mergeDeepRight(defaults, mergedConfig) as UserConfig

  // Validate the final configuration with schema
  return validateConfigSchema(finalConfig)
}

export default assembleConfig
