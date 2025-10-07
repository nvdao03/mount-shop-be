export interface AddProductRequestBody {
  name: string
  image: string
  images: string[]
  description: string
  discount_price: string
  price: string
  rating: string
  sold: number
  stock: number
  category_id: number
  brand_id: number
}
