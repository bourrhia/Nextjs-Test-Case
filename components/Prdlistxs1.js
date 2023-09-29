import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Getcattitle from "./Getcattitle";
import Link from "next/link";
import { useRouter } from "next/router";

export const Prdlistxs1 = ({ imgmrv }) => {
  // const filteredImg = imgmrv.filter((image, i) => i < 4);
  //const renderedImg = filteredImg.map((image) => (
  const router = useRouter();

  const showProduct = async (imgNum) => {
    try {
      await router.push(`/produit/${encodeURIComponent(imgNum)}`);
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
    }
  };

  console.log("vendredi imgmrv :", imgmrv);
  const renderedImg = imgmrv.map((image) => (
    <Box
      component="a"
      key={image.imgNum}
      onClick={(e) => {
        e.preventDefault();
        showProduct(image.imgNum);
      }}
      sx={{
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

          "&::before": {
            content: '""',
            display: "block",
            height: 0,
            paddingBottom: "100%",
          },

          "&::after": {
            backgroundColor: "#000",
            content: '""',
            height: "100%",
            opacity: ".03",
            position: "absolute",
            top: 0,
            width: "100%",
            //
            maxHeight: "90%",
            maxWidth: "90%",
            margin: "auto",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            verticalAlign: "top",
            border: 0,
          },
        }}
      >
        <Box
          sx={{
            maxHeight: "90%",
            maxWidth: "90%",
            position: "absolute",
            margin: "auto",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            verticalAlign: "top",
            border: 0,
          }}
        >
          <Box
            sx={{
              position: "relative",
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
      <Box
        sx={{
          paddingRight: "8px!important",
          paddingLeft: "8px!important",
          textAlign: "center!important",
          marginBottom: "0.8rem!important",
        }}
      >
        <Box
          component="span"
          sx={{
            cursor: "pointer",
          }}
        >
          <Box
            // component="a"
            sx={{
              /* ":link": {
                color: "#007185",
              },*/

              fontWeight: "400!important",
              fontStyle: "normal!important",
              // textTransform: "none!important",
              // textDecoration: "none!important",

              // cursor: "pointer",

              /* ":-webkit-any-link": {
                cursor: "pointer",
              },*/
            }}
          >
            <Box
              sx={{
                marginBottom: "0!important",
              }}
            >
              <Box
                component="h2"
                sx={{
                  fontSize: "12px!important",
                  //   lineHeight: "16px!important",
                  paddingBottom: 0,
                  WebkitLineClamp: 2,
                  maxHeight: "48px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  marginBottom: "0!important",
                  color: "#0F1111!important",
                  fontWeight: 700,
                  textRendering: "optimizeLegibility",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: "14px!important",
                    // lineHeight: "20px!important",
                    paddingBottom: 0,
                    color: "#0F1111!important",
                    fontWeight: "400!important",
                    fontStyle: "normal!important",
                    //  textTransform: "none!important",
                    //   textDecoration: "none!important",
                    //
                    marginBottom: "0!important",
                    paddingBottom: 0,
                  }}
                >
                  {image.descPrd}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                // paddingTop: "0.4rem",
                marginTop: "0!important",
                marginBottom: "0!important",
                //  textAlign: "center!important",
              }}
            >
              <Box
                sx={{
                  fontSize: "12px!important",
                  //  lineHeight: "16px!important",
                  width: "100%",
                  color: "#0F1111!important",

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
                    //  fontSize: "1.8rem",
                    //  lineHeight: "2rem",
                    color: "#0F1111",
                    textDecoration: "none",
                    position: "relative",
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
                      left: "0rem!important",
                      bottom: "-0.1rem!important",
                      zIndex: "-1!important",
                      opacity: 0,
                    }}
                  >
                    {image.prixAct}&nbsp;{image.prixSymbol}
                  </Box>
                  <Box component="span" aria-hidden="true">
                    <Box
                      component="span"
                      sx={{
                        // fontSize: "16px!important",
                        //  lineHeight: "20px!important",

                        // fontSize: "1.25rem",
                        fontSize: "1rem",
                        //  color: "#333",
                        // letterSpacing: ".7px",
                        //     fontFamily:
                        //      ' "HelveticaNeue","Helvetica Neue","Helvetica","Tahoma","Geneva","Arial",sans-serif',
                        fontWeight: "bold",
                      }}
                    >
                      {image.prixAct}&nbsp;{image.prixSymbol}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {image.red && (
              <Box
                sx={{
                  width: "100%",
                  wordWrap: "break-word",
                  //  textAlign: "left!important",
                  textAlign: "center!important",

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
                    fontWeight: "400!important",
                    fontStyle: "normal!important",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: "14px!important",
                      lineHeight: "20px!important",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        wordWrap: "normal",
                      }}
                    >
                      {image.prixIni}&nbsp;{image.prixSymbol}
                    </Box>
                    &nbsp;-&nbsp;
                    <Box
                      component="span"
                      sx={{
                        wordWrap: "normal",
                      }}
                    >
                      {image.red}&nbsp;%
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  ));

  return (
    <Box>
      <Box
        sx={{
          marginTop: "5px",
          marginBottom: "5px",
          backgroundColor: "#FFF",
          overflow: "auto",
          padding: "15px",
        }}
      >
        <Box
          sx={{
            padding: 0,
            paddingBottom: "10px",
          }}
        >
          <Box
            component="h2"
            sx={{
              paddingBottom: 0,
              fontSize: "20px",
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
              }}
            >
              <Box
                component="span"
                sx={{
                  position: "absolute!important",
                  left: "0rem!important",
                  bottom: "-0.1rem!important",
                  zIndex: "-1!important",
                  opacity: 0,
                  display: "inline-block",
                  width: "100%",
                  whiteSpace: "normal",
                }}
              >
                Meilleures ventes
              </Box>

              <Box
                component="span"
                sx={{
                  height: "auto",
                  display: "inline-block",
                  width: "100%",
                  whiteSpace: "normal",
                }}
              >
                Meilleures ventes
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: 0,
            position: "relative",
          }}
        >
          <Box
            sx={{
              marginBottom: 0,
              gridGap: "2px",
              display: "grid",
              gap: "2px",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            {renderedImg}
          </Box>
        </Box>

        <Box
          sx={{
            padding: 0,
            paddingTop: "13px",
          }}
        >
          <Box
            sx={{
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            <Box
              component="a"
              sx={{
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
                component="span"
                sx={{
                  lineHeight: "1.3em !important",
                  maxHeight: "1.3em",
                  display: "block",
                  wordBreak: "normal",
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    position: "absolute!important",
                    left: "0rem!important",
                    bottom: "-0.1rem!important",
                    zIndex: "-1!important",
                    opacity: 0,
                    display: "inline-block",
                    width: "100%",
                    whiteSpace: "normal",
                  }}
                >
                  Voir plus
                </Box>

                <Box
                  component="span"
                  sx={{
                    height: "auto",
                    display: "inline-block",
                    width: "100%",
                    whiteSpace: "normal",
                  }}
                >
                  Voir plus
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Prdlistxs1;
