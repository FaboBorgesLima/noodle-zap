import { FC } from "react";
import { Link } from "react-router-dom";

export const LoggedHeader: FC = () => {
    return (
        <header className="w-full bg-zinc-950 p-4">
            <nav className="container mx-auto flex flex-row justify-between items-center">
                <div className="flex flex-row gap-4 items-center">
                    <Link to={"/logged/"} className="header-btn">
                        home
                    </Link>
                    <Link to={"/logged/profile"} className="header-btn">
                        profile
                    </Link>
                </div>
            </nav>
        </header>
    );
};
