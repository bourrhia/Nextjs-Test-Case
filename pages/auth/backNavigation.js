import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

export const EmailUsed = () => {
  const router = useRouter();
  //const { errorMsg, email } = router.query;

  const [isNavHome, setIsNavHome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleBeforePopState = ({ url, as }) => {
      // Prevent the default behavior of the back button
      // This effectively keeps the user on the current page
      router.events.emit("routeChangeError", url);
      return false;
    };

    // Add the custom beforePopState event handler
    router.beforePopState(handleBeforePopState);

    //window.history.replaceState({}, document.title, window.location.pathname);

    // Clean up the event handler when the component unmounts
    return () => {
      // Reset beforePopState to null for cleanup
      router.beforePopState(null);
    };
  }, [router]);

  const handleNavHome = async () => {
    setIsNavHome(true);

    try {
      await router.push({
        pathname: "/",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavHome(false);
    }
  };

  return (
    <Box>
      {(isLoading || isNavHome) && (
        <Box
          sx={{
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
            zIndex: "9999",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
      <Box
        sx={{
          display: "block",
          color: "#0F1111",
          fontSize: "14px",
          lineHeight: "20px",
        }}
      >
        <Box
          sx={{
            minWidth: "1038px",
            maxWidth: "1038px",
            margin: "0 auto",
            color: "#0F1111",
            fontSize: "1.4rem",
            lineHeight: "2rem",
          }}
        >
          <Box
            sx={{
              minWidth: "768px",
              maxWidth: "768px",
              padding: "2rem 2.4rem 4rem",
              margin: "0 auto",
              color: "#0F1111",
              fontSize: "1.4rem",
              lineHeight: "2rem",
            }}
          >
            <Box
              sx={{
                "&:last-child": {
                  marginBottom: 0,
                },
                padding: "1.1rem 1.6rem!important",
                color: "#0F1111",
                fontSize: "1.4rem",
                lineHeight: "2rem",
                WebkitTextSizeAdjust: "none",
              }}
            >
              <Box
                component="h1"
                sx={{
                  //fontWeight: 400,
                  //fontSize: "2.8rem",
                  // lineHeight: "3.6rem",
                  fontWeight: "bold",
                  fontSize: "28px",
                  lineHeight: 1.2,
                  paddingBottom: "0.4rem",
                  textRendering: "optimizeLegibility",
                  color: "#0F1111",
                }}
              >
                Vous recherchez quelque chose ?
              </Box>
              <Box
                component="p"
                sx={{
                  padding: 0,
                  margin: "0 0 1.6rem 0",
                  color: "#0F1111",
                  //  fontSize: "1.4rem",
                  //  lineHeight: "2rem",
                  fontSize: "14px",
                  lineHeight: "19px",
                  //
                  fontWeight: 400,
                }}
              >
                Nous sommes désolés. Ladresse Web que vous avez saisie nest pas
                une page fonctionnelle de notre site.
              </Box>
              <Box
                component="span"
                sx={{
                  borderRadius: "0.8rem",
                  boxShadow: "0 0.2rem 0.5rem 0 rgba(213,217,217,.5)",
                  background: "#FFD814",
                  borderColor: "#FCD200",
                  borderStyle: "solid",
                  borderWidth: "0.1rem",
                  cursor: "pointer",
                  display: "inline-block",
                  padding: 0,
                  textAlign: "center",
                  textDecoration: "none!important",
                  verticalAlign: "middle",
                  WebkitTapHighlightColor: "transparent",
                  color: "#0F1111",
                  //fontSize: "1.4rem",
                  //lineHeight: "2rem",
                  //
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    borderRadius: "0.7rem",
                    background: "0 0",
                    boxShadow: "none",
                    display: "block",
                    position: "relative",
                    overflow: "hidden",
                    //height: "100%",
                    height: "29px",
                    cursor: "pointer",
                    textAlign: "center",
                    WebkitTapHighlightColor: "transparent",
                    color: "#0F1111",
                    // fontSize: "1.4rem",
                    //lineHeight: "2rem",
                    //
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  <Box
                    //component="a"
                    component="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavHome();
                    }}
                    disabled={isNavHome || isLoading}
                    sx={{
                      color: "#0F1111",
                      textDecoration: "none!important",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "transparent",
                      border: 0,
                      display: "block",
                      fontSize: "13px",
                      lineHeight: "29px",
                      // fontSize: "1rem",
                      fontWeight: "bold",
                      margin: 0,
                      outline: 0,
                      //padding: "1.2rem 1.6rem 1.2rem 1.7rem",
                      padding: "0 10px 0 11px",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      cursor: "pointer",

                      ":-webkit-any-link": {
                        cursor: "pointer",
                      },
                      //
                      backgroundColor: "transparent",
                      border: "none",
                      outline: 0,
                    }}
                  >
                    Continue
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailUsed;
