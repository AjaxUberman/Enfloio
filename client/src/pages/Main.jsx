import React, { useContext, useEffect, useState } from "react";
import PortfolioBalance from "../components/Main/PortfolioBalance";
import PortfolioGraph from "../components/Main/PortfolioGraph";
import { motion } from "framer-motion";
import Investments from "../components/Main/Investments";
import { UserContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const Main = () => {
  const [mainDatas, setMainDatas] = useState();
  const [dataError, setDataError] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Returning to Login Page...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [user]);

  useEffect(() => {
    if (mainDatas && mainDatas.length === 0) {
      setDataError(true);
    } else {
      setDataError(false);
    }
  }, [mainDatas]);

  console.log(dataError);

  return (
    <>
      {dataError && (
        <div className="flex h-screen w-screen justify-center items-center text-xl font-bold  text-white">
          <Link
            to="/investments"
            className="bg-orange-400 px-4 py-2 rounded-xl shadow-md"
          >
            Click here to enter your investments first.
          </Link>
        </div>
      )}
      <ToastContainer />
      {!user ? (
        <div>
          <h1 className="flex h-screen w-screen justify-center items-center text-xl font-bold text-orange-400">
            You must login to see this page...
          </h1>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="px-10 md:px-40 2xl:px-80 flex flex-col gap-10 md:py-40 py-20 overflow-x-hidden bg-white"
        >
          <PortfolioBalance setMainDatas={setMainDatas} />
          <PortfolioGraph mainDatas={mainDatas} />
          <Investments />
        </motion.div>
      )}
    </>
  );
};

export default Main;
