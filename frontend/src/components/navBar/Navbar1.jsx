import React from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/logo.png";

const Navbar1 = () => {
  return (
    <nav className="bg-[#E6F6FE] border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link
          to="/login"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Tbibek
          </span>
        </Link>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar1;
