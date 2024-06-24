import { FC, useContext } from "react";
import { LoggedContext } from "./loggedContext";

export const Home: FC = () => {
    const userContext = useContext(LoggedContext);
    return (
        <>
            <h1>{userContext?.user.name}</h1>
        </>
    );
};
