import { Request } from 'express'
import { handleUploadImage } from '~/utils/file'
import { handleGetFileName } from '~/utils/other'
import path from 'path'
import { UPLOAD_IMAGE } from '~/constants/dir'
import sharp from 'sharp'
import '../configs/env.config'
import fsPromises from 'fs/promises'
import uploadFileToS3 from '~/utils/s3'
import mime from 'mime-types'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class MediaService {
  async uploadImages(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newFileName = handleGetFileName(file.newFilename)
        const newFileFullName = `${newFileName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE, `${newFileName}.jpg`)
        await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newPath)
        const s3 = await uploadFileToS3({
          fileName: 'images/' + newFileFullName,
          filePath: newPath,
          contentType: mime.contentType(newFileFullName) as string
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])
        return {
          url: (s3 as CompleteMultipartUploadCommandOutput).Location as string
        }
      })
    )
    return result
  }
}

const mediaService = new MediaService()
export default mediaService
