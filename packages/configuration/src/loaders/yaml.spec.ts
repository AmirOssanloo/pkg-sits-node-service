import * as path from 'path'
import readConfigFile from './yaml.js'

const configDir = '../../config'

describe('readConfigFile', () => {
  describe('should read correct file', () => {
    it('should read index file', () => {
      const filePath = path.join(configDir, 'index.yaml')
      const config = readConfigFile(filePath)

      expect(config.env?.JWT_SECRET).toBe('index')
    })

    it('should read environment file', () => {
      const ENV = 'development'
      const filePath = path.join(configDir, `node.${ENV}.yaml`)
      const config = readConfigFile(filePath)

      expect(config.env?.JWT_SECRET).toBe(ENV)
    })
  })

  describe('should throw error', () => {
    it('when file does not exist', () => {
      const throwError = () => {
        readConfigFile('incorrect.yaml')
      }

      expect(throwError).toThrow()
    })
  })
})
