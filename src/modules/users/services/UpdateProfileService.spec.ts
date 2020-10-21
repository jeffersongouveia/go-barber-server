import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import UpdateProfileService from '@modules/users/services/UpdateProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123456',
    })

    const updateData = {
      userId: user.id,
      name: 'Jeff Gouveia',
      email: 'mr.jeff.gouveia@gmail.com',
    }
    const updatedUser = await updateProfile.execute(updateData)

    expect(updatedUser.name).toBe('Jeff Gouveia')
    expect(updatedUser.email).toBe('mr.jeff.gouveia@gmail.com')
  })

  it('should not be able to change the email to another already in use', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123456',
    })

    const updateData = {
      userId: user.id,
      name: 'Jeff Gouveia',
      email: 'johndoe@gmail.com',
    }
    const response = updateProfile.execute(updateData)
    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123456',
    })

    const updateData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      oldPassword: user.password,
      password: '890uio',
    }
    const updatedUser = await updateProfile.execute(updateData)

    expect(updatedUser.password).toBe(updateData.password)
  })

  it('should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123456',
    })

    const updateData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      password: '890uio',
    }
    const response = updateProfile.execute(updateData)
    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123456',
    })

    const updateData = {
      userId: user.id,
      name: user.name,
      email: user.email,
      oldPassword: 'wrong-old-password',
      password: '890uio',
    }

    const response = updateProfile.execute(updateData)
    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the profile from non-existent user', async () => {
    const response = updateProfile.execute({
      userId: 'non-existing-id',
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
    })

    await expect(response).rejects.toBeInstanceOf(AppError)
  })
})
