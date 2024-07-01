import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Account from "./pages/Account";
import Main from "./pages/Main";
import News from "./pages/News";
import Investments from "./pages/Investments";
import Layout from "./helpers/Layout";
import axios from "axios";
import { UserContextProvider } from "./context/UserContext";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "",
        element: <Main />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "investments",
        element: <Investments />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserContextProvider>
    <RouterProvider router={router} />
  </UserContextProvider>
);
