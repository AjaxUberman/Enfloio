import React, { useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router";

const SignIn = ({ setActiveMenu }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorHandler, setErrorHandler] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const loginHandler = async (e) => {
    e.preventDefault();
    if (email === "" && password === "") {
      setErrorHandler("Enter your password and email.");
      return;
    }
    try {
      const response = await axios.post(
        "/account/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response.data);
      setUser(response.data);
      toast.success("Login successfull.");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <ToastContainer position="bottom-right" />
      <div className="border-3 border-white text-white w-full">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col 2xl:text-2xl ">
            <h1 className="font-semibold">Welcome back to</h1>
            <h1 className="font-bold text-5xl 2xl:text-6xl drop-shadow-xl">
              enfloio
            </h1>
          </div>
          <p className="tracking-wider text-second-gray">
            Login to your account to continue.
          </p>
        </div>
        <form
          className="flex flex-col gap-2 w-full py-4"
          onSubmit={loginHandler}
        >
          <input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-3 pl-2 border rounded-md shadow-xl text-main-gray focus:outline-main-gray focus:scale-105 transition duration-100 ease-in"
          />
          <input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-3 pl-2 border rounded-md shadow-xl text-main-gray focus:outline-main-gray focus:scale-105 transition duration-100 ease-in"
          />
        </form>
        <div>
          <button
            className="bg-focus-blue w-full py-3 rounded-md hover:bg-dark-blue hover:scale-105 transition duration-100 ease-in "
            onClick={loginHandler}
          >
            Log In
          </button>
          <p className="mt-4 tracking-wider">
            Don't have an account?
            <button
              className="underline"
              onClick={() => setActiveMenu("register")}
            >
              Sign Up
            </button>
          </p>
        </div>
        {errorHandler && <div className="text-red-400">{errorHandler}</div>}
      </div>
    </div>
  );
};

export default SignIn;
