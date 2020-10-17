import { inject, injectable } from 'tsyringe'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

@injectable()
class SendForgotPasswordEmailService {
  private repository: IUsersRepository
  private mail: IMailProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('MailProvider')
    mail: IMailProvider
  ) {
    this.repository = repository
    this.mail = mail
  }

  public async execute(email: string): Promise<void> {
    this.mail.sendMail(email, 'E-mail teste')
  }
}

export default SendForgotPasswordEmailService
