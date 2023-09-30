import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SvgIcon from "@mui/material/SvgIcon";
import { useRouter } from "next/router";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import { signIn } from "next-auth/react";

// Votre email a été verifié avec succés!
export const VerifyEmailSuccess = () => {
  const router = useRouter();
  const { email } = router.query;

  const [showPassword, setShowPassword] = useState(false);
  const [motDepasseValue, setMotDepasseValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [signInError, setSignInError] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const emailSuccessSchema = yup.object().shape({
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
  });

  const {
    register,
    handleSubmit,
    //setValue,
    //setFocus,
    // watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(emailSuccessSchema),
    mode: "onBlur",
    //mode: "onChange",
    reValidateMode: "onBlur",
    //reValidateMode: "onChange",
    shouldFocusError: true,
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function CustCheckCircleIcon(props) {
    return (
      <SvgIcon {...props}>
        <CheckCircleIcon />
      </SvgIcon>
    );
  }

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

  function CustErrorIcon(props) {
    return (
      <SvgIcon {...props}>
        <ErrorIcon />
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

  const handleNavChgAcct = async () => {
    // setIsNavHome(true);

    try {
      await router.push({
        pathname: "/auth/authForm",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setIsNavHome(false);
    }
  };

  const handleNavCallbackUrl = async (resultUrl) => {
    //setIsNavCallbackUrl(true);

    try {
      await router.push(resultUrl);
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setIsNavCallbackUrl(false);
    }
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let password = data.motDePasse;

    const canSignIn = [email, password].every(Boolean);

    if (canSignIn) {
      setIsSigningIn(true);

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          callbackUrl: "/",
        });

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
        sx={{
          backgroundColor: "#FFF",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          minWidth: "300px",
          fontSize: "small",
        }}
      >
        <Box
          sx={{
            width: "inherit !important",
            margin: "16px 16px 16px !important",
          }}
        >
          <Box
            component="header"
            id="gh"
            role="banner"
            sx={{
              padding: 0,
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
                      textIndent: "initial",
                    }}
                  >
                    <Box
                      // component="a"
                      component="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavHome();
                      }}
                      disabled={isLoading || isSigningIn || isSubmitting}
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
                        //
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
                  <Box
                    component="td"
                    sx={{
                      width: "1%",
                      verticalAlign: "bottom",
                      padding: 0,
                      display: "table-cell",
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      textIndent: "initial",
                    }}
                  ></Box>
                  <Box
                    component="td"
                    sx={{
                      width: "1%",
                      verticalAlign: "bottom",
                      padding: 0,
                      display: "table-cell",
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      textIndent: "initial",
                    }}
                  ></Box>
                  <Box
                    component="td"
                    sx={{
                      width: "1%",
                      verticalAlign: "bottom",
                      padding: 0,
                      display: "table-cell",
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      textIndent: "initial",
                    }}
                  ></Box>
                  <Box
                    component="td"
                    sx={{
                      width: "1%",
                      verticalAlign: "bottom",
                      padding: 0,
                      display: "table-cell",
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      textIndent: "initial",
                    }}
                  ></Box>
                  <Box
                    component="td"
                    sx={{
                      width: "1%",
                      verticalAlign: "bottom",
                      padding: 0,
                      display: "table-cell",
                      borderCollapse: "collapse",
                      borderSpacing: 0,
                      textIndent: "initial",
                    }}
                  >
                    <Box
                      sx={{
                        display: "none",
                      }}
                    ></Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      display: "table-cell",
                      verticalAlign: "inherit",
                    }}
                  >
                    <Box component="ul"></Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: "1 0 auto",
            alignSelf: "center",
            marginBottom: "30px",
          }}
        >
          <Box
            component="main"
            role="main"
            sx={{
              width: "355px",
            }}
          >
            <Box>
              <Box>
                <Box
                  sx={{
                    marginBottom: "16px",
                  }}
                >
                  <Box
                    component="section"
                    sx={{
                      "@media screen and (min-width: 512px)": {
                        margin: "16px 0",
                      },
                      display: "grid",
                      gridTemplateColumns: "32px auto auto auto",
                      backgroundColor: "#05823f",
                      borderColor: "#05823f",
                      borderStyle: "solid",
                      borderWidth: "1px",
                      color: "#fff",
                      fontSize: ".875rem",
                      padding: "16px",
                    }}
                  >
                    <Box
                      sx={{
                        gridColumn: 1,
                        gridRow: 1,
                        paddingRight: "16px",
                        color: "#fff",
                        fontSize: ".875rem",
                      }}
                    >
                      <CustCheckCircleIcon
                        focusable="false"
                        aria-label="Confirmation"
                        role="img"
                        sx={{
                          color: "#fff",
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        gridColumn: 2,
                        gridRow: 1,
                        paddingRight: "16px",
                        color: "#fff",
                        fontSize: ".875rem",
                      }}
                    >
                      <Box
                        component="p"
                        tabindex="0"
                        sx={{
                          WebkitHyphens: "none",
                          MsHyphens: "none",
                          hyphens: "none",
                          fontSize: ".875rem",
                          margin: "2px 0 0",
                          color: "#fff",
                        }}
                      >
                        La confirmation de votre adresse e-mail a éte faite avec
                        succés.Connectez-vous pour pouvoir utiliser Dimapromo.
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxWidth: "355px",
                }}
              >
                <Box
                  component="h1"
                  sx={{
                    fontSize: "2em",
                    textAlign: "center",
                    margin: 0,
                    fontWeight: 700,
                    fontStretch: "normal",
                    lineHeight: "36px",
                    letterSpacing: "normal",
                    paddingBottom: "8px",
                    color: "#151e27",
                  }}
                >
                  Bienvenue
                </Box>
                <Box
                  component="span"
                  sx={{
                    paddingBottom: "8px",
                    fontSize: "14px",
                    maxWidth: "340px",
                  }}
                >
                  {email}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: "12px",
                    maxWidth: "340px",
                  }}
                >
                  Ce n&rdquo;est pas vous&nbsp;?
                  <Box
                    //component="a"
                    component="button"
                    role="button"
                    tabindex="0"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavChgAcct();
                    }}
                    disabled={isLoading || isSigningIn || isSubmitting}
                    sx={{
                      textDecoration: "underline",
                      color: "#3665f3",
                      cursor: "pointer",
                      fontSize: "12px",
                      //
                      backgroundColor: "transparent",
                      border: "none",
                      outline: 0,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        border: "0 !important",
                        clip: "rect(1px,1px,1px,1px)",
                        height: "1px !important",
                        overflow: "hidden",
                        padding: "0 !important",
                        position: "absolute !important",
                        whiteSpace: "nowrap !important",
                        width: "1px !important",
                        color: "#3665f3",
                        fontSize: "12px",
                      }}
                    >
                      L&rdquo;utilisateur actuel est &nbsp;{email}&nbsp;.
                    </Box>
                    &nbsp;Changer de compte
                  </Box>
                </Box>
              </Box>
              <Box
                component="form"
                id="signin-form"
                name="signin-form"
                autocomplete="on"
                method="post"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  margin: 0,
                  padding: 0,
                  marginTop: "45px",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                  }}
                >
                  {signInError && (
                    <Box
                      sx={{
                        display: "flex",
                        margin: "8px 0",
                        fontSize: "small",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          marginRight: "8px",
                          marginTop: "4px",
                        }}
                      >
                        <CustErrorIcon
                          fontSize="small"
                          sx={{
                            color: "#e0103a",
                            display: "inline-block",
                            fill: "currentColor",
                            pointerEvents: "none",
                            stroke: "currentColor",
                            strokeWidth: 0,
                            verticalAlign: "middle",
                            //height: "16px",
                            //width: "16px",
                          }}
                        />
                      </Box>

                      <Box
                        component="span"
                        sx={{
                          fontSize: "small",
                        }}
                      >
                        <Box
                          component="p"
                          sx={{
                            margin: "3px 0",
                            fontSize: "small",
                            //
                            color: "#C7511F",
                            //
                            fontWeight: "bold",
                          }}
                        >
                          Les informations saisies ne sont pas exactes. Votre
                          mot de passe est incorrect.
                        </Box>
                      </Box>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: "block",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        display: "block",
                        position: "relative",
                      }}
                    >
                      <Box
                        component="label"
                        for="passwd"
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
                      <Box
                        sx={{
                          color: "#f7f7f7",
                          fontSize: ".875rem",
                          position: "relative",
                          display: "block",
                        }}
                      >
                        <Box
                          component="input"
                          id="passwd"
                          type={showPassword ? "text" : "password"}
                          placeholder="Au moins 6&nbsp;caractères"
                          name="passwd"
                          maxLength="64"
                          autoComplete="off"
                          {...register("motDePasse")}
                          disabled={isLoading || isSigningIn || isSubmitting}
                          onChange={(e) => {
                            setMotDepasseValue(e.target.value);
                          }}
                          //error={!!errors.motDePasse}
                          //errors={errors}

                          sx={{
                            paddingBottom: "2px",
                            paddingTop: "18px",
                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                            backgroundColor: "#f7f7f7",

                            borderColor: errors.motDePasse
                              ? "#e0103a !important"
                              : "#8f8f8f",
                            borderRadius: "8px",
                            borderStyle: "solid",
                            borderWidth: "1px",
                            boxSizing: "border-box",
                            //color: "#191919",
                            color: errors.motDePasse
                              ? "#e0103a !important"
                              : "#191919",
                            fontSize: "1em",
                            height: "40px",
                            margin: 0,
                            fontFamily: "inherit",
                            padding: "0 16px",
                            verticalAlign: "middle",
                            width: "100%",

                            "&:focus": {
                              color: errors.motDePasse
                                ? "#e0103a !important"
                                : "#191919",
                              backgroundColor: errors.motDePasse
                                ? "transparent"
                                : "#F7FEFF",

                              borderColor: errors.motDePasse
                                ? "#e0103a !important"
                                : "#007185",
                              boxShadow: errors.motDePasse
                                ? "#e0103a !important"
                                : "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                            },
                          }}
                        ></Box>
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
                    </Box>

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

                    <Box sx={{}}></Box>
                  </Box>
                  <Box component="br"></Box>
                  <Box
                    component="button"
                    //disabled={!isDirty || !isValid}
                    type="submit"
                    disabled={
                      !motDepasseValue ||
                      isLoading ||
                      isSigningIn ||
                      isSubmitting
                    }
                    sx={{
                      backgroundColor:
                        !motDepasseValue || isSigningIn || isSubmitting
                          ? "#c7c7c7"
                          : "#3665f3",
                      borderColor:
                        !motDepasseValue || isSigningIn || isSubmitting
                          ? "#c7c7c7"
                          : "#3665f3",
                      color: "#fff",
                      borderRadius: "calc(48px / 2)",
                      fontSize: "1rem",
                      minHeight: "48px",
                      padding: "13px 20px",
                      fontWeight: "bold",
                      width: "100%",
                      border: "1px solid",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      margin: 0,
                      textAlign: "center",
                      textDecoration: "none",
                      verticalAlign: "bottom",
                      display: "inline-block",
                      minWidth: "88px",
                    }}
                  >
                    {isSigningIn || isSubmitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Box
                        sx={{
                          display: "block",
                          color: "#fff",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          fontFamily: "inherit",
                          textAlign: "center",
                        }}
                      >
                        Se connecter
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box sx={{}}></Box>
                <Box sx={{}}></Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyEmailSuccess;
