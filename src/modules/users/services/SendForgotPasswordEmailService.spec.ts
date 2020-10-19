import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository'
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokenRepository: FakeUserTokenRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokenRepository = new FakeUserTokenRepository()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository
    )
  })

  it('should be able to reset password using the e-mail', async () => {
    const fnSendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '899JLqw&',
    }

    await fakeUsersRepository.create(userData)
    await sendForgotPasswordEmail.execute(userData.email)

    expect(fnSendMail).toBeCalled()
  })

  it('should not be able to reset password of non-existent user', async () => {
    const response = sendForgotPasswordEmail.execute('john@doe.com')
    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should generate a reset password token', async () => {
    const fnGenerate = jest.spyOn(fakeUserTokenRepository, 'generate')

    const userData = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '819hKASnk@',
    }

    const user = await fakeUsersRepository.create(userData)
    await sendForgotPasswordEmail.execute(userData.email)

    expect(fnGenerate).toHaveBeenCalledWith(user.id)
  })
})
