const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");

const validateJWT = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return res.sendStatus(401);
    const token = authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.TOKEN_SECRET);
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (err) {
    res.sendStatus(401);
  }
};

const dbURI = "mongodb://localhost/authentication";
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", validateJWT, usersRoute);

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on("error", (err) => {
  console.error(err);
});
db.once("open", () => {
  console.log("DB started successfully");
});

app.listen(8080, () => {
  console.log("Server started: 8080");
});
