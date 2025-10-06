import { checkSchema } from 'express-validator'
import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { BRAND_MESSAGE } from '~/constants/message'
import { brands } from '~/db/schema'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'
import { categoryIdSchema } from '~/middlewares/category.middleware'

// --- Add Brand validator ---
export const addBrandValidator = validate(
  checkSchema(
    {
      name: {
        isString: true,
        notEmpty: {
          errorMessage: BRAND_MESSAGE.BRAND_NAME_NOT_EMPTY
        },
        isLength: {
          options: {
            min: 2,
            max: 180
          },
          errorMessage: BRAND_MESSAGE.BRAND_NAME_INVALID_LENGTH
        },
        trim: true
      },
      image: {
        isString: true,
        notEmpty: {
          errorMessage: BRAND_MESSAGE.BRAND_IMAGE_NOT_EMPTY
        },
        isURL: {
          errorMessage: BRAND_MESSAGE.BRAND_IMAGE_INVALID
        },
        trim: true
      },
      category_id: categoryIdSchema
    },
    ['body']
  )
)
