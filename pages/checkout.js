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

const adrLivSchema = yup.object().shape({
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
  addressLine1: yup
    .string("L'adresse doit être une chaîne de caractères")
    .max(128, "l'adresse a un maximum de 128 caractères")
    .required("Veuillez saisir l'adresse")
    .nullable(),
  addressLine2: yup
    .string("L'adresse doit être une chaîne de caractères")
    .max(127, "l'adresse a un maximum de 127 caractères")
    .nullable(),
  city: yup
    .string("La ville doit être une chaîne de caractères")
    .max(30, "La ville a un maximum de 30 caractères")
    .required("Veuillez saisir la ville")
    .nullable(),
  region: yup
    .string("La région doit être une chaîne de caractères")
    .required("Veuillez choisir la région")
    .nullable(),
  postalCode: yup
    .string("Le code postal doit être une chaîne de caractères")
    .max(5, "Le code postal a un maximum de 5 caractères")
    .nullable(),
  tel: yup
    .string()
    .required("Veuillez saisir le numéro de téléphone")
    .matches(phoneRegExp, "Le numéro de téléphone est invalide")
    .min(10, "Le numéro de téléphone est invalide")
    .max(10, "Le numéro de téléphone est invalide")
    .nullable(),
  //showAdrLiv: yup.string().required().nullable(),
});

const adrFactSchema = yup.object().shape({
  FaddrLine1: yup
    .string("L'adresse doit être une chaîne de caractères")
    .max(128, "l'adresse a un maximum de 128 caractères")
    .required("Veuillez saisir l'adresse")
    .nullable(),
  FaddrLine2: yup
    .string("L'adresse doit être une chaîne de caractères")
    .max(127, "l'adresse a un maximum de 127 caractères")
    .nullable(),
  Fcity: yup
    .string("La ville doit être une chaîne de caractères")
    .max(30, "La ville a un maximum de 30 caractères")
    .required("Veuillez saisir la ville")
    .nullable(),
  Fregion: yup
    .string("La région doit être une chaîne de caractères")
    .required("Veuillez choisir la région")
    .nullable(),
  FpostalCode: yup
    .string("Le code postal doit être une chaîne de caractères")
    .max(5, "Le code postal a un maximum de 5 caractères")
    .nullable(),
  Ftel: yup
    .string()
    .required("Veuillez saisir le numéro de téléphone")
    .matches(phoneRegExp, "Le numéro de téléphone est invalide")
    .min(10, "Le numéro de téléphone est invalide")
    .max(10, "Le numéro de téléphone est invalide")
    .nullable(),
  //isValidAdrFact: yup.string().required().nullable(),
});

const cardSchema = yup.object().shape({
  cardNumber: yup
    .string("Le numéro de carte doit être une chaîne de caractères")
    .max(19, "Le numéro de carte a un maximum de 19 caractères")
    .required("Veuillez saisir le numéro de votre catre")
    .nullable(),
  lastName: yup
    .string("Le nom doit être une chaîne de caractères")
    .max(25, "Le nom a un maximum de 25 caractères")
    .required("Veuillez saisir votre nom")
    .nullable(),
  firstName: yup
    .string("Le prénom doit être une chaîne de caractères")
    .max(25, "Le prénom a un maximum de 25 caractères")
    .required("Veuillez saisir votre prénom")
    .nullable(),
  expDateMonth: yup
    .string()
    .required("Veuillez saisir le mois d'expiration")
    .nullable(),
  expDateYear: yup
    .string()
    .required("Veuillez saisir l'année d'expiration")
    .nullable(),
  securityCode: yup
    .string()
    .max(4, "Le code de sécurité a un maximum de 4 caractères")
    .required("Veuillez saisir le code de sécurité")
    .nullable(),
  addrLine1: yup
    .string("L'adresse doit être une chaîne de caractères")
    .max(128, "l'adresse a un maximum de 128 caractères")
    .required("Veuillez saisir l'adresse")
    .nullable(),
  addrLine2: yup
    .string("L'adresse doit être une chaîne de caractères")
    .max(127, "l'adresse a un maximum de 127 caractères")
    .nullable(),
  city: yup
    .string("La ville doit être une chaîne de caractères")
    .max(30, "La ville a un maximum de 30 caractères")
    .required("Veuillez saisir la ville")
    .nullable(),
  region: yup
    .string("La région doit être une chaîne de caractères")
    .required("Veuillez choisir la région")
    .nullable(),
  postalCode: yup
    .string("Le code postal doit être une chaîne de caractères")
    .max(5, "Le code postal a un maximum de 5 caractères")
    .nullable(),
  tel: yup
    .string()
    .required("Veuillez saisir le numéro de téléphone")
    .matches(phoneRegExp, "Le numéro de téléphone est invalide")
    .min(10, "Le numéro de téléphone est invalide")
    .max(10, "Le numéro de téléphone est invalide")
    .nullable(),
  showAdrFactField: yup.boolean().required().nullable(),
});

export const Checkout = () => {
  const optionModePay = useRef(null);
  const methodsCheckout = useForm({
    defaultValues: {
      showCarteBancaire: "No",
      showAdresseLiv: "No",
      showAdresseFact: "No",
      optModepaiement: optionModePay.current,
      // validAdrFact: true,
      // validCartItQt: true,
      // validModePay: false,
      // confirmerPayer: true,
      goAdresseFact: false,
      goItemsPanier: false,
    },
  });

  /* const onSubmitCheck = (data) => {
    alert(JSON.stringify(data));
  };*/

  // export const HandlesCheckout = () => {
  const HandlesCheckout = () => {
    const router = useRouter();
    const { userId } = router.query;

    alert(`Dimanche checkout 2 userId: ${userId}`);
    //console.log("Samedi checkout userId : ", userId);
    //const userId = 264;

    const dateLiv = "28/04/2023";
    const methodLiv = "Livraison à domicile";
    // Montant livraison
    const mtLiv = 10;
    const expediePar = "Dimapromo";

    const el = useRef(null);

    const cart = useSelector((state) => state.cart.products);
    const dispatch = useDispatch();

    const cartOrder = useSelector((state) =>
      state.cart.products.map((item) => ({
        prodImage: item.prodImage,
        prodDesc: item.prodDesc,
        prodQtee: item.prodQtee,
        prodPrix: item.prodPrix,
      }))
    );

    const [openFact, setOpenFact] = useState(false);
    const [openLiv, setOpenLiv] = useState(false);
    const [openCarteBq, setOpenCarteBq] = useState(false);
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

    const scrollY = useScrollY();

    const cartMtLiv = parseFloat(Math.round(mtLiv * 100) / 100).toFixed(2);
    //const cartMtLiv2 = parseFloat(Math.round(mtLiv * 100) / 100);

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

    let totalCommande = getTotalPrice() + mtLiv;

    const carttotalCommande = parseFloat(
      Math.round(totalCommande * 100) / 100
    ).toFixed(2);

    const carttotalCommande2 = parseFloat(
      Math.round(totalCommande * 100) / 100
    );

    const carttotalCommandeForm = "Dhs " + carttotalCommande.toString();

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

    const [editUserAdrFact, { isLoading: factIsLoading }] =
      useEditUserAdrFactMutation();

    const {
      register: registerChekout,
      handleSubmit: handleSubmitChekout,
      setValue: setValueChekout,
      // watch: watchChekout,
      // getValues: getValuesChekout,
      // setFocus: setFocusChekout,
      control,
    } = useFormContext();

    const watchCarteBancaire = useWatch({
      control,
      name: "showCarteBancaire",
    });

    const watchAdresseLiv = useWatch({
      control,
      name: "showAdresseLiv",
    });

    const watchAdresseFact = useWatch({
      control,
      name: "showAdresseFact",
    });

    const watchModePay = useWatch({
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
    });

    useEffect(() => {
      if (watchGoPanier) {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          // behavior: 'smooth'
        });
      }
    }, [watchGoPanier]);

    useEffect(() => {
      if (watchGoAdrFact) {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          // behavior: 'smooth'
        });
      }
    }, [watchGoAdrFact]);

    const onSubmitChekout = async (data, event) => {
      event.preventDefault();
      alert(JSON.stringify(data));
    };

    let vFirstName = "";
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
    }

    function CustExpandMoreIcon(props) {
      return (
        <SvgIcon {...props}>
          <KeyboardArrowDownOutlinedIcon />
        </SvgIcon>
      );
    }

    const verifOptModePay = () => {
      if (watchModePay === "Card" || watchModePay === "Cash") {
        return true;
      } else {
        return false;
      }
    };

    const StepToComplete = ({ stepNotDone }) => {
      return (
        <>
          {cart.length !== 0 && (
            <Box
              sx={{
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
                color: "#191919",
              }}
            >
              <Box
                sx={{
                  color: "#dd1e31",
                  textAlign: "center!important",
                  marginBottom: "1rem!important",
                  marginTop: "1rem!important",
                  fontSize: ".875rem",
                  WebkitTextSizeAdjust: "100%",
                  //
                  fontWeight: 500,
                }}
              >
                {stepNotDone}
              </Box>
            </Box>
          )}
        </>
      );
    };

    const MainNotice = ({ notice }) => {
      return (
        <>
          {cart.length !== 0 && (
            <Box
              sx={{
                WebkitBoxSizing: "inherit",
                boxSizing: "inherit",
                display: "block",
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                component="section"
                sx={{
                  marginTop: "2px",

                  "@media screen and (min-width: 601px)": {
                    margin: "16px 0",
                  },

                  display: "grid",
                  gridTemplateColumns: "32px auto auto auto",

                  backgroundColor: "#e0103a",

                  borderColor: "#e0103a",

                  //border: "1px solid #363636",
                  border: "1px solid#e5e5e5",
                  color: "#fff",
                  fontSize: ".875rem",
                  padding: "16px",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                <Box
                  sx={{
                    gridColumn: 1,
                    gridRow: 1,
                    paddingRight: "16px",
                    color: "#fff",
                    fontSize: ".875rem",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <InfoIcon
                    fontSize="small"
                    focusable="false"
                    aria-label="Priority"
                    role="img"
                  />
                </Box>
                <Box
                  sx={{
                    gridColumn: 2,
                    gridRow: 1,
                    paddingRight: "16px",
                    color: "#fff",
                    fontSize: ".875rem",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="h2"
                    sx={{
                      margin: 0,
                      fontSize: ".875rem",
                      fontWeight: 400,
                      color: "#fff",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: ".875rem",
                        //fontWeight: 400,
                        fontWeight: 500,
                        color: "#fff",
                      }}
                    >
                      {notice}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      );
    };

    ///////////////////////////////

    const HandlesCartItem = ({ cartItemId, index }) => {
      // const HandlesCartItem = () => {
      // let renderCount = 0;

      // renderCount++;

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

        if (canSaveAdrLiv && prodQuantity <= item?.prodQteeDisp) {
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

      const removeCartItem = () => {
        dispatch(productRemoved({ prodId }));
      };

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
                              src={item?.prodImage}
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
                                {item?.prodDesc}
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
        <Box
        //  component="form"
        // onSubmit={handleSubmit(onSubmit)}
        //  onSubmit={handleSubmit(onSubmit)}
        // onSubmit={handleSubmit((data) => console.log(data))}
        >
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

    const AdrFactForm = () => {
      const {
        register,
        handleSubmit,
        getValues,
        // setFocus,
        // getFieldState,
        // setValue,
        //control,
        //watch,
        //reset,
        // formState,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(adrFactSchema),
        defaultValues: {
          FaddrLine1: vAdrPrinc1Fact,
          FaddrLine2: vAdrPrinc2Fact,
          Fcity: vVilleFact,
          Fregion: vRegionFact,
          FpostalCode: vCodePostalFact,
          Ftel: vTelFact,
        },
        //
        mode: "onChange",
        // reValidateMode: "onBlur",
        reValidateMode: "onChange",
        shouldFocusError: true,
      });

      const clickOpenFact = () => {
        setOpenFact(true);
      };

      const handleCloseFact = () => {
        setOpenFact(false);
      };
      ///////////////////

      //useEffect(() => {}, [isValid, setValueChekout, getValuesChekout]);

      /*const [editUserAdrFact, { isLoading: factIsLoading }] =
        useEditUserAdrFactMutation();*/

      const onSubmit = async (data, event) => {
        event.preventDefault();
        event.stopPropagation();

        let adrPrinc1Fact = getValues("FaddrLine1");
        let adrPrinc2Fact = getValues("FaddrLine2");
        let villeFact = getValues("Fcity");
        let regionFact = getValues("Fregion");
        let codePostalFact = getValues("FpostalCode");
        let telFact = getValues("Ftel");

        const canSaveAdrFact =
          [
            adrPrinc1Fact,
            // adrPrinc2Fact,
            villeFact,
            regionFact,
            // codePostalFact,
            telFact,
            userId,
          ].every(Boolean) && !factIsLoading;

        if (canSaveAdrFact) {
          try {
            await editUserAdrFact({
              userId,
              adrPrinc1Fact,
              adrPrinc2Fact,
              villeFact,
              regionFact,
              codePostalFact,
              telFact,
            }).unwrap();
          } catch (err) {
            console.error(
              "Un probleme est survenu pour enregistrer cette adresse de facturation: ",
              err
            );
          } finally {
            setValueChekout("showCarteBancaire", "No");
            setValueChekout("showAdresseLiv", "No");
            setValueChekout("showAdresseFact", "No");

            /* setValueChekout("confirmerPayer", confirmerEtPayer);*/
            handleCloseFact();
          }
        }
      };

      const regionsOptions = [
        "Tanger-Tétouan-Al Hoceima",
        "L'Oriental",
        "Fès-Meknès",
        "Beni Mellal-Khénifra",
        "Rabat-Salé-Kénitra",
        "Casablanca-Settat",
        "Marrakech-Safi",
        "Drâa-Tafilalet",
        "Souss-Massa",
        "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra",
        "Dakhla-Oued Ed Dahab",
      ];

      const regionsSelect = regionsOptions.map((opt, index) => (
        <Box component="option" value={opt} key={index}>
          {opt}
        </Box>
      ));

      /////////////////////////////////////////////////////////
      const goVerifPanier = () => {
        if (
          userAdr &&
          userAdr.adrPrinc1Fact &&
          userAdr.villeFact &&
          userAdr.regionFact &&
          userAdr.telFact
        ) {
          setValueChekout("goItemsPanier", true);
          /*if (el.current) {
          el.current.scrollIntoView({
            //behavior: "smooth",
            block: "end",
            //  inline: "nearest",
          });
        }*/
          /*  window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            // behavior: 'smooth'
          });*/
        } else {
          setValueChekout("goItemsPanier", false);
        }
      };

      const allItemsPanier = (
        <Box
          sx={{
            // marginTop: "-1px",
            marginTop: "1rem",
            overflow: "hidden",
            display: "block",
            backgroundColor: "#fff",
            border: "1px #D5D9D9 solid",
            fontSize: "14px",
            lineHeight: "20px",
            WebkitTextSizeAdjust: "100%",
            color: "#0F1111",
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              padding: "12px 18px 11px",
              background: "#F0F2F2",
              fontWeight: 700,
              position: "relative",
              MozBoxSizing: "border-box",
              WebkitBoxSizing: "border-box",
              boxSizing: "border-box",
              display: "block",
              color: "#0F1111",
              fontSize: "14px",
              lineHeight: "20px",
              WebkitTextSizeAdjust: "100%",
              //
              paddingLeft: "1rem",
            }}
          >
            <Box
              // component="span"
              component="button"
              role="button"
              aria-label="Allez a l'étape suivante pour verifier les objets"
              onClick={() => {
                goVerifPanier();
              }}
              sx={{
                borderRadius: "8px",
                boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
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
                fontWeight: 700,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
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
                  fontWeight: 700,
                  color: "#0F1111",
                  fontSize: "14px",
                  lineHeight: "20px",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                <Box
                  //component="input"

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
                    fontFamily: "inherit",
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    textAlign: "center!important",
                    fontWeight: 700,
                  }}
                >
                  Facturer à cette adresse
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );

      /////////////////////////////////////////////////////////

      const ajouterAdresseFacturation = (
        <Box
          sx={{
            "&:last-child": {
              borderBottom: 0,
            },
            boxSizing: "inherit",
            display: "block",
            fontSize: ".875rem",
            color: "#191919",
            WebkitTextSizeAdjust: "100%",
          }}
        >
          <Box
            sx={{
              // padding: "1rem",
              background: "#fff",
              //borderBottom: '1px solid #e5e5e5',
              lineHeight: "1.25rem",
              //
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                boxSizing: "inherit",
                display: "block",
                lineHeight: "1.25rem",
              }}
            >
              <Box
                component="span"
                sx={{
                  boxSizing: "inherit",
                  lineHeight: "1.25rem",
                  fontSize: ".875rem",
                  color: "#191919",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    lineHeight: "1.25rem",
                    fontSize: ".875rem",
                    color: "#191919",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="a"
                    onClick={() => {
                      setValueChekout("showCarteBancaire", "No");
                      setValueChekout("showAdresseLiv", "No");
                      setValueChekout("showAdresseFact", "Yes");
                      clickOpenFact();
                    }}
                    sx={{
                      marginBottom: "0.5rem",
                      textDecoration: "underline",
                      color: "#3665f3",
                      marginTop: "0.5rem",
                      boxSizing: "inherit",
                      cursor: "pointer",

                      ":-webkit-any-link": {
                        cursor: "pointer",
                      },

                      lineHeight: "1.25rem",
                      fontSize: ".875rem",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    Ajouter une adresse de facturation
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );

      return (
        <Box
          component="section"
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            padding: "1rem",
            position: "relative",
            border: "1px solid #e5e5e5",
            background: "#fff",
            paddingRight: 0,
            paddingLeft: 0,
          }}
        >
          {/* <Box
            sx={{
              display: "none",
            }}
          >
            <input {...register("isValidAdrFact")} />
          </Box> */}

          <Box>
            <Box
              component="span"
              sx={{
                paddingLeft: "1rem",
                // paddingBottom: "1rem",
                // fontSize: "medium",
                fontSize: "0.875 rem",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              <Box component="h3">
                <Box component="span">
                  <Box component="span">
                    <Box
                      component="span"
                      aria-hidden="true"
                      sx={{
                        boxSizing: "inherit",
                        fontSize: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      3. Adresse de facturation
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        border: 0,
                        clip: "rect(1px,1px,1px,1px)",
                        height: "1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        whiteSpace: "nowrap",
                        width: "1px",
                      }}
                    >
                      Sélectionner une adresse de facturation
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                boxSizing: "inherit",
                display: "block",
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              {/* {adresseLivraison.showAdrLiv && (  */}
              {/* {(watchShowAdrFact !== "Yes" || watchAdresseLiv !== "Yes") && ( */}
              {(watchAdresseFact !== "Yes" || !openFact) && (
                <Box
                  sx={{
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                  }}
                >
                  <Box
                    sx={{
                      lineHeight: "1.25rem",
                    }}
                  >
                    <Box
                      sx={{
                        display: "none",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          boxSizing: "inherit",
                          lineHeight: "1.25rem",
                        }}
                      >
                        <Box component="span">
                          <Box
                            component="span"
                            sx={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                          >
                            Adresse de facturation
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {userIsError ? (
                      <>{userError.toString()}</>
                    ) : userLoading ? (
                      // <>Loading...</>
                      <CircularProgress size={20} />
                    ) : userFetching ? (
                      <CircularProgress size={20} />
                    ) : //        <>Loading...</>
                    userAdr ? (
                      <Box
                        sx={{
                          fontSize: ".875rem",
                        }}
                      >
                        {vAdrPrinc1Fact && <AdrLiv adrvalue={vAdrPrinc1Fact} />}
                        {vAdrPrinc2Fact && <AdrLiv adrvalue={vAdrPrinc2Fact} />}
                        {vVilleFact && <AdrLiv adrvalue={vVilleFact} />}
                        {vRegionFact && <AdrLiv adrvalue={vRegionFact} />}
                        {vCodePostalFact && (
                          <AdrLiv adrvalue={vCodePostalFact} />
                        )}
                        {vTelFact && <AdrLiv adrvalue={vTelFact} />}
                      </Box>
                    ) : null}
                  </Box>

                  {userAdr &&
                  // vFirstName &&
                  //  vLastName &&
                  vAdrPrinc1Fact &&
                  vVilleFact &&
                  vRegionFact &&
                  vTelFact ? (
                    /* vAddressLine1 &&
                  vCity &&
                  vRegion &&
                  vTel */ <Box
                      component="span"
                      sx={{
                        boxSizing: "inherit",
                        color: "#191919",
                        fontSize: ".875rem",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      <Box component="span">
                        <Box
                          component="a"
                          role="button"
                          aria-label="Modifier l'adresse de facturation"
                          onClick={() => {
                            setValueChekout("showCarteBancaire", "No");
                            setValueChekout("showAdresseLiv", "No");
                            setValueChekout("showAdresseFact", "Yes");
                            clickOpenFact();
                          }}
                          sx={{
                            textDecoration: "underline",
                            color: "#3665f3",
                            cursor: "pointer",

                            ":-webkit-any-link": {
                              cursor: "pointer",
                            },

                            fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            //
                            fontWeight: "bold",
                          }}
                        >
                          Modifier
                        </Box>
                      </Box>
                    </Box>
                  ) : null}
                  {/*  {userAdr && !vAddressLine1 && !vCity && !vRegion && !vTel */}
                  {userAdr &&
                  !vAdrPrinc1Fact &&
                  !vVilleFact &&
                  !vRegionFact &&
                  !vTelFact
                    ? ajouterAdresseFacturation
                    : null}
                </Box>
              )}
            </Box>

            {/* {adresseLivraison.showModAdrLiv && ( */}
            {/* {watchShowAdrFact === "Yes" && (*/}
            {(watchAdresseFact === "Yes" || openFact) && (
              <Dialog
                // openFact={openFact || watchAdresseFact === "Yes"}
                // open={openFact || watchAdresseFact === "Yes"}
                open={openFact}
                onClose={handleCloseFact}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogContent>
                  <DialogTitle>Adresse de facturation</DialogTitle>

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
                      sx={{
                        transition: "height 203.75ms ease-in-out 0s",
                        //height: "413px",
                        overflow: "visible",
                        //
                        height: "300px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          marginTop: "1rem",
                          borderTop: "1px solid #e5e5e5",
                          overflow: "visible",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            overflow: "hidden",
                            zIndex: "-1",
                            visibility: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                              overflow: "hidden",
                              zIndex: "-1",
                              visibility: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: "0px",
                                top: "0px",
                                width: "624px",
                                height: "423px",
                              }}
                            ></Box>
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                              overflow: "hidden",
                              zIndex: "-1",
                              visibility: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: "0px",
                                top: "0px",
                                width: "200%",
                                height: "200%",
                              }}
                            ></Box>
                          </Box>
                        </Box>
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
                            sx={{
                              display: "block!important",
                            }}
                          >
                            <Box
                              sx={{
                                padding: 0,
                                marginTop: "1rem",
                                background: "#fff",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "block!important",
                                }}
                              >
                                <Box
                                  component="form"
                                  name="adresse-facturation-cart"
                                  id="adresse-facturation-cart"
                                  autoComplete="off"
                                  onSubmit={handleSubmit(onSubmit)}
                                  sx={{
                                    margin: 0,
                                    paddingRight: "1rem",
                                    paddingLeft: "1rem",
                                    padding: 0,
                                    marginTop: "1rem",
                                    background: "#fff",
                                  }}
                                >
                                  <Box
                                    component="section"
                                    sx={{
                                      padding: 0,
                                      marginBottom: 0,
                                      border: 0,
                                      position: "relative",
                                      background: "#fff",
                                    }}
                                  >
                                    <Box>
                                      <Box
                                        sx={{
                                          display: "-webkit-box",
                                          display: "-ms-flexbox",
                                          display: "flex",
                                          WebkitBoxOrient: "horizontal",
                                          WebkitBoxDirection: "normal",
                                          MsFlexDirection: "row",
                                          flexDirection: "row",
                                          gap: "0.5rem",
                                          padding: "0 0.5rem",
                                          tableLayout: "fixed",
                                          width: "100%",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          paddingLeft: "1rem",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                            WebkitBoxDirection: "normal",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="FaddrLine1"
                                              sx={{
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                //WebkitTransform: "translateY(16px)",
                                                //transform:"translateY(16px)",

                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                // color: var(--floating-label-color,var(--color-foreground-primary));
                                                //color: "#191919",
                                                color: errors.FaddrLine1
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,

                                                //
                                              }}
                                            >
                                              Adresse
                                            </Box>
                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                // aria-required="true"
                                                id="FaddrLine1"
                                                type="text"
                                                // data-validations="REQUIRED_FIELD"
                                                placeholder="Adresse"
                                                {...register("FaddrLine1")}
                                                //{...register("FaddrLine1", {
                                                //   onChange: () => {
                                                //checkItemFact("FaddrLine1");
                                                //  checkItemFact();
                                                //  },
                                                /* onBlur: () => {
                                              checkItemFact("FaddrLine1");
                                            },*/
                                                // })}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  width: "100%",
                                                  // width: "50%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",

                                                  color: errors.FaddrLine1
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.FaddrLine1
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.FaddrLine1
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.FaddrLine1
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.FaddrLine1?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="FaddrLine2"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                // color: var(--floating-label-color,var(--color-foreground-primary));
                                                //color: "#191919",
                                                color: errors.FaddrLine2
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                fontWeight: 400,
                                              }}
                                            >
                                              Adresse 2 (facultative)
                                            </Box>
                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                // aria-required="true"
                                                id="FaddrLine2"
                                                type="text"
                                                // data-validations="REQUIRED_FIELD"
                                                placeholder="Appartement, suite, étage etc."
                                                {...register("FaddrLine2")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",

                                                  width: "100%",
                                                  height: "48px",

                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  //

                                                  borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  color: errors.FaddrLine2
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.FaddrLine2
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.FaddrLine2
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.FaddrLine2
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.FaddrLine2?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "-webkit-box",
                                          display: "-ms-flexbox",
                                          display: "flex",
                                          WebkitBoxOrient: "horizontal",
                                          WebkitBoxDirection: "normal",
                                          MsFlexDirection: "row",
                                          flexDirection: "row",
                                          gap: "0.5rem",
                                          padding: "0 0.5rem",
                                          tableLayout: "fixed",
                                          width: "100%",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          paddingLeft: "1rem",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="Fcity"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                //color: "#191919",
                                                color: errors.Fcity
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,
                                              }}
                                            >
                                              Ville
                                            </Box>

                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                // aria-required="true"
                                                id="Fcity"
                                                type="text"
                                                // data-validations="REQUIRED_FIELD"
                                                placeholder="Ville"
                                                {...register("Fcity")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  width: "100%",
                                                  // width: "50%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  //

                                                  borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  color: errors.Fcity
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.Fcity
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.Fcity
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.Fcity
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>

                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.Fcity?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              maxWidth: "279px",
                                              display: "inline-block",
                                            }}
                                          >
                                            <Box
                                              component="span"
                                              sx={{
                                                display: "inline-block",
                                                position: "relative",
                                                //marginTop: "1rem",
                                                marginTop: "0.5rem",
                                              }}
                                            >
                                              <Box
                                                component="label"
                                                htmlFor="Fregion"
                                                sx={{
                                                  WebkitTransform:
                                                    "scale(.75) translateY(3px)",
                                                  transform:
                                                    "scale(.75) translateY(3px)",

                                                  pointerEvents: "none",

                                                  color: errors.Fregion
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  backgroundColor:
                                                    "transparent",

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
                                                  fontSize: ".875rem",
                                                  WebkitTextSizeAdjust: "100%",
                                                  //
                                                  // color: '#e0103a',
                                                  fontWeight: 400,
                                                }}
                                              >
                                                Région
                                              </Box>
                                              <Box
                                                component="span"
                                                sx={{
                                                  marginRight: 0,
                                                  display: "inline-block",
                                                  color: "#191919",
                                                  fontSize: ".875rem",
                                                  position: "relative",
                                                }}
                                              >
                                                <Box
                                                  component="select"
                                                  //autocomplete="address-level1"
                                                  //  autoComplete="off"
                                                  // value={region}
                                                  id="Fregion"
                                                  // onChange={onRegionChanged}
                                                  // {...register("region", { required: true })}
                                                  {...register("Fregion")}
                                                  sx={{
                                                    lineHeight: "60px",
                                                    height: "3rem",
                                                    fontWeight: 400,
                                                    fontSize: "1em",
                                                    width: "100%!important",
                                                    WebkitAppearance: "none",
                                                    MozAppearance: "none",
                                                    appearance: "none",
                                                    backgroundColor: "#f7f7f7",
                                                    borderRadius: "8px",
                                                    border: "1px solid #8f8f8f",
                                                    // color: "inherit",
                                                    color: errors.Fregion
                                                      ? "#e0103a"
                                                      : "#191919",
                                                    fontFamily: "inherit",
                                                    padding: "0 32px 0 16px",
                                                    verticalAlign: "middle",
                                                    ":select:not(:-internal-list-box)":
                                                      {
                                                        overflow:
                                                          "visible !important",
                                                      },
                                                    //
                                                    // padding: "0 28px 0 10px",
                                                    //paddingBottom: "5px",
                                                    // paddingTop: "18px",
                                                    // paddingRight: "8px",
                                                    fontSize: ".875rem",

                                                    "&:focus": {
                                                      outline: errors.Fregion
                                                        ? "none"
                                                        : null,
                                                      boxShadow: errors.Fregion
                                                        ? "0px 0px 2px #e0103a"
                                                        : null,
                                                    },
                                                  }}
                                                >
                                                  {regionsSelect}
                                                </Box>
                                                <CustExpandMoreIcon
                                                  color="action"
                                                  fontSize="small"
                                                  sx={{
                                                    height: "100%",
                                                    pointerEvents: "none",
                                                    position: "absolute",
                                                    //right: "16px",

                                                    right: "8px",
                                                    top: 0,
                                                    // top: 20,
                                                    //   width: "8px",
                                                    display: "inline-block",
                                                    fill: "currentColor",
                                                    stroke: "currentColor",
                                                    strokeWidth: 0,
                                                    verticalAlign: "middle",
                                                  }}
                                                />
                                              </Box>
                                              <Box
                                                sx={{
                                                  marginTop: "0.5rem",
                                                  fontSize: ".75rem",
                                                  color: "#e62048",
                                                }}
                                              >
                                                {errors.Fregion?.message}
                                              </Box>
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="FpostalCode"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                //color: "#191919",
                                                color: errors.FpostalCode
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,
                                              }}
                                            >
                                              Code postal
                                            </Box>

                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                //aria-required="true"
                                                id="FpostalCode"
                                                type="text"
                                                placeholder="Code postal"
                                                {...register("FpostalCode")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  // width: "100%",
                                                  width: "80%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  //color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  color: errors.FpostalCode
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor:
                                                    errors.FpostalCode
                                                      ? "#e0103a"
                                                      : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.FpostalCode
                                                      ? "none"
                                                      : null,
                                                    boxShadow:
                                                      errors.FpostalCode
                                                        ? "0px 0px 2px #e0103a"
                                                        : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>

                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.FpostalCode?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box
                                        component="span"
                                        sx={{
                                          paddingLeft: "0.5rem",
                                          display: "flex",
                                          alignItems: "flex-start",
                                          width: "100%",
                                          marginTop: "1rem",
                                          overflow: "visible!important",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          marginTop: "0.5rem",
                                        }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{
                                            marginLeft: "8px",
                                            width: "100%",
                                            display: "inline-block",
                                          }}
                                        >
                                          <Box
                                            component="span"
                                            sx={{
                                              width: "100%",
                                              marginTop: 0,
                                              display: "inline-block",
                                              position: "relative",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="phoneNumber"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                marginBottom: "0.125rem",

                                                pointerEvents: "none",

                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                //color: "#191919",
                                                color: errors.Ftel
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,
                                              }}
                                            >
                                              Numéro de téléphone
                                            </Box>

                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                id="phoneNumber"
                                                type="tel"
                                                maxLength="10"
                                                placeholder="Numéro de téléphone"
                                                {...register("Ftel")}
                                                sx={{
                                                  width: "45%",
                                                  minWidth: "240px",
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",

                                                  backgroundColor: "#f7f7f7",

                                                  borderRadius: "8px",
                                                  // border: 1px solid var(--textbox-border-color,var(--color-stroke-default));
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",

                                                  boxSizing: "border-box",

                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",

                                                  verticalAlign: "middle",

                                                  //borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  // color: var(--textbox-foreground-color,var(--color-foreground-on-secondary));
                                                  color: errors.Ftel
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.Ftel
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.Ftel
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.Ftel
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.Ftel?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      marginBottom: "1rem",
                                      marginLeft: "0.25rem",
                                      paddingLeft: 0,
                                      display: "table",
                                      tableLayout: "fixed",
                                      width: "100%",
                                      padding: "1rem 0",
                                      position: "relative",
                                    }}
                                  >
                                    <Box>
                                      <Box
                                        sx={{
                                          display: "inline",
                                          //
                                          padding: "0.5rem",
                                        }}
                                      >
                                        {factIsLoading && (
                                          <CircularProgress size={20} />
                                        )}
                                        <Box
                                          component="button"
                                          form="adresse-facturation-cart"
                                          type="submit"
                                          //onClick={handleSubmit(onSubmit)}
                                          disabled={factIsLoading}
                                          sx={{
                                            minWidth: "128px",

                                            //backgroundColor: "#3665f3",
                                            // borderColor: "#3665f3",
                                            //color: "#fff",

                                            backgroundColor: factIsLoading
                                              ? "#cccccc"
                                              : "#3665f3",

                                            borderColor: factIsLoading
                                              ? "#cccccc"
                                              : "#3665f3",

                                            color: factIsLoading
                                              ? "#666666"
                                              : "#fff",

                                            fontWeight: 700,
                                            border: "1px solid",
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
                                          }}
                                        >
                                          Enregistrer
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "inline",
                                          //
                                          // padding: "0.5rem",
                                        }}
                                      >
                                        <Box
                                          component="button"
                                          type="button"
                                          onClick={() => {
                                            /*const confirmerEtPayer =
                                            //isValid &&
                                            getValuesChekout("validModePay") &&
                                            getValuesChekout("validItQtUpd");*/

                                            /* setValueChekout(
                                            "confirmerPayer",
                                            confirmerEtPayer
                                          );*/

                                            // setValue("showAdrFact", "No");
                                            //setValueChekout("showAdrFact", "No");
                                            setValueChekout(
                                              "showCarteBancaire",
                                              "No"
                                            );
                                            setValueChekout(
                                              "showAdresseLiv",
                                              "No"
                                            );
                                            setValueChekout(
                                              "showAdresseFact",
                                              "No"
                                            );
                                            handleCloseFact();
                                          }}
                                          sx={{
                                            minWidth: "128px",
                                            marginRight: "1rem",

                                            backgroundColor: "transparent",
                                            borderColor: "#3665f3",
                                            color: "#3665f3",
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
                                            fontWeight: 700,
                                          }}
                                        >
                                          Annuler
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
                </DialogContent>
              </Dialog>
            )}
          </Box>

          {allItemsPanier}
        </Box>
      );
    };

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    const CarteBancaire = () => {
      const {
        register: register1,
        handleSubmit: handleSubmit1,
        // setValue: setValue1,
        // watch: watch1,
        // reset: reset1,
        // formState: { isDirty: isDirty1 },
      } = useForm();
      //{
      //defaultValues: {
      // optAddCard: isSubmitSuccessful,
      //  showCarteField: "No",
      // optModepaiement: optionModePay.current,
      // },
      //}

      const onSubmit1 = (data) => {
        console.log(data);
      };

      const clickOpenCarteBq = () => {
        setOpenCarteBq(true);
      };

      const handleCloseCarteBq = () => {
        setOpenCarteBq(false);
      };

      const AjModCarteBancaire = () => {
        const {
          register,
          handleSubmit,
          //getValues,
          setValue,
          //control,
          // watch,
          //reset,
          // formState,
          formState: { errors },
          //formState: { errors },
        } = useForm({
          // mode: "onChange",
          // reValidateMode: "all",
          resolver: yupResolver(cardSchema),
          /* defaultValues: {
            addrLine1: vAdrPrinc1Fact,
            addrLine2: vAdrPrinc2Fact,
            city: vVilleFact,
            region: vRegionFact,
            postalCode: vCodePostalFact,
            tel: vTelFact,
            showAdrFactField: "No",
          },*/
        });

        //const watchShowAdrFactField = watch("showAdrFactField");

        /* const [detCarteBancaire, setDetCarteBancaire] = useState({
        showCarte: false,
        showAdresseFact: false,
      });*/

        // const [editUserAdrFact, { ufactIsLoading }] =
        //  useEditUserAdrFactMutation();

        const onSubmit = async (data, event) => {
          event.preventDefault();
          event.stopPropagation();

          //  setValue("showAdrFactField", "No");
          setValueChekout("optModepaiement", "Card");
          optionModePay.current = "Card";
          // setValueChekout("confirmerPayer", true);
          // setValueChekout("validModePay", true);
          setValueChekout("showCarteBancaire", "No");
          setValueChekout("showAdresseLiv", "No");
          setValueChekout("showAdresseFact", "No");
          handleCloseCarteBq();
        };

        const regionsOptions = [
          "Tanger-Tétouan-Al Hoceima",
          "L'Oriental",
          "Fès-Meknès",
          "Beni Mellal-Khénifra",
          "Rabat-Salé-Kénitra",
          "Casablanca-Settat",
          "Marrakech-Safi",
          "Drâa-Tafilalet",
          "Souss-Massa",
          "Guelmim-Oued Noun",
          "Laâyoune-Sakia El Hamra",
          "Dakhla-Oued Ed Dahab",
        ];

        /*function CustExpandMoreIcon(props) {
        return (
          <SvgIcon {...props}>
            <KeyboardArrowDownOutlinedIcon />
          </SvgIcon>
        );
      }*/

        /* const regionsSelect = regionsOptions.map((opt, index) => (
          <Box component="option" value={opt} key={index}>
            {opt}
          </Box>
        ));*/

        const thisYear = new Date().getFullYear();

        const minOffset = 0;
        const maxOffset = 20;
        const monthsOptions = [];
        const yearsOptions = [];

        for (let i = 1; i <= 12; i++) {
          const month = (i < 10 ? "0" : "") + i;
          monthsOptions.push(month);
        }

        const monthsSelect = monthsOptions.map((opt, index) => (
          <Box component="option" value={opt} key={index}>
            {opt}
          </Box>
        ));

        for (let i = minOffset; i <= maxOffset; i++) {
          const year = thisYear + i;
          yearsOptions.push(year);
        }

        const yearsSelect = yearsOptions.map((opt, index) => (
          <Box component="option" value={opt} key={index}>
            {opt}
          </Box>
        ));
        return (
          <Dialog
            open={openCarteBq}
            onClose={handleCloseCarteBq}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent>
              <DialogTitle>Carte Bancaire</DialogTitle>

              <Box
                sx={{
                  // paddingTop: 0,
                  // paddingLeft: "1rem",
                  // paddingBottom: "1rem",
                  borderBottom: "1px solid #e5e5e5",
                  // border: 0,
                  marginLeft: 0,
                  marginBottom: 0,
                  paddingLeft: 0,
                  paddingTop: 0,
                  padding: "1rem",
                  // position: "relative",
                  background: "#fff",
                }}
              >
                <Box
                  sx={{
                    display: "-webkit-box",
                    display: "-ms-flexbox",
                    display: "flex",
                    WebkitBoxPack: "center",
                    MsFlexPack: "center",
                    justifyContent: "center",
                    WebkitBoxOrient: "vertical",
                    WebkitBoxDirection: "normal",
                    MsFlexDirection: "column",
                    flexDirection: "column",
                    marginRight: "1rem",
                    position: "relative",
                    lineHeight: "1.25rem",
                  }}
                ></Box>
                <Box
                  sx={{
                    boxSizing: "inherit",
                    display: "block",
                  }}
                >
                  <Box
                    sx={{
                      marginTop: "1rem",
                      position: "relative",
                      paddingTop: "0!important",
                    }}
                  >
                    <Box
                      component="h3"
                      sx={{
                        fontSize: ".875rem",
                        fontWeight: 400,
                        marginBottom: "0.5rem!important",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: ".875rem",
                          fontWeight: 400,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            fontSize: ".875rem",
                            fontWeight: 500,
                          }}
                        >
                          {/* Carte bancaire */}
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      component="form"
                      name="credit-card-details"
                      id="credit-card-details"
                      //  noValidate
                      // autoComplete="off"
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmit)}
                      sx={{
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      <Box
                        component="section"
                        sx={{
                          border: 0,
                          marginLeft: 0,
                          marginBottom: 0,
                          paddingLeft: 0,
                          paddingTop: 0,
                          padding: "1rem",
                          position: "relative",
                          background: "#fff",
                        }}
                      >
                        {/* <Box
                          sx={{
                            display: "none",
                          }}
                        >
                          <input {...register("showAdrFactField")} />
                        </Box> */}
                        <Box component="span">
                          <Box
                            component="span"
                            role="img"
                            //  aria-hidden="true"
                            sx={{
                              width: "15.39px",
                              height: "19.25px",
                              verticalAlign: "middle",
                              display: "inline-block",
                              background:
                                "url(https://ir.ebaystatic.com/cr/v/c01/payment-sprites-0.1.102.svg) 62.2605632393% 55.1020844468% no-repeat",
                              marginRight: "0.5rem",
                            }}
                          ></Box>
                          <Box
                            component="span"
                            sx={{
                              boxSizing: "inherit",
                            }}
                          >
                            <Box component="span">
                              Votre paiement est sécurisé. Les détails de votre
                              carte bancaire ne seront pas partagés.
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: "#fff",
                          }}
                        >
                          <Box
                            sx={{
                              display: "block",
                              //width: "50%",
                              // padding: "0 0.5rem",
                              verticalAlign: "top",
                              marginTop: "0.1rem",
                            }}
                          >
                            <Box
                              aria-live="polite"
                              sx={{
                                boxSizing: "inherit",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "block",
                                  position: "relative",
                                  marginTop: "1rem",
                                }}
                              >
                                <Box
                                  sx={{
                                    color: "#f7f7f7",

                                    fontSize: ".875rem",
                                    position: "relative",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      marginBottom: "8px!important",
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
                                      sx={{
                                        marginRight: "3.5%",
                                        float: "left",
                                        minHeight: "1px",
                                        width: "30.959%",
                                        overflow: "visible",
                                        textAlign: "right!important",
                                        marginTop: "4px!important",
                                      }}
                                    >
                                      <Box
                                        component="label"
                                        htmlFor="cardNumber"
                                        sx={{
                                          fontWeight: 700,
                                          display: "block",
                                          // paddingLeft: "2px",
                                          paddingBottom: "2px",
                                          textAlign: "right!important",
                                          visibility: "visible",
                                          color: "#0F1111",
                                          fontSize: "14px",
                                          lineHeight: "20px",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          // height: "48px",
                                        }}
                                      >
                                        Numéro de carte
                                      </Box>
                                    </Box>
                                    <Box
                                      sx={{
                                        marginRight: 0,
                                        float: "right",
                                        minHeight: "1px",
                                        width: "65.459%",
                                        overflow: "visible",
                                        textAlign: "left",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
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
                                          sx={{
                                            marginRight: "3%",
                                            float: "left",
                                            minHeight: "1px",
                                            width: "74.20533%",
                                            overflow: "visible",
                                            textAlign: "left",
                                            color: "#0F1111",
                                            fontSize: "14px",
                                            lineHeight: "20px",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              marginBottom: "0!important",
                                              textAlign: "left",
                                              color: "#0F1111",
                                              fontSize: "14px",
                                              lineHeight: "20px",
                                            }}
                                          >
                                            <Box
                                              component="input"
                                              // aria-required="true"
                                              id="cardNumber"
                                              type="tel"
                                              // aria-invalid="true"
                                              // aria-describedby="cardNumber-error"
                                              // error="Erreur&nbsp;: saisissez le numéro de votre carte."
                                              // onChange={onCardNumberChanged}
                                              //onKeyDown={handleKeyDownCardNumber}
                                              {...register("cardNumber")}
                                              sx={{
                                                backgroundColor: "#fff",
                                                height: "31px",
                                                padding: "3px 7px",
                                                lineHeight: "normal",
                                                //border: "1px solid #888C8C",
                                                // borderRadius: "3px",
                                                boxShadow:
                                                  "0 1px 2px rgb(15 17 17 / 15%) inset",
                                                // outline: 0,
                                                WebkitTransition:
                                                  "all .1s linear",
                                                transition: "all .1s linear",
                                                //  color: "#0F1111",
                                                margin: 0,
                                                fontSize: "100%",
                                                verticalAlign: "middle",
                                                //////////////////////////////

                                                //  borderColor: "#e0103a",

                                                WebkitAppearance: "none",
                                                MozAppearance: "none",
                                                appearance: "none",
                                                backgroundColor: "#f7f7f7",

                                                borderRadius: "8px",
                                                border: "1px solid #8f8f8f",
                                                //color: "#191919",
                                                fontWeight: 500,
                                                //
                                                color: errors.cardNumber
                                                  ? "#e0103a"
                                                  : "#0F1111",
                                                borderColor: errors.cardNumber
                                                  ? "#e0103a"
                                                  : "#8f8f8f",

                                                "&:focus": {
                                                  outline: errors.cardNumber
                                                    ? "none"
                                                    : null,
                                                  boxShadow: errors.cardNumber
                                                    ? "0px 0px 2px #e0103a"
                                                    : null,
                                                },
                                              }}
                                            ></Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            // marginTop: "0.5rem",
                                            fontSize: ".75rem",
                                            color: "#e62048",
                                            //
                                            padding: "0!important",
                                            margin: 0,
                                            marginRight: "3.5%",
                                            float: "left",
                                          }}
                                        >
                                          <Box
                                            component="p"
                                            sx={{
                                              // marginTop: "0.5rem",
                                              fontSize: ".75rem",
                                              color: "#e62048",
                                              //
                                              padding: "0!important",
                                              margin: 0,
                                            }}
                                          >
                                            {errors.cardNumber?.message}
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      marginBottom: "8px!important",
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
                                      sx={{
                                        marginRight: "3.5%",
                                        float: "left",
                                        minHeight: "1px",
                                        width: "30.959%",
                                        overflow: "visible",
                                        textAlign: "right!important",
                                        marginTop: "4px!important",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                      }}
                                    >
                                      <Box
                                        component="label"
                                        htmlFor="cardLastName"
                                        sx={{
                                          fontWeight: 700,
                                          display: "block",
                                          //  paddingLeft: "2px",
                                          paddingBottom: "2px",
                                          textAlign: "right!important",
                                          visibility: "visible",
                                          color: "#0F1111",
                                          fontSize: "14px",
                                          lineHeight: "20px",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        Nom sur la carte
                                      </Box>
                                    </Box>
                                    <Box
                                      sx={{
                                        marginRight: 0,
                                        float: "right",
                                        minHeight: "1px",
                                        width: "65.459%",

                                        overflow: "visible",
                                        textAlign: "left",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
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
                                          component="input"
                                          id="cardLastName"
                                          type="text"
                                          maxLength="50"
                                          {...register("lastName")}
                                          sx={{
                                            backgroundColor: "#fff",
                                            height: "31px",
                                            padding: "3px 7px",
                                            lineHeight: "normal",

                                            boxShadow:
                                              "0 1px 2px rgb(15 17 17 / 15%) inset",
                                            // outline: 0,

                                            WebkitTransition: "all .1s linear",
                                            transition: "all .1s linear",

                                            margin: 0,
                                            fontSize: "100%",
                                            verticalAlign: "middle",

                                            WebkitAppearance: "none",
                                            MozAppearance: "none",
                                            appearance: "none",
                                            backgroundColor: "#f7f7f7",

                                            borderRadius: "8px",
                                            border: "1px solid #8f8f8f",

                                            fontWeight: 500,

                                            color: errors.lastName
                                              ? "#e0103a"
                                              : "#0F1111",
                                            borderColor: errors.lastName
                                              ? "#e0103a"
                                              : "#8f8f8f",

                                            "&:focus": {
                                              outline: errors.lastName
                                                ? "none"
                                                : null,
                                              boxShadow: errors.lastName
                                                ? "0px 0px 2px #e0103a"
                                                : null,
                                            },
                                          }}
                                        ></Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          //marginTop: "0.5rem",
                                          fontSize: ".75rem",
                                          color: "#e62048",
                                          //
                                          padding: "0!important",
                                          margin: 0,
                                          marginRight: "3.5%",
                                          float: "left",
                                        }}
                                      >
                                        <Box
                                          component="p"
                                          sx={{
                                            // marginTop: "0.5rem",
                                            fontSize: ".75rem",
                                            color: "#e62048",
                                            //
                                            padding: "0!important",
                                            margin: 0,
                                          }}
                                        >
                                          {errors.lastName?.message}
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      marginBottom: "8px!important",
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
                                      sx={{
                                        marginRight: "3.5%",
                                        float: "left",
                                        minHeight: "1px",
                                        width: "30.959%",
                                        overflow: "visible",
                                        textAlign: "right!important",
                                        marginTop: "4px!important",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                      }}
                                    >
                                      <Box
                                        component="label"
                                        htmlFor="cardFirstName"
                                        sx={{
                                          fontWeight: 700,
                                          display: "block",
                                          //   paddingLeft: "2px",
                                          paddingBottom: "2px",
                                          textAlign: "right!important",
                                          visibility: "visible",
                                          color: "#0F1111",
                                          fontSize: "14px",
                                          lineHeight: "20px",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        Prénom sur la carte
                                      </Box>
                                    </Box>
                                    <Box
                                      sx={{
                                        marginRight: 0,
                                        float: "right",
                                        minHeight: "1px",
                                        width: "65.459%",

                                        overflow: "visible",
                                        textAlign: "left",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
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
                                          component="input"
                                          id="cardFirstName"
                                          type="text"
                                          maxLength="50"
                                          {...register("firstName")}
                                          sx={{
                                            backgroundColor: "#fff",
                                            height: "31px",
                                            padding: "3px 7px",
                                            lineHeight: "normal",

                                            boxShadow:
                                              "0 1px 2px rgb(15 17 17 / 15%) inset",

                                            WebkitTransition: "all .1s linear",
                                            transition: "all .1s linear",

                                            margin: 0,
                                            fontSize: "100%",
                                            verticalAlign: "middle",

                                            WebkitAppearance: "none",
                                            MozAppearance: "none",
                                            appearance: "none",
                                            backgroundColor: "#f7f7f7",

                                            borderRadius: "8px",
                                            border: "1px solid #8f8f8f",
                                            //color: "#191919",
                                            fontWeight: 500,
                                            //
                                            color: errors.firstName
                                              ? "#e0103a"
                                              : "#0F1111",
                                            borderColor: errors.firstName
                                              ? "#e0103a"
                                              : "#8f8f8f",

                                            "&:focus": {
                                              outline: errors.firstName
                                                ? "none"
                                                : null,
                                              boxShadow: errors.firstName
                                                ? "0px 0px 2px #e0103a"
                                                : null,
                                            },
                                          }}
                                        ></Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          //marginTop: "0.5rem",
                                          fontSize: ".75rem",
                                          color: "#e62048",
                                          //
                                          padding: "0!important",
                                          margin: 0,
                                          marginRight: "3.5%",
                                          float: "left",
                                        }}
                                      >
                                        <Box
                                          component="p"
                                          sx={{
                                            // marginTop: "0.5rem",
                                            fontSize: ".75rem",
                                            color: "#e62048",
                                            //
                                            padding: "0!important",
                                            margin: 0,
                                          }}
                                        >
                                          {errors.firstName?.message}
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      marginBottom: "8px!important",
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
                                      sx={{
                                        marginRight: "3.5%",
                                        float: "left",
                                        minHeight: "1px",
                                        width: "30.959%",
                                        overflow: "visible",
                                        textAlign: "right!important",
                                        marginTop: "4px!important",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                      }}
                                    >
                                      <Box
                                        component="label"
                                        htmlFor="cardExpirationDate"
                                        id="cardExpirationDateId"
                                        sx={{
                                          fontWeight: 700,
                                          display: "block",
                                          //   paddingLeft: "2px",
                                          paddingBottom: "2px",
                                          textAlign: "right!important",
                                          visibility: "visible",
                                          color: "#0F1111",
                                          fontSize: "14px",
                                          lineHeight: "20px",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        Date d&rdquo;expiration
                                      </Box>
                                    </Box>

                                    <Box
                                      sx={{
                                        marginRight: 0,
                                        float: "right",
                                        minHeight: "1px",
                                        width: "65.459%",
                                        overflow: "visible",
                                        textAlign: "left",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
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
                                          component="span"
                                          sx={{
                                            position: "relative",
                                          }}
                                        >
                                          <Box
                                            component="span"
                                            tabIndex="-1"
                                            // aria-hidden="true"
                                            sx={{
                                              minWidth: "0%",
                                              borderColor: "#D5D9D9",
                                              borderRadius: "8px",
                                              color: "#0F1111",
                                              background: "#F0F2F2",
                                              boxShadow:
                                                "0 2px 5px 0 rgb(213 217 217 / 50%)",
                                              borderStyle: "solid",
                                              borderWidth: "1px",
                                              cursor: "pointer",
                                              display: "inline-block",
                                              padding: 0,
                                              textAlign: "center",
                                              textDecoration: "none!important",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <Box
                                              component="span"
                                              sx={{
                                                borderRadius: "7px",
                                                background: "#F0F2F2",
                                                boxShadow:
                                                  "0 2px 5px rgb(15 17 17 / 15%)",
                                                display: "block",
                                                position: "relative",
                                                overflow: "hidden",
                                                height: "29px",
                                                color: "#0F1111",
                                                cursor: "pointer",
                                                textAlign: "center",
                                              }}
                                            >
                                              <Box
                                                component="span"
                                                role="button"
                                                // aria-hidden="true"
                                                sx={{
                                                  height: "100%",
                                                  paddingRight: "26px",
                                                  textAlign: "left",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  position: "relative",
                                                  zIndex: 10,
                                                  color: "#0F1111",
                                                  backgroundColor:
                                                    "transparent",
                                                  border: 0,
                                                  display: "block",
                                                  fontSize: "13px",
                                                  lineHeight: "29px",
                                                  margin: 0,
                                                  outline: 0,
                                                  padding: "0 10px 0 11px",
                                                  whiteSpace: "nowrap",
                                                }}
                                              >
                                                <Box
                                                  component="span"
                                                  sx={{
                                                    textAlign: "left",
                                                    color: "#0F1111",
                                                    fontSize: "13px",
                                                    lineHeight: "29px",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  <Box
                                                    component="select"
                                                    id="cardExpirationDate"
                                                    tabIndex="0"
                                                    // aria-pressed="false"
                                                    {...register(
                                                      "expDateMonth"
                                                    )}
                                                    sx={{
                                                      // position: "absolute",
                                                      //  zIndex: "-1",
                                                      // opacity: ".01",
                                                      maxWidth: "100%",
                                                      left: 0,
                                                      WebkitTransition:
                                                        "all .1s linear",
                                                      transition:
                                                        "all .1s linear",
                                                      lineHeight: "19px",
                                                      color: "#0F1111",
                                                      margin: 0,
                                                      fontSize: "100%",
                                                      verticalAlign: "middle",
                                                      overflow:
                                                        "visible !important",
                                                      ///
                                                      appearance: "auto",

                                                      color: "inherit",
                                                      fontFamily: "inherit",

                                                      backgroundColor:
                                                        "transparent",

                                                      border: "none",
                                                      outline: "none",
                                                      scrollBehavior: "smooth",
                                                      fontSize: ".875rem",
                                                      fontWeight: 500,
                                                      //
                                                      padding: "0 4px 0 0px",
                                                    }}
                                                  >
                                                    {monthsSelect}
                                                  </Box>
                                                </Box>
                                              </Box>
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          component="span"
                                          sx={{
                                            display: "inline-block",
                                            width: "0.385em",
                                          }}
                                        ></Box>
                                        <Box
                                          component="span"
                                          sx={{
                                            position: "relative",
                                          }}
                                        >
                                          <Box
                                            component="span"
                                            tabIndex="-1"
                                            // aria-hidden="true"
                                            sx={{
                                              minWidth: "0%",
                                              borderColor: "#D5D9D9",
                                              borderRadius: "8px",
                                              color: "#0F1111",
                                              background: "#F0F2F2",
                                              boxShadow:
                                                "0 2px 5px 0 rgb(213 217 217 / 50%)",
                                              borderStyle: "solid",
                                              borderWidth: "1px",
                                              cursor: "pointer",
                                              display: "inline-block",
                                              padding: 0,
                                              textAlign: "center",
                                              textDecoration: "none!important",
                                              verticalAlign: "middle",
                                            }}
                                          >
                                            <Box
                                              component="span"
                                              sx={{
                                                borderRadius: "7px",
                                                background: "#F0F2F2",
                                                boxShadow:
                                                  "0 2px 5px rgb(15 17 17 / 15%)",
                                                display: "block",
                                                position: "relative",
                                                overflow: "hidden",
                                                height: "29px",
                                                color: "#0F1111",
                                                cursor: "pointer",
                                                textAlign: "center",
                                              }}
                                            >
                                              <Box
                                                component="span"
                                                role="button"
                                                aria-hidden="true"
                                                sx={{
                                                  height: "100%",
                                                  paddingRight: "26px",
                                                  textAlign: "left",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                  position: "relative",
                                                  zIndex: 10,
                                                  color: "#0F1111",
                                                  backgroundColor:
                                                    "transparent",
                                                  border: 0,
                                                  display: "block",
                                                  fontSize: "13px",
                                                  lineHeight: "29px",
                                                  margin: 0,
                                                  outline: 0,
                                                  padding: "0 10px 0 11px",
                                                  whiteSpace: "nowrap",
                                                }}
                                              >
                                                <Box
                                                  component="span"
                                                  sx={{
                                                    textAlign: "left",
                                                    color: "#0F1111",
                                                    fontSize: "13px",
                                                    lineHeight: "29px",
                                                    whiteSpace: "nowrap",
                                                  }}
                                                >
                                                  <Box
                                                    component="select"
                                                    id="cardExpirationDateYear"
                                                    tabIndex="0"
                                                    //aria-pressed="false"
                                                    {...register("expDateYear")}
                                                    sx={{
                                                      // position: "absolute",
                                                      //  zIndex: "-1",
                                                      // opacity: ".01",
                                                      maxWidth: "100%",
                                                      left: 0,
                                                      WebkitTransition:
                                                        "all .1s linear",
                                                      transition:
                                                        "all .1s linear",
                                                      lineHeight: "19px",
                                                      color: "#0F1111",
                                                      margin: 0,
                                                      fontSize: "100%",
                                                      verticalAlign: "middle",
                                                      overflow:
                                                        "visible !important",
                                                      ///
                                                      appearance: "auto",

                                                      color: "inherit",
                                                      fontFamily: "inherit",

                                                      backgroundColor:
                                                        "transparent",

                                                      border: "none",
                                                      outline: "none",
                                                      scrollBehavior: "smooth",
                                                      fontSize: ".875rem",
                                                      fontWeight: 500,
                                                      //
                                                      padding: "0 4px 0 0px",
                                                    }}
                                                  >
                                                    {yearsSelect}
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
                                      marginBottom: "8px!important",
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
                                      sx={{
                                        marginRight: "3.5%",
                                        float: "left",
                                        minHeight: "1px",
                                        width: "30.959%",
                                        overflow: "visible",
                                        textAlign: "right!important",
                                        marginTop: "4px!important",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                      }}
                                    >
                                      <Box
                                        component="label"
                                        htmlFor="cardSecurityCode"
                                        id="cardSecurityCodeId"
                                        sx={{
                                          fontWeight: 700,
                                          display: "block",
                                          //   paddingLeft: "2px",
                                          paddingBottom: "2px",
                                          textAlign: "right!important",
                                          visibility: "visible",
                                          color: "#0F1111",
                                          fontSize: "14px",
                                          lineHeight: "20px",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        Code de sécurité (CVV)
                                      </Box>
                                    </Box>

                                    <Box
                                      sx={{
                                        marginRight: 0,
                                        float: "right",
                                        minHeight: "1px",
                                        width: "65.459%",
                                        overflow: "visible",
                                        textAlign: "left",
                                        color: "#0F1111",
                                        fontSize: "14px",
                                        lineHeight: "20px",
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
                                          component="input"
                                          type="password"
                                          maxLength="4"
                                          id="cardSecurityCode"
                                          {...register("securityCode")}
                                          sx={{
                                            backgroundColor: "#fff",
                                            height: "31px",
                                            padding: "3px 7px",
                                            lineHeight: "normal",
                                            //border: "1px solid #888C8C",
                                            // borderRadius: "3px",
                                            boxShadow:
                                              "0 1px 2px rgb(15 17 17 / 15%) inset",
                                            // outline: 0,
                                            width: "77px",
                                            WebkitTransition: "all .1s linear",
                                            transition: "all .1s linear",
                                            // color: "#0F1111",
                                            margin: 0,
                                            fontSize: "100%",
                                            verticalAlign: "middle",
                                            //////////////////////////////

                                            // borderColor: "#e0103a",

                                            WebkitAppearance: "none",
                                            MozAppearance: "none",
                                            appearance: "none",
                                            backgroundColor: "#f7f7f7",

                                            borderRadius: "8px",
                                            border: "1px solid #8f8f8f",
                                            //color: "#191919",
                                            fontWeight: 500,
                                            //
                                            color: errors.securityCode
                                              ? "#e0103a"
                                              : "#0F1111",
                                            borderColor: errors.securityCode
                                              ? "#e0103a"
                                              : "#8f8f8f",

                                            "&:focus": {
                                              outline: errors.securityCode
                                                ? "none"
                                                : null,
                                              boxShadow: errors.securityCode
                                                ? "0px 0px 2px #e0103a"
                                                : null,
                                            },
                                          }}
                                        ></Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          //marginTop: "0.5rem",
                                          fontSize: ".75rem",
                                          color: "#e62048",
                                          //
                                          padding: "0!important",
                                          margin: 0,
                                          marginRight: "3.5%",
                                          float: "left",
                                        }}
                                      >
                                        <Box
                                          component="p"
                                          sx={{
                                            // marginTop: "0.5rem",
                                            fontSize: ".75rem",
                                            color: "#e62048",
                                            //
                                            padding: "0!important",
                                            margin: 0,
                                          }}
                                        >
                                          {errors.securityCode?.message}
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
                              width: "100%",
                              display: "inline-block",
                              padding: "0 0.5rem",
                              marginTop: "0.6rem",
                              verticalAlign: "top",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                marginTop: "1rem",
                                WebkitBoxAlign: "center",
                                MsFlexAlign: "center",
                                alignItems: "center",
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
                                <Box
                                  component="span"
                                  sx={{
                                    alignItems: "center",
                                    display: "-webkit-inline-box",
                                    display: "-ms-inline-flexbox",
                                    display: "inline-flex",
                                    position: "relative",
                                    verticalAlign: "text-bottom",
                                  }}
                                >
                                  <Box
                                    component="input"
                                    htmlFor="rememberCard"
                                    id="rememberCard"
                                    type="checkbox"
                                    sx={{
                                      fontSize: "100%",
                                      margin: 0,
                                      //opacity: 0,
                                      opacity: 1,
                                      padding: 0,
                                      position: "absolute",
                                      zIndex: 1,
                                      height: "18px",
                                      minWidth: "18px",
                                      width: "18px",
                                    }}
                                  ></Box>
                                  <Box
                                    component="span"
                                    hidden=""
                                    sx={{
                                      display: "-webkit-inline-box",
                                      display: "-ms-inline-flexbox",
                                      display: "inline-flex",
                                      height: "18px",
                                      outlineOffset: "1px",
                                    }}
                                  >
                                    <Box
                                      component="svg"
                                      height="24px"
                                      width="24px"
                                      xmlns="http://www.w3.org/2000/svg"
                                      focusable="false"
                                      aria-hidden="true"
                                      sx={{
                                        display: "none",
                                        height: "18px",
                                        width: "18px",
                                        fill: "currentColor",
                                        pointerEvents: "none",
                                        stroke: "currentColor",
                                        strokeWidth: 0,
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <Box component="use"></Box>
                                    </Box>
                                    <Box
                                      component="svg"
                                      height="24px"
                                      width="24px"
                                      xmlns="http://www.w3.org/2000/svg"
                                      focusable="false"
                                      aria-hidden="true"
                                      sx={{
                                        display: "none",
                                        height: "18px",
                                        width: "18px",
                                        fill: "currentColor",
                                        pointerEvents: "none",
                                        stroke: "currentColor",
                                        strokeWidth: 0,
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <Box component="use"></Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                              <Box
                                component="label"
                                htmlFor="rememberCard"
                                sx={{
                                  // marginLeft: "1rem!important",
                                  marginLeft: "2rem!important",
                                  marginRight: "auto",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: ".875rem",
                                    WebkitTextSizeAdjust: "100%",
                                    color: "#191919",
                                    fontWeight: 500,
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      fontSize: ".875rem",
                                      WebkitTextSizeAdjust: "100%",
                                      color: "#191919",
                                      fontWeight: 500,
                                    }}
                                  >
                                    Enregistrer cette carte pour de futurs
                                    achats
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          padding: 0,
                          display: "table",
                          tableLayout: "fixed",
                          width: "100%",
                          position: "relative",
                          //
                          padding: "1rem",
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "inline",
                              //
                              padding: "0.5rem",
                            }}
                          >
                            <Box
                              component="button"
                              //form="credit-card-details"
                              // formnovalidate="true"
                              // component="input"
                              type="submit"
                              //
                              // disabled={ufactIsLoading}
                              onClick={handleSubmit(onSubmit)}
                              sx={{
                                minWidth: "128px",

                                /* backgroundColor: ufactIsLoading
                                  ? "#cccccc"
                                  : "#3665f3",
                                borderColor: ufactIsLoading
                                  ? "#cccccc"
                                  : "#3665f3",
                                color: ufactIsLoading ? "#666666" : "#fff",*/
                                backgroundColor: "#3665f3",
                                borderColor: "#3665f3",
                                color: "#fff",
                                fontWeight: 700,
                                border: "1px solid",
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
                              }}
                            >
                              Enregistrer
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "inline",
                            }}
                          >
                            <Box
                              component="button"
                              type="button"
                              onClick={() => {
                                // setValue("showCarteField", "No");
                                setValue("showAdrFactField", "No");
                                // setValueChekout("showCarteField", "No");
                                setValueChekout("optModepaiement", "Card");
                                optionModePay.current = "Card";
                                // setValueChekout("confirmerPayer", true);
                                // setValueChekout("validModePay", true);

                                //
                                setValueChekout("showCarteBancaire", "No");
                                setValueChekout("showAdresseLiv", "No");
                                setValueChekout("showAdresseFact", "No");

                                handleCloseCarteBq();
                              }}
                              sx={{
                                minWidth: "128px",
                                marginRight: "1rem",

                                backgroundColor: "transparent",
                                borderColor: "#3665f3",
                                color: "#3665f3",
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
                                fontWeight: 700,
                              }}
                            >
                              Annuler
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

      return (
        <>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            name="mode-paiements"
            id="mode-paiements"
            onSubmit={handleSubmit1(onSubmit1)}
          >
            {/*<Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("optModepaiement")} />
            </Box> */}

            {(!openCarteBq || watchCarteBancaire !== "Yes") && (
              <>
                <Box
                  sx={{
                    paddingTop: 0,
                    paddingLeft: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <Box
                    aria-disabled="false"
                    sx={{
                      display: "-webkit-box",
                      display: "-ms-flexbox",
                      display: "flex",
                      WebkitBoxPack: "center",
                      MsFlexPack: "center",
                      justifyContent: "center",
                      WebkitBoxOrient: "vertical",
                      WebkitBoxDirection: "normal",
                      MsFlexDirection: "column",
                      flexDirection: "column",
                      marginRight: "1rem",
                      position: "relative",
                      lineHeight: "1.25rem",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      boxSizing: "inherit",
                      display: "block",
                    }}
                  >
                    <Box
                      sx={{
                        boxSizing: "inherit",
                        display: "block",
                      }}
                    >
                      <Box
                        sx={{
                          "&:last-child": {
                            border: "none",

                            paddingBottom: 0,
                          },

                          paddingTop: "1rem",
                          WebkitBoxOrient: "vertical",
                          WebkitBoxDirection: "normal",
                          MsFlexDirection: "column",
                          flexDirection: "column",
                          paddingLeft: "2.5rem",
                          marginBottom: "0.25rem",
                          WebkitBoxAlign: "start",
                          MsFlexAlign: "start",
                          alignItems: "flex-start",
                          MsFlexWrap: "wrap",
                          flexWrap: "wrap",
                          wordBreak: "break-word",
                          position: "relative",
                          display: "-webkit-box",
                          display: "-ms-flexbox",
                          display: "flex",
                          background: "#fff",
                          lineHeight: "1.25rem",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            display: "-webkit-inline-box",
                            display: "-ms-inline-flexbox",
                            display: "inline-flex",
                            verticalAlign: "text-bottom",
                            order: "-1",
                            paddingRight: "1rem",
                            WebkitBoxDirection: "normal",
                            wordBreak: "break-word",
                            lineHeight: "1.25rem",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              alignItems: "center",
                              display: "-webkit-inline-box",
                              display: "-ms-inline-flexbox",
                              display: "inline-flex",
                              position: "relative",
                              verticalAlign: "text-bottom",
                              wordBreak: "break-word",
                              lineHeight: "1.25rem",
                            }}
                          >
                            <Box
                              component="input"
                              type="radio"
                              name="radio-group-paymentMethod"
                              id="selectable-render-summary46625"
                              value=""
                              form="mode-paiements"
                              checked={watchModePay === "Card"}
                              {...register1("optAddCard")}
                              onChange={() => {
                                setValueChekout("optModepaiement", "Card");
                                //
                                setValueChekout("showCarteBancaire", "Yes");
                                setValueChekout("showAdresseLiv", "No");
                                setValueChekout("showAdresseFact", "No");
                                // setValueChekout("confirmerPayer", true);
                                // setValueChekout("validModePay", true);
                                //
                                clickOpenCarteBq();
                              }}
                              sx={{
                                fontSize: "100%",
                                margin: 0,
                                // opacity: 0,
                                opacity: 1,
                                padding: 0,
                                position: "absolute",
                                zIndex: 1,
                                height: "18px",
                                minWidth: "18px",
                                width: "18px",
                              }}
                            ></Box>

                            <Box
                              component="span"
                              sx={{
                                display: "-webkit-inline-box",
                                display: "-ms-inline-flexbox",
                                display: "inline-flex",
                                height: "18px",
                                outlineOffset: "1px",
                              }}
                            >
                              <Box
                                component="svg"
                                height="24px"
                                width="24px"
                                xmlns="http://www.w3.org/2000/svg"
                                focusable="false"
                                aria-hidden="true"
                                sx={{
                                  display: "none",
                                  height: "18px",
                                  width: "18px",
                                  fill: "currentColor",
                                  pointerEvents: "none",
                                  stroke: "currentColor",
                                  strokeWidth: 0,
                                  verticalAlign: "middle",
                                }}
                              >
                                <Box
                                  component="use"
                                  // xlink:href="#icon-radio-checked"
                                ></Box>
                              </Box>
                              <Box
                                component="svg"
                                height="24px"
                                width="24px"
                                xmlns="http://www.w3.org/2000/svg"
                                focusable="false"
                                aria-hidden="true"
                                sx={{
                                  display: "none",
                                  height: "18px",
                                  width: "18px",
                                  fill: "currentColor",
                                  pointerEvents: "none",
                                  stroke: "currentColor",
                                  strokeWidth: 0,
                                  verticalAlign: "middle",
                                }}
                              >
                                <Box
                                  component="use"
                                  //  xlink:href="#icon-radio-unchecked"
                                ></Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          component="label"
                          htmlFor="selectable-render-summary46625"
                          sx={{
                            display: "-webkit-box",
                            display: "-ms-flexbox",
                            display: "flex",
                            WebkitBoxAlign: "center",
                            MsFlexAlign: "center",
                            alignItems: "center",
                            WebkitBoxDirection: "normal",
                            wordBreak: "break-word",
                            lineHeight: "1.25rem",
                          }}
                        >
                          <Box
                            sx={{
                              margin: "0 0.75rem 0 0",
                            }}
                          >
                            <Box
                              sx={{
                                boxSizing: "inherit",
                                display: "block",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  boxSizing: "inherit",
                                  cursor: "default",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    boxSizing: "inherit",
                                    cursor: "default",
                                  }}
                                >
                                  <Box
                                    //component="span"
                                    component="a"
                                    role="button"
                                    aria-label="Ajout ou modifier l'adresse de livraison"
                                    onClick={() => {
                                      setValueChekout(
                                        "showCarteBancaire",
                                        "Yes"
                                      );
                                      setValueChekout("showAdresseLiv", "No");
                                      setValueChekout("showAdresseFact", "No");
                                      //
                                      clickOpenCarteBq();
                                    }}
                                    sx={{
                                      fontWeight: 500,
                                      textDecoration: "underline",
                                      color: "#3665f3",
                                      cursor: "pointer",

                                      ":-webkit-any-link": {
                                        cursor: "pointer",
                                      },

                                      fontSize: ".875rem",
                                      WebkitTextSizeAdjust: "100%",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Ajouter/Modifier une carte
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            marginTop: "0.25rem",
                          }}
                        >
                          <Box component="span">
                            <Box
                              component="span"
                              role="img"
                              aria-label="Visa"
                              sx={{
                                marginRight: "0.1rem",
                                verticalAlign: "middle",
                                display: "inline-block",
                                background:
                                  "url(https://ir.ebaystatic.com/cr/v/c01/payment-sprites-0.1.102.svg) 98.7867494824% 50.7580299786% no-repeat",
                                width: "32px",
                                height: "20px",
                              }}
                            ></Box>
                          </Box>
                          <Box component="span">
                            <Box
                              component="span"
                              role="img"
                              aria-label="Mastercard"
                              sx={{
                                marginRight: "0.1rem",
                                verticalAlign: "middle",
                                display: "inline-block",
                                background:
                                  "url(https://ir.ebaystatic.com/cr/v/c01/payment-sprites-0.1.102.svg) 98.7867494824% 42.1927194861% no-repeat",
                                width: "32px",
                                height: "20px",
                              }}
                            ></Box>
                          </Box>
                          <Box component="span">
                            <Box
                              component="span"
                              role="img"
                              aria-label="American Express"
                              sx={{
                                marginRight: "0.1rem",
                                verticalAlign: "middle",
                                display: "inline-block",
                                background:
                                  "url(https://ir.ebaystatic.com/cr/v/c01/payment-sprites-0.1.102.svg) 98.7867494824% 12.2141327623% no-repeat",
                                width: "32px",
                                height: "20px",
                              }}
                            ></Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Mode de paiement 2 : Paiement a la livraison */}

                <Box
                  sx={{
                    paddingLeft: "1rem",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    // borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <Box
                    sx={{
                      paddingLeft: "2.5rem",
                      display: "-webkit-box",
                      display: "-ms-flexbox",
                      display: "flex",
                      WebkitBoxPack: "center",
                      MsFlexPack: "center",
                      justifyContent: "center",
                      WebkitBoxOrient: "vertical",
                      WebkitBoxDirection: "normal",
                      MsFlexDirection: "column",
                      flexDirection: "column",
                      marginRight: "1rem",
                      position: "relative",
                      lineHeight: "1.25rem",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        left: 0,
                        display: "-webkit-inline-box",
                        display: "-ms-inline-flexbox",
                        display: "inline-flex",
                        verticalAlign: "text-bottom",
                        order: "-1",
                        paddingRight: "1rem",
                        WebkitBoxDirection: "normal",
                      }}
                    >
                      <Box
                        component="span"
                        hidden=""
                        sx={{
                          alignItems: "center",
                          display: "-webkit-inline-box",
                          display: "-ms-inline-flexbox",
                          display: "inline-flex",
                          position: "relative",
                          verticalAlign: "text-bottom",
                        }}
                      >
                        <Box
                          component="input"
                          type="radio"
                          name="radio-group-paymentMethod"
                          // value=""
                          id="selectable-render-summary62778"
                          form="mode-paiements"
                          checked={watchModePay === "Cash"}
                          {...register1("optAddCard")}
                          // onInput={() => {
                          onChange={() => {
                            // setValueChekout("showCarteField", "No");
                            setValueChekout("optModepaiement", "Cash");
                            optionModePay.current = "Cash";
                            // setValueChekout("confirmerPayer", true);
                            // setValueChekout("validModePay", true);

                            //
                            setValueChekout("showCarteBancaire", "No");
                            setValueChekout("showAdresseLiv", "No");
                            setValueChekout("showAdresseFact", "No");
                          }}
                          sx={{
                            fontSize: "100%",
                            margin: 0,
                            // opacity: 0,
                            opacity: 1,
                            padding: 0,
                            position: "absolute",
                            zIndex: 1,
                            height: "18px",
                            minWidth: "18px",
                            width: "18px",
                          }}
                        ></Box>
                        <Box
                          component="span"
                          sx={{
                            display: "-webkit-inline-box",
                            display: "-ms-inline-flexbox",
                            display: "inline-flex",

                            height: "18px",
                            outlineOffset: "1px",
                          }}
                        >
                          <Box
                            component="svg"
                            height="24px"
                            width="24px"
                            xmlns="http://www.w3.org/2000/svg"
                            focusable="false"
                            aria-hidden="true"
                            sx={{
                              display: "none",
                              height: "18px",
                              width: "18px",
                              fill: "currentColor",
                              pointerEvents: "none",
                              stroke: "currentColor",
                              strokeWidth: 0,
                              verticalAlign: "middle",
                            }}
                          >
                            <Box
                              component="use"
                              // xlink:href="#icon-radio-checked"
                            ></Box>
                          </Box>
                          <Box
                            component="svg"
                            height="24px"
                            width="24px"
                            xmlns="http://www.w3.org/2000/svg"
                            focusable="false"
                            aria-hidden="true"
                            sx={{
                              display: "inline-block",
                              height: "18px",
                              width: "18px",
                              fill: "currentColor",
                              pointerEvents: "none",
                              stroke: "currentColor",
                              strokeWidth: 0,
                              verticalAlign: "middle",
                            }}
                          >
                            <Box
                              component="use"
                              //  xlink:href="#icon-radio-unchecked"
                            ></Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      component="label"
                      htmlFor="selectable-render-summary62778"
                      sx={{
                        WebkitBoxAlign: "start",
                        MsFlexAlign: "start",
                        alignItems: "flex-start",
                        WebkitBoxOrient: "vertical",
                        WebkitBoxDirection: "normal",
                        MsFlexDirection: "column",
                        flexDirection: "column",
                        display: "-webkit-box",
                        display: "-ms-flexbox",
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          boxSizing: "inherit",
                          display: "block",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "-webkit-box",
                            display: "-ms-flexbox",
                            display: "flex",
                            WebkitBoxAlign: "center",
                            MsFlexAlign: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              // background:
                              //   "url(https://ir.ebaystatic.com/cr/v/c01/payment-sprites-0.1.102.svg) 30.8566453082% 36.4669134165% no-repeat",
                              // width: "67.09px",
                              //  height: "19.59px",
                              verticalAlign: "middle",
                              display: "inline-block",
                              marginRight: "0.5rem",
                              fontWeight: 500,
                            }}
                          >
                            Paiement à la livraison
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </>
            )}
          </Box>

          {/* {(detCarteBancaire.showCarte || watchShowCarte === "Yes") && ( */}
          {/*  {(watchShowCarte2 === "Yes" || watchShowCarte === "Yes") && ( */}
          {/*{watchShowCarte === "Yes" && watchCarteBancaire === "Yes" && ( */}
          {(watchCarteBancaire === "Yes" || openCarteBq) && (
            <AjModCarteBancaire />
          )}
        </>
      );
    };

    const selectModePaiement = (
      <Box
        component="section"
        sx={{
          padding: 0,
          marginBottom: "1rem",
          position: "relative",
          border: "1px solid #e5e5e5",
          background: "#fff",
          display: "block",
        }}
      >
        <Box
          sx={{
            transition: "height 77.5ms ease-in-out 0s",
            //  height: "240px",
            //  height: "720px",
            overflow: "visible",
            //
            //maxHeight: "960px",
            //
            maxHeight: "1160px",
          }}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                zIndex: "-1",
                visibility: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  overflow: "hidden",
                  zIndex: "-1",
                  visibility: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: "0px",
                    top: "0px",
                    width: "624px",
                    height: "250px",
                  }}
                ></Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  overflow: "hidden",
                  zIndex: "-1",
                  visibility: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: "200%",
                    height: "200%",
                  }}
                ></Box>
              </Box>
            </Box>

            <Box
              sx={{
                padding: "0.5rem 1rem",
                borderBottom: "1px solid #e5e5e5",
              }}
            >
              <Box
                sx={{
                  display: "-webkit-box",
                  display: "-ms-flexbox",
                  display: "flex",
                  WebkitBoxPack: "justify",
                  MsFlexPack: "justify",
                  justifyContent: "space-between",
                  WebkitBoxAlign: "center",
                  MsFlexAlign: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    paddingTop: "0.25rem",
                    paddingBottom: "0.25rem",
                    display: "block!important",
                    // fontSize: "medium",
                    fontSize: "0.875 rem",
                    fontWeight: 700,
                  }}
                >
                  <Box component="h3">
                    <Box
                      component="span"
                      sx={{
                        boxSizing: "inherit",
                        fontSize: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          boxSizing: "inherit",
                          fontSize: "inherit",
                          fontWeight: "bold",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="true"
                          sx={{
                            boxSizing: "inherit",
                            fontSize: "inherit",
                            fontWeight: "bold",
                          }}
                        >
                          1. Mode de paiement
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            border: 0,
                            clip: "rect(1px,1px,1px,1px)",
                            height: "1px",
                            overflow: "hidden",
                            padding: 0,
                            position: "absolute",
                            whiteSpace: "nowrap",
                            width: "1px",
                          }}
                        >
                          Sélectionner un mode de paiement
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                boxSizing: "inherit",
                display: "block",
              }}
            >
              <Box
                sx={{
                  boxSizing: "inherit",
                  display: "block",
                }}
              >
                <Box
                  component="fieldset"
                  id="payment-selection-fieldset"
                  sx={{
                    marginRight: 0,
                    marginLeft: 0,
                    border: 0,

                    // border: "1px solid #e5e5e5",
                    padding: 0,
                  }}
                >
                  <Box
                    component="legend"
                    sx={{
                      border: 0,
                      clip: "rect(1px,1px,1px,1px)",
                      height: "1px",
                      overflow: "hidden",
                      padding: 0,
                      position: "absolute",
                      whiteSpace: "nowrap",
                      width: "1px",
                      //
                      //display: "none",
                    }}
                  >
                    Sélectionner un mode de paiement
                  </Box>
                  <>
                    <CarteBancaire />
                  </>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );

    const AdrLiv = ({ adrvalue }) => {
      return (
        <Box
          sx={{
            boxSizing: "inherit",
            display: "block",
            fontSize: ".875rem",
            lineHeight: "1.25rem",
          }}
        >
          <Box component="span">
            <Box component="span">
              {adrvalue ? (
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    fontSize: ".875rem",
                    lineHeight: "1.25rem",
                  }}
                >
                  {adrvalue}
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      );
    };

    const AdrLivForm = () => {
      const {
        register,
        handleSubmit,
        // getValues,
        // setValue,
        // watch,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(adrLivSchema),
        defaultValues: {
          firstName: vFirstName,
          lastName: vLastName,
          addressLine1: vAddressLine1,
          addressLine2: vAddressLine2,
          city: vCity,
          region: vRegion,
          postalCode: vPostalCode,
          tel: vTel,
          // showAdrLiv: "No",
        },
      });

      const clickOpenLiv = () => {
        setOpenLiv(true);
      };

      const handleCloseLiv = () => {
        setOpenLiv(false);
      };

      const [editUserAdrLiv, { livIsLoading }] = useEditUserAdrLivMutation();

      //const watchShowAdrLiv = watch("showAdrLiv");

      const onSubmit = async (data, e) => {
        e.preventDefault();
        let nom = data.firstName;
        let prenom = data.lastName;
        let adressePrinc1 = data.addressLine1;
        let adressePrinc2 = data.addressLine2;
        let ville = data.city;
        let region = data.region;
        let codePostal = data.postalCode;
        let tel = data.tel;

        const canSaveAdrLiv =
          [
            nom,
            prenom,
            adressePrinc1,
            //adressePrinc2,
            ville,
            region,
            codePostal,
            tel,
            userId,
          ].every(Boolean) && !livIsLoading;

        if (canSaveAdrLiv) {
          try {
            // const updUserAdrLiv = await editUserAdrLiv({
            await editUserAdrLiv({
              userId,
              nom,
              prenom,
              adressePrinc1,
              adressePrinc2,
              ville,
              region,
              codePostal,
              tel,
            }).unwrap();
          } catch (err) {
            console.error(
              "Un probleme est survenu pour enregistrer cette adresse de livraison: ",
              err
            );
          } finally {
            // setValue("showAdrLiv", "No");
            // setValueChekout("showAdrLiv", "No");
            setValueChekout("showCarteBancaire", "No");
            setValueChekout("showAdresseLiv", "No");
            setValueChekout("showAdresseFact", "No");
            handleCloseLiv();
          }
        }
      };

      const regionsOptions = [
        "Tanger-Tétouan-Al Hoceima",
        "L'Oriental",
        "Fès-Meknès",
        "Beni Mellal-Khénifra",
        "Rabat-Salé-Kénitra",
        "Casablanca-Settat",
        "Marrakech-Safi",
        "Drâa-Tafilalet",
        "Souss-Massa",
        "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra",
        "Dakhla-Oued Ed Dahab",
      ];

      const regionsSelect = regionsOptions.map((opt, index) => (
        <Box component="option" value={opt} key={index}>
          {opt}
        </Box>
      ));

      const vName = vFirstName + " " + vLastName;

      const goAdrFact = async () => {
        window.scrollTo({
          top: document.body.scrollHeight + 20,
          left: 0,
          // behavior: 'smooth'
        });
        if (
          //userAdr &&
          !userAdr?.adrPrinc1Fact &&
          // userAdr.adrPrinc2Fact &&
          !userAdr?.villeFact &&
          // userAdr.codePostalFact &&
          !userAdr?.regionFact &&
          !userAdr?.telFact &&
          userAdr?.adressePrinc1 &&
          userAdr?.ville &&
          userAdr?.region &&
          userAdr?.tel
        ) {
          const adrPrinc1Fact = userAdr?.adressePrinc1;
          const adrPrinc2Fact = userAdr?.adressePrinc2;
          const villeFact = userAdr?.ville;
          const regionFact = userAdr?.region;
          const codePostalFact = userAdr?.codePostal;
          const telFact = userAdr?.tel;
          //}

          const canSaveAdrFact =
            [
              adrPrinc1Fact,
              //adrPrinc2Fact,
              villeFact,
              regionFact,
              // codePostalFact,
              telFact,
              userId,
            ].every(Boolean) && !factIsLoading;

          if (canSaveAdrFact) {
            try {
              await editUserAdrFact({
                userId,
                adrPrinc1Fact,
                adrPrinc2Fact,
                villeFact,
                regionFact,
                codePostalFact,
                telFact,
              }).unwrap();
            } catch (err) {
              console.error(
                "Un probleme est survenu pour enregistrer cette adresse de facturation: ",
                err
              );
            }
          }
        }

        if (
          userAdr &&
          userAdr.nom &&
          userAdr.prenom &&
          userAdr.adressePrinc1 &&
          userAdr.ville &&
          userAdr.region &&
          userAdr.tel
        ) {
          setValueChekout("goAdresseFact", true);
        } else {
          setValueChekout("goAdresseFact", false);
        }
      };

      const goAdresseFact = (
        <Box
          sx={{
            // marginTop: "-1px",
            marginTop: "1rem",
            overflow: "hidden",
            display: "block",
            backgroundColor: "#fff",
            border: "1px #D5D9D9 solid",
            fontSize: "14px",
            lineHeight: "20px",
            WebkitTextSizeAdjust: "100%",
            color: "#0F1111",
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              padding: "12px 18px 11px",
              background: "#F0F2F2",
              fontWeight: 700,
              position: "relative",
              MozBoxSizing: "border-box",
              WebkitBoxSizing: "border-box",
              boxSizing: "border-box",
              display: "block",
              color: "#0F1111",
              fontSize: "14px",
              lineHeight: "20px",
              WebkitTextSizeAdjust: "100%",
              //
              paddingLeft: "1rem",
            }}
          >
            <Box
              // component="span"
              component="button"
              role="button"
              aria-label="Allez a l'étape suivante pour saisir l'adresse de facturation"
              onClick={() => {
                goAdrFact();
              }}
              sx={{
                borderRadius: "8px",
                boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
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
                fontWeight: 700,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
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
                  fontWeight: 700,
                  color: "#0F1111",
                  fontSize: "14px",
                  lineHeight: "20px",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                <Box
                  //component="input"

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
                    fontFamily: "inherit",
                    cursor: "pointer",
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
                    whiteSpace: "nowrap",
                    textAlign: "center!important",
                    fontWeight: 700,
                  }}
                >
                  Envoyer à cette adresse
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );

      const ajouterAdresseLivraison = (
        <Box
          sx={{
            "&:last-child": {
              borderBottom: 0,
            },
            boxSizing: "inherit",
            display: "block",
            fontSize: ".875rem",
            color: "#191919",
            WebkitTextSizeAdjust: "100%",
          }}
        >
          <Box
            sx={{
              // padding: "1rem",
              background: "#fff",
              //borderBottom: '1px solid #e5e5e5',
              lineHeight: "1.25rem",
              //
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                boxSizing: "inherit",
                display: "block",
                lineHeight: "1.25rem",
              }}
            >
              <Box
                component="span"
                sx={{
                  boxSizing: "inherit",
                  lineHeight: "1.25rem",
                  fontSize: ".875rem",
                  color: "#191919",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    lineHeight: "1.25rem",
                    fontSize: ".875rem",
                    color: "#191919",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="a"
                    onClick={() => {
                      // setValue("showAdrLiv", "Yes");
                      //setValueChekout("showAdrLiv", "Yes");
                      setValueChekout("showCarteBancaire", "No");
                      setValueChekout("showAdresseLiv", "Yes");
                      setValueChekout("showAdresseFact", "No");
                      /* setAdresseLivraison({
                      ...adresseLivraison,
                      showAdrLiv: false,
                      showModAdrLiv: true,
                    });*/
                      clickOpenLiv();
                    }}
                    sx={{
                      marginBottom: "0.5rem",
                      textDecoration: "underline",
                      color: "#3665f3",
                      marginTop: "0.5rem",
                      boxSizing: "inherit",
                      cursor: "pointer",

                      ":-webkit-any-link": {
                        cursor: "pointer",
                      },

                      lineHeight: "1.25rem",
                      fontSize: ".875rem",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    Ajouter une adresse de livraison
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );

      return (
        <Box
          component="section"
          sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            padding: "1rem",
            position: "relative",
            border: "1px solid #e5e5e5",
            background: "#fff",
            paddingRight: 0,
            paddingLeft: 0,
          }}
        >
          <Box>
            <Box
              component="span"
              sx={{
                paddingLeft: "1rem",
                // paddingBottom: "1rem",
                //fontSize: "medium",
                fontSize: "0.875 rem",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              <Box component="h3">
                <Box component="span">
                  <Box component="span">
                    <Box
                      component="span"
                      aria-hidden="true"
                      sx={{
                        boxSizing: "inherit",
                        fontSize: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      2. Adresse de livraison
                    </Box>

                    <Box
                      component="span"
                      sx={{
                        border: 0,
                        clip: "rect(1px,1px,1px,1px)",
                        height: "1px",
                        overflow: "hidden",
                        padding: 0,
                        position: "absolute",
                        whiteSpace: "nowrap",
                        width: "1px",
                      }}
                    >
                      Sélectionner une adresse de livraison
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                boxSizing: "inherit",
                display: "block",
                color: "#191919",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              {/* {adresseLivraison.showAdrLiv && ( */}
              {/*{(watchShowAdrLiv !== "Yes" || watchAdresseLiv !== "Yes") && ( */}
              {(watchAdresseLiv !== "Yes" || !openLiv) && (
                <Box
                  sx={{
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                  }}
                >
                  <Box
                    sx={{
                      lineHeight: "1.25rem",
                    }}
                  >
                    <Box
                      sx={{
                        display: "none",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          boxSizing: "inherit",
                          lineHeight: "1.25rem",
                        }}
                      >
                        <Box component="span">
                          <Box
                            component="span"
                            sx={{
                              marginBottom: "0.5rem",
                              marginTop: "0.5rem",
                            }}
                          >
                            Adresse de livraison
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {userIsError ? (
                      <>{userError.toString()}</>
                    ) : userLoading ? (
                      // <>Loading...</>
                      <CircularProgress size={20} />
                    ) : userFetching ? (
                      <CircularProgress size={20} />
                    ) : //      <>Loading...</>
                    userAdr ? (
                      <Box
                        sx={{
                          fontSize: ".875rem",
                        }}
                      >
                        {vFirstName && vLastName && <AdrLiv adrvalue={vName} />}
                        {vAddressLine1 && <AdrLiv adrvalue={vAddressLine1} />}
                        {vAddressLine2 && <AdrLiv adrvalue={vAddressLine2} />}
                        {vCity && <AdrLiv adrvalue={vCity} />}
                        {vRegion && <AdrLiv adrvalue={vRegion} />}
                        {vPostalCode && <AdrLiv adrvalue={vPostalCode} />}
                        {vTel && <AdrLiv adrvalue={vTel} />}
                      </Box>
                    ) : null}
                  </Box>

                  {userAdr &&
                  vFirstName &&
                  vLastName &&
                  vAddressLine1 &&
                  vCity &&
                  vRegion &&
                  vTel ? (
                    <Box
                      component="span"
                      sx={{
                        boxSizing: "inherit",
                        color: "#191919",
                        fontSize: ".875rem",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      <Box component="span">
                        <Box
                          component="a"
                          role="button"
                          aria-label="Modifier l'adresse de livraison"
                          onClick={() => {
                            // setValue("showAdrLiv", "Yes");
                            // setValueChekout("showAdrLiv", "Yes");
                            setValueChekout("showCarteBancaire", "No");
                            setValueChekout("showAdresseLiv", "Yes");
                            setValueChekout("showAdresseFact", "No");
                            /* setAdresseLivraison({
                            ...adresseLivraison,
                            showAdrLiv: false,
                            showModAdrLiv: true,
                          }); */
                            clickOpenLiv();
                          }}
                          sx={{
                            textDecoration: "underline",
                            color: "#3665f3",
                            cursor: "pointer",

                            ":-webkit-any-link": {
                              cursor: "pointer",
                            },

                            fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            fontWeight: "bold",
                          }}
                        >
                          Modifier
                        </Box>
                      </Box>
                    </Box>
                  ) : null}
                  {/* {userAdr &&
                  !vFirstName &&
                  !vLastName &&
                  !vAddressLine1 &&
                  !vCity &&
                  !vRegion &&
                  !vTel
                    ? ajouterAdresseLivraison
                    : null} */}

                  {userAdr &&
                  (!vFirstName ||
                    !vLastName ||
                    !vAddressLine1 ||
                    !vCity ||
                    !vRegion ||
                    !vTel)
                    ? ajouterAdresseLivraison
                    : null}
                </Box>
              )}
            </Box>
            {/* {adresseLivraison.showModAdrLiv && ( */}
            {/*{watchShowAdrLiv === "Yes" && watchAdresseLiv === "Yes" && ( */}
            {(watchAdresseLiv === "Yes" || openLiv) && (
              <Dialog
                // openFact={openFact || watchAdresseFact === "Yes"}
                // open={openLiv || watchAdresseLiv === "Yes"}
                open={openLiv}
                onClose={handleCloseLiv}
                aria-labelledby="responsive-dialog-title"
                //   BackdropProps={{
                //   style: {
                //     background: "rgba(15, 17, 17,0.1)",
                //  },
                // }}
              >
                <DialogContent>
                  <DialogTitle>Adresse de livraison</DialogTitle>

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
                      sx={{
                        transition: "height 203.75ms ease-in-out 0s",
                        height: "413px",
                        overflow: "visible",
                        //
                        height: "360px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          marginTop: "1rem",
                          borderTop: "1px solid #e5e5e5",
                          overflow: "visible",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            overflow: "hidden",
                            zIndex: "-1",
                            visibility: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                              overflow: "hidden",
                              zIndex: "-1",
                              visibility: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: "0px",
                                top: "0px",
                                width: "624px",
                                height: "423px",
                              }}
                            ></Box>
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                              overflow: "hidden",
                              zIndex: "-1",
                              visibility: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                left: "0px",
                                top: "0px",
                                width: "200%",
                                height: "200%",
                              }}
                            ></Box>
                          </Box>
                        </Box>
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
                            sx={{
                              display: "block!important",
                            }}
                          >
                            <Box
                              sx={{
                                padding: 0,
                                marginTop: "1rem",
                                background: "#fff",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "block!important",
                                }}
                              >
                                <Box
                                  component="form"
                                  onSubmit={handleSubmit(onSubmit)}
                                  sx={{
                                    margin: 0,
                                    paddingRight: "1rem",
                                    paddingLeft: "1rem",
                                    padding: 0,
                                    marginTop: "1rem",
                                    background: "#fff",
                                  }}
                                >
                                  <Box
                                    component="section"
                                    sx={{
                                      padding: 0,
                                      marginBottom: 0,
                                      border: 0,
                                      position: "relative",
                                      background: "#fff",
                                    }}
                                  >
                                    {/* <Box
                                sx={{
                                  display: "none",
                                }}
                              >
                                <input {...register("showAdrLiv")} />
                              </Box> */}
                                    <Box>
                                      <Box
                                        sx={{
                                          display: "-webkit-box",
                                          display: "-ms-flexbox",
                                          display: "flex",
                                          WebkitBoxOrient: "horizontal",
                                          WebkitBoxDirection: "normal",
                                          MsFlexDirection: "row",
                                          flexDirection: "row",
                                          gap: "0.5rem",
                                          padding: "0 0.5rem",
                                          tableLayout: "fixed",
                                          width: "100%",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          paddingLeft: "1rem",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                            WebkitBoxDirection: "normal",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="firstName"
                                              sx={{
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                //WebkitTransform: "translateY(16px)",
                                                //transform:"translateY(16px)",

                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                // color: var(--floating-label-color,var(--color-foreground-primary));
                                                //color: "#191919",
                                                color: errors.firstName
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,

                                                //
                                              }}
                                            >
                                              Prénom
                                            </Box>
                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                aria-required="true"
                                                aria-describedby="firstName-accessorylabel"
                                                id="firstName"
                                                type="text"
                                                data-validations="REQUIRED_FIELD"
                                                placeholder="Prénom"
                                                {...register("firstName")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  width: "100%",
                                                  // width: "50%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",

                                                  color: errors.firstName
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.firstName
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.firstName
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.firstName
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.firstName?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="lastName"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                // color: var(--floating-label-color,var(--color-foreground-primary));
                                                //color: "#191919",
                                                color: errors.lastName
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                fontWeight: 400,
                                              }}
                                            >
                                              Nom
                                            </Box>
                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                aria-required="true"
                                                aria-describedby="lastName-accessorylabel"
                                                id="lastName"
                                                type="text"
                                                data-validations="REQUIRED_FIELD"
                                                placeholder="Nom"
                                                {...register("lastName")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",

                                                  width: "100%",
                                                  height: "48px",

                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  //

                                                  borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  color: errors.lastName
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.lastName
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.lastName
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.lastName
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.lastName?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "-webkit-box",
                                          display: "-ms-flexbox",
                                          display: "flex",
                                          WebkitBoxOrient: "horizontal",
                                          WebkitBoxDirection: "normal",
                                          MsFlexDirection: "row",
                                          flexDirection: "row",
                                          gap: "0.5rem",
                                          padding: "0 0.5rem",
                                          tableLayout: "fixed",
                                          width: "100%",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          paddingLeft: "1rem",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                            WebkitBoxDirection: "normal",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="addressLine1"
                                              sx={{
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                //WebkitTransform: "translateY(16px)",
                                                //transform:"translateY(16px)",

                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                // color: var(--floating-label-color,var(--color-foreground-primary));
                                                //color: "#191919",
                                                color: errors.addressLine1
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,

                                                //
                                              }}
                                            >
                                              Adresse
                                            </Box>
                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                aria-required="true"
                                                id="addressLine1"
                                                type="text"
                                                data-validations="REQUIRED_FIELD"
                                                placeholder="Adresse"
                                                {...register("addressLine1")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  width: "100%",
                                                  // width: "50%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",

                                                  color: errors.addressLine1
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor:
                                                    errors.addressLine1
                                                      ? "#e0103a"
                                                      : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.addressLine1
                                                      ? "none"
                                                      : null,
                                                    boxShadow:
                                                      errors.addressLine1
                                                        ? "0px 0px 2px #e0103a"
                                                        : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.addressLine1?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="addressLine2"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                // color: var(--floating-label-color,var(--color-foreground-primary));
                                                //color: "#191919",
                                                color: errors.addressLine2
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                fontWeight: 400,
                                              }}
                                            >
                                              Adresse 2 (facultative)
                                            </Box>
                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                aria-required="true"
                                                id="addressLine2"
                                                type="text"
                                                data-validations="REQUIRED_FIELD"
                                                placeholder="Appartement, suite, étage etc."
                                                {...register("addressLine2")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",

                                                  width: "100%",
                                                  height: "48px",

                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  //

                                                  borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  color: errors.addressLine2
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor:
                                                    errors.addressLine2
                                                      ? "#e0103a"
                                                      : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.addressLine2
                                                      ? "none"
                                                      : null,
                                                    boxShadow:
                                                      errors.addressLine2
                                                        ? "0px 0px 2px #e0103a"
                                                        : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.addressLine2?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "-webkit-box",
                                          display: "-ms-flexbox",
                                          display: "flex",
                                          WebkitBoxOrient: "horizontal",
                                          WebkitBoxDirection: "normal",
                                          MsFlexDirection: "row",
                                          flexDirection: "row",
                                          gap: "0.5rem",
                                          padding: "0 0.5rem",
                                          tableLayout: "fixed",
                                          width: "100%",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          paddingLeft: "1rem",
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="city"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                //color: "#191919",
                                                color: errors.city
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,
                                              }}
                                            >
                                              Ville
                                            </Box>

                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                aria-required="true"
                                                id="city"
                                                type="text"
                                                data-validations="REQUIRED_FIELD"
                                                placeholder="Ville"
                                                {...register("city")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  width: "100%",
                                                  // width: "50%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  // color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  //

                                                  borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  color: errors.city
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.city
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.city
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.city
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>

                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.city?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              maxWidth: "279px",
                                              display: "inline-block",
                                            }}
                                          >
                                            <Box
                                              component="span"
                                              sx={{
                                                display: "inline-block",
                                                position: "relative",
                                                //marginTop: "1rem",
                                                marginTop: "0.5rem",
                                              }}
                                            >
                                              <Box
                                                component="label"
                                                htmlFor="region"
                                                sx={{
                                                  WebkitTransform:
                                                    "scale(.75) translateY(3px)",
                                                  transform:
                                                    "scale(.75) translateY(3px)",

                                                  pointerEvents: "none",

                                                  color: errors.region
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  backgroundColor:
                                                    "transparent",

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
                                                  fontSize: ".875rem",
                                                  WebkitTextSizeAdjust: "100%",
                                                  //
                                                  // color: '#e0103a',
                                                  fontWeight: 400,
                                                }}
                                              >
                                                Région
                                              </Box>
                                              <Box
                                                component="span"
                                                sx={{
                                                  marginRight: 0,
                                                  display: "inline-block",
                                                  color: "#191919",
                                                  fontSize: ".875rem",
                                                  position: "relative",
                                                }}
                                              >
                                                <Box
                                                  component="select"
                                                  //autocomplete="address-level1"
                                                  //  autoComplete="off"
                                                  // value={region}
                                                  id="region"
                                                  // onChange={onRegionChanged}
                                                  // {...register("region", { required: true })}
                                                  {...register("region")}
                                                  sx={{
                                                    lineHeight: "60px",
                                                    height: "3rem",
                                                    fontWeight: 400,
                                                    fontSize: "1em",
                                                    width: "100%!important",
                                                    WebkitAppearance: "none",
                                                    MozAppearance: "none",
                                                    appearance: "none",
                                                    backgroundColor: "#f7f7f7",
                                                    borderRadius: "8px",
                                                    border: "1px solid #8f8f8f",
                                                    // color: "inherit",
                                                    color: errors.region
                                                      ? "#e0103a"
                                                      : "#191919",
                                                    fontFamily: "inherit",
                                                    padding: "0 32px 0 16px",
                                                    verticalAlign: "middle",
                                                    ":select:not(:-internal-list-box)":
                                                      {
                                                        overflow:
                                                          "visible !important",
                                                      },
                                                    //
                                                    // padding: "0 28px 0 10px",
                                                    //paddingBottom: "5px",
                                                    // paddingTop: "18px",
                                                    // paddingRight: "8px",
                                                    fontSize: ".875rem",

                                                    "&:focus": {
                                                      outline: errors.region
                                                        ? "none"
                                                        : null,
                                                      boxShadow: errors.region
                                                        ? "0px 0px 2px #e0103a"
                                                        : null,
                                                    },
                                                  }}
                                                >
                                                  {regionsSelect}
                                                </Box>
                                                <CustExpandMoreIcon
                                                  color="action"
                                                  fontSize="small"
                                                  sx={{
                                                    height: "100%",
                                                    pointerEvents: "none",
                                                    position: "absolute",
                                                    //right: "16px",

                                                    right: "8px",
                                                    top: 0,
                                                    // top: 20,
                                                    //   width: "8px",
                                                    display: "inline-block",
                                                    fill: "currentColor",
                                                    stroke: "currentColor",
                                                    strokeWidth: 0,
                                                    verticalAlign: "middle",
                                                  }}
                                                />
                                              </Box>
                                              <Box
                                                sx={{
                                                  marginTop: "0.5rem",
                                                  fontSize: ".75rem",
                                                  color: "#e62048",
                                                }}
                                              >
                                                {errors.region?.message}
                                              </Box>
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box
                                          sx={{
                                            width: "100%",
                                            padding: 0,
                                            display: "table-cell",
                                            verticalAlign: "top",
                                            marginTop: "0.1rem",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "block",
                                              position: "relative",
                                              //marginTop: "1rem",
                                              marginTop: "0.5rem",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="postalCode"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                pointerEvents: "none",
                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                //color: "#191919",
                                                color: errors.postalCode
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,
                                              }}
                                            >
                                              Code postal
                                            </Box>

                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                aria-required="true"
                                                id="postalCode"
                                                type="text"
                                                placeholder="Code postal"
                                                {...register("postalCode")}
                                                sx={{
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  // paddingTop: "28px",
                                                  // width: "100%",
                                                  width: "80%",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  backgroundColor: "#f7f7f7",
                                                  // borderRadius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",
                                                  boxSizing: "border-box",
                                                  //color: "#191919",
                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",
                                                  //padding: "0 16px",
                                                  verticalAlign: "middle",
                                                  WebkitBoxDirection: "normal",
                                                  color: errors.postalCode
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.postalCode
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.postalCode
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.postalCode
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>

                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.postalCode?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box
                                        component="span"
                                        sx={{
                                          paddingLeft: "0.5rem",
                                          display: "flex",
                                          alignItems: "flex-start",
                                          width: "100%",
                                          marginTop: "1rem",
                                          overflow: "visible!important",
                                          color: "#191919",
                                          fontSize: ".875rem",
                                          WebkitTextSizeAdjust: "100%",
                                          //
                                          marginTop: "0.5rem",
                                        }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{
                                            marginLeft: "8px",
                                            width: "100%",
                                            display: "inline-block",
                                          }}
                                        >
                                          <Box
                                            component="span"
                                            sx={{
                                              width: "100%",
                                              marginTop: 0,
                                              display: "inline-block",
                                              position: "relative",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              htmlFor="phoneNumber"
                                              sx={{
                                                WebkitTransform:
                                                  "scale(.75) translateY(3px)",
                                                transform:
                                                  "scale(.75) translateY(3px)",
                                                marginBottom: "0.125rem",

                                                pointerEvents: "none",

                                                WebkitTransition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "bottom .3s ease,-webkit-transform .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease",
                                                transition:
                                                  "transform .3s ease,bottom .3s ease,-webkit-transform .3s ease",
                                                //color: "#191919",
                                                color: errors.tel
                                                  ? "#e0103a"
                                                  : "#191919",
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
                                                fontSize: ".875rem",
                                                WebkitTextSizeAdjust: "100%",
                                                //
                                                // color: '#e0103a',
                                                fontWeight: 400,
                                              }}
                                            >
                                              Numéro de téléphone
                                            </Box>

                                            <Box
                                              sx={{
                                                color: "#f7f7f7",
                                                fontSize: ".875rem",
                                                position: "relative",
                                              }}
                                            >
                                              <Box
                                                component="input"
                                                id="phoneNumber"
                                                type="tel"
                                                maxLength="10"
                                                placeholder="Numéro de téléphone"
                                                {...register("tel")}
                                                sx={{
                                                  width: "45%",
                                                  minWidth: "240px",
                                                  padding: "0 16px",
                                                  paddingBottom: "5px",
                                                  paddingTop: "23px",
                                                  height: "48px",
                                                  WebkitAppearance: "none",
                                                  MozAppearance: "none",
                                                  appearance: "none",
                                                  // background-color: var(--textbox-background-color,var(--color-background-secondary));
                                                  backgroundColor: "#f7f7f7",
                                                  //border-radius: var(--textbox-border-radius,var(--border-radius-50));
                                                  borderRadius: "8px",
                                                  // border: 1px solid var(--textbox-border-color,var(--color-stroke-default));
                                                  border: "1px solid #8f8f8f",
                                                  WebkitBoxSizing: "border-box",

                                                  boxSizing: "border-box",

                                                  fontSize: "1em",
                                                  margin: 0,
                                                  fontFamily: "inherit",

                                                  verticalAlign: "middle",

                                                  //borderColor: "#e0103a",
                                                  // border: '1px solid #8f8f8f',
                                                  // color: var(--textbox-foreground-color,var(--color-foreground-on-secondary));
                                                  color: errors.tel
                                                    ? "#e0103a"
                                                    : "#191919",
                                                  borderColor: errors.tel
                                                    ? "#e0103a"
                                                    : "#8f8f8f",

                                                  "&:focus": {
                                                    outline: errors.tel
                                                      ? "none"
                                                      : null,
                                                    boxShadow: errors.tel
                                                      ? "0px 0px 2px #e0103a"
                                                      : null,
                                                  },
                                                }}
                                              ></Box>
                                            </Box>
                                            <Box
                                              sx={{
                                                marginTop: "0.5rem",
                                                fontSize: ".75rem",
                                                color: "#e62048",
                                              }}
                                            >
                                              {errors.tel?.message}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                  <Box
                                    sx={{
                                      marginBottom: "1rem",
                                      marginLeft: "0.25rem",
                                      paddingLeft: 0,
                                      display: "table",
                                      tableLayout: "fixed",
                                      width: "100%",
                                      padding: "1rem 0",
                                      position: "relative",
                                    }}
                                  >
                                    <Box>
                                      <Box
                                        sx={{
                                          display: "inline",
                                          //
                                          padding: "0.5rem",
                                        }}
                                      >
                                        {livIsLoading && (
                                          <CircularProgress size={20} />
                                        )}
                                        <Box
                                          component="button"
                                          disabled={livIsLoading}
                                          type="submit"
                                          // type="button"
                                          //onClick={handleSubmit(onSubmit)}
                                          // onClick={() => {
                                          //handleSubmit(onSubmit);
                                          // onSaveUserAdrLiv();
                                          /*  setAdresseLivraison({
                                        ...adresseLivraison,
                                        showAdrLiv: true,
                                        showModAdrLiv: false,
                                      });
                                    }}*/
                                          sx={{
                                            minWidth: "128px",
                                            // backgroundColor: "#3665f3",
                                            backgroundColor: livIsLoading
                                              ? "#cccccc"
                                              : "#3665f3",
                                            // borderColor: "#3665f3",
                                            borderColor: livIsLoading
                                              ? "#cccccc"
                                              : "#3665f3",
                                            //color: "#fff",
                                            color: livIsLoading
                                              ? "#666666"
                                              : "#fff",
                                            fontWeight: 700,
                                            border: "1px solid",
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
                                          }}
                                        >
                                          Enregistrer
                                        </Box>
                                      </Box>
                                      <Box
                                        sx={{
                                          display: "inline",
                                          //
                                          // padding: "0.5rem",
                                        }}
                                      >
                                        <Box
                                          component="button"
                                          type="button"
                                          onClick={() => {
                                            // setValue("showAdrLiv", "No");
                                            //setValueChekout("showAdrLiv", "No");
                                            setValueChekout(
                                              "showCarteBancaire",
                                              "No"
                                            );
                                            setValueChekout(
                                              "showAdresseLiv",
                                              "No"
                                            );
                                            setValueChekout(
                                              "showAdresseFact",
                                              "No"
                                            );
                                            handleCloseLiv();
                                            /* setAdresseLivraison({
                                        ...adresseLivraison,
                                        showAdrLiv: true,
                                        showModAdrLiv: false,
                                      });*/
                                          }}
                                          sx={{
                                            minWidth: "128px",
                                            marginRight: "1rem",

                                            backgroundColor: "transparent",
                                            borderColor: "#3665f3",
                                            color: "#3665f3",
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
                                            fontWeight: 700,
                                          }}
                                        >
                                          Annuler
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
                </DialogContent>
              </Dialog>
            )}
          </Box>
          {goAdresseFact}
        </Box>
      );
    };

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

        /////////////

        const orderData = {
          email: "elmosbourrhia@gmail.com",
          message:
            "Votre commande a été confirmée avec succès. Elle sera emballée et expédiée dès que possible.",
          // cartProdDesc: cart.prodDesc,
          // cartProdQtee: cart.prodQtee,
          // cartProdPrix: cart.prodPrix,
          prenom: userAdr.prenom,
          nom: userAdr.nom,
          adresseLiv1: userAdr.adressePrinc1,
          adresseLiv2: userAdr.adressePrinc2,
          villeLiv: userAdr.ville,
          regionLiv: userAdr.region,
          codePostalLiv: userAdr.codePostal,
          telLiv: userAdr.tel,
          dateLiv: dateLiv,
          methodeLiv: methodLiv,
          nbrProdCmd: getItemsCount(),
          total: carttotalCommandeForm,
          mtLiv: cartMtLiv,
          cart: cart,
        };

        ////////////

        const [addOrders, { isLoading: ordersIsLoading }] =
          useAddOrdersMutation();

        const removeAllItems = () => {
          dispatch(allProductRemoved());
        };

        const onSubmit = async (data, e) => {
          e.preventDefault();

          let livOrders = cartMtLiv;
          let totalOrders = carttotalCommande;

          const canSaveOrders =
            [userId, totalOrders, livOrders, cartOrder].every(Boolean) &&
            !ordersIsLoading;

          if (canSaveOrders) {
            try {
              const { data: orderInserted } = await addOrders({
                userId,
                totalOrders,
                livOrders,
                //  createdAt,
                cartOrder,
              }).unwrap();

              /////////////

              await fetch("http://localhost:3000/api/sendEmail", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
              });

              /////////////

              removeAllItems();

              router.push({
                pathname: "/orders",
                query: {
                  orderPkey: orderInserted.orderPkey,
                  modePaiement: watchModePay,
                  orderExDelivery: TotalCartPrice,
                  methodeLiv: methodLiv,

                  prenomLiv: userAdr.prenom,
                  nomLiv: userAdr.nom,
                  adrPrcLiv1: userAdr.adressePrinc1,
                  adrPrcLiv2: userAdr.adressePrinc2,
                  villeLiv: userAdr.ville,
                  regionLiv: userAdr.region,
                  codePostalLiv: userAdr.codePostal,
                  expediePar: expediePar,
                },
              });

              //  console.log("Mardi 4 avril 2023 - 1 :");
              //  console.log(userAdrLivData);
            } catch (err) {
              console.error(
                "Un probleme est survenu pour enregistrer cette commande: ",
                err
              );
            }
          }
        };

        return (
          <>
            <FormProvider {...methods}>
              <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
                <AllCartItems />

                <Box
                  sx={{
                    WebkitBoxOrient: "horizontal",
                    // WebkitBoxDirection: "normal",
                    /*  MsFlexDirection: "row",
                  flexDirection: "row",
                  WebkitBoxAlign: "baseline",
                  MsFlexAlign: "baseline",
                  alignItems: "baseline",*/

                    margin: 0,
                    /* display: "-webkit-box",
                  display: "-ms-flexbox",
                  display: "flex",*/

                    //
                    /* WebkitBoxAlign: "center",
                  MsFlexAlign: "center",
                  alignItems: "center",*/
                    marginBottom: "1rem",
                  }}
                >
                  <Box
                    sx={{
                      /*  display: "-webkit-box",
                    display: "-ms-flexbox",
                    display: "flex",*/
                      // marginLeft: "1rem",
                      // WebkitBoxDirection: "normal",
                      color: "#191919",
                      fontSize: ".875rem",
                      // WebkitTextSizeAdjust: "100%",
                      //alignItems: "center",
                      textAlign: "center",

                      maxWidth: "1000px",
                      margin: "30px auto 15px",
                      whiteSpace: "nowrap",
                      lineHeight: 0,
                    }}
                  >
                    {ordersIsLoading && <CircularProgress size={20} />}

                    <Box
                      component="button"
                      type="submit"
                      disabled={ordersIsLoading}
                      sx={{
                        minWidth: "7rem",
                        border: "1px solid",
                        //backgroundColor: "#FFD814",
                        // borderColor: "#FCD200",
                        // color: "#0F1111",
                        //backgroundColor: "#FFD814",
                        backgroundColor: ordersIsLoading
                          ? "#cccccc"
                          : "#FFD814",
                        // borderColor: "#FCD200",
                        borderColor: ordersIsLoading ? "#cccccc" : "#FCD200",
                        // color: "#0F1111",
                        color: ordersIsLoading ? "#666666" : "#0F1111",
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

      /* const CartItemCont = () => {
      return <CartItems />;
    };*/

      return (
        <Box
          component="section"
          sx={{
            marginBottom: "1rem",
            padding: 0,

            "@media screen and (min-width: 576px)": {
              border: "1px solid #e5e5e5",
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
            component="span"
            sx={{
              padding: "1rem",
              paddingBottom: "1rem",
              //fontSize: "medium",
              fontSize: ".875rem",
              fontWeight: 700,

              display: "inline-block",
              color: "#191919",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box component="h3">
              4. Votre Commande&nbsp;({getItemsCount()}&nbsp;Articles)
            </Box>
          </Box>
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

    const summary = (
      <Box
        sx={{
          paddingRight: 0,
          paddingLeft: 0,
          position: "relative",

          WebkitBoxFlex: 0,
          MsFlex: "0 0 41.6666666667%",
          flex: "0 0 41.6666666667%",
          maxWidth: "41.6666666667%",

          "@media screen and (min-width: 992px)": {
            WebkitBoxFlex: 0,
            MsFlex: "0 0 33.3333333333%",
            flex: " 0 0 33.3333333333%",
            maxWidth: "33.3333333333%",
          },
          width: "100%",
          fontSize: ".875rem",
          WebkitTextSizeAdjust: "100%",
          color: "#191919",
        }}
      >
        <Box
          sx={{
            // position: "absolute",
            //top: "0px",
            // width: "100%",
            //position: "fixed",
            // width: "315.992px",
            //////////////////////

            //scrollDirection
            //scrollDirection === "down" ? "hide" : "show"
            // position: scrollDirection === "down" ? "fixed" : "absolute",
            //width: scrollDirection === "down" ? "315.992px" : "100%",
            //top: "0px",

            // position: scrollTop >= 107 ? "fixed" : "absolute",
            //top: "0px",
            // width: scrollTop >= 107 ? "315.992px" : "100%",

            position: scrollY >= 107 ? "fixed" : "absolute",
            top: "0px",
            width: scrollY >= 107 ? "315.992px" : "100%",
          }}
        >
          <Box
            component="section"
            sx={{
              marginBottom: "1rem",
              padding: "1rem",
              position: "relative",
              border: "1px solid #e5e5e5",
              background: "#fff",
              display: "block",
              fontSize: ".875rem",
              WebkitTextSizeAdjust: "100%",
              color: "#191919",
            }}
          >
            <Box
              sx={{
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
                color: "#191919",
              }}
            >
              <Box
                component="span"
                sx={{
                  border: 0,
                  clip: "rect(1px,1px,1px,1px)",
                  height: "1px",
                  overflow: "hidden",
                  padding: 0,
                  position: "absolute",
                  whiteSpace: "nowrap",
                  width: "1px",
                }}
              >
                Récapitulatif du panier
              </Box>
              <Box
                sx={{
                  WebkitBoxSizing: "inherit",
                  boxSizing: "inherit",
                  display: "block",
                  fontSize: ".875rem",
                  WebkitTextSizeAdjust: "100%",
                  color: "#191919",
                }}
              >
                <Box
                  component="table"
                  role="presentation"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    paddingBottom: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Box component="thead">
                    <Box
                      component="tr"
                      sx={{
                        display: "none",
                      }}
                    >
                      <Box component="th">label</Box>
                      <Box component="th">valeur</Box>
                    </Box>
                  </Box>
                  <Box component="tbody">
                    <Box component="tr">
                      <Box
                        component="td"
                        sx={{
                          width: "11.25rem",
                          textAlign: "left",
                          paddingBottom: "0.25rem",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="false"
                          sx={{
                            textAlign: "left",
                            // fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            // color: "#191919",
                            //
                            textRendering: "optimizeLegibility",
                            fontSize: "18px!important",
                            lineHeight: "24px!important",
                            color: "#0F1111",
                            fontWeight: "400!important",
                          }}
                        >
                          Articles&nbsp;({getItemsCount()}):&nbsp;
                        </Box>
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          minWidth: 0,
                          textAlign: "right",
                          paddingBottom: "0.25rem",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="false"
                          sx={{
                            textAlign: "right",
                            // fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            // color: "#191919",
                            //
                            textRendering: "optimizeLegibility",
                            fontSize: "18px!important",
                            lineHeight: "24px!important",
                            color: "#0F1111",
                            fontWeight: "400!important",
                          }}
                        >
                          &nbsp;
                          <Box component="span">{TotalCartPrice}&nbsp;Dhs</Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box component="tr">
                      <Box
                        component="td"
                        sx={{
                          width: "11.25rem",
                          paddingBottom: "1rem",
                          borderBottom: "1px solid #e5e5e5",
                          textAlign: "left",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="false"
                          sx={{
                            textAlign: "left",
                            // fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            // color: "#191919",
                            //
                            textRendering: "optimizeLegibility",
                            fontSize: "18px!important",
                            lineHeight: "24px!important",
                            color: "#0F1111",
                            fontWeight: "400!important",
                          }}
                        >
                          Livraison
                        </Box>
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          minWidth: 0,
                          paddingBottom: "1rem",
                          borderBottom: "1px solid #e5e5e5",
                          textAlign: "right",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="false"
                          sx={{
                            textAlign: "right",
                            // fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            // color: "#191919",
                            //
                            textRendering: "optimizeLegibility",
                            fontSize: "18px!important",
                            lineHeight: "24px!important",
                            color: "#0F1111",
                            fontWeight: "400!important",
                          }}
                        >
                          &nbsp;
                          <Box component="span">{cartMtLiv}&nbsp;Dhs</Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box component="tr">
                      <Box
                        component="td"
                        sx={{
                          width: "11.25rem",

                          "&:last-child": {
                            fontWeight: 700,
                            fontSize: "1rem",
                            paddingTop: "1rem",
                          },

                          textAlign: "left",
                          paddingBottom: "0.25rem",
                          //
                          fontWeight: 700,
                          fontSize: "1rem",
                          paddingTop: "1rem",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="false"
                          sx={{
                            textAlign: "left",
                            //fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            // color: "#191919",
                            //
                            textRendering: "optimizeLegibility",
                            //fontSize: "18px!important",
                            //lineHeight: "24px!important",
                            color: "#0F1111",

                            "&:last-child": {
                              fontWeight: 700,
                              //fontSize: "1rem",
                              fontSize: "17px!important",
                              lineHeight: "24px!important",
                            },
                          }}
                        >
                          Total de la commande
                        </Box>
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          minWidth: 0,

                          "&:last-child": {
                            fontWeight: 700,
                            fontSize: "1rem",
                            paddingTop: "1rem",
                          },

                          textAlign: "right",
                          paddingBottom: "0.25rem",
                          //
                          fontWeight: 700,
                          fontSize: "1rem",
                          paddingTop: "1rem",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="false"
                          sx={{
                            textAlign: "right",
                            // borderCollapse: "collapse",
                            //fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                            // color: "#191919",
                            //
                            textRendering: "optimizeLegibility",
                            // fontSize: "18px!important",
                            //lineHeight: "24px!important",
                            color: "#0F1111",
                            //fontWeight: "400!important",
                            //
                            "&:last-child": {
                              fontWeight: 700,
                              // fontSize: "1rem",
                              fontSize: "18px!important",
                              lineHeight: "24px!important",
                            },
                          }}
                        >
                          &nbsp;
                          <Box component="span">
                            {carttotalCommande}&nbsp;Dhs
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
                marginBottom: "1rem",
                marginTop: "0.25rem",
                fontSize: ".875rem",
                WebkitTextSizeAdjust: "100%",
                color: "#191919",
              }}
            >
              {/* <Box
              component="form"
              onSubmit={handleSubmitChekout(onSubmitChekout)}
            >
              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("showCarteBancaire")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("showAdresseFact")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("showAdresseLiv")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("validAdrFact")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("validCartItQt")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("validModePay")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("confirmerPayer")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("goAdresseFact")} />
              </Box>

              <Box
                sx={{
                  display: "none",
                }}
              >
                <input {...registerChekout("goItemsPanier")} />
              </Box> */}

              <Box
                component="input"
                type="hidden"
                name="srt"
                sx={{
                  appearance: "none",
                  backgroundColor: "initial",
                  cursor: "default",
                  display: "none !important",
                  padding: "initial",
                  border: "initial",
                }}
              ></Box>
              <Box
                sx={{
                  fontSize: ".875rem",
                  WebkitTextSizeAdjust: "100%",
                  color: "#191919",
                }}
              >
                {/*
              <Box
                component="button"
                aria-disabled="true"
                //disabled={!getValuesChekout("confirmerPayer")}
                //disabled={verifItemQteeUpd.current}
                //disabled={!confirmerPayerRef.current}
                disabled={!getValuesChekout("confirmerPayer")}
                type="submit"
                // onClick={() => handleSubmit(onSubmitChekout)}
                sx={{
                  backgroundColor: "#767676",

                  borderColor: "#c7c7c7",
                  color: "#fff",
                  marginRight: 0,
                  marginLeft: 0,
                  borderRadius: "24px",
                  fontSize: "1rem",
                  minHeight: "48px",
                  padding: "13px 20px",
                  fontWeight: 700,
                  border: "1px solid",
                  WebkitBoxSizing: "border-box",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                  margin: 0,
                  textAlign: "center",
                  textDecoration: "none",
                  verticalAlign: "bottom",
                  display: "inline-block",
                  minWidth: "88px",
                  //
                  width: "100%",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    // fontSize: "1rem",
                    fontFamily: "inherit",
                    textAlign: "center",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: "1rem",
                      fontFamily: "inherit",
                      textAlign: "center",
                    }}
                  ></Box>
                  Retour au panier
                </Box>
              </Box> */}

                {!verifOptModePay() && (
                  //getValuesChekout("validModePay") === false && (
                  // !getValuesChekout("validModePay") && (
                  <StepToComplete stepNotDone="Séléctionner une option de paiement" />
                )}
              </Box>
              {/*</Box> */}
            </Box>
          </Box>
          <Box
            sx={{
              //borderRadius: "0 0 8px 8px",
              border: "1px #D5D9D9 solid",
              marginTop: "-1px",
              backgroundColor: "#F0F2F2!important",
              marginBottom: "0!important",
              display: "block",
            }}
          >
            <Box
              sx={{
                // borderRadius: "0 0 8px 8px",
                position: "relative",
                padding: "14px 18px",
              }}
            >
              <Box
                sx={{
                  marginBottom: "4px!important",
                  width: "100%",
                  fontSize: "12px!important",
                  lineHeight: "16px!important",

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
              ></Box>
              <Box
                sx={{
                  marginBottom: "4px!important",
                  width: "100%",
                  fontSize: "12px!important",
                  lineHeight: "16px!important",

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
                  textAlign: "center!important",
                }}
              >
                <Box
                  component="a"
                  // Add
                  onClick={() => {
                    router.push({
                      pathname: "/cart",
                    });
                  }}
                  sx={{
                    textDecoration: "none",
                    color: "#007185",

                    ":link": {
                      textDecoration: "none",
                      color: "#007185",
                    },

                    ":-webkit-any-link": {
                      cursor: "pointer",
                    },

                    cursor: "pointer",

                    fontSize: "14px!important",
                    // lineHeight: "16px!important",
                    lineHeight: "1.42857px!important",
                    WebkitTextSizeAdjust: "100%",

                    //
                    backgroundColor: "transparent",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    textAlign: "center!important",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  Retour au panier
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );

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
          <Box component="form" onSubmit={handleSubmitChekout(onSubmitChekout)}>
            <Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("showCarteBancaire")} />
            </Box>

            <Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("showAdresseFact")} />
            </Box>

            <Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("showAdresseLiv")} />
            </Box>

            {/* <Box
            sx={{
              display: "none",
            }}
          >
            <input {...registerChekout("validAdrFact")} />
          </Box>

          <Box
            sx={{
              display: "none",
            }}
          >
            <input {...registerChekout("validCartItQt")} />
          </Box>

          <Box
            sx={{
              display: "none",
            }}
          >
            <input {...registerChekout("validModePay")} />
          </Box>

          <Box
            sx={{
              display: "none",
            }}
          >
            <input {...registerChekout("confirmerPayer")} />
          </Box>*/}

            <Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("optModepaiement")} />
            </Box>

            <Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("goAdresseFact")} />
            </Box>

            <Box
              sx={{
                display: "none",
              }}
            >
              <input {...registerChekout("goItemsPanier")} />
            </Box>
          </Box>
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
                sx={{
                  marginBottom: "1.5rem",
                }}
              >
                <Box
                  component="header"
                  sx={{
                    borderColor: "#DDD!important",
                    borderStyle: "solid!important",
                    borderWidth: "0 0 1px 0!important",
                    background: "#f9f9f9!important",
                    // backgroundImage:
                    //  "url(https://images-na.ssl-images-amazon.com/images/G/31/common/sprites/tspc-header-bkg.png)",
                    height: "60px",
                    backgroundPositionY: "-13px",
                    marginBottom: "0!important",
                    WebkitTextSizeAdjust: "100%",
                    fontSize: "14px",
                    lineHeight: "20px",
                    color: "#0F1111",
                    display: "block",
                    MozBoxSizing: "border-box",
                    WebkitBoxSizing: "border-box",
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      display: "table!important",
                      tableLayout: "fixed",
                      zoom: 1,
                      borderCollapse: "collapse",
                      maxWidth: "1150px",
                      margin: "auto",
                      height: "100%",
                      textAlign: "center!important",
                      width: "100%",

                      "&::before,&::after": {
                        display: "none",
                      },

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
                        verticalAlign: "middle",
                        width: "17.43%",
                        //  width: '14.948%',
                        float: "none!important",
                        display: "table-cell!important",
                        zoom: 1,
                        paddingRight: "14px",
                        marginRight: "2%",
                        minHeight: "1px",
                        overflow: "visible",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          borderCollapse: "collapse",

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
                            paddingTop: "6px",
                            paddingRight: "0.1em",
                            paddingBottom: "0.1em",
                            marginRight: 0,
                            float: "right",
                            width: "100%",
                            minHeight: "1px",
                            overflow: "visible",
                          }}
                        >
                          <Box component="span">
                            <Box component="span">
                              <Box
                                sx={{
                                  "&::before,&::after": {
                                    display: "table",
                                    content: '""',
                                    lineHeight: 0,
                                    fontSize: 0,
                                  },

                                  "&::after": {
                                    clear: "both",
                                  },
                                  //
                                  marginLeft: "1rem",
                                }}
                              >
                                <Box
                                  //component="a"
                                  component="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleNavHome();
                                  }}
                                  disabled={isLoading}
                                  sx={{
                                    display: "block",
                                    overflow: "hidden",
                                    position: "relative",

                                    ":visited": {
                                      color: "#3665f3",
                                    },

                                    ":-webkit-any-link": {
                                      cursor: "pointer",
                                    },

                                    cursor: "pointer",
                                    // Add
                                    textDecoration: "none",
                                    width: "103px",
                                    height: "31px",
                                    // height: "31px",
                                    //
                                    backgroundColor: "transparent",
                                    border: "none",
                                    outline: 0,
                                  }}
                                >
                                  <Image
                                    src="/logodimapromo.svg"
                                    alt="logo"
                                    //layout="fill"
                                    layout="responsive"
                                    width={103}
                                    height={31}
                                  />
                                  {/*<Box
                              component="i"
                              sx={{
                                backgroundImage: "url(/logodimapromo10.png)",
                                cursor: "pointer",
                                backgroundPosition: "-2px -167px",
                                height: "31px",
                                width: "103px",
                                WebkitBackgroundSize: "512px 256px",
                                backgroundSize: "512px 256px",
                                backgroundRepeat: "no-repeat",
                                display: "inline-block",
                                verticalAlign: "top",
                              }}
                            ></Box> */}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        verticalAlign: "middle",
                        width: "69.93%",
                        //width: '65.948%',
                        float: "none!important",
                        display: "table-cell!important",
                        zoom: 1,
                        paddingRight: "14px",
                        marginRight: "2%",
                        minHeight: "1px",
                        overflow: "visible",
                      }}
                    >
                      <Box
                        component="h1"
                        sx={{
                          fontSize: "1.5rem",
                          //paddingTop: 0,
                        }}
                      >
                        Passer la commande
                        <Box
                          component="span"
                          sx={{
                            textRendering: "optimizeLegibility",
                            fontSize: "24px!important",
                            lineHeight: "32px!important",
                            fontWeight: 400,
                            color: "#0F1111",
                            WebkitTextSizeAdjust: "100%",
                          }}
                        >
                          &nbsp;(
                          <Box
                            component="span"
                            sx={{
                              MozBoxSizing: "border-box",
                              WebkitBoxSizing: "border-box",
                              boxSizing: "border-box",
                              textRendering: "optimizeLegibility",
                              fontSize: "24px!important",
                              lineHeight: "32px!important",
                              fontWeight: 400,
                              color: "#0F1111",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                MozBoxSizing: "border-box",
                                WebkitBoxSizing: "border-box",
                                boxSizing: "border-box",

                                textRendering: "optimizeLegibility",
                                fontSize: "24px!important",
                                lineHeight: "32px!important",
                                fontWeight: 400,
                                color: "#0F1111",
                                WebkitTextSizeAdjust: "100%",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  cursor: "pointer",
                                  color: "#007185!important",

                                  MozBoxSizing: "border-box",
                                  WebkitBoxSizing: "border-box",
                                  boxSizing: "border-box",

                                  textRendering: "optimizeLegibility",

                                  fontSize: "24px!important",
                                  lineHeight: "32px!important",
                                  fontWeight: 500,
                                  WebkitTextSizeAdjust: "100%",
                                }}
                              >
                                {getItemsCount()}&nbsp;articles
                              </Box>
                            </Box>
                          </Box>
                          )
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        verticalAlign: "middle",
                        paddingRight: 0,
                        width: "17.43%",
                        float: "none!important",
                        display: "table-cell!important",
                        zoom: 1,
                        marginRight: 0,
                        minHeight: "1px",
                        overflow: "visible",
                      }}
                    ></Box>
                  </Box>
                </Box>
              </Box>

              <Box
                tabIndex="-1"
                role="main"
                sx={{
                  outline: "0 none",
                }}
              >
                {!verifOptModePay() && (
                  <MainNotice notice="Sélectionner une option de paiement" />
                )}

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
                      {/* 
                  {!verifOptModePay() && (
                   
                    <MainNotice notice="Sélectionner une option de paiement" />
                  )}  */}

                      {cart.length === 0 ? (
                        <h1>Votre panier est vide!</h1>
                      ) : (
                        <>
                          {selectModePaiement}
                          {verifOptModePay() && <AdrLivForm />}
                          {verifOptModePay() && watchGoAdrFact && (
                            <AdrFactForm />
                          )}
                          {verifOptModePay() &&
                            watchGoAdrFact &&
                            watchGoPanier && <VerifPanier />}
                        </>
                      )}
                    </Box>
                    {cart.length !== 0 && <>{summary}</>}
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
      <FormProvider {...methodsCheckout}>
        <Box
        //  component="form"
        // onSubmit={methodsCheckout.handleSubmit(onSubmitCheck)}
        >
          <HandlesCheckout />
        </Box>
      </FormProvider>
    </>
  );
};

export default Checkout;
