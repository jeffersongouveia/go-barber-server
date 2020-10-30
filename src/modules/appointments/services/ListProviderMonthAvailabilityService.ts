import 'reflect-metadata'

import { inject, injectable } from 'tsyringe'
import { getDate, getDaysInMonth, isAfter } from 'date-fns'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  year: number
  month: number
}

type IResponse = Array<{
  day: number
  available: boolean
}>

@injectable()
class ListProviderMonthAvailabilityService {
  private repository: IAppointmentsRepository

  constructor(
    @inject('AppointmentsRepository')
    repository: IAppointmentsRepository,
  ) {
    this.repository = repository
  }

  public async execute(data: IRequest): Promise<IResponse> {
    const { month, year } = data

    const appointments = await this.repository.findAllInMonthFromProvider(data)

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))
    const allDays = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    )

    const availability = allDays.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59)
      const appointmentInDay = appointments.filter((appointment) => getDate(appointment.date) === day)

      return {
        day,
        // Das 8 até as 17h apenas
        available: isAfter(compareDate, new Date()) && appointmentInDay.length < 10,
      }
    })

    return availability
  }
}

export default ListProviderMonthAvailabilityService
