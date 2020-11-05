import nodemailer, { Transporter } from 'nodemailer'
import { injectable, inject } from 'tsyringe'
import aws from 'aws-sdk'

import mailConfig from '@config/mail'

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO'
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter
  private mailTemplateProvider: IMailTemplateProvider

  constructor(
    @inject('MailTemplateProvider')
    mailTemplateProvider: IMailTemplateProvider
  ) {
    this.mailTemplateProvider = mailTemplateProvider

    this.client = nodemailer.createTransport({
      SES: new aws.SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_DEFAULT_REGION,
      })
    })
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    const defaults = mailConfig.defaults

    await this.client.sendMail({
      from: {
        address: data.from?.email || defaults.from.email,
        name: data.from?.name || defaults.from.name,
      },
      to: {
        name: data.to.name,
        address: data.to.email,
      },
      subject: data.subject,
      html: await this.mailTemplateProvider.parse(data.templateData),
    })
  }
}

export default SESMailProvider
