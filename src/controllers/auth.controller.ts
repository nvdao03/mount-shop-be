import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  VerifyForgotPasswordRequestBody
} from '~/requests/auth.request'
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

// --- Logout ---
export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const user_id = req.decoded_access_token.user_id
  const result = await authService.logout({ user_id, refresh_token })
  return res.status(HTTP_STATUS.OK).json(result)
}

// --- Change Password ---
export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { new_password } = req.body
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await authService.changePassword({ user_id, new_password })
  return res.status(HTTP_STATUS.OK).json(result)
}

// --- Forgot Password ---
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { id: user_id, verify } = req.user as User
  const result = await authService.forgotPassword({ user_id, verify: verify as UserVerifyStatus })
  return res.status(HTTP_STATUS.OK).json(result)
}

// --- Verify Forgot Password ---
export const verifyForgotPasswordController = (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  return res.status(HTTP_STATUS.OK).json({ message: AUTH_MESSAGE.VERIFY_FORGOT_PASSWORD_SUCCESS })
}

// --- Reset Password ---
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { password } = req.body
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const result = await authService.resetPassword({ user_id, password })
  return res.status(HTTP_STATUS.OK).json(result)
}
