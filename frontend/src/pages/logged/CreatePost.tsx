import { FC, useEffect, useRef, useState } from "react";
import { Form } from "react-router-dom";
import { PostService } from "../../services/postService";
import { UserService } from "../../services/userService";

export const CreatePost: FC<{}> = ({}) => {
    const [title, setTitle] = useState("");

    const [text, setText] = useState("");

    const titleRef = useRef<HTMLTextAreaElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (titleRef.current) {
            titleRef.current.style.height = "0px";
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }

        if (textRef.current) {
            textRef.current.style.height = "0px";
            textRef.current.style.height = `${textRef.current.scrollHeight}px`;
        }
    });

    return (
        <div className="container mx-auto">
            <Form
                className="flex flex-col gap-4 frame p-4 mx-auto m-4"
                onSubmit={async () => {
                    const token = UserService.getToken();

                    if (!token) return;
                    console.log(await PostService.create(title, text, token));

                    console.log(await PostService.getPage(0, 100, token));
                }}
            >
                <label htmlFor="" className="form-label text-center">
                    title
                    <textarea
                        placeholder="title"
                        value={title}
                        onChange={(ev) => {
                            setTitle(ev.target.value);
                        }}
                        className="form-input"
                        ref={titleRef}
                    ></textarea>
                </label>
                <label htmlFor="" className="form-label text-center">
                    text
                    <textarea
                        value={text}
                        placeholder="text"
                        onChange={(ev) => {
                            setText(ev.target.value);
                        }}
                        className="form-input"
                        ref={textRef}
                    ></textarea>
                </label>
                <button className="form-btn">post</button>
            </Form>
        </div>
    );
};
