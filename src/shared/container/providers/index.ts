import { container } from 'tsyringe'

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider'
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider'

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider)
container.registerInstance<IMailProvider>('MailProvider', new EtherealMailProvider())
