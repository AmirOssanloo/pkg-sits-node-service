import type { Request } from 'express'
import type { ZodType } from 'zod'
import type { Logger } from '../utils/logger.js'

export interface ValidationSchema {
  body?: ZodType<any, any, any>
  query?: ZodType<any, any, any>
  params?: ZodType<any, any, any>
}

export interface RequestContext {
  [key: string]: any
}

type InferBody<T> = T extends { body: ZodType<infer U, any, any> } ? { body: U } : {}
type InferQuery<T> = T extends { query: ZodType<infer U, any, any> } ? { query: U } : {}
type InferParams<T> = T extends { params: ZodType<infer U, any, any> } ? { params: U } : {}

export interface EnrichedRequest<Schema extends ValidationSchema = {}> extends Request {
  correlation_id: string
  context: RequestContext
  logger: Logger
  validated: InferBody<Schema> & InferQuery<Schema> & InferParams<Schema>
  user?: any
}

// Type helper to extract the inferred type from a Zod schema
// This is used when you need to get the TypeScript type that a Zod schema represents
export type InferZodSchema<T> = T extends ZodType<infer U, any, any> ? U : never

// Helper to get the full validated request type from a ValidationSchema
// Useful for extracting types in handlers without repeating the inference logic
export type InferValidatedRequest<T extends ValidationSchema> = {
  body: T['body'] extends ZodType<infer U, any, any> ? U : never
  query: T['query'] extends ZodType<infer U, any, any> ? U : never
  params: T['params'] extends ZodType<infer U, any, any> ? U : never
}
