import { v4 as uuid } from 'uuid'

import UserToken from '@modules/users/infra/database/entities/UserToken'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

class FakeUserTokenRepository implements IUserTokenRepository {
  private usersTokens: UserToken[] = []

  public async generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    })

    this.usersTokens.push(userToken)
    return Promise.resolve(userToken)
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    return this.usersTokens.find((i) => i.token === token)
  }
}

export default FakeUserTokenRepository
