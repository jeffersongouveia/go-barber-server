import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

interface IMessage {
  to: string
  body: string
}

class FakeMailProvider implements IMailProvider {
  private messages: IMessage[] = []

  sendMail(to: string, body: string): Promise<void> {
    this.messages.push({ to, body })
    return Promise.resolve(undefined)
  }
}

export default FakeMailProvider
