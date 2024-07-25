import { FC, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LoggedHeader } from "../../components";
import { UserFromDb } from "../../schemas/userFromDb";
import { LoggedContext } from "./loggedContext";
import { UserService } from "../../services/userService";

export const Logged: FC = () => {
    const [user, setUser] = useState<UserFromDb | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function loggin() {
            const token = UserService.getToken();

            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            const userFromDb = await UserService.getUserByToken(token);

            if (!userFromDb) {
                navigate("/login", { replace: true });
                return;
            }

            setUser({ ...userFromDb });
        }
        loggin();
    }, []);

    return (
        <LoggedContext.Provider value={user}>
            <LoggedHeader></LoggedHeader>
            <main className="flex flex-col grow">
                <Outlet></Outlet>
            </main>
        </LoggedContext.Provider>
    );
};
