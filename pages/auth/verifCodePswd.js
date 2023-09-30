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
//
import { useVerifyResetCodeMutation } from "../../redux/features/api/apiSlice";
import { useGenerateResetCodeMutation } from "../../redux/features/api/apiSlice";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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

export const VerifCodePswd = () => {
  const router = useRouter();
  const { email } = router.query;

  const [isNavChangePswd, setisNavChangePswd] = useState(false);
  const [isResetPswdCode, setIsResetPswdCode] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ForgotPasswordSchema = yup.object().shape({
    resetPswdCode: yup
      .string("Votre code est invalide")
      //.matches(/^[a-zA-Z0-9]{6,10}$/, "Le code saisi est invalide")
      .matches(/^[0-9]{6}$/, "Le code saisi est invalide")
      .required("Veuillez saisir un code")
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    //getValues,
    // trigger,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    mode: "onBlur",
    // mode: "onChange",
    reValidateMode: "onBlur",
    // reValidateMode: "onChange",
    //shouldFocusError: true,
  });

  // const resetCode = getValues("resetPswdCode");

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
    verifyResetCode,
    {
      data: verifyResetCodeData,
      isLoading: verifyResetCodeIsLoading,
      isSuccess: verifyResetCodeIsSuccess,
      error: verifyResetCodeError,
      //isError: verifyResetCodeIsError,
      isError: resetCodeIsError,
    },
  ] = useVerifyResetCodeMutation();

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

  function CustCheckCircleOutlineIcon(props) {
    return (
      <SvgIcon {...props}>
        <CheckCircleOutlineIcon />
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

  const handleResendCode = async (e) => {
    e.preventDefault();

    setIsResendingCode(true);

    try {
      // Call the generateResetCode mutation using await
      const data = await generateResetCode({ email: email }).unwrap();
      //setValue("resetPswdCode", "");

      if (
        generateResetCodeIsSuccess ||
        data?.message.includes("Reset code sent successfully.")
      ) {
        setValue("resetPswdCode", "");
      }
    } catch (err) {
      console.error("Un probleme est survenu pour renvoyer votre code: ", err);
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleNavChangePswd = async (resetPswdCode) => {
    setisNavChangePswd(true);

    try {
      await router.push({
        pathname: "/auth/changePassword",
        query: {
          email: email,
          resetCode: resetPswdCode,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setisNavChangePswd(false);
    }
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let resetPswdCode = data.resetPswdCode;

    setIsResetPswdCode(true);

    const canVerifyCodePswd = [email, resetPswdCode].every(Boolean);
    if (canVerifyCodePswd) {
      try {
        const data = await verifyResetCode({
          email: email,
          resetCode: resetPswdCode,
        }).unwrap();

        if (
          !resetCodeIsError ||
          data?.message.includes("Reset code is valid")
        ) {
          await handleNavChangePswd(resetPswdCode);
          // } else {
          //  console.log("On submit - reset code none valid:", resetCodeIsError);
        }
      } catch (err) {
        console.error("Reset code non valide : ", err);
      } finally {
        setIsResetPswdCode(false);
      }
    }
  };

  return (
    <Box>
      {(isLoading || isResendingCode) && !isResetPswdCode && !isSubmitting && (
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
          color: "#0F1111",
          fontSize: "14px",
          lineHeight: "20px",
        }}
      >
        <Box
          sx={{
            padding: "14px 18px!important",
            marginBottom: "0!important",
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
                marginBottom: "16px!important",
              }}
            >
              <Box
                // component="a"
                component="button"
                tabIndex="-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavHome();
                }}
                disabled={isLoading || isResetPswdCode || isSubmitting}
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#007185",
                  },

                  textDecoration: "none",
                  color: "#007185",

                  cursor: "pointer",

                  cursor: "pointer",
                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  textAlign: "center!important",
                  fontSize: "14px",
                  lineHeight: "20px",
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
                    // WebkitBackgroundSize: "512px 256px",
                    // backgroundSize: "512px 256px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                    verticalAlign: "top",
                  }}
                ></Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            marginBottom: "22px",
            color: "#0F1111",
            fontSize: "14px",
            lineHeight: "20px",
          }}
        >
          <Box
            sx={{
              "&:last-child": {
                marginBottom: 0,
              },
              width: "27em!important",
              marginLeft: "auto",
              marginRight: "auto",
              color: "#0F1111",
              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            <Box
              sx={{
                "&:last-child": {
                  marginBottom: 0,
                },
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <Box
                sx={{
                  "&:last-child": {
                    marginBottom: 0,
                  },
                  color: "#0F1111",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    border: "1px #D5D9D9 solid",
                    color: "#0F1111",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "8px",
                      position: "relative",
                      padding: "20px 26px!important",
                      color: "#0F1111",
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: "0!important",
                        width: "100%",
                        color: "#0F1111",
                        fontSize: "14px",
                        lineHeight: "20px",

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
                        component="form"
                        id="verification-code"
                        method="post"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                          marginBottom: "0!important",
                        }}
                      >
                        <Box
                          sx={{
                            marginBottom: "8px!important",
                            width: "100%",
                            color: "#0F1111",
                            fontSize: "14px",
                            lineHeight: "20px",

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
                              marginBottom: "8px!important",
                              width: "100%",
                              color: "#0F1111",
                              fontSize: "14px",
                              lineHeight: "20px",

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
                              component="h1"
                              sx={{
                                "&:last-child": {
                                  marginBottom: 0,
                                },

                                fontWeight: 400,
                                fontSize: "28px",
                                lineHeight: "36px",
                                textRendering: "optimizeLegibility",
                                color: "#0F1111",
                              }}
                            >
                              Vérifier votre identité
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              marginBottom: "0!important",
                              width: "100%",
                              color: "#0F1111",
                              fontSize: "14px",
                              lineHeight: "20px",

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
                                color: "#0F1111",
                                fontSize: "14px",
                                lineHeight: "20px",
                              }}
                            >
                              Pour changer votre mot de passe Cette étape de
                              vérification est obligatoire.
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                color: "#0F1111",
                                fontSize: "14px",
                                lineHeight: "20px",
                              }}
                            >
                              &nbsp;Nous avons envoyé un code par e-mail sur
                              &nbsp;
                              {email}
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                color: "#0F1111",
                                fontSize: "14px",
                                lineHeight: "20px",
                              }}
                            >
                              &nbsp;Veuillez saisir le code.
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            marginBottom: "8px!important",
                            width: "100%",
                            color: "#0F1111",
                            fontSize: "14px",
                            lineHeight: "20px",

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
                              fontWeight: 700,
                              marginBottom: "4px!important",
                              width: "100%",
                              color: "#0F1111",
                              fontSize: "14px",
                              lineHeight: "20px",

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
                            Saisir un code
                          </Box>
                          <Box
                            sx={{
                              marginBottom: "0!important",
                              width: "100%",
                              color: "#0F1111",
                              fontSize: "14px",
                              lineHeight: "20px",

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
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                color: "#0F1111",
                                fontSize: "14px",
                                lineHeight: "20px",
                              }}
                            >
                              <Box
                                component="input"
                                type="text"
                                maxlength="6"
                                required=""
                                id="resetPswdCode"
                                autocomplete="off"
                                name="resetPswdCode"
                                aria-label=""
                                disabled={
                                  isResetPswdCode ||
                                  verifyResetCodeIsLoading ||
                                  isNavChangePswd ||
                                  isSubmitting ||
                                  isLoading
                                }
                                {...register("resetPswdCode")}
                                sx={{
                                  width: "100%",
                                  marginRight: 0,
                                  backgroundColor: "#fff",
                                  height: "31px",
                                  padding: "3px 7px",
                                  lineHeight: "normal",

                                  // border: "1px solid #888C8C",
                                  border:
                                    errors.resetPswdCode || resetCodeIsError
                                      ? "1px solid #e0103a"
                                      : "1px solid #888C8C",
                                  borderColor:
                                    errors.resetPswdCode || resetCodeIsError
                                      ? "1px solid #e0103a"
                                      : "1px solid #888C8C",
                                  borderRadius: "3px",
                                  boxShadow:
                                    "0 1px 2px rgba(15,17,17,.15) inset",
                                  outline: 0,

                                  WebkitTransition: "all .1s linear",
                                  transition: "all .1s linear",
                                  //color: "#0F1111",
                                  color:
                                    errors.resetPswdCode || resetCodeIsError
                                      ? "#e0103a"
                                      : "#0F1111",
                                  margin: 0,
                                  fontSize: "100%",
                                  verticalAlign: "middle",
                                  ///////
                                  "&:focus": {
                                    /* backgroundColor: "#F7FEFF",
                                  borderColor: "#007185",
                                  boxShadow:
                                    "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",*/
                                    //borderTopColor: 0,

                                    backgroundColor:
                                      errors.resetPswdCode || resetCodeIsError
                                        ? "none"
                                        : "#F7FEFF",

                                    borderColor:
                                      errors.resetPswdCode || resetCodeIsError
                                        ? "none"
                                        : "#007185",
                                    boxShadow:
                                      errors.resetPswdCode || resetCodeIsError
                                        ? "none"
                                        : "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                                  },
                                }}
                              ></Box>
                            </Box>
                            {/* Add */}

                            {generateResetCodeIsSuccess && (
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
                                      color: "#067D62",
                                      borderRadius: 0,
                                      padding: 0,
                                      position: "relative",
                                      fontSize: "14px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    <CustCheckCircleOutlineIcon
                                      // color="action"
                                      fontSize="small"
                                      sx={{
                                        position: "absolute",
                                        left: "2px",
                                        top: "-1px",
                                        //top: "5px",
                                        display: "inline-block",
                                        verticalAlign: "top",
                                      }}
                                    />
                                    <Box
                                      sx={{
                                        marginBottom: 0,
                                        textAlign: "left",
                                        fontSize: "12px",
                                        lineHeight: "15px",
                                        color: "#067D62",
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
                                          color: "#067D62",
                                          //
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Un nouveau code a été envoyé à votre
                                        adresse e-mail.
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            )}
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
                                      color: "#067D62",
                                      borderRadius: 0,
                                      padding: 0,
                                      position: "relative",
                                      fontSize: "14px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    {/*
                                    <CustCheckCircleOutlineIcon
                                      // color="action"
                                      fontSize="small"
                                      sx={{
                                        position: "absolute",
                                        left: "2px",
                                        top: "-1px",
                                        //top: "5px",
                                        display: "inline-block",
                                        verticalAlign: "top",
                                      }}
                                    /> */}
                                    <Box
                                      sx={{
                                        marginBottom: 0,
                                        textAlign: "left",
                                        fontSize: "12px",
                                        lineHeight: "15px",
                                        color: "#067D62",
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
                                          color: "#067D62",
                                          //
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Un problème est survenu pour envoyer un
                                        code à votre adresse e-mail.
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            )}
                            {errors.resetPswdCode && (
                              <Box
                                sx={{
                                  borderRadius: "8px",
                                  //  display: "none",
                                  border: "none",
                                  verticalAlign: "middle",
                                  backgroundColor: "transparent",
                                  marginTop: "6px!important",
                                  fontSize: "13px",
                                  lineHeight: "19px",
                                  color: "#111",
                                  //
                                  display: "block",
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
                                    {errors.resetPswdCode?.message}
                                  </Box>
                                </Box>
                              </Box>
                            )}
                            {resetCodeIsError && (
                              <Box
                                sx={{
                                  borderRadius: "8px",
                                  //  display: "none",
                                  border: "none",
                                  verticalAlign: "middle",
                                  backgroundColor: "transparent",
                                  marginTop: "6px!important",
                                  fontSize: "13px",
                                  lineHeight: "19px",
                                  color: "#111",
                                  //
                                  display: "block",
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
                                    Code non valide. Veuillez saisir un code
                                    valide.
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            marginBottom: "8px!important",
                            width: "100%",
                            color: "#0F1111",
                            fontSize: "14px",
                            lineHeight: "20px",
                            WebkitTextSizeAdjust: "100%",

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
                              borderRadius: "8px",
                              boxShadow: "0 2px 5px 0 rgba(213,217,217,.5)",
                              width: "100%!important",
                              // background: "#FFD814",
                              // borderColor: "#FCD200",
                              background:
                                isResetPswdCode ||
                                verifyResetCodeIsLoading ||
                                isNavChangePswd ||
                                isSubmitting
                                  ? "#e7e9ec"
                                  : "#FFD814",
                              borderColor:
                                isResetPswdCode ||
                                verifyResetCodeIsLoading ||
                                isNavChangePswd ||
                                isSubmitting
                                  ? "#8d9096"
                                  : "#FCD200",

                              borderStyle: "solid",
                              borderWidth: "1px",
                              cursor: "pointer",
                              display: "inline-block",
                              padding: 0,
                              textAlign: "center",
                              textDecoration: "none!important",
                              verticalAlign: "middle",
                              color: "#0F1111",
                              fontSize: "14px",
                              lineHeight: "20px",
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
                                color: "#0F1111",
                                fontSize: "14px",
                                lineHeight: "20px",
                              }}
                            >
                              <Box
                                // component="input"
                                component="button"
                                type="submit"
                                disabled={
                                  isResetPswdCode ||
                                  verifyResetCodeIsLoading ||
                                  isNavChangePswd ||
                                  isSubmitting ||
                                  isLoading
                                }
                                sx={{
                                  cursor: "pointer",
                                  WebkitAppearance: "button",
                                  position: "absolute",
                                  backgroundColor: "transparent",
                                  color: "transparent",
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

                              {isResetPswdCode ||
                              verifyResetCodeIsLoading ||
                              isNavChangePswd ||
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
                        <Box
                          sx={{
                            textAlign: "center!important",
                            marginTop: "24px!important",
                            marginBottom: "0!important",
                            color: "#0F1111",
                            fontSize: "14px",
                            lineHeight: "20px",
                          }}
                        >
                          <Box
                            //component="a"
                            component="button"
                            onClick={handleResendCode}
                            disabled={
                              isResetPswdCode ||
                              isSubmitting ||
                              isResendingCode ||
                              generateResetCodeIsLoading ||
                              isLoading
                            }
                            sx={{
                              ":link": {
                                textDecoration: "none",
                                color: "#007185",
                              },

                              ":hover": {
                                textDecoration: "underline",
                                //color: "#007185",
                                color: "#C7511F",
                              },

                              textDecoration: "none",
                              color: "#007185",

                              cursor: "pointer",
                              ":-webkit-any-link": {
                                cursor: "pointer",
                              },

                              textAlign: "center!important",
                              fontSize: "14px",
                              lineHeight: "20px",
                              //
                              backgroundColor: "transparent",
                              border: "none",
                              outline: 0,
                            }}
                          >
                            Renvoyer le code
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

        <Box
          sx={{
            color: "#0F1111",
            fontSize: "14px",
            lineHeight: "20px",
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

              color: "#0F1111",
              fontSize: "14px",
              lineHeight: "20px",

              "&::after, &::before": {
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
            "&:last-child": {
              marginBottom: 0,
            },

            //  marginTop: "26px!important",
          }}
        >
          <Box
            sx={{
              textAlign: "center!important",
              marginBottom: "8px!important",
              fontSize: "14px",
              lineHeight: "20px",
              color: "#0F1111",
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "20px",
                textAlign: "center!important",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#0F1111",
              }}
            ></Box>
            <Box
              component="a"
              //href="/gp/help/customer/display.html/ref=ap_desktop_footer_cou?ie=UTF8&amp;nodeId=548524"
              sx={{
                ":link": {
                  textDecoration: "none",
                  color: "#007185;",
                },

                textDecoration: "none",
                color: "#007185;",

                cursor: "pointer",

                ":-webkit-any-link": {
                  cursor: "pointer",
                },

                fontSize: "14px",
                lineHeight: "20px",
                textAlign: "center!important",
              }}
            >
              Conditions d'utilisation
            </Box>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: "20px",
                textAlign: "center!important",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#0F1111",
              }}
            ></Box>
            <Box
              component="a"
              //href="/gp/help/customer/display.html/ref=ap_desktop_footer_privacy_notice?ie=UTF8&amp;nodeId=3329781"
              sx={{
                ":link": {
                  textDecoration: "none",
                  color: "#007185;",
                },

                textDecoration: "none",
                color: "#007185;",

                cursor: "pointer",

                ":-webkit-any-link": {
                  cursor: "pointer",
                },

                fontSize: "14px",
                lineHeight: "20px",
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
                textAlign: "center!important",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#0F1111",
              }}
            ></Box>
            <Box
              component="a"
              //href="/help"
              sx={{
                ":link": {
                  textDecoration: "none",
                  color: "#007185;",
                },

                textDecoration: "none",
                color: "#007185;",

                cursor: "pointer",

                ":-webkit-any-link": {
                  cursor: "pointer",
                },

                fontSize: "14px",
                lineHeight: "20px",
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
                textAlign: "center!important",
                fontSize: "14px",
                lineHeight: "20px",
                color: "#0F1111",
              }}
            ></Box>
            <Box
              component="a"
              //href="/gp/help/customer/display.html/?nodeId=201890250"
              sx={{
                ":link": {
                  textDecoration: "none",
                  color: "#007185;",
                },

                textDecoration: "none",
                color: "#007185;",

                cursor: "pointer",

                ":-webkit-any-link": {
                  cursor: "pointer",
                },

                fontSize: "14px",
                lineHeight: "20px",
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
              fontSize: "14px",
              lineHeight: "20px",
              color: "#0F1111",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#565959!important",
                fontSize: "12px!important",
                lineHeight: "16px!important",
                textAlign: "center!important",
              }}
            >
              © 1996-2023, Dimapromo. ou ses affiliés
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifCodePswd;
