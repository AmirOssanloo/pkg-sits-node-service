import Joi from 'joi'
import type { EnrichedRequest } from '../typings/request'
import { Logger } from '../utils/logger'

export interface RequestContext {
  [key: string]: any
}

type BodyOf<T> = T extends { body: Joi.ObjectSchema<infer U> }
  ? { body: U }
  : Record<string, unknown>

type QueryOf<T> = T extends { query: Joi.ObjectSchema<infer U> }
  ? { query: U }
  : Record<string, unknown>

type ParamsOf<T> = T extends { params: Joi.ObjectSchema<infer U> }
  ? { params: U }
  : Record<string, unknown>

export interface EnrichedRequest<Schema = undefined> extends Request {
  correlation_id: string
  context: RequestContext
  logger: Logger
  validated: BodyOf<Schema> & QueryOf<Schema> & ParamsOf<Schema>
}
