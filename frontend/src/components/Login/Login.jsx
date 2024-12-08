import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import first from "/src/assets/first1.jpg";
import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("email or password not available");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        navigate("/home");
      } else {
        alert(data.message || "Login failed, please try again.");
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = async (response) => {
    console.log(response);
    if (!response || !response.credential) {
      console.error("Google login failed: No credential found");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/google/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        navigate("/home");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred with Google login. Please try again.");
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-4 bg-cover bg-center hidden md:flex items-center">
        <img
          src={first}
          alt="Login illustration"
          className="w-[90%] h-[85%] object-cover"
          style={{ marginLeft: "20%" }}
        />
      </div>

      <div className="col-span-12 md:col-span-8 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-3/4 max-w-md space-y-6 relative right-10 sm:left-[-10px] md:left-0"
        >
          <h1 className="text-[#011632] text-[42px] font-semibold font-['General Sans'] capitalize leading-[52.50px]">
            Welcome Back
          </h1>
          <p className="text-[#3c4959] text-base font-normal font-['General Sans'] leading-normal tracking-tight">
            Discover a better way to book your appointments.
          </p>

          <GoogleLogin
            onSuccess={handleGoogleLogin} // Handle Google login success
            onError={() => setMessage("Google login failed!")}
            useOneTap
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[400px] h-[60px] bg-white rounded-[10px] border border-[#afafaf] px-4 focus:ring focus:ring-blue-300 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[400px] h-[60px] bg-white rounded-[10px] border border-[#afafaf] px-4 focus:ring focus:ring-blue-300 focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-[400px] h-[60px] bg-[#1376F8] text-white rounded-[10px] flex items-center justify-center font-medium hover:bg-[#02234c] transition"
          >
            Login
          </button>
          <p className="text-center text-[#011632] text-sm font-normal font-['General Sans'] leading-snug tracking-tight">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#011632] text-sm font-medium font-['IBM Plex Sans KR'] leading-snug tracking-tight"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
