import 'reflect-metadata'

import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import authConfig from '@config/auth'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

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
  private hash: IHashProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('HashProvider')
    hash: IHashProvider
  ) {
    this.repository = repository
    this.hash = hash
  }

  public async execute(payload: IRequest): Promise<IResponse> {
    const error = new AppError('Incorrect e-mail/password combination', 401)

    const user = await this.repository.findByEmail(payload.email)

    if (!user) {
      throw error
    }

    const passwordsMatch = await this.hash.compare(payload.password, user.password)
    if (!passwordsMatch) {
      throw error
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })

    return { user, token }
  }
}

export default AuthenticateUserService

