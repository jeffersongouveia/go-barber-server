import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import ShowHairStylistProfile from '@modules/users/services/ShowHairStylistProfile'
import UpdateHairStylistProfile from '@modules/users/services/UpdateHairStylistProfile'

class HairStylistController {
  public async index(request: Request, response: Response): Promise<Response> {
    const showProfile = container.resolve(ShowHairStylistProfile)
    const hairStylistProfile = await showProfile.execute(request.user.id)

    return response.json(classToClass(hairStylistProfile))
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateHairStylist = container.resolve(UpdateHairStylistProfile)
    await updateHairStylist.execute({
      user_id: request.user.id,
      ...request.body,
    })

    return response.status(201).send()
  }
}

export default HairStylistController
