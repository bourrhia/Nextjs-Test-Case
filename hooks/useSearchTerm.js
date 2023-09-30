// hooks/useSearchTerm.js
import { useState, useEffect } from "react";

const useSearchTerm = () => {
  const [searchTerm, setSearchTerm] = useState("");


  // Use local storage to persist the search term
  useEffect(() => {
    const storedSearchTerm = localStorage.getItem("searchTerm");
    if (storedSearchTerm) {
      setSearchTerm(storedSearchTerm);
    }
  }, []);

  // Update local storage whenever the search term changes
  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
  }, [searchTerm]);

  return [searchTerm, setSearchTerm];
};

export default useSearchTerm;
