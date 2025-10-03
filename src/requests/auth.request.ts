export interface TokenPayload {
  user_id: number
  token_type: string
  verify: string
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

export interface ChangePasswordRequestBody {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}

export interface ResetPasswordRequestBody {
  password: string
  confirm_password: string
}
