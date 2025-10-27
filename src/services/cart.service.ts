import { and, eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { carts } from '~/db/schema'
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
}

const cartService = new CartService()
export default cartService
