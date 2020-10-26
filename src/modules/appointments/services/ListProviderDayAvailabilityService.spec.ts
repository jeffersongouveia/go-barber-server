import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'
import FakeAppointmentsRepository from '@modules/appointments/infra/repositories/fakes/FakeAppointmentsRepository'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProvidersMonthly: ListProviderDayAvailabilityService

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProvidersMonthly = new ListProviderDayAvailabilityService(fakeAppointmentsRepository)
  })

  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user-id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user-id',
      date: new Date(2020, 4, 20, 13, 0, 0),
    })

    const availability = await listProvidersMonthly.execute({
      provider_id: 'user-id',
      day: 20,
      month: 5,
      year: 2020,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { available: false, hour: 10 },
        { available: true, hour: 11 },
        { available: true, hour: 12 },
        { available: false, hour: 13 },
      ]))
  })
})
