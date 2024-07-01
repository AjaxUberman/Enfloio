const mongoose = require("mongoose");

const MainSchema = new mongoose.Schema({
  id: String,
  currentTotal: String,
  startingTotal: String,
  cryptoTotal: String,
  bistTotal: String,
  monthlyData: Object,
});

const mainModel = mongoose.model("Main", MainSchema);

module.exports = mainModel;
