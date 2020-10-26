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
      date: new Date(2020, 4, 20, 14, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user-id',
      date: new Date(2020, 4, 20, 16, 0, 0),
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime()
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
        { available: false, hour: 11 },
        { available: true, hour: 12 },
        { available: true, hour: 13 },
        { available: false, hour: 14 },
        { available: true, hour: 15 },
        { available: false, hour: 16 },
      ]))
  })
})
