import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostService } from "../../services/postService";
import { UserService } from "../../services/userService";
import { PostSchema } from "../../schemas/postSchema";
import { PostCard } from "../../components/PostCard";
import { CustomFooter } from "../../components/CustomFooter";

export const Home: FC = () => {
    const [pageN, setPageN] = useState(0);

    const [posts, setPosts] = useState<PostSchema[][]>([]);

    const [lastPageLength, setLastPageLength] = useState(0);

    useEffect(() => {
        async function getPosts() {
            const token = UserService.getToken();
            if (!token) return;

            const newPosts = await PostService.getPage(pageN, 10, token);
            if (!newPosts) return;

            posts[pageN] = newPosts.posts;

            setLastPageLength(newPosts.posts.length);
            setPosts([...posts]);
        }

        getPosts();
    }, [pageN]);

    return (
        <div className="grow flex flex-col w-full">
            <div className="container mx-auto flex flex-col gap-4 grow m-4">
                <div className="flex flex-col gap-4">
                    {posts.map((page) =>
                        page.map((post) => (
                            <PostCard {...post} key={post.id}></PostCard>
                        ))
                    )}
                </div>
                {lastPageLength == 10 ? (
                    <button
                        onClick={() => {
                            setPageN(pageN + 1);
                        }}
                        className="form-btn"
                    >
                        more
                    </button>
                ) : (
                    <></>
                )}
            </div>
            <CustomFooter>
                <div className="container mx-auto flex flex-row justify-end">
                    <Link
                        to={"/logged/create-post"}
                        className="form-btn  h-full text-2xl p-4"
                    >
                        new post +
                    </Link>
                </div>
            </CustomFooter>
        </div>
    );
};
