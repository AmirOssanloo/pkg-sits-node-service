import { Response, NextFunction } from 'express'
import { type Schema, ValidationError as JoiValidationError } from 'joi'
import { ValidationError } from '../errors/ValidationError.js'
import { EnrichedRequest } from '../typings/request.js'

interface ValidationSchema {
  body?: Schema
  query?: Schema
  params?: Schema
}

interface Options {
  coerceBooleans?: boolean
}

const validateRequestSchemaMiddleware =
  (schemas: ValidationSchema, options?: Options) =>
  (req: EnrichedRequest, res: Response, next: NextFunction) => {
    req.validated = {}

    try {
      if (options?.coerceBooleans) {
        Object.entries(req.body).forEach(([key, value]) => {
          if (value === 'true') {
            req.body[key] = true
          } else if (value === 'false') {
            req.body[key] = false
          }
        })
      }

      if (schemas.body) {
        const { error } = schemas.body.validate(req.body, { abortEarly: false })

        if (error) {
          throw error
        }

        req.validated.body = req.body
      }

      if (schemas.query) {
        const { error } = schemas.query.validate(req.query, { abortEarly: false })

        if (error) {
          throw error
        }

        req.validated.query = req.query
      }

      if (schemas.params) {
        const { error } = schemas.params.validate(req.params, { abortEarly: false })

        if (error) {
          throw error
        }

        req.validated.params = req.params
      }

      next()
    } catch (error) {
      if (error instanceof JoiValidationError) {
        throw new ValidationError(error.details[0].message)
      }

      throw error
    }
  }

export default validateRequestSchemaMiddleware
