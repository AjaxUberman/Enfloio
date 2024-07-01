const mongoose = require("mongoose");

const NewInvestment = new mongoose.Schema({
  userId: String,
  assetType: String,
  asset: String,
  assetID: String,
  pieces: Number,
  purchasePrice: Number,
  currentPrice: Number,
  startDate: Date,
});

const InvestmentModel = mongoose.model("Investment", NewInvestment);
module.exports = InvestmentModel;
