import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PostService } from "../../services/postService";
import { PostSchema } from "../../schemas/postSchema";
import { PostHeader } from "../../components/PostHeader";
import { CommentForm } from "../../components/CommentForm";
import { CommentCard } from "../../components/CommentCard";
import { UserService } from "../../services/userService";

export const Post: FC<{}> = () => {
    const { id } = useParams();
    const [postNotFound, setPostNotFound] = useState(false);
    const [post, setPost] = useState<void | PostSchema>();

    const [isLoggedUserPost, setIsLoggedUserPost] = useState(false);

    useEffect(() => {
        if (id) {
            PostService.getById(id).then(async (data) => {
                if (!data) {
                    setPostNotFound(true);
                    return;
                }
                setPost(data);

                const user = UserService.getUser();
                if (!user) return;

                setIsLoggedUserPost(data.user.id == user.id);
            });
        }
    }, [id]);

    return (
        <div className="mx-auto container m-4 flex flex-col gap-4">
            <div className="flex flex-col">
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
                {!postNotFound ? (
                    <p className="break-words whitespace-pre-line text-lg">
                        {post?.text}
                    </p>
                ) : (
                    <span className="text-lg">
                        post not found, do you wanna
                        <Link to="/logged" className="underline">
                            {" "}
                            go back?
                        </Link>
                    </span>
                )}
            </div>

            {!postNotFound ? (
                <section className="gap-4 flex flex-col">
                    <h2 className="text-2xl underline">comments</h2>
                    <CommentForm
                        postId={id ? id : ""}
                        onUploadComment={(comment) => {
                            if (post) {
                                post.comments.push(comment);

                                setPost({ ...post });
                            }
                        }}
                    ></CommentForm>
                    {post?.comments.map((comment) => (
                        <CommentCard
                            {...comment}
                            key={comment.id}
                        ></CommentCard>
                    ))}
                </section>
            ) : (
                <></>
            )}
        </div>
    );
};
