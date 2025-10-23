import { eq } from 'drizzle-orm'
import { checkSchema, ParamSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { AUTH_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { roles, users } from '~/db/schema'
import { passwordSchema } from '~/middlewares/auth.middleware'
import authService from '~/services/auth.service'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

const roleIdSchema: ParamSchema = {
  custom: {
    options: async (values, { req }) => {
      if (!values) {
        throw new ErrorStatus({
          message: USER_MESSAGE.ROLE_ID_NOT_EMPTY,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      const [role] = await db.select().from(roles).where(eq(roles.id, values)).limit(1)
      if (!role) {
        throw new ErrorStatus({
          message: USER_MESSAGE.ROLE_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return true
    }
  }
}

// --- Update profile validator ---
export const updateProfileValidator = validate(
  checkSchema(
    {
      full_name: {
        isString: true,
        isLength: {
          options: { min: 6, max: 180 },
          errorMessage: AUTH_MESSAGE.FULLNAME_INVALID_LENGTH
        },
        trim: true
      },
      phone: {
        isString: true,
        isLength: {
          options: { min: 10, max: 20 },
          errorMessage: USER_MESSAGE.PHONE_INVALID_LENGTH
        },
        trim: true,
        optional: {
          options: { nullable: true, checkFalsy: true }
        }
      },
      avatar: {
        isString: true,
        isURL: {
          errorMessage: USER_MESSAGE.AVATAR_INVALID
        },
        trim: true,
        optional: {
          options: { nullable: true, checkFalsy: true }
        }
      },
      address: {
        isString: true,
        isLength: {
          options: { min: 2, max: 255 },
          errorMessage: USER_MESSAGE.ADDRESS_INVALID_LENGTH
        },
        trim: true,
        optional: {
          options: { nullable: true, checkFalsy: true }
        }
      }
    },
    ['body']
  )
)

// --- Update user role validator ---
export const updateUserRoleValidator = validate(
  checkSchema(
    {
      user_id: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: USER_MESSAGE.USER_ID_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const [user] = await db.select().from(users).where(eq(users.id, value)).limit(1)
            if (!user) {
              throw new ErrorStatus({
                message: USER_MESSAGE.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      },
      role_id: roleIdSchema
    },
    ['body']
  )
)

// --- Admin Add User validator ---
export const adminAddUserValidator = validate(
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
      role_id: roleIdSchema
    },
    ['body']
  )
)
