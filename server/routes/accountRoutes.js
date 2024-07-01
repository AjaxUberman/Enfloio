const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const controller = require("../controllers/accountController");

router.post("/register", controller.registerController);
router.post("/login", controller.loginController);
router.get("/", controller.accountController);
router.post("/logout", controller.cookieDeleter);
router.post("/profile", controller.profileController);
router.get("/profile", controller.profileInfo);
router.post("/upload", upload.single("photo"), controller.imgController);
router.post("/graph", controller.monthlyData);

module.exports = router;
