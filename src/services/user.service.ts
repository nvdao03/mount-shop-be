import { eq, and } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { addresses, roles, users } from '~/db/schema'
import { UpdateProfileRequestBody } from '~/requests/user.request'

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
}

const userService = new UserService()
export default userService
