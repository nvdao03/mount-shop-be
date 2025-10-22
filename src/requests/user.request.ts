export interface UpdateProfileRequestBody {
  full_name?: string
  avatar?: string
  phone?: string
  address?: string
}

export interface UpdateUserRoleRequestBody {
  user_id: number
  role_id: number
}

export interface GetUsersQueryParams {
  limit: string
  page: string
  search?: string
}
