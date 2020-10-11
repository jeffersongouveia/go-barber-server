import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import auth from '@config/auth'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

@injectable()
class AuthenticateUserService {
  private repository: IUsersRepository

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository
  ) {
    this.repository = repository
  }

  public async execute(payload: IRequest): Promise<IResponse> {
    const error = new AppError('Incorrect e-mail/password combination', 401)

    const user = await this.repository.findByEmail(payload.email)

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

