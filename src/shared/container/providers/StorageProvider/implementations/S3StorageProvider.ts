import fs from 'fs'
import path from 'path'
import aws, { S3 } from 'aws-sdk'
import mime from 'mime'

import uploadConfig from '@config/upload'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

class S3StorageProvider implements IStorageProvider {
  private client: S3

  constructor() {
    this.client = new aws.S3({
      region: process.env.AWS_DEFAULT_REGION,
    })
  }

  public async save(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tempFolder, file)
    const fileContent = await fs.promises.readFile(originalPath)

    if (!process.env.AWS_BUCKET) {
      throw new Error('An environment key is missing')
    }

    const ContentType = mime.getType(originalPath)
    if (!ContentType) {
      throw new Error('ContentType could not be defined')
    }

    await this.client
      .putObject({
        Bucket: process.env.AWS_BUCKET,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise()

    // Remove image from local disk after upload
    await fs.promises.unlink(originalPath)

    return file
  }

  public async delete(file: string): Promise<void> {
    if (!process.env.AWS_BUCKET) {
      throw new Error('An environment key is missing')
    }

    await this.client
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: file,
      })
      .promise()
  }
}

export default S3StorageProvider
