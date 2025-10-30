export interface AddOrderRequestBody {
  total_price: number
  address_id: number
  cart_ids: number[]
}

export interface OrderQueryParams {
  limit: string
  page: string
  status: string
}

export interface UpdateOrderCancelRequestBody {
  cancel_reason: string
  status: string
}

export interface AdminGetOrdersQueryParams {
  limit: string
  page: string
  search?: string
  status?: string
}

export interface UpdateOrderRequestBody {
  cancel_reason: string
  status: string
}
