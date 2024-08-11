import { FC, useEffect, useRef, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { PostService } from "../../services/postService";
import { UserService } from "../../services/userService";
import { AutoHeightTextArea } from "../../components/AutoHeightTextArea";

export const CreatePost: FC<{}> = ({}) => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const navigate = useNavigate();

    return (
        <div className="container mx-auto">
            <Form
                className="flex flex-col gap-4 frame p-4 mx-auto m-4"
                onSubmit={async () => {
                    const token = UserService.getToken();

                    if (!token) return;
                    if (await PostService.create(title, text, token))
                        navigate("/logged");
                }}
            >
                <label htmlFor="" className="form-label text-center">
                    title
                    <AutoHeightTextArea
                        placeholder="title"
                        value={title}
                        onChange={(ev) => {
                            setTitle(ev.target.value);
                        }}
                        className="form-input"
                    ></AutoHeightTextArea>
                </label>
                <label htmlFor="" className="form-label text-center">
                    text
                    <AutoHeightTextArea
                        value={text}
                        placeholder="text"
                        onChange={(ev) => {
                            setText(ev.target.value);
                        }}
                        className="form-input"
                    ></AutoHeightTextArea>
                </label>
                <button className="form-btn">post</button>
            </Form>
        </div>
    );
};
