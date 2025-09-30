import { RegisterRequestBody, TokenPayload } from './../requests/auth.request'
import { verifyToken } from './../utils/jwt'
import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { TokenTypes, UserVerifyStatus } from '~/constants/enum'
import { refresh_tokens, roles, users } from '~/db/schema'
import { signToken } from '~/utils/jwt'
import '../configs/env.config'
import hashPassword from '~/utils/crypto'

class AuthService {
  // --- Sign Access Token ---
  private async signAccessToken({ user_id, verify }: { user_id: number; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.AccessToken,
        verify
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
    exp
  }: {
    user_id: number
    verify: UserVerifyStatus
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenTypes.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
        options: {
          algorithm: 'HS256',
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any
        }
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as any
      }
    })
  }

  // --- Sign Email Verify Token ---
  private async signEmailVerifyToken({ user_id, verify }: { user_id: number; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenTypes.EmailVerifyToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: {
        algorithm: 'HS256',
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as any
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
      .values({ email, full_name, password: hashPassword(password), role_id: role.id })
      .returning({
        user_id: users.id
      })
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: insertedUser.user_id,
      verify: UserVerifyStatus.Unverifyed
    })
    const user_id = insertedUser.user_id
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify: UserVerifyStatus.Unverifyed }),
      this.signRefreshToken({ user_id, verify: UserVerifyStatus.Unverifyed })
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
    const [[user]] = await Promise.all([
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
    return {
      access_token,
      refresh_token,
      decoded_access_token,
      decoded_refresh_token,
      user,
      role
    }
  }

  async login({ user_id, verify, role_id }: { user_id: number; verify: UserVerifyStatus; role_id: number }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify })
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
    const [role] = await db.select().from(roles).where(eq(roles.id, role_id)).limit(1)
    return {
      access_token,
      refresh_token,
      decoded_access_token,
      decoded_refresh_token,
      role
    }
  }
}

const authService = new AuthService()
export default authService
