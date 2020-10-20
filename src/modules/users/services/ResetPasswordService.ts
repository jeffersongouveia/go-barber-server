import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

interface IRequest {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  private repository: IUsersRepository
  private userToken: IUserTokenRepository

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('UserTokenRepository')
    userToken: IUserTokenRepository
  ) {
    this.repository = repository
    this.userToken = userToken
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

    user.password = data.password
    await this.repository.save(user)
  }
}

export default ResetPasswordService
