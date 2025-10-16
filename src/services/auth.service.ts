import { RegisterRequestBody, TokenPayload } from './../requests/auth.request'
import { verifyToken } from './../utils/jwt'
import { and, eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { TokenTypes, UserVerifyStatus } from '~/constants/enum'
import { addresses, refresh_tokens, roles, users } from '~/db/schema'
import { signToken } from '~/utils/jwt'
import '../configs/env.config'
import hashPassword from '~/utils/crypto'
import { AUTH_MESSAGE } from '~/constants/message'
import { accessTokenValidator } from '~/middlewares/auth.middleware'
import { sendEmail, sendForgotPasswordEmail, sendVerifyEmail } from '~/utils/email'

class AuthService {
  // --- Sign Access Token ---
  private async signAccessToken({
    user_id,
    verify,
    role
  }: {
    user_id: number
    verify: UserVerifyStatus
    role: string
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.AccessToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as any
      }
    })
  }

  // --- Sign Refresh Token ---
  private async signRefreshToken({
    user_id,
    verify,
    exp,
    role
  }: {
    user_id: number
    verify: UserVerifyStatus
    role: string
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenTypes.RefreshToken,
          verify,
          role,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
        options: {
          algorithm: 'HS256'
        }
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.RefreshToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any
      }
    })
  }

  // --- Sign Email Verify Token ---
  private async signEmailVerifyToken({
    user_id,
    verify,
    role
  }: {
    user_id: number
    verify: UserVerifyStatus
    role: string
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.EmailVerifyToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as any
      }
    })
  }

  // --- Sign Forgot password Token ---
  private async signForgotPasswordToken({
    user_id,
    verify,
    role
  }: {
    user_id: number
    verify: UserVerifyStatus
    role: string
  }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.ForgotPasswordToken,
        verify,
        role
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as any
      }
    })
  }

  // --- Check Email Exists ---
  async checkEmailExists(email: string) {
    const [user] = await db.select({ email: users.email }).from(users).where(eq(users.email, email)).limit(1)
    return Boolean(user)
  }

  // --- Register ---
  async register(data: RegisterRequestBody) {
    const { email, full_name, password } = data
    const [role] = await db.select().from(roles).where(eq(roles.name, 'customer')).limit(1)
    const [insertedUser] = await db
      .insert(users)
      .values({ email, password: hashPassword(password), role_id: role.id })
      .returning({
        user_id: users.id
      })
    const user_id = insertedUser.user_id
    const [email_verify_token, access_token, refresh_token] = await Promise.all([
      this.signEmailVerifyToken({
        user_id,
        verify: UserVerifyStatus.Unverifyed,
        role: role.name
      }),
      this.signAccessToken({ user_id, verify: UserVerifyStatus.Unverifyed, role: role.name }),
      this.signRefreshToken({ user_id, verify: UserVerifyStatus.Unverifyed, role: role.name })
    ])
    const [decoded_access_token, decoded_refresh_token] = await Promise.all<TokenPayload>([
      verifyToken({
        token: access_token,
        secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
      }),
      verifyToken({
        token: refresh_token,
        secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    ])
    const [[address], [user]] = await Promise.all([
      db
        .insert(addresses)
        .values({
          user_id,
          full_name,
          is_default: true
        })
        .returning({
          full_name: addresses.full_name
        }),
      db
        .update(users)
        .set({
          email_verify_token,
          verify: UserVerifyStatus.Unverifyed,
          updatedAt: new Date()
        })
        .where(eq(users.id, user_id))
        .returning(),
      db.insert(refresh_tokens).values({
        token: refresh_token,
        user_id,
        iat: new Date(decoded_refresh_token.iat * 1000),
        exp: new Date(decoded_refresh_token.exp * 1000)
      })
    ])
    await sendVerifyEmail({ email_verify_token: email_verify_token, toAddress: email })
    return {
      access_token,
      refresh_token,
      decoded_access_token,
      decoded_refresh_token,
      user,
      role,
      address
    }
  }

  // --- Login ---
  async login({ user_id, verify, role_id }: { user_id: number; verify: UserVerifyStatus; role_id: number }) {
    const [[role], [address]] = await Promise.all([
      db.select().from(roles).where(eq(roles.id, role_id)).limit(1),
      db
        .select({
          full_name: addresses.full_name
        })
        .from(addresses)
        .where(and(eq(addresses.user_id, user_id), eq(addresses.is_default, true)))
        .limit(1)
    ])
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, role: role.name }),
      this.signRefreshToken({ user_id, verify, role: role.name })
    ])
    const [decoded_access_token, decoded_refresh_token] = await Promise.all<TokenPayload>([
      verifyToken({
        token: access_token,
        secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
      }),
      verifyToken({
        token: refresh_token,
        secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    ])
    await db.insert(refresh_tokens).values({
      token: refresh_token,
      user_id,
      iat: new Date(decoded_refresh_token.iat * 1000),
      exp: new Date(decoded_refresh_token.exp * 1000)
    })
    return {
      access_token,
      refresh_token,
      decoded_access_token,
      decoded_refresh_token,
      role,
      address
    }
  }

  // --- Logout ---
  async logout({ user_id, refresh_token }: { user_id: number; refresh_token: string }) {
    await db
      .delete(refresh_tokens)
      .where(and(eq(refresh_tokens.user_id, user_id), eq(refresh_tokens.token, refresh_token)))
    return {
      message: AUTH_MESSAGE.LOGOUT_SUCCESS
    }
  }

  // --- Change Password ---
  async changePassword({ user_id, new_password }: { user_id: number; new_password: string }) {
    await db
      .update(users)
      .set({
        password: hashPassword(new_password),
        updatedAt: new Date()
      })
      .where(eq(users.id, user_id))
    return {
      message: AUTH_MESSAGE.CHANGE_PASSWORD_SUCCESS
    }
  }

  // --- Forgot Password ---
  async forgotPassword({
    user_id,
    verify,
    role_id,
    email
  }: {
    user_id: number
    verify: UserVerifyStatus
    role_id: number
    email: string
  }) {
    const [role] = await db.select({ name: roles.name }).from(roles).where(eq(roles.id, role_id)).limit(1)
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify, role: role.name })
    await db
      .update(users)
      .set({
        forgot_password_token,
        updatedAt: new Date()
      })
      .where(eq(users.id, user_id))
    await sendForgotPasswordEmail({ forgot_password_token, toAddress: email })
    return {
      message: AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESS
    }
  }

  // --- Reset password ---
  async resetPassword({ user_id, password }: { user_id: number; password: string }) {
    const passwordInserted = hashPassword(password)
    await db
      .update(users)
      .set({
        password: passwordInserted,
        forgot_password_token: '',
        updatedAt: new Date()
      })
      .where(eq(users.id, user_id))
    return {
      message: AUTH_MESSAGE.RESET_PASSWORD_SUCCESS
    }
  }

  // --- Verify Email ---
  async verifyEmail({ user_id, verify, role_id }: { user_id: number; verify: UserVerifyStatus; role_id: number }) {
    const [user] = await db
      .update(users)
      .set({
        verify: UserVerifyStatus.Verifyed,
        email_verify_token: '',
        updatedAt: new Date()
      })
      .where(eq(users.id, user_id))
      .returning()
    const [[role], [address]] = await Promise.all([
      db.select().from(roles).where(eq(roles.id, role_id)).limit(1),
      db
        .select({
          full_name: addresses.full_name
        })
        .from(addresses)
        .where(and(eq(addresses.user_id, user_id), eq(addresses.is_default, true)))
        .limit(1)
    ])
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, role: role.name, verify }),
      this.signRefreshToken({ user_id, role: role.name, verify })
    ])
    const [decoded_access_token, decoded_refresh_token] = await Promise.all<TokenPayload>([
      verifyToken({
        token: access_token,
        secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
      }),
      verifyToken({
        token: refresh_token,
        secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    ])
    await db.insert(refresh_tokens).values({
      token: refresh_token,
      user_id,
      iat: new Date(decoded_refresh_token.iat * 1000),
      exp: new Date(decoded_refresh_token.exp * 1000)
    })
    return {
      access_token,
      refresh_token,
      decoded_access_token,
      decoded_refresh_token,
      user,
      address,
      role
    }
  }

  // --- Refresh Token ---
  async refreshToken({
    user_id,
    exp,
    verify,
    role,
    refresh_token
  }: {
    user_id: number
    verify: UserVerifyStatus
    exp: number
    role: string
    refresh_token: string
  }) {
    const [new_access_token, new_refresh_token, [user], [address]] = await Promise.all([
      this.signAccessToken({ user_id, verify, role }),
      this.signRefreshToken({ user_id, verify, role, exp }),
      db.select().from(users).where(eq(users.id, user_id)).limit(1),
      db
        .select({
          full_name: addresses.full_name
        })
        .from(addresses)
        .where(and(eq(addresses.user_id, user_id), eq(addresses.is_default, true)))
        .limit(1),
      db.delete(refresh_tokens).where(and(eq(refresh_tokens.user_id, user_id), eq(refresh_tokens.token, refresh_token)))
    ])
    const [decoded_access_token, decoded_refresh_token] = await Promise.all<TokenPayload>([
      verifyToken({
        token: new_access_token,
        secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
      }),
      verifyToken({
        token: new_refresh_token,
        secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    ])
    await db.insert(refresh_tokens).values({
      token: new_refresh_token,
      user_id,
      iat: new Date(decoded_refresh_token.iat * 1000),
      exp: new Date(decoded_refresh_token.exp * 1000)
    })
    return {
      new_access_token,
      new_refresh_token,
      decoded_access_token,
      decoded_refresh_token,
      user,
      address
    }
  }
}

const authService = new AuthService()
export default authService
