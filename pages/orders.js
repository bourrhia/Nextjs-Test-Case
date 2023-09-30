//import * as React from "react";
import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SvgIcon from "@mui/material/SvgIcon";
import { useGetOrderByIdQuery } from "../redux/features/api/apiSlice";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";

//const { ObjectId } = require("mongodb");
export default function orders() {
  //const { orderPkey } = props;

  const router = useRouter();
  const {
    orderPkey,
    modePaiement,
    orderExDelivery,
    methodeLiv,
    prenomLiv,
    nomLiv,
    adrPrcLiv1,
    adrPrcLiv2,
    villeLiv,
    regionLiv,
    codePostalLiv,
    expediePar,
  } = router.query;

  //const userAdrLiv = JSON.parse(router.query.userAdrLiv);
  //const userAdrLiv = JSON.parse(decodeURIComponent(router.query.userAdrLiv));

  //const orderPrkey = new ObjectId(orderPkey);

  if (orderPkey) {
    const {
      data: order,
      isFetching: orderFetching,
      isLoading: orderLoading,
      isSuccess: orderSuccess,
      isError: orderIsError,
      error: orderError,
    } = useGetOrderByIdQuery(orderPkey);

    const getItemsCount = () => {
      if (order) {
        return order.items.reduce(
          (accumulator, item) => accumulator + item.prodQtee,
          0
        );
      } else {
        return;
      }
    };

    /* function DateComponent({ isoDate }) {
      const date = new Date(isoDate);
      const formattedDate = date.toLocaleDateString("en-GB");

      return <div>{formattedDate}</div>;
    }*/

    let vorderId = "";
    let vcreatedAt;
    // let vorderExDelivery = "";
    let vtotalOrders = "";
    let vlivOrders = "";
    let vprodImage = "";
    let vordersItems = [];
    let vformDateLivDeb;
    let vformDateLivFin;

    if (order) {
      const date = new Date(order.createdAt);
      const formattedDate = date.toLocaleDateString("en-GB"); // Format as dd/mm/yyyy
      const [day, month, year] = formattedDate.split("/"); // Extract day, month, and year
      const formattedTimestamp = `${day}-${month}-${year}`;

      // const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const DateOptions = { month: "long", day: "numeric" };

      let dateLivDebut = new Date(order.createdAt);
      let daysToAddDeb = 3;
      dateLivDebut.setDate(dateLivDebut.getDate() + daysToAddDeb);
      const formDateLivDeb = dateLivDebut.toLocaleDateString(
        "fr-FR",
        DateOptions
      );

      let dateLivFin = new Date(order.createdAt);
      let daysToAddFin = 7;
      dateLivFin.setDate(dateLivFin.getDate() + daysToAddFin);
      const formDateLivFin = dateLivFin.toLocaleDateString(
        "fr-FR",
        DateOptions
      );

      const formattedTotalOrders = parseFloat(
        Math.round(order.totalOrders * 100) / 100
      ).toFixed(2);

      const formattedLivOrders = parseFloat(
        Math.round(order.livOrders * 100) / 100
      ).toFixed(2);

      vorderId = order.orderId;
      vcreatedAt = formattedTimestamp;
      vlivOrders = formattedLivOrders;
      vtotalOrders = formattedTotalOrders;
      vordersItems = order.items;
      vprodImage = order.prodImage;
      vformDateLivDeb = formDateLivDeb;
      vformDateLivFin = formDateLivFin;
    }

    /* function CustArrowBackIcon(props) {
      return (
        <SvgIcon {...props}>
          <ArrowBackIcon />
        </SvgIcon>
      );
    }*/

    //console.log("Mardi 4 avril 2023 - 2 :");
    //console.log(userAdrLiv);

    const orderContents = vordersItems.map((item, index) => {
      const orderItemPrice = parseFloat(
        Math.round(item.prodPrix * 100) / 100
      ).toFixed(2);

      return (
        <Box
          component="article"
          key={index}
          sx={{
            paddingBottom: "8px",
            paddingTop: "8px",
            display: "block",
            fontSize: ".875rem",
            color: "#282828",
            WebkitTextSizeAdjust: "100%",
          }}
        >
          <Box
            sx={{
              padding: "16px",

              "@media screen and (max-width: 1200px)": {
                maxWidth: "950px",
              },

              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              flexWrap: "wrap",
              display: "flex",
              border: "1px solid #ededed",
              borderRadius: "4px",
              fontSize: ".875rem",
              color: "#282828",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              sx={{
                paddingBottom: "4px",
                paddingTop: "4px",
                paddingLeft: 0,
                paddingRight: 0,
                /* flexBasis: "68.75%",
                maxWidth: "68.75%",
                minWidth: "68.75%",
                width: "68.75%", */
                flexBasis: "100%",
                maxWidth: "100%",
                minWidth: "100%",
                width: "100%",
                fontSize: ".875rem",
                color: "#282828",
              }}
            >
              <Box
                sx={{
                  paddingBottom: "8px",
                  paddingTop: "8px",
                  display: "flex",
                  fontSize: ".875rem",
                  color: "#282828",
                }}
              >
                <Box
                  component="a"
                  sx={{
                    fontSize: 0,
                    position: "relative",
                    flexShrink: 0,
                    display: "inline-flex",
                    color: "inherit",
                    textDecoration: "none",
                    backgroundColor: "transparent",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "4px",
                      borderStyle: "none",
                      width: "104px",
                      aspectRatio: "auto 104 / 104",
                      height: "104px",
                      fontSize: 0,
                      //display: "block",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={item.prodImage}
                      alt="Image meilleure vente"
                      // layout="responsive"
                      layout="fill"
                      // width="100%"
                      //  height="100%"
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "16px",
                    flexDirection: "column",
                    display: "flex",
                    overflow: "hidden",
                    fontSize: ".875rem",
                    color: "#282828",
                  }}
                >
                  <Box
                    component="a"
                    sx={{
                      fontSize: "1rem",
                      textOverflow: "ellipsis",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      display: "-webkit-box",
                      whiteSpace: "normal",
                      width: "100%",
                      overflow: "hidden",
                      color: "inherit",
                      textDecoration: "none",
                      backgroundColor: "transparent",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    {item.prodDesc}
                  </Box>
                  <Box
                    sx={{
                      marginBottom: "auto",
                      marginTop: "auto",
                      paddingTop: "4px",
                      fontSize: ".875rem",
                      color: "#282828",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="p"
                      sx={{
                        fontSize: ".875rem",
                        // color: "#282828",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: "#75757a",
                          fontSize: ".875rem",
                        }}
                      >
                        Quantité :
                      </Box>
                      &nbsp;{item.prodQtee}
                    </Box>
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      fontSize: "1rem",
                      paddingTop: "4px",
                      margin: 0,
                      padding: 0,
                      color: "#282828",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        textAlign: "left",
                        fontWeight: 500,
                        direction: "ltr",
                        fontSize: "1rem",
                        color: "#282828",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      {orderItemPrice}&nbsp;dhs
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    });

    return (
      <>
        {/*   */}

        {orderIsError ? (
          <>{orderError.toString()}</>
        ) : orderLoading ? (
          <CircularProgress size={20} />
        ) : orderFetching ? (
          <CircularProgress size={20} />
        ) : order ? (
          <Box
            sx={{
              paddingBottom: "16px",
              paddingTop: "16px",

              "@media screen and (max-width: 1200px)": {
                maxWidth: "950px",
              },

              //max-width: 950px;

              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              flexWrap: "wrap",
              //flex: '0 1 auto',
              display: "flex",
              fontSize: ".875rem",
              color: "#282828",
              WebkitTextSizeAdjust: "100%",
            }}
          >
            <Box
              component="section"
              sx={{
                // flexBasis: '75%',
                // maxWidth: '75%',
                // minWidth: '75%',
                // width: '75%',
                flexBasis: "100%",
                maxWidth: "100%",
                minWidth: "100%",
                width: "100%",
                paddingLeft: "8px",
                paddingRight: "8px",
                display: "block",
                fontSize: ".875rem",
                color: "#282828",
                WebkitTextSizeAdjust: "100%",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  boxShadow: "0 2px 5px 0 rgb(0 0 0 / 5%)",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                  fontSize: ".875rem",
                  color: "#282828",
                  WebkitTextSizeAdjust: "100%",
                }}
              >
                <Box
                  component="header"
                  sx={{
                    paddingLeft: "16px",
                    paddingBottom: "8px",
                    paddingRight: "16px",
                    paddingTop: "8px",
                    height: 0,
                    minHeight: "48px",
                    alignItems: "center",
                    display: "flex",
                    borderBottom: "1px solid #ededed",
                    fontSize: ".875rem",
                    color: "#282828",
                    WebkitTextSizeAdjust: "100%",
                    //
                    paddingLeft: "24px",
                  }}
                >
                  {/* <Box
                  component="a"
                  sx={{
                    fontSize: 0,
                    paddingRight: "16px",
                    color: "inherit",
                    textDecoration: "none",
                    display: "inline-block",
                    backgroundColor: "transparent",

                    ":-webkit-any-link": {
                      cursor: "pointer",
                    },
                    cursor: "pointer",
                    WebkitFontSmoothing: "antialiased",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <CustArrowBackIcon
                    sx={
                      {
                        // fontSize: 0,
                      }
                    }
                  ></CustArrowBackIcon>
                </Box> */}
                  <Box
                    component="h1"
                    sx={{
                      fontSize: "1.25rem",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                      overflow: "hidden",
                      margin: 0,
                      padding: 0,
                      WebkitFontSmoothing: "antialiased",
                      WebkitTextSizeAdjust: "100%",
                      color: "#282828",
                    }}
                  >
                    Détails de la commande
                  </Box>
                </Box>
                <Box
                  sx={{
                    // paddingLeft: "8px",
                    paddingLeft: "16px",
                    paddingBottom: "24px",
                    paddingRight: "8px",

                    "@media screen and (max-width: 1200px)": {
                      maxWidth: "950px",
                    },

                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "100%",
                    flexWrap: "wrap",
                    display: "flex",
                    fontSize: ".875rem",
                    color: "#282828",
                    WebkitTextSizeAdjust: "100%",
                  }}
                >
                  <Box
                    component="section"
                    sx={{
                      paddingBottom: "16px",
                      paddingTop: "16px",
                      color: "#75757a",
                      flexBasis: "100%",
                      maxWidth: "100%",
                      minWidth: "100%",
                      width: "100%",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                      display: "block",
                      fontSize: ".875rem",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="h2"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 500,
                        paddingBottom: "8px",
                        // paddingBottom: "4px",
                        color: "#282828",
                        margin: 0,
                      }}
                    >
                      Commande n°&nbsp;{vorderId}&nbsp;
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        margin: 0,
                        padding: 0,
                        color: "#75757a",
                        fontSize: ".875rem",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      {getItemsCount()}&nbsp;articles
                    </Box>
                    <Box
                      component="p"
                      sx={{
                        margin: 0,
                        padding: 0,
                        color: "#75757a",
                        fontSize: ".875rem",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      Effectuée le &nbsp;{vcreatedAt}
                    </Box>

                    {/*   

                  {vlivOrders && (
                    <Box
                      component="p"
                      sx={{
                        margin: 0,
                        padding: 0,
                        color: "#75757a",
                        fontSize: ".875rem",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      Livraison :
                      <Box
                        component="span"
                        sx={{
                          color: "#75757a",
                          fontSize: ".875rem",
                        }}
                      >
                        &nbsp;{vlivOrders}&nbsp;Dhs
                      </Box>
                    </Box>
                  )}
                  */}

                    <Box
                      component="p"
                      sx={{
                        margin: 0,
                        padding: 0,
                        color: "#75757a",
                        fontSize: ".875rem",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      Total :
                      <Box
                        component="span"
                        sx={{
                          color: "#75757a",
                          fontSize: ".875rem",
                        }}
                      >
                        &nbsp;{vtotalOrders}&nbsp;Dhs
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    component="section"
                    sx={{
                      paddingTop: "16px",
                      position: "relative",
                      flexBasis: "100%",
                      maxWidth: "100%",
                      minWidth: "100%",
                      width: "100%",

                      paddingLeft: "8px",
                      // paddingLeft: "32px",
                      paddingRight: "8px",
                      display: "block",
                      fontSize: ".875rem",
                      color: "#282828",
                      WebkitTextSizeAdjust: "100%",

                      "&::before": {
                        content: '""',
                        marginLeft: "8px",
                        marginRight: "8px",
                        height: "1px",
                        top: 0,
                        right: 0,
                        left: 0,
                        position: "absolute",
                        backgroundColor: "#ededed",
                      },

                      // position: absolute;
                    }}
                  >
                    <Box
                      component="h2"
                      sx={{
                        fontSize: ".875rem",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        margin: 0,
                        padding: 0,
                        color: "#282828",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      Articles dans votre commande
                    </Box>
                    {orderContents}
                  </Box>

                  <Box
                    sx={{
                      paddingBottom: "8px",
                      paddingTop: "8px",
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginLeft: 0,
                      marginRight: 0,

                      "@media screen and (max-width: 1200px)": {
                        maxWidth: "950px",
                      },

                      flexBasis: "100%",
                      minWidth: "100%",
                      width: "100%",
                      flexWrap: "wrap",
                      flex: "0 1 auto",
                      display: "flex",
                      WebkitFontSmoothing: "antialiased",
                      direction: "ltr",
                      fontSize: ".875rem",
                      color: "#282828",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <Box
                      component="section"
                      sx={{
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        flexBasis: "50%",
                        maxWidth: "50%",
                        minWidth: "50%",
                        width: "50%",
                        display: "block",
                        WebkitFontSmoothing: "antialiased",
                        direction: "ltr",
                        fontSize: ".875rem",
                        color: "#282828",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          border: "1px solid #ededed",
                          borderRadius: "4px",
                          fontSize: ".875rem",
                          color: "#282828",
                        }}
                      >
                        <Box
                          component="h2"
                          sx={{
                            fontSize: ".875rem",
                            textTransform: "uppercase",
                            fontWeight: 500,
                            paddingLeft: "16px",
                            paddingBottom: "8px",
                            paddingRight: "16px",
                            paddingTop: "8px",
                            color: "#282828",
                            borderBottom: "1px solid #ededed",
                            margin: 0,
                          }}
                        >
                          Paiement
                        </Box>
                        <Box
                          component="article"
                          sx={{
                            padding: "16px",
                            color: "#75757a",
                            display: "block",
                            WebkitFontSmoothing: "antialiased",
                            direction: "ltr",
                            fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                          }}
                        >
                          <Box
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "#282828",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Mode de paiement
                          </Box>

                          {modePaiement === "Cash" ? (
                            <Box
                              component="p"
                              sx={{
                                paddingTop: "8px",
                                margin: 0,
                                padding: 0,
                                color: "#75757a",
                                WebkitFontSmoothing: "antialiased",
                                direction: "ltr",
                                WebkitTextSizeAdjust: "100%",
                                fontSize: ".875rem",
                              }}
                            >
                              Paiement cash à la livraison
                            </Box>
                          ) : modePaiement === "Card" ? (
                            <Box
                              component="p"
                              sx={{
                                paddingTop: "8px",
                                margin: 0,
                                padding: 0,
                                color: "#75757a",
                                WebkitFontSmoothing: "antialiased",
                                direction: "ltr",
                                WebkitTextSizeAdjust: "100%",
                                fontSize: ".875rem",
                              }}
                            >
                              Paiement par carte bancaire
                            </Box>
                          ) : null}
                        </Box>
                        <Box
                          component="article"
                          sx={{
                            padding: "16px",
                            color: "#75757a",
                            display: "block",
                            WebkitFontSmoothing: "antialiased",
                            direction: "ltr",
                            fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                          }}
                        >
                          <Box
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "#282828",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Détails du paiement
                          </Box>
                          <Box
                            component="p"
                            sx={{
                              paddingTop: "8px",
                              margin: 0,
                              //padding: 0;
                              color: "#75757a",
                              WebkitFontSmoothing: "antialiased",
                              direction: "ltr",
                              fontSize: ".875rem",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            Sous-total:
                            <Box
                              component="span"
                              sx={{
                                color: "#75757a",
                                fontSize: ".875rem",
                              }}
                            >
                              {orderExDelivery}&nbsp;Dhs
                            </Box>
                          </Box>

                          {vlivOrders && (
                            <Box
                              component="p"
                              sx={{
                                paddingTop: "8px",
                                margin: 0,
                                //padding: 0;
                                color: "#75757a",
                                WebkitFontSmoothing: "antialiased",
                                direction: "ltr",
                                fontSize: ".875rem",
                                WebkitTextSizeAdjust: "100%",
                              }}
                            >
                              Frais de livraison :
                              <Box
                                component="span"
                                sx={{
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                }}
                              >
                                {vlivOrders}&nbsp;Dhs
                              </Box>
                            </Box>
                          )}

                          <Box
                            component="p"
                            sx={{
                              paddingTop: "8px",
                              color: "#313133",
                              margin: 0,
                              //padding: 0,
                              WebkitFontSmoothing: "antialiased",
                              direction: "ltr",
                              fontSize: ".875rem",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            Total :
                            <Box
                              component="span"
                              sx={{
                                color: "#313133",
                                fontSize: ".875rem",
                              }}
                            >
                              {vtotalOrders}&nbsp;Dhs
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      component="section"
                      sx={{
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        flexBasis: "50%",
                        maxWidth: "50%",
                        minWidth: "50%",
                        width: "50%",
                        display: "block",
                        WebkitFontSmoothing: "antialiased",
                        direction: "ltr",
                        fontSize: ".875rem",
                        color: "#313133",
                        WebkitTextSizeAdjust: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          // border: "1px solid #d4d4d6",
                          border: "1px solid #ededed",
                          borderRadius: "4px",
                          WebkitFontSmoothing: "antialiased",
                          direction: "ltr",
                          fontSize: ".875rem",
                          color: "#313133",
                          WebkitTextSizeAdjust: "100%",
                        }}
                      >
                        <Box
                          component="h2"
                          sx={{
                            fontSize: ".875rem",
                            textTransform: "uppercase",
                            fontWeight: 500,
                            paddingLeft: "16px",
                            paddingBottom: "8px",
                            paddingRight: "16px",
                            paddingTop: "8px",
                            color: "#313133",
                            // color: "#282828",
                            // borderBottom: "1px solid #d4d4d6",
                            borderBottom: "1px solid #ededed",
                            margin: 0,
                          }}
                        >
                          Livraison
                        </Box>
                        <Box
                          component="article"
                          sx={{
                            padding: "16px",
                            color: "#75757a",
                            display: "block",
                            boxSizing: "border-box",
                            WebkitFontSmoothing: "antialiased",
                            direction: "ltr",
                            fontSize: ".875rem",
                            WebkitTextSizeAdjust: "100%",
                          }}
                        >
                          <Box
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "#313133",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Méthode de livraison
                          </Box>
                          <Box
                            component="p"
                            sx={{
                              paddingTop: "8px",
                              margin: 0,
                              color: "#75757a",
                              fontSize: ".875rem",
                            }}
                          >
                            {methodeLiv}
                          </Box>
                        </Box>
                        <Box
                          component="article"
                          sx={{
                            padding: "16px",
                            color: "#75757a",
                            display: "block",
                            WebkitTextSizeAdjust: "100%",
                            fontSize: ".875rem",
                            WebkitFontSmoothing: "antialiased",
                            direction: "ltr",
                            boxSizing: "border-box",
                          }}
                        >
                          <Box
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "#313133",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Adresse de livraison
                          </Box>
                          <Box
                            component="address"
                            sx={{
                              fontStyle: "normal",
                              paddingTop: "8px",
                              color: "#75757a",
                              WebkitFontSmoothing: "antialiased",
                              direction: "ltr",
                              fontSize: ".875rem",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            {(prenomLiv || nomLiv) && (
                              <Box
                                component="p"
                                sx={{
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {prenomLiv}&nbsp;{nomLiv}
                              </Box>
                            )}
                            {adrPrcLiv1 && (
                              <Box
                                component="p"
                                sx={{
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {adrPrcLiv1}
                              </Box>
                            )}
                            {adrPrcLiv2 && (
                              <Box
                                component="p"
                                sx={{
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {adrPrcLiv2}
                              </Box>
                            )}

                            {(villeLiv || regionLiv || codePostalLiv) && (
                              <Box
                                component="p"
                                sx={{
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                  margin: 0,
                                  padding: 0,
                                }}
                              >
                                {villeLiv},{regionLiv},{codePostalLiv}
                              </Box>
                            )}
                          </Box>
                        </Box>
                        <Box
                          component="article"
                          sx={{
                            padding: "16px",
                            color: "#75757a",
                            display: "block",
                            WebkitTextSizeAdjust: "100%",
                            fontSize: ".875rem",
                            WebkitFontSmoothing: "antialiased",
                            direction: "ltr",
                            boxSizing: "border-box",
                          }}
                        >
                          <Box
                            component="h3"
                            sx={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: "#313133",
                              margin: 0,
                              padding: 0,
                            }}
                          >
                            Détails d'expedition
                          </Box>
                          <Box
                            sx={{
                              paddingTop: "8px",
                              color: "#75757a",
                              WebkitFontSmoothing: "antialiased",
                              direction: "ltr",
                              fontSize: ".875rem",
                              WebkitTextSizeAdjust: "100%",
                            }}
                          >
                            <Box
                              component="p"
                              sx={{
                                paddingTop: "4px",
                                color: "#75757a",
                                margin: 0,
                                fontSize: ".875rem",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  paddingRight: "4px",
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                }}
                              >
                                {methodeLiv},
                              </Box>
                              Expédié par&nbsp;{expediePar}
                            </Box>
                            <Box
                              component="p"
                              sx={{
                                margin: 0,
                                padding: 0,
                                color: "#75757a",
                                fontSize: ".875rem",
                              }}
                            >
                              Livraison entre le
                              <Box
                                component="em"
                                sx={{
                                  fontWeight: 500,
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                }}
                              >
                                &nbsp;{vformDateLivDeb},&nbsp;
                              </Box>
                              et le
                              <Box
                                component="em"
                                sx={{
                                  fontWeight: 500,
                                  color: "#75757a",
                                  fontSize: ".875rem",
                                }}
                              >
                                &nbsp;{vformDateLivFin}
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
        ) : null}
      </>
    );
  }
}
