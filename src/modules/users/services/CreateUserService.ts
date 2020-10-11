import { inject, injectable } from 'tsyringe'
import bcrypt from 'bcrypt'

import User from '@modules/users/infra/database/entities/User'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  private repository: IUsersRepository

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository
  ) {
    this.repository = repository
  }

  public async execute(data: IRequest): Promise<User> {
    const userExist = await this.repository.findByEmail(data.email)

    if (userExist) {
      throw new AppError('E-mail already used')
    }

    const hashPassword = await bcrypt.hash(data.password, 8)

    return await this.repository.create({
      ...data,
      password: hashPassword,
    })
  }
}

export default CreateUserService
