import { Request, Response } from 'express'
import { container } from 'tsyringe'

import UpdateHairStylistProfile from '@modules/users/services/UpdateHairStylistProfile'

class HairStylistController {
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
