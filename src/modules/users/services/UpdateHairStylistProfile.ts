import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IHairStylistRepository from '@modules/users/repositories/IHairStylistRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  user_id: string
  hour_start: string
  hour_stop: string
  days_available: string[]
}

@injectable()
class UpdateHairStylistProfile {
  private hairStylistRepository: IHairStylistRepository
  private userRepository: IUsersRepository

  constructor(
    @inject('HairStylistRepository')
    hairStylistRepository: IHairStylistRepository,

    @inject('UsersRepository')
    userRepository: IUsersRepository
  ) {
    this.hairStylistRepository = hairStylistRepository
    this.userRepository = userRepository
  }

  public async execute(data: IRequest): Promise<void> {
    const user = await this.userRepository.findById(data.user_id)
    if (!user) {
      throw new AppError('User not found')
    }

    // Valid hour format 24h with zero left or non
    const re = new RegExp(/^([01]?\d|2[0-4]):([0-5]\d)?$/)
    const isHoursValid = re.test(data.hour_start) && re.test(data.hour_stop)
    if (!isHoursValid) {
      throw new AppError('Invalid hours')
    }

    const daysAvailableEmpty = data.days_available.length === 0
    if (daysAvailableEmpty) {
      throw new AppError('You need inform at least one day available')
    }

    await this.hairStylistRepository.update(data)
  }
}

export default UpdateHairStylistProfile
