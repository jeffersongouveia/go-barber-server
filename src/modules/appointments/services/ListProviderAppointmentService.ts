import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'
import { classToClass } from 'class-transformer'

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
    const monthWithZero = data.month.toString().padStart(2, '0')
    const dayWithZero = data.day.toString().padStart(2, '0')
    const cacheKey = `provider-appointments:${data.provider_id}:${data.year}-${monthWithZero}-${dayWithZero}`

    const isCacheEnabled = process.env.APP_CACHE_DISABLED === 'false'
    let appointments: Appointment[] | null = null

    if (isCacheEnabled) {
      appointments = await this.cache.recover<Appointment[]>(cacheKey)
    }

    if (!appointments) {
      appointments = await this.repository.findAllInDayFromProvider(data)
    }

    if (isCacheEnabled) {
      await this.cache.save(cacheKey, classToClass(appointments))
    }

    return appointments
  }
}

export default ListProviderAppointmentService
