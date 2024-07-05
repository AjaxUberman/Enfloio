const User = require("../models/User");
const Main = require("../models/MainDatas");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const fs = require("fs");
const multer = require("multer");
const path = require("path");

app.use(express.json());

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

const registerController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ message: "Already registered with this email." });
    }
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(202).json(error);
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (error, token) => {
            if (error) {
              throw error;
            } else {
              res
                .cookie("token", token, {
                  httpOnly: true,
                  secure: true,
                  sameSite: false,
                })
                .json(userDoc);
            }
          }
        );
      } else {
        res.status(401).json({ error: "Invalid password" });
      }
    }
  } catch (error) {
    res.status(200).json(error);
  }
};

const accountController = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json(null);
  }

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { email, id } = await User.findById(userData.id);
    res.json({ email, id });
  });
};

const cookieDeleter = async (req, res) => {
  res.clearCookie("token").json(true);
};

const profileController = async (req, res) => {
  const { token } = req.cookies;
  const { newsPreference, currency, name, exchange, photo } = req.body;
  if (!token) {
    return res.json(null);
  }
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const response = await User.findByIdAndUpdate(
      userData.id,
      {
        newsPreference,
        currency,
        name,
        exchange,
        photo,
      },
      { new: true }
    );
    res.json(response);
  });
};

const profileInfo = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json(null);
  }
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const response = await User.findById(userData.id);
    res.json(response);
  });
};

const imgController = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const ext = path.extname(originalname);
  const newPath = tempPath + ext;
  fs.renameSync(tempPath, newPath);
  const relativePath = path.relative("uploads", newPath);
  res.json(relativePath);
};

const monthlyData = async (req, res) => {
  const data = req.body;
  const findMonth = await Main.findOneAndUpdate(
    { id: req.body.id },
    {
      monthlyData: data.monthlyData,
    },
    { new: true }
  );
  res.json(findMonth);
};

module.exports = {
  registerController,
  loginController,
  accountController,
  cookieDeleter,
  profileController,
  profileInfo,
  imgController,
  monthlyData,
};
