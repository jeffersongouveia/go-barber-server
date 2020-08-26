import { isEqual } from 'date-fns'
import Appointment from '../models/Appointment'

class AppointmentsRepository {
  private appointments: Appointment[]

  constructor() {
    this.appointments = []
  }

  public create(provider: string, date: Date): Appointment {
    const appointment = new Appointment(provider, date)
    this.appointments.push(appointment)
    return appointment
  }

  public findByDate(date: Date): Appointment | undefined {
    return this.appointments.find((i) => isEqual(i.date, date))
  }
}

export default AppointmentsRepository
