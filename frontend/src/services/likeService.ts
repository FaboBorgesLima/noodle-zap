import { instance } from "../connection/instance";

export class LikeService {
    static async addLikeToPost(
        token: string,
        postId: string
    ): Promise<boolean> {
        try {
            const res = await instance.post(
                "/api/like/auth/create",
                { postId },
                { headers: { Authorization: `bearer ${token}` } }
            );

            return res.status == 200;
        } catch {
            return false;
        }
    }
}
