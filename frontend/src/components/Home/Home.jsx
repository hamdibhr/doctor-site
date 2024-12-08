import React from "react";
import { HiOutlinePhoneOutgoing } from "react-icons/hi";
import home from "./../../assets/home.png";
import "./Home.css"; // Import the CSS file

function Home() {
  return (
    <div className="container">
      {/* Left section */}
      <div className="left-side">
        <h1>Get ready for your best ever Dental Experience!</h1>
        <p>
          We use only the best quality materials on the market in order to
          provide the best products to our patients, So don’t worry about
          anything and book yourself.
        </p>
        <button>Book an appointment</button>
        <div className="contact-info">
          <HiOutlinePhoneOutgoing />
          <p>Call us now to book an appointment</p>
          <p>+216 52107357</p>
        </div>
      </div>

      {/* Right section (image) */}
      <div className="right-side">
        <img src={home} alt="Dental Experience" />
      </div>
    </div>
  );
}

export default Home;
