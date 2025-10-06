import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/dir'

// --- Init folder ---
export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)) {
    return fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
      recursive: true
    })
  }
}

// --- Handle upload image ---
export const handleUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 6,
    maxFileSize: 10 * 1024 * 1024,
    keepExtensions: true,
    filter: ({ name, originalFilename, mimetype }) => {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file name') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    const uploadFiles: File[] = []

    // Lắng nghe sự kiện, nếu người dùng upload file nên thì thêm vào mảng
    form.on('file', (_, file) => {
      uploadFiles.push(file)
    })

    // Xử lý và trả về file cho client
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) return reject(new Error('No image file'))
      uploadFiles.length = 0
      resolve(files.image as File[])
    })

    // Lắng nghe sự kiện, khi ảnh đang được upload mà người dùng nhấn đóng thì sẽ xoá bỏ file đó trên server
    req.on('close', () => {
      if (uploadFiles.length > 0) {
        uploadFiles.forEach((file) => {
          fs.unlinkSync(file.filepath)
        })
      }
    })
  })
}
