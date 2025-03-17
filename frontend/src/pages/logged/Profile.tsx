import { FC, useContext, useEffect, useState } from "react";
import { LoggedContext } from "./loggedContext";
import { UserService } from "../../services/userService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PostSchema } from "../../schemas/postSchema";
import { PostCard } from "../../components/PostCard";
import { PostService } from "../../services/postService";

export const Profile: FC = () => {
    const user = useContext(LoggedContext);
    const [userPosts, setUserPosts] = useState<PostSchema[][]>([]);
    const [searchParams, setSearchParams] = useSearchParams({ page: "0" });
    const pageSearchParams = searchParams.get("page");
    const [lastPageLength, setLastPageLength] = useState(0);
    const PAGE_LENGTH = 10;

    const [pageN, setProtoPageN] = useState(
        pageSearchParams ? parseInt(pageSearchParams) : 0
    );
    const [loadedPages, setLoadedPages] = useState<number[]>([]);

    const setPageN = (page: number) => {
        setProtoPageN(page);
        setSearchParams({ page: page.toString() });
    };

    const navigate = useNavigate();

    useEffect(() => {
        const user = UserService.getUser();

        if (user && !loadedPages.includes(pageN)) {
            console.log(`loading page ${pageN} ...`);

            PostService.getPostByUser(
                user.user.id,
                pageN,
                PAGE_LENGTH,
                user.user.token
            ).then((data) => {
                if (!data) return;
                if (!data.posts.length) {
                    setPageN(0);
                    return;
                }
                if (loadedPages.includes(pageN)) {
                    console.log(`${pageN} page already loaded`);
                    return;
                }
                loadedPages.push(pageN);

                userPosts.push(data.posts);
                setLastPageLength(data.posts.length);

                setLoadedPages([...loadedPages]);
                setUserPosts([...userPosts]);
            });
        }
    }, [pageN]);

    return (
        <div className="flex flex-col gap-4 container grow mx-auto">
            <section className="m-4 flex flex-col gap-4">
                <h1 className="text-3xl">{user?.user.name}</h1>
                <p>{user?.user.email}</p>
                <button
                    onClick={async () => {
                        await UserService.logout(
                            user?.user.token ? user?.user.token : ""
                        );
                        UserService.clearUser();
                        navigate("/login", { replace: true });
                    }}
                >
                    logout
                </button>
            </section>
            {userPosts ? (
                <section className="flex flex-col gap-4">
                    <h2 className="text-2xl underline font-bold">Your posts</h2>
                    {userPosts.map((page) =>
                        page.map((post) => <PostCard key={post.id} {...post} />)
                    )}
                </section>
            ) : (
                <></>
            )}
            <button
                onClick={() => {
                    setPageN(pageN + 1);
                }}
                className={`form-btn font-bold ${
                    lastPageLength == PAGE_LENGTH ? "" : "hidden"
                }`}
            >
                more
            </button>
        </div>
    );
};
