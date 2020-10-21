import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import ShowProfileService from '@modules/users/services/ShowProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let showProfile: ShowProfileService

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfile = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to show profile', async () => {
    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123qwe',
    }

    const user = await fakeUsersRepository.create(userData)
    const profile = await showProfile.execute(user.id)

    expect(profile.name).toBe(userData.name)
    expect(profile.email).toBe(userData.email)
  })

  it('should not be able to show profile of non-existent user', async () => {
    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123qwe',
    }

    await fakeUsersRepository.create(userData)
    const response = showProfile.execute('non-existent-id')

    await expect(response).rejects.toBeInstanceOf(AppError)
  })
})
