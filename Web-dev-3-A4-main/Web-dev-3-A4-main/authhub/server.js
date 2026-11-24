

const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// File location for storing users
const usersFile = path.join(__dirname, "data", "users.json");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: "authhub-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Read users from JSON file
function getUsers() {
    const data = fs.readFileSync(usersFile, "utf8");
    return JSON.parse(data);
}

// Save users to JSON file
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Registration API
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match."
            });
        }

        const users = getUsers();

        const existingUser = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({
            message: "Registration successful! You can now log in."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong."
        });
    }
});

// Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password."
            });
        }

        const users = getUsers();

        const user = users.find(
            user => user.email === email.toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        req.session.userId = user.id;

        res.json({
            message: `Welcome back, ${user.name}!`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`AuthHub running at http://localhost:${PORT}`);
});
