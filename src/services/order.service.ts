import { inArray } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { carts, order_items, orders } from '~/db/schema'
import { AddOrderRequestBody } from '~/requests/order.request'

class OrderService {
  async addOrder(user_id: number, data: AddOrderRequestBody) {
    const { address_id, cart_ids, total_price } = data
    const cartList = await db.select().from(carts).where(inArray(carts.id, cart_ids))
    const [order] = await db.insert(orders).values({ address_id, total_price, user_id }).returning()
    const orderItemsData = cartList.map((cart) => ({
      order_id: order.id as number,
      product_id: cart.product_id as number,
      quantity: cart.quantity as number
    }))
    await Promise.all([
      await db.insert(order_items).values(orderItemsData),
      await db.delete(carts).where(inArray(carts.id, cart_ids))
    ])
    return order
  }
}

const orderService = new OrderService()
export default orderService
