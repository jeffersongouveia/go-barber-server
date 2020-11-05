import multer, { StorageEngine } from 'multer'
import crypto from 'crypto'
import path from 'path'

const tempFolder = path.resolve(__dirname, '..', '..', 'tmp')

interface IUploadConfig {
  driver: 'disk' | 's3'

  tempFolder: string
  uploadsFolder: string

  multer: {
    storage: StorageEngine,
  }

  config: {
    disk: {},
    aws: {
     bucket: string
    }
  }
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tempFolder,
  uploadsFolder: path.resolve(tempFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tempFolder,

      filename(req, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex')
        const fileName = `${fileHash}-${file.originalname}`

        return callback(null, fileName)
      },
    }),
  },

  config: {
    disk: {},

    aws: {
      bucket: process.env.AWS_BUCKET,
    }
  },
} as IUploadConfig
