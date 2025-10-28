import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddAddressRequestBody } from '~/requests/address.request'
import { TokenPayload } from '~/requests/auth.request'
import addressService from '~/services/address.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ADDRESS_MESSAGE } from '~/constants/message'

// --- Add Address ---
export const addAddressController = async (
  req: Request<ParamsDictionary, any, AddAddressRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await addressService.addAddress(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: ADDRESS_MESSAGE.ADD_ADDRESS_SUCCESS,
    data: {
      address: {
        ...result
      }
    }
  })
}
