import type { Express } from 'express'
import type { NodeServiceConfig } from '../../core/config.js'

/**
 * Creates and configures health check endpoints
 */
export default function createHealthEndpoints(app: Express, config: NodeServiceConfig): void {
  const healthConfig = config.nodeService?.health

  // If health checks are disabled, return early
  if (!healthConfig?.enabled) {
    return
  }

  // Health check endpoint
  app.get(healthConfig.path ?? '/health', async (req, res) => {
    const startTime = Date.now()
    const checks: Record<string, boolean> = {}

    // Run configured health checks
    for (const check of healthConfig.checks ?? []) {
      try {
        const timeoutPromise = new Promise<boolean>((_resolve, reject) =>
          setTimeout(() => reject(new Error('Health check timeout')), healthConfig.timeout ?? 5000)
        )
        checks[check.name] = await Promise.race([check.check(), timeoutPromise])
      } catch {
        checks[check.name] = false
      }
    }

    const allHealthy = Object.values(checks).every((status) => status)
    const response = {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: config.name ?? 'node-service',
      version: config.nodeService?.version ?? '1.0.0',
      responseTime: Date.now() - startTime,
      checks,
    }

    res.status(allHealthy ? 200 : 503).json(response)
  })

  // Simple ping endpoint (always available)
  app.get('/ping', (req, res) => {
    res.json({ timestamp: new Date().toISOString() })
  })
}
