import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

interface IRequest {
  idUser: string
  fileName: string
}

@injectable()
class UpdateAvatarUserService {
  private repository: IUsersRepository
  private storage: IStorageProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('StorageProvider')
    storage: IStorageProvider
  ) {
    this.repository = repository
    this.storage = storage
  }

  public async execute(data: IRequest): Promise<User> {
    const user = await this.repository.findById(data.idUser)
    if (!user) {
      throw new AppError('You must sign in to update your avatar', 401)
    }

    // If already exist an avatar we delete it
    if (user.avatar) {
      await this.storage.delete(user.avatar)
    }

    user.avatar = await this.storage.save(data.fileName)
    await this.repository.save(user)

    return user
  }
}

export default UpdateAvatarUserService
