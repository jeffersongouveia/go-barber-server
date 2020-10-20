import nodemailer, { Transporter } from 'nodemailer'

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

class EtherealMailProvider implements IMailProvider {
  private mail: Transporter

  constructor() {
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

  public async sendMail(to: string, body: string): Promise<void> {
    const message = await this.mail.sendMail({
      from: 'Equipe GoBarber <equipe@gobarber.com.br>',
      to,
      subject: 'Recuperação de senha',
      text: body,
    })

    console.log(`Message sent: ${message.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`)
  }
}

export default EtherealMailProvider
