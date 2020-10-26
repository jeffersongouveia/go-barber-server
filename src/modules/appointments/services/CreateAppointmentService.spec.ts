import { v4 as uuid, validate } from 'uuid'

import FakeAppointmentsRepository from '@modules/appointments/infra/repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    const appointmentData = {
      date: new Date(),
      provider_id: uuid(),
      user_id: uuid(),
    }
    const appointment = await createAppointment.execute(appointmentData)

    const isValidUUID = validate(appointment.id)
    expect(isValidUUID).toBeTruthy()
    expect(appointment.provider_id).toBe(appointmentData.provider_id)
  })

  it('should not be able to create two appointments on the same date time', async () => {
    const appointmentData = {
      date: new Date(),
      provider_id: uuid(),
      user_id: uuid(),
    }

    await createAppointment.execute(appointmentData)
    await expect(createAppointment.execute(appointmentData)).rejects.toBeInstanceOf(AppError)
  })
})
