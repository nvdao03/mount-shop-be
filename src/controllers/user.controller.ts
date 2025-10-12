import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/requests/auth.request'
import userService from '~/services/user.service'

// --- Get Profile ---
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.getProfile(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.USER_GET_PROFILE_SUCCESS,
    data: result
  })
}
