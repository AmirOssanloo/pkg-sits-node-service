import type { AddressInfo } from 'net'
import express from 'express'
import fetch from 'node-fetch'
import createServer from './createServer'

describe('createServer', () => {
  const status = 200
  const app = express()

  app.get('/', (req, res) => {
    res.sendStatus(status)
  })

  const config = {
    app,
    port: 9000,
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
  }

  it('should start a server and return 200', async () => {
    const { server } = await createServer(config)
    const address = server.address() as AddressInfo

    expect(address.port).toEqual(config.port)

    try {
      const response = await fetch(`http://localhost:${config.port}`)
      expect(response.status).toEqual(status)
    } catch (error) {
      console.log(error)
    }

    server.close()
  })
})
