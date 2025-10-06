import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddBrandRequestBody } from './../requests/brand.request'
import brandService from '~/services/brand.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { BRAND_MESSAGE } from '~/constants/message'
import { create } from 'lodash'

// --- Add Brand ---
export const addBrandController = async (
  req: Request<ParamsDictionary, any, AddBrandRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await brandService.addBrand(req.body)
  const { brand, category } = result
  return res.status(HTTP_STATUS.CREATED).json({
    message: BRAND_MESSAGE.ADD_BRAND_SUCCESS,
    data: {
      id: brand.id,
      name: brand.name,
      image: brand.image,
      category: category.name,
      createAt: brand.createdAt,
      updateAt: brand.updatedAt
    }
  })
}
