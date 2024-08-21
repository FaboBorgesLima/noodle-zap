import { FC, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { AutoHeightTextArea } from "./AutoHeightTextArea";
import { CommentService } from "../services/commentService";
import { UserService } from "../services/userService";
import { CommentSchema } from "../schemas/commentSchema";
import { MiniProfile } from "./MiniProfile";

type CommentFormProps = {
    postId: string;
    onUploadComment?: (comment: CommentSchema) => any;
};

export const CommentForm: FC<CommentFormProps> = (props) => {
    const [text, setText] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();

    const user = UserService.getUser();

    return (
        <Form
            onSubmit={async () => {
                const token = UserService.getToken();

                if (!token) {
                    navigate("/");
                    return;
                }

                setIsUploading(true);

                const comment = await CommentService.create(
                    token,
                    text,
                    props.postId
                );

                setIsUploading(false);

                if (comment && props.onUploadComment) {
                    props.onUploadComment(comment);
                }

                if (comment) setText("");
            }}
            className={`frame p-4 gap-4 flex flex-col none ${
                isUploading ? "opacity-50" : ""
            }`}
        >
            {user ? (
                <MiniProfile
                    user={{ name: user.user.name, id: user.id }}
                ></MiniProfile>
            ) : (
                <></>
            )}

            <AutoHeightTextArea
                onChange={(ev) => {
                    setText(ev.currentTarget.value);
                }}
                value={text}
                placeholder="write new comment"
                className="form-input w-full"
            ></AutoHeightTextArea>
            <button className="form-btn uppercase font-bold w-full">
                post
            </button>
        </Form>
    );
};
