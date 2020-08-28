import { getRepository } from 'typeorm/index'
import bcrypt from 'bcrypt'

import User from '../models/User'

interface Request {
  name: string
  email: string
  password: string
}

class CreateUserService {
  public async execute(data: Request): Promise<User> {
    const repository = getRepository(User)

    const userExist = await repository.findOne({
      where: {
        email: data.email,
      },
    })

    if (userExist) {
      throw Error('E-mail already used')
    }

    const hashPassword = await bcrypt.hash(data.password, 8)

    const user = repository.create({
      ...data,
      password: hashPassword,
    })
    await repository.save(user)

    return user
  }
}

export default CreateUserService
