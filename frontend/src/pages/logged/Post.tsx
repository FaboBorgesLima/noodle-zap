import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostService } from "../../services/postService";
import { PostSchema } from "../../schemas/postSchema";
import { PostHeader } from "../../components/PostHeader";
import { CommentForm } from "../../components/CommentForm";
import { CommentCard } from "../../components/CommentCard";
import { UserService } from "../../services/userService";
import { IoArrowBackCircleOutline, IoTrashBinOutline } from "react-icons/io5";
import { CustomFooter } from "../../components/CustomFooter";

export const Post: FC<{}> = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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
        <div className="grow flex flex-col">
            <div className="mx-auto container grow m-4 flex flex-col gap-4">
                <header className="flex flex-col">
                    {post ? (
                        <div className="flex flex-row justify-between">
                            <PostHeader
                                user={post.user}
                                date={post.date}
                                title={post.title}
                                id={post.id}
                            ></PostHeader>
                            {isLoggedUserPost ? (
                                <button
                                    className="bg-red-500 rounded-sm flex flex-row items-center gap-4 px-4"
                                    onClick={async () => {
                                        const wannaDelete = confirm(
                                            "do you wanna to delete this post permanently?"
                                        );
                                        const token = UserService.getToken();
                                        if (wannaDelete && token) {
                                            const couldDelete =
                                                await PostService.deletePost(
                                                    token,
                                                    post.id
                                                );
                                            if (couldDelete) {
                                                navigate(-1);
                                            }
                                        }
                                    }}
                                >
                                    <span className="text-xl leading-none font-bold uppercase">
                                        delete
                                    </span>
                                    <IoTrashBinOutline className="leading-none text-3xl "></IoTrashBinOutline>
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
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
                            <button
                                onClick={() => {
                                    navigate(-1);
                                }}
                                className="underline"
                            >
                                go back?
                            </button>
                        </span>
                    )}
                </header>
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
                                postId={post.id}
                                key={comment.id}
                            ></CommentCard>
                        ))}
                    </section>
                ) : (
                    <></>
                )}
            </div>
            <CustomFooter>
                <div className="container mx-auto flex flex-row justify-end">
                    <button
                        onClick={() => {
                            navigate(-1);
                        }}
                        className="form-btn flex flex-row gap-2 items-center px-2"
                    >
                        <IoArrowBackCircleOutline className="text-3xl"></IoArrowBackCircleOutline>
                        <span className="font-bold text-md uppercase">
                            return
                        </span>
                    </button>
                </div>
            </CustomFooter>
        </div>
    );
};
