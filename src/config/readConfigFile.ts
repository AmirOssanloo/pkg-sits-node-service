import fs from 'fs'
import yaml from 'js-yaml'

const readConfigFile = (filePath: string): Record<any, any> => {
  if (!fs.existsSync(filePath)) {
    throw new Error('Configuration file not found')
  }

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return yaml.load(fileContents) as Record<any, any>
  } catch (error) {
    throw new Error()
  }
}

export default readConfigFile
