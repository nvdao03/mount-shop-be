export interface UpdateProfileRequestBody {
  full_name?: string
  avatar?: string
  phone?: string
  address?: string
}

export interface GetUsersQueryParams {
  limit: string
  page: string
  search?: string
}
