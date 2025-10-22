import { and, count, eq, ilike } from 'drizzle-orm'
import { db } from '~/configs/postgreSQL.config'
import { addresses, comments, users } from '~/db/schema'
import { AddCommentRequestBody } from '~/requests/comment.request'

class CommentService {
  // --- Add Comment ---
  async addComment(user_id: number, data: AddCommentRequestBody) {
    const [comment] = await db
      .insert(comments)
      .values({
        ...data,
        user_id
      })
      .returning()
    return comment
  }

  // --- Delete Comment ---
  async deleteComment(comment_id: number) {
    const [comment] = await db.delete(comments).where(eq(comments.id, comment_id)).returning()
    return comment
  }

  // --- Get Comments ---
  async getComments(limit: number, page: number, product_id: number) {
    const offset = limit * (page - 1)
    const [commentList, [{ total }]] = await Promise.all([
      db
        .select({
          id: comments.id,
          content: comments.content,
          user_id: comments.user_id,
          avatar: users.avatar,
          full_name: addresses.full_name,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt
        })
        .from(comments)
        .innerJoin(addresses, and(eq(addresses.user_id, comments.user_id), eq(addresses.is_default, true)))
        .innerJoin(users, eq(comments.user_id, users.id))
        .where(eq(comments.product_id, product_id))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(comments).where(eq(comments.product_id, product_id))
    ])
    const total_page = Math.ceil(Number(total) / limit)
    return {
      total_page,
      commentList
    }
  }

  // --- Get Comments All --- //
  async getCommentsAll({ limit, page, search }: { limit: number; page: number; search: string }) {
    const offset = limit * (page - 1)
    const conditions: any[] = []
    if (search && search.trim() !== '') {
      conditions.push(ilike(comments.content, `%${search.trim()}%`))
    }
    const whereConditions = conditions.length > 0 ? and(...conditions) : undefined
    const [commentList, [{ total }]] = await Promise.all([
      db
        .select({
          id: comments.id,
          content: comments.content,
          user_id: comments.user_id,
          avatar: users.avatar,
          full_name: addresses.full_name,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt
        })
        .from(comments)
        .innerJoin(addresses, eq(comments.user_id, addresses.user_id))
        .innerJoin(users, eq(comments.user_id, users.id))
        .where(whereConditions)
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(comments).where(whereConditions)
    ])
    const total_page = Math.ceil(Number(total) / limit)
    return {
      commentList,
      total_page
    }
  }
}

const commentService = new CommentService()
export default commentService
