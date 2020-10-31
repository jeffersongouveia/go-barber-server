import { inject, injectable } from 'tsyringe'
import path from 'path'

import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository'

@injectable()
class SendForgotPasswordEmailService {
  private repository: IUsersRepository
  private mail: IMailProvider
  private userToken: IUserTokenRepository

  constructor(
    @inject('UsersRepository')
      repository: IUsersRepository,
    @inject('MailProvider')
      mail: IMailProvider,
    @inject('UserTokenRepository')
      userToken: IUserTokenRepository,
  ) {
    this.repository = repository
    this.mail = mail
    this.userToken = userToken
  }

  public async execute(email: string): Promise<void> {
    const user = await this.repository.findByEmail(email)

    if (!user) {
      throw new AppError('User not found')
    }

    const { token } = await this.userToken.generate(user.id)
    const filePathTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs')

    await this.mail.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Recuperação de senha',
      templateData: {
        file: filePathTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/recover-account?token=${token}`,
        }
      }
    })
  }
}

export default SendForgotPasswordEmailService
