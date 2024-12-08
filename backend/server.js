const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET_KEY || "fallback-secret-key", // Secret for session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // For testing locally, set to `true` if using HTTPS in production
  })
);

// MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/framework";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  photoUrl: String, // For storing profile photo URL
});

const User = mongoose.model("User", userSchema);

// Passport Configuration
passport.serializeUser((user, done) => {
  done(null, user.id); // Save user ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Retrieve user data using ID
  } catch (err) {
    done(err);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user); // User found, return it
        }

        // If user does not exist, create a new user
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          photoUrl: profile.photos[0].value, // Store the Google profile photo URL
        });

        await user.save();
        done(null, user); // Return new user
      } catch (err) {
        done(err);
      }
    }
  )
);

// Routes

// Signup route (with password hashing)
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Missing name, email, or password." });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Email already exists!" });
    } else {
      res.status(500).json({ message: "Error signing up!" });
    }
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" }); // Bad request, user doesn't exist
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid password" }); // Unauthorized, incorrect password
  }

  // User authenticated, proceed with response
  res.status(200).json({ message: "Login successful", user });
});

// Google Authentication Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/home");
  }
);

// Authentication status check
app.get("/auth/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Handle logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Home route
app.get("/home", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Welcome, ${req.user.name}</h1>`);
  } else {
    res.redirect("/login");
  }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
