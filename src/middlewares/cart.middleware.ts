import { eq } from 'drizzle-orm'
import { checkSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { PRODUCT_MESSAGE } from '~/constants/message'
import { Products, products } from '~/db/schema'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

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
