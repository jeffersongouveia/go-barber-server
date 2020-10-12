import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  private repository: IUsersRepository
  private hash: IHashProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('HashProvider')
    hash: IHashProvider
  ) {
    this.repository = repository
    this.hash = hash
  }

  public async execute(data: IRequest): Promise<User> {
    const userExist = await this.repository.findByEmail(data.email)

    if (userExist) {
      throw new AppError('E-mail already used')
    }

    const hashPassword = await this.hash.generate(data.password)

    return await this.repository.create({
      ...data,
      password: hashPassword,
    })
  }
}

export default CreateUserService
