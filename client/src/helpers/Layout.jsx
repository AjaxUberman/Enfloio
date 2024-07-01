import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const Layout = () => {
  return (
    <div>
      <div className="fixed top-0 w-full">
        <Header />
      </div>
      <div className="font-main-open-sans ">
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
