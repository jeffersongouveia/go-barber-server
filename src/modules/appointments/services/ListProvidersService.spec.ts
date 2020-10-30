import 'reflect-metadata'

import ListProvidersService from './ListProvidersService'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider
let listProviders: ListProvidersService

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list providers', async () => {
    const firstUser = await fakeUsersRepository.create({
      name: 'Jeff Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '123qwe',
    })

    const secondUser = await fakeUsersRepository.create({
      name: 'Jefferson Gouveia',
      email: 'jeffersongouveia1@hotmail.com',
      password: '123qwe',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: 'Jeff S Gouveia',
      email: 'mr.jeff.gouveia@gmail.com',
      password: '123qwe',
    })

    const providers = await listProviders.execute(loggedUser.id)

    expect(providers).toEqual([firstUser, secondUser])
  })
})
