import { Repository, getRepository } from 'typeorm'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import Appointment from '../entities/Appointment'

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async create(data: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create(data)
    await this.ormRepository.save(appointment)
    return appointment
  }

  public findByDate(date: Date): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({
      where: { date },
    })
  }
}

export default AppointmentsRepository
