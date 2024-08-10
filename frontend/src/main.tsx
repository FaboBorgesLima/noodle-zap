import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import { SignUp, Initial, Login, Welcome } from "./pages";
import { Home, Logged, Profile } from "./pages/logged";
import { CreatePost } from "./pages/logged/CreatePost";
import { Post } from "./pages/logged/Post";

const router = createBrowserRouter([
    {
        path: "",
        element: <Initial />,
        children: [
            { path: "", element: <Welcome></Welcome> },
            { path: "login", element: <Login></Login> },
            { path: "sign-up", element: <SignUp /> },
        ],
    },
    {
        path: "logged",
        element: <Logged />,
        children: [
            { path: "", element: <Home></Home> },
            { path: "profile", element: <Profile></Profile> },
            { path: "create-post", element: <CreatePost></CreatePost> },
            { path: "post/:id", element: <Post></Post> },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
