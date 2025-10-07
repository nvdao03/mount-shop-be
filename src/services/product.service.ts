import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { brands, categories, products } from '~/db/schema'
import { AddProductRequestBody } from '~/requests/product.request'

class ProductService {
  // --- Add Product ---
  async addProduct(data: AddProductRequestBody) {
    const { category_id, brand_id } = data
    const [[category], [brand]] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(eq(categories.id, category_id))
        .limit(1),
      db.select({ id: brands.id, name: brands.name }).from(brands).where(eq(brands.id, brand_id)).limit(1)
    ])
    const [product] = await db
      .insert(products)
      .values({
        ...data
      })
      .returning()
    return {
      product,
      brand,
      category
    }
  }
}

const productService = new ProductService()
export default productService
