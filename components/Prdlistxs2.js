import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Getcattitle from "./Getcattitle";

export const Prdlistxs2 = ({ imgmrv }) => {
  const filteredImg = imgmrv.filter((image, i) => i < 3);

  const renderedImg = filteredImg.map((image) => (
    //const renderedImg = imgmrv.map((image) => (
    <Box
      key={image.imgNum}
      sx={{
        marginBottom: "1.3rem",
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
              width: "30%",
              marginRight: "5%",
              float: "left",
              minHeight: "0.1rem",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                height: "80px",
                position: "relative",
              }}
            >
              <Image
                src={image.imgJpg}
                alt="Image meilleure vente"
                layout="responsive"
                width="100%"
                height="100%"
                sx={{
                  position: "absolute",
                  margin: "auto",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  verticalAlign: "top",
                  border: 0,
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              marginRight: 0,
              float: "right",
              width: "65%",
              minHeight: "0.1rem",
              overflow: "visible",
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

            <Box
              sx={{
                marginTop: "0!important",
                marginBottom: "0!important",
              }}
            >
              <Box
                sx={{
                  WebkitBoxAlign: "center",
                  MsFlexAlign: "center",
                  alignItems: "center",
                  marginBottom: "4px",
                  display: "-webkit-box",
                  display: "-ms-flexbox",
                  display: "flex",
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
                    backgroundColor: "#CC0C39",
                    color: "#ffffff",
                    borderRadius: "2px",
                    fontWeight: 400,
                    lineHeight: "12px",
                    marginRight: "6px",
                    padding: "4px 6px",
                    position: "relative",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      // fontSize: "1.1rem!important",
                      // lineHeight: "1.5!important",

                      fontSize: ".75rem!important",
                      fontWeight: 400,
                      lineHeight: "normal!important",
                    }}
                  >
                    {image.prixAct}&nbsp;{image.prixSymbol}&nbsp;
                  </Box>
                </Box>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#CC0C39",
                    WebkitBoxFlex: 1,
                    msFlex: 1,
                    flex: 1,
                    fontWeight: 700,
                    lineHeight: "12px",
                    position: "relative",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: ".75rem!important",
                      fontWeight: 700,
                      lineHeight: "normal!important",
                    }}
                  >
                    vente flash
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                marginBottom: "0!important",
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
                  marginBottom: 0,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: "1rem",
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
                      left: "0rem!important",
                      bottom: "-0.1rem!important",
                      zIndex: "-1!important",
                      opacity: 0,
                      fontSize: "1rem",
                      color: "#0F1111",
                      lineHeight: "normal",
                    }}
                  >
                    {image.prixAct}&nbsp;{image.prixSymbol}
                  </Box>
                  <Box component="span" aria-hidden="true" sx={{}}>
                    <Box
                      component="span"
                      sx={{
                        fontSize: "1rem",
                        color: "#0F1111",
                        lineHeight: "normal",
                      }}
                    >
                      {image.prixAct}&nbsp;{image.prixSymbol}
                    </Box>
                  </Box>
                </Box>

                {image.red && (
                  <Box
                    sx={{
                      marginBottom: "0.4rem!important",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        color: "#565959!important",
                        // fontSize: "1.1rem!important",
                        // lineHeight: "1.5!important",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          textDecoration: "inherit",
                          // fontSize: "1.2rem",
                          //  lineHeight: "1.6rem",
                          color: "#565959",
                          position: "relative",

                          "&::after": {
                            borderTop: "0.1rem solid",
                            position: "absolute",
                            content: '""',
                            right: 0,
                            top: "50%",
                            left: 0,
                          },
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
                          {image.prixIni}&nbsp;{image.prixSymbol}
                        </Box>
                        <Box
                          component="span"
                          aria-hidden="true"
                          sx={{
                            color: "#565959",
                            fontWeight: 300,

                            fontSize: ".75rem",

                            // lineHeight: "normal",
                          }}
                        >
                          {image.prixIni}&nbsp;{image.prixSymbol}
                        </Box>
                      </Box>
                      <Box
                        component="span"
                        aria-hidden="true"
                        sx={{
                          //fontSize: "2.2rem",
                          fontSize: "1rem",
                          fontWeight: 300,
                          paddingLeft: "0.4rem",
                          paddingRight: "0.4rem",
                          color: "#0F1111",
                        }}
                      >
                        -
                      </Box>
                      <Box
                        component="span"
                        aria-hidden="true"
                        sx={{
                          // fontSize: '2.2rem',
                          fontSize: ".75rem",
                          color: "#0F1111",
                          textDecoration: "none",
                          position: "relative",
                          lineHeight: "normal",
                          fontWeight: "400!important",
                          fontStyle: "normal!important",
                          textTransform: "none!important",
                        }}
                      >
                        <Box
                          component="span"
                          aria-hidden="true"
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
                          {image.red}&nbsp;%
                        </Box>
                        <Box
                          component="span"
                          aria-hidden="true"
                          sx={{
                            lineHeight: "normal",

                            color: "#565959",
                            fontWeight: 300,

                            fontSize: ".75rem",
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
              //
              // fontWeight: 300,
              lineHeight: 1.3,
              textRendering: "optimizeLegibility",
              padding: 0,
              margin: 0,
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

                  //

                  /* lineHeight: "1.3em !important",
                  wordBreak: "normal",
                  fontSize: "20px",*/

                  //  fontWeight: 300,
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
                  ////

                  /*   lineHeight: "1.3em !important",
                  wordBreak: "normal",
                  fontSize: "20px",
                  // fontWeight: 300,
                  textRendering: "optimizeLegibility",
                  WebkitTextSizeAdjust: "none",*/
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
          {renderedImg}
        </Box>
        <Box
          sx={{
            paddingTop: "1.3rem",
            fontSize: "15px",
            color: "#111",
            fontWeight: "300",
            lineHeight: "1.35",
          }}
        >
          <Box>
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

export default Prdlistxs2;
