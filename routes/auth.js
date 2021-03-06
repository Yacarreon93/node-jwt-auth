const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const rounds = 10;
const tokenSecret = "supersecret";

router.get("/login", (req, res) => {
  res.send("okidoki");
});

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, rounds, (error, hash) => {
    if (error) {
      res.status(500).json(error);
    } else {
      const newUser = User({ email: req.body.email, password: hash });
      newUser
        .save()
        .then((user) => {
          res.status(200).json({ token: generateToken(user) });
        })
        .catch((error) => {
          res.status(500).json(error);
        });
    }
  });
});

function generateToken(user) {
  return jwt.sign({ data: user }, tokenSecret, { expiresIn: "1h" });
}

module.exports = router;
