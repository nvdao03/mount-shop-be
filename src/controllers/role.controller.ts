import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ROLE_MESSAGES } from '~/constants/message'
import roleService from '~/services/role.service'

export const getRolesController = async (req: Request, res: Response, next: NextFunction) => {
  const result = await roleService.getRoles()
  return res.status(HTTP_STATUS.OK).json({
    message: ROLE_MESSAGES.GET_ROLES_SUCCESS,
    data: {
      roles: [...result]
    }
  })
}
