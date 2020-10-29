import { container } from 'tsyringe'

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider'
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider'
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider'

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider)
container.registerSingleton<IMailTemplateProvider>('MailTemplateProvider', HandlebarsMailTemplateProvider)
container.registerInstance<IMailProvider>('MailProvider', container.resolve(EtherealMailProvider))
container.registerSingleton<ICacheProvider>('CacheProvider', RedisCacheProvider)
