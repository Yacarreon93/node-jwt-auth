const express  = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
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

app.use(bodyParser.json());
app.use(cors());

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res
            .status(400)
            .send("You need a username and a password.");
        return;
    }
    const user = users.find((u) => {
        return u.username === username && u.password === password;
    });
    if (!user) {
        res
            .status(401)
            .send('User not found.');
        return;
    }
    const token = jwt.sign({
        sub: user.id,
        username: user.username,
    }, "mysupersecretkey", { expiresIn: "3 hours" });
    res
        .status(200)
        .send({ access_token: token });
});

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