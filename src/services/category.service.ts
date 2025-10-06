import { db } from '~/configs/postgreSQL.config'
import { brands, brands_categories, categories } from '~/db/schema'
import { AddCategoryRequestBody, UpdateCategoryRequestBody } from '~/requests/category.request'
import { eq, count } from 'drizzle-orm'

class CategoryService {
  // --- Add Category ---
  async addCategory(data: AddCategoryRequestBody) {
    const [category] = await db
      .insert(categories)
      .values({ ...data })
      .returning()
    return category
  }

  // --- Update Category ---
  async updateCategory(category_id: number, data: UpdateCategoryRequestBody) {
    const [category] = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, category_id))
      .returning()
    return category
  }

  // --- Delete Category ---
  async deleteCategory(category_id: number) {
    const [category] = await db.delete(categories).where(eq(categories.id, category_id)).returning()
    return category
  }

  // --- Get All Category ---
  async getCategoryAll({ limit, page }: { limit: number; page: number }) {
    const offset = limit * (page - 1)
    const [data, [{ total }]] = await Promise.all([
      db
        .select({
          id: categories.id,
          name: categories.name,
          image: categories.image
        })
        .from(categories)
        .limit(limit)
        .offset(offset),
      db.select({ total: count(categories.id) }).from(categories)
    ])
    const total_page = Math.ceil(Number(total) / limit)
    return {
      data,
      page,
      limit,
      total_page
    }
  }

  // --- Get Category Detail ---
  async getCategoryDetail(category_id: number) {
    const [category] = await db.select().from(categories).where(eq(categories.id, category_id)).limit(1)
    return category
  }

  // --- Get Brands By Category Id ---
  async getBrandsByCategoryId(category_id: number) {
    const brand = await db
      .select({
        id: brands.id,
        name: brands.name,
        image: brands.image
      })
      .from(brands)
      .innerJoin(brands_categories, eq(brands_categories.brand_id, brands.id))
      .where(eq(brands_categories.category_id, category_id))
    return brand
  }
}

const categoryService = new CategoryService()
export default categoryService
