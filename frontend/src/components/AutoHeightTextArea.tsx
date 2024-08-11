import { FC, useEffect, useRef } from "react";

type AutoHeightTextAreaProps = {
    className?: React.HTMLAttributes<HTMLTextAreaElement>["className"];
    onChange?: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    value?: string;
};

export const AutoHeightTextArea: FC<AutoHeightTextAreaProps> = (props) => {
    const textRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textRef.current) {
            textRef.current.style.height = "0px";
            textRef.current.style.height = `${textRef.current.scrollHeight}px`;
        }
    });
    return (
        <textarea
            value={props.value}
            className={props.className}
            onChange={props.onChange}
            placeholder={props.placeholder}
            ref={textRef}
        ></textarea>
    );
};
