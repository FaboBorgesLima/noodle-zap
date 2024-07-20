import { instance } from "../connection/instance";
import { PostSchema } from "../schemas/postSchema";

export class PostService {
    static async create(
        title: string,
        text: string,
        token: string
    ): Promise<PostSchema | void> {
        try {
            const { data } = await instance.post<PostSchema>(
                "/api/post/auth/create",
                { title, text },
                { headers: { Authorization: `bearer ${token}` } }
            );

            return data;
        } catch {}
    }

    static async getPage(
        page: number,
        length: number,
        token: string
    ): Promise<{ posts: PostSchema[] } | void> {
        const { data } = await instance.get<{ posts: PostSchema[] }>(
            "/api/post/auth/page",
            {
                headers: { Authorization: `bearer ${token}` },
                params: { page, length },
            }
        );
        return data;
    }
}
