import { ObjectID } from 'mongodb'

import Notification from '@modules/notifications/infra/database/schemas/Notification'

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = []

  public async create(data: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification()

    Object.assign(notification, {
      ...data,
      id: new ObjectID(),
    })
    this.notifications.push(notification)

    return notification
  }
}

export default FakeNotificationsRepository
