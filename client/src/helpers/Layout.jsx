import React from "react";
import { Outlet } from "react-router";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { useMediaQuery } from "react-responsive";
import MobileHeader from "../components/Layout/MobileHeader";

const Layout = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 750px)" });

  return (
    <div>
      <div className="fixed top-0 w-full z-50">
        {isTabletOrMobile ? <MobileHeader /> : <Header />}
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
