import { isEqual } from 'date-fns'
import Appointment from '../models/Appointment'

interface CreateAppointmentDTO {
  provider: string
  date: Date
}

class AppointmentsRepository {
  private appointments: Appointment[]

  constructor() {
    this.appointments = []
  }

  public all(): Appointment[] {
    return this.appointments
  }

  public create(data: CreateAppointmentDTO): Appointment {
    const appointment = new Appointment(data)
    this.appointments.push(appointment)
    return appointment
  }

  public findByDate(date: Date): Appointment | undefined {
    return this.appointments.find((i) => isEqual(i.date, date))
  }
}

export default AppointmentsRepository
