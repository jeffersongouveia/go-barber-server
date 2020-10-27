import { getMongoRepository, MongoRepository } from 'typeorm'

import Notification from '@modules/notifications/infra/database/schemas/Notification'

import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'

class NotificationsRepository implements INotificationsRepository {
  private repository: MongoRepository<Notification>

  constructor() {
    this.repository = getMongoRepository(Notification, 'mongo')
  }

  public async create(data: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.repository.create(data)
    await this.repository.save(notification)
    return notification
  }
}

export default NotificationsRepository
