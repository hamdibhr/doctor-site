const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const app = express();

app.use(cors());
app.use(bodyParser.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "123456",
    database: "framework",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit();
    }
    console.log("Connected to MySQL!");
});

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        db.query(query, [name, email, hashedPassword], (err, result) => {
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
    } catch (err) {
        res.status(500).json({ message: "Error hashing password!" });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error logging in!" });
        }

        if (results.length > 0) {
            const user = results[0];

            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).json({ message: "Login successful!", user });
            } else {
                res.status(401).json({ message: "Invalid email or password!" });
            }
        } else {
            res.status(401).json({ message: "Invalid email or password!" });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
