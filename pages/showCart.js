import React, {
  useState,
  useEffect,
  useRef,
  // forwardRef,
  //useCallback,
  //  Suspense,
} from "react";
import Box from "@mui/material/Box";
import Image from "next/image";

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import Backdrop from "@mui/material/Backdrop";
import { productUpdated } from "../redux/features/cart/cartSlice";
import { productRemoved } from "../redux/features/cart/cartSlice";
import { cartSpinnerAsync } from "../redux/features/cart/cartSlice";
import { cartDropdownAsync } from "../redux/features/cart/cartSlice";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

///////////////////////////////////   Add     ////////////////////////////////////////

import SvgIcon from "@mui/material/SvgIcon";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "next-auth/react";
import { useAddUserIdMutation } from "../redux/features/api/apiSlice";

import ReactDOM from "react-dom"; // Import ReactDOM
//
//import dynamic from "next/dynamic";
//import DialogCheckout from "../components/DialogCheckout";
///////////////////////////////////   End Add     ////////////////////////////////////////

export const Cart = () => {
  const router = useRouter();

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

  const clickDialogCheckout = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      setOpenDialogCheckout(true);
    } else {
      //console.log("session userid : ", session.user.id);
      if (session.user.id) {
        await handleNavCheckout(session.user.id);
      }
    }
  };

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
    setOpenDialogCheckout(false);
    setIsNavSignIn(true);
    try {
      await router.push({
        pathname: "/auth/authForm",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavSignIn(false);
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
        setOpenDialogCheckout(false);
        const response = await addUserId().unwrap();
        //console.log("Samedi userId response : ", response);

        if (
          addUserIdIsSuccess ||
          response?.userId
          // response?.message.includes("User added successfully")
        ) {
          //console.log("Samedi userId response : ", response);
          await handleNavCheckout(response?.userId);
          // setOpenDialogCheckout(false);
        }
      }
    } catch (err) {
      console.error(
        "Un probleme est survenu pour acheter sans être inscrit: ",
        err
      );
    } finally {
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
                              Se connecter pour finaliser l'achat
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
                              Finaliser l'achat sans être inscrit
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

  const backDropRef = useRef(false);

  const cart = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();

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

  // Getting the count of items
  const getItemsCount = () => {
    return cart.reduce((accumulator, item) => accumulator + item.prodQtee, 0);
  };

  const HandlesCartQtee = ({ cartItemId }) => {
    //const theme = useTheme();
    // const fullScreen = useMediaQuery(theme.breakpoints.up("sm"));

    // const HandlesCartQtee = ({ cartItemId, qteeAllowed }) => {
    const itemCart = useSelector((state) =>
      state.cart.products.find(
        (product) => product.prodId === parseInt(cartItemId)
      )
    );

    const maxCartQtee = itemCart.prodQteeDisp < 10 ? itemCart.prodQteeDisp : 10;
    const QteeAllowed = [];

    for (let i = 1; i <= maxCartQtee; i++) {
      if (i === 10) {
        QteeAllowed.push("10+");
      } else {
        QteeAllowed.push(i);
      }
    }

    const options = QteeAllowed.map((opt, index) => (
      <Box component="option" value={opt} key={index}>
        {opt}
      </Box>
    ));

    // const cartStatus = itemCart.status;
    let cartStatus = itemCart.status;

    let isLoading = itemCart.status === "loading";

    const prodId = parseInt(cartItemId);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleRemove = () => {
      dispatch(productRemoved({ prodId }));
    };

    //const [openBackdrop, setOpenBackdrop] = useState(false);

    const qteUpdate = itemCart.prodQtee > 9 ? true : false;
    const [qteeItemCart, setQteeItemCart] = useState({
      // showQteInput: qteUpdate,
      showQteInput: false,
      // showQteUpdate: qteUpdate,
      showQteUpdate: false,
      QteeItemcart: itemCart.prodQtee,
      dropDownQtee: false,
      InputUpdQtee: false,
      //  hasError: false,
      //  touched: false,
      qteeLessTen: false,
      // openBackdrop: false,
    });

    const [qteeError, setQteeError] = useState({
      hasError: false,
      touched: false,
    });

    //const [openAlert, setOpenAlert] = useState(false);
    const UseFocus = () => {
      const htmlElRef = useRef(null);
      const setFocus = () => {
        htmlElRef.current && htmlElRef.current.focus();
      };

      return [htmlElRef, setFocus];
    };

    //const inputEl = useRef();

    const hasErrEmptyQte = useRef(false);

    const hasErrMoreQte = useRef(false);

    const qteUpdateRef = useRef(qteUpdate);

    //const backDropRef = useRef(false);

    const [inputQteRef, setInputQteFocus] = UseFocus();

    useEffect(() => {
      //inputEl.current.focus();
      (async () => {
        let prodQuantity = qteeItemCart.QteeItemcart;

        if (qteeItemCart.InputUpdQtee) {
          try {
            backDropRef.current = true;
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
            )
              .unwrap()
              .then(() => {
                if (prodQuantity < 10) {
                  setQteeItemCart({
                    ...qteeItemCart,
                    qteeLessTen: true,
                    openBackdrop: true,
                  });
                }

                setQteeItemCart((previous) => ({
                  ...previous,
                  InputUpdQtee: false,
                  showQteUpdate: false,
                  openBackdrop: true,
                }));

                qteUpdateRef.current = false;
                backDropRef.current = false;
              });
          } catch (err) {
            console.error("Failed to load spinner: ", err);
          }
        }
        // setInputQteFocus();
        //inputEl.current.focus();
      })();
    }, [
      qteeItemCart.InputUpdQtee,
      qteeItemCart.QteeItemcart,
      // prodId,
      //qteeItemCart.openBackdrop,
      qteeItemCart.showQteUpdate,
      // backDropRef.current,
      dispatch,
    ]);

    ////////////////////////////////////////////////////////////////////

    useEffect(() => {
      let prodQuantity = qteeItemCart.QteeItemcart;
      // let vdrop = qteeItemCart.dropDownQtee;

      //  if (qteeItemCart.dropDownQtee && prodQuantity === 10) {
      if (prodQuantity >= 10) {
        setQteeItemCart((previous) => ({
          ...previous,
          showQteInput: true,
          showQteUpdate: true,
          dropDownQtee: false,
          qteeLessTen: true,
        }));

        qteUpdateRef.current = true;
      }

      //  if (qteeItemCart.dropDownQtee && prodQuantity < 10) {
      if (!qteeItemCart.qteeLessTen && prodQuantity < 10) {
        setQteeItemCart((previous) => ({
          ...previous,
          showQteInput: false,
          showQteUpdate: false,
          dropDownQtee: true,
        }));

        qteUpdateRef.current = false;

        //  }));
      }
    }, [
      qteeItemCart.dropDownQtee,
      qteeItemCart.QteeItemcart,
      //  prodId,
      qteeItemCart.showQteInput,
      qteeItemCart.showQteUpdate,
      qteeItemCart.qteeLessTen,
    ]);

    /////////////////////////////////////////////////////////////////////

    useEffect(() => {
      (async () => {
        let prodQuantity = qteeItemCart.QteeItemcart;

        if (qteeItemCart.dropDownQtee && prodQuantity <= 10) {
          try {
            await dispatch(
              cartDropdownAsync({
                prodId,
                prodQuantity,
              })
            ).unwrap();
          } catch (err) {
            console.error("Failed to load cart drop down: ", err);
          }
        }
      })();
    }, [qteeItemCart.dropDownQtee, qteeItemCart.QteeItemcart, dispatch]);

    const ShowQteInputField = qteeItemCart.showQteInput;

    const handleCloseBackdrop = () => {
      let isIdle;
      return (isIdle = itemCart.status === "idle");
    };

    const handleQteInput = (event) => {
      let value;

      if (!isNaN(event.target.value)) {
        value = parseInt(event.target.value);
      } else {
        value = event.target.value;
      }

      let hasError = false;
      hasErrEmptyQte.current = false;
      hasErrMoreQte.current = false;

      if (value === 0 || value === "" || isNaN(value)) {
        hasError = true;
        hasErrEmptyQte.current = true;
        hasErrMoreQte.current = false;

        qteUpdateRef.current = false;

        setQteeError((qteeError) => ({
          ...qteeError,
          hasError: true,
          touched: true,
        }));
      } else if (value > itemCart.prodQteeDisp) {
        hasError = true;
        hasErrMoreQte.current = true;
        hasErrEmptyQte.current = false;

        qteUpdateRef.current = false;

        setQteeError((qteeError) => ({
          ...qteeError,
          hasError: true,
          touched: true,
        }));
      } else {
        setQteeError((qteeError) => ({
          ...qteeError,
          hasError: false,
          touched: true,
        }));

        qteUpdateRef.current = true;
      }

      setQteeItemCart((qteeItemCart) => ({
        ...qteeItemCart,
        //  showQteUpdate: true,
        QteeItemcart: value,
      }));
    };

    const blurQteInput = () => {
      setQteeItemCart((qteeError) => ({
        ...qteeError,
        hasError: false,
        touched: true,
      }));
    };

    const handleQteInputUpdate = () => {
      setQteeItemCart((qteeItemCart) => ({
        ...qteeItemCart,
        InputUpdQtee: true,
      }));

      qteUpdateRef.current = false;
      // backDropRef.current = true;
    };

    const handleDropdown = (e) => {
      e.preventDefault();
      let value = parseInt(e.target.value);

      qteUpdateRef.current = false;

      setQteeItemCart((previous) => ({
        ...previous,
        QteeItemcart: value,
        dropDownQtee: true,
        showQteInput: false,
        showQteUpdate: false,
        InputUpdQtee: false,
      }));
    };

    return (
      <>
        {ShowQteInputField ? (
          <>
            <Box
              component="label"
              sx={{
                marginRight: "8px",
                textAlign: "right",
                //
                // display: "inline-block",
              }}
            >
              <Box component="span">
                <Box component="span">
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
                    Quantité
                  </Box>
                  <Box component="span" aria-hidden="true">
                    Qté
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box component="span">
              <Box
                component="input"
                type="number"
                min="1"
                maxlength="3"
                max={itemCart.prodQteeDisp}
                // value={QuantityInput}
                //value={QteeItemcart}
                value={qteeItemCart.QteeItemcart}
                autocomplete="off"
                name="quantityBox"
                required
                pattern="[1-9]\d*"
                //  pattern="[0-9]*"
                onChange={handleQteInput}
                onBlur={blurQteInput}
                //onKeyPress={handleKeyPress}
                //ref={inputEl}
                ref={inputQteRef}
                sx={{
                  display: "inline-block",
                  fontSize: "13px",
                  lineHeight: "19px",
                  backgroundColor: "#fff",
                  height: "31px",
                  padding: "3px 7px",
                  border: "1px solid #888C8C",
                  borderRadius: "3px",
                  boxShadow: "0 1px 2px rgb(15 17 17 / 15%) inset",
                  outline: 0,
                  width: "77px",
                  marginBottom: "4px!important",
                  WebkitTransition: "all .1s linear",
                  transition: "all .1s linear",
                  // color: "#0F1111",
                  marginRight: "4px",
                  //verticalAlign: "middle",
                  fontWeight: 700,

                  //

                  ":hover": {
                    backgroundColor: "#F7FEFF",
                    borderColor: "#007185",
                    boxShadow:
                      "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                  },
                  ":focus": {
                    backgroundColor: "#F7FEFF",
                    borderColor: "#007185",
                    boxShadow:
                      "0 0 0 3px #C8F3FA,0 1px 2px rgba(15,17,17,.15) inset",
                  },
                }}
              ></Box>

              {qteeItemCart.showQteUpdate &&
                !hasErrMoreQte.current &&
                !hasErrEmptyQte.current && (
                  <Box
                    component="span"
                    sx={{
                      marginTop: "8px!important",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        height: "22px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
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
                          onClick={handleQteInputUpdate}
                          type="button"
                          // disabled={true}
                          sx={{
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
                          Mettre à jour
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            position: "absolute!important",
                            left: "0!important",
                            bottom: "-1px!important",
                            zIndex: "-1!important",
                            opacity: 0,
                          }}
                        >
                          Description produit
                        </Box>
                        <Backdrop
                          sx={{
                            color: "#fff",
                            //color: "transparent",

                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            //
                            position: "absolute",
                          }}
                          open={isLoading}
                          onClick={handleCloseBackdrop}
                        ></Backdrop>
                      </Box>
                    </Box>
                  </Box>
                )}
            </Box>

            {cartStatus === "loading" ? <CircularProgress size={20} /> : null}
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
              component="span"
              sx={{
                fontSize: "12px!important",
                lineHeight: "16px!important",
                //
              }}
            >
              <Box component="span">
                <Box
                  // component="button"
                  component="submit"
                  name="submitsupprimer"
                  value="Supprimer"
                  type="submit"
                  /*onClick={() => {
                    const prodId = parseInt(cartItemId);
                    dispatch(productRemoved({ prodId }));
                  }}*/
                  onClick={handleClickOpen}
                  sx={{
                    background: "0 0",
                    border: 0,
                    cursor: "pointer",
                    margin: 0,
                    overflow: "visible",
                    padding: 0,
                    font: "inherit",
                    lineHeight: "inherit",
                    WebkitAppearance: "button",

                    transition: "all .1s linear",
                    WebkitTransition: "all .1s linear",
                    verticalAlign: "middle",
                    //////////////////
                    backgroundColor: "transparent",

                    fontFamily: "inherit",
                    fontSize: "inherit",

                    textDecoration: "underline",

                    color: "#007185!important",
                  }}
                >
                  Suprimer
                </Box>
                <Box>
                  <Dialog
                    // fullScreen={fullScreen}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                  >
                    <DialogTitle id="responsive-dialog-title">
                      {"Retirer du panier"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Voulez-vous vraiment supprimer cet article du panier?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleClose}>
                        Non
                      </Button>
                      <Button onClick={handleRemove} autoFocus>
                        Retirer
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Box>
            </Box>

            {hasErrEmptyQte.current && (
              <Box
                sx={{
                  color: "#e0103a",
                  fontSize: ".875rem",
                  fontWeight: 400,
                  // textAlign: "right",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    color: "#e0103a",
                    fontSize: ".875rem",
                    fontWeight: 400,
                  }}
                >
                  <Box component="span">
                    <Box
                      component="span"
                      sx={{
                        boxSizing: "inherit",
                        color: "#e0103a",
                        fontSize: ".875rem",
                        fontWeight: 500,
                        // textAlign: "right",
                      }}
                    >
                      Quantité non valide
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {hasErrMoreQte.current && (
              <Box
                sx={{
                  color: "#e0103a",
                  fontSize: ".875rem",
                  fontWeight: 400,
                  // textAlign: "right",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    color: "#e0103a",
                    fontSize: ".875rem",
                    fontWeight: 400,
                  }}
                >
                  <Box component="span">
                    <Box
                      component="span"
                      sx={{
                        boxSizing: "inherit",
                        color: "#e0103a",
                        fontSize: ".875rem",
                        fontWeight: 500,
                        // textAlign: "right",
                      }}
                    >
                      Il n'en reste plus que {itemCart.prodQteeDisp} !
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </>
        ) : (
          <Box component="span">
            <Box component="span">
              <Box
                component="span"
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    minWidth: "0.545455%",
                    borderColor: "#D5D9D9",
                    borderRadius: "8px",
                    color: "#0F1111",
                    background: "#F0F2F2",
                    boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",

                    borderStyle: "solid",
                    borderWidth: "1px",
                    cursor: "pointer",
                    display: "inline-block",
                    padding: 0,
                    textAlign: "center",
                    textDecoration: "none!important",
                    verticalAlign: "middle",
                    // "&:hover": {
                    //     background: "#E3E6E6",
                    //  },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      borderRadius: "7px",
                      background: "#F0F2F2",
                      boxShadow: "0 2px 5px rgb(15 17 17 / 15%)",
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
                      sx={{
                        height: "100%",
                        paddingRight: "26px",
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        position: "relative",
                        zIndex: 10,

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
                        //
                        // textAlign: "center",
                      }}
                    >
                      <Box
                        component="label"
                        for="quantity"
                        sx={{
                          // position: "absolute",
                          //opacity: ".01",
                          // maxWidth: "100%",
                          //    left: 0,
                          //    zIndex: "1!important",
                          //    display: "block",
                          //    paddingLeft: "2px",
                          //    paddingBottom: "2px",
                          //   fontWeight: 700,
                          //
                          // marginRight: "4px",
                          // paddingRight: "8px",
                          //paddingLeft: "8px",
                          marginRight: "6px",
                          textAlign: "left",
                          color: "#0F1111",
                          fontWeight: 700,
                          //fontSize: "13px",
                          //lineHeight: "29px",
                          fontSize: ".875rem",
                          whiteSpace: "nowrap",

                          //
                          // textAlign: "center",
                        }}
                      >
                        Qté&nbsp;:
                        <Box component="span" aria-label="Quantité&nbsp;"></Box>
                      </Box>

                      <Box
                        component="select"
                        name="quantity"
                        autocomplete="off"
                        id="quantity"
                        tabindex="0"
                        //
                        //value={QteeDropdown}
                        value={qteeItemCart.QteeItemcart}
                        onChange={handleDropdown}
                        // onChange={(e) => handleDropdown(e)}
                        /////

                        sx={{
                          // WebkitAppearance: "none",
                          // MozAppearance: "none",
                          //  appearance: "none",
                          appearance: "auto",

                          color: "inherit",
                          fontFamily: "inherit",

                          backgroundColor: "transparent",

                          border: "none",
                          outline: "none",
                          scrollBehavior: "smooth",
                          fontSize: ".875rem",
                          fontWeight: 700,
                          //
                          // display: "none!important",
                          // visibility: "hidden!important",
                        }}
                      >
                        {options}
                      </Box>
                    </Box>
                  </Box>
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
                  component="span"
                  sx={{
                    fontSize: "12px!important",
                    lineHeight: "16px!important",
                    //
                  }}
                >
                  <Box component="span">
                    <Box
                      // component="button"
                      component="submit"
                      name="submitsupprimer"
                      value="Supprimer"
                      type="submit"
                      /* onClick={() => {
                        const prodId = parseInt(cartItemId);
                        dispatch(productRemoved({ prodId }));
                      }}*/
                      onClick={handleClickOpen}
                      sx={{
                        background: "0 0",
                        border: 0,
                        cursor: "pointer",
                        margin: 0,
                        overflow: "visible",
                        padding: 0,
                        font: "inherit",
                        lineHeight: "inherit",
                        WebkitAppearance: "button",

                        transition: "all .1s linear",
                        WebkitTransition: "all .1s linear",
                        verticalAlign: "middle",
                        //////////////////
                        backgroundColor: "transparent",

                        fontFamily: "inherit",
                        fontSize: "inherit",

                        textDecoration: "underline",

                        color: "#007185!important",
                      }}
                    >
                      Suprimer
                    </Box>
                    <Box>
                      <Dialog
                        // fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                      >
                        <DialogTitle id="responsive-dialog-title">
                          {"Retirer du panier"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Voulez-vous vraiment supprimer cet article du
                            panier?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button autoFocus onClick={handleClose}>
                            Non
                          </Button>
                          <Button onClick={handleRemove} autoFocus>
                            Retirer
                          </Button>
                        </DialogActions>
                      </Dialog>
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

  const cartContents = cart.map((item) => {
    const CartItemPrice = parseFloat(
      Math.round(item.prodPrix * 100) / 100
    ).toFixed(2);

    return (
      <Box
        key={item.prodId}
        sx={{
          borderBottom: "1px solid #DDD",
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
        // Start
        >
          <Box
            sx={{
              marginTop: "12px!important",
              marginBottom: "12px!important",
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
                width: "82.948%",
                marginRight: "2%",
                float: "left",
                minHeight: "1px",
                overflow: "visible",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    padding: 0,

                    paddingLeft: "220px",

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
                      width: "220px",
                      marginLeft: "-220px",
                      overflow: "hidden",
                      zoom: 1,
                      float: "left!important",
                      position: "relative",
                      minHeight: "1px",
                    }}
                  >
                    <Box
                      component="a"
                      sx={{
                        "&:active": {
                          textDecoration: "none",
                          color: "#1B4B79",
                        },

                        "&:hover": {
                          cursor: "pointer",
                        },

                        "&:active, &:hover": {
                          outline: 0,
                        },

                        //
                      }}
                    >
                      <Box
                        sx={{
                          display: "block",
                          //position: "relative",
                          verticalAlign: "top",
                          maxWidth: "100%",
                          border: 0,
                          width: "180px",
                          aspectRatio: "auto 180 / 180",
                          height: "180px",
                          color: "#1B4B79",
                          //
                        }}
                      >
                        <Image
                          src={item.prodImage}
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
                      paddingLeft: "1%",
                      float: "left",
                      width: "100%",
                      position: "relative",
                      overflow: "visible",
                      zoom: 1,
                      minHeight: "1px",
                    }}
                  >
                    <Box
                      component="ul"
                      sx={{
                        marginLeft: 0,
                        color: "#0F1111",
                        padding: 0,
                        margin: "0 0 0 18px",
                        marginBottom: "4px!important",
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
                          color: "#0F1111",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#0F1111",
                            // listStyle: "none",
                            wordWrap: "break-word",
                            // textAlign: "-webkit-match-parent",
                          }}
                        >
                          <Box
                            component="a"
                            sx={{
                              "&:visited": {
                                textDecoration: "none",
                                color: "#007185",
                              },

                              cursor: "pointer",
                              textDecoration: "none",

                              ":-webkit-any-link": {
                                cursor: "pointer",
                              },
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                color: "#0F1111!important",
                                textRendering: "optimizeLegibility",
                                fontSize: "18px!important",
                                // fontSize: "14px!important",
                                lineHeight: "24px!important",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  lineHeight: "1.3em !important",
                                  maxHeight: "2.6em",
                                  display: "block",
                                  wordBreak: "normal",
                                  position: "relative",
                                  width: "100%",
                                  overflow: "hidden",
                                  textRendering: "optimizeLegibility",
                                  fontSize: "18px!important",
                                  //  fontSize: "14px!important",
                                  color: "#0F1111!important",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    position: "absolute!important",
                                    left: "0!important",
                                    bottom: "-1px!important",
                                    zIndex: "-1!important",
                                    opacity: 0,
                                    display: "inline-block",
                                    width: "100%",
                                    whiteSpace: "normal",
                                    lineHeight: "1.3em !important",
                                    wordBreak: "normal",
                                    textRendering: "optimizeLegibility",
                                    fontSize: "18px!important",
                                    color: "#0F1111!important",
                                  }}
                                >
                                  {item.prodDesc}
                                </Box>
                                <Box
                                  component="span"
                                  sx={{
                                    height: "2.6em",
                                    display: "inline-block",
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
                                  {item.prodDesc}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        component="li"
                        sx={{
                          listStyle: "none",
                          wordWrap: "break-word",
                          margin: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          color: "#0F1111",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#0F1111",
                            listStyle: "none",
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
                            }}
                          >
                            {item.prodEtat}
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        marginTop: "-4px",
                        marginBottom: "3px",
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
                        //////
                        margin: "0 0 0 18px",
                        //margin: "0 0 0 24px",
                        // paddingInlineStart: "40px",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          maxWidth: "110px",
                        }}
                      >
                        {/* <Box
                      component="input"
                      type="text"
                      value={item.prodId}
                      name="quantityBox"
                      //onChange={handleProductId}
                      onChange={() => itemId(item.prodId)}
                      sx={{
                        display: "none!important",
                        visibility: "hidden!important",
                      }}
                    ></Box> */}

                        <HandlesCartQtee
                          cartItemId={item.prodId}
                          //  handleCloseAlert={handleCloseAlert()}
                          //  openAlert={openAlert}
                        />
                      </Box>

                      {/*
                 
                */}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                marginRight: 0,
                float: "right",
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
                  padding: 0,
                  margin: "0 0 14px 0",
                  marginBottom: "4px!important",
                  textAlign: "right!important",
                  color: "#0F1111",
                  fontSize: "14px",
                  lineHeight: "20px",
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
                  }}
                >
                  {CartItemPrice}&nbsp;dhs
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  });

  return (
    <Box>
      {isLoading && !isNavCheckout && !isNavSignIn && (
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
                      component="form"
                      method="get"
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
                                boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
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
                                  // type="submit"
                                  type="button"
                                  //  value="Proceed to checkout"
                                  onClick={clickDialogCheckout}
                                  disabled={
                                    isLoading || isNavCheckout || isNavSignIn
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
                      component="form"
                      method="post"
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
                        }}
                      >
                        {cart.length === 0 ? (
                          <h1>Votre panier est vide!</h1>
                        ) : (
                          <>{cartContents}</>
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

export default Cart;
