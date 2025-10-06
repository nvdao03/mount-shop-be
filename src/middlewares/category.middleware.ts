import { checkSchema, ParamSchema } from 'express-validator'
import { db } from '~/configs/postgreSQL.config'
import { CATEGORY_MESSAGE } from '~/constants/message'
import { categories } from '~/db/schema'
import { validate } from '~/utils/validation'
import { eq } from 'drizzle-orm'
import { ErrorStatus } from '~/utils/Errors'
import { HTTP_STATUS } from '~/constants/httpStatus'

// --- Common schema ---
export const categoryIdSchema: ParamSchema = {
  isInt: {
    errorMessage: CATEGORY_MESSAGE.CATEGORY_INVALID_ID
  },
  toInt: true,
  custom: {
    options: async (value) => {
      if (value === undefined || value === null || value === '') {
        throw new ErrorStatus({
          message: CATEGORY_MESSAGE.CATEGORY_ID_NOT_EMPTY,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }

      const [category] = await db.select().from(categories).where(eq(categories.id, value)).limit(1)

      if (!category) {
        throw new ErrorStatus({
          message: CATEGORY_MESSAGE.CATEGORY_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      return true
    }
  }
}

export const nameCategorySchema: ParamSchema = {
  isString: true,
  notEmpty: {
    errorMessage: CATEGORY_MESSAGE.CATEGORY_NAME_NOT_EMPTY
  },
  isLength: {
    options: {
      min: 2,
      max: 180
    },
    errorMessage: CATEGORY_MESSAGE.CATEGORY_NAME_INVALID_LENGTH
  },
  trim: true,
  custom: {
    options: async (value, { req }) => {
      const [category] = await db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.name, value))
        .limit(1)
      if (category) {
        throw new ErrorStatus({
          message: CATEGORY_MESSAGE.CATEGORY_NAME_EXISTS,
          status: HTTP_STATUS.CONFLICT
        })
      }
      return true
    }
  }
}

export const imageCategorySchema: ParamSchema = {
  isString: true,
  notEmpty: {
    errorMessage: CATEGORY_MESSAGE.CATEGORY_IMAGE_NOT_EMPTY
  },
  isURL: {
    errorMessage: CATEGORY_MESSAGE.CATEGORY_IMAGE_INVALID
  },
  trim: true
}

// --- Check category id validator ---
export const checkCategoryId = validate(
  checkSchema(
    {
      category_id: categoryIdSchema
    },
    ['params']
  )
)

// --- Add category validator ---
export const addCategoryValidator = validate(
  checkSchema(
    {
      name: nameCategorySchema,
      image: imageCategorySchema
    },
    ['body']
  )
)

// --- Update category validator ---
export const updateCategoryValidator = validate(
  checkSchema(
    {
      name: nameCategorySchema,
      image: imageCategorySchema
    },
    ['body']
  )
)
