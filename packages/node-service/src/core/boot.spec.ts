import { jest } from '@jest/globals'
import express from 'express'
import bootApp from './boot.js'

// We should test the following:
// - The app should start
// - The app should stop
// - The app should restart
// - The app should handle errors
// - The app should handle signals
// - The app should handle shutdown

describe('bootApp', () => {
  const status = 200
  const app = express()

  app.get('/', (req, res) => {
    res.status(status).end()
  })

  const config = {
    app,
    port: 9000,
    logger: {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    },
  }

  it('should boot the app', async () => {
    // TODO: Implement
  })
})
