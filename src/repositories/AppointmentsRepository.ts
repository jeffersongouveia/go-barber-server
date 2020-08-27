import { EntityRepository, Repository } from 'typeorm'

import Appointment from '../models/Appointment'

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
  public findByDate(date: Date): Promise<Appointment | undefined> {
    return this.findOne({
      where: { date },
    })
  }
}

export default AppointmentsRepository
