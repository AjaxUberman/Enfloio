import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginMenu = () => {
  const { setUser } = useContext(UserContext);
  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/account/logout", {}, { withCredentials: true });
      setUser(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md border ">
      <div className="flex flex-col">
        <Link
          to="/account"
          className="px-16 2xl:px-32 py-2 hover:bg-main-gray hover:text-white rounded-t-xl whitespace-nowrap"
        >
          My Profile
        </Link>
        <Link
          to="/login"
          className="border-t px-16 2xl:px-32 py-2 hover:bg-main-gray hover:text-white rounded-b-xl"
          onClick={logoutHandler}
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default LoginMenu;
