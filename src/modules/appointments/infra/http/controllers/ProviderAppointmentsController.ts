import { Request, Response } from 'express'
import { container } from 'tsyringe'

import ListProviderAppointmentService from '@modules/appointments/services/ListProviderAppointmentService'

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { day, month, year} = request.query

    const listProviderAppointment = container.resolve(ListProviderAppointmentService)
    const appointments = await listProviderAppointment.execute({
      provider_id: request.user.id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    })

    return response.json(appointments)
  }
}
