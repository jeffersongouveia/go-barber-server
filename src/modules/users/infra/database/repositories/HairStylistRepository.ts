import { getRepository, Repository } from 'typeorm'

import HairStylist from '@modules/users/infra/database/entities/HairStylist'

import IHairStylistRepository from '@modules/users/repositories/IHairStylistRepository'
import IUpdateHairStylistProfile from '@modules/users/dtos/IUpdateHairStylistProfile'

class HairStylistRepository implements IHairStylistRepository {
  private repository: Repository<HairStylist>

  constructor() {
    this.repository = getRepository(HairStylist)
  }

  async findById(userId: string): Promise<HairStylist | undefined> {
    const profile = await this.repository.findOne({
      where: { user_id: userId },
    })

    return profile
  }

  async update(data: IUpdateHairStylistProfile): Promise<HairStylist> {
    let hairStylistProfile = await this.repository.findOne({
      where: { user_id: data.user_id },
    })

    if (!hairStylistProfile) {
      hairStylistProfile = this.repository.create(data)
    }

    hairStylistProfile.hour_start = data.hour_start
    hairStylistProfile.hour_stop = data.hour_stop

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    daysOfWeek.forEach((day) => {
      const key = `works_${day}`
      // @ts-ignore
      hairStylistProfile[key] = data.days_available.includes(day)
    })

    return this.repository.save(hairStylistProfile)
  }
}

export default HairStylistRepository
