import React, { useContext, useEffect, useState } from "react";
import profilePic from "../photos/Windows_10_Default_Profile_Picture.svg.png";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Account = () => {
  const [newsPreference, setNewsPreference] = useState("Crypto");
  const [currency, setCurrency] = useState("$");
  const [name, setName] = useState("");
  const [exchange, setExchange] = useState("");
  const [photo, setPhoto] = useState("");
  const { user, loggedIn } = useContext(UserContext);
  const navigate = useNavigate();

  const uploadImg = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("photo", file);
    if (!data) return;
    else {
      await axios
        .post("/account/upload", data, {
          headers: { "Content-type": "multipart/form-data" },
          withCredentials: true,
        })
        .then((response) => {
          const { data: filenames } = response;
          setPhoto(filenames);
        });
    }
  };

  const profileHandler = async () => {
    try {
      await axios.post(
        "/account/profile",
        {
          newsPreference,
          currency,
          name,
          exchange,
          photo,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/account/profile", {
        withCredentials: true,
      });
      if (!data) return;
      setName(data.name);
      setCurrency(data.currency);
      setNewsPreference(data.newsPreference);
      setPhoto(data.photo);
      setExchange(data.exchange);
    };
    fetchData();
  }, [user]);

  if (loggedIn && !user) {
    navigate("/login");
  }

  return (
    <div className="py-40 2xl:px-96 xl:px-60">
      <div className="flex flex-col gap-4 justify-center items-center">
        <form className="flex flex-col gap-7 w-2/3" onSubmit={profileHandler}>
          <div className="flex gap-4">
            <label className="border bg-transparent rounded-2xl px-6 py-3 text-xl flex items-center justify-center gap-4 cursor-pointer text-main-gray w-full">
              <img
                alt="userPhoto"
                src={`${
                  photo
                    ? `${process.env.REACT_APP_API_URL}/uploads/${photo}`
                    : profilePic
                }`}
                className="w-14 h-14 rounded-full shadow-md"
              />
              <span className="font-semibold ">Upload</span>
              <FaCloudUploadAlt />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={uploadImg}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4">
            <input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md shadow-md pl-3 py-2 focus:outline-none focus:border-main-gray"
            />
            <input
              placeholder="Starting Balance"
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="border rounded-md shadow-md pl-3 py-2 focus:outline-none focus:border-main-gray"
            />
            <div>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-main-text focus:border-main-text sm:text-sm rounded-md shadow-md text-secondary-text"
                onChange={(e) => setNewsPreference(e.target.value)}
              >
                <option className="" value={"Crypto"}>
                  Crypto
                </option>
                <option value={"Stock"}>Stock</option>
                <option value={"Bist"}>Bist</option>
              </select>
            </div>
            <div className="">
              <select
                label="Your Currency"
                className="decorated mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-main-text focus:border-main-text sm:text-sm rounded-md shadow-md text-secondary-text"
              >
                <option className="" value={"$"}>
                  $
                </option>
                <option value={"€"}>€</option>
                <option value={"₺"}>₺</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <button className="px-4 py-2 bg-second-gray text-white rounded-md shadow-md hover:scale-105 transition duration-100 ease-in hover:bg-focus-blue">
                Reset
              </button>
              <Link
                to="/investments"
                className="bg-orange-400 px-4 py-2 text-main-gray rounded-md shadow-md hover:scale-105 transition duration-100 ease-in hover:bg-focus-blue hover:text-white"
              >
                Save
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;
