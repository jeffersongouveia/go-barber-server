import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  private repository: IUsersRepository
  private hash: IHashProvider
  private cache: ICacheProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('HashProvider')
    hash: IHashProvider,

    @inject('CacheProvider')
    cache: ICacheProvider
  ) {
    this.repository = repository
    this.hash = hash
    this.cache = cache
  }

  public async execute(data: IRequest): Promise<User> {
    const userExist = await this.repository.findByEmail(data.email)

    if (userExist) {
      throw new AppError('E-mail already used')
    }

    const hashPassword = await this.hash.generate(data.password)
    const user = await this.repository.create({
      ...data,
      password: hashPassword,
    })

    await this.cache.invalidatePrefix('providers-list')

    return user
  }
}

export default CreateUserService
