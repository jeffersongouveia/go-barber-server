import { getHours, isBefore, startOfHour } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'
import AppError from '@shared/errors/AppError'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  private repository: IAppointmentsRepository

  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsRepository
  ) {
    this.repository = repository
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

    const appointmentWithSameDate = await this.repository.findByDate(appointmentDate)

    if (appointmentWithSameDate) {
      throw new AppError('This appointment is already booked')
    }

    return await this.repository.create({
      provider_id: data.provider_id,
      user_id: data.user_id,
      date: appointmentDate,
    })
  }
}

export default CreateAppointmentService
