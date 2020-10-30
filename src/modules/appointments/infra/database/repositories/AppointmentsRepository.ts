import { getRepository, Raw, Repository } from 'typeorm'
import { classToClass } from 'class-transformer'

import Appointment from '@modules/appointments/infra/database/entities/Appointment'

import IAppointmentsRepository from '@modules/appointments/infra/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'

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

  public findByDate(date: Date, providerId: string): Promise<Appointment | undefined> {
    return this.ormRepository.findOne({
      where: {
        date,
        provider_id: providerId,
      },
    })
  }

  public async findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(data.month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id: data.provider_id,
        date: Raw((field) => `to_char(${field}, 'MM-YYYY') = '${parsedMonth}-${data.year}'`)
      }
    })

    return appointments
  }

  public async findAllInDayFromProvider(data: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(data.day).padStart(2, '0')
    const parsedMonth = String(data.month).padStart(2, '0')

    const appointments = await this.ormRepository.find({
      where: {
        provider_id: data.provider_id,
        date: Raw((field) => `to_char(${field}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${data.year}'`)
      },
      relations: ['user'],
    })

    return classToClass(appointments)
  }
}

export default AppointmentsRepository
