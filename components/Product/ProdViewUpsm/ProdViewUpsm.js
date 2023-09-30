import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SvgIcon from "@mui/material/SvgIcon";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import LoopIcon from "@mui/icons-material/Loop";

import Link from "next/link";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
import { productAdded } from "../../../redux/features/cart/cartSlice";
import { useAddUserIdMutation } from "../../../redux/features/api/apiSlice";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import DialogContentText from "@mui/material/DialogContentText";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";

import { useSession } from "next-auth/react";

export const ProdViewUpsm = ({ selectedprd }) => {
  const { data: session } = useSession();

  ////
  const [openBuyNow, setOpenBuyNow] = useState(false);
  const [isNavCheckout, setIsNavCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavOpenCart, setIsNavOpenCart] = useState(false);
  const [isNavSignIn, setIsNavSignIn] = useState(false);
  const [checkoutWithoutInsc, setCheckoutWithoutInsc] = useState(false);

  const handleCloseBuyNow = () => {
    setOpenBuyNow(false);
  };

  const dispatch = useDispatch();

  const router = useRouter();

  const [prodQtee, setProdQtee] = useState(1);

  let qteemax = selectedprd[0].qteedisp || 0;
  const options = [];
  for (let i = 1; i <= qteemax; i++) {
    options.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  const handleChange = (event) => {
    setProdQtee(parseInt(event.target.value));
  };

  function CustCloseIcon(props) {
    return (
      <SvgIcon {...props}>
        <CloseIcon />
      </SvgIcon>
    );
  }

  //console.log("Quantite depart : ");
  // console.log(prodQtee);

  const prodId = selectedprd[0].imgNum;
  const prodImage = selectedprd[0].imgJpg;
  const prodDesc = selectedprd[0].descPrd;

  const prodPrix = selectedprd[0].prixAct;
  const prodEtat = selectedprd[0].etatprd;
  const prodQteeDisp = selectedprd[0].qteedisp || 0;
  const status = "idle";

  const CartItemPrixAct = parseFloat(Math.round(prodPrix * 100) / 100).toFixed(
    2
  );

  const CartItemPrixInit = parseFloat(
    Math.round(selectedprd[0].prixIni * 100) / 100
  ).toFixed(2);

  function CustLocalShippingOutlinedIcon(props) {
    return (
      <SvgIcon {...props}>
        <LocalShippingOutlinedIcon />
      </SvgIcon>
    );
  }

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
    addUserId,
    {
      data: addUserIdData,
      isLoading: addUserIdIsLoading,
      isSuccess: addUserIdIsSuccess,
      error: addUserIdError,
      isError: addUserIdIsError,
    },
  ] = useAddUserIdMutation();

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

  const clickOpenBuyNow = async (e) => {
    e.preventDefault();
    if (!session || !session.user) {
      setOpenBuyNow(true);
    } else {
      dispatch(
        productAdded({
          prodId,
          prodImage,
          prodDesc,
          prodQtee,
          prodPrix,
          prodEtat,
          status,
          prodQteeDisp,
        })
      );

      //console.log("session userid : ", session.user.id);
      if (session.user.id) {
        await handleNavCheckout(session.user.id);
      }
    }
  };

  const handleNavOpenCart = async () => {
    setIsNavOpenCart(true);
    try {
      await router.push({
        pathname: "/cart",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavOpenCart(false);
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
      handleCloseBuyNow();
    }
  };

  const clickOpenCart = async (e) => {
    e.preventDefault();

    dispatch(
      productAdded({
        prodId,
        prodImage,
        prodDesc,
        prodQtee,
        prodPrix,
        prodEtat,
        status,
        prodQteeDisp,
      })
    );

    await handleNavOpenCart();
  };

  const clickBuyNoInsc = async () => {
    try {
      if (!session || !session.user) {
        handleCloseBuyNow();
        dispatch(
          productAdded({
            prodId,
            prodImage,
            prodDesc,
            prodQtee,
            prodPrix,
            prodEtat,
            status,
            prodQteeDisp,
          })
        );
        const response = await addUserId().unwrap();
        //console.log("Samedi userId response : ", response);

        await handleNavCheckout(response?.userId);

        //if (addUserIdIsSuccess || response?.userId) {
        //console.log("Samedi userId response : ", response);
        //  await handleNavCheckout(response?.userId);
        //}
      }
    } catch (err) {
      console.error(
        "Un probleme est survenu pour acheter sans être inscrit: ",
        err
      );
    } finally {
    }
  };

  function CustPaymentOutlinedIcon(props) {
    return (
      <SvgIcon {...props}>
        <PaymentOutlinedIcon />
      </SvgIcon>
    );
  }

  function CustLoopIcon(props) {
    return (
      <SvgIcon {...props}>
        <LoopIcon />
      </SvgIcon>
    );
  }

  const renderedImg = selectedprd.map((image) => (
    <Box
      key={image.imgNum}
      component="li"
      sx={{
        display: "block!important",
        visibility: "visible!important",
        margin: 0,
        height: "100%",
        listStyle: "none",
        wordWrap: "break-word",
        color: "#0F1111",
      }}
    >
      <Box
        component="span"
        sx={{
          height: "100%",
          display: "block",
          color: "#0F1111",
          visibility: "visible!important",
          listStyle: "none",
          wordWrap: "break-word",
          textAlign: "-webkit-match-parent",
          borderCollapse: "collapse",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "table",
            width: "100%",
            height: "100%",
            color: "#0F1111",
            visibility: "visible!important",
            listStyle: "none",
            wordWrap: "break-word",
            textAlign: "-webkit-match-parent",
            borderCollapse: "collapse",
          }}
        >
          <Box
            sx={{
              height: "464px",
              display: "table-cell",
              verticalAlign: "middle",
              margin: 0,
              padding: 0,
              color: "#0F1111",
              visibility: "visible!important",
              listStyle: "none",
              wordWrap: "break-word",
              textAlign: "-webkit-match-parent",
              borderCollapse: "collapse",
            }}
          >
            <Box
              sx={{
                display: "block",
                maxWidth: "390px",
                maxHeight: "283.947px",
                width: "100%!important",
                height: "auto!important",
              }}
            >
              <Image
                src={image.imgJpg}
                alt="Image meilleure vente"
                layout="responsive"
                width="100%"
                height="100%"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ));

  const ClickAchatMtnt = () => {
    return (
      <Dialog
        open={openBuyNow}
        onClose={handleCloseBuyNow}
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
                  onClick={handleCloseBuyNow}
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
                        height: "auto",
                        display: "flex",
                        ////

                        margin: 0,
                        padding: 0,
                        border: 0,
                        fontWeight: "normal",
                        fontSize: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          marginRight: "16px",
                          width: "152px",
                          height: "auto",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={prodImage}
                          alt="Achat immédiat"
                          // layout="responsive"
                          // width={152}
                          // height="auto"
                          layout="fill"
                        />
                      </Box>
                      <Box
                        sx={{
                          height: "78px",
                          color: "#151e27",
                          fontSize: "1rem",
                          //
                          margin: 0,
                          padding: 0,
                          border: 0,
                          fontWeight: "normal",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#151e27",
                          }}
                        >
                          {prodDesc}
                        </Box>
                      </Box>
                    </Box>
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
                          disabled={
                            isLoading ||
                            isNavCheckout ||
                            isNavOpenCart ||
                            isNavSignIn
                          }
                          sx={{
                            backgroundColor: "#3665f3",
                            fontSize: "1rem",
                            width: "364px",
                            borderRadius: "3px",
                            height: "48px",
                            lineHeight: 1.563,
                            fontWeight: "400 !important",

                            color: "#fff",
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
                            /*":root": {
                              "--bubble-filter":
                                "drop-shadow(0 2px 7px rgba(0,0,0,0.15)) drop-shadow(0 5px 17px rgba(0,0,0,0.2))",
                            },
                            filter: "var(--bubble-filter)",*/
                            /////

                            // backgroundColor: "transparent",
                            // border: "none",
                            // outline: 0,
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
                          onClick={clickBuyNoInsc}
                          disabled={
                            isLoading ||
                            isNavCheckout ||
                            isNavOpenCart ||
                            isNavSignIn
                          }
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
                          <Box
                            component="span"
                            sx={
                              {
                                /* display: 'block',
                            maxWidth: '90%',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap', */
                              }
                            }
                          >
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

  const rightCol = (
    <Box
      sx={{
        float: "right",
        width: "244px",
        marginLeft: "20px",
      }}
    >
      <Box>
        <Box
          sx={{
            filter: "inherit",
          }}
        >
          <Box>
            <Box>
              <Box
                sx={{
                  "&:last-child": {
                    marginBottom: 0,
                  },
                }}
              >
                <Box
                  component="form"
                  method="post"
                  id="addToCart"
                  sx={{
                    marginBottom: 0,
                    // marginBottom: "14px",
                    display: "block",
                    marginTop: "0em",
                  }}
                >
                  <Box
                    sx={
                      {
                        // ADD ADD //
                        // marginLeft: "auto",
                        //  marginRight: "auto",
                      }
                    }
                  >
                    <Box
                      sx={{
                        "&: only-child": {
                          borderRadius: "8px",
                        },

                        "&:first-of-type": {
                          marginTop: 0,
                        },

                        marginBottom: "0!important",
                        display: "block",
                        backgroundColor: "#fff",
                        border: "1px #D5D9D9 solid",
                      }}
                    >
                      <Box
                        sx={{
                          "&: only-child": {
                            borderRadius: "8px",
                          },

                          position: "relative",
                          padding: "14px 18px",
                        }}
                      >
                        <Box
                          sx={{
                            padding: "0!important",
                            marginBottom: "0!important",
                          }}
                        >
                          <Box>
                            <Box>
                              <Box
                                sx={{
                                  marginBottom: "4px!important",
                                  color: "#0F1111",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: "28px",
                                    color: "#0F1111",
                                    verticalAlign: "middle!important",
                                    textDecoration: "none",
                                    position: "relative",
                                    lineHeight: "normal",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      WebkitUserSelect: "none",
                                      MozUserSelect: "none",
                                      MsUserSelect: "none",
                                      userSelect: "none",
                                      position: "absolute!important",
                                      left: "0!important",
                                      bottom: "-1px!important",
                                      zIndex: "-1!important",
                                      opacity: 0,
                                      color: "#0F1111",
                                      lineHeight: "normal",
                                      //
                                      fontSize: "28px",
                                    }}
                                  >
                                    {CartItemPrixAct}&nbsp;
                                    {selectedprd[0].prixSymbol}
                                  </Box>
                                  <Box component="span" aria-hidden="true">
                                    <Box
                                      component="span"
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "24px",
                                        fontStyle: "normal",
                                        fontStretch: "normal",
                                        lineHeight: "1.33",
                                        letterSpacing: "normal",
                                        color: "rgba(17,24,32,0.87) !important",
                                      }}
                                    >
                                      {CartItemPrixAct}&nbsp;
                                      {selectedprd[0].prixSymbol}
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          <Box>
                            <Box
                              sx={{
                                padding: "0!important",
                                marginBottom: "0!important",
                              }}
                            >
                              <Box>
                                <Box>
                                  <Box>
                                    <Box
                                      sx={{
                                        marginBottom: "22px",
                                      }}
                                    >
                                      <Box>
                                        <Box
                                          sx={{
                                            marginBottom: "12px!important",
                                          }}
                                        ></Box>
                                        <Box
                                          sx={{
                                            marginBottom: "12px!important",
                                          }}
                                        >
                                          <Box component="span">
                                            Livraison à domicile
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>

                              <Box>
                                <Box
                                  sx={{
                                    marginBottom: "0!important",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      marginBottom: "12px!important",
                                    }}
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        color: "#007600!important",
                                        textRendering: "optimizeLegibility",
                                        fontSize: "18px!important",
                                        lineHeight: "24px!important",
                                      }}
                                    >
                                      En stock.
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>

                              <Box>
                                <Box
                                  sx={{
                                    textAlign: "left!important",
                                    marginBottom: "12px!important",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      padding: "0!important",
                                      marginBottom: "0!important",
                                      textAlign: "left!important",
                                      fontSize: "14px",
                                      lineHeight: "20px",
                                    }}
                                  >
                                    <Box component="span">
                                      <Box
                                        sx={{
                                          marginBottom: "12px!important",
                                          width: "100%",

                                          "&::after,&::before": {
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
                                            marginRight: 0,
                                            float: "left",
                                            minHight: "1px",
                                            overflow: "visible",
                                            textAlign: "left!important",
                                            display: "block",
                                          }}
                                        >
                                          <Box
                                            component="span"
                                            sx={{
                                              position: "relative",
                                            }}
                                          >
                                            <Box
                                              component="label"
                                              for="quantité"
                                              sx={{
                                                paddingRight: "5px",
                                                opacity: 1,
                                                zIndex: "auto",
                                                position: "static",
                                                display: "inline",
                                                fontWeight: "normal",
                                                maxWidth: "100%",
                                                left: 0,
                                                paddingLeft: "2px",
                                                paddingBottom: "2px",
                                                cursor: "default",
                                              }}
                                            >
                                              Quantité :
                                            </Box>
                                            <Box
                                              component="select"
                                              name="quantité"
                                              autocomplete="off"
                                              id="quantité"
                                              tabindex="0"
                                              //
                                              value={prodQtee}
                                              onChange={handleChange}
                                              sx={{
                                                opacity: 1,
                                                filter: "alpha(opacity=100)",
                                                zIndex: "auto",
                                                position: "static",
                                                display: "inline",
                                                fontWeight: "normal",
                                                maxWidth: "100%",
                                                left: 0,
                                                border: "1px solid #DDD",
                                                borderRadius: "4px 4px 4px 4px",
                                                padding: "3px",
                                                WebkitTransition:
                                                  "all .1s linear",
                                                transition: "all .1s linear",
                                                lineHeight: "19px",
                                                color: "#0F1111",
                                                margin: 0,
                                                fontSize: "100%",
                                                verticalAlign: "middle",

                                                ":select:not(:-internal-list-box)":
                                                  {
                                                    overflow:
                                                      "visible !important",
                                                  },
                                              }}
                                            >
                                              {options}
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>

                              <Box>
                                <Box
                                  //component="a"
                                  component="button"
                                  onClick={clickOpenCart}
                                  disabled={
                                    isLoading ||
                                    isNavCheckout ||
                                    isNavOpenCart ||
                                    isNavSignIn
                                  }
                                  sx={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    outline: 0,
                                    textAlign: "center!important",
                                    width: "100%!important",
                                  }}
                                >
                                  <Box component="span">
                                    <Box
                                      component="span"
                                      sx={{
                                        display: "block",
                                        borderRadius: "20px",
                                        boxShadow:
                                          "0 2px 5px 0 rgb(213 217 217 / 50%)",
                                        background: "#FFD814",
                                        borderColor: "#FCD200",
                                        borderStyle: "solid",
                                        borderWidth: "1px",
                                        cursor: "pointer",
                                        padding: 0,
                                        textAlign: "center",
                                        textDecoration: "none!important",
                                        verticalAlign: "middle",
                                        marginBottom: "8px!important",
                                      }}
                                    >
                                      <Box
                                        component="span"
                                        sx={{
                                          borderRadius: "19px",
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
                                          component="span"
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
                                          }}
                                        >
                                          Ajouter au panier
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>

                              <Box>
                                <Box>
                                  <Box
                                    // component="a"
                                    component="button"
                                    onClick={clickOpenBuyNow}
                                    disabled={
                                      isLoading ||
                                      isNavCheckout ||
                                      isNavOpenCart ||
                                      isNavSignIn
                                    }
                                    sx={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      outline: 0,
                                      textAlign: "center!important",
                                      width: "100%!important",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        marginBottom: "12px!important",
                                      }}
                                    >
                                      <Box
                                        component="span"
                                        sx={{
                                          "&:last-child": {
                                            marginBottom: 0,
                                          },
                                          display: "block",
                                          borderRadius: "20px",
                                          boxShadow:
                                            "0 2px 5px 0 rgb(213 217 217 / 50%)",
                                          background: "#FFA41C",
                                          borderColor: "#FF8F00",
                                          borderStyle: "solid",
                                          borderWidth: "1px",
                                          cursor: "pointer",
                                          padding: 0,
                                          textAlign: "center",
                                          textDecoration: "none!important",
                                          verticalAlign: "middle",
                                        }}
                                      >
                                        <Box
                                          component="span"
                                          sx={{
                                            borderRadius: "19px",

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
                                            component="span"
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
                                            }}
                                          >
                                            Acheter maintenant
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                              <>
                                {(!session || !session.user) && (
                                  <ClickAchatMtnt />
                                )}
                              </>

                              <Box>
                                <Box
                                  component="section"
                                  sx={{
                                    fontSize: ".75rem",
                                    marginBottom: "8px",
                                    boxShadow: "0 2px 5px 0 rgb(0 0 0 / 5%)",
                                    backgroundColor: "#fff",
                                    borderRadius: "4px",
                                    display: "block",
                                    color: "#282828",
                                  }}
                                >
                                  <Box
                                    component="hr"
                                    sx={{
                                      marginBottom: "12px!important",
                                      backgroundColor: "transparent",
                                      borderBottomWidth: 0,
                                      borderLeftWidth: 0,
                                      borderRightWidth: 0,
                                      borderTop: "1px solid #e7e7e7",
                                      display: "block",
                                      height: "1px",
                                      lineHeight: "19px",
                                      marginTop: 0,
                                    }}
                                  ></Box>
                                  <Box
                                    component="h2"
                                    sx={{
                                      fontSize: ".875rem",
                                      //textTransform: "uppercase",
                                      fontWeight: 500,
                                      padding: "8px",
                                      margin: 0,
                                      color: "#282828",
                                      WebkitTextSizeAdjust: "100%",
                                      WebkitFontSmoothing: "antialiased",
                                    }}
                                  >
                                    Livraison, retours et paiements
                                  </Box>
                                  <Box
                                    sx={{
                                      position: "relative",
                                      fontSize: ".75rem",
                                      color: "#282828",
                                      WebkitTextSizeAdjust: "100%",

                                      "&::before": {
                                        height: "1px",
                                        content: '""',
                                        top: 0,
                                        right: 0,
                                        left: 0,
                                        position: "absolute",
                                        backgroundColor: "#ededed",
                                      },
                                    }}
                                  >
                                    <Box
                                      component="article"
                                      sx={{
                                        paddingBottom: "4px",
                                        paddingTop: "4px",
                                        position: "relative",
                                        display: "block",
                                        fontSize: ".75rem",
                                        color: "#282828",
                                      }}
                                    >
                                      <Box
                                        component="section"
                                        sx={{
                                          position: "relative",
                                          display: "block",
                                          fontSize: ".75rem",
                                          WebkitFontSmoothing: "antialiased",
                                          color: "#282828",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        <Box>
                                          <Box
                                            component="article"
                                            sx={{
                                              paddingLeft: "8px",
                                              paddingBottom: "4px",
                                              paddingRight: "8px",
                                              paddingTop: "4px",
                                              display: "flex",
                                              fontSize: ".75rem",
                                              WebkitFontSmoothing:
                                                "antialiased",
                                              //  color: "#282828",
                                              WebkitTextSizeAdjust: "100%",
                                            }}
                                          >
                                            <CustLocalShippingOutlinedIcon
                                              color="action"
                                              sx={{
                                                fontSize: 0,
                                                marginRight: "8px",
                                                padding: "4px",
                                                alignSelf: "baseline",
                                                flexShrink: 0,
                                                border: "1px solid #ededed",
                                                borderRadius: "4px",
                                                fill: "#282828",
                                                width: 40,
                                                height: 40,
                                              }}
                                            ></CustLocalShippingOutlinedIcon>
                                            <Box
                                              sx={{
                                                flexWrap: "wrap",
                                                alignContent: "space-between",
                                                flexGrow: 1,
                                                display: "flex",
                                                fontSize: ".75rem",
                                                color: "#282828",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: "100%",
                                                  display: "flex",
                                                  fontSize: ".75rem",
                                                  WebkitFontSmoothing:
                                                    "antialiased",
                                                  color: "#282828",
                                                  WebkitTextSizeAdjust: "100%",
                                                }}
                                              >
                                                <Box
                                                  component="h4"
                                                  sx={{
                                                    fontSize: ".875rem",
                                                    fontWeight: 500,
                                                    paddingRight: "8px",
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "#282828",
                                                    WebkitFontSmoothing:
                                                      "antialiased",
                                                    WebkitTextSizeAdjust:
                                                      "100%",
                                                  }}
                                                >
                                                  Livraison à domicile
                                                </Box>
                                                <Box
                                                  component="button"
                                                  type="button"
                                                  sx={{
                                                    fontSize: ".75rem",
                                                    marginLeft: "auto",
                                                    alignSelf: "flex-start",
                                                    cursor: "pointer",
                                                    color: "#264996",
                                                    WebkitAppearance: "button",
                                                    padding: 0,
                                                    textTransform: "none",
                                                    margin: 0,
                                                    overflow: "visible",
                                                    backgroundColor:
                                                      "transparent",
                                                    border: 0,
                                                  }}
                                                >
                                                  Détails
                                                </Box>
                                              </Box>
                                            </Box>
                                          </Box>
                                          <Box
                                            component="article"
                                            sx={{
                                              paddingLeft: "8px",
                                              paddingBottom: "4px",
                                              paddingRight: "8px",
                                              paddingTop: "4px",
                                              display: "flex",
                                              fontSize: ".75rem",
                                              WebkitFontSmoothing:
                                                "antialiased",
                                              color: "#282828",
                                              WebkitTextSizeAdjust: "100%",
                                            }}
                                          >
                                            <CustPaymentOutlinedIcon
                                              color="action"
                                              sx={{
                                                fontSize: 0,
                                                marginRight: "8px",
                                                padding: "4px",
                                                alignSelf: "baseline",
                                                flexShrink: 0,
                                                border: "1px solid #ededed",
                                                borderRadius: "4px",
                                                fill: "#282828",
                                                width: 40,
                                                height: 40,
                                              }}
                                            ></CustPaymentOutlinedIcon>
                                            <Box
                                              sx={{
                                                flexWrap: "wrap",
                                                alignContent: "space-between",
                                                flexGrow: 1,
                                                display: "flex",
                                                fontSize: ".75rem",
                                                color: "#282828",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  width: "100%",
                                                  display: "flex",
                                                  fontSize: ".75rem",
                                                  WebkitFontSmoothing:
                                                    "antialiased",
                                                  color: "#282828",
                                                  WebkitTextSizeAdjust: "100%",
                                                }}
                                              >
                                                <Box
                                                  component="h4"
                                                  sx={{
                                                    fontSize: ".875rem",
                                                    fontWeight: 500,
                                                    paddingRight: "8px",
                                                    margin: 0,
                                                    padding: 0,
                                                    color: "#282828",
                                                    WebkitFontSmoothing:
                                                      "antialiased",
                                                    WebkitTextSizeAdjust:
                                                      "100%",
                                                  }}
                                                >
                                                  Paiements à la livraison
                                                </Box>
                                                <Box
                                                  component="button"
                                                  type="button"
                                                  sx={{
                                                    fontSize: ".75rem",
                                                    marginLeft: "auto",
                                                    alignSelf: "flex-start",
                                                    cursor: "pointer",
                                                    color: "#264996",
                                                    WebkitAppearance: "button",
                                                    padding: 0,
                                                    textTransform: "none",
                                                    margin: 0,
                                                    overflow: "visible",
                                                    backgroundColor:
                                                      "transparent",
                                                    border: 0,
                                                  }}
                                                >
                                                  Détails
                                                </Box>
                                              </Box>
                                            </Box>
                                          </Box>
                                        </Box>
                                      </Box>
                                    </Box>
                                    <Box
                                      component="article"
                                      sx={{
                                        padding: "8px",
                                        position: "relative",
                                        display: "flex",
                                        fontSize: ".75rem",
                                        WebkitFontSmoothing: "antialiased",
                                        color: "#282828",
                                        WebkitTextSizeAdjust: "100%",

                                        "&::before": {
                                          content: '""',
                                          height: "1px",
                                          top: 0,
                                          right: 0,
                                          left: 0,
                                          position: "absolute",
                                          backgroundColor: "#ededed",
                                        },
                                      }}
                                    >
                                      <CustLoopIcon
                                        color="action"
                                        sx={{
                                          fontSize: 0,
                                          marginRight: "8px",
                                          padding: "4px",
                                          alignSelf: "baseline",
                                          flexShrink: 0,
                                          border: "1px solid #ededed",
                                          borderRadius: "4px",
                                          fill: "#282828",
                                          width: 40,
                                          height: 40,
                                        }}
                                      ></CustLoopIcon>
                                      <Box
                                        sx={{
                                          flexDirection: "column",
                                          alignContent: "space-between",
                                          display: "flex",
                                          fontSize: ".75rem",
                                          WebkitFontSmoothing: "antialiased",
                                          color: "#282828",
                                          WebkitTextSizeAdjust: "100%",
                                        }}
                                      >
                                        <Box
                                          component="h3"
                                          sx={{
                                            fontSize: ".875rem",
                                            fontWeight: 500,
                                            width: "100%",
                                            margin: 0,
                                            padding: 0,
                                            WebkitFontSmoothing: "antialiased",
                                            color: "#282828",
                                            WebkitTextSizeAdjust: "100%",
                                          }}
                                        >
                                          Politique de retour
                                        </Box>
                                        <Box
                                          component="p"
                                          sx={{
                                            paddingTop: "4px",
                                            margin: 0,
                                            padding: 0,
                                            fontSize: ".75rem",
                                            color: "#282828",
                                            WebkitFontSmoothing: "antialiased",
                                            WebkitTextSizeAdjust: "100%",
                                          }}
                                        >
                                          Retours acceptés dans un délai de 15
                                          jours
                                          <Box
                                            component="a"
                                            sx={{
                                              marginLeft: "4px",
                                              display: "inline",
                                              color: "#264996",
                                              textDecoration: "none",
                                              backgroundColor: "transparent",
                                              cursor: "pointer",

                                              ":-webkit-any-link": {
                                                cursor: "pointer",
                                              },

                                              fontSize: ".75rem",
                                              WebkitFontSmoothing:
                                                "antialiased",
                                              WebkitTextSizeAdjust: "100%",
                                            }}
                                          >
                                            En savoir plus
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
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const leftCol = (
    <Box
      sx={{
        position: "sticky",
        position: "-webkit-sticky",
        top: "4px",
        height: "100%",
        width: "45.0%",
        float: "left",
      }}
    >
      <Box>
        <Box
          sx={{
            opacity: 1,
            marginBottom: 0,
          }}
        >
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Box
              sx={{
                paddingLeft: "40px",
                position: "relative",
                padding: 0,

                "&::after,&::before": {
                  display: "table",
                  content: '""',
                  lineHeight: 0,
                  fontSize: 0,
                },

                "&::after": {
                  clear: "left",
                },
              }}
            >
              <Box
                sx={{
                  paddingLeft: "3.5%",
                  float: "left",
                  width: "100%",
                  textAlign: "center!important",
                  position: "relative",
                  overflow: "visible",
                  zoom: 1,
                  minHeight: "1px",
                }}
              >
                <Box
                  sx={{
                    opacity: 1,
                    display: "table!important",
                    tableLayout: "fixed",
                    zoom: 1,
                    borderCollapse: "collapse",
                    marginBottom: "12px!important",
                    width: "100%",
                    textAlign: "center!important",
                  }}
                >
                  <Box
                    sx={{
                      height: "464.286px",
                      maxHeight: "700px!important",
                      position: "relative",
                      textAlign: "center!important",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: "-1",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          margin: "auto",
                        }}
                      ></Box>
                      <Box
                        sx={{
                          width: "100%",
                          borderCollapse: "collapse",
                          textAlign: "center!important",

                          "&::after,&::before": {
                            display: "table",
                            content: '""',
                            lineHeight: 0,
                            fontSize: 0,
                          },

                          "&::after": {
                            clear: "left",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            paddingRight: 0,
                            width: "100%",
                            marginRight: 0,
                            float: "left",
                            minHeight: "1px",
                            overflow: "visible",
                            textAlign: "center!important",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              color: "#565959!important",
                            }}
                          ></Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "none!important",
                        visibility: "hidden!important",
                      }}
                    ></Box>
                    <Box
                      sx={{
                        display: "none",
                        position: "relative",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          width: "100%",
                          top: "200px",
                          left: 0,
                        }}
                      >
                        <Box
                          sx={{
                            marginLeft: "auto",
                            marginRight: "auto",
                            borderColor: "#CC0C39",
                            position: "relative",
                            borderStyle: "solid",
                            borderWidth: "2px",
                            borderLeftWidth: "12px",
                            display: "block",
                            borderRadius: "8px",
                            backgroundColor: "#fff",
                            border: "1px #D5D9D9 solid",
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#FFF",
                              padding: "14px 18px 18px",
                              borderRadius: "8px",
                              position: "relative",
                            }}
                          ></Box>
                          <Box
                            component="h4"
                            sx={{
                              paddingLeft: "26px",
                              paddingBottom: "10px",
                              fontWeight: 700,
                              fontSize: "18px",
                              lineHeight: "24px",
                              textRendering: "optimizeLegibility",
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            Image indisponible
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            paddingLeft: 0,
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontWeight: "700!important",
                            }}
                          >
                            Image non disponible
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      component="ul"
                      sx={{
                        height: "100%",
                        display: "block",
                        marginLeft: 0,
                        color: "#0F1111",
                        padding: 0,
                        margin: "0 0 0 18px",

                        "&::after,&::before": {
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
                      {renderedImg}
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

  const centerCol = (
    <Box
      sx={{
        marginLeft: "46.5%",
        marginRight: "270px",
      }}
    >
      <Box>
        <Box
          sx={{
            marginBottom: "0!important",
          }}
        >
          <Box
            component="h1"
            sx={{
              paddingBottom: 0,
              marginBottom: "0!important",
              textRendering: "optimizeLegibility",
              fontSize: "24px!important",
              lineHeight: "32px!important",
              fontWeight: 400,
              padding: 0,
              margin: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                wordBreak: "break-word",
                textRendering: "optimizeLegibility",
                fontSize: "24px!important",
                lineHeight: "32px!important",
                fontWeight: 400,
              }}
            >
              {selectedprd[0].descPrd}
            </Box>
          </Box>
        </Box>
      </Box>
      {selectedprd[0].marque && (
        <Box>
          <Box
            sx={{
              marginBottom: "0!important",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#007185",
                fontSize: "14px",
                lineHeight: "20px",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              Marque&nbsp;: {selectedprd[0].marque}
            </Box>
          </Box>
        </Box>
      )}
      {selectedprd[0].etatprd && (
        <Box>
          <Box
            sx={{
              marginBottom: "0!important",
            }}
          >
            <Box
              component="span"
              sx={{
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              État&nbsp;: {selectedprd[0].etatprd}
            </Box>
          </Box>
        </Box>
      )}

      <Box
        component="hr"
        sx={{
          backgroundColor: "transparent",
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderTop: "1px solid #e7e7e7",
          display: "block",
          height: "1px",
          lineHeight: "19px",
          marginBottom: "14px",
          // marginTop: 0,
          marginTop: "14px",
        }}
      ></Box>
      <Box>
        <Box>
          <Box
            sx={{
              verticalAlign: "middle!important",
              marginBottom: "0!important",
            }}
          >
            <Box
              component="span"
              sx={{
                marginRight: "3px",
                fontSize: "28px",
                color: "#0F1111",
                verticalAlign: "middle!important",
                textDecoration: "none",
                position: "relative",
                lineHeight: "normal",
              }}
            >
              <Box
                component="span"
                sx={{
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  MsUserSelect: "none",
                  userSelect: "none",
                  position: "absolute!important",
                  left: "0!important",
                  bottom: "-1px!important",
                  zIndex: "-1!important",
                  opacity: 0,
                  fontSize: "28px",
                  color: "#0F1111",
                  lineHeight: "normal",
                }}
              >
                {CartItemPrixAct}&nbsp;{selectedprd[0].prixSymbol}
              </Box>

              <Box component="span" aria-hidden="true">
                <Box
                  component="span"
                  sx={{
                    // fontSize: "28px",
                    // color: "#0F1111",
                    // lineHeight: "normal",

                    fontWeight: 700,
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontStretch: "normal",
                    lineHeight: "1.33",
                    letterSpacing: "normal",
                    color: "rgba(17,24,32,0.87) !important",
                  }}
                >
                  {CartItemPrixAct}&nbsp;{selectedprd[0].prixSymbol}
                </Box>
              </Box>
            </Box>
            {selectedprd[0].red && (
              <Box
                sx={{
                  marginBottom: "8px",
                  // padding: "5px 0px 5px 0px",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    paddingRight: "2px",
                    fontSize: "14px",
                    margin: 0,
                    padding: 0,
                    border: 0,
                    fontWeight: "normal",
                    lineHeight: "normal",
                    color: "#333",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      textDecoration: "line-through",
                      fontSize: ".875rem",
                      margin: 0,
                      padding: 0,
                      border: 0,
                      fontWeight: "normal",
                      lineHeight: "normal",
                      color: "#333",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: ".875rem",
                        clip: "rect(1px,1px,1px,1px)",
                        overflow: "hidden",
                        border: "0 !important",
                        height: "1px !important",
                        padding: "0 !important",
                        position: "absolute !important",
                        whiteSpace: "nowrap !important",
                        width: "1px !important",
                        margin: 0,
                        fontWeight: "normal",
                      }}
                    >
                      Prix de vente initial&nbsp;:
                    </Box>
                    {CartItemPrixInit}&nbsp;{selectedprd[0].prixSymbol}
                    &nbsp;
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontSize: ".875rem",
                      margin: 0,
                      padding: 0,
                      border: 0,
                      fontWeight: "normal",
                      lineHeight: "normal",
                      color: "#767676",
                    }}
                  >
                    <Box component="span"> &nbsp;(</Box>
                    <Box component="span">{selectedprd[0].red}</Box>
                    <Box component="span">% de réduction)</Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box>
        <Box component="span">
          {selectedprd[0].promoprd1 && (
            <Box
              sx={{
                padding: "5px 0px 5px 0px",
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
                  fontWeight: "700!important",
                }}
              >
                <Box
                  sx={{
                    paddingLeft: "28px",
                    color: "#067D62",
                    borderRadius: 0,
                    padding: 0,
                    position: "relative",
                    fontWeight: "700!important",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "14px",
                      marginBottom: 0,
                      textAlign: "left",
                      lineHeight: "15px",
                      color: "#067D62",
                      fontWeight: "700!important",
                    }}
                  >
                    {selectedprd[0].promoprd1}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
          {selectedprd[0].promoprd2 && (
            <Box
              sx={{
                padding: "5px 0px 5px 0px",
                fontSize: "14px",
                lineHeight: "20px",
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
                {selectedprd[0].promoprd2}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            marginTop: "8px!important",
            marginBottom: "8px!important",
          }}
        >
          <Box
            component="table"
            sx={{
              marginBottom: "4px!important",
              borderCollapse: "collapse",
              width: "100%",
              display: "table",
              textIndent: "initial",
              borderSpacing: "2px",
              borderColor: "grey",
            }}
          >
            <Box component="tbody">
              {selectedprd[0].matériau && (
                <Box
                  component="tr"
                  sx={{
                    marginBottom: "8px!important",
                    display: "table-row",
                    verticalAlign: "inherit",
                    borderColor: "inherit",
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      "&:first-child": {
                        paddingTop: 0,
                      },
                      "&:first-child": {
                        paddingLeft: 0,
                      },
                      width: "26.18%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                        fontWeight: "700!important",
                      }}
                    >
                      Matériau
                    </Box>
                  </Box>

                  <Box
                    component="td"
                    sx={{
                      "&:first-child": {
                        paddingTop: 0,
                      },
                      "&:last-child": {
                        paddingRight: 0,
                      },
                      width: "78.68%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                      }}
                    >
                      {selectedprd[0].matériau}
                    </Box>
                  </Box>
                </Box>
              )}
              {selectedprd[0].marque && (
                <Box
                  component="tr"
                  sx={{
                    marginBottom: "8px!important",
                    display: "table-row",
                    verticalAlign: "inherit",
                    borderColor: "inherit",

                    borderCollapse: "collapse",
                    textIndent: "initial",
                    borderSpacing: "2px",
                    color: "#0F1111",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      "&:first-child": {
                        paddingLeft: 0,
                      },

                      width: "26.18%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                      color: "#0F1111",
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                        fontWeight: "700!important",
                      }}
                    >
                      Marque
                    </Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      "&:last-child": {
                        paddingRight: 0,
                      },
                      width: "78.68%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                      color: "#0F1111",
                      fontizSe: "14px",
                      lineHeight: "20px",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                      }}
                    >
                      {selectedprd[0].marque}
                    </Box>
                  </Box>
                </Box>
              )}
              {selectedprd[0].couleur && (
                <Box
                  component="tr"
                  sx={{
                    marginBottom: "8px!important",
                    display: "table-row",
                    verticalAlign: "inherit",
                    borderColor: "inherit",

                    borderCollapse: "collapse",
                    textIndent: "initial",
                    borderSpacing: "2px",
                    color: "#0F1111",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      "&:first-child": {
                        paddingLeft: 0,
                      },

                      width: "26.18%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                      color: "#0F1111",
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                        fontWeight: "700!important",
                      }}
                    >
                      Couleur
                    </Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      "&:last-child": {
                        paddingRight: 0,
                      },

                      width: "78.68%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                      color: "#0F1111",
                      fontizSe: "14px",
                      lineHeight: "20px",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                      }}
                    >
                      {selectedprd[0].couleur}
                    </Box>
                  </Box>
                </Box>
              )}
              {selectedprd[0].dimensions && (
                <Box
                  component="tr"
                  sx={{
                    marginBottom: "8px!important",
                    display: "table-row",
                    verticalAlign: "inherit",
                    borderColor: "inherit",

                    borderCollapse: "collapse",
                    textIndent: "initial",
                    borderSpacing: "2px",
                    color: "#0F1111",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="td"
                    sx={{
                      "&:last-child": {
                        paddingBottom: 0,
                      },

                      "&:first-child": {
                        paddingLeft: 0,
                      },

                      width: "26.18%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                      color: "#0F1111",
                      fontizSe: "14px",
                      lineHeight: "20px",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                        fontWeight: "700!important",
                      }}
                    >
                      Dimensions
                    </Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      "&:last-child": {
                        paddingRight: 0,
                      },

                      width: "78.68%",
                      float: "none!important",
                      marginRight: 0,
                      padding: "3px",
                      verticalAlign: "top",
                      display: "table-cell",
                      borderCollapse: "collapse",
                      textIndent: "initial",
                      borderSpacing: "2px",
                      color: "#0F1111",
                      fontizSe: "14px",
                      lineHeight: "20px",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                      }}
                    >
                      {selectedprd[0].dimensions}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box>
        <Box
          sx={{
            marginBottom: "16px!important",
            marginTop: "8px!important",
          }}
        >
          <Box
            component="hr"
            sx={{
              backgroundColor: "transparent",
              borderBottomWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderTop: "1px solid #e7e7e7",
              display: "block",
              height: "1px",
              lineHeight: "19px",
              marginBottom: "14px",
              marginTop: 0,
            }}
          ></Box>
          <Box
            component="h1"
            sx={{
              fontSize: "16px!important",
              lineHeight: "24px!important",
              fontWeight: "700!important",
              paddingBottom: "4px",
              textRendering: "optimizeLegibility",
            }}
          >
            À propos de cet article
          </Box>
          <Box
            component="ul"
            sx={{
              padding: 0,
              margin: "0 0 0 18px",
              color: "#0F1111",
              marginBottom: "4px!important",
            }}
          >
            {selectedprd[0].descart1 && (
              <Box
                component="li"
                sx={{
                  wordWrap: "break-word",
                  margin: 0,
                  listStyle: "disc",
                  color: "#0F1111",

                  "::marker": {
                    unicodeBidi: "isolate",
                    fontVariantNumeric: "tabular-nums",
                    textTransform: "none",
                    textIndent: "0px !important",
                    textAlign: "start !important",
                    textAlignLast: "start !important",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#0F1111",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  {selectedprd[0].descart1}
                </Box>
              </Box>
            )}
            {selectedprd[0].descart2 && (
              <Box
                component="li"
                sx={{
                  wordWrap: "break-word",
                  margin: 0,
                  listStyle: "disc",
                  color: "#0F1111",

                  "::marker": {
                    unicodeBidi: "isolate",
                    fontVariantNumeric: "tabular-nums",
                    textTransform: "none",
                    textIndent: "0px !important",
                    textAlign: "start !important",
                    textAlignLast: "start !important",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#0F1111",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  {selectedprd[0].descart2}
                </Box>
              </Box>
            )}
            {selectedprd[0].descart3 && (
              <Box
                component="li"
                sx={{
                  wordWrap: "break-word",
                  margin: 0,
                  listStyle: "disc",
                  color: "#0F1111",

                  "::marker": {
                    unicodeBidi: "isolate",
                    fontVariantNumeric: "tabular-nums",
                    textTransform: "none",
                    textIndent: "0px !important",
                    textAlign: "start !important",
                    textAlignLast: "start !important",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#0F1111",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  {selectedprd[0].descart3}
                </Box>
              </Box>
            )}
            {selectedprd[0].descart4 && (
              <Box
                component="li"
                sx={{
                  wordWrap: "break-word",
                  margin: 0,
                  listStyle: "disc",
                  color: "#0F1111",

                  "::marker": {
                    unicodeBidi: "isolate",
                    fontVariantNumeric: "tabular-nums",
                    textTransform: "none",
                    textIndent: "0px !important",
                    textAlign: "start !important",
                    textAlignLast: "start !important",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#0F1111",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  {selectedprd[0].descart4}
                </Box>
              </Box>
            )}
            {selectedprd[0].descart5 && (
              <Box
                component="li"
                sx={{
                  wordWrap: "break-word",
                  margin: 0,
                  listStyle: "disc",
                  color: "#0F1111",

                  "::marker": {
                    unicodeBidi: "isolate",
                    fontVariantNumeric: "tabular-nums",
                    textTransform: "none",
                    textIndent: "0px !important",
                    textAlign: "start !important",
                    textAlignLast: "start !important",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "#0F1111",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  {selectedprd[0].descart5}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const detailProduit = (
    <Box>
      <Box
        sx={{
          "&:last-child": {
            marginBottom: "4.5px",
          },

          WebkitTextSizeAdjust: "100%",
          fontSize: "14px",
          lineHeight: "20px",
          color: "#0F1111",
        }}
      >
        <Box
          component="hr"
          sx={{
            clear: "left",
            background: "0 0!important",
            borderTop: "1px solid #CCC!important",
            marginBottom: "-36px!important",
            height: "44px!important",
            border: 0,
            filter: "none",
            zIndex: 0,
            zoom: 1,
            display: "block",
            lineHeight: "19px",
            marginTop: 0,

            "&::after": {
              display: "block",
              width: "100%",
              height: "44px",
              background:
                "-webkit-linear-gradient(left,#fff,rgba(255,255,255,0),#fff)",
              filter: "none",
              zIndex: 1,
              content: '""',
            },
          }}
        ></Box>
        <Box
          component="h2"
          sx={{
            // fontWeight: 700,
            // fontSize: "24px",
            // lineHeight: "32px",
            paddingBottom: "8px",
            //  textRendering: "optimizeLegibility",
            marginBottom: "0!important",
          }}
        >
          Détails sur le produit
        </Box>
        <Box>
          <Box
            component="ul"
            sx={{
              margin: "0 0 1px 18px",
              color: "#0F1111",
              padding: 0,
              marginBottom: "0!important",
            }}
          >
            <Box
              component="li"
              sx={{
                listStyle: "none",
                marginBottom: "5.5px",
                wordWrap: "break-word",
                margin: 0,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#0F1111",
                  wordWrap: "break-word",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "700!important",
                    color: "#0F1111",
                    listStyle: "none",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Dimensions du produit (L x l x h) &rlm; : &lrm;
                </Box>
                <Box component="span">{selectedprd[0].dimensions}</Box>
              </Box>
            </Box>
            <Box
              component="li"
              sx={{
                listStyle: "none",
                marginBottom: "5.5px",
                wordWrap: "break-word",
                margin: 0,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#0F1111",
                  wordWrap: "break-word",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "700!important",
                    color: "#0F1111",
                    listStyle: "none",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Numéro de fabrication &rlm; : &lrm;
                </Box>
                <Box component="span">{selectedprd[0].numfab}</Box>
              </Box>
            </Box>
            <Box
              component="li"
              sx={{
                listStyle: "none",
                marginBottom: "5.5px",
                wordWrap: "break-word",
                margin: 0,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#0F1111",
                  wordWrap: "break-word",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "700!important",
                    color: "#0F1111",
                    listStyle: "none",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Fabricant &rlm; : &lrm;
                </Box>
                <Box component="span">{selectedprd[0].fabricant}</Box>
              </Box>
            </Box>
            <Box
              component="li"
              sx={{
                listStyle: "none",
                marginBottom: "5.5px",
                wordWrap: "break-word",
                margin: 0,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#0F1111",
                  wordWrap: "break-word",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "700!important",
                    color: "#0F1111",
                    listStyle: "none",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Poids &rlm; : &lrm;
                </Box>
                <Box component="span">{selectedprd[0].poids}</Box>
              </Box>
            </Box>
            <Box
              component="li"
              sx={{
                listStyle: "none",
                marginBottom: "5.5px",
                wordWrap: "break-word",
                margin: 0,
                color: "#0F1111",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#0F1111",
                  wordWrap: "break-word",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: "700!important",
                    color: "#0F1111",
                    listStyle: "none",
                    wordWrap: "break-word",
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  Pays d&rdquo;origibne &rlm; : &lrm;
                </Box>
                <Box component="span">{selectedprd[0].paysorigibne}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const descProduit = (
    <Box>
      <Box>
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
          <Box>
            <Box
              sx={{
                background:
                  "-webkit-linear-gradient(to bottom,rgba(0,0,0,.14),rgba(0,0,0,.03) 3px,transparent)",
                background:
                  "linear-gradient(to bottom,rgba(0,0,0,.14),rgba(0,0,0,.03) 3px,transparent)",
                height: "44px",
                marginBottom: "-18px",
                zIndex: 0,
                zoom: 1,
                // Add
                marginTop: "24px",

                "&::after": {
                  background:
                    "-webkit-linear-gradient(to right,#fff,rgba(255,255,255,0),#fff)",
                  background:
                    "linear-gradient(to right,#fff,rgba(255,255,255,0),#fff)",
                  backgroundColor: "transparent",
                  content: '""',
                  display: "block",
                  height: "44px",
                  width: "100%",
                  zIndex: 1,
                },
              }}
            ></Box>
          </Box>
          <Box
            component="h2"
            sx={{
              color: "#CC6600",
              fontSize: "medium",
              margin: "0 0 0.25em",
              fontWeight: 700,
              lineHeight: "32px",
              paddingBottom: "4px",
              textRendering: "optimizeLegibility",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            Description du produit
          </Box>
          <Box
            sx={{
              color: "#333333",
              wordWrap: "break-word",
              fontSize: "small",
              lineHeight: "initial",
              margin: "0.5em 0px 0em 25px",
              marginBottom: "8px!important",
            }}
          >
            <Box
              component="p"
              sx={{
                margin: "0em 0 1em 1em",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: "#333333",
                  wordWrap: "break-word",
                  fontSize: "small",
                  lineHeight: "initial",
                }}
              >
                <Box component="span">
                  {selectedprd[0].descdet}
                  <br />
                </Box>
                Caracteristiques :<br />
                {selectedprd[0].detprd1 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd1} <br />
                  </Box>
                )}
                {selectedprd[0].detprd2 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd2} <br />
                  </Box>
                )}
                {selectedprd[0].detprd3 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd3} <br />
                  </Box>
                )}
                {selectedprd[0].detprd4 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd4} <br />
                  </Box>
                )}
                {selectedprd[0].detprd5 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd5} <br />
                  </Box>
                )}
                {selectedprd[0].detprd6 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd6} <br />
                  </Box>
                )}
                {selectedprd[0].detprd7 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd7} <br />
                  </Box>
                )}
                {selectedprd[0].detprd8 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd8} <br />
                  </Box>
                )}
                {selectedprd[0].detprd9 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd9} <br />
                  </Box>
                )}
                {selectedprd[0].detprd10 && (
                  <Box component="span">
                    -&nbsp;{selectedprd[0].detprd10} <br />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const ficheTecProduit = (
    <Box
      sx={{
        "@media screen and (max-width: 1200px)": {
          maxWidth: "950px",
        },

        marginLeft: "auto",

        marginRight: "auto",
        width: "100%",
        flexWrap: "wrap",
        flex: "0 1 auto",
        display: "flex",
        fontSize: ".875rem",
        color: "#282828",
        WebkitFontSmoothing: "antialiased",
        WebkitTextSizeAdjust: "100%",
        //
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          flexBasis: "75%",
          maxWidth: "75%",
          minWidth: "75%",
          width: "75%",
          paddingLeft: "8px",
          paddingRight: "8px",
          color: "#282828",
          fontSize: ".875rem",
        }}
      >
        <Box
          component="section"
          sx={{
            fontSize: "1rem",
            marginTop: "16px",
            boxShadow: "0 2px 5px 0 rgb(0 0 0 / 5%)",
            position: "relative",
            backgroundColor: "#fff",
            borderRadius: "4px",
            display: "block",
            color: "#282828",
          }}
        >
          <Box
            component="header"
            sx={{
              paddingBottom: "8px",
              paddingTop: "8px",
              borderBottom: "1px solid #ededed",
              display: "block",
              fontSize: "1rem",
              color: "#282828",
            }}
          >
            <Box
              component="h2"
              sx={{
                fontSize: "1.25rem",
                fontWeight: 500,
                paddingLeft: "16px",
                paddingBottom: "4px",
                paddingRight: "16px",
                paddingTop: "4px",
                margin: 0,
                color: "#282828",
              }}
            >
              Fiche technique
            </Box>
          </Box>

          <Box
            sx={{
              padding: "8px",
              "@media screen and (max-width: 1200px)": {
                maxWidth: "950px",
              },

              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              flexWrap: "wrap",
              flex: "0 1 auto",
              display: "flex",
              fontSize: "1rem",
              color: "#282828",
            }}
          >
            <Box
              component="article"
              sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                flexBasis: "50%",
                maxWidth: "50%",
                minWidth: "50%",
                width: "50%",
                paddingLeft: "8px",
                paddingRight: "8px",
                display: "block",
                fontSize: "1rem",
                color: "#282828",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  border: "1px solid #ededed",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  color: "#282828",
                }}
              >
                <Box
                  component="h2"
                  sx={{
                    fontSize: ".875rem",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    padding: "16px",
                    borderBottom: "1px solid #ededed",
                    margin: 0,
                    color: "#282828",
                  }}
                >
                  Principales caractéristiques
                </Box>
                <Box
                  sx={{
                    padding: "16px",
                    fontSize: "1rem",
                    color: "#282828",
                  }}
                >
                  <Box
                    component="p"
                    sx={{
                      margin: "0px",
                      padding: "0px",
                      boxSizing: "border-box",
                      border: "0px",
                      // fontVariantNumeric: 'inherit',
                      //fontVariantEastAsian: 'inherit',
                      fontStretch: "inherit",
                      lineHeight: "1.3em",
                      verticalAlign: "baseline",
                      color: "rgb(98, 98, 98)",
                    }}
                  ></Box>
                  <Box
                    component="ul"
                    sx={{
                      paddingLeft: "16px",
                      margin: 0,
                      //  padding: 0,
                      fontSize: "1rem",
                      color: "#282828",
                    }}
                  >
                    {selectedprd[0].pcaract1 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract1}
                      </Box>
                    )}
                    {selectedprd[0].pcaract2 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract2}
                      </Box>
                    )}
                    {selectedprd[0].pcaract3 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract3}
                      </Box>
                    )}
                    {selectedprd[0].pcaract4 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract4}
                      </Box>
                    )}
                    {selectedprd[0].pcaract5 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract5}
                      </Box>
                    )}
                    {selectedprd[0].pcaract6 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract6}
                      </Box>
                    )}
                    {selectedprd[0].pcaract7 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract7}
                      </Box>
                    )}
                    {selectedprd[0].pcaract8 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract8}
                      </Box>
                    )}
                    {selectedprd[0].pcaract9 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract9}
                      </Box>
                    )}
                    {selectedprd[0].pcaract10 && (
                      <Box
                        component="li"
                        sx={{
                          margin: 0,
                          padding: 0,
                          display: "list-item",
                          textAlign: "-webkit-match-parent",
                          fontSize: "1rem",
                          color: "#282828",
                          // Add

                          "::marker": {
                            unicodeBidi: "isolate",
                            fontVariantNumeric: "tabular-nums",
                            textTransform: "none",
                            textIndent: "0px !important",
                            textAlign: "start !important",
                            textAlignLast: "start !important",
                          },
                        }}
                      >
                        {selectedprd[0].pcaract10}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              component="article"
              sx={{
                paddingBottom: "8px",
                paddingTop: "8px",
                flexBasis: "50%",
                maxWidth: "50%",
                minWidth: "50%",
                width: "50%",
                paddingLeft: "8px",
                paddingRight: "8px",
                display: "block",
                fontSize: "1rem",
                color: "#282828",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  border: "1px solid #ededed",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  color: "#282828",
                }}
              >
                <Box
                  component="h2"
                  sx={{
                    fontSize: ".875rem",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    padding: "16px",
                    borderBottom: "1px solid #ededed",
                    margin: 0,
                    color: "#282828",
                  }}
                >
                  Descriptif technique
                </Box>
                <Box
                  component="ul"
                  sx={{
                    marginBottom: "4px",
                    marginTop: "4px",

                    paddingLeft: "16px",
                    paddingBottom: "8px",

                    paddingRight: "16px",
                    paddingTop: "8px",
                    listStyle: "none",
                    fontSize: "1rem",
                    // margin: 0,
                    //  padding: 0,
                    fontSize: "1rem",
                    color: "#282828",
                  }}
                >
                  {selectedprd[0].modèle && (
                    <Box
                      component="li"
                      sx={{
                        paddingBottom: "4px",
                        margin: 0,
                        display: "list-item",
                        textAlign: "-webkit-match-parent",
                        paddingTop: "4px",
                        listStyle: "none",
                        fontSize: "1rem",
                        color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#282828",
                        }}
                      >
                        Modèle&nbsp;
                      </Box>
                      :&nbsp;{selectedprd[0].modèle}
                    </Box>
                  )}
                  {selectedprd[0].numfab && (
                    <Box
                      component="li"
                      sx={{
                        paddingBottom: "4px",
                        margin: 0,
                        display: "list-item",
                        textAlign: "-webkit-match-parent",
                        paddingTop: "4px",
                        listStyle: "none",
                        fontSize: "1rem",
                        color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#282828",
                        }}
                      >
                        N° fabrication&nbsp;
                      </Box>
                      :&nbsp;{selectedprd[0].numfab}
                    </Box>
                  )}
                  {selectedprd[0].poids && (
                    <Box
                      component="li"
                      sx={{
                        paddingBottom: "4px",
                        margin: 0,
                        display: "list-item",
                        textAlign: "-webkit-match-parent",
                        paddingTop: "4px",
                        listStyle: "none",
                        fontSize: "1rem",
                        color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#282828",
                        }}
                      >
                        Poids&nbsp;
                      </Box>
                      :&nbsp;{selectedprd[0].poids}
                    </Box>
                  )}
                  {selectedprd[0].puissance && (
                    <Box
                      component="li"
                      sx={{
                        paddingBottom: "4px",
                        margin: 0,
                        display: "list-item",
                        textAlign: "-webkit-match-parent",
                        paddingTop: "4px",
                        listStyle: "none",
                        fontSize: "1rem",
                        color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#282828",
                        }}
                      >
                        Puissance&nbsp;
                      </Box>
                      :&nbsp;{selectedprd[0].puissance}
                    </Box>
                  )}
                  {selectedprd[0].contenance && (
                    <Box
                      component="li"
                      sx={{
                        paddingBottom: "4px",
                        margin: 0,
                        display: "list-item",
                        textAlign: "-webkit-match-parent",
                        paddingTop: "4px",
                        listStyle: "none",
                        fontSize: "1rem",
                        color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#282828",
                        }}
                      >
                        Contenance&nbsp;
                      </Box>
                      :&nbsp;{selectedprd[0].contenance}
                    </Box>
                  )}
                  {selectedprd[0].tension && (
                    <Box
                      component="li"
                      sx={{
                        paddingBottom: "4px",
                        margin: 0,
                        display: "list-item",
                        textAlign: "-webkit-match-parent",
                        paddingTop: "4px",
                        listStyle: "none",
                        fontSize: "1rem",
                        color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#282828",
                        }}
                      >
                        Tension&nbsp;
                      </Box>
                      :&nbsp;{selectedprd[0].tension}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        margin: "0 auto",
        minWidth: "1000px",
        maxWidth: "1500px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          marginTop: "20px",
          paddingTop: 0,
          minWidth: "996px",
          padding: "14px 18px 18px",
          margin: "0 auto",
        }}
      >
        <Box>
          {rightCol}
          {leftCol}
          {centerCol}
        </Box>
        {detailProduit}
        {descProduit}
        {ficheTecProduit}
      </Box>
    </Box>
  );
};

export default ProdViewUpsm;
