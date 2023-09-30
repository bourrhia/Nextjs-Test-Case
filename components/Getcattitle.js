import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const Getcattitle = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",

          "&::before,&::after": {
            content: '""',
            display: "table",
            lineHeight: 0,
          },

          "&::after": {
            clear: "both",
          },
          //
          marginBottom: "0 !important",
          //Add
          //  marginLeft: "32px",
          //  marginRight: "32px",
          //
        }}
      >
        <Box
          sx={{
            // paddingRight: "20px",
            paddingRight: "10px",

            flex: "0 1 auto",
          }}
        >
          <Box
            component="h2"
            sx={{
              fontSize: "1.5rem",
              lineHeight: "32px",
              fontWeight: "700",
              marginBottom: 0,
              marginTop: 0,
            }}
          >
            <Box
              component="a"
              sx={{
                color: "inherit",

                ":link": {
                  textDecoration: "none",
                },

                ":-webkit-any-link": {
                  cursor: "pointer",
                },

                fontSize: "1.5rem",
                lineHeight: "32px",
                fontWeight: "700",

                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <Typography gutterBottom component="div">
                <Box
                  sx={{
                    fontSize: "1.5rem",
                    lineHeight: "32px",
                    fontWeight: "700",
                  }}
                >
                  Meilleures ventes
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            fontSize: "1.25rem",
            fontWeight: "normal",
            flex: "1 0 auto",
            lineHeight: "32px",
            display: "inline-block",
          }}
        >
          <Box
            component="a"
            sx={{
              cursor: "pointer",
              textDecoration: "none",

              display: "inline-block",
              // paddingLeft: "17px",
              borderLeft: "solid 2px #f7f7f7",
              lineHeight: "1.125rem",
              color: "#007185",

              ":link": {
                textDecoration: "none",
                color: "#007185",
              },

              ":-webkit-any-link": {
                cursor: "pointer",
              },

              ":hover": {
                textDecoration: "underline",
                color: "#007185",
              },

              ":focus": {
                textDecoration: "underline",
                color: "#007185",
              },
            }}
          >
            <Typography gutterBottom component="div">
              <Box
                sx={{
                  // fontSize: "1.25rem",
                  fontSize: "1rem",
                  fontWeight: "normal",
                  lineHeight: "1.125rem",
                  // marginLeft: "10px!important",
                  color: "#007185!important",
                  //fontSize: "16px!important",
                  // lineHeight: "24px!important",
                }}
              >
                Voire plus
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        component="hr"
        sx={{
          marginTop: "4px!important",
          backgroundColor: "transparent",
          display: "block",
          height: "1px",
          borderWidth: 0,
          borderTop: "1px solid #e7e7e7",
          lineHeight: "19px",
          marginBottom: "14px",
        }}
      ></Box>
    </>
  );
};

export default Getcattitle;
