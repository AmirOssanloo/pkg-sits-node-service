import { Response, NextFunction } from 'express'
import Joi, { type Schema } from 'joi'
import { ValidationError } from '../errors'
import { EnrichedRequest } from '../typings/request'

const validateRequestSchemaMiddleware =
  (schema: Schema) => (req: EnrichedRequest, res: Response, next: NextFunction) => {
    const { error } = Joi.object(schema).validate({ query: req.query })

    if (error) {
      throw new ValidationError(error.details[0].message)
    }

    next()
  }

export default validateRequestSchemaMiddleware
