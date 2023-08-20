import { ValidationError } from '../errors'

const errorFactory = (errorRegistry) => {
  const errorMessages = Object.entries(errorRegistry).map(([key, error]) => {
    return `${key}: ${error.message}`
  })

  return new ValidationError(errorMessages.join('; '))
}

const validateSchema = (req) => (acc, curr) => {
  const [key, schema] = curr

  const { error, value } = schema.validate(req[key], {
    stripUnknown: { arrays: false, objects: true },
  })

  if (error) {
    acc.errors[key] = error
  } else {
    acc.validated[key] = value
  }

  return acc
}

const initialState = () => {
  return { errors: {}, validated: {} }
}

const validateRequestSchema = (schema) => (req, res, next) => {
  const result = Object.entries(schema).reduce(validateSchema(req), initialState())

  if (Object.keys(result.errors).length > 0) {
    throw errorFactory(result.errors)
  }

  req.validated = result.validated

  next()
}

module.exports = validateRequestSchema
