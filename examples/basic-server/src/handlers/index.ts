import { Express } from 'express'

interface CreateHandlersProps {
  app: Express
}

const createHandlers = ({ app }: CreateHandlersProps) => {
  app.get('/regular/message', (req, res) => {
    res.status(200).json({ message: 'Regular' })
  })

  app.get('/secure/message', (req, res) => {
    res.status(200).json({ message: 'Secure' })
  })

  return app
}

export default createHandlers
