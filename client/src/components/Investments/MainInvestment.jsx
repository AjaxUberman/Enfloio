import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import Slider from "react-slick";

const MainInvestment = () => {
  const [datas, setDatas] = useState([]);
  const { user, loggedIn } = useContext(UserContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTotalPrice, setCurrentTotalPrice] = useState([]);
  const [currentTotal, setCurrentTotal] = useState("");
  const [startingTotal, setStartingTotal] = useState("");
  const [cryptoTotal, setCryptoTotal] = useState("");
  const [bistTotal, setBistTotal] = useState("");

  const fetchData = async () => {
    if (loggedIn && !user) {
      return toast.warning("You must login before use this page.");
    }
    if (loggedIn && user) {
      const userID = user.id;
      if (userID) {
        const response = await axios.get(`/investments/${userID}`, {
          withCredentials: true,
        });
        console.log(response.data);
        setDatas(response.data);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const differenceInDays = (startDate, currentDate) => {
    const date1 = new Date(startDate);
    const date2 = new Date(currentDate);
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const priceData = {};
      for (const data of datas) {
        try {
          if (data.assetType === "crypto") {
            try {
              const response = await axios.get(
                `/investments/coin/${data.assetID.toLowerCase()}`
              );
              priceData[data.assetID] = response.data;
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          }
          if (data.assetType === "bist") {
            priceData[data.assetID] = data.pieces * data.purchasePrice;
          }
        } catch (error) {
          toast.error(`${error.message}`);
        }
      }
      setCurrentTotalPrice(priceData);
    };

    if (datas.length > 0 && loggedIn) {
      fetchPrices();
    }
  }, [datas]);

  const priceChangePercentage = (price1, price2) => {
    return (((price2 - price1) / price1) * 100).toFixed(2);
  };

  useEffect(() => {
    if (!datas) {
      return;
    }
    const currentTotalCalculator = async () => {
      let final = 0;
      let cryptoTotal = 0;
      let bistTotal = 0;
      for (const key in currentTotalPrice) {
        const assetData = await datas.find((data) => data.assetID === key);
        if (assetData) {
          final += currentTotalPrice[key] * assetData.pieces;
        }
      }
      const cryptoData = await datas.filter(
        (data) => data.assetType === "crypto"
      );
      if (cryptoData) {
        for (const i in cryptoData) {
          cryptoTotal += cryptoData[i].currentPrice * cryptoData[i].pieces;
        }
      }
      const bistData = datas.filter((data) => data.assetType === "bist");
      if (bistData) {
        for (const i in bistData) {
          bistTotal += bistData[i].purchasePrice * bistData[i].pieces;
        }
      }

      setCurrentTotal(final.toFixed(4));
      setCryptoTotal(cryptoTotal.toFixed(4));
      setBistTotal(bistTotal.toFixed(4));
    };
    currentTotalCalculator();
    const startingTotalCalculator = () => {
      let final = 0;
      for (const data in datas) {
        final += datas[data].pieces * datas[data].purchasePrice;
      }
      setStartingTotal(final);
    };
    startingTotalCalculator();
  }, [datas, currentTotalPrice]);

  useEffect(() => {
    const postData = async () => {
      if (currentTotal > 0) {
        try {
          await axios.post(
            "/investments",
            {
              currentTotal,
              startingTotal,
              bistTotal,
              cryptoTotal,
            },
            { withCredentials: true }
          );
        } catch (error) {
          toast.error(error);
        }
      }
    };
    postData();
  }, [currentTotal, bistTotal, cryptoTotal]);

  const deleteHandler = (deleteID) => {
    const deleteData = async () => {
      try {
        const response = await axios.post(
          "/investments/delete/" + deleteID,
          { deleteID },
          { withCredentials: true }
        );
        if ((response.status = 200)) {
          toast("Delete succesfull.");
          fetchData();
        }
      } catch (error) {
        console.error("Delete failed");
      }
    };
    deleteData();
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <ToastContainer />
      {datas &&
        datas.map((data, index) => (
          <div
            className="border rounded-xl shadow-md md:px-14 px-4 py-6 grid md:grid-cols-4 items-center relative"
            key={index}
          >
            <div className="flex md:flex-col md:gap-2 gap-6 items-center md:items-start mb-4 md:mb-0 col-span-1">
              <h1 className="capitalize font-bold text-xl text-main-gray">
                {data.asset}
              </h1>
              <p className="text-secondary-text">{data.assetID}</p>
            </div>
            <div className="flex flex-col md:gap-6 col-span-3 items-start text-lg">
              <div className=" slider-container md:flex grid grid-cols-1 md:gap-20 gap-5 ">
                <div className="flex flex-col gap-1">
                  <p className="text-secondary-text  underline">
                    Purchase Price
                  </p>
                  <p className="font-semibold">{data.purchasePrice}$</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-secondary-text  underline">Total Price</p>
                  <p className="font-semibold">
                    {data.purchasePrice * data.pieces}$
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-secondary-text  underline">
                    Current Total Price
                  </p>
                  <p className="font-semibold">
                    {data.assetType === "crypto"
                      ? (data.currentPrice * data.pieces).toFixed(4) + "$"
                      : (data.purchasePrice * data.pieces).toFixed(4) + "$"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 mb-5 md:mb-0">
                  <p className="text-secondary-text  underline">Profit</p>
                  <p
                    className={`${
                      data.currentPrice > data.purchasePrice
                        ? "text-positive-green"
                        : "text-red-500"
                    } font-semibold `}
                  >
                    {data.assetType === "crypto"
                      ? (
                          data.currentPrice * data.pieces -
                          data.purchasePrice * data.pieces
                        ).toFixed(4) + "$"
                      : "No Api Data For Bist"}
                  </p>
                </div>
              </div>
              <div className="md:flex md:gap-20 grid grid-cols-2 gap-x-10 gap-y-5">
                <div className="flex flex-col gap-1">
                  <p className="text-secondary-text underline">Purchase Date</p>
                  <p className="font-semibold">
                    {data.startDate ? formatDate(data.startDate) : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-secondary-text underline">Days</p>
                  <p className="font-semibold">
                    {differenceInDays(data.startDate, currentDate)} Days
                  </p>
                </div>
                <div className="flex flex-col gap-1 md:translate-x-8">
                  <p className="text-secondary-text underline">
                    Percent Change
                  </p>
                  <p
                    className={`${
                      priceChangePercentage(
                        data.purchasePrice,
                        data.currentPrice
                      ) > 0
                        ? "text-positive-green"
                        : "text-red-500"
                    } font-semibold text-xl`}
                  >
                    {priceChangePercentage(
                      data.purchasePrice,
                      data.currentPrice
                    )}
                    %
                  </p>
                </div>
                <button
                  className="bg-red-500 py-1 px-3 rounded-xl shadow-md absolute right-4 bottom-4 text-white font-semibold hover:scale-105 hover:bg-red-600 hover:-translate-y-1 transition duration-200 ease-in"
                  onClick={() => deleteHandler(data._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MainInvestment;
