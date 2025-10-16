import { ParamsDictionary } from 'express-serve-static-core'
import { eq } from 'drizzle-orm'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/requests/auth.request'
import authService from '~/services/auth.service'
import { AUTH_MESSAGE } from '~/constants/message'
import { User, users } from '~/db/schema'
import { UserVerifyStatus } from '~/constants/enum'
import { db } from '~/configs/postgreSQL.config'

// --- Register ---
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await authService.register(req.body)
  const { access_token, refresh_token, user, decoded_access_token, decoded_refresh_token, role, address } = result
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
        full_name: address.full_name,
        avatar: user.avatar,
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
  const { access_token, refresh_token, decoded_access_token, decoded_refresh_token, role, address } = result
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
        full_name: address.full_name,
        avatar: user.avatar,
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
  const { id: user_id, verify, role_id, email } = req.user as User
  const result = await authService.forgotPassword({ user_id, verify: verify as UserVerifyStatus, role_id, email })
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

// --- Verify Email ---
export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const [user] = await db.select().from(users).where(eq(users.id, user_id)).limit(1)
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: AUTH_MESSAGE.USER_NOT_FOUND
    })
  }
  if (user.email_verify_token === '') {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: AUTH_MESSAGE.EMAIL_ALREADY_VERIFIED })
  }
  const result = await authService.verifyEmail({
    user_id,
    verify: user.verify as UserVerifyStatus,
    role_id: user.role_id
  })
  const { access_token, refresh_token, role, decoded_access_token, decoded_refresh_token, address } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.EMAIL_VERIFIED_SUCCESS,
    data: {
      access_token,
      expires_access_token: decoded_access_token.exp,
      refresh_token,
      expries_refresh_token: decoded_refresh_token.exp,
      user: {
        id: user.id,
        role: role.name,
        email: user.email,
        full_name: address.full_name,
        avatar: user.avatar,
        created_at: user.createdAt,
        update_at: user.updatedAt
      }
    }
  })
}

// --- Refresh Token ---
export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id, exp, verify, role } = req.decoded_refresh_token as TokenPayload
  const { refresh_token } = req.body
  const result = await authService.refreshToken({ user_id, exp, verify, refresh_token, role })
  const { decoded_access_token, decoded_refresh_token, new_access_token, new_refresh_token, user, address } = result
  return res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.REFRESH_TOKEN_SUCCESS,
    data: {
      access_token: new_access_token,
      expires_access_token: decoded_access_token.exp,
      refresh_token: new_refresh_token,
      expries_refresh_token: decoded_refresh_token.exp,
      user: {
        id: user.id,
        role: role,
        email: user.email,
        full_name: address.full_name,
        avatar: user.avatar,
        created_at: user.createdAt,
        update_at: user.updatedAt
      }
    }
  })
}
