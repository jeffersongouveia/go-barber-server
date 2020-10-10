import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppointmentsRepository from '@modules/appointments/infra/database/repositories/AppointmentsRepository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository)
  const appointments = await repository.find()
  return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body

  const createAppointment = new CreateAppointmentService()
  const appointment = await createAppointment.execute({
    provider_id,
    date: parseISO(date),
  })

  return response.json(appointment)
})

export default appointmentsRouter

