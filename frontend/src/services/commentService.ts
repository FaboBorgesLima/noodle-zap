import { instance } from "../connection/instance";
import { CommentSchema } from "../schemas/commentSchema";

export class CommentService {
    static async create(
        token: string,
        text: string,
        postId: string
    ): Promise<CommentSchema | void> {
        try {
            const { data } = await instance.post<CommentSchema>(
                "/api/comment/auth/create",
                { text, postId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data;
        } catch {}
    }

    static async delete(
        token: string,
        postId: string,
        commentId: string
    ): Promise<boolean> {
        try {
            await instance.delete(
                `/api/comment/auth/delete/${postId}/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return true;
        } catch {}

        return false;
    }
}
