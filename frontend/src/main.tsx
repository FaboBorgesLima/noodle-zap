import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { SignUp, Initial, Login, Home } from "./pages";
import { Logged } from "./pages/logged/Logged";

const router = createBrowserRouter([
    {
        path: "",
        element: <Initial />,
        children: [
            { path: "", element: <Login></Login> },
            { path: "login", element: <Login></Login> },
            { path: "sign-up", element: <SignUp /> },
        ],
    },
    {
        path: "logged",
        element: <Logged />,
        children: [{ path: "", element: <Home></Home> }],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
