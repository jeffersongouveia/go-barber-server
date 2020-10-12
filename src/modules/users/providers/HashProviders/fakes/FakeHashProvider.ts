import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

class FakeHashProvider implements IHashProvider {
  public async generate(payload: string): Promise<string> {
    return payload
  }

  public async compare(payload: string, hash: string): Promise<boolean> {
    return payload === hash
  }
}

export default FakeHashProvider
