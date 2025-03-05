import jwt from 'jsonwebtoken'
import { user } from '../../fixtures'
import config from '../../src/config'

function createToken(payload: Record<string, any>, secret: string): string {
  return jwt.sign(payload, secret)
}

const payload = { ...user }
const secret = config.env.JWT_SECRET
const token = createToken(payload, secret)

console.log(token)
