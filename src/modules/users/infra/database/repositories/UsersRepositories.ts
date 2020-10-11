import { Repository, getRepository } from 'typeorm'

import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

class UsersRepositories implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = getRepository(User)
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.repository.create(data)
    return await this.save(user)
  }

  public async save(data: User): Promise<User> {
    return await this.repository.save(data)
  }

  public async findById(id: string): Promise<User | undefined> {
    return await this.repository.findOne(id)
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findOne({
      where: { email }
    })
  }
}

export default UsersRepositories
