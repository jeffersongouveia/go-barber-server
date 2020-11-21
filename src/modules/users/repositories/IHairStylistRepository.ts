import HairStylist from '@modules/users/infra/database/entities/HairStylist'

import IUpdateHairStylistProfile from '@modules/users/dtos/IUpdateHairStylistProfile'

export default interface IHairStylistRepository {
  findById(userId: string): Promise<HairStylist | undefined>
  update(data: IUpdateHairStylistProfile): Promise<HairStylist>
}
