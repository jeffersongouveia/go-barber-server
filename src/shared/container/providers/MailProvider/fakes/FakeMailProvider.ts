import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO'

class FakeMailProvider implements IMailProvider {
  private messages: ISendMailDTO[] = []

  sendMail(data: ISendMailDTO): Promise<void> {
    this.messages.push(data)
    return Promise.resolve(undefined)
  }
}

export default FakeMailProvider
