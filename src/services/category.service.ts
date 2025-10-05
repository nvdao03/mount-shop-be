import { db } from '~/configs/postgreSQL.config'
import { categories } from '~/db/schema'
import { AddCategoryRequestBody, UpdateCategoryRequestBody } from '~/requests/category.request'
import { eq } from 'drizzle-orm'

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
}

const categoryService = new CategoryService()
export default categoryService
