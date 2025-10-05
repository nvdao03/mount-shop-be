import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import categoryService from '~/services/category.service'
import { AddCategoryRequestBody, UpdateCategoryRequestBody } from '~/requests/category.request'
import { CATEGORY_MESSAGE } from '~/constants/message'

// --- Add Category ---
export const addCategoryController = async (
  req: Request<ParamsDictionary, any, AddCategoryRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await categoryService.addCategory(req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: CATEGORY_MESSAGE.ADD_CATEGORY_SUCCESS,
    data: result
  })
}

// --- Update Category ---
export const updateCategoryController = async (
  req: Request<ParamsDictionary, any, UpdateCategoryRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { category_id } = req.params
  const result = await categoryService.updateCategory(Number(category_id), req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: CATEGORY_MESSAGE.UPDATE_CATEGORY_SUCCESS,
    data: result
  })
}

// --- Delete Category ---
export const deleteCategoryController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { category_id } = req.params
  const result = await categoryService.deleteCategory(Number(category_id))
  return res.status(HTTP_STATUS.OK).json({
    message: CATEGORY_MESSAGE.DELETE_CATEGORY_SUCCESS,
    data: result
  })
}
