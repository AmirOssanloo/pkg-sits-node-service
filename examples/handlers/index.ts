import { Router } from 'express'
import type { Request, Response } from 'express'

const createHandlers = () => {
  const router = Router()

  router.get('/regular/message', (req: Request, res: Response) => {
    res.status(200).json({ message: 'OK' })
  })

  router.post('/secure/message', (req: Request, res: Response) => {
    res.status(200).json({ message: req.body.message })
  })

  return router
}

export default createHandlers
