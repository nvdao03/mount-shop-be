import { count, desc, eq, and, inArray, ilike, gte, lte, lt, asc } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { brands, categories, products } from '~/db/schema'
import { AddProductRequestBody, ProductQueryParams, UpdateProductRequestBody } from '~/requests/product.request'

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

  // --- Delete Product ---
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

  // --- Get Product Detail ---
  async getProductDetail(product_id: number, brand_id: number, category_id: number) {
    const [[category], [brand], [product]] = await Promise.all([
      db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .where(eq(categories.id, category_id))
        .limit(1),
      db.select({ id: brands.id, name: brands.name }).from(brands).where(eq(brands.id, brand_id)).limit(1),
      db.select().from(products).where(eq(products.id, product_id)).limit(1)
    ])
    return {
      product,
      category,
      brand
    }
  }

  // --- Get Products ---
  async getProducts(query: ProductQueryParams) {
    const { brands, search, min_price, max_price, order, rating, category } = query
    const limit = Number(query.limit as string) || 15
    const page = Number(query.page as string) || 1
    const offset = limit * (page - 1)
    // --- Gom nhóm điều kiện ---
    const conditions: any[] = []
    if (category) conditions.push(eq(products.category_id, Number(category)))
    if (brands) {
      let brandIds: number[] = []
      // Xử lý nếu FE gửi lên 1 mảng thì thêm mảng đó vào mảng brandIds để tị so sánh
      if (Array.isArray(brands)) {
        brandIds = brands.map((id) => Number(id))
      } else {
        // Xử lý nếu FE gửi lên là JSON thì parse về đúng định dạng gốc
        try {
          const parsed = JSON.parse(brands)
          // Nếu nó là mảng thì thêm mảng đó vào mảng brandIds
          if (Array.isArray(parsed)) {
            brandIds = parsed.map((id) => Number(id))
          }
          // Nếu FE truyền nên ko phải là dạng mảng và cũng ko phải number chỉ là chuỗi thì sẽ kiểm tra xem có đúng là dạng số hay ko nếu đúng thì thêm về mảng brandIds
          else if (!isNaN(Number(parsed))) {
            brandIds = [Number(parsed)]
          }
        } catch {
          if (!isNaN(Number(brands))) {
            brandIds = [Number(brands)]
          }
        }
      }
      if (brandIds.length > 0) {
        conditions.push(inArray(products.brand_id, brandIds))
      }
    }
    if (search) conditions.push(ilike(products.name, `%${search}%`))
    if (min_price) conditions.push(gte(products.price, Number(min_price)))
    if (max_price) conditions.push(lte(products.price, Number(max_price)))
    if (rating) {
      const ratingInt = Math.floor(Number(rating))
      const minRating = ratingInt
      const maxRating = minRating + 1
      conditions.push(and(gte(products.rating, String(minRating)), lt(products.rating, String(maxRating))))
    }
    const orderBy =
      order === 'asc' ? asc(products.price) : order === 'desc' ? desc(products.price) : desc(products.createdAt)
    // --- Query ---
    const [productList, [{ total }]] = await Promise.all([
      db
        .select()
        .from(products)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset)
        .orderBy(orderBy),
      db
        .select({ total: count() })
        .from(products)
        .where(and(...conditions))
    ])
    const total_page = Math.ceil(Number(total) / limit)
    return {
      productList,
      page,
      total,
      limit,
      total_page
    }
  }
}

const productService = new ProductService()
export default productService
