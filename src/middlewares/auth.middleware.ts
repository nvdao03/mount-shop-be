import authService from '~/services/auth.service'
import { AUTH_MESSAGE, USER_MESSAGE } from './../constants/message'
import { checkSchema, ParamSchema } from 'express-validator'
import { ErrorStatus } from '~/utils/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { db } from '~/configs/postgreSQL.config'
import { refresh_tokens, users } from '~/db/schema'
import { and, eq } from 'drizzle-orm'
import hashPassword from '~/utils/crypto'
import { validate } from '~/utils/validation'
import '../configs/env.config'
import { verifyToken } from '~/utils/jwt'
import { TokenPayload } from '~/requests/auth.request'
import { JsonWebTokenError } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { UserVerifyStatus } from '~/constants/enum'

// --- Common schema ---
const emailSchema: ParamSchema = {}

const passwordSchema: ParamSchema = {
  isString: true,
  isLength: {
    options: {
      min: 6,
      max: 180
    },
    errorMessage: AUTH_MESSAGE.PASSWORD_INVALID_LENGTH
  },
  trim: true
}

const confirmPasswordSchema: ParamSchema = {
  isString: true,
  isLength: {
    options: {
      min: 6,
      max: 180
    },
    errorMessage: AUTH_MESSAGE.CONFIRM_PASSWORD_INVALID_LENGTH
  },
  trim: true,
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new ErrorStatus({
          message: AUTH_MESSAGE.CONFIRM_PASSWORD_INVALID,
          status: HTTP_STATUS.UNPROCESSABLE_ENTITY
        })
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  isString: true,
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value || value.trim() === '') {
        throw new ErrorStatus({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: AUTH_MESSAGE.FORGOT_PASSWORD_TOKEN_NOT_EMPTY
        })
      }
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })
        const { user_id } = decoded_forgot_password_token as TokenPayload
        const [user] = await db
          .select({ forgot_password_token: users.forgot_password_token })
          .from(users)
          .where(eq(users.id, user_id))
          .limit(1)
        if (!user) {
          throw new ErrorStatus({
            status: HTTP_STATUS.UNAUTHORIZED,
            message: USER_MESSAGE.USER_NOT_FOUND
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorStatus({
            status: HTTP_STATUS.UNAUTHORIZED,
            message: AUTH_MESSAGE.FORGOT_PASSWORD_TOKEN_NOT_EXISTS
          })
        }
        req.decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        throw new ErrorStatus({
          status: HTTP_STATUS.UNAUTHORIZED,
          message: AUTH_MESSAGE.FORGOT_PASSWORD_TOKEN_NOT_FOUND
        })
      }
      return true
    }
  }
}

// --- Register validator ---
export const registerValidator = validate(
  checkSchema(
    {
      full_name: {
        isString: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.FULLNAME_NOT_EMPTY
        },
        isLength: {
          options: { min: 6, max: 180 },
          errorMessage: AUTH_MESSAGE.FULLNAME_INVALID_LENGTH
        },
        trim: true
      },
      email: {
        isEmail: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.EMAIL_NOT_EMPTY
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isEmail = await authService.checkEmailExists(value)
            if (isEmail) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_EXISTS,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

// --- Login validator ---
export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.EMAIL_NOT_EMPTY
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const [user] = await db
              .select()
              .from(users)
              .where(and(eq(users.email, value), eq(users.password, hashPassword(req.body.password))))
              .limit(1)
            if (!user) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_OR_PASSWORD_NOT_EXISTS,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            req.user = user
            return true
          }
        }
      },
      password: passwordSchema
    },
    ['body']
  )
)

// --- Access token validator
export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        isString: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.ACCESS_TOKEN_NOT_EMPTY
              })
            }
            try {
              const decoded_access_token = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              const { user_id } = decoded_access_token
              const [user] = await db.select().from(users).where(eq(users.id, user_id)).limit(1)
              if (!user) {
                throw new ErrorStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: AUTH_MESSAGE.ACCESS_TOKEN_NOT_EXISTS
                })
              }
              req.decoded_access_token = decoded_access_token as TokenPayload
            } catch (error) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.ACCESS_TOKEN_INVALID
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

// --- Refresh token validator ---
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                status: HTTP_STATUS.UNAUTHORIZED,
                message: AUTH_MESSAGE.REFRESH_TOKEN_NOT_EMPTY
              })
            }
            try {
              const [decoded_refresh_token, [refresh_token]] = await Promise.all([
                verifyToken({
                  token: value,
                  secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                }),
                db.select().from(refresh_tokens).where(eq(refresh_tokens.token, value)).limit(1)
              ])
              if (!refresh_token) {
                throw new ErrorStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: AUTH_MESSAGE.REFRESH_TOKEN_NOT_EXISTS
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorStatus({
                  status: HTTP_STATUS.UNAUTHORIZED,
                  message: AUTH_MESSAGE.REFRESH_TOKEN_INVALID
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

// --- Change password validator ---
export const changePasswordValidator = validate(
  checkSchema(
    {
      current_password: {
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: AUTH_MESSAGE.PASSWORD_INVALID_LENGTH
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.PASSWORD_NOT_EMPTY,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            const password = hashPassword(value)
            const user_id = req.decoded_access_token.user_id
            const [user] = await db
              .select()
              .from(users)
              .where(and(eq(users.id, user_id), eq(users.password, password)))
            if (!user) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.PASSWORD_NOT_EXISTS,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      },
      new_password: passwordSchema,
      confirm_password: {
        isString: true,
        isLength: {
          options: {
            min: 6,
            max: 180
          },
          errorMessage: AUTH_MESSAGE.CONFIRM_PASSWORD_INVALID_LENGTH
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.new_password) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.CONFIRM_PASSWORD_INVALID,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

// --- Verify User ---
export const verifyUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_access_token as TokenPayload
  if (verify !== UserVerifyStatus.Verifyed) {
    return next(
      new ErrorStatus({
        message: AUTH_MESSAGE.USER_NOT_VERIFIED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    )
  }
  next()
}

// --- Forgot password validator ---
export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGE.EMAIL_NOT_EMPTY
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const [user] = await db.select().from(users).where(eq(users.email, value)).limit(1)
            if (!user) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_NOT_EXISTS,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

// --- Verify forgot password validator ---
export const verifyForgotPasswordValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

// --- Reset password validator ---
export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

// --- Verify email validator ---
export const verifyEmailValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        isString: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_VERIFY_TOKEN_NOT_EMPTY,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })
              req.decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              throw new ErrorStatus({
                message: AUTH_MESSAGE.EMAIL_VERIFY_TOKEN_INVALID,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
