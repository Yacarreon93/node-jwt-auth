const API_URL = "http://localhost:5000";
const AUTH_URL = "http://localhost:8888";

let ACCESS_TOKEN = null;

const headlineBtn = document.querySelector("#headline");
const secretBtn = document.querySelector("#secret");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");

headlineBtn.addEventListener("click", () => {
    fetch(`${API_URL}/resources`).then((res) => {
        return res.text();
    }).then((data) => {
        UIUpdate.alertBox(data);
    });
});

secretBtn.addEventListener("click", (event) => {
    let headers = {};
    if (ACCESS_TOKEN) {
        headers = {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
        };
    }
    fetch(`${API_URL}/resources/secret`, { headers} ).then((res) => {
        UIUpdate.updateCat(res.status);
        return res.text();
    }).then((data) => {
        UIUpdate.alertBox(data);
    });
});

logoutBtn.addEventListener("click", (event) => {
    ACCESS_TOKEN = null;
    UIUpdate.loggedOut();
});

loginBtn.addEventListener("click", (event) => {
    fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
            "accept": "application/json",
        },
        body: JSON.stringify(UIUpdate.getUsernamePassword())
    }).then((res) => {
        UIUpdate.updateCat(res.status);
        if (res.status === 200) {
            return res.json();
        } else {
            return res.json();
        }
    }).then((data) => {
        if (data.access_token) {
            ACCESS_TOKEN = data.access_token;
            data = `Access Token: ${ACCESS_TOKEN}`;
            UIUpdate.loggedIn();
        }
        UIUpdate.alertBox(data);
    });
});