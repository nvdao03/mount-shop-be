import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { DASHBOARD_MESSAGE } from '~/constants/message'
import dashboardService from '~/services/dashboard.service'

export const getDashboardController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await dashboardService.getDashboard()
  const { orderList, totalOrder, totalProduct, totalRevenue, totalUser } = result
  return res.status(HTTP_STATUS.OK).json({
    message: DASHBOARD_MESSAGE.GET_DASHBOARD_SUCCESS,
    data: {
      dashboard: {
        orders: [...orderList],
        totalOrder: totalOrder || 0,
        totalProduct: totalProduct || 0,
        totalRevenue: totalRevenue || 0,
        totalUser: totalUser || 0
      }
    }
  })
}
