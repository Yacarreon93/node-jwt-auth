const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

router.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) res.status(401).send("Password or email wrong");
    const result = await bcrypt.compare(password, user.password);
    if (!result) res.status(401).send("Password or email wrong");
    res.status(200).json({ token: generateToken(user) });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

const schema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (user) return res.status(400).send("Email is already taken");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await new User({ email, password: hash }).save();
    res.status(200).json({ token: generateToken(newUser) });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

function generateToken(user) {
  return jwt.sign({ data: user }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = router;
