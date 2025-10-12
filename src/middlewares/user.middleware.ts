import { checkSchema } from 'express-validator'
import { AUTH_MESSAGE, USER_MESSAGE } from '~/constants/message'
import { validate } from '~/utils/validation'

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
