import * as fs from 'fs'
import * as yaml from 'js-yaml'

const readYamlConfigFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Configuration file not found: ${filePath}`)
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return yaml.load(fileContents)
  } catch (error) {
    throw new Error(`Failed to parse configuration file ${filePath}: ${error}`)
  }
}

export default readYamlConfigFile
