import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SvgIcon from "@mui/material/SvgIcon";
import { IconButton } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
//import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { signIn, useSession, getSession } from "next-auth/react";
//import { getSession } from 'next-auth/react';
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  useForm,
  useFieldArray,
  FormProvider,
  useFormContext,
  useWatch,
  Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const SignInForm = () => {
  //const { data: session } = useSession();
  const router = useRouter();
  const { email } = router.query;
  const [signInError, setSignInError] = useState(false);
  //const [isNavForgotPswd, setisNavForgotPswd] = useState(false);
  const [isNavCallbackUrl, setIsNavCallbackUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signInSchema = yup.object().shape({
    motDePasse: yup
      .string()
      .required("Votre mot de passe est requis")
      .min(
        6,
        "Votre mot de passe devra avoir un minimum requis de 6 caractères"
      )
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,}$/,
        "Votre mot de passe devra avoir un minimum de 6 caractères, au moins une lettre majuscule, au moins un nombre, et aucun espace"
      )
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // trigger,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
    mode: "onBlur",
    // mode: "onChange",
    reValidateMode: "onBlur",
    // reValidateMode: "onChange",
    //shouldFocusError: true,
  });

  /*const onSubmit = (data) => {
    console.log(data);
  };*/

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function CustVisibilityIcon(props) {
    return (
      <SvgIcon {...props}>
        <VisibilityIcon />
      </SvgIcon>
    );
  }

  function CustVisibilityOffIcon(props) {
    return (
      <SvgIcon {...props}>
        <VisibilityOffIcon />
      </SvgIcon>
    );
  }

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

  const handleNavCallbackUrl = async (resultUrl) => {
    setIsNavCallbackUrl(true);

    try {
      await router.push(resultUrl);
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavCallbackUrl(false);
    }
  };

  const handleNavForgotPswd = async () => {
    // setisNavForgotPswd(true);

    try {
      await router.push({
        pathname: "/auth/forgotPassword",
        query: {
          email: email,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setisNavForgotPswd(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    await handleNavForgotPswd();
    /* router.push({
      pathname: "/auth/forgotPassword",
      query: {
        email: email,
      },
    });*/
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();
    // alert(JSON.stringify(data));
    const password = data.motDePasse;

    const canSignIn = [email, password].every(Boolean);
    if (canSignIn) {
      setIsSigningIn(true);
      /* const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    if (
      result.error === "CredentialsSignin" ||
      !result.ok ||
      result.status === "401"
    ) {
      // Handle authentication error
      setSignInError(true);
    } else {
      await handleNavCallbackUrl(result.url);
      
    }
    
    setIsSigningIn(false); */

      /////////////////////////

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl: "/",
        });
        // await handleNavCallbackUrl(result.url);
        /* if (
          result.error === "CredentialsSignin" ||
          !result.ok ||
          result.status === "401"
        ) {
          // Handle authentication error
          setSignInError(true);
        } else {
          setSignInError(false);
          await handleNavCallbackUrl(result.url);
        }*/
        /////////////////////////////////////

        if (result.status === "ok" || !result.error) {
          // Authentication was successful
          setSignInError(false);
          await handleNavCallbackUrl(result.url);
        } else {
          // Authentication failed
          setSignInError(true);
        }
      } catch (error) {
        console.error("SignIn error :", error);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <Box>
      {isLoading && !isSigningIn && !isSubmitting && (
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
        //component="a"
        sx={{
          fontSize: "13px",
          lineHeight: "19px",
          color: "#111",
        }}
      >
        <Box
          sx={{
            marginBottom: "22px",
            padding: "14px 18px!important",
            fontSize: "13px",
            lineHeight: "19px",
            color: "#111",
          }}
        >
          <Box
            sx={{
              marginBottom: "0!important",
              fontSize: "13px",
              lineHeight: "19px",
              color: "#111",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              sx={{
                textAlign: "center!important",
                marginBottom: "18px!important",
              }}
            >
              <Box
                //component="a"
                component="button"
                tabindex="-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavHome();
                }}
                disabled={isLoading || isSigningIn || isSubmitting}
                sx={{
                  "&:link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  cursor: "pointer",
                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  textAlign: "center!important",
                  // fontSize: "13px",
                  //lineHeight: "19px",
                  //
                  // display: "block",
                  // overflow: "hidden",
                  //position: "relative",
                  textDecoration: "none",
                  color: "#0066c0",
                  height: "31px",
                  width: "103px",
                  /*  height: "68px",
                width: "140px",
                display: "inline-block",
                verticalAlign: "top",*/
                  // display: "inline-block",
                  //
                  backgroundColor: "transparent",
                  border: "none",
                  outline: 0,
                }}
              >
                {/*
                <Image
                  src="/logodimapromo.svg"
                  alt="logo"
                  //layout="fill"
                  layout="responsive"
                  width={185}
                  height={31}
                /> */}

                <Box
                  component="i"
                  role="presentation"
                  sx={{
                    // backgroundImage:
                    //   "url(http://localhost:3000/public/logodimapromo.svg)",
                    backgroundImage: "url(/logodimapromo.svg)",
                    width: "103px",
                    height: "31px",

                    // width: "210px",
                    // height: "31px",
                    //backgroundPosition: "-5px -130px",
                    // backgroundSize: "400px 750px",

                    //backgroundPosition: "5px 130px",
                    //backgroundSize: "50px 350px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                    verticalAlign: "top",
                    fontStyle: "italic",
                    //
                  }}
                ></Box>
                {/*  <Box
                component="i"
                role="presentation"
                sx={{
                  backgroundImage:
                    "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                  width: "12px",
                  backgroundPosition: "-127px -200px",
                  height: "28px",
                  backgroundSize: "400px 750px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                  verticalAlign: "top",
                  fontStyle: "italic",
                  
                }}
              ></Box> */}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "700px",
              margin: "auto",
            }}
          ></Box>
          <Box
            sx={{
              marginTop: "10px",

              "&:last-child": {
                marginBottom: 0,
              },
            }}
          >
            <Box
              sx={{
                width: "350px",
                margin: "0 auto",
                marginBottom: "14px!important",
              }}
            >
              <Box
                sx={{
                  display: "none",
                  borderRadius: "8px",
                  borderColor: "#8b6e00",
                  border: "1px #ddd solid",
                  backgroundColor: "#fff",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 0 4px #fffae7 inset",
                    paddingLeft: "63px",
                    position: "relative",
                    padding: "14px 18px",
                  }}
                >
                  <Box
                    component="h4"
                    sx={{
                      color: "#7c6200",
                      fontWeight: 400,
                      fontSize: "17px",
                      lineHeight: 1.255,
                      textRendering: "optimizeLegibility",
                      paddingBottom: "4px",
                    }}
                  >
                    Veuillez activer les cookies pour continuer
                  </Box>
                  <Box
                    component="i"
                    sx={{
                      height: "27px",
                      width: "30px",
                      position: "absolute",
                      left: "18px",
                      top: "11px",
                      backgroundPosition: "-283px -35px",
                      backgroundImage:
                        "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                      backgroundSize: "400px 750px",
                      backgroundRepeat: "no-repeat",
                      display: "inline-block",
                      verticalAlign: "top",
                    }}
                  ></Box>
                  <Box>
                    <Box component="p">
                      <Box
                        component="a"
                        //href="/gp/help/customer/display.html/ref=ap_cookie_error_help?
                        sx={{
                          ":link": {
                            textDecoration: "underline",
                          },

                          ":link": {
                            color: "#0066c0",
                          },

                          cursor: "pointer",

                          ":-webkit-any-link": {
                            cursor: "pointer",
                          },
                        }}
                      ></Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {signInError && (
              <Box
                sx={{
                  width: "350px",
                  margin: "0 auto",
                  marginBottom: "14px!important",
                  fontSize: "13px",
                  lineHeight: "19px",
                  color: "#111",
                }}
              >
                <Box
                  sx={{
                    "&:last-child": {
                      marginBottom: 0,
                    },

                    fontSize: "13px",
                    lineHeight: "19px",
                    color: "#111",
                  }}
                >
                  <Box
                    role="alert"
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#c40000",
                      marginBottom: "14px!important",
                      display: "block",
                      border: "1px #ddd solid",
                      backgroundColor: "#fff",
                      fontSize: "13px",
                      lineHeight: "19px",
                      color: "#111",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "8px",
                        backgroundColor: "#fff",
                        boxShadow: "0 0 0 4px #fcf4f4 inset",
                        paddingLeft: "63px",
                        position: "relative",
                        padding: "14px 18px",
                        fontSize: "13px",
                        lineHeight: "19px",
                        color: "#111",
                      }}
                    >
                      <Box
                        component="h4"
                        sx={{
                          color: "#c40000",
                          fontWeight: 400,
                          fontSize: "17px",
                          lineHeight: 1.255,
                          textRendering: "optimizeLegibility",
                          paddingBottom: "4px",
                        }}
                      >
                        Les informations saisies ne correspondent pas. Votre mot
                        de passe est incorrect.
                      </Box>
                      <Box component="i" sx={{}}></Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                width: "350px",
                margin: "0 auto",
                //marginBottom: "14px!important",
                fontSize: "13px",
                lineHeight: "19px",
                color: "#111",
                //
              }}
            >
              <Box
                sx={{
                  marginBottom: "14px!important",
                  fontSize: "13px",
                  lineHeight: "19px",
                  color: "#111",
                }}
              >
                <Box
                  sx={{
                    //
                    borderRadius: "8px",
                    display: "block",
                    border: "1px #ddd solid",
                    backgroundColor: "#fff",
                    fontSize: "13px",
                    lineHeight: "19px",
                    color: "#111",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "8px",
                      position: "relative",
                      padding: "20px 26px!important",
                      fontSize: "13px",
                      lineHeight: "19px",
                      color: "#111",
                    }}
                  >
                    <Box
                      component="h1"
                      sx={{
                        marginBottom: "10px!important",
                        fontWeight: 400,
                        fontSize: "28px",
                        lineHeight: 1.2,
                        textRendering: "optimizeLegibility",
                        paddingBottom: "4px",
                        color: "#111",
                      }}
                    >
                      S'identifier
                    </Box>
                    <Box
                      sx={{
                        marginBottom: "14px!important",
                        width: "100%",

                        "&::after, &::before": {
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
                        component="span"
                        sx={{
                          fontSize: "13px",
                          lineHeight: "19px",
                          color: "#111",
                        }}
                      >
                        {email}
                      </Box>
                      <Box
                        //component="a"
                        component="button"
                        tabindex="5"
                        onClick={handleNavChangeAcct}
                        // disabled={isNavChangeAcct}
                        disabled={isLoading || isSigningIn || isSubmitting}
                        sx={{
                          "&:visited": {
                            textDecoration: "none",
                            color: "#0066c0",
                          },

                          textDecoration: "none",
                          color: "#0066c0",
                          cursor: "pointer",
                          ":-webkit-any-link": {
                            cursor: "pointer",
                          },

                          fontSize: "13px",
                          lineHeight: "19px",
                          /////////////
                          backgroundColor: "transparent",
                          border: "none",
                          outline: 0,
                        }}
                      >
                        &nbsp;Modifier
                      </Box>
                    </Box>

                    <Box
                      component="form"
                      name="signIn"
                      method="post"
                      novalidate=""
                      id="signIn_form"
                      onSubmit={handleSubmit(onSubmit)}
                      sx={{
                        marginBottom: "0!important",
                      }}
                    >
                      <Box
                        sx={{
                          marginBottom: "22px",
                          fontSize: "13px",
                          lineHeight: "19px",
                          color: "#111",
                        }}
                      >
                        <Box
                          sx={{
                            marginBottom: "22px!important",
                            fontSize: "13px",
                            lineHeight: "19px",
                            color: "#111",
                            //
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                              fontSize: "13px",
                              lineHeight: "19px",
                              color: "#111",

                              "&::after, &::before": {
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
                                width: "40.448%",
                                marginRight: "2%",
                                float: "left",
                                minHeight: "1px",
                                overflow: "visible",
                                fontSize: "13px",
                                lineHeight: "19px",
                                color: "#111",
                              }}
                            >
                              <Box
                                component="label"
                                for="val_password"
                                sx={{
                                  display: "block",
                                  paddingLeft: "2px",
                                  paddingBottom: "2px",
                                  fontWeight: 700,
                                  fontSize: "13px",
                                  lineHeight: "19px",
                                  //color: "#111",
                                  color: errors.motDePasse ? "#e0103a" : "#111",
                                }}
                              >
                                Mot de passe
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                marginRight: 0,
                                float: "right",
                                width: "57.448%",
                                minHeight: "1px",
                                overflow: "visible",
                                textAlign: "right!important",
                                fontSize: "13px",
                                lineHeight: "19px",
                                color: "#111",
                              }}
                            >
                              <Box
                                // component="a"
                                component="button"
                                onClick={handleForgotPassword}
                                tabindex="6"
                                //disabled={isNavForgotPswd}
                                disabled={
                                  isLoading || isSigningIn || isSubmitting
                                }
                                sx={{
                                  "&:link": {
                                    textDecoration: "none",
                                    color: "#0066c0",
                                  },

                                  textDecoration: "none",
                                  color: "#0066c0",
                                  cursor: "pointer",

                                  ":-webkit-any-link": {
                                    cursor: "pointer",
                                  },

                                  fontSize: "13px",
                                  lineHeight: "19px",

                                  textAlign: "right!important",
                                  /////////////
                                  backgroundColor: "transparent",
                                  border: "none",
                                  outline: 0,
                                }}
                              >
                                Mot de passe oublié
                              </Box>
                            </Box>
                            {/*   {isNavForgotPswd && <CircularProgress size={20} />} */}
                          </Box>

                          <Box
                            component="input"
                            //type="password"
                            type={showPassword ? "text" : "password"}
                            maxlength="1024"
                            id="val_password"
                            name="password"
                            placeholder="Au moins 6&nbsp;caractères"
                            tabindex="2"
                            {...register("motDePasse")}
                            disabled={isLoading || isSigningIn || isSubmitting}
                            sx={{
                              // color: "#0F1111",
                              color: errors.motDePasse ? "#e0103a" : "#0F1111",
                              backgroundColor: "#fff",
                              height: "31px",
                              padding: "3px 7px",
                              lineHeight: "normal",
                              //border: "1px solid #a6a6a6",
                              //borderTopColor: "#949494",
                              border: errors.motDePasse
                                ? "1px solid #e0103a"
                                : "1px solid #a6a6a6",
                              borderTopColor: errors.motDePasse
                                ? "#e0103a"
                                : "#949494",

                              borderRadius: "3px",
                              boxShadow:
                                "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset",
                              outline: 0,
                              width: "100%",
                              marginRight: 0,
                              WebkitTransition: "all .1s linear",
                              transition: "all .1s linear",

                              "&:focus": {
                                backgroundColor: errors.motDePasse
                                  ? "none"
                                  : "#F7FEFF",

                                borderColor: errors.motDePasse
                                  ? "none"
                                  : "#007185",
                                boxShadow: errors.motDePasse
                                  ? "none"
                                  : "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                              },
                            }}
                          ></Box>

                          <Box
                            sx={{
                              // top: "11px",
                              top: "19px",
                              position: "absolute",
                              float: "right",
                              right: "12px",
                              display: "block",
                              marginTop: "10px",
                              marginRight: "16px",
                            }}
                          >
                            <Box>
                              <Box
                                component="span"
                                sx={{
                                  display: "-webkit-flex",
                                  display: "flex",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    display: "inline-flex",
                                    position: "relative",
                                    verticalAlign: "text-bottom",
                                  }}
                                >
                                  <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                    sx={{
                                      display: "inline-flex",
                                      height: "18px",
                                      outlineOffset: "1px",
                                    }}
                                  >
                                    {showPassword ? (
                                      <CustVisibilityOffIcon
                                        fontSize="small"
                                        sx={{
                                          display: "inline-block",
                                          color: "#444",
                                          // height: "18px !important",
                                          // width: "18px !important",
                                          fill: "currentColor",
                                          pointerEvents: "none",
                                          stroke: "currentColor",
                                          strokeWidth: 0,
                                          verticalAlign: "middle",
                                        }}
                                      />
                                    ) : (
                                      <CustVisibilityIcon
                                        fontSize="small"
                                        sx={{
                                          display: "inline-block",
                                          color: "#444",
                                          // height: "18px !important",
                                          /// width: "18px !important",
                                          fill: "currentColor",
                                          pointerEvents: "none",
                                          stroke: "currentColor",
                                          strokeWidth: 0,
                                          verticalAlign: "middle",
                                        }}
                                      />
                                    )}
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          {errors.motDePasse && (
                            <Box
                              role="alert"
                              sx={{
                                borderRadius: "8px",
                                //display: "none",
                                border: "none",
                                verticalAlign: "middle",
                                backgroundColor: "transparent",
                                marginTop: "6px!important",
                                fontSize: "13px",
                                lineHeight: "19px",
                                color: "#111",
                              }}
                            >
                              <Box
                                sx={{
                                  borderRadius: "8px",
                                  paddingLeft: "16px",
                                  color: "#c40000",
                                  padding: 0,
                                  position: "relative",
                                  fontSize: "13px",
                                  lineHeight: "19px",
                                }}
                              >
                                <Box
                                  sx={{
                                    marginBottom: 0,
                                    textAlign: "left",
                                    fontSize: "12px",
                                    lineHeight: "15px",
                                    color: "#c40000",
                                  }}
                                >
                                  {errors.motDePasse.message}
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>

                        <Box
                          sx={{
                            "&:last-child": {
                              marginBottom: 0,
                            },

                            fontSize: "13px",
                            lineHeight: "19px",
                            color: "#111",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
                              background:
                                isNavCallbackUrl ||
                                isSubmitting ||
                                // isLoading ||
                                isSigningIn
                                  ? "#e7e9ec"
                                  : "#FFD814",
                              borderColor:
                                isNavCallbackUrl ||
                                isSubmitting ||
                                // isLoading ||
                                isSigningIn
                                  ? "#8d9096"
                                  : "#FCD200",
                              width: "100%!important",
                              color: "#111",
                              borderStyle: "solid",
                              borderWidth: "1px",
                              cursor: "pointer",
                              display: "inline-block",
                              padding: 0,
                              textAlign: "center",
                              textDecoration: "none!important",
                              verticalAlign: "middle",
                              fontSize: "13px",
                              lineHeight: "19px",
                              //////

                              // background: "#e7e9ec",
                              //  borderColor: "#8d9096",

                              // borderColor: "#adb1b8 #a2a6ac #8d9096",
                              // borderColor: "#adb1b8",
                              // borderColor: "#a2a6ac",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                borderRadius: "7px",
                                background: "0 0",
                                boxShadow: "none",
                                display: "block",
                                position: "relative",
                                overflow: "hidden",
                                height: "29px",
                                color: "#111",
                                cursor: "pointer",
                                textAlign: "center",
                                fontSize: "13px",
                                lineHeight: "19px",
                                //
                              }}
                            >
                              <Box
                                //component="input"
                                component="button"
                                id="signInSubmit"
                                tabindex="3"
                                type="submit"
                                //disabled={isNavCallbackUrl}
                                disabled={
                                  isLoading || isSigningIn || isSubmitting
                                }
                                sx={{
                                  color: "#0F1111",
                                  cursor: "pointer",
                                  WebkitAppearance: "button",
                                  position: "absolute",
                                  backgroundColor: "transparent",
                                  border: 0,
                                  height: "100%",
                                  width: "100%",
                                  left: 0,
                                  top: 0,
                                  opacity: 0.01,
                                  outline: 0,
                                  overflow: "visible",
                                  zIndex: 20,
                                  WebkitTransition: "all .1s linear",
                                  transition: "all .1s linear",
                                  lineHeight: "19px",
                                }}
                              ></Box>
                              {isSigningIn || isSubmitting ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Box
                                  component="span"
                                  aria-hidden="true"
                                  sx={{
                                    color: "#0F1111",
                                    backgroundColor: "transparent",
                                    border: 0,
                                    display: "block",
                                    fontSize: "13px",
                                    lineHeight: "29px",
                                    margin: 0,
                                    outline: 0,
                                    padding: "0 10px 0 11px",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                    //
                                    fontWeight: 500,
                                  }}
                                >
                                  S'identifier
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
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

/*export async function getServerSideProps(context) {
  const session = await getSession(context);

  console.log("server session :", session);

  return {
    props: {
      session,
    },
  };
}*/

export default SignInForm;
