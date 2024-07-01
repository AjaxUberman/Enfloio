const express = require("express");
const router = express.Router();
const {
  coinListGetter,
  investmentSaver,
  investmentGetter,
  coinGetter,
  mainDataPost,
  mainDataGet,
} = require("../controllers/investController");

router.get("/coinlist", coinListGetter);
router.post("/:id", investmentSaver);
router.get("/:id", investmentGetter);
router.get("/coin/:id", coinGetter);
router.post("/", mainDataPost);
router.get("/", mainDataGet);
module.exports = router;
