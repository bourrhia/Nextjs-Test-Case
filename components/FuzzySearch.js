import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { useRouter } from "next/router";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const FuzzySearch = ({ data, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    const options = {
      keys: ["title", "author"], // Replace with the keys you want to search on
      includeScore: true,
    };

    const fuseInstance = new Fuse(data, options);
    setFuse(fuseInstance);
  }, [data]);

  const handleSearch = () => {
    if (!fuse) return;

    const results = fuse.search(searchTerm);
    onSearchResults(results);
  };

  return (
    <Box
      sx={{
        border: "2px solid #41413f",
        // borderRight: "1px solid #c7c7c7",
        borderRadius: 0,
        paddingRight: "5px",
        boxSizing: "border-box",
        height: "42px",
        background: "#fff",
        padding: "0 10px 0 1px",
        transition: "border-color .1s linear",
      }}
    >
      <Box
        sx={{
          position: "relative",
          whiteSpace: "normal",
        }}
      >
        <Box
          component="input"
          type="text"
          aria-autocomplete="list"
          aria-expanded="false"
          size="50"
          maxLength="300"
          aria-label="Rechercher sur Dimapromo"
          placeholder="Rechercher sur Dimapromo"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          autoComplete="off"
          //
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          {...register("searchInput")}
          sx={{
            webkitTransition: "none",
            transition: "none",
            padding: "9px 0 9px 40px",
            boxSizing: "border-box",
            webkitTransition: "padding .1s",
            transition: "padding .1s",
            lineHeight: "20px",
            fontSize: "16px",
            border: 0,
            margin: 0,
            width: "100%",
            background: "transparent",
            outline: 0,
            boxShadow: "none",
            webkitBorderRadius: "3px",
            mozBorderRadius: "3px",
            borderRadius: "3px",
          }}
        ></Box>
        <StyledSearchIcon>
          <SearchIcon
            sx={{
              fill: "#767676",
              pointerEvents: "none",
              //stroke: "currentColor",
              strokeWidth: 0,
              verticalAlign: "middle",
            }}
            aria-hidden="true"
            focusable="false"
          ></SearchIcon>
        </StyledSearchIcon>
      </Box>
    </Box>
  );
};

export default FuzzySearch;
