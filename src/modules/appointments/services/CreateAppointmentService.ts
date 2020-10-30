import { format, getHours, isBefore, startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'
import AppError from '@shared/errors/AppError'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository
  private notificationsRepository: INotificationsRepository
  private cache: ICacheProvider

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    cache: ICacheProvider
  ) {
    this.appointmentsRepository = appointmentsRepository
    this.notificationsRepository = notificationsRepository
    this.cache = cache
  }

  public async execute(data: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(data.date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("Can't create an appointment on a past date")
    }

    if (data.user_id === data.provider_id) {
      throw new AppError("Can't create an appointment with yourself")
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("Can't create an appointment out of range 8am and 5pm'")
    }

    const appointmentWithSameDate = await this.appointmentsRepository.findByDate(appointmentDate, data.provider_id)

    if (appointmentWithSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id: data.provider_id,
      user_id: data.user_id,
      date: appointmentDate,
    })

    const cacheKey = `provider-appointments:${data.provider_id}:${format(data.date, 'yyyy-mm-dd')}`
    await this.cache.invalidate(cacheKey)

    const dateFormatted = format(data.date, "dd 'de' MMM. yyyy 'às' HH:mm")
    await this.notificationsRepository.create({
      recipient_id: data.provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    })

    return appointment
  }
}

export default CreateAppointmentService
