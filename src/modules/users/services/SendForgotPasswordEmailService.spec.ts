import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'

describe('SendForgotPasswordEmail', () => {
  it('should be able to reset password using the e-mail', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeMailProvider = new FakeMailProvider()

    const sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeMailProvider)

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
})
