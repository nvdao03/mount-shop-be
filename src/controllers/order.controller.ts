import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddOrderRequestBody } from '~/requests/order.request'
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
