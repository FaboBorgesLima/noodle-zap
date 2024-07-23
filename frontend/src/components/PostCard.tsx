import { FC } from "react";
import { PostSchema } from "../schemas/postSchema";

export const PostCard: FC<PostSchema> = (props) => {
    return (
        <div className="frame p-4 flex flex-col  gap-4">
            <div className="flex flex-row gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{props.user.name}</h2>
                </div>
                <span className="uppercase font-bold text-sm text-black/50 dark:text-white/50 my-auto">
                    {new Date(props.date).toLocaleString()}
                </span>
            </div>
            <h1 className="text-xl font-bold underline">{props.title}</h1>
            <p className="break-words whitespace-pre-line">{props.text}</p>
        </div>
    );
};
