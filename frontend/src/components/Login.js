import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        // Validation
        if (!email.trim() || !password.trim()) {
            alert("All fields are required!");
            return;
        }

        // Email Format Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Password Validation: Minimum 8 characters and starts with a capital letter
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }
        if (password[0] !== password[0].toUpperCase()) {
            alert("Password must start with a capital letter.");
            return;
        }

        // Proceed with login if fields are valid
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                navigate("/home"); // Redirect to Home page on success
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
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
            <button onClick={handleLogin}>Login</button>
            <p>{message}</p>

            {/* Link to Signup Page */}
            <p>
                Don't have an account?{" "}
                <Link to="/signup">Sign up here</Link>
            </p>
        </div>
    );
}

export default Login;
