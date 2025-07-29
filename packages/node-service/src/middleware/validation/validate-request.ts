import { Response, NextFunction } from 'express'
import { ZodError, ZodType } from 'zod'
import { ValidationError } from '../../errors/ValidationError.js'
import { EnrichedRequest } from '../../types/express.js'

interface ValidationSchema {
  body?: ZodType<any, any, any>
  query?: ZodType<any, any, any>
  params?: ZodType<any, any, any>
}

interface Options {
  /**
   * If true, the middleware will attempt to coerce string values to their expected types
   * This is useful for query parameters which are always strings
   */
  coerce?: boolean
}

/**
 * Express middleware for request validation using Zod schemas
 *
 * @param schemas - Object containing Zod schemas for body, query, and params
 * @param options - Validation options
 * @returns Express middleware function
 *
 * @example
 * ```ts
 * const schema = {
 *   body: z.object({
 *     name: z.string().min(1),
 *     age: z.number().positive()
 *   })
 * }
 *
 * router.post('/users', validateRequestMiddleware(schema), handler)
 * ```
 */
const validateRequestMiddleware = (schemas: ValidationSchema, options?: Options) => {
  return (req: EnrichedRequest, res: Response, next: NextFunction) => {
    req.validated = {}

    try {
      // Validate body if schema provided
      if (schemas.body) {
        const result = schemas.body.safeParse(req.body)

        if (!result.success) {
          throw new ValidationError(formatZodError(result.error), formatZodErrors(result.error))
        }

        req.validated.body = result.data
      }

      // Validate query if schema provided
      if (schemas.query) {
        // Apply coercion for query parameters if enabled
        const schema = options?.coerce ? schemas.query : schemas.query

        const result = schema.safeParse(req.query)

        if (!result.success) {
          throw new ValidationError(formatZodError(result.error), formatZodErrors(result.error))
        }

        req.validated.query = result.data
      }

      // Validate params if schema provided
      if (schemas.params) {
        const result = schemas.params.safeParse(req.params)

        if (!result.success) {
          throw new ValidationError(formatZodError(result.error), formatZodErrors(result.error))
        }

        req.validated.params = result.data
      }

      next()
    } catch (error) {
      // Pass validation errors to error handler
      if (error instanceof ValidationError) {
        return next(error)
      }

      // Unexpected errors
      next(error)
    }
  }
}

/**
 * Format Zod error into a human-readable message
 */
function formatZodError(error: ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.join('.')
    return path ? `${path}: ${issue.message}` : issue.message
  })

  return issues.join(', ')
}

/**
 * Format Zod errors into a structured object
 */
function formatZodErrors(error: ZodError): Record<string, any> {
  const errors: Record<string, any> = {}

  error.issues.forEach((issue) => {
    const path = issue.path.join('.') || 'general'
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push({
      code: issue.code,
      message: issue.message,
      ...(issue.code === 'invalid_type' && {
        expected: (issue as any).expected,
        received: (issue as any).received,
      }),
    })
  })

  return errors
}

export default validateRequestMiddleware
