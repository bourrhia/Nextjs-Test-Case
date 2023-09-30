import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export const Allprds1 = ({ imgmrv }) => {
  //const { imgmrv } = props;
  // console.log(imgmrv);
  const renderedImgmrv = imgmrv.map((image) => (
    <Box
      key={image.imgNum}
      sx={{
        paddingBottom: "10px",
        height: "auto",

        // width: "calc(100% / (2))",
        //height: "478px",

        width: "100%",

        "@media screen and (min-width: 600px)": {
          width: "calc(100% / (2))",
        },

        "@media screen and (min-width: 768px)": {
          width: "calc(100% / (3))",
        },

        "@media screen and (min-width: 960px)": {
          width: "calc(100% / (4))",
        },

        "@media screen and (min-width: 1083px)": {
          width: "calc(100% / (4))",
        },

        "@media screen and (min-width: 1363px)": {
          width: "calc(100% / (5))",
        },

        "@media screen and (min-width: 1643px)": {
          width: "calc(100% / (5))",
        },

        "@media screen and (min-width: 1923px)": {
          width: "calc(100% / (6))",
        },

        "@media screen and (min-width: 2203px)": {
          width: "calc(100% / (7))",
        },

        "@media screen and (min-width: 2483px)": {
          width: "calc(100% / (8))",
        },

        "@media screen and (min-width: 2763px)": {
          width: "calc(100% / (9))",
        },
        "@media screen and (min-width: 3043px)": {
          width: "calc(100% / (10))",
        },

        borderRight: "solid 1px #D5DBDB",

        /* "&:last-child": {
          // borderLeft: "solid 1px #D5DBDB",
          borderRight: "solid 1px #D5DBDB",
        },*/

        "&:first-of-type": {
          // borderLeft: "solid 1px #D5DBDB",
          borderLeft: "solid 1px #D5DBDB",
        },

        borderBottom: "solid 1px #D5DBDB",
        borderLeft: "solid 1px #D5DBDB",

        position: "relative",
        padding: "18px",
        flexDirection: "column",
        flexWrap: "wrap",
        display: "flex",
      }}
    >
      <Box
        sx={{
          // maxWidth: '320px',
          //  maxWidth: "218px",
          // maxWidth: "320px",

          "@media screen and (min-width: 600px)": {
            maxWidth: "320px",
          },

          width: "100%",
          height: "100%",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            height: "100%",
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

                ":visited": {
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
                  marginBottom: "8px!important",
                  width: "100%",

                  "&::before,&::after": {
                    content: '""',
                    display: "table",
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
                    maxWidth: "226px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    position: "relative",

                    "&::after": {
                      content: '""',
                      display: "block",
                      paddingBottom: "100%",
                    },
                  }}
                >
                  <Box
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
                  >
                    <Box
                      sx={{
                        position: "block",
                        width: "100%",
                        height: "100%",
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
          </Link>
          <Box
            component="a"
            sx={{
              color: "#C7511F!important",
              cursor: "pointer",

              ":hover": {
                color: "#C7511F!important",
                cursor: "pointer",
                outline: 0,
              },

              ":active": {
                outline: 0,
              },
              ":-webkit-any-link": {
                cursor: "pointer",
              },

              fontSize: "12px!important",
              lineHeight: "16px!important",
              fontWeight: "400!important",
              fontStyle: "normal!important",
              textTransform: "none!important",
              textDecoration: "none!important",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <Box
                sx={{
                  color: "rgb(255, 255, 255)",
                  background: "rgb(204, 12, 57)",
                  borderRadius: "2px",
                  padding: "4px 6px",
                  marginRight: "6px",
                  position: "relative",
                }}
              >
                {image.red}&nbsp;off
              </Box>
              <Box
                sx={{
                  color: "rgb(204, 12, 57)",
                  background: "rgb(255, 255, 255)",
                  position: "relative",
                  fontWeight: 700,
                  lineHeight: "12px",
                  fontSize: "12px!important",
                  flex: "1 1",
                }}
              >
                Bon deal
              </Box>
            </Box>
            <Box
              sx={{
                visibility: "hidden",
                position: "absolute",
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
                color: "#0F1111!important",
                fontSize: "12px!important",
                lineHeight: "16px!important",
                fontWeight: "400!important",
                fontStyle: "normal!important",
                textTransform: "none!important",
              }}
            >
              <Box
                sx={{
                  color: "rgb(255, 255, 255)",
                  background: "rgb(204, 12, 57)",

                  borderRadius: "2px",
                  padding: "4px 6px",
                  marginRight: "6px",
                  position: "relative",

                  visibility: "hidden",
                  fontSize: "12px!important",
                  lineHeight: "16px!important",
                }}
              >
                {image.red}%&nbsp;off
              </Box>
              <Box
                sx={{
                  color: "rgb(204, 12, 57)",
                  background: "rgb(255, 255, 255)",
                  position: "relative",
                  fontWeight: 700,
                  lineHeight: "12px",
                  fontSize: "12px!important",
                  flex: "1 1",

                  visibility: "hidden",

                  fontStyle: "normal!important",
                  textTransform: "none!important",
                }}
              >
                Bon deal
              </Box>
            </Box>
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: "12px!important",
              lineHeight: "16px!important",
            }}
          >
            <Box
              component="span"
              role="text"
              sx={{
                fontSize: "17px",
                color: "#0F1111",
                textDecoration: "none",
                position: "relative",
                lineHeight: "normal",
              }}
            >
              <Box component="span" aria-hidden="false">
                <Box
                  component="span"
                  sx={{
                    fontSize: "17px",
                    color: "#0F1111",
                    lineHeight: "normal",
                    //
                    fontWeight: "bold",
                  }}
                >
                  {image.prixAct}
                </Box>
                <Box
                  component="span"
                  sx={{
                    position: "relative",
                    top: "-0.3em",
                    fontSize: "11px",
                    //
                    fontWeight: "bold",
                  }}
                >
                  {image.prixSymbol}
                </Box>
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  marginBottom: "4px!important",
                  width: "100%",
                  fontSize: "12px!important",
                  lineHeight: "16px!important",

                  "&::before,&::after": {
                    content: '""',
                    display: "table",
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
                    color: "#565959!important",
                    fontSize: "12px!important",
                    lineHeight: "16px!important",
                  }}
                >
                  Ancien prix :
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      textDecoration: "inherit",
                      fontSize: "12px",
                      color: "#565959",
                      position: "relative",
                      lineHeight: "normal",

                      "&::after": {
                        content: '""',
                        borderTop: "1px solid",
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        left: 0,
                      },
                    }}
                  >
                    <Box component="span" aria-hidden="false">
                      <Box
                        component="span"
                        sx={{
                          fontSize: "12px",
                          color: "#565959",
                          lineHeight: "normal",
                        }}
                      >
                        {image.prixIni}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontSize: "12px",
                          color: "#565959",
                          lineHeight: "normal",
                        }}
                      >
                        {image.prixSymbol}
                      </Box>
                    </Box>
                  </Box>
                  {image.red}%&nbsp;off
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            component="a"
            sx={{
              color: "#0F1111!important",
              fontWeight: "400!important",
              fontStyle: "normal!important",
              textTransform: "none!important",
              textDecoration: "none!important",

              ":-webkit-any-link": {
                cursor: "pointer",
              },

              fontSize: "14px",
              lineHeight: "20px",
            }}
          >
            <Typography variant="subtitle2" gutterBottom component="div">
              <Box
                sx={{
                  fontSize: "1em",
                  // fontSize: "12px",
                  textOverflow: "ellipsis",
                  maxHeight: "2.8em",
                  overflow: "hidden",
                  lineHeight: "1.4",
                  display: "-webkit-box",
                  // "-webkit-line-clamp": "2",
                  // "-webkit-box-orient": "vertical",

                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",

                  //
                  // fontWeight: 200,
                  fontWeight: "400!important",
                  // fontWeight: "200!important",
                  fontStyle: "normal!important",
                  textTransform: "none!important",
                }}
              >
                description prdt description prdt description prdt description
                prdt description prdt description prdt description prdt
                description prdt description prdt description prdt
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  ));

  return (
    <Box
      sx={{
        width: "100%",

        "&::before,&::after": {
          content: '""',
          display: "table",
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
          margin: "0 auto",
          flexWrap: "wrap",
          display: "flex",
        }}
      >
        {renderedImgmrv}
      </Box>
    </Box>
  );
};

export default Allprds1;
