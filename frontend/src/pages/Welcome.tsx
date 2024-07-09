import { FC } from "react";

export const Welcome: FC = () => {
    return (
        <section className="container mx-auto m-4 flex flex-col gap-4">
            <h1 className="text-bold text-4xl underline">
                Welcome to noodle zap!
            </h1>
            <p>
                This is a simple social media like platform, where you can post
                texts and people can enjoy and comment them
            </p>
        </section>
    );
};
