import fs from 'fs'
import path from 'path'

import uploadConfig from '@config/upload'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class DiskStorageProvider implements IStorageProvider {
  public async save(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tempFolder, file),
      path.resolve(uploadConfig.uploadsFolder, file),
    )

    return file
  }

  public async delete(file: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadsFolder, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

export default DiskStorageProvider
