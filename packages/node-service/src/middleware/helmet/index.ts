import type { RequestHandler } from 'express'
import helmet from 'helmet'
import type { NodeServiceConfig } from '../../core/config.js'

/**
 * Creates and configures Helmet security middleware
 */
export default function createHelmetMiddleware(config: NodeServiceConfig): RequestHandler | null {
  const helmetConfig = config.nodeService?.middleware?.helmet

  // If Helmet is disabled, return null
  if (helmetConfig?.enabled === false) {
    return null
  }

  // Create Helmet middleware with configuration
  return helmet({
    contentSecurityPolicy: helmetConfig?.contentSecurityPolicy ?? false,
    crossOriginEmbedderPolicy: helmetConfig?.crossOriginEmbedderPolicy ?? true,
    crossOriginOpenerPolicy: helmetConfig?.crossOriginOpenerPolicy ?? true,
    crossOriginResourcePolicy: helmetConfig?.crossOriginResourcePolicy ?? true,
    dnsPrefetchControl: helmetConfig?.dnsPrefetchControl ?? true,
    frameguard: helmetConfig?.frameguard ?? true,
    hidePoweredBy: helmetConfig?.hidePoweredBy ?? true,
    hsts: helmetConfig?.hsts ?? true,
    ieNoOpen: helmetConfig?.ieNoOpen ?? true,
    noSniff: helmetConfig?.noSniff ?? true,
    originAgentCluster: helmetConfig?.originAgentCluster ?? true,
    permittedCrossDomainPolicies: helmetConfig?.permittedCrossDomainPolicies ?? false,
    referrerPolicy: helmetConfig?.referrerPolicy ?? true,
    xssFilter: helmetConfig?.xssFilter ?? true,
  } as any)
}
