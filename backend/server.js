const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Replace with your DB username
    password: "123456", // Replace with your DB password
    database: "framework", // Replace with your database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit();
    }
    console.log("Connected to MySQL!");
});

// Signup Endpoint
app.post("/signup", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, password], (err, result) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.status(400).json({ message: "Email already exists!" });
            } else {
                res.status(500).json({ message: "Error signing up!" });
            }
        } else {
            res.status(201).json({ message: "Signup successful!" });
        }
    });
});

// Login Endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(query, [email, password], (err, results) => {
        if (err) {
            res.status(500).json({ message: "Error logging in!" });
        } else if (results.length > 0) {
            res.status(200).json({ message: "Login successful!", user: results[0] });
        } else {
            res.status(401).json({ message: "Invalid email or password!" });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
