import { getRepository } from 'typeorm'
import path from 'path'
import fs from 'fs'

import AppError from '../errors/AppError'
import User from '../models/User'
import avatarConfig from '../config/avatar'

interface Request {
  idUser: string
  fileName: string
}

class UpdateAvatarUserService {
  public async execute(data: Request): Promise<User> {
    const repository = getRepository(User)

    const user = await repository.findOne(data.idUser)
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
    await repository.save(user)

    return user
  }
}

export default UpdateAvatarUserService
