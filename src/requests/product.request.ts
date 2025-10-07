export interface AddProductRequestBody {
  name: string
  image: string
  images: string[]
  description: string
  discount_price: number
  price: number
  rating: string
  sold: number
  stock: number
  category_id: number
  brand_id: number
}

export interface UpdateProductRequestBody {
  name?: string
  image?: string
  images?: string[]
  description?: string
  discount_price?: number
  price?: number
  rating?: string
  sold?: number
  stock?: number
  category_id?: number
  brand_id?: number
}

export interface ProductAllQueryParams {
  limit: string
  page: string
}

export interface ProductQueryParams {
  limit: string
  page: string
  category?: string // Truyền category_id
  brands?: string[] // Truyền mảng brand_id
  search?: string
  min_price?: string
  max_price?: string
  rating?: string
  order?: 'asc' | 'desc'
}
