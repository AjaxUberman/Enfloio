import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Register = ({ setActiveMenu }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) {
      return;
    }
    if (password < 5) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password === passwordConfirm) {
      try {
        await axios.post(
          "/account/register",
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        alert("Registration successful");
        setEmail("");
        setPassword("");
        setActiveMenu("login");
        setPasswordConfirm("");
      } catch (error) {
        alert("Already registered with this email.");
      }
    }
  };

  return (
    <div>
      <div className="border-3 border-white text-white w-full">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col 2xl:text-2xl  ">
            <h1 className="font-semibold">Welcome to</h1>
            <h1 className="font-bold text-5xl 2xl:text-6xl drop-shadow-xl">
              enfloio
            </h1>
          </div>
          <p>Sign up your account to continue.</p>
        </div>
        <form
          className="flex flex-col gap-3 w-full py-4"
          onSubmit={submitHandler}
        >
          <input
            placeholder="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="py-3 pl-4 border rounded-md shadow-xl focus:outline-main-gray focus:scale-105 transition duration-100 ease-in text-main-gray"
          />
          <input
            placeholder="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="py-3 pl-4 border rounded-md shadow-xl focus:outline-main-gray focus:scale-105 transition duration-100 ease-in text-main-gray"
          />
          <input
            placeholder="password again"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="py-3 pl-4 border rounded-md shadow-xl focus:outline-main-gray focus:scale-105 transition duration-100 ease-in text-main-gray"
          />
          <button className="bg-focus-blue w-full py-3 rounded-md shadow-lg hover:bg-dark-blue hover:scale-105 transition duration-100 ease-in ">
            Sign Up
          </button>
        </form>
        <div>
          <p className=" tracking-wider drop-shadow-2xl">
            Already have an account?
            <button
              className="underline"
              onClick={() => setActiveMenu("login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
