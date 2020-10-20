import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import ResetPasswordService from '@modules/users/services/ResetPasswordService'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

let fakeUsersRepository: IUsersRepository
let fakeUserTokenRepository: IUserTokenRepository
let fakeHashProvider: IHashProvider
let resetPasswordService: ResetPasswordService

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokenRepository = new FakeUserTokenRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokenRepository,
      fakeHashProvider,
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '127_QwUnO^',
    })

    const fnGenerate = jest.spyOn(fakeHashProvider, 'generate')

    const { token } = await fakeUserTokenRepository.generate(user.id)
    const resetPasswordData = { password: '123qwe', token }

    await resetPasswordService.execute(resetPasswordData)
    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(fnGenerate).toHaveBeenCalledWith(resetPasswordData.password)
    expect(updatedUser?.password).toBe(resetPasswordData.password)
  })

  it('should not be able to reset the password with non-existent token', async () => {
    const response = resetPasswordService.execute({
      token: 'non-existing-token',
      password: '123qwe',
    })

    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password with non-existent user', async () => {
    const { token } = await fakeUserTokenRepository.generate('non-existent-user')
    const response = resetPasswordService.execute({
      token,
      password: '123qwe',
    })

    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset the password after 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123qwe',
    })

    const { token } = await fakeUserTokenRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()
      return customDate.setHours(customDate.getHours() + 3)
    })

    const response = resetPasswordService.execute({
      password: '890iop',
      token,
    })

    await expect(response).rejects.toBeInstanceOf(AppError)
  })
})
