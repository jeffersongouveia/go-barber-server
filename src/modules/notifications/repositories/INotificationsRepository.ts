import Notification from '@modules/notifications/infra/database/schemas/Notification'
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO'

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>
}
