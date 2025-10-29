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
