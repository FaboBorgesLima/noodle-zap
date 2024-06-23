import { FC } from "react";
import { Link } from "react-router-dom";

export const InitialHeader: FC = () => {
    return (
        <header className="w-full bg-zinc-950 p-4">
            <nav className="container mx-auto flex flex-row justify-between items-center">
                <Link to={"/"} className="header-btn">
                    beginning
                </Link>
                <div className="flex flex-row gap-4 items-center">
                    <Link to={"/sign-up"} className="header-btn">
                        sign up
                    </Link>
                    <Link to={"/login"} className="header-btn">
                        login
                    </Link>
                </div>
            </nav>
        </header>
    );
};
