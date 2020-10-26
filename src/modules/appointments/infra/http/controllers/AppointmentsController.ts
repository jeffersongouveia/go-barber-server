import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { parseISO } from 'date-fns'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    // const appointments = await repository.find()
    // return response.json(appointments)
    return response.send()
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body

    const createAppointment = container.resolve(CreateAppointmentService)
    const appointment = await createAppointment.execute({
      provider_id,
      user_id: request.user.id,
      date: parseISO(date),
    })

    return response.json(appointment)
  }
}
