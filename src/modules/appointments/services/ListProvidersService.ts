import { inject, injectable } from 'tsyringe'

import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

@injectable()
class ListProvidersService {
  private repository: IUsersRepository

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository
  ) {
    this.repository = repository
  }

  public async execute(exceptionUserID: string): Promise<User[]> {
   return await this.repository.findAllProviders(exceptionUserID)
  }
}

export default ListProvidersService
