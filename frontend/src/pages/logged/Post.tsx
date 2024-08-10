import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostService } from "../../services/postService";
import { PostSchema } from "../../schemas/postSchema";
import { PostHeader } from "../../components/PostHeader";

export const Post: FC<{}> = () => {
    const { id } = useParams();
    const [postNotFound, setPostNotFound] = useState(false);
    const [post, setPost] = useState<void | PostSchema>();
    useEffect(() => {
        if (id) {
            PostService.getById(id).then((data) => {
                if (!data) {
                    setPostNotFound(true);
                    return;
                }
                setPost(data);
            });
        }
    }, [id]);

    return (
        <main className="mx-auto container m-4">
            {post ? (
                <PostHeader
                    user={post.user}
                    date={post.date}
                    title={post.title}
                    id={post.id}
                ></PostHeader>
            ) : (
                <></>
            )}
            <section className="flex flex-col gap-4">
                <p className="break-words whitespace-pre-line">{post?.text}</p>
            </section>
        </main>
    );
};
