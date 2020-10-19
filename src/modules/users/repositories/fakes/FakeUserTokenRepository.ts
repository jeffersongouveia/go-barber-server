import { v4 as uuid } from 'uuid'

import UserToken from '@modules/users/infra/database/entities/UserToken'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

class FakeUserTokenRepository implements IUserTokenRepository {
  private usersTokens: UserToken[] = []

  generate(userId: string): Promise<UserToken> {
    const userToken = new UserToken()

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      userId,
    })

    this.usersTokens.push(userToken)
    return Promise.resolve(userToken)
  }
}

export default FakeUserTokenRepository
