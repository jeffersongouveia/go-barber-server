import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = []

  public async save(file: string): Promise<string> {
    this.storage.push(file)
    return file
  }

  public async delete(file: string): Promise<void> {
    const index = this.storage.findIndex((i) => i === file)
    this.storage.splice(index, 1)
  }
}

export default FakeStorageProvider

