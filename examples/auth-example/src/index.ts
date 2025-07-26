#!/usr/bin/env node
import { createNodeService, type EnrichedRequest } from '@sits/node-service'
import { Router } from 'express'
import jwt from 'jsonwebtoken'

async function main() {
  const service = createNodeService()
  const router = Router()

  // Public endpoint - no authentication required
  router.post('/api/login', (req, res) => {
    const { username, password } = req.body

    // Simple mock authentication
    if (username === 'admin' && password === 'password') {
      // In a real app, get the secret from config
      const token = jwt.sign({ username, role: 'admin' }, 'my-super-secret-key-for-example', {
        expiresIn: '1h',
      })

      res.json({ token })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  })

  // Public endpoint
  router.get('/api/public', (req, res) => {
    res.json({
      message: 'This is a public endpoint',
      timestamp: new Date().toISOString(),
    })
  })

  // Secure endpoint - requires JWT authentication
  router.get('/api/secure/profile', (req: EnrichedRequest, res) => {
    // The auth middleware adds the decoded token to req.user
    console.log('Hello')

    res.json({
      message: 'This is a secure endpoint',
      user: req.user,
      timestamp: new Date().toISOString(),
    })
  })

  // Admin endpoint - requires JWT authentication
  router.get('/api/admin/users', (req: EnrichedRequest, res) => {
    // Check if user has admin role
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    res.json({
      users: [
        { id: 1, username: 'admin', role: 'admin' },
        { id: 2, username: 'user1', role: 'user' },
        { id: 3, username: 'user2', role: 'user' },
      ],
    })
  })

  // Setup the service with our routes
  const { run } = await service.setup({
    handlers: router,
  })

  // Add a health check endpoint directly to the app
  service.app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'auth-example',
      timestamp: new Date().toISOString(),
    })
  })

  run()
}

main().catch(console.error)
