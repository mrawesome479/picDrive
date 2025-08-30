import React, { useContext, useState } from "react";
import appLogo from "../assets/imageStorageLogo.png";
import { Search } from "lucide-react";
import AuthContext from "../context/AuthContext";
import profileIcon from "../assets/profileIcon.png";
import logoutIcon from "../assets/logoutIcon.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { useSearch } from "../context/SearchContext";
import { useCallback } from "react";

const Header = () => {
  const { setQuery } = useSearch();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("logout successfull");
  };

  //debounce of 500ms
  const handleSearch = useCallback(
    debounce((value) => {
      const trimmed = value.trim().replace(/\s+/g, " ");
      setQuery(trimmed);
    }, 500),
    []
  );

  return (
    <>
      <div className="flex items-center justify-between w-full h-20 bg-[#F5F5F5] px-6 border-b-1 border-gray-300">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img className="h-14 w-14" src={appLogo} alt="App Logo" />
          <p className="text-2xl font-bold text-gray-800">Image Manager</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6 w-1/2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute h-5 w-5 left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
              type="text"
              placeholder="Search images..."
              className="pl-12 pr-4 py-2 w-full border placeholder:text-gray-400 border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              className="h-4 w-4 rounded-full"
              src={profileIcon}
              alt={user.username}
            />
            <p className="text-sm font-bold text-gray-700">{user.username}</p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center gap-2 hover:scale-105 bg-blue-300 text-blue-900 font-medium px-4 py-2 rounded-md shadow-sm transition-transform duration-200"
          >
            <img className="h-5 w-5" src={logoutIcon} alt="Logout" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
