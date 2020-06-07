const express = require("express");
const User = require("../../models/users");

const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireFullName,
  requirePhone,
  requireEmailSignin,
  requirePasswordSignin,
  requireNewEmail,
} = require("./validators");
const {
  handleErrors,
  authenticateToken,
  cryptPassword,
} = require("./middlewares");

const router = express.Router();

router.post("/checkEmail", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const userEmail = { email: req.body.email };
  const accessToken = jwt.sign(userEmail, process.env.ACCESS_TOKEN_SECRET);

  if (!user) return res.status(200).json("OK");
  if (user)
    return res.status(401).json({ accessToken: accessToken, id: user._id });
});

router.post(
  "/signup",
  [requireEmail, requirePassword, requirePasswordConfirmation, requireFullName],
  handleErrors(),
  async (req, res) => {
    const {
      email,
      password,
      fullname,
      gender,
      phone,
      birthday,
      image,
    } = req.body;
    const passCrypt = await cryptPassword(password);
    const user = await new User({
      email,
      password: passCrypt,
      fullname,
      gender,
      phone,
      birthday,
      image,
    });
    try {
      user.save();
      const userEmail = { email: email };
      const accessToken = jwt.sign(userEmail, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken, id: user._id });
    } catch (error) {
      res.json(error);
    }
  }
);

router.post(
  "/signin",
  [requireEmailSignin, requirePasswordSignin],
  handleErrors(),
  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const userEmail = { email: email };
    const accessToken = jwt.sign(userEmail, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken: accessToken, id: user._id });
  }
);

router.post("/profile", async (req, res) => {
  const user = await User.findById(req.body.id);
  res.json(user);
});

router.post(
  "/update",
  [requireNewEmail, requireFullName, requirePhone],
  handleErrors(),
  async (req, res) => {
    const { id, newEmail, fullname, gender, phone, birthday, image } = req.body;
    try {
      await User.findByIdAndUpdate(
        id,
        {
          email: newEmail,
          fullname: fullname,
          gender: gender,
          phone: phone,
          birthday: birthday,
          image: image,
        },
        { new: true },
        (err, user) => {
          if (err) return res.status(401).json(err);
          if (!err) return res.status(200).json(user);
        }
      );
    } catch (error) {
      return res.status(400).json(error);
    }
  }
);

router.post("/addToCart", async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.body.id },
      {
        cart: req.body.cart,
      },
      { new: true },
      (err, user) => {
        if (err) return res.status(401).json(err);
        if (!err) return res.status(200).json(user);
      }
    );
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/fetchCart", async (req, res) => {
  const user = await User.findById(req.body.id);
  const cart = user.cart;
  res.json(cart);
});

module.exports = router;
