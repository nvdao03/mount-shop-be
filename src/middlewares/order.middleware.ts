import { eq, inArray } from 'drizzle-orm'
import { checkSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ORDER_MESSAGE } from '~/constants/message'
import { addresses, carts, orders } from '~/db/schema'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

// --- Add order validator ---
export const addOrderValidator = validate(
  checkSchema(
    {
      total_price: {
        isInt: {
          errorMessage: ORDER_MESSAGE.ORDER_TOTAL_PRICE_INVALID
        },
        notEmpty: {
          errorMessage: ORDER_MESSAGE.ORDER_TOTAL_PRICE_NOT_EMPTY
        },
        toInt: true,
        custom: {
          options: (value, { req }) => {
            if (!value) {
              throw new Error(ORDER_MESSAGE.ORDER_TOTAL_PRICE_NOT_EMPTY)
            }
            if (value <= 0) {
              throw new Error(ORDER_MESSAGE.ORDER_TOTAL_PRICE_INVALID)
            }
            return true
          }
        }
      },
      address_id: {
        isInt: {
          errorMessage: ORDER_MESSAGE.ADDRESS_ID_INVALID
        },
        toInt: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: ORDER_MESSAGE.ADDRESS_ID_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const [address] = await db.select().from(addresses).where(eq(addresses.id, value)).limit(1)
            if (!address) {
              throw new ErrorStatus({
                message: ORDER_MESSAGE.ADDRESS_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      },
      cart_ids: {
        isArray: {
          errorMessage: ORDER_MESSAGE.ORDER_CART_IDS_INVALID
        },
        notEmpty: {
          errorMessage: ORDER_MESSAGE.ORDER_CART_IDS_NOT_EMPTY
        },
        isInt: {
          errorMessage: ORDER_MESSAGE.ORDER_CART_IDS_INVALID
        },
        toInt: true,
        custom: {
          options: async (value, { req }) => {
            const cartList = await db.select().from(carts).where(inArray(carts.id, value))
            if (cartList.length === 0 || cartList.length !== value.length) {
              throw new ErrorStatus({
                message: ORDER_MESSAGE.ORDER_CART_IDS_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
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

// --- Check order id validator ---
export const checkIdOrderValidator = validate(
  checkSchema(
    {
      order_id: {
        isInt: {
          errorMessage: ORDER_MESSAGE.ORDER_ID_INVALID
        },
        toInt: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: ORDER_MESSAGE.ORDER_ID_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const [order] = await db.select().from(orders).where(eq(orders.id, value)).limit(1)
            if (!order) {
              throw new ErrorStatus({
                message: ORDER_MESSAGE.ORDER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
