import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService'
import FakeAppointmentsRepository from '@modules/appointments/infra/repositories/fakes/FakeAppointmentsRepository'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProvidersMonthly: ListProviderMonthAvailabilityService

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProvidersMonthly = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository)
  })

  it('should be able to list the month availability from provider', async () => {
    const appointmentsResponses = []
    for (let i = 8; i < 18; i++) {
      const response = fakeAppointmentsRepository.create({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 11, 4, i, 0, 0),
      })

      appointmentsResponses.push(response)
    }

    await Promise.all(appointmentsResponses)

    const availability = await listProvidersMonthly.execute({
      provider_id: 'provider-id',
      year: 2020,
      month: 12,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 2, available: true },
        { day: 3, available: true },
        { day: 4, available: false },
        { day: 5, available: true },
      ]))
  })
})
