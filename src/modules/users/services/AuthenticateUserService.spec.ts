import AppError from '@shared/errors/AppError'
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)
  })

  it('should be able to authenticate', async () => {
    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '*123$qwE'
    }

    const user = await fakeUsersRepository.create(userData)
    const responseAuth = await authenticateUser.execute(userData)

    expect(responseAuth).toHaveProperty('token')
    expect(responseAuth.user).toEqual(user)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '*123$qwE'
    }

    await fakeUsersRepository.create(userData)
    const responseAuth = authenticateUser.execute({ ...userData, password: '123$qwe' })

    await expect(responseAuth).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with non existing user', async () => {
    const userData = {
      email: 'jeff.gouveia@hotmail.com',
      password: '*123$qwE'
    }

    const responseAuth = authenticateUser.execute(userData)
    await expect(responseAuth).rejects.toBeInstanceOf(AppError)
  })
})
