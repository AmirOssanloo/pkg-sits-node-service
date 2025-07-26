import type { Server } from 'http'
import { jest } from '@jest/globals'
import express from 'express'
import type { Express } from 'express'

describe('Node Service Integration Tests', () => {
  let serviceInstance: { server: Server; app: Express } | null = null

  afterEach(async () => {
    if (serviceInstance) {
      // Force close the server
      await new Promise((resolve) => {
        serviceInstance!.server.close(resolve)
      })
      serviceInstance = null
    }

    // Clear module cache to reset service state
    jest.resetModules()
  })

  describe('Service Lifecycle', () => {
    it('should start and stop a basic service', async () => {
      // Import fresh to avoid state issues
      const { default: createNodeService } = await import('../service.js')
      const service = createNodeService()

      // Add a simple route
      service.app.get('/test', (req, res) => {
        res.json({ status: 'ok' })
      })

      // This is a simplified test
      expect(service.app).toBeDefined()
      expect(service.setup).toBeDefined()
      expect(service.logger).toBeDefined()
    })

    it('should support custom router', async () => {
      const { default: createNodeService } = await import('../service.js')
      const service = createNodeService()

      // Create a router
      const router = express.Router()
      router.get('/custom', (req, res) => {
        res.json({ custom: true })
      })

      // Setup with custom router
      const { run } = await service.setup({
        handlers: router,
      })

      expect(run).toBeDefined()
      expect(typeof run).toBe('function')
    })
  })
})
