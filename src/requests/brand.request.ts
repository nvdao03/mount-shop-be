export interface AddBrandRequestBody {
  name: string
  image: string
  category_id: string
}

export interface UpdateBrandRequestBody {
  name?: string
  image?: string
}

export interface BrandQueryParams {
  limit: string
  page: string
  search?: string
}
