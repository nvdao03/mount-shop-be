import { Categories, User } from '~/db/schema'

declare module 'express' {
  interface Request {
    user?: User
    category?: Categories
    decoded_refresh_token?: TokenPayload
    decoded_access_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
