import User from '@modules/users/infra/database/entities/User'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'

export default interface IUsersRepository {
  findAllProviders(exceptionId?: string): Promise<User[]>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  create(data: ICreateUserDTO): Promise<User>
  save(data: User): Promise<User>
}
