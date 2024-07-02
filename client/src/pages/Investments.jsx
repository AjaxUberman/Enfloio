import React, { useContext, useEffect, useState } from "react";
import { MdOutlineAttachMoney } from "react-icons/md";
import NewInvestment from "../components/Investments/NewInvestment";
import MainInvestment from "../components/Investments/MainInvestment";
import { motion } from "framer-motion";
import { UserContext } from "../context/UserContext";
import { Navigate, useNavigate } from "react-router-dom";

const Investments = () => {
  const [newInvestment, setNewInvestment] = useState(false);
  const { user, loggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loggedIn) {
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-32 px-40  flex flex-col gap-6 "
    >
      <div className="flex justify-between">
        <h1 className="2xl:text-5xl text-4xl font-bold text-main-text">
          Your Investments
        </h1>
        <button
          className="bg-orange-400 px-4 py-1 shadow-md rounded-xl text-white font-semibold flex gap-2 items-center hover:bg-orange-500 hover:scale-105 transition duration-100 ease-in"
          onClick={() => setNewInvestment(!newInvestment)}
        >
          <MdOutlineAttachMoney className="text-xl" />
          <p>Add New Investment</p>
        </button>
      </div>
      {newInvestment && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-end items-center h-full"
        >
          <NewInvestment setNewInvestment={setNewInvestment} />
        </motion.div>
      )}
      <MainInvestment />
    </motion.div>
  );
};

export default Investments;
