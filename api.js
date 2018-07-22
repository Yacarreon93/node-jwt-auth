const express  = require("express");
const cors = require("cors");
const expressjwt = require("express-jwt");

const app = express();
const PORT = process.env.API_PORT || 8888;

const users = [
    { id: 1, username: "admin", password: "admin" },
    { id: 2, username: "guest", password: "guest" },
];

const jwtCheck = expressjwt({
    secret: "mysupersecretkey",
});

app.use(cors());

app.get("/status", (req, res) => {
    const localTime = (new Date()).toLocaleDateString();
    res
        .status(200)
        .send(`Server time is ${localTime}.`);
});

app.get("/resources", (req, res) => {
    res
        .status(200)
        .send("Public resources, you can see this");
});

app.get("/resources/secret", jwtCheck, (req, res) => {
    res
        .status(200)
        .send("Secret resources, you should be logged in to see this");
});

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});