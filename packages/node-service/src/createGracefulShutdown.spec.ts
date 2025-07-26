import http from 'http'
import Fastify, { FastifyInstance } from 'fastify'
import createGracefulShutdownHandler from './createGracefulShutdown.js'
import type { GracefulShutdownHandler } from './createGracefulShutdown.js'

const PORT = 6000
const STATUS = 200

const logger = {
  info: jest.fn(),
  error: jest.fn(),
}

const createServer = (app: FastifyInstance) => {
  const server = http.createServer(app.server)
  server.listen(PORT)

  return server
}

const createApp = () => {
  const app = Fastify()

  app.get('/', async (request, reply) => {
    reply.status(STATUS)
  })

  return app
}

const delay = async (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

describe('createGracefulShutdown', () => {
  let server: http.Server
  let serverClose: typeof server.close
  let signal: string
  let gracefulShutdown: GracefulShutdownHandler

  beforeEach(() => {
    signal = 'SIGTERM'
    server = createServer(createApp())
    serverClose = server.close.bind(server)
  })

  // it('should return a function', () => {
  //   const handler = createGracefulShutdownHandler({
  //     server,
  //     releaseResources: () => {},
  //     logger,
  //   })

  //   expect(typeof handler).toBe('function')
  // })

  // it('should log an error message for unhandled promise rejections', () => {
  //   const handler = createGracefulShutdownHandler({ server, releaseResources: () => {}, logger })

  //   const error = new Error('Error')
  //   handler('unhandledRejection')(error)

  //   expect(logger.error).toHaveBeenCalledWith('Caught unhandled promise rejections', { error })
  // })

  it('closes the server before releasing the resources', async () => {
    const serverCallStack: string[] = []
    const releaseResources = jest.fn(async () => {
      await delay(200)
      serverCallStack.push('releaseResources')
    })

    gracefulShutdown = createGracefulShutdownHandler({ server, releaseResources, logger })(signal)

    jest.spyOn(server, 'close').mockImplementation((callback) => {
      serverCallStack.push('close')
      serverClose(callback)
      return server
    })

    await gracefulShutdown(new Error('something'))

    expect(serverCallStack).toEqual(['close', 'releaseResources'])
    expect(releaseResources).toHaveBeenCalledTimes(1)
  })
})
