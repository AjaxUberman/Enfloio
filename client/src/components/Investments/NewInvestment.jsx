import React, { useContext, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa6";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

const NewInvestment = ({ setNewInvestment }) => {
  const [assetType, setAssetType] = useState("Select Asset Type");
  const [assetActive, setAssetActive] = useState(false);

  const [asset, setAsset] = useState("");
  const [assetSearcher, setAssetSearcher] = useState("");
  const [assetMenuActive, setAssetMenuActive] = useState(false);
  const [coinList, setCoinList] = useState([]);
  const [bistData, setBistData] = useState([]);
  const [assetID, setAssetID] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [pieces, setPieces] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useContext(UserContext);

  const assetTypeMenuHandler = (e) => {
    e.preventDefault();
    setAssetActive(!assetActive);
  };

  const assetHandler = (e) => {
    e.preventDefault();
    setAssetType(e.currentTarget.value);
    setAssetActive(false);
  };

  const assetMenuHandler = (e) => {
    e.preventDefault();
    setAssetMenuActive(!assetMenuActive);
  };

  const assetInputHandler = (e) => {
    setAssetMenuActive(true);
    setAssetSearcher(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/investments/coinlist")
        .then((res) => setCoinList(res.data));
    };
    fetchData();
  }, []);

  const assetSelectHandler = (e, second) => {
    e.preventDefault();
    setAsset(e.currentTarget.value);
    setAssetMenuActive(false);
    setAssetID(second);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && asset !== "") {
      setAsset(asset.slice(0, -1));
    }
  };

  const cancelHandler = (e) => {
    e.preventDefault();
    setAssetType("Select Asset Type");
    setAsset("");
    setPurchasePrice("");
    setPieces("");
    setStartDate(new Date());
    setNewInvestment(false);
  };

  const userID = user.id;
  const saveHandler = async (e) => {
    e.preventDefault();
    if (user) {
      await axios.post(
        `/investments/${userID}`,
        {
          userID,
          assetType,
          asset,
          assetID,
          pieces,
          purchasePrice,
          startDate,
        },
        { withCredentials: true }
      );
      setNewInvestment(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/investments/bist", {
        withCredentials: true,
      });
      setBistData(response.data.data);
    };
    fetchData();
  }, [assetType]);

  return (
    <div className="border py-10 flex flex-col w-96 gap-4 items-center justify-center bg-white rounded-xl shadow-md">
      <ToastContainer />
      {assetType === "bist" ? (
        <p className="text-red-400">No Current Price Data for Bist</p>
      ) : (
        ""
      )}
      <h1 className="font-semibold text-xl">Add New</h1>
      <form onSubmit={saveHandler}>
        <div className="flex flex-col gap-2">
          <button
            className="flex items-center justify-between border rounded-md px-5 py-2 w-80 shadow-md capitalize"
            onClick={assetTypeMenuHandler}
          >
            <p>{assetType}</p>
            {assetActive ? <FaCaretDown /> : <FaCaretUp />}
          </button>
          {assetActive && (
            <div className="rounded-xl border z-10 flex flex-col shadow-md absolute translate-y-12 bg-white w-80">
              <button
                value={"crypto"}
                className="hover:bg-orange-400 hover:text-white px-4 py-2 rounded-t-xl border-b"
                onClick={assetHandler}
              >
                Crypto
              </button>
              <button
                value={"bist"}
                className="hover:bg-orange-400 hover:text-white px-4 py-2  border-b"
                onClick={assetHandler}
              >
                Bist
              </button>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between capitalize relative">
              <input
                placeholder={"Select Asset"}
                value={asset ? asset : assetSearcher}
                className="border rounded-md px-5 shadow-md py-2 w-80 focus:outline-none focus:border-main-gray"
                onChange={assetInputHandler}
                onKeyDown={handleKeyDown}
              />
              <button onClick={assetMenuHandler} className="absolute right-5">
                {assetMenuActive ? <FaCaretDown /> : <FaCaretUp />}
              </button>
              {assetMenuActive && (
                <div className="rounded-xl border z-10 flex flex-col shadow-md absolute top-0 translate-y-12 bg-white w-80 h-96 overflow-y-scroll scrollbar scrollbar-thumb-main-gray scrollbar-track-secondary-text">
                  {assetType === "crypto" &&
                    coinList &&
                    coinList
                      .filter((coin) =>
                        coin.name
                          .toLowerCase()
                          .includes(assetSearcher.toLowerCase())
                      )
                      .map((coin, index) => (
                        <button
                          value={coin.name}
                          className={`hover:bg-orange-400 hover:text-white px-4 py-2  border-b flex items-center justify-between ${
                            index === 0 ? "rounded-t-xl" : ""
                          }`}
                          onClick={(e) => assetSelectHandler(e, coin.id)}
                          key={index}
                        >
                          <p className="text-main-text">
                            {coin.name.length > 15
                              ? coin.name.slice(0, 15).concat("...")
                              : coin.name}
                          </p>
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-10 h-10 rounded-xl"
                          />
                        </button>
                      ))}
                  {assetType === "bist" &&
                    bistData &&
                    bistData
                      .filter((coin) =>
                        coin.kod
                          .toLowerCase()
                          .includes(assetSearcher.toLowerCase())
                      )
                      .map((coin, index) => (
                        <button
                          value={coin.kod}
                          className={`hover:bg-orange-400 hover:text-white px-4 py-2  border-b flex items-center justify-between ${
                            index === 0 ? "rounded-t-xl" : ""
                          }`}
                          onClick={(e) => assetSelectHandler(e, coin.ad)}
                          key={index}
                        >
                          <p className="text-main-text">
                            {coin.kod.length > 15
                              ? coin.kod.slice(0, 15).concat("...")
                              : coin.kod}
                          </p>
                        </button>
                      ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 w-80">
            <input
              value={purchasePrice}
              placeholder="Purchase Price"
              className="border rounded-md px-5 shadow-md py-2  focus:outline-none focus:border-main-gray"
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
            <input
              value={pieces}
              placeholder="Pieces"
              className="border rounded-md px-5 shadow-md py-2  focus:outline-none focus:border-main-gray"
              onChange={(e) => setPieces(e.target.value)}
            />
          </div>
          <div className="border rounded-md px-5 shadow-md py-2 w-80 focus:outline-none focus:border-main-gray">
            <h1 className="opacity-65">Purchase Date</h1>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="focus:outline-none cursor-pointer h-full w-full"
              wrapperClassName="w-full h-full"
            />
          </div>
          <div className="grid grid-cols-2">
            <button
              className="py-2 bg-money-blue hover:bg-dark-blue transition duration-100 ease-in text-white rounded-xl shadow-md"
              onClick={cancelHandler}
            >
              Cancel
            </button>
            <button
              className="py-2 bg-orange-400 hover:bg-orange-600 transition duration-100 ease-in text-white rounded-xl shadow-md"
              onClick={saveHandler}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewInvestment;
