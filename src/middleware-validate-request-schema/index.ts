import { Response, NextFunction } from 'express'
import { type Schema, ValidationError as JoiValidationError } from 'joi'
import { ValidationError } from '../errors'
import { EnrichedRequest } from '../typings/request'

interface ValidationSchema {
  body?: Schema
  query?: Schema
  params?: Schema
}

const validateRequestSchemaMiddleware =
  (schemas: ValidationSchema) => (req: EnrichedRequest, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const { error } = schemas.body.validate(req.body, { abortEarly: false })

        if (error) {
          throw error
        }
      }

      if (schemas.query) {
        const { error } = schemas.query.validate(req.query, { abortEarly: false })

        if (error) {
          throw error
        }
      }

      if (schemas.params) {
        const { error } = schemas.params.validate(req.params, { abortEarly: false })

        if (error) {
          throw error
        }
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
