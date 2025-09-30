import authService from '~/services/auth.service'
import { AUTH_MESSAGE } from './../constants/message'
import { checkSchema, ParamSchema } from 'express-validator'
import { ErrorStatus } from '~/utils/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { db } from '~/configs/postgreSQL.config'
import { users } from '~/db/schema'
import { and, eq } from 'drizzle-orm'
import hashPassword from '~/utils/crypto'
import { validate } from '~/utils/validation'

// --- Common schema ---
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
