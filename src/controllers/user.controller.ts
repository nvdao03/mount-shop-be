import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/requests/auth.request'
import userService from '~/services/user.service'
import { GetUsersQueryParams, UpdateProfileRequestBody } from '~/requests/user.request'

// --- Get Profile ---
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.getProfile(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.USER_GET_PROFILE_SUCCESS,
    data: result
  })
}

// --- Update Profile ---
export const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.updateProfile(user_id, req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.USER_UPDATE_PROFILE_SUCCESS,
    data: result
  })
}

// --- Get Users ---
export const getUsersController = async (
  req: Request<ParamsDictionary, any, any, GetUsersQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const search = req.query.search as string
  const result = await userService.getUsers({ limit, page, search })
  const { userList, total_page } = result
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USERS_SUCCESS,
    data: {
      users: [...userList],
      pagination: {
        page,
        limit,
        total_page
      }
    }
  })
}
