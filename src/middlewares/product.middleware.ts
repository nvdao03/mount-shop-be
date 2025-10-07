import { checkSchema } from 'express-validator'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { PRODUCT_MESSAGE } from '~/constants/message'
import { brandIdSchema } from '~/middlewares/brand.middleware'
import { categoryIdSchema } from '~/middlewares/category.middleware'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

// --- Add product validator ---
export const addProductValidator = validate(
  checkSchema(
    {
      name: {
        isString: true,
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_NAME_NOT_EMPTY
        },
        isLength: {
          options: { min: 2, max: 180 },
          errorMessage: PRODUCT_MESSAGE.PRODUCT_NAME_INVALID_LENGTH
        },
        trim: true
      },
      image: {
        isString: true,
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_IMAGE_NOT_EMPTY
        },
        isURL: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_IMAGE_INVALID
        },
        trim: true
      },
      images: {
        optional: true,
        isArray: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_IMAGES_MUST_BE_ARRAY
        }
      },
      description: {
        isString: true,
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_NOT_EMPTY
        },
        isLength: {
          options: { min: 2 },
          errorMessage: PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_INVALID_LENGTH
        }
      },
      price: {
        isNumeric: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_PRICE_INVALID
        },
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_PRICE_NOT_EMPTY
        }
      },
      discount_price: {
        isNumeric: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_INVALID
        },
        optional: true,
        custom: {
          options: (value, { req }) => {
            const price = Number(req.body.price)
            const discount_price = Number(value)
            if (discount_price < price) {
              throw new ErrorStatus({
                message: PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_GT_PRICE,
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      },
      rating: {
        isNumeric: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_RATING_INVALID
        },
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_RATING_NOT_EMPTY
        },
        trim: true
      },
      sold: {
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCT_MESSAGE.PRODUCT_SOLD_INVALID
        },
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_SOLD_NOT_EMPTY
        },
        trim: true
      },
      stock: {
        isInt: {
          options: { min: 0 },
          errorMessage: PRODUCT_MESSAGE.PRODUCT_STOCK_INVALID
        },
        notEmpty: {
          errorMessage: PRODUCT_MESSAGE.PRODUCT_STOCK_NOT_EMPTY
        },
        trim: true
      },
      category_id: categoryIdSchema,
      brand_id: brandIdSchema
    },
    ['body']
  )
)
