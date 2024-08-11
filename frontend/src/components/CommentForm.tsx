import { FC, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { AutoHeightTextArea } from "./AutoHeightTextArea";
import { CommentService } from "../services/commentService";
import { UserService } from "../services/userService";
import { CommentSchema } from "../schemas/commentSchema";

type CommentFormProps = {
    postId: string;
    onUploadComment?: (comment: CommentSchema) => any;
};

export const CommentForm: FC<CommentFormProps> = (props) => {
    const [text, setText] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();

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
            <h2 className="text-lg text-center underline">
                write a new comment
            </h2>
            <div></div>
            <AutoHeightTextArea
                onChange={(ev) => {
                    setText(ev.currentTarget.value);
                }}
                value={text}
                className="form-input w-full"
            ></AutoHeightTextArea>
            <button className="form-btn w-full">create</button>
        </Form>
    );
};
