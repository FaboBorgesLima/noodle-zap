import { FC, useState } from "react";
import { CommentSchema } from "../schemas/commentSchema";
import { MiniProfile } from "./MiniProfile";
import { UserService } from "../services/userService";
import { IoTrashBinOutline } from "react-icons/io5";
import { CommentService } from "../services/commentService";

type CommentCardProps = CommentSchema & { postId: string };

export const CommentCard: FC<CommentCardProps> = (props) => {
    const [isDeleted, setIsDeleted] = useState(false);
    return (
        <div className={`frame p-4 ${isDeleted ? "hidden" : ""}`}>
            <header className="flex flex-row justify-between">
                <MiniProfile user={props.user}></MiniProfile>
                {UserService.isLoggedUserId(props.user.id) ? (
                    <button
                        className="bg-red-500 text-white font bold text-xl p-2 rounded-md flex flex-row gap-2 font-bold items-center"
                        onClick={async () => {
                            const token = UserService.getToken();

                            const wannaDelete = confirm(
                                "do you wanna to delete this comment permanently?"
                            );

                            if (!token) {
                                return;
                            }

                            if (wannaDelete) {
                                const del = await CommentService.delete(
                                    token,
                                    props.postId,
                                    props.id
                                );

                                setIsDeleted(del);
                            }
                        }}
                    >
                        <span>delete</span>{" "}
                        <IoTrashBinOutline></IoTrashBinOutline>
                    </button>
                ) : (
                    <></>
                )}
            </header>
            <span className="opacity-75">
                {new Date(props.date).toLocaleString()}
            </span>
            <p className="break-words whitespace-pre-line">{props.text}</p>
        </div>
    );
};
