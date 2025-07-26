# Migration Guide: Joi to Zod

This guide helps you migrate from Joi validation to Zod validation in the node-service package.

## Why Migrate?

- **Consistency**: The configuration package uses Zod, so using Zod across all packages provides consistency
- **TypeScript**: Zod provides better TypeScript inference and type safety
- **Performance**: Zod is generally faster than Joi
- **Bundle Size**: Zod has a smaller bundle size

## Basic Migration Examples

### Simple Object Validation

**Joi:**
```typescript
import Joi from 'joi'
import { validateRequestSchemaMiddleware } from '@sits/node-service'

const schema = {
  body: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().positive().required(),
    email: Joi.string().email().required()
  })
}

router.post('/users', validateRequestSchemaMiddleware(schema), handler)
```

**Zod:**
```typescript
import { z } from 'zod'
import { validateRequestMiddleware } from '@sits/node-service'

const schema = {
  body: z.object({
    name: z.string().min(1),
    age: z.number().positive(),
    email: z.string().email()
  })
}

router.post('/users', validateRequestMiddleware(schema), handler)
```

### Query Parameter Validation with Coercion

**Joi:**
```typescript
const schema = {
  query: Joi.object({
    page: Joi.number().positive().default(1),
    limit: Joi.number().positive().max(100).default(20),
    active: Joi.boolean()
  })
}

// Manual boolean coercion needed
validateRequestSchemaMiddleware(schema, { coerceBooleans: true })
```

**Zod:**
```typescript
import { coercedInt, coercedBoolean } from '@sits/node-service'

const schema = {
  query: z.object({
    page: coercedInt.positive().default(1),
    limit: coercedInt.positive().max(100).default(20),
    active: coercedBoolean
  })
}

validateRequestMiddleware(schema)
```

### Validation with Custom Messages

**Joi:**
```typescript
const schema = {
  body: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must only contain alphanumeric characters',
        'string.min': 'Username must be at least 3 characters long'
      })
  })
}
```

**Zod:**
```typescript
const schema = {
  body: z.object({
    username: z.string()
      .min(3, 'Username must be at least 3 characters long')
      .max(30)
      .regex(/^[a-zA-Z0-9]+$/, 'Username must only contain alphanumeric characters')
  })
}
```

### Common Patterns

#### UUID Validation

**Joi:**
```typescript
id: Joi.string().uuid()
```

**Zod:**
```typescript
import { uuid } from '@sits/node-service'
id: uuid
```

#### Optional Fields

**Joi:**
```typescript
description: Joi.string().optional()
```

**Zod:**
```typescript
description: z.string().optional()
```

#### Enum Validation

**Joi:**
```typescript
status: Joi.string().valid('active', 'inactive', 'pending')
```

**Zod:**
```typescript
status: z.enum(['active', 'inactive', 'pending'])
```

#### Array Validation

**Joi:**
```typescript
tags: Joi.array().items(Joi.string()).min(1).max(10)
```

**Zod:**
```typescript
tags: z.array(z.string()).min(1).max(10)
```

#### Nested Objects

**Joi:**
```typescript
address: Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  zipCode: Joi.string().pattern(/^\d{5}$/)
})
```

**Zod:**
```typescript
address: z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().regex(/^\d{5}$/)
})
```

### Using Pre-built Schemas

The node-service package now exports common schemas:

```typescript
import {
  uuid,
  email,
  paginationQuery,
  sortQuery,
  searchQuery,
  dateRangeQuery,
  idParam
} from '@sits/node-service'

// Use in validation
const schema = {
  params: idParam,  // Validates { id: uuid }
  query: paginationQuery.merge(sortQuery).merge(searchQuery)
}
```

### Advanced Patterns

#### Conditional Validation

**Joi:**
```typescript
const schema = Joi.object({
  type: Joi.string().valid('personal', 'business').required(),
  taxId: Joi.when('type', {
    is: 'business',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  })
})
```

**Zod:**
```typescript
const schema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('personal')
  }),
  z.object({
    type: z.literal('business'),
    taxId: z.string().min(1)
  })
])
```

#### Custom Validation

**Joi:**
```typescript
password: Joi.string().custom((value, helpers) => {
  if (value.length < 8) {
    return helpers.error('password.tooShort')
  }
  return value
})
```

**Zod:**
```typescript
password: z.string().refine(
  (val) => val.length >= 8,
  { message: 'Password must be at least 8 characters long' }
)
```

## Type Safety Benefits

With Zod, you get automatic TypeScript types:

```typescript
// Define schema
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email()
})

// Infer the type
type User = z.infer<typeof userSchema>
// User is automatically typed as:
// {
//   name: string
//   age: number
//   email: string
// }

// Use in request handler
router.post('/users', validateRequestMiddleware({ body: userSchema }), (req, res) => {
  // req.validated.body is typed as User
  const user: User = req.validated.body
})
```

## Gradual Migration

Both `validateRequestSchemaMiddleware` (Joi) and `validateRequestMiddleware` (Zod) are available during the transition period. You can migrate route by route:

1. Keep existing Joi validation working
2. Write new routes with Zod
3. Gradually update old routes
4. Remove Joi dependency once complete

## Common Gotchas

1. **Required by default**: In Joi, fields are optional by default. In Zod, they're required by default. Use `.optional()` explicitly.

2. **String length**: Joi's `.required()` allows empty strings. Zod's default doesn't. Use `.min(1)` for non-empty strings.

3. **Number coercion**: Query parameters are strings. Use the provided `coercedNumber` or `coercedInt` schemas.

4. **Error format**: Zod errors have a different structure. The middleware handles this, but custom error handling may need updates.