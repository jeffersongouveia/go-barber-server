import { v4 as uuid, validate } from 'uuid'

import FakeAppointmentsRepository from '@modules/appointments/infra/repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)

    const appointmentData = {
      date: new Date(),
      provider_id: uuid(),
    }
    const appointment = await createAppointment.execute(appointmentData)

    const isValidUUID = validate(appointment.id)
    expect(isValidUUID).toBeTruthy()
    expect(appointment.provider_id).toBe(appointmentData.provider_id)
  })
})
