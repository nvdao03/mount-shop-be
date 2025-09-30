import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { LoginRequestBody, RegisterRequestBody } from '~/requests/auth.request'
import authService from '~/services/auth.service'
import { AUTH_MESSAGE } from '~/constants/message'
import { User } from '~/db/schema'
import { UserVerifyStatus } from '~/constants/enum'

// --- Register ---
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.register(req.body)
  const { access_token, refresh_token, user, decoded_access_token, decoded_refresh_token, role } = result
  return res.status(HTTP_STATUS.CREATED).json({
    message: AUTH_MESSAGE.REGISTER_SUCCESS,
    data: {
      access_token,
      expires_access_token: decoded_access_token.exp,
      refresh_token,
      expries_refresh_token: decoded_refresh_token.exp,
      user: {
        id: user.id,
        role: role.name,
        email: user.email,
        full_name: user.full_name,
        created_at: user.createdAt,
        update_at: user.updatedAt
      }
    }
  })
}

// --- Login ---
export const loginController = async (
  req: Request<ParamsDictionary, any, LoginRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const user_id = user.id
  const role_id = user.role_id
  const result = await authService.login({ user_id, verify: user.verify as UserVerifyStatus, role_id })
  const { access_token, refresh_token, decoded_access_token, decoded_refresh_token, role } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.LOGIN_SUCCESS,
    data: {
      access_token,
      expires_access_token: decoded_access_token.exp,
      refresh_token,
      expries_refresh_token: decoded_refresh_token.exp,
      user: {
        id: user.id,
        role: role.name,
        email: user.email,
        full_name: user.full_name,
        created_at: user.createdAt,
        update_at: user.updatedAt
      }
    }
  })
}
