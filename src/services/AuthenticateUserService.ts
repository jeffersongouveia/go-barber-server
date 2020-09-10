import { getRepository } from 'typeorm'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

import AppError from '../errors/AppError'
import User from '../models/User'
import auth from '../config/auth'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
  token: string
}

class AuthenticateUserService {
  public async execute(payload: Request): Promise<Response> {
    const repository = getRepository(User)
    const error = new AppError('Incorrect e-mail/password combination', 401)

    const user = await repository.findOne({
      where: {
        email: payload.email,
      },
    })

    if (!user) {
      throw error
    }

    const passwordsMatch = await compare(payload.password, user.password)
    if (!passwordsMatch) {
      throw error
    }

    const token = sign({}, auth.jwt.secret, {
      subject: user.id,
      expiresIn: auth.jwt.expiresIn,
    })

    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService

