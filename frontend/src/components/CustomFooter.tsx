import { FC } from "react";

export const CustomFooter: FC<{ children: React.ReactNode }> = (props) => {
    return (
        <footer className="sticky bottom-0 backdrop-blur-2xl p-4">
            {props.children}
        </footer>
    );
};
