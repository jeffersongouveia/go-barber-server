import { startOfHour } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'
import AppError from '@shared/errors/AppError'

interface IRequest {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  private repository: IAppointmentsRepository

  constructor(repository: IAppointmentsRepository) {
    this.repository = repository
  }

  public async execute(data: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(data.date)
    const appointmentWithSameDate = await this.repository.findByDate(appointmentDate)

    if (appointmentWithSameDate) {
      throw new AppError('This appointment is already booked')
    }

    return await this.repository.create({
      provider_id: data.provider_id,
      date: appointmentDate
    })
  }
}

export default CreateAppointmentService
