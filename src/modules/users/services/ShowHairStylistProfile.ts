import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IHairStylistRepository from '@modules/users/repositories/IHairStylistRepository'
import IHairStylistProfile from '@modules/users/dtos/IHairStylistProfile'

@injectable()
class ShowHairStylistProfile {
  private repository: IHairStylistRepository

  constructor(
    @inject('HairStylistRepository')
    repository: IHairStylistRepository,
  ) {
    this.repository = repository
  }

  public async execute(userId: string): Promise<IHairStylistProfile> {
    const hairStylist = await this.repository.findById(userId)

    if (!hairStylist) {
      throw new AppError('This user haven\'t a hair stylist profile')
    }

    const profile: IHairStylistProfile = {
      user_id: hairStylist.user_id,

      // Here we remove the seconds, we don't need them
      hour_start: hairStylist.hour_start.slice(0, -3),
      hour_stop: hairStylist.hour_stop.slice(0, -3),

      days_available: [],
    }

    const keysWorksDays = Object.keys(hairStylist).filter((key) => key.startsWith('works_'))
    keysWorksDays.forEach((key) => {
      // @ts-ignore
      if (hairStylist[key]) {
        const dayAvailable = key.replace('works_', '')
        profile.days_available.push(dayAvailable)
      }
    })

    return profile
  }
}

export default ShowHairStylistProfile
