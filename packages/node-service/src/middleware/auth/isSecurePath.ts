import config from '@sits/configuration'
import { Request } from 'express'

// TODO: We need to remove the console.logs and figure out if we want to have any logging here at all.
// What is a good and secure way of getting observability into authentication without jeopardizing security?
const isSecurePath = (req: Request) => {
  const originalUrl = req.originalUrl || req.path

  // Get paths from core.auth configuration
  const authConfig = config.core?.auth
  const authPaths = authConfig?.paths || []

  // Default ignore paths for health checks
  const ignorePaths = ['/health', '/ping', '/metrics']

  console.log('isSecurePath check:', {
    originalUrl,
    authPaths,
    ignorePaths,
  })

  // First check if the path is in ignore list
  if (ignorePaths.some((path) => originalUrl.startsWith(path))) {
    console.log('Path is in ignore list')
    return false
  }

  // Check if any auth path matches the current URL
  const isSecure = authPaths.some((authPath) => originalUrl.startsWith(authPath.path))

  console.log('Path security check result:', isSecure)
  return isSecure
}

export default isSecurePath
