import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import Getcattitle from "./Getcattitle";

export const Prdlistsm1 = ({ imgmrv }) => {
  const renderedImg = imgmrv.map((image) => (
    <Box
      component="li"
      key={image.imgNum}
      sx={{
        // width: "calc(18.181818181818183% - 13.090909090909092px)",
        marginRight: "16px",
        display: "inline-block",
        flexShrink: 0,
        listStyle: "none",
        scrollSnapAlign: "start",
        whiteSpace: "initial",
        boxSizing: "border-box",

        //

        "@media screen and (min-width: 600px)": {
          width: "calc(100% / (3))",
        },

        "@media screen and (min-width: 768px)": {
          width: "calc(100% / (4))",
        },

        "@media screen and (min-width: 960px)": {
          width: "calc(100% / (5))",
        },

        "@media screen and (min-width: 1083px)": {
          width: "calc(100% / (6))",
        },
      }}
    >
      <Box
        component="a"
        sx={{
          display: "block",
          marginLeft: "3px",
          marginTop: "3px",
          padding: "1px",

          cursor: "pointer",
          color: "#111820",

          ":link": {
            color: "#111820",
          },

          ":hover": {
            textDecoration: "underline",
          },

          ":-webkit-any-link": {
            cursor: "pointer",
          },

          listStyle: "none",
          whiteSpace: "initial",
        }}
      >
        <Box
          sx={{
            paddingTop: "100%",
            width: "100%",
            backgroundPosition: "center",
            backgroundSize: "cover",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",

            "&::after": {
              backgroundColor: "rgba(0,0,0,0.02)",
              bottom: 0,
              content: '""',
              display: "block",
              left: 0,
              pointerEvents: "none",
              position: "absolute",
              right: 0,
              top: 0,
            },
          }}
        >
          <Image
            src={image.imgJpg}
            alt="Image meilleure vente"
            //layout="responsive"
            // width="100%"
            // height="100%"
            layout="fill"
            //className={styles.styleimg}
            //
            /*sx={{
                opacity: 1,
                left: "50%",
                maxHeight: "100%",
                maxWidth: "100%",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%) translateX(-50%)",
              }}*/
          />
        </Box>
        <Typography variant="subtitle2" gutterBottom component="div">
          <Box
            sx={{
              maxHeight: "2.25rem",
              marginBottom: 0,
              //  "-webkit-line-clamp": "2",
              //   "-webkit-box-orient": "vertical",
              //  "-moz-box-orient": "vertical",
              //  "-moz-line-clamp": 2,

              //
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              MozBoxOrient: "vertical",
              MozLineClamp: 2,
              //
              display: "-webkit-box",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // marginTop: "5px",
              marginTop: "16px",
              lineHeight: "18px",
              color: "#111820",
              fontWeight: 500,
            }}
          >
            {image.descPrd}
          </Box>
        </Typography>
        <Box>
          <Box
            component="span"
            sx={{
              fontSize: "1rem",
              display: "block",
              color: "#111820",
              fontWeight: 700,
              //  marginTop: "16px",
            }}
          >
            {image.prixAct}&nbsp;{image.prixSymbol}
            {image._id}
          </Box>
          {image.red && (
            <Box>
              <Box
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  marginTop: "6px",
                  color: "#707070",
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
                  Prix de vente initial :
                </Box>
                <Box
                  component="del"
                  sx={{
                    textDecoration: "line-through",
                  }}
                >
                  {image.prixIni}&nbsp;{image.prixSymbol}
                </Box>
              </Box>
              <Box
                component="span"
                sx={{
                  fontSize: "0.75rem",
                  marginTop: "6px",
                  color: "#707070",
                  marginLeft: "10px",
                }}
              >
                <Box
                  component="strong"
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  {image.red}&nbsp;% de réduction
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  ));

  return (
    <>
      <Box
        sx={
          {
            // marginBottom: "24px",
          }
        }
      >
        <Getcattitle />
      </Box>
      <Box>
        <Box>
          <Box
            sx={{
              overflow: "visible",
              marginTop: 0,
              marginBottom: 0,

              "@media screen and (min-width: 601px)": {
                //  margin: "16px 0",
                margin: "16px 0 32px",
              },
              position: "relative",
            }}
          >
            <Box
              sx={{
                paddingTop: 0,
                paddingBottom: 0,
                overflow: "hidden",
                position: "relative",
                whiteSpace: "nowrap",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "block",
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  component="ul"
                  sx={{
                    ":hover": {
                      borderColor: "rgba(0,0,0,0.4)",
                    },

                    overflowX: "auto",
                    overflowY: "hidden",
                    paddingBottom: "10px",
                    scrollBehavior: "smooth",
                    scrollSnapType: "x proximity",
                    transition:
                      "border-color .5s,scrollbar-color .5s,transform .45s ease-in-out",
                    display: "flex",

                    margin: 0,
                    // padding: 0,
                    position: "relative",
                    transform: "translate3d(0,0,0)",
                    width: "100%",
                    //

                    willChange: "transform",

                    " :-webkit-scrollbar": {
                      height: "5px",
                    },
                    " :-webkit-scrollbar-thumb": {
                      borderColor: "inherit",
                      borderRadius: "4px",
                      borderRightStyle: "inset",
                      borderRightWidth: "calc(100vw + 100vh)",
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
    </>
  );
};

export default Prdlistsm1;
