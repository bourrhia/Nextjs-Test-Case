//import React from "react";
import React, {
  useState,
  useEffect,
  // useRef,
  // forwardRef,
  //useCallback,
  //  Suspense,
} from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SvgIcon from "@mui/material/SvgIcon";
import { IconButton } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useRouter } from "next/router";

import { useGetUserEmailMutation } from "../../redux/features/api/apiSlice";
import CircularProgress from "@mui/material/CircularProgress";

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

const schemaEmailMob = yup.object().shape({
  emailOrMobile: yup
    .string()
    .required("Saisissez votre adresse e-mail ou numéro de téléphone portable")
    .test(
      "emailOrMobile",
      "Adresse e-mail ou numéro de téléphone portable incorrect ou invalide.",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
        const phoneRegex = /^(?:(?:\+|00)212[\s.-]?)[1-9](?:[\s.-]?[0-9]){8}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    )
    .nullable(),
  /*  emailOrMobile: yup
    .string()
    .test(
      "valid-email-or-mobile",
      "Svp veuillez saisir votre email ou numéro de téléphone",
      (value) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const phoneRegex = /^[0-9]{10}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }
    )
    .required("Email ou numéro de téléphone est obligatoire"),*/
});

export const AuthForm = () => {
  const router = useRouter();

  // const { register, handleSubmit, errors } = useForm({
  //  resolver: yupResolver(schemaEmailMob),
  // });

  const {
    register,
    handleSubmit,
    //setValue,
    getValues,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schemaEmailMob),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  // const inputRef = React.useRef();

  const [expanded, setExpanded] = useState(false);

  //const [isNavSignIn, setIsNavSignIn] = useState(false);

  const [isNavSignIn, setIsNavSignIn] = useState(false);
  //const [isNavSignUp, setIsNavSignUp] = useState(false);
  //const [isNavForgotPswd, setIsNavForgotPswd] = useState(false);
  // const [IsNavHome, setIsNavHome] = useState(false);
  // const [isForgotPswdEmail, setIsForgotPswdEmail] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [forgotPswdDisabled, setforgotPswdDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [canSignIn, setCanSignIn] = useState(false);

  const watchedEmail = watch("emailOrMobile"); // Watch changes to the 'emailOrMobile' input
  // const watchedEmail = getValues("emailOrMobile");

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
    getUserEmail,
    {
      data: getUserEmailData,
      isLoading: getUserEmailIsLoading,
      isSuccess: getUserEmailIsSuccess,
      error: getUserEmailError,
      isError: getUserEmailIsError,
    },
  ] = useGetUserEmailMutation();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleNavSignIn = async (email) => {
    setIsNavSignIn(true);

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
      setIsNavSignIn(false);
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
      //  setIsNavSignUp(false);
    }
  };

  const handleNavForgotPswd = async () => {
    // console.log("watchedEmail : ", watchedEmail);

    if (watchedEmail) {
      try {
        setSubmitDisabled(true);

        const data = await getUserEmail({
          email: watchedEmail,
        }).unwrap();

        // if (!getUserEmailIsError || data?.message === "User found") {
        if (!getUserEmailIsError || data?.message.includes("User found")) {
          await router.push({
            pathname: "/auth/forgotPassword",
            query: {
              email: watchedEmail,
            },
          });
        }
      } catch (err) {
        console.error("Un probleme est survenu pour se connecter ", err);

        if (err.status === 404) {
          if (err?.data.message.includes("User not found")) {
            handleExpandClick();
          }
        }
      } finally {
        setSubmitDisabled(false);
        setforgotPswdDisabled(false);
      }
    } else {
      handleExpandClick();
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
      //  setIsNavHome(false);
    }
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let email = data.emailOrMobile;

    const canISignIn = [email].every(Boolean);
    //setIsForgotPswdEmail(false);
    setCanSignIn(true);
    if (canISignIn) {
      try {
        //setSubmitDisabled(false);
        setforgotPswdDisabled(true);

        const data = await getUserEmail({
          email: email,
        }).unwrap();

        //console.log("Jeudi apres midi data :", data);

        //  if (!getUserEmailIsError || data?.message === "User found") {
        if (!getUserEmailIsError || data?.message.includes("User found")) {
          await handleNavSignIn(email);
        }
      } catch (err) {
        console.error("Un probleme est survenu pour se connecter ", err);
      } finally {
        setSubmitDisabled(false);
        setforgotPswdDisabled(false);
        setCanSignIn(false);
      }
    }
  };

  function CustArrowRightIcon(props) {
    return (
      <SvgIcon {...props}>
        <ArrowRightIcon />
      </SvgIcon>
    );
  }

  return (
    <Box>
      {isLoading && !canSignIn && !isSubmitting && !isNavSignIn && (
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
          marginBottom: "22px",
          padding: "14px 18px!important",
          WebkitTextSizeAdjust: "100%",
          //  fontSize: "13px",
          //  lineHeight: "19px",
          color: "#111",
        }}
      >
        <Box
          sx={{
            marginBottom: "0!important",
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
              disabled={
                canSignIn || isSubmitting || isNavSignIn || isLoading
                //||
                // getUserEmailIsLoading ||
                // submitDisabled
              }
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
                //whiteSpace: "nowrap",
                //display: "block",
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
        >
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

            {getUserEmailIsError && (
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
                        // paddingLeft: "63px",
                        position: "relative",
                        padding: "14px 18px",
                        paddingLeft: "63px",
                        fontSize: "13px",
                        lineHeight: "19px",
                        color: "#111",
                        WebkitTextSizeAdjust: "100%",
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
                          padding: 0,
                          margin: 0,
                          paddingBottom: "4px",
                          //

                          //display: "block",
                          //marginBlockStart: "1.33em",
                          //marginBlockEnd: "1.33em",
                          //marginInlineStart: "0px",
                          // marginInlineEnd: "0px",
                          //position: "relative",
                          // padding: "14px 18px",
                          //paddingBottom: "4px",
                          // paddingLeft: "63px",
                          //paddingLeft: "63px",
                          //margin: 0,
                        }}
                      >
                        Un problème est survenu
                      </Box>
                      <Box
                        component="i"
                        sx={{
                          height: "27px",
                          width: "30px",
                          position: "absolute",
                          left: "18px",
                          top: "11px",
                          backgroundPosition: "-248px -35px",

                          backgroundImage:
                            "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                          backgroundSize: "400px 750px",
                          backgroundRepeat: "no-repeat",
                          display: "inline-block",
                          verticalAlign: "top",
                          /* fontSize: "13px",
                        lineHeight: "19px",
                        color: "#111",*/
                        }}
                      ></Box>
                      <Box
                        sx={
                          {
                            /*  fontSize: "13px",
                        lineHeight: "19px",
                        color: "#111",*/
                          }
                        }
                      >
                        <Box
                          component="ul"
                          sx={{
                            margin: "0 0 18px 18px",
                            marginLeft: 0,
                            color: "#111",
                            "&:last-child": {
                              marginBottom: 0,
                            },
                            //marginBottom: "0!important",
                            padding: 0,
                            //margin: "0 0 18px 18px",
                          }}
                        >
                          <Box
                            component="li"
                            sx={{
                              listStyle: "none",
                              wordWrap: "break-word",
                              margin: 0,
                              display: "list-item",
                              textAlign: "-webkit-match-parent",

                              color: "#111",
                              fontSize: "13px",
                              lineHeight: "19px",
                              //
                              //
                              //paddingLeft: "47px",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                color: "#111",
                                listStyle: "none",
                                wordWrap: "break-word",
                                fontSize: "13px",
                                lineHeight: "19px",
                                //
                                // paddingLeft: "63px",
                              }}
                            >
                              Impossible de trouver un compte correspondant à
                              cette adresse e-mail
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            <Box
              sx={{
                width: "350px",
                margin: "0 auto",
              }}
            >
              <Box
                sx={{
                  marginBottom: "14px!important",
                }}
              >
                <Box
                  sx={{
                    marginBottom: "22px",
                  }}
                >
                  <Box
                    component="form"
                    name="signIn"
                    method="post"
                    novalidate=""
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                      marginBottom: "0!important",
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: "22px",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "8px",
                          display: "block",
                          border: "1px #ddd solid",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Box
                          sx={{
                            borderRadius: "8px",
                            position: "relative",
                            padding: "20px 26px!important",
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
                            }}
                          >
                            S'identifier
                          </Box>
                          <Box
                            sx={{
                              marginBottom: "14px!important",
                              width: "100%",
                              //
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
                              component="label"
                              for="emailOrMobile"
                              sx={{
                                display: "block",
                                paddingLeft: "2px",
                                paddingBottom: "2px",
                                fontWeight: 700,
                                //
                                fontSize: "13px",
                                lineHeight: "19px",
                                // color: "#111",
                                color: errors.emailOrMobile
                                  ? "#e0103a"
                                  : "#111",
                              }}
                            >
                              Numéro de téléphone portable ou e-mail
                            </Box>
                            <Box
                              component="input"
                              type="email"
                              maxlength="128"
                              id="emailOrMobile"
                              name="emailOrMobile"
                              tabindex="1"
                              placeholder="Email"
                              {...register("emailOrMobile")}
                              defaultValue=""
                              disabled={
                                canSignIn ||
                                isSubmitting ||
                                isLoading ||
                                getUserEmailIsLoading
                                //||
                                // getUserEmailIsLoading ||
                                // submitDisabled
                              }
                              onChange={(event) => {
                                const value = event.target.value;
                                if (value.match(/^[0-9]+$/)) {
                                  // If the input value is only numbers, prefill the country code
                                  event.target.value = "+212" + value;
                                } else if (
                                  value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
                                ) {
                                  // If the input value is a valid email, prefill it
                                  event.target.value = value;
                                }
                              }}
                              sx={{
                                width: "100%",
                                marginRight: 0,
                                //color: "#0F1111",
                                color: errors.emailOrMobile
                                  ? "#e0103a"
                                  : "#0F1111",
                                backgroundColor: "#fff",
                                height: "31px",
                                padding: "3px 7px",
                                lineHeight: "normal",
                                // border: "1px solid #a6a6a6",
                                border: errors.emailOrMobile
                                  ? "1px solid #e0103a"
                                  : "1px solid #a6a6a6",
                                //borderTopColor: "#949494",
                                borderTopColor: errors.emailOrMobile
                                  ? "1px solid #e0103a"
                                  : "1px solid #949494",
                                borderRadius: "3px",
                                boxShadow:
                                  "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset",
                                outline: 0,
                                WebkitTransition: "all .1s linear",
                                transition: "all .1s linear",
                                margin: 0,
                                fontSize: "100%",
                                verticalAlign: "middle",

                                "&:focus": {
                                  backgroundColor: "#F7FEFF",
                                  borderColor: "#007185",
                                  boxShadow:
                                    "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                                },
                              }}
                            ></Box>

                            {errors.emailOrMobile && (
                              <Box
                                sx={{
                                  borderRadius: "8px",
                                  display: "block",
                                  border: "none",
                                  verticalAlign: "middle",
                                  backgroundColor: "transparent",
                                  marginTop: "6px!important",
                                  fontSize: "13px",
                                  lineHeight: "19px",
                                  color: "#111",
                                  WebkitTextSizeAdjust: "100%",
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
                                    {errors.emailOrMobile.message}
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Box>
                          <Box
                            sx={{
                              marginBottom: "22px",
                              fontSize: "13px",
                              lineHeight: "19px",
                              color: "#111",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                borderRadius: "8px",
                                boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
                                // background: "#FFD814",
                                background:
                                  isNavSignIn || canSignIn || isSubmitting
                                    ? "#e7e9ec"
                                    : "#FFD814",
                                // borderColor: "#FCD200",
                                borderColor:
                                  isNavSignIn || canSignIn || isSubmitting
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
                                }}
                              >
                                <Box
                                  //component="input"
                                  component="button"
                                  id="continue"
                                  tabindex="5"
                                  type="submit"
                                  aria-labelledby="continue-announce"
                                  disabled={
                                    isNavSignIn ||
                                    canSignIn ||
                                    isSubmitting ||
                                    isLoading ||
                                    getUserEmailIsLoading ||
                                    submitDisabled
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
                                    opacity: ".01",
                                    outline: 0,
                                    overflow: "visible",
                                    zIndex: 20,
                                    WebkitTransition: "all .1s linear",
                                    transition: "all .1s linear",
                                    lineHeight: "19px",
                                    margin: 0,
                                    fontSize: "100%",
                                    verticalAlign: "middle",
                                  }}
                                ></Box>

                                {isNavSignIn || canSignIn || isSubmitting ? (
                                  //||
                                  // getUserEmailIsLoading
                                  //     isLoading ||
                                  //||
                                  //   submitDisabled
                                  //getUserEmailIsLoading
                                  <CircularProgress size={20} />
                                ) : (
                                  <Box
                                    component="span"
                                    id="continue-announce"
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
                                      fontWeight: 400,
                                    }}
                                  >
                                    Continuer
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                          {!forgotPswdDisabled && (
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
                                sx={{
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
                                  component="a"
                                  aria-expanded="false"
                                  role="button"
                                  sx={{
                                    display: "inline-block",
                                    position: "relative",
                                    //paddingLeft: "11px",
                                    // left: -11,

                                    ":hover": {
                                      textDecoration: "underline",
                                      cursor: "pointer",
                                      color: "#c45500",
                                    },

                                    "&:link": {
                                      textDecoration: "none",
                                      color: "#0066c0",
                                    },
                                    outline: 0,
                                    textDecoration: "none",
                                    color: "#0066c0",

                                    ":-webkit-any-link": {
                                      cursor: "pointer",
                                    },

                                    cursor: "pointer",

                                    fontSize: "13px",
                                    lineHeight: "19px",
                                  }}
                                >
                                  <IconButton
                                    // aria-label="expand"
                                    // size="large"
                                    //  sx={{ ml: 1 }}
                                    ///
                                    aria-label="expand"
                                    size="small"
                                    sx={{
                                      transform: `rotate(${
                                        expanded ? "90deg" : "0deg"
                                      })`,
                                      transition: "transform 0.2s ease-in-out",
                                      //
                                      left: 0,
                                      // display: "inline-block",
                                      // position: "absolute",
                                      // backgroundPosition: "-366px -86px",
                                      // top: "50%",
                                      //marginTop: "-4px",
                                      // backgroundSize: "400px 750px",
                                      // backgroundRepeat: "no-repeat",
                                      // display: "inline-block",
                                      // verticalAlign: "top",

                                      width: "7px",
                                      height: "7px",
                                      backgroundPosition: "-366px -86px",
                                      //position: "absolute",
                                      //top: "50%",
                                      //marginTop: "-4px",
                                      left: 0,
                                      backgroundSize: "400px 750px",
                                      backgroundRepeat: "no-repeat",
                                      //display: "inline-block",
                                      //verticalAlign: "top",
                                    }}
                                    //onClick={handleExpandClick}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleExpandClick();
                                    }}
                                  >
                                    <CustArrowRightIcon
                                      fontSize="small"
                                      sx={{
                                        // width: "7px",
                                        // height: "7px",
                                        // backgroundPosition: "-366px -86px",
                                        //position: "absolute",
                                        //top: "50%",
                                        //marginTop: "-4px",
                                        left: 0,
                                        //backgroundSize: "400px 750px",
                                        // backgroundRepeat: "no-repeat",
                                        display: "inline-block",
                                        //verticalAlign: "top",
                                      }}
                                    />
                                  </IconButton>
                                  <Box
                                    component="span"
                                    sx={{
                                      wordWrap: "break-word",
                                      fontSize: "13px",
                                      lineHeight: "19px",
                                      //
                                      paddingLeft: "11px",
                                    }}
                                  >
                                    Avez-vous besoin d’aide&nbsp;?
                                  </Box>
                                </Box>

                                {expanded && (
                                  <Box
                                    sx={{
                                      overflow: "hidden",
                                      marginTop: "4px",
                                      paddingLeft: "11px",
                                    }}
                                  >
                                    <Box
                                      //component="a"
                                      component="button"
                                      disabled={
                                        isLoading ||
                                        canSignIn ||
                                        isSubmitting ||
                                        //||
                                        // getUserEmailIsLoading
                                        isNavSignIn
                                      }
                                      onClick={(e) => {
                                        e.preventDefault();
                                        /*router.push({
                                        pathname: "/forgotPassword",
                                      });*/
                                        handleNavForgotPswd();
                                      }}
                                      sx={{
                                        "&:link": {
                                          textDecoration: "none",
                                          color: "#0066c0",
                                        },

                                        cursor: "pointer",

                                        ":-webkit-any-link": {
                                          cursor: "pointer",
                                        },

                                        ":hover": {
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                          color: "#c45500",
                                        },

                                        fontSize: "13px",
                                        lineHeight: "19px",

                                        textDecoration: "none",
                                        color: "#0066c0",

                                        //

                                        paddingLeft: "11px",
                                        //
                                        backgroundColor: "transparent",
                                        border: "none",
                                        outline: 0,
                                        whiteSpace: "nowrap",
                                        display: "block",
                                      }}
                                    >
                                      Mot de passe oublié
                                    </Box>

                                    {!watchedEmail && (
                                      <Box
                                        sx={{
                                          borderRadius: "8px",
                                          display: "block",
                                          border: "none",
                                          verticalAlign: "middle",
                                          backgroundColor: "transparent",
                                          marginTop: "6px!important",
                                          fontSize: "13px",
                                          lineHeight: "19px",
                                          color: "#111",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            borderRadius: "8px",
                                            // paddingLeft: "16px",
                                            color: "#c40000",
                                            padding: 0,
                                            position: "relative",
                                            fontSize: "13px",
                                            lineHeight: "19px",
                                            //
                                            paddingLeft: "11px",
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
                                            Veuillez saisir votre email.
                                          </Box>
                                        </Box>
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    textAlign: "center",
                    position: "relative",
                    top: "2px",
                    paddingTop: "1px",
                    marginBottom: "14px",
                    lineHeight: 0,
                    fontSize: "13px",
                    color: "#111",
                    WebkitTextSizeAdjust: "100%",

                    "&::after": {
                      content: '""',
                      width: "100%",
                      backgroundColor: "transparent",
                      display: "block",
                      height: "1px",
                      borderTop: "1px solid #e7e7e7",
                      position: "absolute",
                      top: "50%",
                      marginTop: "-1px",
                      zIndex: 1,
                    },
                  }}
                >
                  <Box
                    component="h5"
                    sx={{
                      lineHeight: 1,
                      fontSize: "12px",
                      color: "#767676",
                      fontWeight: 400,
                      zIndex: 2,
                      position: "relative",
                      display: "inline-block",
                      backgroundColor: "#fff",
                      padding: "0 8px 0 7px",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Nouveau chez Dimapromo
                  </Box>
                </Box>
                <Box
                  component="span"
                  sx={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",

                    background: "#FFF",
                    borderColor: "#D5D9D9",
                    width: "100%!important",

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
                    color: "#111",
                    WebkitTextSizeAdjust: "100%",
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
                      cursor: "pointer",
                      textAlign: "center",
                      fontSize: "13px",
                      lineHeight: "19px",
                      color: "#111",
                    }}
                  >
                    <Box
                      //component="a"
                      component="button"
                      disabled={
                        isLoading ||
                        canSignIn ||
                        isSubmitting ||
                        //||
                        // getUserEmailIsLoading
                        isNavSignIn
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        /* router.push({
                          //pathname: "/signUpForm",
                          pathname: "/auth/signup",
                        });*/
                        handleNavSignUp();
                      }}
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
                        margin: 0,
                        outline: 0,
                        padding: "0 10px 0 11px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        cursor: "pointer",

                        ":-webkit-any-link": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      Créer votre compte Dimapromo
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/*
            {(isNavSignUp || isNavForgotPswd || IsNavHome) && (
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
                  backgroundColor:
                    "rgba(255, 255, 255, 0.8); /* Add a semi-transparent background to dim the page behind the spinner",
                  zIndex: "9999",
                }}
              >
                <CircularProgress size={40} />
              </Box>
            )} */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
