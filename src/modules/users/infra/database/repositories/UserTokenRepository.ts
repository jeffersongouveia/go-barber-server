import { getRepository, Repository } from 'typeorm'

import UserToken from '@modules/users/infra/database/entities/UserToken'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>

  constructor() {
    this.repository = getRepository(UserToken)
  }

  public async generate(userId: string): Promise<UserToken> {
    const userToken = this.repository.create({ user_id: userId })
    await this.repository.save(userToken)
    return userToken
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return await this.repository.findOne({
      where: { token },
    })
  }
}

export default UserTokenRepository
