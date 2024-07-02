const express = require("express");
const router = express.Router();
const {
  coinListGetter,
  investmentSaver,
  investmentGetter,
  coinGetter,
  mainDataPost,
  mainDataGet,
  bistListGetter,
  investmentDeleter,
} = require("../controllers/investController");

router.get("/coinlist", coinListGetter);
router.get("/bist", bistListGetter);
router.post("/:id", investmentSaver);
router.post("/delete/:id", investmentDeleter);
router.get("/:id", investmentGetter);
router.get("/coin/:id", coinGetter);
router.post("/", mainDataPost);
router.get("/", mainDataGet);
module.exports = router;
