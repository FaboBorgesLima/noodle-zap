import { FC, useEffect, useRef, useState } from "react";
import { PostSchema } from "../schemas/postSchema";

export const PostCard: FC<PostSchema> = (props) => {
    const [readMore, setReadMore] = useState(false);
    const [isTooBig, setIsTooBig] = useState(false);

    const textRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        setIsTooBig(
            textRef.current?.scrollHeight != textRef.current?.clientHeight
        );
    }, []);

    return (
        <div className="frame flex flex-col gap-4">
            <header className="flex flex-row gap-4 px-4 pt-4">
                <div>
                    <h2 className="text-2xl font-bold">{props.user.name}</h2>
                </div>
                <span className="uppercase font-bold text-sm text-black/50 dark:text-white/50 my-auto">
                    {new Date(props.date).toLocaleString()}
                </span>
            </header>
            <section className="flex flex-col gap-4 ">
                <h1 className="text-xl font-bold underline px-4">
                    {props.title}
                </h1>
                <div className="relative">
                    <p
                        ref={textRef}
                        className={`break-words whitespace-pre-line px-4 pb-4 ${
                            readMore ? "h-full" : "max-h-40"
                        } overflow-hidden`}
                    >
                        {props.text}
                    </p>
                    {isTooBig ? (
                        <button
                            onClick={() => {
                                setReadMore(!readMore);
                                textRef.current?.scrollIntoView();
                            }}
                            className={`${
                                readMore ? "static" : "absolute"
                            } bottom-0 block w-full font-bold right-0 bg-gradient-to-t from-purple-500 dark:from-purple-700/90 opacity-85 hover:opacity-100 transition-all duration-300 to-transparent h-8`}
                        >
                            {readMore ? "read less" : "read more"}
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </section>
        </div>
    );
};
