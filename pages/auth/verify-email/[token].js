import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import { useEditVerifEmailMutation } from "../../../redux/features/api/apiSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";

export const VerifEmail = () => {
  const router = useRouter();
  const { token, email } = router.query;

  const [isLoading, setIsLoading] = useState(false);

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

  const handleNavVerifyEmailSuccess = async (email) => {
    try {
      await router.push({
        pathname: "/auth/verify-email-success",
        query: {
          email: email,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
    }
  };

  const handleNavHome = async () => {
    // setIsNavHome(true);

    try {
      await router.push({
        pathname: "/",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setIsNavHome(false);
    }
  };

  const [
    editVerifEmail,
    {
      isLoading: verifEmailIsLoading,
      isSuccess: verifEmailIsSuccess,
      error: verifEmailError,
      isError: verifEmailIsError,
    },
  ] = useEditVerifEmailMutation();

  useEffect(() => {
    const canVerifyEmail = [token, email].every(Boolean);
    if (canVerifyEmail) {
      const verifyEmail = async () => {
        try {
          const response = await editVerifEmail({
            emailToken: token,
          }).unwrap();

          if (
            verifEmailIsSuccess ||
            response?.message === "Success verification"
          ) {
            await handleNavVerifyEmailSuccess(email);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      };

      verifyEmail();
    }
    //}, []);
  }, [token]);
  // }, [router, token]);

  return (
    <Box>
      {isLoading && (
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
          margin: 0,
          height: "90vh",
          backgroundColor: "#fff",
          color: "#191919",
          fontSize: ".875rem",
          WebkitTextSizeAdjust: "100%",
        }}
      >
        <Box
          sx={{
            margin: "6px 32px 16px",
            color: "#191919",
            fontSize: ".875rem",
            WebkitTextSizeAdjust: "100%",
          }}
        >
          <Box
            component="header"
            id="gh"
            role="banner"
            sx={{
              paddingTop: "10px",
              color: "#191919",
              fontSize: ".875rem",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              component="table"
              role="presentation"
              sx={{
                borderCollapse: "collapse",
                borderSpacing: 0,
                width: "100%",
                marginTop: 0,
                background: "none !important",
                display: "table",
                boxSizing: "border-box",
                textIndent: "initial",
                borderColor: "gray",
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box component="tbody">
                <Box component="tr">
                  <Box
                    component="td"
                    sx={{
                      width: "1%",
                      verticalAlign: "bottom",
                      padding: 0,
                      display: "table-cell",
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                    }}
                  >
                    <Box
                      component="a"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavHome();
                      }}
                      disabled={isLoading}
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        position: "relative",
                        textIndent: "-9999px",
                        width: "117px",
                        height: "48px",

                        ":link": {
                          color: "#0654ba",
                          textDecoration: "none",
                        },

                        color: "#0654ba",
                        textDecoration: "none",

                        cursor: "pointer",
                        ":-webkit-any-link": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          //clip: "rect(47px, 118px, 95px, 0px)",
                          //position: "relative",
                          // position: "absolute",
                          // top: "-47px",
                          // top: "-87px",
                          // left: 0,
                          // border: 0,
                          width: "250px",
                          aspectRatio: "auto 250 / 200",
                          height: "200px",
                          // overflowClipMargin: "content-box",
                          //overflow: "clip",
                          //textIndent: "-9999px",
                          display: "block",
                        }}
                      >
                        <Image
                          src="/logodimapromo.svg"
                          alt="Image meilleure vente"
                          //layout="responsive"
                          layout="fill"
                          width="100%"
                          height="100%"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            color: "#191919",
            fontSize: ".875rem",
            WebkitTextSizeAdjust: "100%",
          }}
        >
          <Box
            sx={{
              display: "inherit",
              margin: "auto",
              maxidWth: "none!important",
              paddingLeft: "16px",
              paddingRight: "16px",
              minHeight: "66vh",
              color: "#191919",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "458px",
                margin: "auto",
                minHeight: "70vh",
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                component="h1"
                sx={{
                  height: "32px",
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: 1.33,
                  textAlign: "center",
                  color: "#191919",
                }}
              >
                Verification de votre email...
              </Box>
              {verifEmailIsError && (
                <Box
                  sx={{
                    color: "#191919",
                    fontSize: ".875rem",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "#191919",
                      fontSize: ".875rem",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="p"
                      sx={{
                        margin: 0,
                        fontSize: "14px",
                        lineHeight: "1.43",
                        color: "#191919",
                        WebkitTextSizeAdjust: "100%",
                        //
                        textAlign: "center",
                        fontWeight: 500,
                      }}
                    >
                      {verifEmailError.data.message}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifEmail;
