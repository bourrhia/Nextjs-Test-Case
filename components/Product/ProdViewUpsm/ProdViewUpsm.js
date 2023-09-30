import React from "react";
import Box from "@mui/material/Box";

export const ProdViewUpsm = ({ selectedprd }) => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        minWidth: "1000px",
        maxWidth: "1500px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          marginTop: "20px",
          paddingTop: 0,
          minWidth: "996px",
          padding: "14px 18px 18px",
          margin: "0 auto",
        }}
      >
        <Box>Test for {selectedprd}</Box>
      </Box>
    </Box>
  );
};

export default ProdViewUpsm;
