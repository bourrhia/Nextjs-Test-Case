import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
import Image from "next/image";
import { useUpdUserMutation } from "../../redux/features/api/apiSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { signIn } from "next-auth/react";

export const AccountExist = () => {
  const router = useRouter();
  const { errorMsg, email, nom, prenom, password } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isReplacingAcct, setIsReplacingAcct] = useState(false);
  const [isSignInError, setIsSignInError] = useState(false);
  // const [isNavSignIn, setIsNavSignIn] = useState(false);
  //const [isNavSignUp, setIsNavSignUp] = useState(false);

  const [
    updUser,
    {
      isLoading: updUserIsLoading,
      isSuccess: updUserIsSuccess,
      error: updUserError,
      isError: updUserIsError,
    },
  ] = useUpdUserMutation();

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

  /* useEffect(() => {
    if (updUserIsSuccess) {
      // Mutation was successful
      initiateEmailVerification(email);

      router.push({
        pathname: "/auth/verify-request",
        query: {
          email: email,
        },
      });
    }
  }, [updUserIsSuccess]);*/

  ///////////////////////////////////////////////////////

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

  const handleNavSignIn = async (email) => {
    // setIsNavSignIn(true);

    try {
      await router.push({
        // pathname: "/signInForm",
        pathname: "/auth/signin",
        query: {
          email: email,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      //  setIsNavSignIn(false);
    }
  };

  const handleNavSignUp = async (email) => {
    // setIsNavSignUp(true);

    try {
      await router.push({
        pathname: "/auth/signup",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      //   setIsNavSignUp(false);
    }
  };

  const handleNavVerifyRequest = async (email) => {
    //  setIsNavVerifyRequest(true);
    try {
      await router.push({
        pathname: "/auth/verify-request",
        query: {
          email: email,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setIsNavVerifyRequest(false);
    }
  };

  async function initiateEmailVerification(email) {
    // isLoadingEmailVerif.current = true;

    try {
      const result = await signIn("email", {
        redirect: false,
        email,
        callbackUrl: "/auth/verify-email-success",
      });

      if (result.status === "ok" || !result.error) {
        setIsSignInError(false);
        await handleNavVerifyRequest(email);
      } else {
        setIsSignInError(true);
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  ///////////////////////////////////////////////////////

  /*async function initiateEmailVerification(email) {
    try {
      // Call signIn with redirect: true
      await signIn("email", {
        redirect: false,
        email,
      });
      console.log("Verification email sent successfully!");
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }*/

  const handleReplaceAcct = async (e) => {
    e.preventDefault();

    const canReplaceAcct = [email, nom, prenom, password].every(Boolean);
    if (canReplaceAcct) {
      setIsReplacingAcct(true);
      try {
        const response = await updUser({
          email,
          nom,
          prenom,
          password,
        }).unwrap();

        if (
          updUserIsSuccess ||
          response?.message.includes("User updated successfully")
        ) {
          await initiateEmailVerification(email);
        }
      } catch (err) {
        console.error(
          "Un probleme est survenu pour remplacer votre compte: ",
          err
        );
      } finally {
        setIsReplacingAcct(false);
      }
    }
  };

  return (
    <Box>
      {isLoading && !isReplacingAcct && (
        // && !isSigningIn && !isSubmitting
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
                      //component="a"
                      component="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavHome();
                      }}
                      disabled={
                        isLoading || isReplacingAcct
                        //||
                        // isNavSignIn ||
                        //  isNavSignUp
                      }
                      sx={{
                        display: "block",
                        overflow: "hidden",
                        position: "relative",
                        textIndent: "-9999px",
                        // width: "117px",
                        // height: "48px",
                        width: "140px",
                        height: "71px",

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
                        //
                        backgroundColor: "transparent",
                        border: "none",
                        outline: 0,
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          display: "block",
                          position: "relative",
                          whiteSpace: "nowrap",
                          // width: "117px",
                          // height: "48px",
                          width: "130px",
                          height: "61px",
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
          role="main"
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
              maxWidth: "none!important",
              paddingLeft: "16px",
              paddingRight: "16px",
              minHeight: "66vh",
              color: "#191919",
              fontSize: ".875rem",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "458px",
                margin: "auto",
                height: "70vh",
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
                Un compte existe déjà
              </Box>
              <Box
                sx={{
                  color: "#191919",
                  fontSize: ".875rem",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                {/*  {accountAlreadyExist ? ( */}
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
                  {errorMsg}
                  {/* L'adresse e-mail est déjà associée à un compte */}
                  <Box component="b">&nbsp;{email}</Box>
                </Box>
                {/* ) : (
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
                    {errorMsg}
                  </Box>
                )} */}
                <Box component="br"></Box>
                {/*{accountAlreadyExist && ( */}
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
                  Voulez-vous utiliser cette adresse e-mail pour
                  <Box component="b">&nbsp;remplacer votre compte</Box>
                  &nbsp;existant par un nouveau&nbsp;?
                </Box>
                {/* )} */}
                <Box component="br" sx={{}}></Box>
                {/* {accountAlreadyExist && ( */}
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
                  Ou préférez-vous
                  <Box component="b">
                    &nbsp;vous connecter à votre compte existant
                  </Box>
                  &nbsp;?
                </Box>
                {/* )} */}
                <Box component="br"></Box>
              </Box>
              {(isSignInError || updUserIsError) && (
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
                            //fontSize: "12px",
                            fontSize: "14px",
                            lineHeight: "15px",
                            // color: "#067D62",
                            color: "#C7511F",
                            //
                            fontWeight: "bold",
                          }}
                        >
                          Un problème est survenu pour remplacer votre compte.
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              <Box>
                {/* {accountAlreadyExist && ( */}
                <>
                  <Box
                    component="button"
                    name="REPLACE_ACCOUNT"
                    text="Remplacer votre compte"
                    type="button"
                    onClick={handleReplaceAcct}
                    disabled={
                      updUserIsLoading ||
                      isReplacingAcct ||
                      //  isNavSignIn ||
                      //  isNavSignUp ||
                      isLoading
                    }
                    sx={{
                      width: "100%",
                      //backgroundColor: "#3665f3",
                      // borderColor: "#3665f3",
                      backgroundColor:
                        updUserIsLoading || isReplacingAcct
                          ? "#e7e9ec"
                          : "#3665f3",
                      borderColor:
                        updUserIsLoading || isReplacingAcct
                          ? "#8d9096"
                          : "#3665f3",
                      color:
                        updUserIsLoading || isReplacingAcct ? "#111" : "#fff",
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
                      //
                      //boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
                    }}
                  >
                    Remplacer votre compte
                  </Box>
                  {(updUserIsLoading || isReplacingAcct) && (
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
                </>
                {/* )} */}
                <Box component="br"></Box>
                <Box component="br"></Box>
                {/* {accountAlreadyExist && ( */}
                <Box
                  component="span"
                  sx={{
                    color: "#191919",
                    fontSize: ".875rem",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    //component="a"
                    component="button"
                    //onClick={handleNavSignIn}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavSignIn();
                    }}
                    disabled={
                      // updUserIsLoading ||
                      isReplacingAcct ||
                      // isNavSignIn ||
                      //  isNavSignUp ||
                      isLoading
                    }
                    sx={{
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
                      backgroundColor: "#f7f7f7",
                      // backgroundColor:'transparent',
                      border: "1px solid",
                      borderColor: "#3665f3",
                      color: "#3665f3",
                      width: "100%",
                      cursor: "pointer",
                      //
                      backgroundColor: "transparent",
                      border: "none",
                      outline: 0,

                      ":hover": {
                        textDecoration: "underline",
                        //color: "#007185",
                        color: "#C7511F",
                      },

                      textDecoration: "none",
                    }}
                  >
                    Se connecter au compte existant
                  </Box>
                </Box>
                {/*)} */}
                <Box component="br"></Box>
                <Box component="br"></Box>
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
                    //onClick={handleNavSignIn}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavSignUp();
                    }}
                    disabled={
                      // updUserIsLoading ||
                      isReplacingAcct ||
                      // isNavSignIn ||
                      //  isNavSignUp ||
                      isLoading
                    }
                    sx={{
                      cursor: "pointer",
                      // textDecoration: "underline",
                      color: "#0654ba",
                      textAlign: "center!important",
                      fontSize: ".875rem",
                      //
                      backgroundColor: "transparent",
                      border: "none",
                      outline: 0,

                      ":hover": {
                        textDecoration: "underline",
                        //color: "#007185",
                        color: "#C7511F",
                      },

                      textDecoration: "none",
                    }}
                  >
                    S'inscrire avec une adresse e-mail différente
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

export default AccountExist;
