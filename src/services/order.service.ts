import { and, asc, count, desc, eq, inArray, sql } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { addresses, brands, carts, order_items, orders, products } from '~/db/schema'
import { AddOrderRequestBody, UpdateOrderCancelRequestBody } from '~/requests/order.request'

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
      await db.delete(carts).where(inArray(carts.id, cart_ids)),
      ...cartList.map((cart) =>
        db
          .update(products)
          .set({
            stock: sql`${products.stock} - ${cart.quantity}`
          })
          .where(eq(products.id, cart.product_id as number))
          .returning()
      )
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
          product_id: products.id,
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
          product_id: order.product_id,
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

  async getOrderDetail(order_id: number) {
    const order = await db
      .select({
        id: orders.id,
        image: products.image,
        brand: brands.name,
        name: products.name,
        cancel_reason: orders.cancel_reason,
        price: products.price,
        product_id: products.id,
        address: addresses.address,
        full_name: addresses.full_name,
        phone: addresses.phone,
        status: orders.status,
        total_price: orders.total_price,
        quantity: order_items.quantity,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt
      })
      .from(orders)
      .innerJoin(order_items, eq(orders.id, order_items.order_id))
      .innerJoin(products, eq(order_items.product_id, products.id))
      .innerJoin(addresses, eq(orders.address_id, addresses.id))
      .innerJoin(brands, eq(products.brand_id, brands.id))
      .where(eq(orders.id, order_id))
    // --- Gom nhóm Orders ---
    const groupedOrders = Object.values(
      order.reduce((acc: any, order: any) => {
        if (!acc[order.id]) {
          acc[order.id] = {
            id: order.id,
            status: order.status,
            cancel_reason: order.cancel_reason,
            total_price: order.total_price,
            address: order.address,
            full_name: order.full_name,
            phone: order.phone,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: []
          }
        }
        acc[order.id].items.push({
          product_id: order.product_id,
          image: order.image,
          brand: order.brand,
          name: order.name,
          price: order.price,
          quantity: order.quantity
        })
        return acc
      }, {})
    )
    return {
      order: groupedOrders[0]
    }
  }

  // --- Update Order Cancel ---
  async updateOrderCancel(order_id: number, data: UpdateOrderCancelRequestBody) {
    const { cancel_reason, status } = data
    const statusCancel = 'cancelled' as 'processing' | 'delivering' | 'delivered' | 'cancelled'
    const [order] = await db
      .update(orders)
      .set({
        cancel_reason,
        status: statusCancel
      })
      .where(eq(orders.id, order_id))
      .returning()
    return order
  }
}

const orderService = new OrderService()
export default orderService
