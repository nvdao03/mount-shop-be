import { and, asc, count, desc, eq, inArray } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { brands, carts, order_items, orders, products } from '~/db/schema'
import { AddOrderRequestBody } from '~/requests/order.request'

class OrderService {
  // --- Add Order ---
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

  // --- Get Orders ---
  async getOrders(user_id: number, status: string, limit: number, page: number) {
    const conditions: any[] = []
    const offset = limit * (page - 1)
    if (status) {
      conditions.push(eq(orders.status, status as 'processing' | 'delivering' | 'delivered' | 'cancelled'))
    }
    if (user_id) {
      conditions.push(eq(orders.user_id, user_id))
    }
    const [orderList, [{ total }]] = await Promise.all([
      db
        .select({
          id: orders.id,
          image: products.image,
          brand: brands.name,
          name: products.name,
          price: products.price,
          status: orders.status,
          total_price: orders.total_price,
          quantity: order_items.quantity,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt
        })
        .from(orders)
        .innerJoin(order_items, eq(orders.id, order_items.order_id))
        .innerJoin(products, eq(order_items.product_id, products.id))
        .innerJoin(brands, eq(products.brand_id, brands.id))
        .where(and(...conditions))
        .orderBy(desc(orders.createdAt))
        .offset(offset),
      db
        .select({ total: count() })
        .from(orders)
        .innerJoin(order_items, eq(orders.id, order_items.order_id))
        .innerJoin(products, eq(order_items.product_id, products.id))
        .innerJoin(brands, eq(products.brand_id, brands.id))
        .where(and(...conditions))
    ])
    // --- Gom nhóm Orders ---
    const groupedOrders = Object.values(
      orderList.reduce((acc: any, order: any) => {
        if (!acc[order.id]) {
          acc[order.id] = {
            id: order.id,
            status: order.status,
            total_price: order.total_price,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: []
          }
        }
        acc[order.id].items.push({
          image: order.image,
          brand: order.brand,
          name: order.name,
          price: order.price,
          quantity: order.quantity
        })
        return acc
      }, {})
    ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const total_page = Math.ceil(Number(total) / limit)
    return {
      orderList: groupedOrders,
      total_page
    }
  }
}

const orderService = new OrderService()
export default orderService
