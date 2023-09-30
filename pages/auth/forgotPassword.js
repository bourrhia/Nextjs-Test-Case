import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SvgIcon from "@mui/material/SvgIcon";
import { IconButton } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
//import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import { useGenerateResetCodeMutation } from "../../redux/features/api/apiSlice";

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

export const ForgotPassword = () => {
  const router = useRouter();
  const { email } = router.query;
  const [isNavCodePswd, setisNavCodePswd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetCodePswd, setIsResetCodePswd] = useState(false);

  const ForgotPasswordSchema = yup.object().shape({
    emailOrMobile: yup
      .string()
      .required(
        "Saisissez votre adresse e-mail ou numéro de téléphone portable"
      )
      .test(
        "emailOrMobile",
        "Adresse e-mail ou numéro de téléphone portable incorrect ou invalide.",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
          //const phoneRegex = /^\d{10,14}$/;
          // const phoneRegex = /^\+(?:[0-9] ?){9,14}[0-9]$/;
          const phoneRegex =
            /^(?:(?:\+|00)212[\s.-]?)[1-9](?:[\s.-]?[0-9]){8}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
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
    defaultValues: {
      emailOrMobile: email,
    },
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onBlur",
    // mode: "onChange",
    reValidateMode: "onBlur",
    // reValidateMode: "onChange",
    //shouldFocusError: true,
  });

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
    generateResetCode,
    {
      data: generateResetCodeData,
      isLoading: generateResetCodeIsLoading,
      isSuccess: generateResetCodeIsSuccess,
      error: generateResetCodeError,
      isError: generateResetCodeIsError,
    },
  ] = useGenerateResetCodeMutation();

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

  const handleNavCodePswd = async () => {
    setisNavCodePswd(true);

    try {
      await router.push({
        pathname: "/auth/verifCodePswd",
        query: {
          email: email,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setisNavCodePswd(false);
    }
  };

  async function generateResetCodePswd(vemail) {
    try {
      // Call the generateResetCode mutation using await
      const data = await generateResetCode({ email: vemail }).unwrap();
      //console.log("Result generating reset code:", data);

      if (
        generateResetCodeIsSuccess ||
        data?.message.includes("Reset code sent successfully.")
      ) {
        await handleNavCodePswd();
      }
    } catch (error) {
      // Handle errors here
      console.error("Error generating reset code:", error);
    }
  }

  const onSubmit = async (data, event) => {
    event.preventDefault();
    let email = data.emailOrMobile;

    setIsResetCodePswd(true);
    try {
      if (email) {
        await generateResetCodePswd(email);
      }
    } catch (error) {
      setMessage("Error sending reset code. Please try again later.");
    } finally {
      setIsResetCodePswd(false);
    }
  };

  return (
    <Box>
      {isLoading &&
        !isNavCodePswd &&
        !generateResetCodeIsLoading &&
        !isResetCodePswd &&
        !isSubmitting && (
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
                tabIndex="-1"
                // href="/ref=ap_frn_logo"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavHome();
                }}
                disabled={
                  isLoading ||
                  isNavCodePswd ||
                  generateResetCodeIsLoading ||
                  isResetCodePswd ||
                  isSubmitting
                }
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  textDecoration: "none",
                  color: "#0066c0",

                  cursor: "pointer",

                  cursor: "pointer",
                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  textAlign: "center!important",
                  fontSize: "13px",
                  lineHeight: "19px",
                  //
                  backgroundColor: "transparent",
                  border: "none",
                  outline: 0,
                }}
              >
                <Box
                  component="i"
                  role="img"
                  aria-label="Dimapromo"
                  sx={{
                    // backgroundImage:
                    // "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                    backgroundImage: "url(/logodimapromo.svg)",
                    //backgroundPosition: "-5px -130px",
                    // height: "31px",
                    // width: "103px",
                    height: "48px",
                    width: "130px",
                    //WebkitBackgroundSize: "400px 750px",
                    //backgroundSize: "400px 750px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                    verticalAlign: "top",
                  }}
                ></Box>
                {/* <Box
                component="i"
                role="presentation"
                sx={{
                  backgroundImage:
                    "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                  width: "12px",
                  backgroundPosition: "-127px -200px",
                  height: "28px",
                  WebkitBackgroundSize: "400px 750px",
                  backgroundSize: "400px 750px",
                  backgroundRepeat: "no-repeat",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
              ></Box> */}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "700px",
              margin: "auto",
              fontSize: "13px",
              lineHeight: "19px",
              color: "#111",
            }}
          >
            <Box
              sx={{
                marginTop: "10px",

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

                        WebkitBackgroundSize: "400px 750px",
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
                          // href="/gp/help/customer/display.html/ref=ap_cookie_error_help?"
                          sx={{
                            ":link": {
                              textDecoration: "underline",
                              color: "#0066c0",
                            },

                            cursor: "pointer",
                            ":-webkit-any-link": {
                              cursor: "pointer",
                            },

                            color: "#0066c0",
                            cursor: "pointer",
                          }}
                        ></Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: "350px",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{
                    marginBottom: "44px!important",
                    fontSize: "13px",
                    lineHeight: "19px",
                    color: "#111",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "8px",
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
                        position: "relative",
                        padding: "20px 26px!important",
                        fontSize: "13px",
                        lineHeight: "19px",
                        color: "#111",
                      }}
                    >
                      <Box
                        component="form"
                        name="forgotPassword"
                        method="post"
                        novalidate=""
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                          marginBottom: "0!important",
                        }}
                      >
                        <Box
                          component="h1"
                          sx={{
                            fontWeight: 400,
                            fontSize: "28px",
                            lineHeight: 1.2,
                          }}
                        >
                          Aide avec le mot de passe
                        </Box>
                        <Box
                          sx={{
                            marginBottom: "22px!important",
                            fontSize: "13px",
                            lineHeight: "19px",
                            color: "#111",
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
                              fontSize: "13px",
                              lineHeight: "19px",
                              //color: "#111",
                              color: errors.emailOrMobile ? "#e0103a" : "#111",
                            }}
                          >
                            Adresse e-mail ou numéro de téléphone portable
                          </Box>
                          <Box
                            component="input"
                            type="email"
                            maxlength="128"
                            //value="bourrhiamostafa@yahoo.com"
                            id="emailOrMobile"
                            name="emailOrMobile"
                            tabIndex="1"
                            {...register("emailOrMobile")}
                            defaultValue=""
                            disabled={
                              isLoading ||
                              isNavCodePswd ||
                              generateResetCodeIsLoading ||
                              isResetCodePswd ||
                              isSubmitting
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
                              // borderTopColor: "#949494",
                              borderTopColor: errors.emailOrMobile
                                ? "1px solid #e0103a"
                                : "1px solid #949494",
                              borderRadius: "3px",
                              boxShadow:
                                "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset",
                              outline: 0,
                              width: "100%",
                              marginRight: 0,
                              WebkitTransition: "all .1s linear",
                              transition: "all .1s linear",
                              margin: 0,
                              fontSize: "100%",
                              verticalAlign: "middle",

                              "&:focus": {
                                backgroundColor: errors.firstName
                                  ? "none"
                                  : "#F7FEFF",

                                borderColor: errors.firstName
                                  ? "none"
                                  : "#007185",
                                boxShadow: errors.firstName
                                  ? "none"
                                  : "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                              },
                            }}
                          ></Box>

                          {generateResetCodeIsError && (
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
                                      Un problème est survenu pour générer un
                                      code pour changer le mot de passe.
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          )}

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
                            </Box>
                          )}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",

                            // background: "#FFD814",
                            // borderColor: "#FCD200",
                            background:
                              isNavCodePswd ||
                              generateResetCodeIsLoading ||
                              isResetCodePswd ||
                              isSubmitting
                                ? "#e7e9ec"
                                : "#FFD814",
                            borderColor:
                              isNavCodePswd ||
                              generateResetCodeIsLoading ||
                              isResetCodePswd ||
                              isSubmitting
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
                              tabIndex="3"
                              type="submit"
                              disabled={
                                isLoading ||
                                isNavCodePswd ||
                                generateResetCodeIsLoading ||
                                isResetCodePswd ||
                                isSubmitting
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

                            {isNavCodePswd ||
                            generateResetCodeIsLoading ||
                            isResetCodePswd ||
                            isSubmitting ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Box
                                component="span"
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
                                }}
                              >
                                Continuer
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
          <Box
            sx={{
              "&:last-child": {
                marginBottom: 0,
              },

              marginTop: "26px!important",
            }}
          >
            <Box
              sx={{
                fontSize: "13px",
                lineHeight: "19px",
                color: "#111",
              }}
            >
              <Box
                sx={{
                  height: "44px",
                  marginBottom: "-18px",
                  background:
                    "-webkit-linear-gradient(to bottom,rgba(0,0,0,.14),rgba(0,0,0,.03) 3px,transparent)",
                  background:
                    "linear-gradient(to bottom,rgba(0,0,0,.14),rgba(0,0,0,.03) 3px,transparent)",
                  zoom: 1,

                  "&::after": {
                    display: "block",
                    width: "100%",
                    height: "44px",
                    background:
                      "-webkit-linear-gradient(to right,#fff,rgba(255,255,255,0),#fff)",
                    background:
                      "linear-gradient(to right,#fff,rgba(255,255,255,0),#fff)",
                    content: '""',
                  },
                }}
              ></Box>
            </Box>
            <Box
              sx={{
                fontSize: "11px!important",
                lineHeight: "1.465!important",
                textAlign: "center!important",
                marginBottom: "10px!important",
                color: "#111",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "20px",
                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                  color: "#111",
                }}
              ></Box>
              <Box
                component="a"
                //href="/gp/help/customer/display.html/ref=ap_desktop_footer_cou?ie=UTF8&amp;nodeId=548524"
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  textDecoration: "none",
                  color: "#0066c0",

                  cursor: "pointer",

                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                }}
              >
                Conditions d&rsquo;utilisation
              </Box>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "20px",
                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                  color: "#111",
                }}
              ></Box>
              <Box
                component="a"
                //href="/gp/help/customer/display.html/ref=ap_desktop_footer_privacy_notice?ie=UTF8&amp;nodeId=3329781"
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  textDecoration: "none",
                  color: "#0066c0",

                  cursor: "pointer",

                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                }}
              >
                Protection de vos informations personnelles
              </Box>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "20px",
                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                  color: "#111",
                }}
              ></Box>
              <Box
                component="a"
                //href="/help"
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  textDecoration: "none",
                  color: "#0066c0",

                  cursor: "pointer",

                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                }}
              >
                Aide
              </Box>
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: "20px",
                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                  color: "#111",
                }}
              ></Box>
              <Box
                component="a"
                //href="/gp/help/customer/display.html/?nodeId=201890250"
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  textDecoration: "none",
                  color: "#0066c0",

                  cursor: "pointer",

                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  textAlign: "center!important",
                }}
              >
                Cookies
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: "center!important",
                marginBottom: "0!important",
                fontSize: "13px",
                lineHeight: "19px",
                color: "#111",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: "11px!important",
                  lineHeight: "1.465!important",
                  color: "#555!important",
                  textAlign: "center!important",
                }}
              >
                © 1996-2023, Dimapromo. ou ses affiliés
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
