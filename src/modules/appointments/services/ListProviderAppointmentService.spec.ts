import ListProviderAppointmentService from './ListProviderAppointmentService'
import FakeAppointmentsRepository from '../infra/repositories/fakes/FakeAppointmentsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeCacheProvider: FakeCacheProvider
let listProviderAppointment: ListProviderAppointmentService

describe('ListProviderAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviderAppointment = new ListProviderAppointmentService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list the appointments of a provider', async () => {
    const firstAppointment = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 11, 20, 9, 0, 0),
    })

    const secondAppointment = await fakeAppointmentsRepository.create({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 11, 20, 15, 0, 0),
    })

    const availability = await listProviderAppointment.execute({
      provider_id: 'provider-id',
      day: 20,
      month: 12,
      year: 2020,
    })

    expect(availability).toEqual([firstAppointment, secondAppointment])
  })
})
