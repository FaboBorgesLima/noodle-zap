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
}
