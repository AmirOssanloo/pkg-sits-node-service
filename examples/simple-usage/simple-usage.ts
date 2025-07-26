import { createNodeService } from '@sits/node-service'
import { Router } from 'express'
import type { Request, Response } from 'express'

async function main() {
  const service = createNodeService()
  const router = Router()

  router.get('/users', (_req, res) => {
    res.json({ users: [] })
  })

  router.post('/users', (req, res) => {
    res.status(201).json({ user: req.body })
  })

  const { run } = await service.setup({
    handlers: router,
  })

  // You can also add routes directly to the app
  service.app.get('/status', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  run()
}

main().catch(console.error)
