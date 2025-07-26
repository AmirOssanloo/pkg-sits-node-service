import * as fs from 'fs'
import * as yaml from 'js-yaml'
import type { UserConfig } from '../types.js'

const readConfigFile = (filePath: string, optional: boolean = false): UserConfig => {
  if (!fs.existsSync(filePath)) {
    if (optional) {
      // Return empty config for optional files
      return {} as UserConfig
    }
    throw new Error(`Configuration file not found: ${filePath}`)
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const config = yaml.load(fileContents)

    // Handle empty files
    if (!config || typeof config !== 'object') {
      return {} as UserConfig
    }

    return config as UserConfig
  } catch (error) {
    throw new Error(`Failed to parse configuration file ${filePath}: ${error}`)
  }
}

export default readConfigFile
