import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService'

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateAvatarUserService)
    const user = await updateUserAvatar.execute({
      idUser: request.user.id,
      fileName: request.file.filename,
    })

    return response.json(classToClass(user))
  }
}
