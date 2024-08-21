import { FC } from "react";
import { UserMongoDb } from "../schemas/userMongodb";
import { MiniProfile } from "./MiniProfile";
import { Link } from "react-router-dom";
import { IoChevronForwardCircleOutline } from "react-icons/io5";

type PostHeaderProps = {
    user: UserMongoDb;
    date: number;
    title: string;
    className?: React.HTMLAttributes<HTMLElement>["className"];
    id: string;
    hasLinkToPost?: boolean;
};

export const PostHeader: FC<PostHeaderProps> = (props) => {
    const postLink = props.hasLinkToPost ? `/logged/post/${props.id}` : "";

    return (
        <Link
            className={`${props.className} ${
                props.hasLinkToPost
                    ? "flex flex-row justify-between hover:animate-pulse"
                    : "pointer-events-none"
            }`}
            to={postLink}
        >
            <div className="flex flex-col gap-4">
                <h1 className="text-xl break-words whitespace-pre-line font-bold underline">
                    {props.title}
                </h1>
                <div className="flex flex-row gap-4">
                    <MiniProfile user={props.user}></MiniProfile>
                    <span className="uppercase font-bold text-sm text-black/50 dark:text-white/50 my-auto">
                        {new Date(props.date).toLocaleString()}
                    </span>
                </div>
            </div>
            {props.hasLinkToPost ? (
                <IoChevronForwardCircleOutline className="text-4xl my-auto"></IoChevronForwardCircleOutline>
            ) : (
                <></>
            )}
        </Link>
    );
};
