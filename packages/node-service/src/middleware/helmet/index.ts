import type { RequestHandler } from 'express'
import helmet from 'helmet'
import type { UserConfig } from '@sits/configuration'

// TODO: Check and clean up this file

/**
 * Creates and configures Helmet security middleware
 */
const createHelmetMiddleware = (config: UserConfig): RequestHandler => {
  const helmetConfig = config.middleware?.helmet

  // If Helmet is disabled, return null
  if (helmetConfig?.enabled === false) {
    return (_, __, next) => next()
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

export default createHelmetMiddleware
