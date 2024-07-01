import React, { useContext, useState, useEffect } from "react";
import SignIn from "../components/loginPage/SignIn";
import bglogin2 from "../photos/bg-login-2.jpg";
import Register from "../components/loginPage/Register";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [activeMenu, setActiveMenu] = useState("login");

 
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`grid grid-cols-3 h-screen px-20 2xl:px-52 items-center bg-cover  `}
      style={{ backgroundImage: `url(${bglogin2})` }}
    >
      <div className="col-span-2 flex flex-col gap-4 pl-40  justify-center text-background-gray">
        <h1 className="font-bold text-5xl 2xl:text-7xl drop-shadow-2xl font-header-poppins ">
          Welcome back...
        </h1>
        <span className="font-semibold text-l 2xl:text-xl text-second-gray">
          Your savings are waiting for you!
        </span>
      </div>
      <div>
        {activeMenu === "login" ? (
          <SignIn setActiveMenu={setActiveMenu} />
        ) : (
          <Register setActiveMenu={setActiveMenu} />
        )}
      </div>
    </motion.div>
  );
};

export default LoginPage;
