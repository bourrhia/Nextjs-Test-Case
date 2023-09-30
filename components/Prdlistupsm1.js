import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Getcattitle from "./Getcattitle";
//
import Link from "next/link";

export const Prdlistupsm1 = ({ imgmrv }) => {
  const renderedImg = imgmrv.map((image) => {
    const ItemPrixAct = parseFloat(
      Math.round(image.prixAct * 100) / 100
    ).toFixed(2);

    const ItemPrixIni = parseFloat(
      Math.round(image.prixIni * 100) / 100
    ).toFixed(2);

    return (
      <Box
        component="li"
        key={image.imgNum}
        sx={{
          //  width: "199px",
          display: "inline-block",
          listStyle: "none",
          wordWrap: "break-word",
          height: "100%",
          // maxWidth: "297px",
          // minWidth: "198px",
          float: "left",
          textAlign: "left",
          position: "relative",
          padding: "0 2px 0 0 !important",
          margin: "0 !important",

          //
          "@media screen and (min-width: 600px)": {
            width: "calc(100% / (3))",
          },

          /* "@media screen and (min-width: 768px)": {
          width: "calc(100% / (3))",
        },*/

          "@media screen and (min-width: 900px)": {
            width: "calc(100% / (4))",
          },

          "@media screen and (min-width: 1083px)": {
            width: "calc(100% / (5))",
          },

          "@media screen and (min-width: 1200px)": {
            width: "calc(100% / (6))",
          },
        }}
      >
        <Box
          component="span"
          sx={{
            color: "#0F1111",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#FFF",
              marginBottom: "0!important",
            }}
          >
            <Link href={`/produit/${encodeURIComponent(image.imgNum)}`}>
              <Box
                component="a"
                sx={{
                  textDecoration: "none",
                  color: "#007185",

                  cursor: "pointer",

                  ":link": {
                    textDecoration: "none",
                    color: "#007185",
                  },

                  ":-webkit-any-link": {
                    cursor: "pointer",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    margin: "0px",
                    backgroundColor: "#FFF",
                    height: "250px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundImage:
                        "radial-gradient(50% 50%, rgba(55, 62, 62, 0.00) 50%, rgba(55, 62, 62, 0.01) 74%, rgba(55, 62, 62, 0.05) 100%)",
                      margin: "0px",
                      width: "100%",
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      zIndex: 1,
                      background:
                        "radial-gradient(rgba(0,0,0,0), rgba(0,0,0,0.01), rgba(0,0,0,0.05), rgba(0,0,0,0.05))",
                    }}
                  ></Box>
                  <Box
                    sx={{
                      position: "relative",
                      margin: "10px auto 10px auto",
                      //  width: "180px",
                      width: "100%",
                      maxHeight: "230px",
                      verticalAlign: "top",
                      maxWidth: "100%",
                      border: 0,
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
                <Box
                  sx={{
                    marginBottom: 0,
                    backgroundColor: "#FAFAFA",
                    paddingTop: "10px",
                    paddingBottom: "15px !important",
                  }}
                >
                  <Box
                    sx={{
                      display: "-webkit-box",
                      verticalAlign: "middle",
                      textOverflow: "ellipsis",
                      width: "100%",
                      padding: "0 20px 0 20px",
                      textAlign: "left",
                      //height: "3em",
                      overflow: "hidden",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      marginTop: "4px",
                      marginBottom: "0px !important",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: "#0F1111!important",
                        fontSize: "14px!important",
                        lineHeight: "20px!important",
                        textAlign: "left",
                      }}
                    >
                      {image.descPrd}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: "48px",
                      width: "100%",
                      padding: "0 20px 0 20px",
                      textAlign: "left",
                      marginBottom: "0px !important",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: "0px !important",
                        height: "28px",
                        lineHeight: "28px",
                        color: "#111",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          fontSize: "21px",
                          color: "#0F1111",
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
                            fontSize: "21px",
                            color: "#0F1111",
                          }}
                        >
                          prix
                        </Box>
                        <Box component="span" aria-hidden="true">
                          <Box
                            component="span"
                            sx={{
                              // fontSize: "21px",
                              color: "#0F1111",
                              lineHeight: "normal",
                              textAlign: "left",
                              //

                              fontSize: "1rem",
                              //  display: "block",
                              //  color: "#111820",
                              fontWeight: 700,
                            }}
                          >
                            {ItemPrixAct}&nbsp;{image.prixSymbol}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    {image.prixIni && (
                      <Box
                        sx={{
                          marginRight: "6px",
                          marginBottom: "0px !important",
                          whiteSpace: "nowrap",
                          overflow: "visible",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#565959!important",
                            fontSize: "12px!important",
                            lineHeight: "16px!important",
                          }}
                        >
                          Ancien prix :
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            color: "#565959!important",
                            fontSize: "12px!important",
                            lineHeight: "16px!important",
                            textDecoration: "line-through!important",
                          }}
                        >
                          {ItemPrixIni}&nbsp;{image.prixSymbol}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    );
  });

  /*const renderedImg = imgmrv.map((image) => (
    <Box
      component="li"
      key={image.imgNum}
      sx={{
        //  width: "199px",
        display: "inline-block",
        listStyle: "none",
        wordWrap: "break-word",
        height: "100%",
        // maxWidth: "297px",
        // minWidth: "198px",
        float: "left",
        textAlign: "left",
        position: "relative",
        padding: "0 2px 0 0 !important",
        margin: "0 !important",

        //
        //"@media screen and (min-width: 600px)": {
        //  width: "calc(100% / (3))",
       // },

        // "@media screen and (min-width: 768px)": {
         // width: "calc(100% / (3))",
       // },

        "@media screen and (min-width: 900px)": {
          width: "calc(100% / (4))",
        },

        "@media screen and (min-width: 1083px)": {
          width: "calc(100% / (5))",
        },

        "@media screen and (min-width: 1200px)": {
          width: "calc(100% / (6))",
        },
      }}
    >
      <Box
        component="span"
        sx={{
          color: "#0F1111",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#FFF",
            marginBottom: "0!important",
          }}
        >
          <Link href={`/produit/${encodeURIComponent(image.imgNum)}`}>
            <Box
              component="a"
              sx={{
                textDecoration: "none",
                color: "#007185",

                cursor: "pointer",

                ":link": {
                  textDecoration: "none",
                  color: "#007185",
                },

                ":-webkit-any-link": {
                  cursor: "pointer",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  margin: "0px",
                  backgroundColor: "#FFF",
                  height: "250px",
                }}
              >
                <Box
                  sx={{
                    backgroundImage:
                      "radial-gradient(50% 50%, rgba(55, 62, 62, 0.00) 50%, rgba(55, 62, 62, 0.01) 74%, rgba(55, 62, 62, 0.05) 100%)",
                    margin: "0px",
                    width: "100%",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    zIndex: 1,
                    background:
                      "radial-gradient(rgba(0,0,0,0), rgba(0,0,0,0.01), rgba(0,0,0,0.05), rgba(0,0,0,0.05))",
                  }}
                ></Box>
                <Box
                  sx={{
                    position: "relative",
                    margin: "10px auto 10px auto",
                    //  width: "180px",
                    width: "100%",
                    maxHeight: "230px",
                    verticalAlign: "top",
                    maxWidth: "100%",
                    border: 0,
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
              <Box
                sx={{
                  marginBottom: 0,
                  backgroundColor: "#FAFAFA",
                  paddingTop: "10px",
                  paddingBottom: "15px !important",
                }}
              >
                <Box
                  sx={{
                    display: "-webkit-box",
                    verticalAlign: "middle",
                    textOverflow: "ellipsis",
                    width: "100%",
                    padding: "0 20px 0 20px",
                    textAlign: "left",
                    //height: "3em",
                    overflow: "hidden",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    marginTop: "4px",
                    marginBottom: "0px !important",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "#0F1111!important",
                      fontSize: "14px!important",
                      lineHeight: "20px!important",
                      textAlign: "left",
                    }}
                  >
                    {image.descPrd}
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: "48px",
                    width: "100%",
                    padding: "0 20px 0 20px",
                    textAlign: "left",
                    marginBottom: "0px !important",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      marginBottom: "0px !important",
                      height: "28px",
                      lineHeight: "28px",
                      color: "#111",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "21px",
                        color: "#0F1111",
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
                          fontSize: "21px",
                          color: "#0F1111",
                        }}
                      >
                        prix
                      </Box>
                      <Box component="span" aria-hidden="true">
                        <Box
                          component="span"
                          sx={{
                            // fontSize: "21px",
                            color: "#0F1111",
                            lineHeight: "normal",
                            textAlign: "left",
                            //

                            fontSize: "1rem",
                            //  display: "block",
                            //  color: "#111820",
                            fontWeight: 700,
                          }}
                        >
                          {image.prixAct}&nbsp;{image.prixSymbol}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {image.prixIni && (
                    <Box
                      sx={{
                        marginRight: "6px",
                        marginBottom: "0px !important",
                        whiteSpace: "nowrap",
                        overflow: "visible",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: "#565959!important",
                          fontSize: "12px!important",
                          lineHeight: "16px!important",
                        }}
                      >
                        Ancien prix :
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          color: "#565959!important",
                          fontSize: "12px!important",
                          lineHeight: "16px!important",
                          textDecoration: "line-through!important",
                        }}
                      >
                        {image.prixIni}&nbsp;{image.prixSymbol}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  ));*/

  return (
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
          width: "100%",
          minHeight: "0.1rem",
          overflow: "visible",
          //paddingLeft: "12px",
          marginRight: "0!important",
          //Add
          //marginLeft: "32px",
          // marginRight: "32px",
          //
          float: "right!important",
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
          <Box>
            <Box
              sx={{
                marginBottom: 0,
                //  margin: "40px 0px",
                //  margin: "5px 0px",
                // minWidth: "794px",
                //  maxWidth: "2573px",
                backgroundColor: "#fff",
                //
                width: "100%",
              }}
            >
              <Getcattitle />
              <Box
                sx={{
                  marginBottom: 0,
                  marginTop: "10px",
                }}
              >
                <Box
                  component="ul"
                  sx={{
                    display: "block",
                    marginLeft: 0,
                    color: "#0F1111",
                    height: "384px",
                    overflow: "hidden",
                    marginBottom: "0 !important",
                    padding: 0,
                    margin: "0 0 0 18px",

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
                  {renderedImg}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Prdlistupsm1;
