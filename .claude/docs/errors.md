# Errors Package Documentation

## Overview

The `errors` package (planned) will provide a standardized error handling system for Node.js services. Currently, error handling is scattered throughout the `node-service` package but will be consolidated into a dedicated package.

## Current Implementation

Error handling currently exists in:
- `packages/node-service/errors/index.ts` - Basic error definitions
- `packages/node-service/middleware-global-error-handler/` - Express error middleware

## Planned Architecture

### Error Class Hierarchy

```typescript
// Base error class
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>
  
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = {}
    Error.captureStackTrace(this, this.constructor)
  }
}

// Specific error types
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true)
    this.context = context
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, true)
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, true)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, true)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, true)
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error', isOperational = false) {
    super(message, 500, isOperational)
  }
}
```

## Error Handling Patterns

### 1. Operational vs Programming Errors

**Operational Errors** (Expected):
- Invalid user input
- Failed API calls
- Database connection issues
- File not found

**Programming Errors** (Bugs):
- Type errors
- Reference errors
- Logic errors
- Memory leaks

### 2. Error Context

Errors should carry context for debugging:

```typescript
throw new ValidationError('Invalid email format', {
  field: 'email',
  value: userInput.email,
  expected: 'valid email address'
})
```

### 3. Error Serialization

Consistent error response format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "statusCode": 400,
    "context": {
      "field": "email",
      "expected": "valid email address"
    },
    "timestamp": "2023-01-01T00:00:00Z",
    "correlationId": "abc-123"
  }
}
```

## Middleware Integration

### Global Error Handler

```typescript
export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Log error
  logger.error('Request failed', {
    error,
    url: request.url,
    method: request.method,
    correlationId: request.id
  })

  // Handle known errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.constructor.name,
        message: error.message,
        statusCode: error.statusCode,
        context: error.context,
        timestamp: new Date().toISOString(),
        correlationId: request.id
      }
    })
  }

  // Handle unknown errors
  const isProd = process.env.NODE_ENV === 'production'
  return reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: isProd ? 'Internal server error' : error.message,
      statusCode: 500,
      timestamp: new Date().toISOString(),
      correlationId: request.id,
      ...(isProd ? {} : { stack: error.stack })
    }
  })
}
```

## Error Recovery Strategies

### 1. Graceful Degradation
- Fallback to cached data
- Return partial results
- Use default values

### 2. Circuit Breaker Pattern
- Prevent cascading failures
- Auto-recovery after timeout
- Health check integration

### 3. Retry Logic
- Exponential backoff
- Maximum retry limits
- Idempotency checks

## Monitoring & Alerting

### Error Tracking
- Structured logging
- Error rate metrics
- Performance impact
- User impact assessment

### Integration Points
- Sentry/Rollbar integration
- CloudWatch/Datadog metrics
- Slack/PagerDuty alerts
- Error analytics dashboard

## Testing Error Scenarios

### Unit Tests
```typescript
describe('ValidationError', () => {
  it('should have correct status code', () => {
    const error = new ValidationError('Invalid input')
    expect(error.statusCode).toBe(400)
    expect(error.isOperational).toBe(true)
  })
})
```

### Integration Tests
- Test error middleware
- Verify error responses
- Check logging output
- Validate error recovery

## Best Practices

1. **Fail Fast**: Detect errors early in the request lifecycle
2. **Be Specific**: Use appropriate error types and messages
3. **Add Context**: Include relevant debugging information
4. **Log Appropriately**: Different log levels for different errors
5. **Don't Leak**: Hide sensitive information in production
6. **Monitor Everything**: Track error rates and patterns
7. **Document Errors**: List possible errors in API documentation

## Future Enhancements

1. **Error Code System**: Unique codes for each error scenario
2. **Multi-language Support**: Localized error messages
3. **Error Budgets**: SLO-based error tracking
4. **Smart Retries**: ML-based retry strategies
5. **Error Correlation**: Link related errors across services