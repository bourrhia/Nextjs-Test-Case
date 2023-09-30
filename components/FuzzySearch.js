import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

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

  const StyledSearchIcon = styled("div")({
    "@keyframes animate-search-icon": {
      "0%": {
        opacity: 0,
      },

      "50%": {
        opacity: ".1",
      },

      "75%": {
        opacity: ".5",
      },

      "100%": {
        opacity: 1,
      },
    },
    position: "absolute",
    left: "12px",
    width: "24px",
    height: "24px",
    top: "7px",

    fill: "#767676",
    verticalAlign: "middle",
    animationName: "animate-search-icon",
    animationDuration: ".15s",
  });

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
