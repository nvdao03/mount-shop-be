import { eq, and, ilike, or, count } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { UserVerifyStatus } from '~/constants/enum'
import { addresses, roles, users } from '~/db/schema'
import { UpdateProfileRequestBody, UpdateUserRoleRequestBody } from '~/requests/user.request'

class UserService {
  // --- Get Me ---
  async getProfile(user_id: number) {
    const [user] = await db
      .select({
        id: users.id,
        role: roles.name,
        email: users.email,
        full_name: addresses.full_name,
        phone: addresses.phone,
        address: addresses.address,
        avatar: users.avatar,
        created_at: users.createdAt,
        update_at: users.updatedAt
      })
      .from(users)
      .innerJoin(roles, eq(roles.id, users.role_id))
      .innerJoin(addresses, eq(addresses.user_id, users.id))
      .where(and(eq(addresses.is_default, true), eq(users.id, user_id)))
      .limit(1)
    return user
  }

  // Update Profie
  async updateProfile(user_id: number, data: UpdateProfileRequestBody) {
    const { address, avatar, full_name, phone } = data
    const [updateUser, updateAddress] = await Promise.all([
      db
        .update(users)
        .set({
          avatar,
          updatedAt: new Date()
        })
        .where(eq(users.id, user_id))
        .returning(),
      db
        .update(addresses)
        .set({
          address,
          full_name,
          phone,
          updatedAt: new Date()
        })
        .where(and(eq(addresses.user_id, user_id), eq(addresses.is_default, true)))
        .returning()
    ])
    const [user] = await db
      .select({
        id: users.id,
        role: roles.name,
        email: users.email,
        full_name: addresses.full_name,
        phone: addresses.phone,
        address: addresses.address,
        avatar: users.avatar,
        created_at: users.createdAt,
        update_at: users.updatedAt
      })
      .from(users)
      .innerJoin(roles, eq(roles.id, users.role_id))
      .innerJoin(addresses, eq(addresses.user_id, users.id))
      .where(and(eq(addresses.is_default, true), eq(users.id, user_id)))
      .limit(1)
    return user
  }

  // --- Get Users --- //
  async getUsers({ limit, page, search }: { limit: number; page: number; search: string }) {
    const offset = limit * (page - 1)
    const conditions: any[] = []
    if (search && search.trim() !== '') {
      conditions.push(or(ilike(users.email, `%${search}%`), ilike(addresses.full_name, `%${search}%`)))
    }
    const whereConditions = conditions.length > 0 ? and(...conditions) : undefined
    const [userList, [{ total }]] = await Promise.all([
      db
        .select({
          id: users.id,
          full_name: addresses.full_name,
          email: users.email,
          avatar: users.avatar,
          role: roles.name,
          role_id: roles.id
        })
        .from(users)
        .innerJoin(roles, eq(roles.id, users.role_id))
        .innerJoin(addresses, and(eq(addresses.user_id, users.id), eq(addresses.is_default, true)))
        .limit(limit)
        .offset(offset)
        .where(whereConditions),
      db
        .select({ total: count() })
        .from(users)
        .innerJoin(addresses, and(eq(addresses.user_id, users.id), eq(addresses.is_default, true)))
        .where(whereConditions)
    ])
    const total_page = Math.ceil(Number(total) / limit)
    return {
      userList,
      total_page
    }
  }

  // --- Delete User --- //
  async deleteUser(user_id: number) {
    const [user] = await db.delete(users).where(eq(users.id, user_id)).returning()
    return user
  }

  // --- Update User Role --- //
  async updateUserRole(data: UpdateUserRoleRequestBody) {
    const { role_id, user_id } = data
    const [user] = await db
      .update(users)
      .set({
        email_verify_token: '',
        verify: UserVerifyStatus.Verifyed,
        role_id,
        updatedAt: new Date()
      })
      .where(eq(users.id, user_id))
      .returning()
    return user
  }
}

const userService = new UserService()
export default userService
