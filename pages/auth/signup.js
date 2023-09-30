//import React, { useState } from "react";
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useTransition,
} from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import SvgIcon from "@mui/material/SvgIcon";
import { IconButton } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { signIn } from "next-auth/react";
import { useGetUserByEmailQuery } from "../../redux/features/api/apiSlice";
import { useAddUserSignUpMutation } from "../../redux/features/api/apiSlice";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//import IconButton from "@mui/material/IconButton";

export const SignUpForm = () => {
  const sessionData = useSession();
  //const session = sessionData[0];
  //const loading = sessionData[1];
  const router = useRouter();

  //const [isPending, startTransition] = useTransition();
  //const [isNavAuthForm, setisNavAuthForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isNavVerifyRequest, setIsNavVerifyRequest] = useState(false);
  const [isSignInError, setIsSignInError] = useState(false);

  //const isLoadingEmailVerif = useRef(false);
  //const userByEmailExist = useRef(false);

  const signUpSchema = yup.object().shape({
    firstName: yup
      .string("Le prénom doit être une chaîne de caractères")
      .max(25, "Le prénom a un maximum de 25 caractères")
      .required("Veuillez saisir votre prénom")
      .nullable(),
    lastName: yup
      .string("Le nom doit être une chaîne de caractères")
      .max(25, "Le nom a un maximum de 25 caractères")
      .required("Veuillez saisir votre nom")
      .nullable(),
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

          const phoneRegex =
            /^(?:(?:\+|00)212[\s.-]?)[1-9](?:[\s.-]?[0-9]){8}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      )
      .nullable(),
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
      ),
    confirmMotPasse: yup
      .string()
      .required("Saisissez à nouveau votre mot de passe")
      .oneOf(
        [yup.ref("motDePasse"), null],
        "Les mots de passe ne correspondent pas"
      )
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    // watch,
    //getValues,
    // control,
    // trigger,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
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
    addUserSignUp,
    {
      data: updUserData,
      isLoading: updUserIsLoading,
      isSuccess: userSignUpIsSuccess,
      error: userSignUpError,
      isError: userSignUpIsError,
    },
  ] = useAddUserSignUpMutation();

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

  const handleNavAuthForm = async () => {
    // setisNavAuthForm(true);

    try {
      await router.push({
        pathname: "/auth/authForm",
        /* query: {
          email: email,
        },*/
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      //  setisNavAuthForm(false);
    }
  };

  const handleNavVerifyRequest = async (email) => {
    setIsNavVerifyRequest(true);
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
      setIsNavVerifyRequest(false);
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

  async function emailAccountExist(errorMsg, email, nom, prenom, password) {
    // userByEmailExist.current = true;

    try {
      await router.push({
        pathname: "/auth/accountExist",
        query: {
          errorMsg: errorMsg,
          email: email,
          nom: nom,
          prenom: prenom,
          password: password,
        },
      });
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      // userByEmailExist.current = false;
    }
  }

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let email = data.emailOrMobile;
    let prenom = data.firstName;
    let nom = data.lastName;
    let password = data.motDePasse;

    const canSingUp = [email, nom, prenom, password].every(Boolean);
    if (canSingUp) {
      setIsSigningUp(true);
      try {
        const response = await addUserSignUp({
          email,
          nom,
          prenom,
          password,
        }).unwrap();

        if (
          userSignUpIsSuccess ||
          response?.message.includes("User added successfully")
        ) {
          await initiateEmailVerification(email);
          setValue("emailOrMobile", "");
          setValue("lastName", "");
          setValue("firstName", "");
          setValue("motDePasse", "");
        }

        // await initiateEmailVerification(email);
        //await handleNavVerifyRequest(email);
        /* setValue("emailOrMobile", "");
        setValue("lastName", "");
        setValue("firstName", "");
        setValue("motDePasse", "");*/
      } catch (err) {
        console.error("Un probleme est survenu pour signing up: ", err);
        if (err.status === 422) {
          if (err?.data.message.includes("User found")) {
            const message = "L'adresse e-mail est déjà associée à un compte";
            await emailAccountExist(message, email, nom, prenom, password);
          }
        }
      } finally {
        setIsSigningUp(false);
      }
    }
  };

  return (
    <Box>
      {isLoading && !updUserIsLoading && !isSubmitting && !isSigningUp && (
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
          fontSize: "13px",
          lineHeight: "19px",
          color: "#111",
          WebkitTextSizeAdjust: "100%",
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
                onClick={(e) => {
                  e.preventDefault();
                  handleNavHome();
                }}
                disabled={
                  isLoading || isSigningUp || updUserIsLoading || isSubmitting
                }
                sx={{
                  ":link": {
                    textDecoration: "none",
                    color: "#0066c0",
                  },

                  cursor: "pointer",
                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },

                  textAlign: "center!important",
                  fontSize: "13px",
                  lineHeight: "19px",
                  WebkitTextSizeAdjust: "100%",
                  //
                  //  width: "103px",
                  // height: "31px",
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
                    backgroundImage: "url(/logodimapromo.svg)",
                    width: "103px",
                    height: "31px",
                    // backgroundPosition: "-5px -130px",
                    // WebkitBackgroundSize: "400px 750px",
                    //  backgroundSize: "400px 750px",
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
                  fontStyle: "italic",
                  fontSize: "13px",
                  lineHeight: "19px",
                }}
              ></Box>  */}
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

              {userSignUpIsError ||
                (isSignInError && (
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
                            }}
                          ></Box>
                          <Box>
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
                                  pour créer un compte
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}

              <Box
                sx={{
                  width: "350px",
                  margin: "0 auto",
                }}
              >
                <Box
                  sx={{
                    marginBottom: "22px",
                  }}
                >
                  <Box
                    component="form"
                    id="register_form"
                    name="register"
                    method="post"
                    novalidate=""
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                      marginBottom: "14px",
                      fontSize: "13px",
                      lineHeight: "19px",
                      color: "#111",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "8px",
                        marginBottom: "26px!important",
                        display: "block",
                        border: "1px #ddd solid",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "8px",
                          position: "relative",
                          padding: "14px 18px",
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
                          Créer un compte
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
                            component="label"
                            for="firstName"
                            sx={{
                              display: "block",
                              paddingLeft: "2px",
                              paddingBottom: "2px",
                              fontWeight: 700,
                              fontSize: "13px",
                              lineHeight: "19px",
                              //color: "#111",
                              color: errors.firstName ? "#e0103a" : "#111",
                            }}
                          >
                            Votre prénom
                          </Box>
                          <Box
                            component="input"
                            type="text"
                            maxlength="63"
                            id="firstName"
                            placeholder="Prénom"
                            data-required="true"
                            aria-required="true"
                            aria-invalid="false"
                            autocomplete="on"
                            tabIndex="1"
                            //disabled={isSubmitting}
                            disabled={
                              // isPending ||
                              updUserIsLoading ||
                              //userByEmailExist.current ||
                              // isLoadingEmailVerif.current ||
                              isSubmitting ||
                              isLoading ||
                              isSigningUp
                            }
                            {...register("firstName")}
                            sx={{
                              //animationName: "onAutoFillChanged",
                              width: "100%",
                              marginRight: 0,
                              //color: "#0F1111",
                              color: errors.firstName ? "#e0103a" : "#0F1111",
                              backgroundColor: "#fff",
                              height: "31px",
                              padding: "3px 7px",
                              lineHeight: "normal",
                              // border: 0,

                              //border: "1px solid #a6a6a6",

                              border: errors.firstName
                                ? "1px solid #e0103a"
                                : "1px solid #a6a6a6",
                              borderColor: errors.firstName
                                ? "1px solid #e0103a"
                                : "1px solid #a6a6a6",

                              // borderTopColor: "#949494",
                              /* borderTopColor: errors.firstLastName
                              ? "#e0103a"
                              : "#949494",*/

                              borderRadius: "3px",
                              boxShadow:
                                "0 1px 0 rgba(255,255,255,.5) 0 1px 0 rgba(0,0,0,.07) inset",

                              outline: 0,
                              WebkitTransition: "all .1s linear",
                              transition: "all .1s linear",
                              margin: 0,
                              fontSize: "100%",
                              verticalAlign: "middle",

                              /*  "@keyframes onAutoFillChanged": {
                              from: {
                                dummy: "none",
                              },

                              to: {
                                dummy: "none",
                              },
                            },*/

                              "&:focus": {
                                /* backgroundColor: "#F7FEFF",
                              borderColor: "#007185",
                              boxShadow:
                                "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",*/
                                //borderTopColor: 0,

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

                          {errors.firstName && (
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
                                {/* <Box
                              component="i"
                              sx={{
                                height: "13px",
                                width: "14px",
                                position: "absolute",
                                left: "2px",
                                top: "2px",
                                backgroundPosition: "-141px -130px",

                                backgroundImage:
                                  "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                                WebkitBackgroundSize: "400px 750px",
                                backgroundSize: "400px 750px",
                                backgroundRepeat: "no-repeat",
                                display: "inline-block",
                                verticalAlign: "top",
                                color: "#c40000",
                              }}
                            ></Box> */}
                                <Box
                                  sx={{
                                    marginBottom: 0,
                                    textAlign: "left",
                                    fontSize: "12px",
                                    lineHeight: "15px",
                                    color: "#c40000",
                                  }}
                                >
                                  {errors.firstName?.message}
                                </Box>
                              </Box>
                            </Box>
                          )}
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
                            component="label"
                            for="lastName"
                            sx={{
                              display: "block",
                              paddingLeft: "2px",
                              paddingBottom: "2px",
                              fontWeight: 700,
                              fontSize: "13px",
                              lineHeight: "19px",
                              //color: "#111",
                              color: errors.lastName ? "#e0103a" : "#111",
                            }}
                          >
                            Votre nom
                          </Box>
                          <Box
                            component="input"
                            type="text"
                            maxlength="25"
                            id="lastName"
                            placeholder="Nom"
                            data-required="true"
                            aria-required="true"
                            aria-invalid="false"
                            autocomplete="on"
                            tabIndex="2"
                            //disabled={isSubmitting}
                            disabled={
                              // isPending ||
                              updUserIsLoading ||
                              // userByEmailExist.current ||
                              // isLoadingEmailVerif.current ||
                              isSubmitting ||
                              isLoading ||
                              isSigningUp
                            }
                            {...register("lastName")}
                            sx={{
                              //animationName: "onAutoFillChanged",
                              width: "100%",
                              marginRight: 0,
                              //color: "#0F1111",
                              color: errors.lastName ? "#e0103a" : "#0F1111",
                              backgroundColor: "#fff",
                              height: "31px",
                              padding: "3px 7px",
                              lineHeight: "normal",
                              // border: 0,

                              //border: "1px solid #a6a6a6",

                              border: errors.lastName
                                ? "1px solid #e0103a"
                                : "1px solid #a6a6a6",
                              borderColor: errors.lastName
                                ? "1px solid #e0103a"
                                : "1px solid #a6a6a6",

                              // borderTopColor: "#949494",
                              /* borderTopColor: errors.firstLastName
                              ? "#e0103a"
                              : "#949494",*/

                              borderRadius: "3px",
                              boxShadow:
                                "0 1px 0 rgba(255,255,255,.5) 0 1px 0 rgba(0,0,0,.07) inset",

                              outline: 0,
                              WebkitTransition: "all .1s linear",
                              transition: "all .1s linear",
                              margin: 0,
                              fontSize: "100%",
                              verticalAlign: "middle",

                              /*  "@keyframes onAutoFillChanged": {
                              from: {
                                dummy: "none",
                              },

                              to: {
                                dummy: "none",
                              },
                            },*/

                              "&:focus": {
                                /* backgroundColor: "#F7FEFF",
                              borderColor: "#007185",
                              boxShadow:
                                "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",*/
                                //borderTopColor: 0,

                                backgroundColor: errors.lastName
                                  ? "none"
                                  : "#F7FEFF",

                                borderColor: errors.lastName
                                  ? "none"
                                  : "#007185",
                                boxShadow: errors.lastName
                                  ? "none"
                                  : "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                              },
                            }}
                          ></Box>

                          {errors.lastName && (
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
                                {/* <Box
                              component="i"
                              sx={{
                                height: "13px",
                                width: "14px",
                                position: "absolute",
                                left: "2px",
                                top: "2px",
                                backgroundPosition: "-141px -130px",

                                backgroundImage:
                                  "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                                WebkitBackgroundSize: "400px 750px",
                                backgroundSize: "400px 750px",
                                backgroundRepeat: "no-repeat",
                                display: "inline-block",
                                verticalAlign: "top",
                                color: "#c40000",
                              }}
                            ></Box> */}
                                <Box
                                  sx={{
                                    marginBottom: 0,
                                    textAlign: "left",
                                    fontSize: "12px",
                                    lineHeight: "15px",
                                    color: "#c40000",
                                  }}
                                >
                                  {errors.lastName?.message}
                                </Box>
                              </Box>
                            </Box>
                          )}
                        </Box>

                        <Box
                          component="label"
                          for="telOrEmail"
                          sx={{
                            display: "block",
                            paddingLeft: "2px",
                            paddingBottom: "2px",
                            fontWeight: 700,
                            fontSize: "13px",
                            lineHeight: "19px",
                            // color: "#111",
                            color: errors.emailOrMobile ? "#e0103a" : "#111",
                          }}
                        >
                          Numéro de téléphone portable ou adresse e-mail
                        </Box>
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
                              position: "relative",
                              marginBottom: "0!important",
                              fontSize: "13px",
                              lineHeight: "19px",
                              color: "#111",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                direction: "ltr!important",
                                fontSize: "13px",
                                lineHeight: "19px",
                                color: "#111",
                              }}
                            >
                              <Box
                                component="input"
                                type="email"
                                maxlength="64"
                                // id="emailOrMobile"
                                //autocomplete="emailOrPhone"
                                // name="emailOrMobile"
                                tabIndex="3"
                                //disabled={isSubmitting}
                                disabled={
                                  // isPending ||
                                  updUserIsLoading ||
                                  //userByEmailExist.current ||
                                  // isLoadingEmailVerif.current ||
                                  isSubmitting ||
                                  isLoading ||
                                  isSigningUp
                                }
                                {...register("emailOrMobile")}
                                defaultValue=""
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
                                // onBlur={() => trigger("emailOrMobile")}
                                sx={{
                                  paddingLeft: "55px",
                                  //animationName: 'onAutoFillChanged',
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
                                  marginBottom: "4px!important",
                                  width: "100%",
                                  marginRight: 0,
                                  WebkitTransition: "all .1s linear",
                                  transition: "all .1s linear",
                                  margin: 0,
                                  fontSize: "100%",
                                  verticalAlign: "middle",
                                  direction: "ltr!important",

                                  /*  "@keyframes onAutoFillChanged": {
                              from: {
                                dummy: "none",
                              },

                              to: {
                                dummy: "none",
                              },
                            },*/

                                  "&:focus": {
                                    /* backgroundColor: "#F7FEFF",
                              borderColor: "#007185",
                              boxShadow:
                                "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",*/
                                    //borderTopColor: 0,

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
                            </Box>
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                lineHeight: 2.5,
                                padding: "0 7px",
                                color: "#0066c0",

                                "&:last-child": {
                                  marginBottom: 0,
                                },

                                fontSize: "13px",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  lineHeight: 2.5,
                                  color: "#0066c0",
                                  fontSize: "13px",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    lineHeight: 2.5,
                                    color: "#0066c0",
                                    fontSize: "13px",
                                  }}
                                >
                                  {/* +212 */}
                                </Box>
                              </Box>
                            </Box>
                          </Box>

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
                            fontSize: "13px",
                            lineHeight: "19px",
                            color: "#111",
                          }}
                        >
                          <Box
                            sx={{
                              marginBottom: "14px!important",
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
                              //
                              position: "relative",
                            }}
                          >
                            <Box
                              component="label"
                              for="motDePasse"
                              sx={{
                                display: "block",
                                paddingLeft: "2px",
                                paddingBottom: "2px",
                                fontWeight: 700,
                                fontSize: "13px",
                                lineHeight: "19px",
                                // color: "#111",
                                color: errors.motDePasse ? "#e0103a" : "#111",
                              }}
                            >
                              Mot de passe
                            </Box>
                            <Box
                              component="input"
                              //type="password"
                              type={showPassword ? "text" : "password"}
                              maxlength="1024"
                              id="motDePasse"
                              autocomplete="off"
                              placeholder="Au moins 6&nbsp;caractères"
                              name="motDePasse"
                              tabIndex="4"
                              //disabled={isSubmitting}
                              disabled={
                                // isPending ||
                                updUserIsLoading ||
                                //userByEmailExist.current ||
                                // isLoadingEmailVerif.current ||
                                isSubmitting ||
                                isLoading ||
                                isSigningUp
                              }
                              {...register("motDePasse")}
                              sx={{
                                // animationName: "onAutoFillChanged",
                                width: "100%",
                                marginRight: 0,
                                // color: "#0F1111",
                                color: errors.motDePasse
                                  ? "#e0103a"
                                  : "#0F1111",
                                backgroundColor: "#fff",
                                height: "31px",
                                padding: "3px 7px",
                                lineHeight: "normal",
                                // border: "1px solid #a6a6a6",
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
                                WebkitTransition: "all .1s linear",
                                transition: "all .1s linear",
                                margin: 0,
                                fontSize: "100%",
                                verticalAlign: "middle",

                                '& input[type="password"]': {
                                  "-webkit-text-security": "disc !important",
                                  // padding: "1px 2px",
                                },
                                writingMode: "horizontal-tb !important",

                                "&:focus": {
                                  /* backgroundColor: "#F7FEFF",
                            borderColor: "#007185",
                            boxShadow:
                              "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",*/
                                  //borderTopColor: 0,

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
                                sx={{
                                  borderRadius: "8px",
                                  display: "inline-block",
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
                                    // color: "#2b2b2b",
                                    padding: 0,
                                    position: "relative",
                                    fontSize: "13px",
                                    lineHeight: "19px",
                                    color: "#c40000",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      marginBottom: 0,
                                      textAlign: "left",
                                      fontSize: "12px",
                                      lineHeight: "15px",
                                      // color: "#2b2b2b",
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
                              marginBottom: "14px!important",
                              width: "100%",
                              fontSize: "13px",
                              lineHeight: "19px",
                              color: "#111",

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
                              //
                              position: "relative",
                            }}
                          >
                            <Box
                              component="label"
                              for="confirmMotPasse"
                              sx={{
                                display: "block",
                                paddingLeft: "2px",
                                paddingBottom: "2px",
                                fontWeight: 700,
                                fontSize: "13px",
                                lineHeight: "19px",
                                // color: "#111",
                                color: errors.confirmMotPasse
                                  ? "#e0103a"
                                  : "#111",
                              }}
                            >
                              Entrez le mot de passe à nouveau
                            </Box>
                            <Box
                              component="input"
                              // type="password"
                              type={showPassword ? "text" : "password"}
                              maxlength="1024"
                              id="confirmMotPasse"
                              autocomplete="off"
                              placeholder="Au moins 6&nbsp;caractères"
                              name="confirmMotPasse"
                              tabIndex="5"
                              //disabled={isSubmitting}
                              disabled={
                                // isPending ||
                                updUserIsLoading ||
                                // userByEmailExist.current ||
                                // isLoadingEmailVerif.current ||
                                isSubmitting ||
                                isLoading ||
                                isSigningUp
                              }
                              {...register("confirmMotPasse")}
                              sx={{
                                // animationName: "onAutoFillChanged",
                                width: "100%",
                                marginRight: 0,
                                // color: "#0F1111",
                                color: errors.confirmMotPasse
                                  ? "#e0103a"
                                  : "#0F1111",

                                backgroundColor: "#fff",
                                height: "31px",
                                padding: "3px 7px",
                                lineHeight: "normal",

                                //border: "1px solid #a6a6a6",
                                border: errors.confirmMotPasse
                                  ? "1px solid #e0103a"
                                  : "1px solid #a6a6a6",
                                borderTopColor: errors.confirmMotPasse
                                  ? "#e0103a"
                                  : "#949494",

                                borderRadius: "3px",
                                boxShadow:
                                  "0 1px 0 rgba(255,255,255,.5), 0 1px 0 rgba(0,0,0,.07) inset",
                                outline: 0,

                                WebkitTransition: "all .1s linear",
                                transition: "all .1s linear",
                                margin: 0,
                                fontSize: "100%",
                                verticalAlign: "middle",

                                '& input[type="password"]': {
                                  "-webkit-text-security": "disc !important",
                                  // padding: "1px 2px",
                                },
                                writingMode: "horizontal-tb !important",

                                "&:focus": {
                                  /* backgroundColor: "#F7FEFF",
                            borderColor: "#007185",
                            boxShadow:
                              "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",*/
                                  //borderTopColor: 0,

                                  backgroundColor: errors.confirmMotPasse
                                    ? "none"
                                    : "#F7FEFF",

                                  borderColor: errors.confirmMotPasse
                                    ? "none"
                                    : "#007185",
                                  boxShadow: errors.confirmMotPasse
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

                            {errors.confirmMotPasse && (
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
                                    {errors.confirmMotPasse.message}
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            marginBottom: "26px!important",
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
                                isNavVerifyRequest ||
                                isSubmitting ||
                                updUserIsLoading ||
                                //  isLoading ||
                                isSigningUp
                                  ? "#e7e9ec"
                                  : "#FFD814",
                              borderColor:
                                isNavVerifyRequest ||
                                isSubmitting ||
                                updUserIsLoading ||
                                // isLoading ||
                                isSigningUp
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
                                color: "#111",
                                cursor: "pointer",
                                textAlign: "center",
                                fontSize: "13px",
                                lineHeight: "19px",
                              }}
                            >
                              <Box
                                // component="input"
                                component="button"
                                id="continue"
                                tabIndex="8"
                                type="submit"
                                aria-labelledby="auth-continue"
                                // disabled={updUserLoading}
                                disabled={
                                  // isPending ||
                                  updUserIsLoading ||
                                  // userByEmailExist.current ||
                                  // isLoadingEmailVerif.current ||
                                  isSubmitting ||
                                  isLoading ||
                                  isSigningUp
                                }
                                // disabled={isSubmitting}
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
                                  margin: 0,
                                  fontSize: "100%",
                                  verticalAlign: "middle",
                                }}
                              ></Box>

                              {
                                // isPending ||
                                updUserIsLoading ||
                                // userByEmailExist.current ||
                                // isLoadingEmailVerif.current ||
                                isSubmitting ||
                                // isLoading ||
                                isSigningUp ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <Box
                                    component="span"
                                    id="auth-continue"
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
                                    }}
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        color: "#0F1111",
                                        fontSize: "13px",
                                        lineHeight: "29px",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Continuer
                                      {/*
                                {updUserLoading && (
                                  <CircularProgress size={20} />
                                )} */}
                                    </Box>

                                    {/*
                                <Box
                                  component="span"
                                  sx={{
                                    // display: "none!important",
                                    // visibility: "hidden!important",
                                    color: "#0F1111",
                                    fontSize: "13px",
                                    lineHeight: "29px",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                  }}
                                >
                                  Vérifier le numéro de téléphone mobile
                                </Box>
                            

                              
                                <Box
                                  component="span"
                                  sx={{
                                    //display: "none!important",
                                    // visibility: "hidden!important",
                                    color: "#0F1111",
                                    fontSize: "13px",
                                    lineHeight: "29px",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    cursor: "pointer",
                                  }}
                                >
                                  Vérifier l'adresse e-mail
                                </Box>
                                */}
                                  </Box>
                                )
                              }
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            marginBottom: "26px!important",
                            fontSize: "13px",
                            lineHeight: "19px",
                            color: "#111",
                            WebkitTextSizeAdjust: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: "12px!important",
                              lineHeight: "1.5!important",
                              marginTop: "18px!important",
                              width: "100%",
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
                            En cliquant sur S&rsquo;inscrire, vous confirmez
                            avoir lu et accepté les
                            <Box
                              component="a"
                              // href="/gp/help/customer/display.html/ref=ox_signin_condition_of_use?ie=UTF8&amp;nodeId=548524"
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
                                fontSize: "12px!important",
                                lineHeight: "1.5!important",
                              }}
                            >
                              &nbsp;conditions d&rsquo;utilisation.
                            </Box>
                            &nbsp;Veuillez consulter notre
                            <Box
                              component="a"
                              // href="/gp/help/customer/display.html/ref=ox_signin_privacy?ie=UTF8&amp;nodeId=3329781"
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
                                fontSize: "12px!important",
                                lineHeight: "1.5!important",
                              }}
                            >
                              &nbsp;notice Protection de vos Informations
                              Personnelles
                            </Box>
                            , notre
                            <Box
                              component="a"
                              // href="/gp/help/customer/display.html/?nodeId=201890250"
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
                                fontSize: "12px!important",
                                lineHeight: "1.5!important",
                              }}
                            >
                              &nbsp;notice Cookies.
                            </Box>
                          </Box>
                        </Box>
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
                          Vous possédez déjà un compte&nbsp;?
                          <Box
                            //component="a"
                            component="button"
                            // href="/gp/help/customer/display.html/?nodeId=201890250"
                            disabled={
                              //isNavAuthForm ||
                              isSubmitting || isLoading || isSigningUp
                            }
                            onClick={handleNavAuthForm}
                            sx={{
                              position: "relative",
                              paddingRight: "9px",

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

                              //fontSize: "13px",
                              //lineHeight: "19px",

                              /* "&::after": {
                                backgroundImage:
                                  "url(https://m.media-amazon.com/images/S/sash/BgnVchebDR5Ds4h.png)",
                              },

                              "&::after": {
                                backgroundSize: "400px 750px",
                                backgroundRepeat: "no-repeat",
                                pointerEvents: "none",
                                content: '""',
                                display: "block",
                                position: "absolute",
                                right: "1px",
                                top: "50%",
                                marginTop: "-3px",
                                backgroundPosition: "-346px -86px",
                                verticalAlign: "top",
                              },*/

                              fontSize: "12px!important",
                              lineHeight: "1.5!important",
                              //
                              backgroundColor: "transparent",
                              border: "none",
                              outline: 0,
                            }}
                          >
                            &nbsp;Identifiez-vous
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          {/*
          {isNavAuthForm && (
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
                backgroundColor:
                  "rgba(255, 255, 255, 0.8); /* Add a semi-transparent background to dim the page behind the spinner",
                zIndex: "9999",
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )} */}
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
                Conditions d&rdquo;utilisation
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

/*export const SuspenseSignUpForm = () => {
  return (
    <Suspense fallback={<CircularProgress size={20} />}>
      <SignUpForm />
    </Suspense>
  );
};*/

export default SignUpForm;
//export default SuspenseSignUpForm;
