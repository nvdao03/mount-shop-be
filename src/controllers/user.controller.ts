import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USER_MESSAGE } from '~/constants/message'
import { TokenPayload } from '~/requests/auth.request'
import userService from '~/services/user.service'
import {
  AdminAddUserRequestBody,
  GetUsersQueryParams,
  UpdateProfileRequestBody,
  UpdateUserRoleRequestBody
} from '~/requests/user.request'

// --- Get Profile ---
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.getProfile(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.USER_GET_PROFILE_SUCCESS,
    data: result
  })
}

// --- Update Profile ---
export const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.updateProfile(user_id, req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.USER_UPDATE_PROFILE_SUCCESS,
    data: result
  })
}

// --- Get Users ---
export const getUsersController = async (
  req: Request<ParamsDictionary, any, any, GetUsersQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const search = req.query.search as string
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await userService.getUsers({ limit, page, search, user_id })
  const { userList, total_page } = result
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.GET_USERS_SUCCESS,
    data: {
      users: [...userList],
      pagination: {
        page,
        limit,
        total_page
      }
    }
  })
}

// --- Delete User ---
export const deleteUserController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
  next: NextFunction
) => {
  const user_id = Number(req.params.user_id)
  const result = await userService.deleteUser(user_id)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.DELETE_USER_SUCCESS,
    data: {
      user: {
        ...result
      }
    }
  })
}

// --- Update User Role ---
export const updateUserRoleController = async (
  req: Request<ParamsDictionary, any, UpdateUserRoleRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.updateUserRole(req.body)
  return res.status(HTTP_STATUS.OK).json({
    message: USER_MESSAGE.UPDATE_USER_ROLE_SUCCESS,
    data: {
      user: {
        ...result
      }
    }
  })
}

// --- Admin Add User ---
export const addUserController = async (
  req: Request<ParamsDictionary, any, AdminAddUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await userService.adminAddUser(req.body)
  const { address, user, role } = result
  return res.status(HTTP_STATUS.CREATED).json({
    message: USER_MESSAGE.ADMIN_ADD_USER_SUCCESS,
    data: {
      user: {
        id: user.id,
        email: user.email,
        full_name: address.full_name,
        avatar: user.avatar,
        role: role.name,
        role_id: role.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  })
}
