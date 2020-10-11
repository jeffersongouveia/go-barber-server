import { v4 as uuid } from 'uuid'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()
    Object.assign(appointment, { ...data, id: uuid() })
    this.appointments.push(appointment)
    return appointment
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find((i) => i.date === date)
  }
}

export default FakeAppointmentsRepository
