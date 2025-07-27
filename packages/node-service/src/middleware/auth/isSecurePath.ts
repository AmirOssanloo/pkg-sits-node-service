import config from '@sits/configuration'
import { Request } from 'express'

const isSecurePath = (req: Request) => {
  const originalUrl = req.originalUrl || req.path

  // Get paths from core.auth configuration
  const authConfig = config.core?.auth
  const authPaths = authConfig?.paths || []

  // Default ignore paths - these don't require authentication
  const ignorePaths = ['/health', '/ping', '/metrics']

  // First check if the path is in ignore list
  if (ignorePaths.some((path) => originalUrl.startsWith(path))) {
    return false
  }

  // Check if any auth path matches the current URL (using wildcard matching)
  const isSecure = authPaths.some((strategyPath) => {
    const pattern = strategyPath.path.replace(/\*/g, '.*')
    return new RegExp(`^${pattern}`).test(originalUrl)
  })

  return isSecure
}

export default isSecurePath
