const coinList = require("../json/coinnames.json");
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

const coinGetter = async (req, res) => {
  const limit = pLimit(14);
  const coinId = req.params.id;
  try {
    const response = await limit(() =>
      axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`)
    );
    const currentPrice = response.data.market_data.current_price.usd;
    const updatedInvestment = await Investment.findOneAndUpdate(
      { assetID: coinId },
      { currentPrice: currentPrice },
      { new: true }
    );
    cache.set(coinId, currentPrice);
    if (updatedInvestment) {
      res.json(currentPrice);
    } else {
      res.status(404).json({ error: "Investment not found" });
    }
  } catch (error) {
    console.error(`Error fetching data for coin`, error);
    return null;
  }
};

const mainDataPost = (req, res) => {
  const { token } = req.cookies;

  const { currentTotal, startingTotal, bistTotal, cryptoTotal } = req.body;
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
          existingData.monthlyData = monthlyData;
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
  investmentSaver,
  investmentGetter,
  coinGetter,
  mainDataPost,
  mainDataGet,
};
