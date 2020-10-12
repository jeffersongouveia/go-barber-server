import { compare, hash } from 'bcrypt'

import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

class BCryptHashProvider implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return hash(payload, 8)
  }

  public async compare(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash)
  }
}

export default BCryptHashProvider
