import { FC } from "react";
import { CommentSchema } from "../schemas/commentSchema";
import { MiniProfile } from "./MiniProfile";

type CommentCardProps = CommentSchema;

export const CommentCard: FC<CommentCardProps> = (props) => {
    return (
        <div className="frame p-4">
            <MiniProfile user={props.user}></MiniProfile>
            <p>{props.text}</p>
        </div>
    );
};
