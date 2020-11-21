import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import HairStylist from '@modules/users/infra/database/entities/HairStylist'

import IHairStylistRepository from '@modules/users/repositories/IHairStylistRepository'

@injectable()
class ShowHairStylistProfile {
  private repository: IHairStylistRepository

  constructor(
    @inject('HairStylistRepository')
    repository: IHairStylistRepository,
  ) {
    this.repository = repository
  }

  public async execute(userId: string): Promise<HairStylist> {
    const hairStylistProfile = await this.repository.findById(userId)

    if (!hairStylistProfile) {
      throw new AppError('This user haven\'t a hair stylist profile')
    }

    return hairStylistProfile
  }
}

export default ShowHairStylistProfile
