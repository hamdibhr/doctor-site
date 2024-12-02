import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        // Validation: All fields must be filled
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("All fields are required!");
            return; // Do not proceed if any field is empty
        }

        // Email Format Validation (Regex to check if the email is valid)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return; // Do not proceed if email format is invalid
        }

        // Password Validation: Minimum 8 characters and starts with a capital letter
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return; // Do not proceed if password is less than 8 characters
        }
        if (password[0] !== password[0].toUpperCase()) {
            alert("Password must start with a capital letter.");
            return; // Do not proceed if the password does not start with a capital letter
        }

        // If all validations are passed, proceed to send data to the server
        try {
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                setMessage(data.message);
                alert(data.message); // Show success message
                setName(""); // Clear fields after successful signup
                setEmail("");
                setPassword("");
            } else {
                // Error handling
                alert(data.message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleSignup}>Signup</button>
            <p>{message}</p>

            {/* Link to Login Page */}
            <p>
                Already have an account?{" "}
                <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

export default Signup;
