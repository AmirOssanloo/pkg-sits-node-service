import * as path from 'path'
import type { UserConfig } from '../types.js'
import readConfigFile from './yaml.js'

const configDir = '../../config'

describe('readConfigFile', () => {
  describe('should read correct file', () => {
    it('should read index file', () => {
      const filePath = path.join(configDir, 'index.yaml')
      const config = readConfigFile(filePath) as UserConfig

      expect(config.name).toBe('node-service')
    })

    it('should read environment file', () => {
      const ENV = 'development'
      const filePath = path.join(configDir, `node.${ENV}.yaml`)
      const config = readConfigFile(filePath) as UserConfig

      expect(config.environment).toBe(ENV)
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
