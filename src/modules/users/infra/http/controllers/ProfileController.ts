import { Request, Response } from 'express'
import { container } from 'tsyringe'

import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import ShowProfileService from '@modules/users/services/ShowProfileService'

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showProfile = container.resolve(ShowProfileService)
    const user = await showProfile.execute(request.user.id)

    // @ts-ignore
    delete user.password

    return response.json(user)
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateProfile = container.resolve(UpdateProfileService)
    const user = await updateProfile.execute(request.body)

    // @ts-ignore
    delete user.password

    return response.json(user)
  }
}

export default ProfileController
