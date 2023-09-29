import React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export const Allprdxs1 = ({ imgmrv }) => {
  //const { imgmrv } = props;
  // console.log(imgmrv);
  const renderedImg = imgmrv.map((image) => (
    <Box
      key={image.imgNum}
      sx={{
        width: "50%",
        boxSizing: "border-box",
        padding: "16px 8px",
        borderBottom: "1px solid #ddd",
        position: "relative",
        float: "left",
        minHeight: "1px",
      }}
    >
      <Box
        itemScope="itemscope"
        itemType="https://schema.org/Product"
        sx={{
          width: "100%",
          minWidth: "130px",
          minHeight: "245px",
          padding: 0,
          whiteSpace: "normal",
          boxSizing: "border-box",
          position: "relative",
          display: "block",
          height: "167px",
          background: "#fff",
          textDecoration: "none",
          fontWeight: 400,
          fontStretch: "normal",
        }}
      >
        <Box
          itemProp="url"
          tabIndex="-1"
          aria-hidden="true"
          component="a"
          sx={{
            color: "#333",
            boxSizing: "inherit",
            touchAction: "manipulation",
            backgroundColor: "transparent",
            textDecoration: "none",
            cursor: "pointer",

            whiteSpace: "normal",

            ":-webkit-any-link": {
              cursor: "pointer",
            },
          }}
        >
          <Box
            sx={{
              float: "none",
              width: "100%",
              marginLeft: 0,
              height: "130px",

              ":link": {
                color: "#333",
              },
            }}
          >
            <Box
              sx={{
                overflow: "hidden",
                position: "relative",
                margin: 0,
                display: "table",
                padding: 0,
                width: "100%",
                height: "100%",
                boxSizing: "inherit",
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
            marginLeft: 0,
            marginTop: "10px",
            height: "calc(100% - 130px)",
            paddingTop: 0,
            position: "relative",
            boxSizing: "inherit",
          }}
        >
          <Box
            component="a"
            sx={{
              color: "#333",
              boxSizing: "inherit",
              touchAction: "manipulation",
              backgroundColor: "transparent",
              textDecoration: "none",
              cursor: "pointer",

              ":-webkit-any-link": {
                cursor: "pointer",
              },

              whiteSpace: "normal",
              fontWeight: 400,
              fontStretch: "normal",
            }}
          >
            <Box
              component="h3"
              sx={{
                display: "block",
                marginTop: 0,
                marginBottom: "6px",
                textDecoration: "none",
                color: "#333",
                fontWeight: 400,
                whiteSpace: "normal",
                fontSize: ".9375rem",
                lineHeight: "1.2",
                overflow: "hidden",
                // marginBlockStart: "1em",
                //  marginBlockEnd: "1em",
                //  marginInlineStart: "0px",
                //  marginInlineEnd: "0px",
                boxSizing: "inherit",
              }}
            >
              <Box component="span">
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    display: "-webkit-box",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    color: "#333",
                    fontWeight: 400,
                    whiteSpace: "normal",
                    fontSize: ".9375rem",
                    lineHeight: "1.2",
                    fontStretch: "normal",
                  }}
                >
                  {image.descPrd}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            itemScope="itemscope"
            itemType="http://schema.org/Offer"
            itemProp="offers"
            sx={{
              overflow: "hidden",
              maxWidth: "100%",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              marginBottom: "2px",
              boxSizing: "inherit",
              fontSize: "14px",
              color: "#333",
            }}
          >
            <Box component="meta" itemProp="prixActuel" content="DHS"></Box>
            <Box
              component="span"
              itemProp="prix"
              sx={{
                fontSize: "1.062rem",
                color: "#333",
                letterSpacing: ".7px",
                fontWeight: "bold",
                whiteSpace: "nowrap",
                fontStretch: "normal",
                boxSizing: "inherit",
              }}
            >
              {image.prixAct}&nbsp;{image.prixSymbol}
            </Box>
          </Box>
          {image.red && (
            <Box
              sx={{
                overflow: "hidden",
                maxWidth: "100%",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                fontSize: ".875rem",
                fontWeight: "400",
                color: "#767676",
                marginBottom: "5px",
                boxSizing: "inherit",
                fontStretch: "normal",
              }}
            >
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: ".875rem",
                  fontWeight: "400",
                  color: "#767676",
                  fontStretch: "normal",
                  boxSizing: "inherit",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    boxSizing: "inherit",
                    whiteSpace: "nowrap",
                    fontSize: ".875rem",
                    fontWeight: 400,
                    color: "#767676",
                    fontStretch: "normal",
                  }}
                >
                  {image.prixIni}&nbsp;{image.prixSymbol}
                </Box>
                <Box
                  component="span"
                  sx={{
                    boxSizing: "inherit",
                    whiteSpace: "nowrap",
                    fontSize: ".875rem",
                    fontWeight: 400,
                    color: "#767676",
                    fontStretch: "normal",
                  }}
                >
                  &nbsp;|
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    textTransform: "uppercase",
                    boxSizing: "inherit",
                    whiteSpace: "nowrap",
                    fontSize: ".875rem",
                    fontStretch: "normal",
                  }}
                >
                  {image.red}&nbsp;%
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  ));

  return (
    <Box
      sx={{
        marginRight: "auto",
        marginLeft: "auto",
        paddingLeft: 0,
        paddingRight: 0,
        boxSizing: "border-box",
        display: "block",
        WebkitTextSizeAdjust: "none",
        WebkitUserSelect: "text",

        "&::before,&::after": {
          display: "table",
          content: '""',
          lineHeight: 0,
        },

        "&::after": {
          clear: "both",
        },
      }}
    >
      <Box
        component="h1"
        sx={{
          fontSize: "1.062rem",
          fontWeight: 400,
          color: "#555",
          margin: 0,
          display: "block",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#fff",
          padding: "10px 30px",
          maxWidth: "100%",
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          position: "relative",
          lineHeight: "30px",
          textDecoration: "none",
          marginBlockStart: "0.67em",
          marginBlockEnd: "0.67em",
          marginInlineStart: "0px",
          marginInlineEnd: "0px",
        }}
      >
        <Box
          component="a"
          sx={{
            ":visited": {
              color: "var(--color-link-visited,#82187c)",
            },

            position: "absolute",
            left: "8px",
            top: "8px",
            touchAction: "manipulation",
            backgroundColor: "transparent",
            textDecoration: "none",

            cursor: "pointer",

            ":-webkit-any-link": {
              cursor: "pointer",
            },

            textAlign: "center",
            whiteSpace: "nowrap",
            lineHeight: "30px",
          }}
        >
          <ChevronLeftIcon
            sx={{
              // height: "20px",
              color: "#767676",
              // width: "10px",
              display: "inline-block",
              fill: "currentColor",
              pointerEvents: "none",
              stroke: "currentColor",
              strokeWidth: 0,
              verticalAlign: "middle",
              textAlign: "center",
              whiteSpace: "nowrap",
              // lineHeight: "30px",
            }}
          ></ChevronLeftIcon>
        </Box>
        Meilleures ventes
      </Box>
      <Box
        sx={{
          boxSizing: "inherit",
          display: "block",
        }}
      >
        <Box
          sx={{
            marginTop: "10px",
          }}
        >
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Box>
              <Box
                sx={{
                  boxSizing: "inherit",
                  backgroundColor: "#fff",
                  padding: "8px",
                }}
              >
                <Box
                  sx={{
                    boxSizing: "inherit",
                    marginLeft: 0,
                    marginRight: 0,

                    "&::before,&::after": {
                      display: "table",
                      content: '""',
                      lineHeight: 0,
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

export default Allprdxs1;
