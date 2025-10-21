import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import {
  AddProductRequestBody,
  ProductAllQueryParams,
  ProductQueryParams,
  UpdateProductRequestBody
} from '~/requests/product.request'
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
      price_before_discount: product.price_before_discount,
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

// --- Update Product ---
export const updateProductController = async (
  req: Request<ParamsDictionary, any, UpdateProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const product_id = Number(req.params.product_id)
  const result = await productService.updateProduct(req.body, product_id)
  const { product, category, brand } = result
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGE.UPDATE_PRODUCT_SUCCESS,
    data: {
      id: product.id,
      name: product.name,
      image: product.image,
      images: product.images,
      description: product.description,
      price_before_discount: product.price_before_discount,
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

// --- Delete Product ---
export const deleteProductController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const product_id = Number(req.params.product_id)
  const product = (req as Request).product
  const category_id = product?.category_id as number
  const brand_id = product?.brand_id as number
  const result = await productService.deleteProduct(product_id, brand_id, category_id)
  const { product: productRes, category, brand } = result
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGE.DELETE_PRODUCT_SUCCESS,
    data: {
      id: productRes.id,
      name: productRes.name,
      image: productRes.image,
      images: productRes.images,
      description: productRes.description,
      price_before_discount: productRes.price_before_discount,
      price: productRes.price,
      rating: productRes.rating,
      sold: productRes.sold,
      stock: productRes.stock,
      category: {
        id: category.id,
        name: category.name
      },
      brand: {
        id: brand.id,
        name: brand.name
      },
      createAt: productRes.createdAt,
      updateAt: productRes.updatedAt
    }
  })
}

// --- Get Product Detail ---
export const getProductDetailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const product_id = Number(req.params.product_id)
  const category_id = (req as Request).product?.category_id as number
  const brand_id = (req as Request).product?.brand_id as number
  const result = await productService.getProductDetail(product_id, brand_id, category_id)
  const { brand, category, product } = result
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGE.GET_PRODUCT_DETAIL_SUCCESS,
    data: {
      id: product.id,
      name: product.name,
      image: product.image,
      images: product.images,
      description: product.description,
      price_before_discount: product.price_before_discount,
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

// --- Get Products ---
export const getProductsController = async (
  req: Request<ParamsDictionary, any, any, ProductQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const query = req.query
  const result = await productService.getProducts(query)
  const { productList, page, limit, total_page, total } = result
  return res.status(HTTP_STATUS.OK).json({
    message: PRODUCT_MESSAGE.GET_PRODUCTS_SUCCESS,
    data: {
      products: productList,
      pagination: {
        page: page,
        total: total,
        limit: limit,
        total_page: total_page
      }
    }
  })
}
