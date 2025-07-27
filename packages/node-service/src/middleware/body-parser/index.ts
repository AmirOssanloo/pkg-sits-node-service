import express from 'express'
import type { Express, NextFunction } from 'express'
import type { NodeServiceConfig } from '../../core/config.js'

/**
 * Creates and configures body parser middleware
 */
const bodyParserMiddleware = (app: Express, config: NodeServiceConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const bodyParserConfig = config.nodeService?.middleware?.bodyParser

    // JSON body parser
    app.use(
      express.json({
        limit: bodyParserConfig?.json?.limit ?? '10mb',
        strict: bodyParserConfig?.json?.strict ?? true,
        type: bodyParserConfig?.json?.type ?? 'application/json',
      })
    )

    // URL-encoded body parser
    app.use(
      express.urlencoded({
        extended: bodyParserConfig?.urlencoded?.extended ?? true,
        limit: bodyParserConfig?.urlencoded?.limit ?? '10mb',
        parameterLimit: bodyParserConfig?.urlencoded?.parameterLimit ?? 1000,
      })
    )

    // Raw body parser (if enabled)
    if (bodyParserConfig?.raw?.enabled) {
      app.use(
        express.raw({
          limit: bodyParserConfig.raw.limit ?? '10mb',
          type: bodyParserConfig.raw.type ?? 'application/octet-stream',
        })
      )
    }

    // Text body parser (if enabled)
    if (bodyParserConfig?.text?.enabled) {
      app.use(
        express.text({
          limit: bodyParserConfig.text.limit ?? '10mb',
          type: bodyParserConfig.text.type ?? 'text/plain',
        })
      )
    }

    next()
  }
}

export default bodyParserMiddleware
