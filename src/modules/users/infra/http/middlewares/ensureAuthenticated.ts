import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import AppError from '@shared/errors/AppError'
import auth from '@config/auth'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {
  const authorization = request.headers.authorization
  if (!authorization) {
    throw new AppError('JWT token is missing', 401)
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
    throw new AppError('Invalid JWT token', 401)
  }
}
