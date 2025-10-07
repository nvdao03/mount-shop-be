import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddProductRequestBody } from '~/requests/product.request'
import productService from '~/services/product.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { PRODUCT_MESSAGE } from '~/constants/message'

// --- Add Product ---
export const addProductController = async (
  req: Request<ParamsDictionary, any, AddProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await productService.addProduct(req.body)
  const { product, brand, category } = result
  return res.status(HTTP_STATUS.CREATED).json({
    message: PRODUCT_MESSAGE.ADD_PRODUCT_SUCCESS,
    data: {
      id: product.id,
      name: product.name,
      image: product.image,
      images: product.images,
      description: product.description,
      discount_price: product.discount_price,
      price: product.price,
      rating: product.rating,
      sold: product.sold,
      stock: product.stock,
      category: {
        id: category.id,
        name: category.name
      },
      brand: {
        id: brand.id,
        name: brand.name
      },
      createAt: product.createdAt,
      updateAt: product.updatedAt
    }
  })
}
