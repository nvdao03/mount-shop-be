import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { roles, users } from '~/db/schema'

class UserService {
  // --- Get Me ---
  async getMe(user_id: number) {}
}

const userService = new UserService()
export default userService
