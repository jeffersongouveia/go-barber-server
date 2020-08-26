import { Router } from 'express'
import { startOfHour, parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'

const appointmentsRouter = Router()
const appointments = new AppointmentsRepository()

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body

  const parsedDate = startOfHour(parseISO(date))
  const appointmentWithSameDate = appointments.findByDate(parsedDate)
  if (appointmentWithSameDate) {
    return response.json({
      message: 'This appointment is already booked'
    })
  }

  const appointment = appointments.create(provider, parsedDate)
  return response.json(appointment)
})

export default appointmentsRouter

