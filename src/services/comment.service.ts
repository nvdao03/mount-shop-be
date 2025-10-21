import { db } from '~/configs/postgreSQL.config'
import { comments } from '~/db/schema'
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
}

const commentService = new CommentService()
export default commentService
