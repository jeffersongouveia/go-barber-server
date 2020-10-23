import { v4 as uuid } from 'uuid'
import { getMonth, getYear, isEqual } from 'date-fns'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = []

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()
    Object.assign(appointment, { ...data, id: uuid() })
    this.appointments.push(appointment)
    return appointment
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    return this.appointments.find((appointment) => isEqual(appointment.date, date))
  }

  public async findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    return this.appointments.filter((appointment) => (
      appointment.provider_id == data.provider_id &&
      getMonth(appointment.date) + 1 === data.month &&
      getYear(appointment.date) === data.year
    ))
  }
}

export default FakeAppointmentsRepository
