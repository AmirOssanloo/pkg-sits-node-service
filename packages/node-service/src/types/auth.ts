import type { JwtPayload } from 'jsonwebtoken'

type JwtAuthStrategy = 'jwt'
type OAuthAuthStrategy = 'oauth'
type ApiKeyAuthStrategy = 'api-key'
type SessionAuthStrategy = 'session'
type AuthStrategy = JwtAuthStrategy | OAuthAuthStrategy | ApiKeyAuthStrategy | SessionAuthStrategy

type AuthProviderGoogle = 'google'
type AuthProviderGithub = 'github'
type AuthProviderFacebook = 'facebook'
type AuthProvider = AuthProviderGoogle | AuthProviderGithub | AuthProviderFacebook

/**
 * Base authenticated identity that all auth strategies must provide
 */
export interface BaseAuthIdentity {
  id: string | number
  type: AuthStrategy
}

/**
 * JWT authenticated identity
 */
export interface JwtAuthIdentity extends BaseAuthIdentity, JwtPayload {
  type: JwtAuthStrategy
  roles?: string[]
  permissions?: string[]
}

/**
 * OAuth authenticated identity (future implementation)
 */
export interface OAuthAuthIdentity extends BaseAuthIdentity {
  type: OAuthAuthStrategy
  provider: AuthProvider
  roles?: string[]
}

/**
 * API Key authenticated identity (future implementation)
 */
export interface ApiKeyAuthIdentity extends BaseAuthIdentity {
  type: ApiKeyAuthStrategy
  scopes?: string[]
}

/**
 * Union type for all possible authenticated identities
 * Add new auth strategies here as needed
 */
export type AuthIdentity = JwtAuthIdentity | OAuthAuthIdentity | ApiKeyAuthIdentity

/**
 * Type guards for checking auth strategy type
 */
export const isJwtAuth = (auth: AuthIdentity): auth is JwtAuthIdentity => {
  return auth.type === 'jwt'
}

export const isOAuthAuth = (auth: AuthIdentity): auth is OAuthAuthIdentity => {
  return auth.type === 'oauth'
}

export const isApiKeyAuth = (auth: AuthIdentity): auth is ApiKeyAuthIdentity => {
  return auth.type === 'api-key'
}
