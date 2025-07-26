import express from 'express'
import createNodeService from '../packages/node-service/src/index.js'

async function main() {
  // Create the service
  const service = createNodeService()

  // Create a router with your routes
  const apiRouter = express.Router()
  
  apiRouter.get('/users', (req, res) => {
    res.json({ users: [] })
  })
  
  apiRouter.post('/users', (req, res) => {
    res.status(201).json({ user: req.body })
  })

  // Setup with the router
  const { run } = await service.setup({
    handlers: apiRouter,
  })

  // You can also add routes directly to the app
  service.app.get('/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Start the service
  run()
}

main().catch(console.error)