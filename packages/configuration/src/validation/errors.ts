import { ZodError } from 'zod'

/**
 * Formatted validation issue
 */
export interface ValidationIssue {
  path: string
  message: string
  code: string
}

/**
 * Custom error class for configuration validation errors
 */
export class ConfigValidationError extends Error {
  public readonly zodError: ZodError
  public readonly issues: ValidationIssue[]
  
  constructor(zodError: ZodError) {
    const issues = formatZodIssues(zodError)
    const message = formatValidationMessage(issues)
    
    super(message)
    this.name = 'ConfigValidationError'
    this.zodError = zodError
    this.issues = issues
  }
}

/**
 * Formats Zod issues into a more readable format
 */
function formatZodIssues(error: ZodError): ValidationIssue[] {
  return error.issues.map(issue => ({
    path: issue.path.join('.') || 'root',
    message: issue.message,
    code: issue.code
  }))
}

/**
 * Creates a formatted error message from validation issues
 */
function formatValidationMessage(issues: ValidationIssue[]): string {
  const header = 'Configuration validation failed:'
  const issueLines = issues.map(issue => 
    `  - ${issue.path}: ${issue.message}`
  )
  
  return [header, ...issueLines].join('\n')
}