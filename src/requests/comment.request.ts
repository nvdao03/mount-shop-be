export interface AddCommentRequestBody {
  product_id: number
  content: string
}

export interface CommentQueryParams {
  limit: string
  page: string
  search?: string
}
