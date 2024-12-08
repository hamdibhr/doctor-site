import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import first from "/src/assets/first2.jpg";
import { GoogleLogin } from "@react-oauth/google";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("name or email or password not correct");
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

    if (password[0] !== password[0].toUpperCase()) {
      alert("Password must start with a capital letter.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        alert(data.message);
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login"); // Redirect to login after successful signup
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-4 bg-cover bg-center hidden md:flex items-center">
        <img
          src={first}
          alt="SignUp illustration"
          className="w-[90%] h-[85%] object-cover"
          style={{ marginLeft: "20%" }}
        />
      </div>
      <div className="col-span-12 md:col-span-8 flex items-center justify-center">
        <form
          onSubmit={handleSignup}
          className="w-3/4 max-w-md space-y-6 relative right-10 sm:left-[-10px] md:left-0"
        >
          <h1 className="text-[#011632] text-[42px] font-semibold font-['General Sans'] capitalize leading-[52.50px]">
            Create an account
          </h1>
          <p className="text-[#3c4959] text-base font-normal font-['General Sans'] leading-normal tracking-tight">
            Discover a better way to book your appointments.
          </p>

          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleLogin} // Handle Google login success
            onError={() => setMessage("Google login failed!")}
            useOneTap
          />

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-[400px] h-[60px] bg-white rounded-[10px] border border-[#afafaf] px-4 focus:ring focus:ring-blue-300 focus:border-blue-500"
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
            Signup
          </button>
          <p className="text-center text-[#011632] text-sm font-normal font-['General Sans'] leading-snug tracking-tight">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#011632] text-sm font-medium font-['IBM Plex Sans KR'] leading-snug tracking-tight"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
