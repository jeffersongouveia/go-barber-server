import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

@injectable()
class ListProviderAppointmentService {
  private repository: IAppointmentsRepository
  private cache: ICacheProvider

  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsRepository,

    @inject('CacheProvider')
    cache: ICacheProvider
  ) {
    this.repository = repository
    this.cache = cache
  }

  public async execute(data: IRequest): Promise<Appointment[]> {
    const appointments = await this.repository.findAllInDayFromProvider(data)
    return appointments
  }
}

export default ListProviderAppointmentService
