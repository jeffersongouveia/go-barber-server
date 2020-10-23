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
    let response

    response = fakeAppointmentsRepository.create({
      provider_id: 'user-id',
      date: new Date(2020, 4, 20, 10, 0, 0),
    })

    appointmentsResponses.push(response)

    for (let i = 8; i < 18; i++) {
      response = fakeAppointmentsRepository.create({
        provider_id: 'user-id',
        date: new Date(2020, 4, 21, i, 0, 0),
      })

      appointmentsResponses.push(response)
    }

    await Promise.all(appointmentsResponses)

    const availability = await listProvidersMonthly.execute({
      provider_id: 'user-id',
      year: 2020,
      month: 5,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: true },
        { day: 21, available: false },
        { day: 22, available: true },
      ]))
  })
})
