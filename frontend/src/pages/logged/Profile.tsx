import { FC, useContext } from "react";
import { LoggedContext } from "./loggedContext";
import { UserService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export const Profile: FC = () => {
    const user = useContext(LoggedContext);
    const navigate = useNavigate();

    return (
        <section className="container mx-auto m-4 flex flex-col gap-4">
            <h1 className="text-3xl">{user?.user.name}</h1>
            <p>{user?.user.email}</p>
            <button
                onClick={async () => {
                    await UserService.logout(
                        user?.user.token ? user?.user.token : ""
                    );

                    UserService.clearUser();

                    navigate("/login", { replace: true });
                }}
            >
                logout
            </button>
        </section>
    );
};
