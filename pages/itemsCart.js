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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const Checkout = () => {
  /*const optionModePay = useRef(null);
  const methodsCheckout = useForm({
    defaultValues: {
      showCarteBancaire: "No",
      showAdresseLiv: "No",
      showAdresseFact: "No",
      optModepaiement: optionModePay.current,
      goAdresseFact: false,
      goItemsPanier: false,
    },
  });*/

  // export const HandlesCheckout = () => {
  const HandlesCheckout = () => {
    const router = useRouter();
    const { userId } = router.query;

    const el = useRef(null);

    const cart = useSelector((state) => state.cart.products);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);

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

    // Getting the count of items
    const getItemsCount = () => {
      return cart.reduce((accumulator, item) => accumulator + item.prodQtee, 0);
    };

    const {
      data: userAdr,
      isFetching: userFetching,
      isLoading: userLoading,
      //  isSuccess: userSuccess,
      isError: userIsError,
      error: userError,
    } = useGetUserAdrQuery(userId);

    /*  const {
      register: registerChekout,
      handleSubmit: handleSubmitChekout,
      setValue: setValueChekout,
      control,
    } = useFormContext();*/

    /* const watchModePay = useWatch({
      control,
      name: "optModepaiement",
    });

    const watchGoAdrFact = useWatch({
      control,
      name: "goAdresseFact",
    });

    const watchGoPanier = useWatch({
      control,
      name: "goItemsPanier",
    });*/

    /* const onSubmitChekout = async (data, event) => {
      event.preventDefault();
      alert(JSON.stringify(data));
    };*/

    /*let vFirstName = "";
    let vLastName = "";
    let vAddressLine1 = "";
    let vAddressLine2 = "";
    let vCity = "";
    let vRegion = "";
    let vPostalCode = "";
    let vTel = "";

    let vAdrPrinc1Fact = "";
    let vAdrPrinc2Fact = "";
    let vVilleFact = "";
    let vCodePostalFact = "";
    let vRegionFact = "";
    let vTelFact = "";

    if (userAdr) {
      vFirstName = userAdr.prenom;
      vLastName = userAdr.nom;
      vAddressLine1 = userAdr.adressePrinc1;
      vAddressLine2 = userAdr.adressePrinc2;
      vCity = userAdr.ville;
      vRegion = userAdr.region;
      vPostalCode = userAdr.codePostal;
      vTel = userAdr.tel;
    }

    if (
      userAdr &&
      userAdr.adrPrinc1Fact &&
      // userAdr.adrPrinc2Fact &&
      userAdr.villeFact &&
      // userAdr.codePostalFact &&
      userAdr.regionFact &&
      userAdr.telFact
    ) {
      vAdrPrinc1Fact = userAdr.adrPrinc1Fact;
      vAdrPrinc2Fact = userAdr.adrPrinc2Fact;
      vVilleFact = userAdr.villeFact;
      vCodePostalFact = userAdr.codePostalFact;
      vRegionFact = userAdr.regionFact;
      vTelFact = userAdr.telFact;
    } else if (
      userAdr &&
      userAdr.adressePrinc1 &&
      // userAdr.adressePrinc2 &&
      userAdr.ville &&
      // userAdr.codePostal &&
      userAdr.region &&
      userAdr.tel
    ) {
      vAdrPrinc1Fact = userAdr.adressePrinc1;
      vAdrPrinc2Fact = userAdr.adressePrinc2;
      vVilleFact = userAdr.ville;
      vCodePostalFact = userAdr.codePostal;
      vRegionFact = userAdr.region;
      vTelFact = userAdr.tel;
    }*/

    function CustExpandMoreIcon(props) {
      return (
        <SvgIcon {...props}>
          <KeyboardArrowDownOutlinedIcon />
        </SvgIcon>
      );
    }

    /*const verifOptModePay = () => {
      if (watchModePay === "Card" || watchModePay === "Cash") {
        return true;
      } else {
        return false;
      }
    };*/

    ///////////////////////////////

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
        Math.round(item.prodPrix * 100) / 100
      ).toFixed(2);

      let maxCartQtee = item.prodQteeDisp < 10 ? item.prodQteeDisp : 10;
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

      let isLoading = item.status === "loading";

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

      const removeCartItem = () => {
        dispatch(productRemoved({ prodId }));
      };

      const handleCloseBackdrop = () => {
        let isIdle;
        return (isIdle = item.status === "idle");
      };

      const checkItemQteeUpd = () => {
        if (!isValidQtUpd) {
          setFocus(`cartItemsArray.[${index}].itemQteeUpd`);
        }
      };

      return (
        <>
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
                        maxWidth: "130px",
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
                            position: "relative",
                          }}
                        >
                          <Image
                            src={item.prodImage}
                            alt="Image meilleure vente"
                            // layout="responsive"
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
                        sx={{
                          marginRight: "1rem!important",
                        }}
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
                              }}
                            >
                              {item.prodDesc}
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            color: "#767676",
                            marginBottom: "0.5rem!important",
                            marginTop: "0.25rem!important",
                          }}
                        ></Box>
                      </Box>

                      <Box>
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
                        </Box>

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
                                {...register(`cartItemsArray.${index}.prodId`)}
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
                                        marginTop: "1rem",
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
                                          defaultValue={item.prodQtee}
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
                                              overflowClipMargin: "content-box",
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
                                          onClick={removeCartItem}
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
                                        defaultValue={item.prodQtee}
                                        type="number"
                                        id="qtyCartIdUpd"
                                        min="1"
                                        max={item.prodQteeDisp}
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
                                          color: errors.cartItemsArray?.[index]
                                            ?.itemQteeUpd
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
                                          borderColor: errors.cartItemsArray?.[
                                            index
                                          ]?.itemQteeUpd
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
                                            boxShadow: errors.cartItemsArray?.[
                                              index
                                            ]?.itemQteeUpd
                                              ? "0px 0px 2px #e0103a"
                                              : null,
                                          },
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
                                      component="button"
                                      onClick={(e) => onSubmitQteeUpd(e)}
                                      sx={{
                                        textDecoration: "underline",
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
                                        whiteSpace: "nowrap",
                                        //fontWeight: 700,
                                      }}
                                    >
                                      Modifier
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
                                    component="a"
                                    role="button"
                                    onClick={clickOpenItem}
                                    sx={{
                                      textDecoration: "underline",
                                      color: "#3665f3",
                                      // marginLeft: "1rem!important",
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
                                          onClick={removeCartItem}
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
        };

        return (
          <>
            <FormProvider {...methods}>
              <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
                <AllCartItems />

                <Box
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
                </Box>
                <Box id={"el"} ref={el}></Box>
              </Box>
            </FormProvider>
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
              //border: "1px solid #e5e5e5",
            },

            backgroundColor: "#fff",
            position: "relative",
            background: "#fff",
            color: "#191919",

            fontSize: ".875rem",
            WebkitTextSizeAdjust: "100%",
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
              zIndex: "999999",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
        <Box
          // component="body"
          sx={{
            maxWidth: "980px",
            margin: "0 auto!important",
            minWidth: "780px",
            paddingRight: "1rem",
            paddingLeft: "1rem",
            backgroundColor: "#fff",
            fontSize: ".875rem",
            WebkitTextSizeAdjust: "100%",
            color: "#191919",
          }}
        >
          <Box
            sx={{
              color: "#191919",
              fontSize: ".875rem",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              tabIndex="-1"
              sx={{
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                tabIndex="-1"
                role="main"
                sx={{
                  outline: "0 none",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "968px",
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
                    }}
                  >
                    <Box
                      sx={{
                        paddingLeft: 0,
                        paddingRight: "1rem!important",

                        position: "relative",
                        width: "100%",

                        WebkitBoxFlex: 0,
                        MsFlex: "0 0 58.3333333333%",
                        flex: "0 0 58.3333333333%",
                        maxWidth: "58.3333333333%",

                        "@media screen and (min-width: 992px)": {
                          WebkitBoxFlex: 0,
                          MsFlex: "0 0 66.6666666667%",
                          flex: "0 0 66.6666666667%",
                          maxWidth: "66.6666666667%",
                        },
                      }}
                    >
                      {cart.length === 0 ? (
                        <h1>Votre panier est vide!</h1>
                      ) : (
                        <>
                          <VerifPanier />
                        </>
                      )}
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
      <Box>
        <HandlesCheckout />
      </Box>
    </>
  );
};

export default Checkout;
