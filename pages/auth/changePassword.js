//import React, { useState } from "react";
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  useTransition,
} from "react";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import { useResetPswdMutation } from "../../redux/features/api/apiSlice";
import { useGenerateResetCodeMutation } from "../../redux/features/api/apiSlice";

export const SignUpForm = () => {
  const sessionData = useSession();
  const router = useRouter();

  const { email, resetCode } = router.query;

  const [showPassword, setShowPassword] = useState(false);
  const [motDepasseValue, setMotDepasseValue] = useState("");
  //const [isNavResetPswd, setisNavResetPswd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetingPassword, setIsResetingPassword] = useState(false);
  const [isErrResetPassword, setIsErrResetPassword] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);

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
    resetPswd,
    {
      data: resetPswdData,
      isLoading: resetPswdIsLoading,
      isSuccess: resetPswdIsSuccess,
      error: resetPswdError,
      isError: resetPswdIsError,
    },
  ] = useResetPswdMutation();

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

  const signUpSchema = yup.object().shape({
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
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

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

  const handleNavResetPswd = async (password) => {
    // setisNavResetPswd(true);

    try {
      await router.push({
        pathname: "/auth/changePswdSuccess",
        query: {
          email: email,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setisNavResetPswd(false);
    }
  };

  const handleResendCode = async () => {
    // e.preventDefault();

    setIsResendingCode(true);

    try {
      // Call the generateResetCode mutation using await
      const data = await generateResetCode({ email: email }).unwrap();
      // setValue("resetPswdCode", "");

      if (
        generateResetCodeIsSuccess ||
        data?.message.includes("Reset code sent successfully.")
      ) {
        await handleNavVerifCodePswd();
      }
    } catch (err) {
      console.error("Un probleme est survenu pour renvoyer votre code: ", err);
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleNavVerifCodePswd = async () => {
    // setisNavResetPswd(true);

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
      // setisNavResetPswd(false);
    }
  };

  async function resetPassword(email, resetCode, password) {
    try {
      // Call the resetPswd mutation using await
      const data = await resetPswd({
        email,
        resetCode,
        password,
      }).unwrap();

      // console.log("Mardi 5 Sep Result reset pswd:", data);

      if (
        resetPswdIsSuccess ||
        data?.message.includes("Password reset successful.")
      ) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          //  callbackUrl: "/",
        });

        if (result.status === "ok" || !result.error) {
          // Authentication was successful
          await handleNavResetPswd(password);
        }
      }

      /* await signIn("credentials", {
        redirect: false,
        email,
        password,
        //  callbackUrl: "/",
      });*/

      // Execute another function after the update is complete
      //await handleNavResetPswd(password);
    } catch (err) {
      if (
        err.status === 400 &&
        err?.data.message.includes("Invalid reset code")
      ) {
        await handleResendCode();
        //await handleNavVerifCodePswd();
      } else {
        // Handle other errors
        setIsErrResetPassword(true);
      }
      // Handle errors here
      console.error("Error generating reset code:", err);
    }
  }

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let password = data.motDePasse;

    const canSave = [email, resetCode, password].every(Boolean);

    setIsResetingPassword(true);
    setIsErrResetPassword(false);

    if (canSave) {
      try {
        await resetPassword(email, resetCode, password);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setIsResetingPassword(false);
      }
    }
  };

  return (
    <Box>
      {isLoading && !isResetingPassword && !isSubmitting && (
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
                tabindex="-1"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavHome();
                }}
                disabled={isSubmitting || isResetingPassword || isLoading}
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
                            //paddingBottom: "4px",
                            paddingBottom: "8px",
                            color: "#111",
                          }}
                        >
                          Créer un nouveau mot de passe
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
                              // type="password"
                              type={showPassword ? "text" : "password"}
                              maxlength="1024"
                              id="motDePasse"
                              autocomplete="off"
                              placeholder="Au moins 6&nbsp;caractères"
                              name="motDePasse"
                              tabIndex="4"
                              disabled={
                                isSubmitting ||
                                isResetingPassword ||
                                resetPswdIsLoading ||
                                isLoading
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
                                /* borderColor: "rgb(143, 143, 143)",
                      top: 0,
                      marginTop: "10px",
                      position: "absolute",
                      right: 0,
                      marginRight: "10px",
                      display: "block",*/
                                //
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
                                    /*display: "inline-flex",
                        position: "relative",
                        verticalAlign: "text-bottom",*/
                                    display: "-webkit-flex",
                                    display: "flex",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      /*display: "inline-flex",
                          transform: "scale(0.8)",
                          marginRight: "8px",
                          height: "18px",
                          outlineOffset: "1px",*/
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
                          <Box component="br"></Box>

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
                              //type="password"
                              type={showPassword ? "text" : "password"}
                              maxlength="1024"
                              id="confirmMotPasse"
                              autocomplete="off"
                              placeholder="Au moins 6&nbsp;caractères"
                              name="confirmMotPasse"
                              tabIndex="5"
                              disabled={
                                isSubmitting ||
                                isResetingPassword ||
                                resetPswdIsLoading ||
                                isLoading
                              }
                              {...register("confirmMotPasse")}
                              /*  onChange={(e) => {
                              setMotDepasseValue(e.target.value);
                            }}*/
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
                                /* borderColor: "rgb(143, 143, 143)",
                      top: 0,
                      marginTop: "10px",
                      position: "absolute",
                      right: 0,
                      marginRight: "10px",
                      display: "block",*/
                                //
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
                                    /*display: "inline-flex",
                        position: "relative",
                        verticalAlign: "text-bottom",*/
                                    display: "-webkit-flex",
                                    display: "flex",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      /*display: "inline-flex",
                          transform: "scale(0.8)",
                          marginRight: "8px",
                          height: "18px",
                          outlineOffset: "1px",*/
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

                            {(isErrResetPassword ||
                              resetPswdIsError ||
                              generateResetCodeIsError) && (
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
                                        Un problème est survenu pour changer
                                        votre mot de passe.
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            )}

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
                        <Box component="br"></Box>
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
                              //background: "#FFD814",
                              // borderColor: "#FCD200",
                              background:
                                isSubmitting ||
                                isResetingPassword ||
                                resetPswdIsLoading
                                  ? "#e7e9ec"
                                  : "#FFD814",
                              borderColor:
                                isSubmitting ||
                                isResetingPassword ||
                                resetPswdIsLoading
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
                                disabled={
                                  isSubmitting ||
                                  isResetingPassword ||
                                  resetPswdIsLoading ||
                                  isLoading
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
                                  margin: 0,
                                  fontSize: "100%",
                                  verticalAlign: "middle",
                                }}
                              ></Box>

                              {isSubmitting ||
                              isResetingPassword ||
                              resetPswdIsLoading ? (
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
                                    Enregistrer
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
                Conditions d'utilisation
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
