import { Outlet, useNavigate } from "react-router-dom";
import { InitialHeader } from "../components/";
import { useEffect } from "react";
import { UserService } from "../services/userService";

export function Initial() {
    const navigate = useNavigate();
    useEffect(() => {
        async function onInit() {
            const token = UserService.getToken();

            if (!token) return;

            const user = await UserService.getUserByToken(token);

            if (!user) return;

            navigate("/logged", { replace: true });
        }
        onInit();
    });
    return (
        <>
            <InitialHeader></InitialHeader>
            <main className="grow flex flex-col">
                <Outlet></Outlet>
            </main>
        </>
    );
}
