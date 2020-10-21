import { inject, injectable } from 'tsyringe'

import User from '@modules/users/infra/database/entities/User'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

@injectable()
class ShowProfileService {
  private repository: IUsersRepository

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository
  ) {
    this.repository = repository
  }

  public async execute(userId: string): Promise<User> {
    const user = await this.repository.findById(userId)

    if (!user) {
      throw new AppError('User not found')
    }

    return user
  }
}

export default ShowProfileService
