import { db } from '~/configs/postgreSQL.config'
import { eq } from 'drizzle-orm'
import { brands, brands_categories, categories } from '~/db/schema'
import { AddBrandRequestBody } from '~/requests/brand.request'

class BrandService {
  // --- Add Brand ---
  async addBrand(data: AddBrandRequestBody) {
    const { image, name, category_id } = data
    let [brand] = await db.select().from(brands).where(eq(brands.name, name)).limit(1)
    // Nếu chưa có brand thì thêm vào DB
    if (!brand) {
      const [new_brand] = await db.insert(brands).values({ name, image }).returning()
      brand = new_brand
    }
    const [[category]] = await Promise.all([
      db
        .select({ name: categories.name })
        .from(categories)
        .where(eq(categories.id, Number(category_id)))
        .limit(1),
      // Gán brand vào category (dù là brand mới hay cũ). onConflictDoNothing() Tránh lỗi khi đã có cặp brand_id + category_id
      db
        .insert(brands_categories)
        .values({
          brand_id: brand.id,
          category_id: Number(category_id)
        })
        .onConflictDoNothing()
    ])
    return {
      brand,
      category
    }
  }
}

const brandService = new BrandService()
export default brandService
