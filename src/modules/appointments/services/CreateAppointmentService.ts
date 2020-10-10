import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import Appointment from '../infra/database/entities/Appointment'
import AppointmentsRepository from '../infra/database/repositories/AppointmentsRepository'
import AppError from '@shared/errors/AppError'

interface Request {
  provider_id: string
  date: Date
}

class CreateAppointmentService {
  public async execute(data: Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository)

    const appointmentDate = startOfHour(data.date)
    const appointmentWithSameDate = await repository.findByDate(appointmentDate)

    if (appointmentWithSameDate) {
      throw new AppError('This appointment is already booked')
    }

    return await repository.create({
      provider_id: data.provider_id,
      date: appointmentDate
    })
  }
}

export default CreateAppointmentService
