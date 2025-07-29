# Request Type Examples: Old vs New

## Old Implementation (with Joi)

```typescript
import { EnrichedRequest } from '@amirossanloo/node-service'
import type { UseCases } from '../use-cases'
import type { Gateways } from '../gateways'

export type CleanCodeRequest<T = undefined> = EnrichedRequest<T> & {
  gateways: Gateways
  useCases: UseCases
}

import Joi from 'joi'
import type { Response } from 'express'
import type { ErrorResponse, LoginResponse } from '@sits-astra/shared'
import type { CleanCodeRequest } from '../../../../types/app'

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}

const loginUser = async (
  req: CleanCodeRequest<typeof loginSchema>,
  res: Response<LoginResponse | ErrorResponse>
) => {
  const {
    gateways: { LoginGateway },
    validated: {
      body: { email, password },
    },
  } = req

  try {
    const user = await LoginGateway.login(email, password)
    return res.status(200).json(user)
  } catch (error) {
    throw error
  }
}

export default loginUser
```

## New Implementation (with Zod)

```typescript
import { z } from 'zod'
import type { Response } from 'express'
import type { EnrichedRequest, InferValidatedRequest, ValidationSchema } from '@amirossanloo/node-service'

// Define your Zod validation schema
export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
} satisfies ValidationSchema

// Option 1: Using EnrichedRequest with schema type parameter
type LoginRequest = EnrichedRequest<typeof loginSchema> & {
  gateways: Gateways
  useCases: UseCases
}

// Option 2: Using InferValidatedRequest to extract just the validated types
type LoginValidated = InferValidatedRequest<typeof loginSchema>
// This gives you: { body: { email: string; password: string }; query: never; params: never }

// Handler using Option 1 (recommended - full type safety)
const loginUser = async (
  req: LoginRequest,
  res: Response<LoginResponse | ErrorResponse>
) => {
  const {
    gateways: { LoginGateway },
    validated: {
      body: { email, password }, // TypeScript knows this is { email: string; password: string }
    },
  } = req

  try {
    const user = await LoginGateway.login(email, password)
    return res.status(200).json(user)
  } catch (error) {
    throw error
  }
}

// Alternative: Handler using Option 2 (when you need the validated types elsewhere)
const loginUserAlt = async (
  req: EnrichedRequest<typeof loginSchema> & { gateways: Gateways },
  res: Response<LoginResponse | ErrorResponse>
) => {
  // Extract validated data with proper types
  const validatedData: LoginValidated = req.validated
  
  // Now you can pass this around with full type safety
  const result = await processLogin(validatedData, req.gateways)
  return res.status(200).json(result)
}

// Helper function that uses InferValidatedRequest
async function processLogin(
  validated: InferValidatedRequest<typeof loginSchema>,
  gateways: Gateways
): Promise<LoginResponse> {
  // TypeScript knows validated.body has { email: string; password: string }
  const { email, password } = validated.body
  return gateways.LoginGateway.login(email, password)
}

// Example with query and params
export const getUserSchema = {
  params: z.object({
    userId: z.string().uuid()
  }),
  query: z.object({
    includeDetails: z.boolean().optional(),
    fields: z.array(z.string()).optional()
  })
} satisfies ValidationSchema

type GetUserRequest = EnrichedRequest<typeof getUserSchema>

const getUser = async (req: GetUserRequest, res: Response) => {
  // TypeScript knows the exact types:
  const { userId } = req.validated.params // string (uuid)
  const { includeDetails, fields } = req.validated.query // { includeDetails?: boolean; fields?: string[] }
  
  // Use the validated data...
}

// Using InferValidatedRequest in a service layer
class UserService {
  async findUser(validated: InferValidatedRequest<typeof getUserSchema>) {
    // Clean separation - service doesn't need to know about Express Request
    const { userId } = validated.params
    const { includeDetails } = validated.query
    
    // Business logic here...
  }
}

// Usage in route setup
import { validateRequestMiddleware } from '@amirossanloo/node-service'

router.post('/login', validateRequestMiddleware(loginSchema), loginUser)
router.get('/users/:userId', validateRequestMiddleware(getUserSchema), getUser)
```

## Key Differences

### 1. Schema Definition
- **Old**: Uses Joi with method chaining
- **New**: Uses Zod with method chaining + `satisfies ValidationSchema` for type safety

### 2. Type Inference
- **Old**: Joi's TypeScript support required complex type gymnastics
- **New**: Zod has built-in TypeScript inference with `z.infer<typeof schema>`

### 3. InferValidatedRequest Usage
`InferValidatedRequest` is useful when:
- You need to pass validated data to service layers
- You want to extract just the validated types without the full Request object
- You're building reusable functions that work with validated data
- You want to decouple your business logic from Express

### 4. Type Safety Improvements
The new implementation with proper type helpers provides:
- No `any` types in the validated object
- Full IntelliSense support
- Compile-time validation of property access
- Better refactoring support

## Zod Schema Inference Explained

Zod automatically infers TypeScript types from your schemas:

```typescript
const schema = z.object({
  name: z.string(),
  age: z.number().positive(),
  email: z.string().email()
})

// Automatically inferred type:
type User = z.infer<typeof schema>
// Result: { name: string; age: number; email: string }
```

Benefits:
1. **Single Source of Truth**: Define validation once, get types automatically
2. **Always in Sync**: Runtime validation matches compile-time types
3. **Less Code**: No duplicate interface definitions
4. **Better DX**: Auto-completion based on your schemas