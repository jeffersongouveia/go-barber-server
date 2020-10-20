import { inject, injectable } from 'tsyringe'
import { addHours, isAfter } from 'date-fns'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

interface IRequest {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  private repository: IUsersRepository
  private userToken: IUserTokenRepository
  private hash: IHashProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('UserTokenRepository')
    userToken: IUserTokenRepository,

    @inject('HashProvider')
    hash: IHashProvider
  ) {
    this.repository = repository
    this.userToken = userToken
    this.hash = hash
  }

  public async execute(data: IRequest): Promise<void> {
    const userToken = await this.userToken.findByToken(data.token)
    if (!userToken) {
      throw new AppError('User token does not exist')
    }

    const user = await this.repository.findById(userToken.user_id)
    if (!user) {
      throw new AppError('User does not exist')
    }

    const compareDate = addHours(userToken.created_at, 2)
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired')
    }

    user.password = await this.hash.generate(data.password)
    await this.repository.save(user)
  }
}

export default ResetPasswordService
