import { Request } from 'express'
import { path, pathOr } from 'ramda'
import config from '@sits/configuration'

const isSecurePath = (req: Request) => {
  const originalUrl = path(['originalUrl'], req)
  const securePaths = pathOr([], ['sns', 'auth', 'jwt', 'securePaths'], config)
  const excludedPaths = pathOr([], ['sns', 'auth', 'jwt', 'excludedPaths'], config)

  // First check if the path matches any secure paths
  const isSecure = securePaths.some((path) => originalUrl.startsWith(path))

  // Then check if it's specifically excluded
  if (isSecure && excludedPaths.some((path) => originalUrl.startsWith(path))) {
    return false
  }

  return isSecure
}

export default isSecurePath
