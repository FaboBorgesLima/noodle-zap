import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostService } from "../../services/postService";
import { UserService } from "../../services/userService";
import { PostSchema } from "../../schemas/postSchema";
import { PostCard } from "../../components/PostCard";

export const Home: FC = () => {
    const [pageN, setPageN] = useState(0);

    const [posts, setPosts] = useState<PostSchema[][]>([]);

    const [lastPageLength, setLastPageLength] = useState(0);

    useEffect(() => {
        async function getPosts() {
            const token = UserService.getToken();
            if (!token) return;

            console.debug("getting posts in n", pageN);
            const newPosts = await PostService.getPage(pageN, 10, token);
            if (!newPosts) return;

            posts[pageN] = newPosts.posts;

            setLastPageLength(newPosts.posts.length);
            setPosts([...posts]);
        }

        getPosts();

        console.debug(posts);
    }, [pageN]);

    return (
        <>
            <div className="container mx-auto flex flex-col gap-4">
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
            <footer className="sticky bottom-0 backdrop-blur-2xl p-4">
                <div className="container mx-auto flex flex-row justify-end">
                    <Link
                        to={"/logged/create-post"}
                        className="form-btn  h-full text-2xl p-4"
                    >
                        new post +
                    </Link>
                </div>
            </footer>
        </>
    );
};
