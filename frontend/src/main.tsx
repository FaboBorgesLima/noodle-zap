import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'
import { SignUp, Initial, Login } from './pages';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Initial />,
    children: [
      {path:'/login',element:<Login></Login>},
      {path:"/sign-up",element:<SignUp />},
    ]
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
