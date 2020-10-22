import { v4 as uuid } from 'uuid'

import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = []

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User()
    Object.assign(user, { id: uuid(), ...data})
    this.users.push(user)
    return user
  }

  public async save(data: User): Promise<User> {
    const index = this.users.findIndex((user) => user.id === data.id)
    this.users[index] = data
    return data
  }

  public async findAllProviders(exceptionId?: string): Promise<User[]> {
    if (exceptionId) {
      return this.users.filter((user) => user.id !== exceptionId)
    }

    return this.users
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id)
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }
}

export default FakeUsersRepository
