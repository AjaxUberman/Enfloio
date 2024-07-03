import React, { useState, useContext } from "react";
import mainLogo from "../../photos/mainlogo.png";
import { FaAngleDown } from "react-icons/fa";
import LoginMenu from "../loginPage/LoginMenu";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CiMenuBurger } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

  const { user } = useContext(UserContext);

  return (
    <>
      {mobileMenuActive === false ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-around items-center font-header-poppins border-b bg-background-gray py-5 text-main-text"
        >
          <div className="flex justify-around w-full">
            <button
              onClick={() => setMobileMenuActive(!mobileMenuActive)}
              className="text-2xl"
            >
              <CiMenuBurger />
            </button>
            {user == undefined || user == null ? (
              <div className="">
                <Link
                  to="/login"
                  className="border-2 px-6 py-2 border-none rounded-xl shadow-md border-white bg-main-text text-white hover:bg-white hover:text-main-text hover:scale-110 transition duration-100 ease-in"
                >
                  Log In
                </Link>
              </div>
            ) : (
              <button
                className="flex flex-col items-center relative "
                onClick={() => setMenuActive(!menuActive)}
              >
                <div className="font-bold flex gap-2 items-center hover:text-orange-500 transition duration-200 ease-in">
                  <h1>Profile</h1>
                  <FaAngleDown />
                </div>
                {menuActive && (
                  <div className="absolute translate-y-12">
                    <LoginMenu />
                  </div>
                )}
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8 z-50 items-center bg-background-gray absolute left-0 h-screen px-10 py-10 font-semibold"
        >
          <button
            onClick={() => setMobileMenuActive(!mobileMenuActive)}
            className="text-2xl"
          >
            <IoCloseSharp />
          </button>
          <Link to={"/"} onClick={() => setMobileMenuActive(false)}>
            <img src={mainLogo} className="h-20 w-20 -translate-y-1" />
          </Link>
          <Link
            to={"/investments"}
            onClick={() => setMobileMenuActive(false)}
            className="hover:text-orange-500 hover:-translate-y-1 transition duration-200 ease-in"
          >
            Investments
          </Link>
          <Link
            to="/news"
            onClick={() => setMobileMenuActive(false)}
            className="hover:text-orange-500 hover:-translate-y-1 transition duration-200 ease-in"
          >
            News
          </Link>
        </motion.div>
      )}
    </>
  );
};

export default Header;
