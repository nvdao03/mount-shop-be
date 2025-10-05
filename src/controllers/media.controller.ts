import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { MEDIA_MESSAGE } from '~/constants/message'
import mediaService from '~/services/media.service'

export const handleUploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await mediaService.uploadImages(req)
  return res.status(HTTP_STATUS.OK).json({
    message: MEDIA_MESSAGE.UPLOAD_IMAGE_SUCCESS,
    data: result
  })
}
