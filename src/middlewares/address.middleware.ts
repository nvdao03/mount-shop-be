import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ADDRESS_MESSAGE } from '~/constants/message'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

export const addAddressValidator = validate(
  checkSchema(
    {
      address: {
        isString: true,
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: ADDRESS_MESSAGE.ADDRESS_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      phone: {
        isString: true,
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: ADDRESS_MESSAGE.PHONE_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            return true
          }
        }
      },
      full_name: {
        isString: true,
        isLength: {
          options: { min: 6, max: 180 },
          errorMessage: ADDRESS_MESSAGE.FULLNAME_INVALID_LENGTH
        },
        trim: true,
        custom: {
          options: (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: ADDRESS_MESSAGE.FULLNAME_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
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
