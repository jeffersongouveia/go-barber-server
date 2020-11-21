import HairStylist from '@modules/users/infra/database/entities/HairStylist'

import IHairStylistProfile from '@modules/users/dtos/IHairStylistProfile'

export default interface IHairStylistRepository {
  findById(userId: string): Promise<HairStylist | undefined>
  update(data: IHairStylistProfile): Promise<HairStylist>
}
