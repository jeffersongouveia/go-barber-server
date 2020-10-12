import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import CreateUserService from '@modules/users/services/CreateUserService'
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService'
import AppError from '@shared/errors/AppError'

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '*123$qwE'
    }

    const user = await createUser.execute(userData)
    const responseAuth = await authenticateUser.execute(userData)

    expect(responseAuth).toHaveProperty('token')
    expect(responseAuth.user).toEqual(user)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '*123$qwE'
    }

    await createUser.execute(userData)
    const responseAuth = authenticateUser.execute({ ...userData, password: '123$qwe' })

    expect(responseAuth).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)

    const userData = {
      email: 'jeff.gouveia@hotmail.com',
      password: '*123$qwE'
    }

    const responseAuth = authenticateUser.execute(userData)

    expect(responseAuth).rejects.toBeInstanceOf(AppError)
  })
})
