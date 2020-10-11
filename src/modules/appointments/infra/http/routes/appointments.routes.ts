import { Router } from 'express'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '@modules/appointments/infra/database/repositories/AppointmentsRepository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)

appointmentsRouter.get('/', async (request, response) => {
  // const appointments = await repository.find()
  // return response.json(appointments)
  return response.send()
})

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body

  const appointmentsRepository = new AppointmentsRepository()
  const createAppointment = new CreateAppointmentService(appointmentsRepository)
  const appointment = await createAppointment.execute({
    provider_id,
    date: parseISO(date),
  })

  return response.json(appointment)
})

export default appointmentsRouter

