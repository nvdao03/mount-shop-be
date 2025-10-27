import { eq, Param } from 'drizzle-orm'
import { checkSchema, ParamSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { CART_MESSAGE, PRODUCT_MESSAGE } from '~/constants/message'
import { carts, Products, products } from '~/db/schema'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

// --- Common validator ---
const cartIdSchema: ParamSchema = {
  isInt: {
    errorMessage: CART_MESSAGE.CART_ID_INVALID
  },
  toInt: true,
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorStatus({
          message: CART_MESSAGE.CART_ID_NOT_EMPTY,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      const [cart] = await db.select().from(carts).where(eq(carts.id, value)).limit(1)
      if (!cart) {
        throw new ErrorStatus({
          message: CART_MESSAGE.CART_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return true
    }
  }
}

// --- Add cart validator ---
export const addCartValidator = validate(
  checkSchema(
    {
      product_id: {
        isInt: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_ID_INVALID
        },
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_ID_NOT_EMPTY
        },
        toInt: true,
        trim: true,
        custom: {
          options: async (value: number, { req }) => {
            const [product] = await db.select().from(products).where(eq(products.id, value)).limit(1)
            if (!product) {
              throw new ErrorStatus({
                message: PRODUCT_MESSAGE.PRODUCT_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            return true
          }
        }
      },
      quantity: {
        isInt: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_QUANTITY_INVALID
        },
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_QUANTITY_NOT_EMPTY
        },
        toInt: true
      }
    },
    ['body']
  )
)

// --- Delete cart validator ---
export const deleteCartValidator = validate(
  checkSchema(
    {
      cart_id: cartIdSchema
    },
    ['params']
  )
)

// --- Check cart id validator ---
export const checkCartIdValidator = validate(
  checkSchema(
    {
      cart_id: cartIdSchema
    },
    ['params']
  )
)

// --- Update cart validator ---
export const updateCartValidator = validate(
  checkSchema(
    {
      quantity: {
        isInt: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_QUANTITY_INVALID
        },
        toInt: true,
        custom: {
          options: (value, { req }) => {
            if (!value) {
              throw new ErrorStatus({
                message: PRODUCT_MESSAGE.PRODUCT_QUANTITY_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            if (value <= 0) {
              throw new ErrorStatus({
                message: PRODUCT_MESSAGE.PRODUCT_QUANTITY_INVALID,
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
