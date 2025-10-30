import { count, desc, eq, sum } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { addresses, orders, products, users } from '~/db/schema'

class DashboardService {
  async getDashboard() {
    const [[{ totalProduct }], [{ totalUser }], [{ totalOrder }], [{ totalRevenue }], orderList] = await Promise.all([
      db.select({ totalProduct: count() }).from(products),
      db.select({ totalUser: count() }).from(users),
      db.select({ totalOrder: count() }).from(orders),
      db.select({ totalRevenue: sum(orders.total_price) }).from(orders),
      db
        .select({
          id: orders.id,
          full_name: addresses.full_name,
          avatar: users.avatar,
          status: orders.status,
          total_price: orders.total_price,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt
        })
        .from(orders)
        .innerJoin(users, eq(orders.user_id, users.id))
        .innerJoin(addresses, eq(orders.address_id, addresses.id))
        .orderBy(desc(orders.createdAt))
        .limit(10)
    ])
    return { totalProduct, totalUser, totalOrder, totalRevenue, orderList }
  }
}

const dashboardService = new DashboardService()
export default dashboardService
