//import React from "react";
import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SvgIcon from "@mui/material/SvgIcon";
//
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

import { useGetUserAdrQuery } from "../redux/features/api/apiSlice";
import { useEditUserAdrLivMutation } from "../redux/features/api/apiSlice";
import { useEditUserAdrFactMutation } from "../redux/features/api/apiSlice";
import { useAddOrdersMutation } from "../redux/features/api/apiSlice";
import { useAddUserIdMutation } from "../redux/features/api/apiSlice";
import { cartSpinnerAsync } from "../redux/features/cart/cartSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { productUpdated } from "../redux/features/cart/cartSlice";
import { productRemoved } from "../redux/features/cart/cartSlice";
import { allProductRemoved } from "../redux/features/cart/cartSlice";
import useScrollY from "../lib/useScrollY";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InfoIcon from "@mui/icons-material/Info";
//

import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const Cart = () => {
  // export const HandlesCheckout = () => {

  const router = useRouter();

  const qtUpdSchema = yup.object().shape({
    cartItemsArray: yup.array().of(
      yup.object().shape({
        itemQteeDisp: yup.number().nullable(),
        itemQtee: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("Veuillez saisir la quantitée")
          .nullable(),
        itemQteeUpd: yup
          .number()
          .transform((value) => (isNaN(value) ? undefined : value))
          .required("Veuillez saisir la quantitée")
          .min(1, "La quantitée saisie est invalide")
          .max(
            yup.ref("itemQteeDisp"),
            ({ max }) => `La quantitée maximale disponible est : ${max}`
          )
          .nullable(),
      })
    ),
  });

  const cart = useSelector((state) => state.cart.products);

  const methods = useForm({
    resolver: yupResolver(qtUpdSchema),
    defaultValues: {
      cartItemsArray:
        cart.map((item) => {
          return {
            prodId: item.prodId,
            itemQtee: item.prodQtee,
            itemQteeUpd: item.prodQtee,

            itemQteeDisp: item.prodQteeDisp,
          };
        }) ?? "",
    },
    mode: "onChange",
    // reValidateMode: "onBlur",
    //reValidateMode: "onChange",
    //mode: "onBlur",
  });

  /*const onSubmit = async (data, e) => {
    e.preventDefault();
    alert(JSON.stringify(data));
  };*/

  const onSubmit = async (data, event) => {
    event.preventDefault();

    try {
      if (!session || !session.user) {
        setOpenDialogCheckout(true);
      } else {
        //console.log("session userid : ", session.user.id);
        if (session.user.id) {
          await handleNavCheckout(session.user.id);
        }
      }
    } catch (err) {
      console.error(
        "Un probleme est survenu pour faire passer une commande: ",
        err
      );
    } finally {
    }
  };

  // last Add here
  ///////////////////////////////////   Add     ////////////////////////////////////////

  const [openDialogCheckout, setOpenDialogCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCheckout, setIsNavCheckout] = useState(false);
  const [isNavSignIn, setIsNavSignIn] = useState(false);

  const { data: session } = useSession();

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

  const handleNavCheckout = async (userId) => {
    setIsNavCheckout(true);
    try {
      await router.push({
        pathname: "/checkout",
        query: {
          userId: userId,
        },
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavCheckout(false);
    }
  };

  const handleNavSignIn = async () => {
    setIsNavSignIn(true);
    try {
      await router.push({
        pathname: "/auth/authForm",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavSignIn(false);
      handleCloseDialogCheckout();
    }
  };

  const [
    addUserId,
    {
      data: addUserIdData,
      isLoading: addUserIdIsLoading,
      isSuccess: addUserIdIsSuccess,
      error: addUserIdError,
      isError: addUserIdIsError,
    },
  ] = useAddUserIdMutation();

  const clickCheckoutNoInsc = async () => {
    try {
      if (!session || !session.user) {
        handleCloseDialogCheckout();
        const response = await addUserId().unwrap();

        console.log("I am here session");

        if (addUserIdIsSuccess || response?.userId) {
          console.log("I am here response");
          await handleNavCheckout(response?.userId);
        }
      }
    } catch (err) {
      console.error(
        "Un probleme est survenu pour acheter sans être inscrit: ",
        err
      );
    } finally {
      // handleCloseDialogCheckout();
    }
  };

  const handleCloseDialogCheckout = () => {
    setOpenDialogCheckout(false);
  };

  function CustCloseIcon(props) {
    return (
      <SvgIcon {...props}>
        <CloseIcon />
      </SvgIcon>
    );
  }

  const DialogCheckout = () => {
    return (
      <Dialog
        open={openDialogCheckout}
        onClose={handleCloseDialogCheckout}
        aria-labelledby="responsive-dialog-title"
        position="fixed"
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              backgroundColor: "rgba(17,24,32,.7)",
              bottom: 0,
              left: 0,
              overflowY: "auto",
              //position: "fixed",
              right: 0,
              top: 0,
              willChange: "background-color",
              zIndex: 100000,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                maxWidth: "396px",
                borderRadius: 0,

                "@media screen and (min-width: 769px)": {
                  maxWidth: "616px",
                },

                backgroundColor: "#fff",
                display: "flex",
                flex: "1 0 auto",
                flexDirection: "column",
                minHeight: "55px",
                willChange: "opacity,transform",
                // marginTop: "15vh",
              }}
            >
              <Box
                sx={{
                  paddingBottom: "10px",
                  justifyContent: "right",
                  display: "flex",
                  flexShrink: 0,
                  margin: "16px 16px 0",
                  position: "relative",
                }}
              >
                <Box
                  component="button"
                  onClick={handleCloseDialogCheckout}
                  sx={{
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                    display: "inline-block",
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    border: 0,
                    minWidth: "32px",
                    position: "relative",
                    zIndex: 1,

                    "&:not(:focus-visible)": {
                      outline: 0,
                    },

                    borderRadius: "50%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: 0,
                    verticalAlign: "text-bottom",
                  }}
                >
                  <CustCloseIcon
                    sx={{
                      maxWidth: "75%",
                      position: "relative",
                      //height: "14px",
                      // width: "14px",
                      display: "inline-block",
                      pointerEvents: "none",
                      stroke: "currentColor",
                      strokeWidth: 0,
                      verticalAlign: "middle",
                    }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  margin: 0,
                  boxSizing: "border-box",
                  flex: "1 1 auto",
                  position: "relative",
                  minHeight: "18px",
                }}
              >
                <Box
                  sx={{
                    "&:last-child": {
                      marginBottom: 0,
                    },

                    "&:first-child": {
                      marginTop: 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "364px",
                      // padding: "16px 16px",
                    }}
                  >
                    <Box
                      sx={{
                        marginTop: "28px",
                      }}
                    >
                      <Box>
                        <Box
                          //component="a"
                          component="button"
                          onClick={handleNavSignIn}
                          disabled={isLoading || isNavCheckout || isNavSignIn}
                          sx={{
                            //backgroundColor: "#3665f3",
                            backgroundColor: "#FFD814",
                            fontSize: "1rem",
                            width: "364px",
                            borderRadius: "3px",
                            height: "48px",
                            lineHeight: 1.563,
                            fontWeight: "400 !important",

                            //color: "#fff",
                            color: "#0F1111",
                            padding: "9px 0",
                            border: "1px solid #0053a0",
                            outlineColor: "#0053a0",
                            boxSizing: "border-box",
                            margin: 0,
                            textAlign: "center",
                            textDecoration: "none",
                            verticalAlign: "bottom",

                            display: "inline-block",
                            minHeight: "40px",
                            minWidth: "88px",

                            cursor: "pointer",
                            "a:-webkit-any-link": {
                              cursor: "pointer",
                            },

                            maxWidth: "364px !important",

                            /////

                            // backgroundColor: "transparent",
                            // border: "none",
                            // outline: 0,
                            borderColor: "#FCD200",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
                            fontWeight: "bold",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              display: "block",
                              maxWidth: "90%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 400,
                              }}
                            >
                              Se connecter pour finaliser l&rdquo;achat
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          marginTop: "16px",
                        }}
                      >
                        <Box
                          //component="a"
                          component="button"
                          onClick={clickCheckoutNoInsc}
                          disabled={isLoading || isNavCheckout || isNavSignIn}
                          sx={{
                            borderColor: "#c7c7c7",
                            color: "#006efc !important",
                            backgroundColor: "#fff !important",
                            fontSize: "1rem",
                            width: "364px",
                            borderRadius: "3px",
                            height: "48px",
                            lineHeight: 1.563,
                            fontWeight: "400 !important",

                            border: "1px solid",
                            boxSizing: "border-box",
                            margin: 0,
                            textAlign: "center",
                            textDecoration: "none",
                            verticalAlign: "bottom",

                            display: "inline-block",
                            minHeight: "40px",
                            minWidth: "88px",
                            padding: "9.5px 20px",
                            cursor: "pointer",
                            "a:-webkit-any-link": {
                              cursor: "pointer",
                            },
                            //
                            maxWidth: "364px !important",
                            //
                            //  backgroundColor: "transparent",
                            // border: "none",
                            // outline: 0,
                            // textAlign: "center!important",
                            // width: "100%!important",
                          }}
                        >
                          <Box component="span" sx={{}}>
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 400,
                              }}
                            >
                              Finaliser l&rdquo;achat sans être inscrit
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
        </DialogContent>
      </Dialog>
    );
  };

  ///////////////////////////////////   End Add     ////////////////////////////////////////

  const HandlesCart = ({ cart }) => {
    // const router = useRouter();
    const { userId } = router.query;

    // const el = useRef(null);

    // const cart = useSelector((state) => state.cart.products);
    const dispatch = useDispatch();

    const removeCartItem = (prodId) => {
      dispatch(productRemoved({ prodId }));
    };

    // const [isLoading, setIsLoading] = useState(false);

    /* useEffect(() => {
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
    }, []);*/

    /* const handleNavHome = async () => {
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
    };*/

    // Getting the count of items
    const getItemsCount = () => {
      return cart.reduce((accumulator, item) => accumulator + item.prodQtee, 0);
    };

    const getTotalPrice = () => {
      return cart.reduce(
        (accumulator, item) => accumulator + item.prodQtee * item.prodPrix,
        0
      );
    };

    //const TotalCartPrice = parseFloat(getTotalPrice().toFixed(2));
    const TotalCartPrice = parseFloat(
      Math.round(getTotalPrice() * 100) / 100
    ).toFixed(2);

    /*const {
      data: userAdr,
      isFetching: userFetching,
      isLoading: userLoading,
      //  isSuccess: userSuccess,
      isError: userIsError,
      error: userError,
    } = useGetUserAdrQuery(userId);*/

    function CustExpandMoreIcon(props) {
      return (
        <SvgIcon {...props}>
          <KeyboardArrowDownOutlinedIcon />
        </SvgIcon>
      );
    }

    const HandlesCartItem = ({ cartItemId, index }) => {
      const item = useSelector((state) =>
        state.cart.products.find(
          (product) => product.prodId === parseInt(cartItemId)
        )
      );

      const prodId = parseInt(cartItemId);

      const [openItem, setOpenItem] = useState(false);

      const clickOpenItem = () => {
        setOpenItem(true);
      };

      const handleCloseItem = () => {
        setOpenItem(false);
      };

      const {
        register,
        //handleSubmit,
        setValue,
        //watch,
        getValues,
        setFocus,
        // useWatch,
        //trigger,
        control,
        // reset,
        // resetField,
        //formState: { },
        formState: { errors, isValid: isValidQtUpd },
        //formState: { errors },
      } = useFormContext();

      const watchItemQtee = parseInt(
        useWatch({
          name: `cartItemsArray.[${index}].itemQtee`,
          control,
        })
      );

      const watchItemQteeUpd = parseInt(
        useWatch({
          name: `cartItemsArray.[${index}].itemQteeUpd`,
          control,
        })
      );

      let CartItemPrice = parseFloat(
        Math.round(item?.prodPrix * 100) / 100
      ).toFixed(2);

      let maxCartQtee = item?.prodQteeDisp < 10 ? item?.prodQteeDisp : 10;
      let QteeAllowed = [];

      for (let i = 1; i <= maxCartQtee; i++) {
        if (i === 10) {
          QteeAllowed.push("10+");
        } else {
          QteeAllowed.push(i);
        }
      }

      let options = QteeAllowed.map((opt, ind) => {
        let optQtee = opt === "10+" ? 10 : parseInt(opt);

        return (
          <Box component="option" value={optQtee} key={ind}>
            {opt}
          </Box>
        );
      });

      const onSubmitQteeUpd = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        let prodQuantity;
        let QteeFromUpd;

        if (watchItemQteeUpd <= 9) {
          QteeFromUpd = parseInt(
            getValues(`cartItemsArray.[${index}].itemQteeUpd`)
          );

          setValue(`cartItemsArray.[${index}].itemQtee`, QteeFromUpd);

          prodQuantity = parseInt(
            getValues(`cartItemsArray.[${index}].itemQtee`)
          );
        } else {
          prodQuantity = parseInt(
            getValues(`cartItemsArray.[${index}].itemQteeUpd`)
          );
        }

        const canSaveAdrLiv = [prodId, prodQuantity].every(Boolean);

        if (canSaveAdrLiv && prodQuantity <= item.prodQteeDisp) {
          try {
            // const updCartQtee = await
            dispatch(
              productUpdated({
                prodId,
                prodQuantity,
              })
            );
            await dispatch(
              cartSpinnerAsync({
                prodId,
                prodQuantity,
              })
            ).unwrap();
          } catch (err) {
            console.error(
              "Un probleme est survenu pour enregistrer la quantité à commander: ",
              err
            );
          }
        }
      };

      let isLoading = item?.status === "loading";

      const onChgCartQtee = async (e) => {
        //   const onChgCartQtee = (e) => {
        e.stopPropagation();
        e.preventDefault();

        let prodQuantity = parseInt(
          getValues(`cartItemsArray.[${index}].itemQtee`)
        );

        setValue(`cartItemsArray.[${index}].itemQteeUpd`, prodQuantity);

        const canSaveAdrLiv = [prodId, prodQuantity].every(Boolean);

        if (canSaveAdrLiv && watchItemQtee <= 9) {
          try {
            // const updCartQtee = await
            if (prodQuantity <= 9) {
              dispatch(
                productUpdated({
                  prodId,
                  prodQuantity,
                })
              );
            }

            //  ).unwrap();
          } catch (err) {
            console.error(
              "Un probleme est survenu pour enregistrer la quantité à commander: ",
              err
            );
          }
        }
      };

      /* const removeCartItem = (prodId) => {
        dispatch(productRemoved({ prodId }));
      };*/

      const handleCloseBackdrop = () => {
        let isIdle;
        return (isIdle = item?.status === "idle");
      };

      const checkItemQteeUpd = () => {
        if (!isValidQtUpd) {
          setFocus(`cartItemsArray.[${index}].itemQteeUpd`);
        }
      };

      return (
        <>
          {item && (
            <Box
              //key={it.id}
              // key={item.prodId}
              sx={{
                "@media screen and (min-width: 576px)": {
                  borderBottom: "1px solid #e5e5e5",
                  marginBottom: "1.5rem",
                },

                "&:last-child": {
                  borderBottom: "none",
                  marginBottom: 0,
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    boxSizing: "inherit",
                    display: "block",
                    color: "#191919",
                    fontSize: ".875rem",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    tabIndex="0"
                    sx={{
                      padding: 0,
                      marginRight: 0,
                      marginLeft: 0,

                      "@media screen and (min-width: 576px)": {
                        maxWidth: "540px",
                      },

                      "@media screen and (min-width: 768px)": {
                        maxWidth: "720px",
                      },

                      "@media screen and (min-width: 992px)": {
                        maxWidth: "960px",
                      },

                      "@media screen and (min-width: 1200px)": {
                        maxWidth: "1140px",
                      },

                      width: "100%",
                      boxSizing: "inherit",
                      display: "block",
                    }}
                  >
                    <Box
                      sx={{
                        marginRight: 0,
                        marginLeft: 0,
                        display: "-webkit-box",
                        display: "-ms-flexbox",
                        display: "flex",
                        MsFlexWrap: "wrap",
                        flexWrap: "wrap",
                        paddingLeft: "1rem",
                      }}
                    >
                      <Box
                        sx={{
                          //maxWidth: "130px",
                          maxWidth: "220px",
                          paddingRight: 0,
                          paddingLeft: 0,

                          "@media screen and (min-width: 576px)": {
                            WebkitBoxFlex: 0,
                            MsFlex: "0 0 25%",
                            flex: "0 0 25%",
                          },

                          position: "relative",
                          width: "100%",
                          boxSizing: "inherit",
                          display: "block",
                        }}
                      >
                        <Box
                          sx={{
                            marginRight: "1.5rem",
                            display: "-webkit-box",
                            display: "-ms-flexbox",
                            display: "flex",
                            WebkitBoxPack: "center",
                            MsFlexPack: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            aria-hidden="true"
                            sx={{
                              display: "block",
                              // position: "relative",
                              //
                              // display: "block",
                              //position: "relative",
                              verticalAlign: "top",
                              maxWidth: "100%",
                              border: 0,
                              width: "180px",
                              aspectRatio: "auto 180 / 180",
                              height: "180px",
                              color: "#1B4B79",
                            }}
                          >
                            <Image
                              src={item?.prodImage}
                              alt="Image meilleure vente"
                              layout="responsive"
                              // layout="fill"
                              width="100%"
                              height="100%"
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          paddingRight: 0,
                          paddingLeft: 0,
                          MsFlexPreferredSize: 0,
                          flexBasis: 0,
                          WebkitBoxFlex: 1,
                          MsFlexPositive: 1,
                          flexGrow: 1,
                          maxWidth: "100%",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={
                            {
                              // marginRight: "1rem!important",
                            }
                          }
                        >
                          <Box
                            component="h3"
                            sx={{
                              fontSize: "inherit",
                              fontWeight: 400,
                              margin: "initial",
                              lineHeight: "20px",
                            }}
                          >
                            <Box
                              sx={{
                                boxSizing: "inherit",
                                display: "block",
                                fontSize: "inherit",
                                fontWeight: 400,
                                lineHeight: "20px",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  boxSizing: "inherit",
                                  fontSize: "inherit",
                                  fontWeight: 400,
                                  lineHeight: "20px",
                                  color: "#191919",
                                  WebkitTextSizeAdjust: "100%",
                                  // ADD
                                  height: "2.6em",

                                  // display: "inline-block",
                                  width: "100%",
                                  whiteSpace: "normal",
                                  lineHeight: "1.3em !important",
                                  wordBreak: "normal",
                                  textRendering: "optimizeLegibility",
                                  fontSize: "18px!important",
                                  // fontSize: "14px!important",
                                  color: "#0F1111!important",
                                  wordWrap: "break-word",

                                  color: "#282828",
                                  fontWeight: 400,
                                  fontWeight: 500,
                                }}
                              >
                                {item?.prodDesc}
                              </Box>
                              <Box
                                // ADD ADD ADD
                                sx={{
                                  marginRight: "0!important",
                                  float: "right!important",
                                  minHeight: "1px",
                                  overflow: "visible",
                                  width: "14.948%",
                                  textAlign: "right!important",
                                  color: "#0F1111",
                                }}
                              >
                                <Box
                                  component="p"
                                  sx={{
                                    padding: "0!important",
                                    margin: "0 0 14px 0",
                                    marginBottom: "4px!important",
                                    textAlign: "right!important",
                                    color: "#0F1111",
                                    fontSize: "14px",
                                    lineHeight: "20px",
                                    margin: "0!important",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      whiteSpace: "nowrap",
                                      color: "#0F1111!important",
                                      textRendering: "optimizeLegibility",
                                      fontSize: "18px!important",
                                      lineHeight: "24px!important",
                                      fontWeight: "700!important",
                                      textAlign: "right!important",
                                      //
                                      //  padding: "0!important",
                                      // margin: "0!important",
                                      //float: "right!important",
                                      marginRight: "0!important",
                                    }}
                                  >
                                    {CartItemPrice}&nbsp;dhs
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              color: "#767676",
                              marginBottom: "0.5rem!important",
                              marginTop: "0.25rem!important",
                              // marginBottom: "0.75rem!important",
                              // marginTop: "0rem!important",
                            }}
                          ></Box>
                        </Box>

                        <Box
                          // component="li"
                          sx={{
                            //  listStyle: "none",
                            wordWrap: "break-word",
                            margin: 0,
                            padding: 0,
                            //display: "list-item",
                            textAlign: "-webkit-match-parent",
                            color: "#0F1111",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              color: "#0F1111",
                              // listStyle: "none",
                              wordWrap: "break-word",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                color: "#007600!important",
                                fontSize: "12px!important",
                                lineHeight: "16px!important",
                                wordWrap: "break-word",
                                //
                                margin: 0,
                                padding: 0,
                              }}
                            >
                              {item?.prodEtat}
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          {/*
                        <Box
                          sx={{
                            marginBottom: "0.5rem",
                          }}
                        >
                          <Box
                            sx={{
                              boxSizing: "inherit",
                              display: "block",
                              color: "#191919",
                              fontSize: "inherit",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                fontWeight: 700,
                                fontSize: "1rem",
                                color: "#111820",
                                marginTop: "0.5rem",
                                WebkitTextSizeAdjust: "100%",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  boxSizing: "inherit",
                                  fontWeight: 700,
                                  fontSize: "1rem",
                                  color: "#111820",
                                  WebkitTextSizeAdjust: "100%",
                                }}
                              >
                                {CartItemPrice}&nbsp;dhs
                              </Box>
                            </Box>
                          </Box>
                        </Box> */}

                          <Box
                          // component="form"
                          //autoComplete="off"
                          //  onSubmit={handleSubmit(onSubmitQteeUpd)}
                          >
                            <>
                              <Box
                                sx={{
                                  display: "none",
                                }}
                              >
                                <input
                                  {...register(
                                    `cartItemsArray.${index}.prodId`
                                  )}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "none",
                                }}
                              >
                                <input
                                  {...register(
                                    `cartItemsArray.${index}.itemQteeDisp`
                                  )}
                                />
                              </Box>
                              {watchItemQtee < 10 && (
                                <>
                                  <Box
                                    sx={{
                                      width: "100%",
                                      marginBottom: "1rem",
                                      display: "inline-block!important",
                                      boxSizing: "inherit",
                                      color: "#191919",
                                      fontSize: ".875rem",
                                      WebkitTextSizeAdjust: "100%",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "-webkit-inline-box",
                                        display: "-ms-inline-flexbox",
                                        display: "inline-flex",
                                        WebkitBoxPack: "center",
                                        MsFlexPack: "center",
                                        justifyContent: "center",
                                        WebkitBoxAlign: "center",
                                        MsFlexAlign: "center",
                                        alignItems: "center",
                                        paddingRight: "0.5rem",
                                        //
                                        backgroundColor: "transparent",
                                      }}
                                    >
                                      <Box
                                        component="span"
                                        sx={{
                                          display: "inline-block",
                                          position: "relative",
                                          // marginTop: "1rem",
                                          // marginTop: "0.5rem!important",
                                          marginTop: "0.25rem!important",
                                          boxSizing: "inherit",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        <Box
                                          component="label"
                                          htmlFor="qtyCartId"
                                          sx={{
                                            WebkitTransform:
                                              "scale(.75) translateY(3px)",
                                            transform:
                                              "scale(.75) translateY(3px)",
                                            fontSize: ".875rem",
                                            color: "#111820",
                                            marginRight: "0.5rem",
                                            pointerEvents: "none",
                                            backgroundColor: "transparent",
                                            display: "inline-block",
                                            left: "16px",
                                            overflow: "hidden",
                                            position: "absolute",
                                            textOverflow: "ellipsis",
                                            top: 0,
                                            WebkitTransformOrigin: "left",
                                            transformOrigin: "left",
                                            whiteSpace: "nowrap",
                                            width: "calc(100% - 40px)",
                                            zIndex: 1,
                                          }}
                                        >
                                          Quantité
                                        </Box>
                                        <Box
                                          component="span"
                                          sx={{
                                            marginRight: 0,
                                            display: "inline-block",
                                            color: "#191919",
                                            fontSize: ".875rem",
                                            position: "relative",
                                            boxSizing: "inherit",
                                            WebkitTextSizeAdjust: "100%",
                                          }}
                                        >
                                          <Box
                                            component="select"
                                            id="qtyCartId"
                                            name="qtyCartId"
                                            defaultValue={item?.prodQtee}
                                            // defaultValue={item.prodQtee}
                                            // {...register("itemQtee")}

                                            // {...register("itemQtee", {
                                            {...register(
                                              `cartItemsArray.${index}.itemQtee`,
                                              {
                                                onChange: (e) => {
                                                  onChgCartQtee(e);
                                                },
                                                onBlur: () => {
                                                  setFocus(
                                                    `cartItemsArray.[${index}].itemQtee`
                                                  );
                                                },
                                              }
                                            )}
                                            sx={{
                                              width: "100px",
                                              fontSize: "1em",
                                              lineHeight: "60px",
                                              height: "48px",
                                              WebkitAppearance: "none",
                                              MozAppearance: "none",
                                              appearance: "none",
                                              backgroundColor: "#f7f7f7",
                                              borderRadius: "8px",
                                              border: "1px solid #8f8f8f",
                                              color: "inherit",
                                              padding: "0 32px 0 16px",
                                              verticalAlign: "middle",

                                              " :not(:-internal-list-box)": {
                                                overflow: "visible !important",
                                              },
                                              writingMode:
                                                "horizontal-tb !important",
                                              //
                                              fontWeight: 700,
                                            }}
                                          >
                                            {options}
                                          </Box>
                                          <CustExpandMoreIcon
                                            color="action"
                                            fontSize="small"
                                            sx={{
                                              height: "100%",
                                              pointerEvents: "none",
                                              position: "absolute",
                                              right: "16px",
                                              //right: "8px",
                                              top: 0,
                                              // width: "8px",

                                              " :not(:root)": {
                                                overflowClipMargin:
                                                  "content-box",
                                                overflow: "hidden",
                                              },

                                              color: "#191919",
                                              //fontSize: ".875rem",
                                              WebkitTextSizeAdjust: "100%",
                                              display: "inline-block",
                                              fill: "currentColor",
                                              stroke: "currentColor",
                                              strokeWidth: 0,
                                              verticalAlign: "middle",
                                            }}
                                          />
                                        </Box>
                                      </Box>
                                    </Box>
                                    <Box
                                      component="a"
                                      role="button"
                                      aria-label="Supprimer article du panier"
                                      onClick={clickOpenItem}
                                      sx={{
                                        textDecoration: "underline",
                                        color: "#3665f3",
                                        cursor: "pointer",
                                        ":-webkit-any-link": {
                                          cursor: "pointer",
                                        },
                                        WebkitTextSizeAdjust: "100%",
                                        fontSize: ".875rem",
                                        //fontSize: "small",
                                        //fontWeight: "bold",
                                        //
                                        //backgroundColor: "transparent",
                                      }}
                                    >
                                      Supprimer
                                    </Box>
                                    <Box>
                                      <Dialog
                                        //fullScreen={fullScreen}
                                        // style={{ backgroundColor: "transparent" }}
                                        open={openItem}
                                        onClose={handleCloseItem}
                                        aria-labelledby="responsive-dialog-title"
                                        BackdropProps={{
                                          style: {
                                            background: "rgba(15, 17, 17,0.1)",
                                          },
                                        }}
                                      >
                                        <DialogTitle id="responsive-dialog-title">
                                          {"Retirer du panier"}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            Voulez-vous vraiment supprimer cet
                                            article du panier?
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            autoFocus
                                            onClick={handleCloseItem}
                                          >
                                            Non
                                          </Button>
                                          <Button
                                            //  onClick={removeCartItem}
                                            onClick={() => {
                                              removeCartItem(prodId);
                                            }}
                                            autoFocus
                                          >
                                            Retirer
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </Box>
                                  </Box>
                                </>
                              )}

                              {watchItemQtee >= 10 && (
                                <>
                                  <Box
                                    sx={{
                                      width: "100%",
                                      marginBottom: "1rem",
                                      display: "inline-block!important",
                                      color: "#191919",
                                      fontSize: ".875rem",
                                      WebkitTextSizeAdjust: "100%",
                                      //
                                      // marginTop: "0.5rem!important",
                                      marginTop: "0.25rem!important",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "-webkit-inline-box",
                                        display: "-ms-inline-flexbox",
                                        display: "inline-flex",
                                        WebkitBoxPack: "center",
                                        MsFlexPack: "center",
                                        justifyContent: "center",
                                        WebkitBoxAlign: "center",
                                        MsFlexAlign: "center",
                                        alignItems: "center",
                                        paddingRight: "0.5rem",
                                        color: "#191919",
                                        fontSize: ".875rem",
                                        WebkitTextSizeAdjust: "100%",
                                      }}
                                    >
                                      <Box
                                        component="label"
                                        htmlFor="qtyCartIdUpd"
                                        sx={{
                                          fontSize: ".875rem",
                                          color: errors.cartItemsArray?.[index]
                                            ?.itemQteeUpd
                                            ? "#e0103a"
                                            : "#111820",
                                          marginRight: "0.5rem",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        Quantité
                                      </Box>
                                      <Box
                                        component="span"
                                        sx={{
                                          display: "inline-block",
                                          color: "#f7f7f7",
                                          fontSize: ".875rem",
                                          position: "relative",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        <Box
                                          component="input"
                                          defaultValue={item?.prodQtee}
                                          type="number"
                                          id="qtyCartIdUpd"
                                          min="1"
                                          max={item?.prodQteeDisp}
                                          // {...register("itemQteeUpd")}
                                          {...register(
                                            `cartItemsArray.${index}.itemQteeUpd`,
                                            {
                                              onChange: () => {
                                                checkItemQteeUpd();
                                              },
                                              onBlur: () => {
                                                checkItemQteeUpd();
                                              },
                                            }
                                          )}
                                          sx={{
                                            WebkitAppearance: "none",
                                            MozAppearance: "none",
                                            appearance: "none",
                                            backgroundColor: "#f7f7f7",
                                            borderRadius: "8px",
                                            border: "1px solid #8f8f8f",
                                            WebkitBoxSizing: "border-box",
                                            boxSizing: "border-box",
                                            // color: "#191919",
                                            // color: errors.itemQteeUpd
                                            color: errors.cartItemsArray?.[
                                              index
                                            ]?.itemQteeUpd
                                              ? "#e0103a"
                                              : "#191919",
                                            fontSize: "1em",
                                            height: "40px",
                                            margin: 0,
                                            fontFamily: "inherit",
                                            padding: "0 16px",
                                            verticalAlign: "middle",
                                            width: "90px",
                                            //
                                            // borderColor: errors.itemQteeUpd
                                            borderColor: errors
                                              .cartItemsArray?.[index]
                                              ?.itemQteeUpd
                                              ? "#e0103a"
                                              : "#8f8f8f",

                                            "&:focus": {
                                              //outline: errors.itemQteeUpd
                                              outline: errors.cartItemsArray?.[
                                                index
                                              ]?.itemQteeUpd
                                                ? "none"
                                                : null,
                                              // boxShadow: errors.itemQteeUpd
                                              boxShadow: errors
                                                .cartItemsArray?.[index]
                                                ?.itemQteeUpd
                                                ? "0px 0px 2px #e0103a"
                                                : null,
                                            },
                                            //
                                            fontWeight: 700,
                                          }}
                                        ></Box>
                                        {isLoading ? (
                                          <CircularProgress
                                            size={20}
                                            sx={{
                                              margin: 0,
                                              padding: 0,
                                            }}
                                          />
                                        ) : null}
                                      </Box>

                                      <Box
                                        component="span"
                                        sx={{
                                          height: "22px",
                                          borderRadius: "8px",
                                          boxShadow:
                                            "0 2px 5px 0 rgb(213 217 217 / 50%)",
                                          minWidth: "80px",
                                          background: "#FFD814",
                                          borderColor: "#FCD200",
                                          borderStyle: "solid",
                                          borderWidth: "1px",
                                          cursor: "pointer",
                                          display: "inline-block",
                                          padding: 0,
                                          textAlign: "center",
                                          textDecoration: "none!important",
                                          verticalAlign: "middle",
                                          //
                                          marginLeft: "0.5rem!important",
                                        }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{
                                            height: "20px!important",
                                            borderRadius: "7px",
                                            background: "0 0",
                                            boxShadow: "none",
                                            display: "block",
                                            position: "relative",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                          }}
                                        >
                                          <Box
                                            component="button"
                                            onClick={(e) => onSubmitQteeUpd(e)}
                                            sx={{
                                              /*textDecoration: "underline",
                                          color: "#3665f3",
                                          // marginLeft: "1rem!important",
                                          marginLeft: isLoading
                                            ? 0
                                            : "1rem!important",
                                          cursor: "pointer",

                                          ":-webkit-any-link": {
                                            cursor: "pointer",
                                          },
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          border: 0,
                                          backgroundColor: "transparent",
                                          outline: 0,
                                          textAlign: "center",
                                          whiteSpace: "nowrap",*/
                                              //fontWeight: 700,
                                              /////////////////////////

                                              fontSize: "11px",
                                              height: "20px",
                                              lineHeight: "20px",
                                              padding: "0 6px 0 7px",
                                              color: "#0F1111",
                                              textDecoration: "none!important",
                                              width: "100%",
                                              backgroundColor: "transparent",
                                              border: 0,
                                              display: "block",
                                              margin: 0,
                                              outline: 0,
                                              textAlign: "center",
                                              whiteSpace: "nowrap",
                                              cursor: "pointer",

                                              ":-webkit-any-link": {
                                                cursor: "pointer",
                                              },
                                              //
                                              fontWeight: 700,
                                            }}
                                          >
                                            Modifier
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Backdrop
                                        sx={{
                                          color: "#fff",
                                          //color: "transparent",

                                          zIndex: (theme) =>
                                            theme.zIndex.drawer + 1,
                                          //
                                          position: "absolute",
                                        }}
                                        open={isLoading}
                                        onClick={handleCloseBackdrop}
                                      ></Backdrop>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "inline-block",
                                        height: "1rem",
                                        margin: "1px 8px",
                                        width: "1px",
                                        backgroundColor: "#ddd",
                                        verticalAlign: "middle",
                                      }}
                                    ></Box>

                                    <Box
                                      component="a"
                                      role="button"
                                      onClick={clickOpenItem}
                                      sx={{
                                        textDecoration: "underline",
                                        color: "#3665f3",
                                        //marginLeft: "1rem!important",
                                        marginLeft: "0.5rem!important",
                                        cursor: "pointer",

                                        ":-webkit-any-link": {
                                          cursor: "pointer",
                                        },
                                        fontSize: ".875rem",
                                        WebkitTextSizeAdjust: "100%",
                                      }}
                                    >
                                      Supprimer
                                    </Box>

                                    <Box>
                                      <Dialog
                                        open={openItem}
                                        onClose={handleCloseItem}
                                        aria-labelledby="responsive-dialog-title"
                                        BackdropProps={{
                                          style: {
                                            background: "rgba(15, 17, 17,0.1)",
                                          },
                                        }}
                                      >
                                        <DialogTitle id="responsive-dialog-title">
                                          {"Retirer du panier"}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            Voulez-vous vraiment supprimer cet
                                            article du panier?
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            autoFocus
                                            onClick={handleCloseItem}
                                          >
                                            Non
                                          </Button>
                                          <Button
                                            //onClick={removeCartItem}
                                            onClick={() => {
                                              removeCartItem(prodId);
                                            }}
                                            autoFocus
                                          >
                                            Retirer
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </Box>
                                    <Box
                                      sx={{
                                        marginTop: "0.5rem",
                                        fontSize: ".75rem",
                                        color: "#e62048",
                                      }}
                                    >
                                      {
                                        errors.cartItemsArray?.[index]
                                          ?.itemQteeUpd?.message
                                      }

                                      {/* {errors.itemQteeUpd?.message} */}
                                    </Box>
                                  </Box>
                                </>
                              )}
                            </>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      );
    };

    const AllCartItems = () => {
      // const methods = useFormContext();
      const {
        control,
        handleSubmit,
        getValues,
        formState: { errors },
      } = useFormContext();
      const { fields, append } = useFieldArray({
        control,
        name: "cartItemsArray",
      });

      return (
        <Box>
          {fields.map((item, index) => (
            <HandlesCartItem
              key={item.id}
              // key={item.prodId}
              cartItemId={item.prodId}
              index={index}
            />
          ))}
        </Box>
      );
    };

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    const VerifPanier = () => {
      const CartItems = () => {
        /*const qtUpdSchema = yup.object().shape({
          cartItemsArray: yup.array().of(
            yup.object().shape({
              itemQteeDisp: yup.number().nullable(),
              itemQtee: yup
                .number()
                .transform((value) => (isNaN(value) ? undefined : value))
                .required("Veuillez saisir la quantitée")
                .nullable(),
              itemQteeUpd: yup
                .number()
                .transform((value) => (isNaN(value) ? undefined : value))
                .required("Veuillez saisir la quantitée")
                .min(1, "La quantitée saisie est invalide")
                .max(
                  yup.ref("itemQteeDisp"),
                  ({ max }) => `La quantitée maximale disponible est : ${max}`
                )
                .nullable(),
            })
          ),
        });

        const methods = useForm({
          resolver: yupResolver(qtUpdSchema),
          defaultValues: {
            cartItemsArray:
              cart.map((item) => {
                return {
                  prodId: item.prodId,
                  itemQtee: item.prodQtee,
                  itemQteeUpd: item.prodQtee,

                  itemQteeDisp: item.prodQteeDisp,
                };
              }) ?? "",
          },
          mode: "onChange",
          // reValidateMode: "onBlur",
          //reValidateMode: "onChange",
          //mode: "onBlur",
        });

        const onSubmit = async (data, e) => {
          e.preventDefault();
        };*/

        return (
          <>
            {/*  <FormProvider {...methods}>
              <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}> */}
            <AllCartItems />

            {/* <Box
                  sx={{
                    WebkitBoxOrient: "horizontal",

                    margin: 0,

                    marginBottom: "1rem",
                  }}
                >
                  <Box
                    sx={{
                      color: "#191919",
                      fontSize: ".875rem",

                      textAlign: "center",

                      maxWidth: "1000px",
                      margin: "30px auto 15px",
                      whiteSpace: "nowrap",
                      lineHeight: 0,
                    }}
                  >
                    <Box
                      component="button"
                      type="submit"
                      // disabled={ordersIsLoading}
                      sx={{
                        minWidth: "7rem",
                        border: "1px solid",

                        backgroundColor: "#FFD814",

                        borderColor: "#FCD200",

                        color: "#0F1111",
                        fontWeight: 700,
                        WebkitBoxSizing: "border-box",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        margin: 0,
                        marginRight: "1rem",
                        textAlign: "center",
                        textDecoration: "none",
                        verticalAlign: "bottom",
                        borderRadius: "20px",
                        display: "inline-block",
                        fontSize: ".875rem",
                        minHeight: "40px",
                        padding: "9.5px 20px",
                        cursor: "pointer",
                        //
                        width: "40%",
                        fontWeight: 500,
                      }}
                    >
                      Confirmer et payer
                    </Box>
                  </Box>
                </Box> */}

            <Box
            //id={"el"}
            //ref={el}
            ></Box>
            {/* </Box>
            </FormProvider> */}
          </>
        );
      };

      return (
        <Box
          component="section"
          sx={{
            marginBottom: "1rem",
            padding: 0,

            "@media screen and (min-width: 576px)": {
              // border: "1px solid #e5e5e5",
            },

            backgroundColor: "#fff",
            position: "relative",
            background: "#fff",
            color: "#191919",

            fontSize: ".875rem",
            WebkitTextSizeAdjust: "100%",
            //

            marginRight: 0,
            marginLeft: 0,
            marginTop: "14px!important",
            width: "100%",
            /* maxWidth: "968px",

            "@media screen and (min-width: 576px)": {
              maxWidth: "540px",
            },

            "@media screen and (min-width: 768px)": {
              maxWidth: "720px",
            },

            "@media screen and (min-width: 992px)": {
              maxWidth: "960px",
            },

            "@media screen and (min-width: 1200px)": {
              maxWidth: "1140px",
            },*/
          }}
        >
          <Box
            sx={{
              boxSizing: "inherit",
              display: "block",
              color: "#191919",
              fontSize: ".875rem",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <CartItems />
          </Box>
        </Box>
      );
    };

    return (
      <Box>
        {/*  {isLoading && !isNavCheckout && !isNavSignIn && ( */}
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
              //  zIndex: "9999",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}

        <Box
          sx={{
            backgroundColor: "#EAEDED!important",
            minWidth: "998px",
            padding: "14px 18px 18px",
            margin: "0 auto",
            WebkitTextSizeAdjust: "100%",
          }}
        >
          <Box
            sx={{
              marginBottom: "0!important",
            }}
          >
            <Box
              sx={
                {
                  /*  paddingLeft: 0,
          overflow: 'hidden',
          zoom:1,
          width: 'auto',*/
                }
              }
            >
              <Box
                sx={{
                  position: "relative",
                  padding: 0,

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
                    width: "300px",
                    float: "right",
                    position: "relative",
                    overflow: "visible",
                    zoom: 1,
                    minHeight: "1px",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      visibility: "visible",
                      marginTop: "0!important",
                      marginBottom: "20px",
                      backgroundColor: "#FFF",
                      overflow: "auto",
                      padding: "20px 0 15px 0",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "0 20px",

                        "&:last-child": {
                          paddingBottom: "5px",
                        },

                        position: "relative",
                        overflow: "hidden",
                        visibility: "visible",
                      }}
                    >
                      <Box
                        // component="form"
                        //   method="get"
                        sx={{
                          marginBottom: "14px",
                          //  display: "block",
                          //  marginTop: "0em",
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              "&:last-child": {
                                marginBottom: 0,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                marginBottom: "4px!important",
                                width: "100%",
                                //
                                // hyphens: "none",
                                // overflowWrap: "anywhere",

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
                                component="span"
                                sx={{
                                  textRendering: "optimizeLegibility",
                                  fontSize: "18px!important",
                                  lineHeight: "24px!important",
                                  //
                                  //  hyphens: "manual",

                                  //  overflowWrap: "anywhere",
                                  fontWeight: 500,
                                }}
                              >
                                Sous-total ({getItemsCount()}
                                &nbsp;articles):&nbsp;
                              </Box>

                              <Box
                                component="span"
                                sx={{
                                  whiteSpace: "nowrap",
                                  color: "#B12704!important",
                                  fontWeight: "700!important",
                                }}
                              >
                                &nbsp;
                                <Box
                                  component="span"
                                  sx={{
                                    whiteSpace: "nowrap",
                                    color: "#0F1111!important",
                                    textRendering: "optimizeLegibility",
                                    fontSize: "18px!important",
                                    lineHeight: "24px!important",
                                    fontWeight: "700!important",
                                  }}
                                >
                                  {TotalCartPrice}&nbsp;Dhs
                                </Box>
                              </Box>
                            </Box>

                            <Box component="span">
                              <Box
                                component="span"
                                sx={{
                                  borderRadius: "8px",
                                  boxShadow:
                                    "0 2px 5px 0 rgb(213 217 217 / 50%)",
                                  width: "100%!important",
                                  background: "#FFD814",
                                  borderColor: "#FCD200",
                                  borderStyle: "solid",
                                  borderWidth: "1px",
                                  cursor: "pointer",
                                  display: "inline-block",
                                  padding: 0,
                                  textAlign: "center",
                                  textDecoration: "none!important",
                                  verticalAlign: "middle",
                                  //
                                  marginTop: "1rem",
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
                                  }}
                                >
                                  <Box
                                    component="input"
                                    // name="proceedToRetailCheckout"
                                    type="submit"
                                    // type="button"
                                    //  value="Proceed to checkout"
                                    //onClick={clickDialogCheckout}
                                    disabled={
                                      // isLoading || isNavCheckout || isNavSignIn
                                      isLoading
                                    }
                                    //onClick={() => {
                                    // router.push({
                                    //  pathname: "/checkout",
                                    //  });
                                    // }}
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
                                      visibility: "visible",
                                    }}
                                  ></Box>

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
                                      //
                                      fontSize: "14px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        marginBottom: "0!important",
                                        color: "#0F1111",
                                        fontSize: "13px",
                                        lineHeight: "29px",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Box>Passer la commande</Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                            <>
                              {openDialogCheckout &&
                                !session &&
                                !session?.user && <DialogCheckout />}
                            </>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box
                  sx={{
                    float: "none",
                    overflow: "hidden",
                    zoom: 1,
                    width: "auto",
                    paddingRight: "20px!important",
                    position: "relative",
                    minHeight: "1px",
                  }}
                >
                  <Box
                    sx={{
                      marginTop: "0!important",
                      marginBottom: "20px",
                      backgroundColor: "#FFF",
                      overflow: "auto",
                      padding: "20px 0 15px 0",
                    }}
                  >
                    <Box
                      sx={{
                        padding: "0 20px",

                        "&:last-child": {
                          paddingBottom: "5px",
                        },

                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          marginBottom: "-10px",
                          width: "100%",

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
                            width: "100%",

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
                            component="h1"
                            sx={{
                              margin: 0,
                              // marginBottom: "1rem",
                              fontSize: "1.875rem",
                              fontWeight: 700,
                              width: "60%",
                              float: "left",
                              display: "block",
                              // font-size: 2em;
                              marginBlockStart: "0.67em",
                              //marginBlockEnd: "0.67em",
                              marginInlineStart: "0px",
                              marginInlineEnd: "0px",
                            }}
                          >
                            Votre panier
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        // component="form"
                        //method="post"
                        sx={{
                          marginBottom: "14px",
                          display: "block",
                          marginTop: "0em",
                        }}
                      >
                        <Box
                          sx={{
                            borderBottom: "1px solid #DDD",
                            marginBottom: "0!important",
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",

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
                                marginRight: 0,
                                float: "right",
                                width: "14.948%",
                                minHeight: "1px",
                                overflow: "visible",
                                textAlign: "right!important",
                                marginTop: "4px!important",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  color: "#565959!important",
                                  textAlign: "right!important",
                                }}
                              >
                                Prix
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            marginBottom: "4px!important",
                            //
                            borderBottom: "1px solid #DDD!important",
                          }}
                        >
                          {cart.length === 0 ? (
                            <h1>Votre panier est vide!</h1>
                          ) : (
                            <VerifPanier />
                          )}
                        </Box>
                        <Box
                          sx={{
                            textAlign: "right",
                            marginBottom: "4px!important",
                            width: "100%",

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
                            component="span"
                            sx={{
                              textRendering: "optimizeLegibility",
                              fontSize: "18px!important",
                              lineHeight: "24px!important",
                              textAlign: "right",
                              color: "#0F1111",
                              //
                              // fontSize: '1.25rem',
                              // fontWeight: 400,
                              fontWeight: 500,

                              // fontFamily: '"Market Sans", Arial, sans-serif',
                            }}
                          >
                            Sous-total&nbsp;({getItemsCount()}&nbsp; articles):
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              color: "#B12704!important",
                              fontWeight: "700!important",
                              textAlign: "right",
                              // fontFamily: "Arial,sans-serif",
                            }}
                          >
                            &nbsp;
                            <Box
                              component="span"
                              sx={{
                                whiteSpace: "nowrap",
                                color: "#0F1111!important",
                                textRendering: "optimizeLegibility",
                                fontSize: "18px!important",
                                lineHeight: "24px!important",
                                fontWeight: "700!important",
                                textAlign: "right",
                              }}
                            >
                              {TotalCartPrice}&nbsp;Dhs
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

  return (
    <>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
          <HandlesCart cart={cart} />
        </Box>
      </FormProvider>
    </>
  );
};

export default Cart;
