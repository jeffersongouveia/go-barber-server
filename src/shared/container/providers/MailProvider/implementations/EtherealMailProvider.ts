import nodemailer, { Transporter } from 'nodemailer'
import { injectable, inject } from 'tsyringe'

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO'
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'

@injectable()
class EtherealMailProvider implements IMailProvider {
  private mail: Transporter
  private mailTemplateProvider: IMailTemplateProvider

  constructor(
    @inject('MailTemplateProvider')
    mailTemplateProvider: IMailTemplateProvider
  ) {
    this.mailTemplateProvider = mailTemplateProvider

    nodemailer.createTestAccount()
      .then((account) => {
        this.mail = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          }
        })
      })
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const message = await this.mail.sendMail({
      from: {
        name: data.from?.name || 'Equipe GoBarber',
        address: data.from?.email || 'equipe@gobarber.com.br',
      },
      to: {
        name: data.to.name,
        address: data.to.email,
      },
      subject: data.subject,
      html: await this.mailTemplateProvider.parse(data.templateData),
    })

    console.log(`Message sent: ${message.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
  }
}

export default EtherealMailProvider
