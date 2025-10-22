import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { AddCommentRequestBody, CommentQueryParams } from '~/requests/comment.request'
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

// --- Get Comments --- //
export const getCommentsController = async (
  req: Request<ParamsDictionary, any, any, CommentQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const product_id = Number(req.params.product_id)
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const result = await commentService.getComments(limit, page, product_id)
  const { total_page, commentList } = result
  return res.status(HTTP_STATUS.OK).json({
    message: COMMENT_MESSAGE.GET_COMMENT_SUCCESS,
    data: {
      comments: [...commentList],
      pagination: {
        page,
        limit,
        total_page
      }
    }
  })
}

export const getCommentAddController = async (
  req: Request<ParamsDictionary, any, any, CommentQueryParams>,
  res: Response,
  next: NextFunction
) => {
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const search = req.query.search as string
  const result = await commentService.getCommentsAll({ limit, page, search })
  const { commentList, total_page } = result
  return res.status(HTTP_STATUS.OK).json({
    message: COMMENT_MESSAGE.GET_COMMENT_SUCCESS,
    data: {
      comments: [...commentList],
      pagination: {
        page,
        limit,
        total_page
      }
    }
  })
}
