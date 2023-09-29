//import React from "react";
import React, { useState, useEffect } from "react";
import Header from "./Header.js";
import Navbar from "./Navbar.js";
import Box from "@mui/material/Box";

//
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

export const Layout = (props) => {
  ////////////////////////////////
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);
  //}, [router]);

  ///////////////////////////
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",

        [theme.breakpoints.up("sm")]: {
          minWidth: "600px",
          margin: 0,
        },

        overflow: "-moz-scrollbars-non",

        margin: 0 /* remove default margin */,
        scrollbarWidth: "none" /* Also needed to disable scrollbar Firefox */,
        msOverflowStyle: "none" /* Disable scrollbar IE 10+ */,
        overflowY: "scroll",

        "&::-webkit-scrollbar": {
          width: "0px",
          background:
            "transparent" /* Disable scrollbar Chrome/Safari/Webkit */,
          display: "none",
        },
      })}
    >
      <Header />

      <Box
        component="main"
        role="main"
        tabIndex="-1"
        sx={{
          outline: 0,
          //
          maxWidth: "1312px",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              //  textAlign: "center!important",
              //
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor:
              //  "rgba(255, 255, 255, 0.8); /* Add a semi-transparent background to dim the page behind the spinner",
              //zIndex: "9999",
              zIndex: "9999999",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
        <Navbar />
        {props.children}
      </Box>
    </Box>
  );
};
export default Layout;
