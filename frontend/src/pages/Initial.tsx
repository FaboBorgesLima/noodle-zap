import { Outlet } from "react-router-dom";
import { InitialHeader } from "../components/";

export function Initial() {
    return (
        <>
            <InitialHeader></InitialHeader>
            <main className="grow">
                <Outlet></Outlet>
            </main>
        </>
    );
}
