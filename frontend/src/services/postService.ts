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
        pageSize: number,
        token: string
    ): Promise<{ posts: PostSchema[] } | void> {
        try {
            const { data } = await instance.get<{ posts: PostSchema[] }>(
                `/api/post/auth/page/${page}/${pageSize}`,
                {
                    headers: { Authorization: `bearer ${token}` },
                }
            );
            return data;
        } catch {}
    }

    static async getById(id: string): Promise<void | PostSchema> {
        try {
            const { data } = await instance.get<PostSchema>(
                `/api/post/by-id/${id}`
            );
            return data;
        } catch {}
    }

    static async deletePost(token: string, id: string): Promise<boolean> {
        try {
            await instance.delete(`/api/post/auth/delete/${id}`, {
                headers: { Authorization: `bearer ${token}` },
            });
            return true;
        } catch {}
        return false;
    }

    static async getPostByUser(
        userId: string | number,
        page: number,
        pageSize: number,
        token: string
    ): Promise<{ posts: PostSchema[] } | void> {
        try {
            const { data } = await instance.get<{ posts: PostSchema[] }>(
                `/api/post/auth/user-page/${userId}/${page}/${pageSize}`,
                { headers: { Authorization: `bearer ${token}` } }
            );

            return data;
        } catch {}
    }
}
