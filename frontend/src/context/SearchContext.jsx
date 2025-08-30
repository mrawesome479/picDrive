// context/SearchContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!user) return;
    if (!query) return setResults([]);

    const fetchResults = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(
          `${backendUrl}/api/images/search?query=${query}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        if(res.status === 200) {
            setResults(res.data);
        }
      } catch (error) {
        if (error.response && error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Somthing went wronggg");
        }
      }
    };

    fetchResults();
  }, [query]);

  return (
    <SearchContext.Provider value={{ query, setQuery, results, setResults }}>
      {children}
    </SearchContext.Provider>
  );
};
