import { z } from 'zod'

// TODO: Check and clean up this file

/**
 * Common Zod schemas for request validation
 */

// Common string patterns
export const uuid = z.string().uuid()
export const email = z.string().email()
export const url = z.string().url()
export const datetime = z.string().datetime()
export const date = z.string().date()

// Common number patterns
export const positiveInt = z.number().int().positive()
export const nonNegativeInt = z.number().int().nonnegative()
export const port = z.number().int().min(1).max(65535)

// Common coerced types (useful for query parameters)
export const coercedBoolean = z
  .union([z.boolean(), z.literal('true'), z.literal('false'), z.literal('1'), z.literal('0')])
  .transform((val) => val === true || val === 'true' || val === '1')

export const coercedNumber = z.union([z.number(), z.string()]).transform((val) => {
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) {
    throw new Error('Invalid number')
  }
  return num
})

export const coercedInt = z.union([z.number(), z.string()]).transform((val) => {
  const num = typeof val === 'string' ? parseInt(val, 10) : val
  if (isNaN(num) || !Number.isInteger(num)) {
    throw new Error('Invalid integer')
  }
  return num
})

// Pagination schemas
export const paginationQuery = z
  .object({
    page: coercedInt.optional().default(1),
    limit: coercedInt.optional().default(20),
    offset: coercedInt.optional().default(0),
  })
  .refine(
    (data) => {
      if (data.page && data.page < 1) return false
      if (data.limit && (data.limit < 1 || data.limit > 100)) return false
      if (data.offset && data.offset < 0) return false
      return true
    },
    {
      message: 'Invalid pagination parameters',
    }
  )

// Sorting schemas
export const sortOrder = z
  .enum(['asc', 'desc', 'ASC', 'DESC'])
  .transform((val) => val.toLowerCase())

export const sortQuery = z.object({
  sortBy: z.string().optional(),
  sortOrder: sortOrder.optional(),
})

// Common request schemas
export const idParam = z.object({
  id: uuid,
})

export const slugParam = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
})

// Search query
export const searchQuery = z
  .object({
    q: z.string().min(1).optional(),
    search: z.string().min(1).optional(),
  })
  .refine((data) => !(data.q && data.search), { message: 'Use either "q" or "search", not both' })

// Date range query
export const dateRangeQuery = z
  .object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate)
      }
      return true
    },
    { message: 'Start date must be before or equal to end date' }
  )

// Create a type-safe schema builder
export function createSchema<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape)
}

// Helper to make all fields optional (useful for PATCH requests)
export function partial<T extends z.ZodObject<any>>(schema: T) {
  return schema.partial()
}

// Helper to pick specific fields from a schema
export function pick<T extends z.ZodObject<any>, K extends keyof T['shape']>(schema: T, keys: K[]) {
  const shape = {} as Pick<T['shape'], K>
  keys.forEach((key) => {
    shape[key] = schema.shape[key]
  })
  return z.object(shape)
}

// Helper to omit specific fields from a schema
export function omit<T extends z.ZodObject<any>, K extends keyof T['shape']>(schema: T, keys: K[]) {
  const shape = { ...schema.shape }
  keys.forEach((key) => {
    delete shape[key]
  })
  return z.object(shape)
}
