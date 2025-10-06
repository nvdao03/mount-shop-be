import { checkSchema, ParamSchema } from 'express-validator'
import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { BRAND_MESSAGE } from '~/constants/message'
import { brands } from '~/db/schema'
import { ErrorStatus } from '~/utils/Errors'
import { validate } from '~/utils/validation'
import { categoryIdSchema } from '~/middlewares/category.middleware'
import { and, not, ne } from 'drizzle-orm'

// --- Common validator ---
export const nameBrandSchema: ParamSchema = {
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
}

export const imageBrandSchema: ParamSchema = {
  isString: true,
  notEmpty: {
    errorMessage: BRAND_MESSAGE.BRAND_IMAGE_NOT_EMPTY
  },
  isURL: {
    errorMessage: BRAND_MESSAGE.BRAND_IMAGE_INVALID
  },
  trim: true
}

// --- Check brand id validator ---
export const checkBrandId = validate(
  checkSchema(
    {
      brand_id: {
        isInt: {
          errorMessage: BRAND_MESSAGE.BRAND_INVALID_ID
        },
        toInt: true,
        custom: {
          options: async (value, { req }) => {
            if (value === undefined || value === null || value === '') {
              throw new ErrorStatus({
                message: BRAND_MESSAGE.BRAND_ID_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            const [brand] = await db.select().from(brands).where(eq(brands.id, value)).limit(1)

            if (!brand) {
              throw new ErrorStatus({
                message: BRAND_MESSAGE.BRAND_NOT_FOUND,
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

// --- Add Brand validator ---
export const addBrandValidator = validate(
  checkSchema(
    {
      name: nameBrandSchema,
      image: imageBrandSchema,
      category_id: categoryIdSchema
    },
    ['body']
  )
)

// --- Update Brand validator ---
export const updateBrandValidator = validate(
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
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (value === '' || value === undefined || value === null) {
              throw new ErrorStatus({
                message: BRAND_MESSAGE.BRAND_NAME_NOT_EMPTY,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            const brand_id = Number(req.params?.brand_id)
            const [brand] = await db
              .select()
              .from(brands)
              .where(and(eq(brands.name, value), ne(brands.id, brand_id)))
              .limit(1)
            if (brand) {
              throw new ErrorStatus({
                message: BRAND_MESSAGE.BRAND_NAME_EXISTS,
                status: HTTP_STATUS.CONFLICT
              })
            }
            return true
          }
        }
      },
      image: imageBrandSchema
    },
    ['body']
  )
)
