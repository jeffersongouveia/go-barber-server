import { inject, injectable } from 'tsyringe'

import User from '@modules/users/infra/database/entities/User'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

interface IRequest {
  userId: string
  name: string
  email: string
  oldPassword?: string
  password?: string
}

@injectable()
class UpdateProfileService {
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

  public async execute(data: IRequest): Promise<User> {
    const user = await this.repository.findById(data.userId)

    if (!user) {
      throw new AppError('User not found')
    }

    const userWithSameEmail = await this.repository.findByEmail(data.email)
    if (userWithSameEmail && userWithSameEmail.id !== data.userId) {
      throw new AppError('This e-mail is already in use')
    }

    user.name = data.name
    user.email = data.email

    if (data.password && !data.oldPassword) {
      throw new AppError('You need inform the old password to set a new one')
    }

    if (data.password && data.oldPassword) {
      const oldPasswordMatch = await this.hash.compare(data.oldPassword, user.password)
      if (!oldPasswordMatch) {
        throw new AppError('Wrong old password')
      }

      user.password = await this.hash.generate(data.password)
    }

    return this.repository.save(user)
  }
}

export default UpdateProfileService
