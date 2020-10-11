import { inject, injectable } from 'tsyringe'
import path from 'path'
import fs from 'fs'

import avatarConfig from '@config/avatar'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  idUser: string
  fileName: string
}

@injectable()
class UpdateAvatarUserService {
  private repository: IUsersRepository

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository
  ) {
    this.repository = repository
  }

  public async execute(data: IRequest): Promise<User> {
    const user = await this.repository.findById(data.idUser)
    if (!user) {
      throw new AppError('You must sign in to update your avatar', 401)
    }

    // If already exist an avatar we delete it
    if (user.avatar) {
      const currentAvatarFilePath = path.join(avatarConfig.directory, user.avatar)
      const currentAvatarExists = await fs.promises.stat(currentAvatarFilePath)

      if (currentAvatarExists) {
        await fs.promises.unlink(currentAvatarFilePath)
      }
    }

    user.avatar = data.fileName
    await this.repository.save(user)

    return user
  }
}

export default UpdateAvatarUserService
