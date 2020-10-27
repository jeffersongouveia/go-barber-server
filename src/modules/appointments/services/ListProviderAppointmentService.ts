import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

@injectable()
class ListProviderAppointmentService {
  private repository: IAppointmentsRepository

  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsRepository
  ) {
    this.repository = repository
  }

  public async execute(data: IRequest): Promise<Appointment[]> {
    return await this.repository.findAllInDayFromProvider(data)
  }
}

export default ListProviderAppointmentService
