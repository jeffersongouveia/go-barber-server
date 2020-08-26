import { Router } from 'express'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()
const appointments = new AppointmentsRepository()

appointmentsRouter.get('/', (request, response) => {
  return response.json(appointments.all())
})

appointmentsRouter.post('/', (request, response) => {
  try {
    const { provider, date } = request.body

    const parsedDate = parseISO(date)

    const createAppointment = new CreateAppointmentService(appointments)
    const appointment = createAppointment.execute({ provider, date: parsedDate })

    return response.json(appointment)
  } catch (error) {
    return response.status(400).json({
      error: error.message
    })
  }
})

export default appointmentsRouter

