import { FC, useContext } from "react";
import { LoggedContext } from "./loggedContext";

export const Profile: FC = () => {
    const user = useContext(LoggedContext);

    return (
        <section className="container mx-auto m-4 flex flex-col gap-4">
            <h1 className="text-3xl">{user?.user.name}</h1>
            <p>{user?.user.email}</p>
        </section>
    );
};
