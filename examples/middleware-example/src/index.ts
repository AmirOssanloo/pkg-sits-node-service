#!/usr/bin/env node
import { createNodeService, validateRequestMiddleware, ValidationError } from '@sits/node-service'
import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

// Define validation schemas
const userCreateBodySchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  age: z.number().min(18).max(120),
})

const userUpdateParamsSchema = z.object({
  id: z.string().uuid(),
})

const userUpdateBodySchema = z.object({
  username: z.string().min(3).max(20).optional(),
  email: z.string().email().optional(),
  age: z.number().min(18).max(120).optional(),
})

async function main() {
  const service = createNodeService()
  const router = Router()

  router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })

  // Route with validation middleware
  router.post(
    '/api/users',
    validateRequestMiddleware({ body: userCreateBodySchema as any }) as any,
    (req, res) => {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        ...req.body,
        createdAt: new Date().toISOString(),
      }

      res.status(201).json({ user })
    }
  )

  // Route with params and body validation
  router.put(
    '/api/users/:id',
    validateRequestMiddleware({
      params: userUpdateParamsSchema as any,
      body: userUpdateBodySchema as any,
    }) as any,
    (req, res) => {
      const { id } = req.params
      const updates = req.body

      res.json({
        message: 'User updated',
        id,
        updates,
        updatedAt: new Date().toISOString(),
      })
    }
  )

  // Route that demonstrates error handling
  router.get('/api/error-test/:type', (req, res, next) => {
    const { type } = req.params

    switch (type) {
      case 'validation':
        throw new ValidationError('Invalid input data', {
          field: 'email',
          message: 'Email is required',
        })

      case 'generic':
        throw new Error('Something went wrong!')

      case 'async':
        // Demonstrate async error handling
        setTimeout(() => {
          next(new Error('Async error occurred'))
        }, 100)
        return

      default:
        res.json({ message: 'No error thrown' })
    }
  })

  // Route with custom middleware chain
  const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key']

    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' })
    }

    if (apiKey !== 'demo-api-key') {
      return res.status(403).json({ error: 'Invalid API key' })
    }

    next()
  }

  router.get('/api/protected', requireApiKey as any, (req, res) => {
    res.json({
      message: 'Access granted to protected resource',
      timestamp: new Date().toISOString(),
    })
  })

  // Setup the service with our routes
  const { run } = await service.setup({
    handlers: router,
  })

  // The service automatically includes:
  // - Body parsing middleware
  // - CORS middleware (configured in config file)
  // - Error handling middleware
  // - Correlation ID middleware
  // - Request context middleware

  // Add some additional routes directly to the app
  service.app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'middleware-example',
      correlationId: req.headers['x-correlation-id'],
      timestamp: new Date().toISOString(),
    })
  })

  // Start the service
  console.log('Starting middleware example service...')
  console.log('Try these endpoints:')
  console.log('  POST http://localhost:3004/api/users - Create user with validation')
  console.log('  PUT  http://localhost:3004/api/users/:id - Update user with validation')
  console.log('  GET  http://localhost:3004/api/error-test/:type - Test error handling')
  console.log('  GET  http://localhost:3004/api/protected - Requires X-API-Key header')
  console.log('')
  console.log('Example requests:')
  console.log('  Create user: { "username": "john", "email": "john@example.com", "age": 25 }')
  console.log('  Protected endpoint: Header "X-API-Key: demo-api-key"')

  run()
}

main().catch(console.error)
