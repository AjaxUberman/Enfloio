import React, { useContext, useState } from "react";
import PortfolioBalance from "../components/Main/PortfolioBalance";
import PortfolioGraph from "../components/Main/PortfolioGraph";
import { motion } from "framer-motion";
import Investments from "../components/Main/Investments";
import { UserContext } from "../context/UserContext";
import { redirect } from "react-router-dom";

const Main = () => {
  const [mainDatas, setMainDatas] = useState();
  const { user } = useContext(UserContext);

  return (
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
  );
};

export default Main;
