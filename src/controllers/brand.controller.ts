import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddBrandRequestBody, BrandQueryParams, UpdateBrandRequestBody } from './../requests/brand.request'
import brandService from '~/services/brand.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { BRAND_MESSAGE } from '~/constants/message'

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

// --- Update Brand ---
export const updateBrandController = async (
  req: Request<ParamsDictionary, any, UpdateBrandRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { brand_id } = req.params
  const result = await brandService.updateBrand(Number(brand_id), req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: BRAND_MESSAGE.UPDATE_BRAND_SUCCESS,
    data: result
  })
}

// --- Delete Brand ---
export const deleteBrandController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { brand_id } = req.params
  const result = await brandService.deleteBrand(Number(brand_id))
  return res.status(HTTP_STATUS.OK).json({
    message: BRAND_MESSAGE.DELETE_BRAND_SUCCESS,
    data: result
  })
}

// --- Get Brand Detail ---
export const getBrandDetailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { brand_id } = req.params
  const result = await brandService.getBrandDetail(Number(brand_id))
  return res.status(HTTP_STATUS.OK).json({
    message: BRAND_MESSAGE.GET_BRAND_DETAIL_SUCCESS,
    data: result
  })
}

// --- Get All Brands ---
export const getAllBrandsController = async (
  req: Request<ParamsDictionary, any, any, BrandQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await brandService.getAllBrands({ limit, page })
  return res.status(HTTP_STATUS.OK).json({
    message: BRAND_MESSAGE.GET_ALL_BRANDS_SUCCESS,
    data: {
      brands: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total_page: result.total_page
      }
    }
  })
}
