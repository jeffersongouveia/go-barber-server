import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository'
import ResetPasswordService from '@modules/users/services/ResetPasswordService'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

let fakeUsersRepository: IUsersRepository
let fakeUserTokenRepository: IUserTokenRepository
let resetPasswordService: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()

    resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository)
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '127_QwUnO^',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    await resetPasswordService.execute({
      password: '123qwe',
      token,
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)
    expect(updatedUser?.password).toBe('123qwe')
  })
})
