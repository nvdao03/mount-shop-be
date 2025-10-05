import { db } from '~/configs/postgreSQL.config'
import { categories } from '~/db/schema'
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
      .set({ ...data })
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
}

const categoryService = new CategoryService()
export default categoryService
