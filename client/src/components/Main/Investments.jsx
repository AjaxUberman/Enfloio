import React, { useEffect, useState, useContext } from "react";
import { LuMoveUpRight } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";

const Investments = () => {
  const [datas, setDatas] = useState([]);
  const { user, loggedIn } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn && !user) {
      toast.error("You must login!");
    }
    if (user) {
      const userID = user.id || user._id;
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/investments/${userID || user._id}`,
            {
              withCredentials: true,
            }
          );
          setDatas(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          toast.error("Failed to fetch data. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const priceChangePercentage = (price1, price2) => {
    return (((price2 - price1) / price1) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <ClipLoader />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {datas.length > 0 && (
        <>
          <ToastContainer position="top-center" />
          <div className="flex justify-between">
            <h1 className="font-bold md:text-2xl">Investments</h1>
            <Link
              to="/investments"
              className="text-secondary-text text-sm md:text-lg underline font-semibold"
            >
              See More
            </Link>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {datas.map((data, index) => (
              <Link to="/investments" key={index}>
                <div className="flex items-end justify-around gap-6 border rounded-md shadow-md border-main-gray py-4 px-6">
                  <div className="flex flex-col">
                    <h1 className="text-main-text font-semibold">
                      {data.asset}
                    </h1>
                    <span className="text-secondary-text tracking-wider capitalize">
                      {data.assetType}
                    </span>
                  </div>
                  <div
                    className={`${
                      priceChangePercentage(
                        data.purchasePrice,
                        data.currentPrice
                      ) > 0
                        ? "text-positive-green"
                        : "text-red-600"
                    } flex items-baseline gap-1 `}
                  >
                    <LuMoveUpRight />
                    <span>
                      %
                      {priceChangePercentage(
                        data.purchasePrice,
                        data.currentPrice
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Investments;
