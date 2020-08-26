import { startOfHour } from 'date-fns'
import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

interface Request {
  provider: string
  date: Date
}

class CreateAppointmentService {
  private appointments

  constructor(appointments: AppointmentsRepository) {
    this.appointments = appointments
  }

  public execute(data: Request): Appointment {
    const appointmentDate = startOfHour(data.date)

    const appointmentWithSameDate = this.appointments.findByDate(appointmentDate)
    if (appointmentWithSameDate) {
      throw Error('This appointment is already booked')
    }

    return this.appointments.create({
      provider: data.provider,
      date: appointmentDate
    })
  }
}

export default CreateAppointmentService
