import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddCartRequestBody, UpdateCartRequestBody } from '~/requests/cart.request'
import { TokenPayload } from '~/requests/auth.request'
import cartService from '~/services/cart.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { CART_MESSAGE } from '~/constants/message'

// --- Add cart controller ---
export const addCartController = async (
  req: Request<ParamsDictionary, any, AddCartRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await cartService.addCart(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: CART_MESSAGE.ADD_CART_SUCCESS,
    data: {
      carts: {
        ...result
      }
    }
  })
}

// --- Get carts controller ---
export const getCartsController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await cartService.getCarts(user_id)
  const { cartList, total } = result
  return res.status(HTTP_STATUS.OK).json({
    message: CART_MESSAGE.GET_CART_SUCCESS,
    data: {
      carts: [...cartList],
      total
    }
  })
}

// --- Delete cart controller ---
export const deleteCartController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const { cart_id } = req.params
  const result = await cartService.deleteCart(user_id, Number(cart_id))
  return res.status(HTTP_STATUS.OK).json({
    message: CART_MESSAGE.DELETE_CART_SUCCESS,
    data: {
      cart: {
        ...result
      }
    }
  })
}

// --- Update cart controller ---
export const updateCartController = async (
  req: Request<ParamsDictionary, any, UpdateCartRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const { cart_id } = req.params
  const result = await cartService.updateCart(user_id, req.body, Number(cart_id))
  return res.status(HTTP_STATUS.OK).json({
    message: CART_MESSAGE.UPDATE_CART_SUCCESS,
    data: {
      cart: {
        ...result
      }
    }
  })
}
