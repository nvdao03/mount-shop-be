import { db } from '~/configs/postgreSQL.config'
import { count, eq, ilike } from 'drizzle-orm'
import { brands, brands_categories, categories } from '~/db/schema'
import { AddBrandRequestBody, UpdateBrandRequestBody } from '~/requests/brand.request'

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

  // --- Update Brand ---
  async updateBrand(brand_id: number, data: UpdateBrandRequestBody) {
    const [brand] = await db
      .update(brands)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(brands.id, brand_id))
      .returning()
    return brand
  }

  // --- Delete Brand ---
  async deleteBrand(brand_id: number) {
    const [brand] = await db.delete(brands).where(eq(brands.id, brand_id)).returning()
    return brand
  }

  // --- Get Brand Detail ---
  async getBrandDetail(brand_id: number) {
    const [brand] = await db.select().from(brands).where(eq(brands.id, brand_id)).limit(1)
    return brand
  }

  // --- Get All Brands ---
  async getBrands({ limit, page, search }: { limit: number; page: number; search: string }) {
    const [data, [{ total }]] = await Promise.all([
      db
        .select()
        .from(brands)
        .where(ilike(brands.name, `%${search}%`))
        .limit(limit)
        .offset(limit * (page - 1)),
      db
        .select({ total: count() })
        .from(brands)
        .where(ilike(brands.name, `%${search}%`))
    ])
    const total_page = Math.ceil(Number(total) / limit)
    return {
      data,
      page,
      limit,
      total_page
    }
  }
}

const brandService = new BrandService()
export default brandService
