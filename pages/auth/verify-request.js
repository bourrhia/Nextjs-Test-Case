import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import Image from "next/image";
import { useResendEmailVerifMutation } from "../../redux/features/api/apiSlice";
import CircularProgress from "@mui/material/CircularProgress";
//import { handleNavHome } from "../../lib/handleNavHome";

export const VerifyRequest = () => {
  const router = useRouter();

  const { email } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

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

  const [
    resendEmailVerif,
    {
      data: resendEmailData,
      isLoading: resendEmailIsLoading,
      isSuccess: resendEmailIsSuccess,
      error: resendEmailError,
      isError: resendEmailIsError,
    },
  ] = useResendEmailVerifMutation();

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

  const handleNavChangeAcct = async () => {
    // setIsNavChangeAcct(true);

    try {
      await router.push({
        pathname: "/auth/authForm",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      //  setIsNavChangeAcct(false);
    }
  };

  const handleResendEmail = async (e) => {
    e.preventDefault();

    setIsResendingEmail(true);

    try {
      const response = await resendEmailVerif({
        email,
      }).unwrap();
    } catch (err) {
      console.error("Un probleme est survenu pour renvoyer votre email: ", err);
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <Box>
      {isLoading && !resendEmailIsLoading && !isResendingEmail && (
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
                      // component="a"
                      component="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavHome();
                      }}
                      disabled={
                        isLoading || resendEmailIsLoading || isResendingEmail
                      }
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
                        /////////////
                        backgroundColor: "transparent",
                        border: "none",
                        outline: 0,
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
                margin: "auto",
                maxWidth: "458px",
                textAlign: "left",
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                component="section"
                sx={{
                  "@media (min-width: 601px)": {
                    margin: "16px 0",
                  },

                  display: "grid",
                  gridTemplateColumns: "32px auto auto auto",
                  backgroundColor: "#05823f",
                  borderColor: "#05823f",
                  border: "1px solid #363636",
                  color: "#fff",
                  fontSize: ".875rem",
                  padding: "16px",
                  textAlign: "left",
                }}
              >
                <Box
                  sx={{
                    gridColumn: 2,
                    gridRow: 1,
                    paddingRight: "16px",
                    color: "#fff",
                    fontSize: ".875rem",
                    textAlign: "left",
                  }}
                >
                  <Box
                    component="p"
                    tabIndex="-1"
                    sx={{
                      margin: "5px 0 0",
                      fontSize: ".875rem",
                      color: "#fff",
                      textAlign: "left",
                      //fontWeight: 500,
                      fontWeight: 700,
                    }}
                  >
                    Nous avons envoyé un lien de confirmation à l&rdquo;adresse
                    &nbsp;
                    {email}.
                  </Box>
                </Box>
              </Box>
            </Box>
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
                Vérifiez votre boîte de réception
              </Box>
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
                    }}
                  >
                    Après avoir confirmé votre adresse e-mail, vous pourrez
                    accéder à votre nouveau compte. L&rdquo;e-mail expirera dans
                    24&nbsp;heures.
                  </Box>
                </Box>
                <Box component="br"></Box>
                {resendEmailIsError && (
                  <Box
                    sx={{
                      marginBottom: "4px!important",
                      width: "100%",
                      color: "#0F1111",
                      fontSize: "14px",
                      lineHeight: "20px",

                      "&::before,&::after": {
                        display: "table",
                        content: '""',
                        lineHeight: 0,
                        fontSize: 0,
                      },

                      "&::after": {
                        clear: "both",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        border: "none",
                        verticalAlign: "middle",
                        backgroundColor: "transparent",
                        borderRadius: 0,
                        minHeight: "20px",
                        color: "#0F1111",
                        fontSize: "14px",
                        lineHeight: "20px",
                      }}
                    >
                      <Box
                        sx={{
                          paddingLeft: "28px",
                          // color: "#067D62",
                          color: "#C7511F",
                          borderRadius: 0,
                          padding: 0,
                          position: "relative",
                          fontSize: "14px",
                          lineHeight: "20px",
                        }}
                      >
                        <Box
                          sx={{
                            marginBottom: 0,
                            textAlign: "left",
                            fontSize: "12px",
                            lineHeight: "15px",
                            //color: "#067D62",
                            color: "#C7511F",
                            //
                            marginLeft: "28px",
                            marginTop: "12px",
                            ////marginLeft: "18px",
                            // marginTop: "16px",
                          }}
                        >
                          <Box
                            sx={{
                              height: "auto",
                              marginBottom: "1px!important",
                              textAlign: "left",
                              fontSize: "12px",
                              lineHeight: "15px",
                              // color: "#067D62",
                              color: "#C7511F",
                              //
                              fontWeight: "bold",
                            }}
                          >
                            Un problème est survenu pour renvoyer l&rdquo;email.
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
                {resendEmailIsLoading || isResendingEmail ? (
                  <Box
                    sx={{
                      width: "100%",

                      boxSizing: "border-box",

                      margin: 0,
                      textAlign: "center",

                      verticalAlign: "bottom",

                      display: "inline-block",

                      padding: "9.5px 20px",
                      ////
                      zIndex: "8888",
                    }}
                  >
                    <CircularProgress size={20} />
                  </Box>
                ) : (
                  <Box
                    component="button"
                    onClick={handleResendEmail}
                    disabled={
                      resendEmailIsLoading || isLoading || isResendingEmail
                    }
                    sx={{
                      width: "100%",
                      backgroundColor: "#3665f3",
                      borderColor: "#3665f3",
                      color: "#fff",
                      fontWeight: 700,
                      border: "1px solid",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      margin: 0,
                      textAlign: "center",
                      textDecoration: "none",
                      verticalAlign: "bottom",
                      borderRadius: "20px",
                      display: "inline-block",
                      fontSize: ".875rem",
                      minHeight: "40px",
                      minWidth: "88px",
                      padding: "9.5px 20px",
                      cursor: "pointer",
                    }}
                  >
                    Renvoyer l&rdquo;e-mail
                  </Box>
                )}
                <Box component="br"></Box>
                <Box component="br"></Box>
                <Box component="br"></Box>
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
                    textAlign: "center!important",
                    color: "#191919",
                    fontSize: ".875rem",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    //component="a"
                    component="button"
                    tabindex="5"
                    onClick={handleNavChangeAcct}
                    // disabled={isNavChangeAcct}
                    disabled={
                      resendEmailIsLoading || isLoading || isResendingEmail
                    }
                    sx={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#0654ba",
                      textAlign: "center!important",
                      fontSize: ".875rem",
                      WebkitTextSizeAdjust: "100%",
                      /////////////
                      backgroundColor: "transparent",
                      border: "none",
                      outline: 0,
                    }}
                  >
                    Connectez-vous à votre compte existant à la place.
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

export default VerifyRequest;
