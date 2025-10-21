import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddCommentRequestBody } from '~/requests/comment.request'
import { TokenPayload } from '~/requests/auth.request'
import commentService from '~/services/comment.service'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { COMMENT_MESSAGE } from '~/constants/message'

// --- Add Comment ---
export const addCommentController = async (
  req: Request<ParamsDictionary, any, AddCommentRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_access_token as TokenPayload
  const result = await commentService.addComment(user_id, req.body)
  return res.status(HTTP_STATUS.CREATED).json({
    message: COMMENT_MESSAGE.ADD_COMMENT_SUCCESS,
    data: {
      comment: {
        ...result
      }
    }
  })
}

// --- Delete comment ---//
export const deleteCmmentController = async (
  req: Request<ParamsDictionary, any, AddCommentRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { comment_id } = req.params
  const result = await commentService.deleteComment(Number(comment_id))
  return res.status(HTTP_STATUS.OK).json({
    message: COMMENT_MESSAGE.DELETE_COMMENT_SUCCESS,
    data: {
      comment: {
        ...result
      }
    }
  })
}
