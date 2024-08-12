import { FC } from "react";
import { CommentSchema } from "../schemas/commentSchema";
import { MiniProfile } from "./MiniProfile";

type CommentCardProps = CommentSchema;

export const CommentCard: FC<CommentCardProps> = (props) => {
    return (
        <div className="frame p-4">
            <MiniProfile user={props.user}></MiniProfile>
            <span className="opacity-75">
                {new Date(props.date).toLocaleString()}
            </span>
            <p className="break-words whitespace-pre-line">{props.text}</p>
        </div>
    );
};
