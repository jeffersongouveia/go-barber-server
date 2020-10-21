import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider'
import UpdateAvatarUserService from '@modules/users/services/UpdateAvatarUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeStorageProvider: FakeStorageProvider
let updateUserAvatar: UpdateAvatarUserService

describe('UpdateAvatarUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeStorageProvider = new FakeStorageProvider()

    updateUserAvatar = new UpdateAvatarUserService(fakeUsersRepository, fakeStorageProvider)
  })

  it('should be able to upload a new avatar', async () => {
    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123&qwE'
    }
    const user = await fakeUsersRepository.create(userData)

    const avatarData = {
      idUser: user.id,
      fileName: 'avatar.png'
    }
    await updateUserAvatar.execute(avatarData)

    expect(user.avatar).toBe(avatarData.fileName)
  })

  it('should not be able to upload a new avatar without login', async () => {
    const avatarData = {
      idUser: 'invalid-id',
      fileName: 'avatar.png'
    }
    const response = updateUserAvatar.execute(avatarData)

    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to delete old avatar when uploading a new one', async () => {
    const fnDelete = jest.spyOn(fakeStorageProvider, 'delete')

    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123&qwE'
    }
    const user = await fakeUsersRepository.create(userData)

    const firstAvatar = 'avatar.png'
    const secondAvatar = 'second-avatar.png'
    await updateUserAvatar.execute({ idUser: user.id, fileName: firstAvatar })
    await updateUserAvatar.execute({ idUser: user.id, fileName: secondAvatar })

    expect(fnDelete).toBeCalledWith(firstAvatar)
    expect(user.avatar).toBe(secondAvatar)
  })
})
