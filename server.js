const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("."));

// ---------- READ USERS ----------
function getUsers() {
    try {
        return JSON.parse(fs.readFileSync("users.json"));
    } catch {
        return [];
    }
}

// ---------- SAVE USERS ----------
function saveUsers(users) {
    fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
}

// ---------- REGISTER ----------
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    let users = getUsers();

    if (!username || !password) {
        return res.json({ msg: "Enter all fields" });
    }

    if (password.length < 6) {
        return res.json({ msg: "Password must be at least 6 characters" });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return res.json({ msg: "Password must contain capital & number" });
    }

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.json({ msg: "Username already exists" });
    }

    users.push({ username, password });
    saveUsers(users);

    res.json({ msg: "Registered Successfully" });
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    let users = getUsers();

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false });
    }
});

// ---------- CART ----------
let carts = {};

// ADD TO CART
app.post("/add-to-cart", (req, res) => {
    const { username, product } = req.body;

    if (!carts[username]) carts[username] = [];

    carts[username].push(product);

    res.json({ msg: "Added" });
});

// GET CART
app.post("/get-cart", (req, res) => {
    const { username } = req.body;

    res.json({ cart: carts[username] || [] });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});