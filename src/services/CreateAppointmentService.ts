import { startOfHour } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

interface Request {
  provider: string
  date: Date
}

class CreateAppointmentService {
  public async execute(data: Request): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentsRepository)

    const appointmentDate = startOfHour(data.date)
    const appointmentWithSameDate = await repository.findByDate(appointmentDate)

    if (appointmentWithSameDate) {
      throw Error('This appointment is already booked')
    }

    const appointment = repository.create({
      provider: data.provider,
      date: appointmentDate
    })

    await repository.save(appointment)
    return appointment
  }
}

export default CreateAppointmentService
