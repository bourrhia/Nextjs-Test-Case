import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export const Prdselecxs1 = ({ imgmrv }) => {
  //const { imgmrv } = props;
  // console.log(imgmrv);
  const renderedImg = imgmrv.map((image) => (
    <Box
      key={image.imgNum}
      component="li"
      sx={{
        flex: "0 0 100%",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        width: "100vw",
        height: "50vh",
        transition: "height .3s linear",
        position: "relative",
        listStyle: "none",

        alignItems: "center",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",

        WebkitoxBAlign: "center",
        alignItems: "center",
        WebkitBoxPack: "center",

        "&::after": {
          // background: "rgba(0,0,0,0.05)",
          bottom: 0,
          content: '""',
          display: "block",
          left: 0,
          position: "absolute",
          right: 0,
          top: 0,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          display: "inline-block",
          maxWidth: "100%",
          // position: "relative",
        }}
      >
        <Image
          src={image.imgJpg}
          alt="Image meilleure vente"
          //layout="responsive"
          layout="fill"
          // width="100%"
          // height="100%"
          objectFit="contain"
        />
      </Box>
    </Box>
  ));

  return (
    <Box
      sx={{
        marginBottom: "0.7rem",
      }}
    >
      <Box
        sx={{
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
          letterSpacing: "normal",
          WebkitFontSmoothing: "antialiased",
          MozFontSmoothing: "antialiased",
          MsFontSmoothing: "antialiased",
          fontSmoothing: "antialiased",
          WebkitTextSizeAdjust: "none",
          MozTextSizeAdjust: "none",
          MsTextSizeAdjust: "none",
          textSizeAdjust: "none",
          verticalAlign: "middle",
          display: "block",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        <Box
          sx={{
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          <Box
            component="ul"
            sx={{
              display: "flex",
              alignItems: "center",
              overflow: "auto",
              scrollSnapType: "x mandatory",
              listStyleType: "none",
              minWidth: "100%",
              //
              margin: 0,
              padding: 0,
            }}
          >
            {renderedImg}
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            marginTop: "0.7rem",
            padding: "0 1rem",
          }}
        >
          <Box
            sx={{
              marginTop: "1rem",
            }}
          >
            <Box
              sx={{
                WebkitBoxSizing: "border-box",
                MozBoxSizing: "border-box",
                boxSizing: "border-box",

                "&::before,&::after": {
                  display: "table",
                  content: '""',
                },

                "&::after": {
                  clear: "both",
                },
              }}
            >
              <Box
                sx={{
                  lineHeight: "1.33rem",
                  display: "block",
                  fontSize: "1.25rem",
                  fontWeight: 400,
                  color: "#333",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  margin: "0rem",
                }}
              >
                <Box
                  component="h1"
                  sx={{
                    color: "#111820",
                    fontSize: "1.25rem",
                    lineHeight: "24px",
                    display: "block",
                    fontWeight: 400,
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: "0rem",
                  }}
                >
                  <Box component="span">
                    <Box component="span">TEST</Box>
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

export default Prdselecxs1;
