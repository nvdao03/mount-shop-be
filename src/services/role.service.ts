import { db } from '~/configs/postgreSQL.config'
import { roles } from '~/db/schema'

class RoleService {
  async getRoles() {
    const roleList = await db.select().from(roles)
    return roleList
  }
}

const roleService = new RoleService()
export default roleService
