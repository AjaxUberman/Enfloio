import React, { useContext, useEffect, useState } from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { motion } from "framer-motion";
import axios from "axios";
import ClimbingBoxLoader from "react-spinners/ClipLoader";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";

const PortfolioBalance = ({ setMainDatas }) => {
  const headerText = "Your Portfolio Balance is".split(" ");

  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([0, 0, 0, 0]);
  const [cryptoPie, setCryptoPie] = useState("");
  const [bistPie, setBistPie] = useState("");
  const navigate = useNavigate();

  ChartJS.register(ArcElement, Tooltip, Legend);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/investments", {
          withCredentials: true,
        });
        if (response.data === "Token not found") {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }
        setDatas(response.data);
        const currentMonth = new Date().toLocaleString("default", {
          month: "long",
        });
        const isCurrentMonth = monthlyData.find(
          (data) => data.month === currentMonth
        );
        if (!isCurrentMonth && response.data.length > 0) {
          setMonthlyData((prevData) => {
            const newData = [
              ...prevData,
              {
                month: currentMonth,
                income: response.data[0].currentTotal,
              },
            ];
            const monthlySave = newData.slice(-5);
            return monthlySave;
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Veri yüklenirken hata oluştu:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [monthlyData]);

  useEffect(() => {
    const postData = async () => {
      if (datas && datas.length > 0 && datas[0].id) {
        await axios.post(
          "/account/graph",
          {
            monthlyData,
            id: datas[0].id,
          },
          { withCredentials: true }
        );
      }
    };
    if (monthlyData.length > 0) {
      postData();
    }
    setMainDatas(datas);
  }, [monthlyData, datas, setMainDatas]);

  const priceChangePercentage = (price1, price2) => {
    return (((price2 - price1) / price1) * 100).toFixed(2);
  };

  useEffect(() => {
    if (Array.isArray(datas) && datas.length > 0) {
      const cryptoP = (datas[0].cryptoTotal * 100) / datas[0].currentTotal;
      setCryptoPie(cryptoP);
      setBistPie(100 - cryptoP);
    }
  }, [datas]);

  const pieData = {
    labels: ["Crypto", "Bist"],
    datasets: [
      {
        label: "Asset Distribution",
        data: [cryptoPie, bistPie],
        backgroundColor: ["rgba(255, 159, 64, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <ToastContainer />
      <div className="flex justify-between gap-10">
        {loading ? (
          <div className="col-span-3 flex justify-center items-center">
            <ClimbingBoxLoader />
          </div>
        ) : datas.length < 1 ? (
          ""
        ) : (
          datas &&
          datas.length > 0 &&
          datas.map((data, index) => (
            <div
              key={index}
              className="col-span-2 flex flex-col gap-10 items-start"
            >
              <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                  {headerText.map((el, i) => (
                    <motion.span
                      className="2xl:text-5xl text-4xl font-bold text-main-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1.5,
                        delay: i / 10,
                      }}
                      key={i}
                    >
                      {el}
                    </motion.span>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 2,
                  }}
                  className="flex gap-4 items-baseline"
                >
                  <div className="flex gap-1 items-baseline text-money-blue text-4xl font-bold">
                    <p>$</p>
                    <motion.h2>{data.currentTotal}</motion.h2>
                  </div>
                  <motion.span
                    className={`${
                      priceChangePercentage(
                        data.startingTotal,
                        data.currentTotal
                      ) > 0
                        ? "text-positive-green"
                        : "text-red-500"
                    } flex gap-2 items-center text-positive-green font-semibold`}
                  >
                    <BsFillArrowUpRightCircleFill />
                    <p>
                      {priceChangePercentage(
                        data.startingTotal,
                        data.currentTotal
                      )}
                      this month
                    </p>
                  </motion.span>
                </motion.div>
              </div>
              <div className="flex gap-8">
                <div className="flex flex-col border-r pr-10">
                  <h1 className="text-secondary-text uppercase">
                    Crypto Value
                  </h1>
                  <p className="text-main-text font-semibold text-2xl">
                    ${data.cryptoTotal}
                  </p>
                </div>
                <div className="flex flex-col border-r pr-10">
                  <h1 className="text-secondary-text uppercase">Bist Value</h1>
                  <p className="text-main-text font-semibold text-2xl">
                    ${data.bistTotal}
                  </p>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-secondary-text uppercase">
                    Starting Balance
                  </h1>
                  <p className="text-main-text font-semibold text-2xl">
                    ${data.startingTotal}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div className={`h-56 ${datas.length < 1 ? "hidden" : ""}`}>
          <Pie data={pieData} />
        </div>
      </div>{" "}
    </>
  );
};

export default PortfolioBalance;
