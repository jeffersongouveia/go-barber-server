import { inject, injectable } from 'tsyringe'

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
    userToken: IUserTokenRepository
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

    await this.userToken.generate(user.id)
    await this.mail.sendMail(email, 'E-mail teste')
  }
}

export default SendForgotPasswordEmailService
