import { FC } from "react";
import { Link } from "react-router-dom";

export const Home: FC = () => {
    return (
        <div className="container mx-auto">
            <Link to={"/logged/create-post"}>+</Link>
        </div>
    );
};
