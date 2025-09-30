export interface TokenPayload {
  user_id: number
  token_type: string
  verify: number
  iat: number
  exp: number
}

export interface RegisterRequestBody {
  full_name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginRequestBody {
  email: string
  password: string
}

export interface LogoutRequestBody {
  refresh_token: string
}
