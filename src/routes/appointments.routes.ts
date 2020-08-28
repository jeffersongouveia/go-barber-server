import { Router } from 'express'
import { parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentsRepository)
  const appointments = await repository.find()
  return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {
  try {
    const { provider_id, date } = request.body

    const createAppointment = new CreateAppointmentService()
    const appointment = await createAppointment.execute({
      provider_id,
      date: parseISO(date),
    })

    return response.json(appointment)
  } catch (error) {
    return response.status(400).json({
      error: error.message,
    })
  }
})

export default appointmentsRouter

