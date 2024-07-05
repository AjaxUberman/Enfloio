import React, { useState, useContext } from "react";
import mainLogo from "../../photos/mainlogo.png";
import { FaAngleDown } from "react-icons/fa";
import LoginMenu from "../loginPage/LoginMenu";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  const { user } = useContext(UserContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-around items-center font-header-poppins border-b bg-background-gray text-main-text"
    >
      <div className="flex gap-8 items-center justify-center font-semibold">
        <Link to={"/"}>
          <img
            alt="mainLogo"
            src={mainLogo}
            className="h-20 w-20 -translate-y-1"
          />
        </Link>
        <Link
          to={"/investments"}
          className="hover:text-orange-500 hover:-translate-y-1 transition duration-200 ease-in"
        >
          Investments
        </Link>
        <Link
          to="/news"
          className="hover:text-orange-500 hover:-translate-y-1 transition duration-200 ease-in"
        >
          News
        </Link>
      </div>

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
    </motion.div>
  );
};

export default Header;
