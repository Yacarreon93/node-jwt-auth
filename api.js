const express  = require("express");
const cors = require("cors");
const expressjwt = require("express-jwt");
const path = require("path");

const app = express();
const PORT = process.env.API_PORT || 8888;

const users = [
    { id: 1, username: "admin", password: "admin" },
    { id: 2, username: "guest", password: "guest" },
];

const jwtCheck = expressjwt({
    secret: 'GlENyogN9wMLFlYLMPGgQl4ptxL0gWio',
    audience: 'eggehead-demo',
    issuer: "https://yassercarreon.auth0.com/"
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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use("/public", express.static(__dirname + "/public"));

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});