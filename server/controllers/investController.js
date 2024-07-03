const coinList = require("../json/coinnames.json");
const bistList = require("../json/bistnames.json");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const Investment = require("../models/NewInvestment");
const axios = require("axios");
const pLimit = require("p-limit");
const NodeCache = require("node-cache");
const Main = require("../models/MainDatas");
const cache = new NodeCache({ stdTTL: 300 });

const coinListGetter = (req, res) => {
  res.json(coinList);
};

const bistListGetter = (req, res) => {
  res.json(bistList);
};

const investmentSaver = (req, res) => {
  const { token } = req.cookies;

  const userid = req.params.id;
  const data = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    if (userData.id === userid) {
      data.userId = userid;
      const newInvestment = await Investment.create(data);
      await newInvestment.save();
      res.json(newInvestment);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
};

const investmentDeleter = async (req, res) => {
  const { deleteID } = req.body;
  try {
    const response = await Investment.findByIdAndDelete(deleteID);
    res.json(response);
  } catch (error) {
    console.error(error);
  }
};

const investmentGetter = (req, res) => {
  const { token } = req.cookies;
  const userid = req.params.id;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    if (userData.id === userid) {
      const datas = await Investment.find({ userId: userid });
      res.json(datas);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
};

const coinGetter = (req, res) => {
  const coinId = req.params.id;

  const fetchDataAndUpdate = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        {
          params: {
            _limit: 4,
          },
        }
      );
      console.log(response.data);
      const currentPrice = response.data.market_data.current_price.usd;
      const updatedInvestment = await Investment.findOneAndUpdate(
        { assetID: coinId },
        { currentPrice: currentPrice },
        { new: true }
      );
      cache.set(coinId, currentPrice);
    } catch (error) {
      console.error(`Error fetching data for coin ${coinId}:`, error);
    }
  };
  fetchDataAndUpdate();
  const interval = setInterval(fetchDataAndUpdate, 15 * 60 * 1000);
};

const mainDataPost = (req, res) => {
  const { token } = req.cookies;
  const { currentTotal, startingTotal, bistTotal, cryptoTotal, monhlyData } =
    req.body;
  if (currentTotal) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const existingData = await Main.findOne({ id: userData.id });
        if (existingData) {
          existingData.currentTotal = currentTotal;
          existingData.startingTotal = startingTotal;
          existingData.bistTotal = bistTotal;
          existingData.cryptoTotal = cryptoTotal;
          await existingData.save();
          res.json(existingData);
        } else {
          const newData = await Main.create({
            id: userData.id,
            currentTotal,
            startingTotal,
            bistTotal,
            cryptoTotal,
            monthlyData: [],
          });
          res.json(newData);
        }
      } catch (error) {
        console.error("Error updating Main data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
};
const mainDataGet = (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    res.json("Token not found");
  } else {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      if (userData) {
        try {
          const findedDatas = await Main.find({ id: userData.id });
          res.json(findedDatas);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
};

module.exports = {
  coinListGetter,
  bistListGetter,
  investmentSaver,
  investmentGetter,
  coinGetter,
  mainDataPost,
  mainDataGet,
  investmentDeleter,
};
