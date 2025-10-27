import { and, count, eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { carts, products } from '~/db/schema'
import { AddCartRequestBody } from '~/requests/cart.request'

class CartService {
  // --- Add Cart ---
  async addCart(user_id: number, data: AddCartRequestBody) {
    const { product_id, quantity } = data
    const [insertedCart] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.user_id, user_id), eq(carts.product_id, product_id)))
      .limit(1)
    if (!insertedCart) {
      await db.insert(carts).values({
        user_id,
        product_id,
        quantity
      })
    } else {
      await db
        .update(carts)
        .set({
          quantity: insertedCart.quantity + 1
        })
        .where(and(eq(carts.user_id, user_id), eq(carts.product_id, product_id)))
        .returning()
    }
    const [cart] = await db
      .select()
      .from(carts)
      .where(and(eq(carts.user_id, user_id), eq(carts.product_id, product_id)))
      .limit(1)
    return cart
  }

  // --- Get Carts ---
  async getCarts(user_id: number) {
    const [cartList, [{ total }]] = await Promise.all([
      db
        .select({
          id: carts.id,
          quantity: carts.quantity,
          name: products.name,
          image: products.image,
          price: products.price,
          price_before_discount: products.price_before_discount,
          createdAt: carts.createdAt,
          updatedAt: carts.updatedAt
        })
        .from(carts)
        .innerJoin(products, eq(carts.product_id, products.id))
        .where(eq(carts.user_id, user_id)),
      db.select({ total: count() }).from(carts).where(eq(carts.user_id, user_id))
    ])
    return {
      cartList,
      total
    }
  }
}

const cartService = new CartService()
export default cartService
