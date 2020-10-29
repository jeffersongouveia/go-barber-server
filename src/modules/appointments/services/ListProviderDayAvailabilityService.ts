import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  year: number
  month: number
  day: number
}

type IResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
class ListProviderDayAvailabilityService {
  private repository: IAppointmentsRepository

  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsRepository,
  ) {
    this.repository = repository
  }

  public async execute(data: IRequest): Promise<IResponse> {
    const appointments = await this.repository.findAllInDayFromProvider(data)

    const hourStart = 8
    const allHours = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    )

    const currentDate = new Date(Date.now())

    const availability = allHours.map((hour) => {
      const hasAppointment = appointments.find(appointment => getHours(appointment.date) === hour)
      const compareDate = new Date(data.year, data.month - 1, data.day, hour)

      return {
        hour,
        available: !hasAppointment && isAfter(compareDate, currentDate),
      }
    })

    return availability
  }
}

export default ListProviderDayAvailabilityService
