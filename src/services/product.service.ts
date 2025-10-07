import { eq } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { brands, categories, products } from '~/db/schema'
import { AddProductRequestBody, UpdateProductRequestBody } from '~/requests/product.request'

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

  // --- Update Product ---
  async updateProduct(data: UpdateProductRequestBody, product_id: number) {
    const [product] = await db
      .update(products)
      .set({ ...data })
      .where(eq(products.id, product_id))
      .returning()
    const [[category], [brand]] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(eq(categories.id, product.category_id))
        .limit(1),
      db.select({ id: brands.id, name: brands.name }).from(brands).where(eq(brands.id, product.brand_id)).limit(1)
    ])
    return {
      product,
      category,
      brand
    }
  }

  // --- Delete product ---
  async deleteProduct(product_id: number, brand_id: number, category_id: number) {
    const [[category], [brand]] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(eq(categories.id, category_id))
        .limit(1),
      db.select({ id: brands.id, name: brands.name }).from(brands).where(eq(brands.id, brand_id)).limit(1)
    ])
    const [product] = await db.delete(products).where(eq(products.id, product_id)).returning()
    return {
      product,
      category,
      brand
    }
  }
}

const productService = new ProductService()
export default productService
