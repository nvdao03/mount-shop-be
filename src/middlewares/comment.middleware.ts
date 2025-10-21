import { eq } from 'drizzle-orm'
import { checkSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { COMMENT_MESSAGE, PRODUCT_MESSAGE } from '~/constants/message'
import { comments, products } from '~/db/schema'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

// --- Add comment validator --- //
export const addCommentValidator = validate(
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
      content: {
        isString: true,
        notEmpty: {
          errorMessage: COMMENT_MESSAGE.COMMENT_CONTENT_NOT_EMPTY
        },
        trim: true
      }
    },
    ['body']
  )
)

// --- Delete comment validator --- //
export const deleteCommnetValidator = validate(
  checkSchema(
    {
      comment_id: {
        isInt: {
          errorMessage: COMMENT_MESSAGE.COMMENT_ID_INVALID
        },
        notEmpty: {
          errorMessage: COMMENT_MESSAGE.COMMENT_ID_NOT_EMPTY
        },
        toInt: true,
        custom: {
          options: async (value, { req }) => {
            const [comment] = await db.select().from(comments).where(eq(value, comments.id)).limit(1)
            if (!comment) {
              throw new ErrorStatus({
                message: COMMENT_MESSAGE.COMMENT_NOT_FOUND,
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
