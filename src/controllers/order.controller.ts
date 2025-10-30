import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import {
  AddOrderRequestBody,
  AdminGetOrdersQueryParams,
  OrderQueryParams,
  UpdateOrderCancelRequestBody,
  UpdateOrderRequestBody
} from '~/requests/order.request'
import { TokenPayload } from '~/requests/auth.request'
import orderService from '~/services/order.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ORDER_MESSAGE } from '~/constants/message'

// --- Add Order ---
export const addOrderController = async (
  req: Request<ParamsDictionary, any, AddOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await orderService.addOrder(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: ORDER_MESSAGE.ADD_ORDER_SUCCESS,
    data: {
      order: {
        ...result
      }
    }
  })
}

// --- Get Orders ---
export const getOrdersController = async (
  req: Request<ParamsDictionary, any, any, OrderQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const page = Number(req.query.page as string) || 1
  const limit = Number(req.query.limit as string) || 15
  const { status } = req.query
  const result = await orderService.getOrders(user_id, status, limit, page)
  const { orderList, total_page } = result
  return res.status(HTTP_STATUS.OK).json({
    message: ORDER_MESSAGE.GET_ORDERS_SUCCESS,
    data: {
      orders: orderList,
      pagination: {
        page,
        limit,
        total_page
      }
    }
  })
}

// --- Get Order Detail ---
export const getOrderDetailController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params
  const result = await orderService.getOrderDetail(Number(order_id))
  return res.status(HTTP_STATUS.OK).json({
    message: ORDER_MESSAGE.GET_ORDER_DETAIL_SUCCESS,
    data: {
      ...result
    }
  })
}

// --- Update Order Cancel ---
export const updateOrderCancelController = async (
  req: Request<ParamsDictionary, any, UpdateOrderCancelRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params
  const result = await orderService.updateOrderCancel(Number(order_id), req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDER_MESSAGE.UPDATE_ORDER_CANCEL_SUCCESS,
    data: {
      order: {
        ...result
      }
    }
  })
}

// --- Admin Get Orders ---
export const getOrdersAllController = async (
  req: Request<ParamsDictionary, any, any, AdminGetOrdersQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const page = Number(req.query.page as string) || 1
  const limit = Number(req.query.limit as string) || 15
  const search = Number(req.query.search as string)
  const status = req.query.status as string
  const result = await orderService.getOrdersAll(limit, page, search, status)
  const { total_page, orderList } = result
  return res.status(HTTP_STATUS.OK).json({
    message: ORDER_MESSAGE.GET_ORDERS_ALL_SUCCESS,
    data: {
      orders: orderList,
      pagination: {
        page,
        limit,
        total_page
      }
    }
  })
}

export const updateOrderController = async (
  req: Request<ParamsDictionary, any, UpdateOrderRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.params
  const result = await orderService.updateOrder(Number(order_id), req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: ORDER_MESSAGE.UPDATE_ORDER_SUCCESS,
    data: {
      order: {
        ...result
      }
    }
  })
}
