import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import auth from '../config/auth'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.headers.authorization
  if (!authorization) {
    throw new Error('JWT token is missing')
  }

  const [, token] = authorization.split(' ')

  try {
    const decoded = verify(token, auth.jwt.secret)
    const { sub } = decoded as TokenPayload

    request.user = {
      id: sub,
    }

    return next()
  } catch {
    throw new Error('Invalid JWT token')
  }
}
