import { eq } from 'drizzle-orm'
import { checkSchema, ParamSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { PRODUCT_MESSAGE } from '~/constants/message'
import { Products, products } from '~/db/schema'
import { brandIdSchema } from '~/middlewares/brand.middleware'
import { categoryIdSchema } from '~/middlewares/category.middleware'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'

// --- Common validator ---
const nameProductSchema: ParamSchema = {
  isString: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_NAME_NOT_EMPTY
  },
  isLength: {
    options: { min: 2, max: 180 },
    errorMessage: PRODUCT_MESSAGE.PRODUCT_NAME_INVALID_LENGTH
  },
  trim: true
}

const imageProductSchema: ParamSchema = {
  isString: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_IMAGE_NOT_EMPTY
  },
  isURL: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_IMAGE_INVALID
  },
  trim: true
}

const imagesProductSchema: ParamSchema = {
  optional: true,
  isArray: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_IMAGES_MUST_BE_ARRAY
  }
}

const descriptionProductSchema: ParamSchema = {
  isString: true,
  trim: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_NOT_EMPTY
  },
  isLength: {
    options: { min: 2 },
    errorMessage: PRODUCT_MESSAGE.PRODUCT_DESCRIPTION_INVALID_LENGTH
  }
}

const priceProductSchema: ParamSchema = {
  isInt: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_PRICE_INVALID
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_PRICE_NOT_EMPTY
  },
  custom: {
    options: (value, { req }) => {
      const price_before_discount = Number(req.body.price_before_discount)
      const price = Number(value)
      if (price_before_discount === 0) {
        return true
      } else if (price > price_before_discount) {
        throw new ErrorStatus({
          message: PRODUCT_MESSAGE.PRODUCT_PRICE_INVALID,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      return true
    }
  }
}

const priceBeforeDiscountProductSchema: ParamSchema = {
  isInt: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_DISCOUNT_PRICE_INVALID
  },
  optional: true
}

const soldProductSchema: ParamSchema = {
  isInt: {
    options: { min: 0 },
    errorMessage: PRODUCT_MESSAGE.PRODUCT_SOLD_INVALID
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_SOLD_NOT_EMPTY
  },
  trim: true
}

const ratingProductSchema: ParamSchema = {
  isNumeric: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_RATING_INVALID
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_RATING_NOT_EMPTY
  },
  trim: true
}

const stockProductSchema: ParamSchema = {
  isInt: {
    options: { min: 0 },
    errorMessage: PRODUCT_MESSAGE.PRODUCT_STOCK_INVALID
  },
  notEmpty: {
    errorMessage: PRODUCT_MESSAGE.PRODUCT_STOCK_NOT_EMPTY
  },
  trim: true
}

// --- Add product validator ---
export const addProductValidator = validate(
  checkSchema(
    {
      name: nameProductSchema,
      image: imageProductSchema,
      images: imagesProductSchema,
      description: descriptionProductSchema,
      price: priceProductSchema,
      price_before_discount: priceBeforeDiscountProductSchema,
      rating: ratingProductSchema,
      sold: soldProductSchema,
      stock: stockProductSchema,
      category_id: categoryIdSchema,
      brand_id: brandIdSchema
    },
    ['body']
  )
)

// --- Check product id validator ---
export const checkProductId = validate(
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
            req.product = product as Products
            return true
          }
        }
      }
    },
    ['params']
  )
)

// --- Update product validator ---
export const updateProductValidator = validate(
  checkSchema(
    {
      name: nameProductSchema,
      image: imageProductSchema,
      images: imagesProductSchema,
      description: descriptionProductSchema,
      price: priceProductSchema,
      price_before_discount: priceBeforeDiscountProductSchema,
      rating: ratingProductSchema,
      sold: soldProductSchema,
      stock: stockProductSchema,
      category_id: categoryIdSchema,
      brand_id: brandIdSchema
    },
    ['body']
  )
)
