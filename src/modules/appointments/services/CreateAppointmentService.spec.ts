import 'reflect-metadata'
import { v4 as uuid, validate } from 'uuid'

import AppError from '@shared/errors/AppError'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import FakeAppointmentsRepository from '@modules/appointments/infra/repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationsRepository: FakeNotificationsRepository
let fakeCacheProvider: FakeCacheProvider
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointmentData = {
      date: new Date(2020, 4, 10, 13),
      provider_id: uuid(),
      user_id: uuid(),
    }
    const appointment = await createAppointment.execute(appointmentData)

    const isValidUUID = validate(appointment.id)
    expect(isValidUUID).toBeTruthy()
    expect(appointment.provider_id).toBe(appointmentData.provider_id)
  })

  it('should not be able to create two appointments on the same date time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const appointmentData = {
      date: new Date(2020, 4, 10, 13),
      provider_id: uuid(),
      user_id: uuid(),
    }

    await createAppointment.execute(appointmentData)
    await expect(createAppointment.execute(appointmentData)).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const response = createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: 'user-id',
      provider_id: 'provider-id',
    })

    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same provider and user', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime()
    })

    const response = createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: 'user-id',
      provider_id: 'user-id',
    })

    await expect(response).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment out of range 7am - 5pm', async () => {
    const firstResponse = createAppointment.execute({
      date: new Date(2020, 4, 10, 7),
      user_id: 'user-id',
      provider_id: 'user-id',
    })

    const secondResponse = createAppointment.execute({
      date: new Date(2020, 4, 10, 18),
      user_id: 'user-id',
      provider_id: 'user-id',
    })

    await expect(firstResponse).rejects.toBeInstanceOf(AppError)
    await expect(secondResponse).rejects.toBeInstanceOf(AppError)
  })
})
