import React, { useState } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";


import { useRouter } from "next/router";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SvgIcon from "@mui/material/SvgIcon";
import Link from "next/link";

function CustChevronRightIcon(props) {
  return (
    <SvgIcon {...props}>
      <ChevronRightIcon />
    </SvgIcon>
  );
}
export const ProdViewXs = ({ selectedprd }) => {
  
  const router = useRouter();
  let qteemax = 10;
  const [selected, setSelected] = useState(1);

  const options = [];
  for (var i = 1; i <= qteemax; i++) {
    options.push(
      <option value={i} key={i}>
        {i}
      </option>
    );
  }

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const info_article_1 = (
    <Box
      sx={{
        "&:not(:last-child)": {
          margin: "0 0 8px",
          display: "block",
        },

        wordBreak: "break-word",
      }}
    >
      <Box
        sx={{
          margin: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "42%",
            color: "#707070",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#707070",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                État
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            paddingLeft: "8px",
            width: "58%",
            paddingRight: "5px",
            color: "#111820",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "calc(100% - 8px)",
              display: "inline-block",
              color: "#111820",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#111820",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                État correct - Reconditionné
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const info_article_2 = (
    <Box
      sx={{
        "&:not(:last-child)": {
          margin: "0 0 8px",
          display: "block",
        },

        wordBreak: "break-word",
      }}
    >
      <Box
        sx={{
          margin: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "42%",
            color: "#707070",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#707070",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Marque
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            paddingLeft: "8px",
            width: "58%",
            paddingRight: "5px",
            color: "#111820",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "calc(100% - 8px)",
              display: "inline-block",
              color: "#111820",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#111820",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Marque1 - Marque2
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const info_article_3 = (
    <Box
      sx={{
        "&:not(:last-child)": {
          margin: "0 0 8px",
          display: "block",
        },

        wordBreak: "break-word",
      }}
    >
      <Box
        sx={{
          margin: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "42%",
            color: "#707070",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#707070",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                N° article
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            paddingLeft: "8px",
            width: "58%",
            paddingRight: "5px",
            color: "#111820",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "calc(100% - 8px)",
              display: "inline-block",
              color: "#111820",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#111820",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                123456789023
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const info_article_4 = (
    <Box
      sx={{
        display: "flex",
        wordBreak: "break-word",
      }}
    >
      <Box
        sx={{
          margin: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "42%",
            color: "#707070",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#707070",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Information specifique sur le type de produit
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            paddingLeft: "8px",
            width: "58%",
            paddingRight: "5px",
            color: "#111820",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "calc(100% - 8px)",
              display: "inline-block",
              color: "#111820",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#111820",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Type de produit
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const info_livraison = (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          marginTop: 0,
          marginLeft: 0,
          margin: "5px 0",
          width: "100%",
        }}
      >
        <Box
          sx={{
            //livraison
            width: "42%",
            color: "#767676",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#767676",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#767676",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Livraison
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "53%",
            marginLeft: "-2px",
            paddingRight: "5px",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "unset",
              display: "inline-block",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                à domicile
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const info_retours = (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          marginLeft: 0,
          margin: "5px 0",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "42%",
            color: "#767676",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#767676",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#767676",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Retours
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "53%",
            marginLeft: "-2px",
            paddingRight: "5px",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "unset",
              display: "inline-block",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Acceptés dans un délai de 15 jours
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const info_paiements = (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          marginLeft: 0,
          marginBottom: 0,
          margin: "5px 0",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "42%",
            color: "#767676",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              color: "#767676",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#767676",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                Paiements
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: "53%",
            marginLeft: "-2px",
            paddingRight: "5px",
            display: "inline-block",
            boxSizing: "border-box",
            wordBreak: "break-word",
            verticalAlign: "top",
            fontSize: ".875rem",
          }}
        >
          <Box
            sx={{
              maxWidth: "unset",
              display: "inline-block",
              wordBreak: "break-word",
              fontSize: ".875rem",
            }}
          >
            <Box>
              <Box
                component="span"
                sx={{
                  color: "#707070",
                  wordBreak: "break-word",
                  fontSize: ".875rem",
                }}
              >
                à la livraison
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderedImg = selectedprd.map((image) => (
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

        WebkitBoxAlign: "center",
        // alignItems: "center",
        WebkitBoxPack: "center",

        "&::after": {
          background: "rgba(0,0,0,0.05)",
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
      <Image
        src={image.imgJpg}
        alt="Image meilleure vente"
        // layout="responsive"
        layout="fill"
        // width="100%"
        // height="100%"
        objectFit="contain"
      />
    </Box>
  ));

  return (
    <Box
      sx={{
        outline: 0,

        boxSizing: "border-box",
        margin: 0,
        padding: 0,
        lineHeight: "20px",

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
      }}
    >
      <Box>
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
              lineHeight: "20px",
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
                        <Typography
                          variant="body1"
                          gutterBottom
                          component="span"
                          sx={{
                            color: "#111820",
                            display: "block",
                            wordWrap: "break-word",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          <Box component="span">
                            {selectedprd[0].descPrd}&nbsp; description prdt
                            description prdt description prdt description prdt
                            description prdt description prdt description prdt
                            description prdt description prdt description prdt
                          </Box>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box>
              <Box
                sx={{
                  marginTop: "0.6rem",
                  padding: "0 1rem",
                }}
              >
                <Box
                  sx={{
                    boxSizing: "border-box",

                    "&::before,&::after": {
                      display: "table",
                      content: '""',
                    },

                    "&::after": {
                      clear: "both",
                    },
                  }}
                ></Box>
              </Box>
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
              ></Box>
              <Box
                sx={{
                  marginTop: "0.7rem",
                  padding: "0 1rem",
                }}
              >
                <Box component="span">
                  <Box
                    component="span"
                    sx={{
                      fontSize: "1.5rem",
                      fontWeight: "inherit",
                      color: "#111820",
                      display: "inline",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: "1.5rem",
                        color: "#111820",
                        fontWeight: "bold",
                      }}
                    >
                      <Box component="span">
                        {selectedprd[0].prixAct}&nbsp;
                        {selectedprd[0].prixSymbol}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: "0.5rem",
                  padding: "0 1rem",
                }}
              ></Box>
              <Box
                sx={{
                  marginTop: "0.95rem",
                  marginBottom: "0.95rem",
                  padding: "0 1rem",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    borderTop: "1px solid #e5e5e5",
                    borderBottom: "1px solid #e5e5e5",
                    paddingBottom: "16px",

                    WebkitBoxSizing: "border-box",
                    MozBoxSizing: "border-box",
                    boxSizing: "border-box",
                    display: "flex",
                    paddingTop: "1rem",

                    textAlign: "center",

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
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      float: "left",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      minHeight: "1px",
                    }}
                  >
                    <Box component="span">
                      <Box component="span">
                        <Typography
                          variant="body2"
                          gutterBottom
                          component="span"
                        >
                          Retours acceptés
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Box>
              <Box>
                <Box
                  sx={{
                    marginTop: "0.5rem",
                    padding: "0 1rem",
                  }}
                >
                  <Box
                    sx={{
                      marginBottom: "0.7rem",
                      marginTop: "0.7rem",
                    }}
                  >
                    <Box
                      sx={{
                        margin: "16px 0",
                        clear: "both",
                        border: "0 solid #d3d3d3",
                        fontWeight: 400,
                        borderRadius: "3px",
                        width: "100%",
                        color:
                          "var(--select-foreground-color,var(--color-text-default,#111820))",
                        fontSize: ".875rem",
                        position: "relative",

                        "&::after": {
                          top: "0.7rem",
                        },

                        "&::after": {
                          content: '""',
                        },
                      }}
                    >
                      <Box
                        component="label"
                        htmlFor="quantity_select"
                        sx={{
                          margin: 0,
                          color: "#111820",
                          display: "-webkit-box",
                          display: "-ms-flexbox",
                          display: "flex",
                          padding: 0,
                          cursor: "default",
                          fontWeight: 400,
                          fontSize: ".875rem",

                          "& > span:first-of-type": {
                            minWidth: "85px",
                            MsFlexPreferredSize: "85px",
                            flexBasis: "85px",
                            paddingRight: "15px",
                            display: "-webkit-box",
                            display: "-ms-flexbox",
                            display: "flex",
                            WebkitBoxAlign: "center",
                            MsFlexAlign: "center",
                            alignItems: "center",
                            boxSizing: "content-box",
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#111820",
                          }}
                        >
                          <Box component="span">Quantité</Box>
                        </Box>
                        <Box
                          component="select"
                          // value="2"
                          value={selected}
                          onChange={handleChange}
                          aria-label="Quantité"
                          id="quantity_select"
                          sx={{
                            borderRadius: "8px",
                            border: "1px solid #e5e5e5",
                            color: "#111820",
                            lineHeight: "normal",

                            WebkitAppearance: "none",
                            MozAppearance: "none",
                            appearance: "none",
                            background: "#fff",
                            boxSizing: "border-box",
                            height: "40px",
                            margin: 0,
                            padding: "0 40px 0 16px",
                            fontWeight: 400,
                            fontSize: "14px",
                            width: "100%",
                            WebkitBoxFlex: 1,
                            flexGrow: 1,
                            verticalAlign: "middle",

                            //
                            overflow: "visible !important",
                          }}
                        >
                          {options}
                        </Box>
                        <Box
                          component="span"
                          aria-hidden="true"
                          sx={{
                            margin: "0!important",
                            fontSize: ".875rem",

                            //

                            right: "1rem",
                            fontSize: ".65rem",
                            color: "#111820",
                            position: "absolute",
                            top: "0.7rem",
                            display: "inline-block",
                            verticalAlign: "top",
                            pointerEvents: "none",
                          }}
                        >
                          <KeyboardArrowDownOutlinedIcon />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            margin: "16px 0",
          }}
        >
          <Box
            sx={{
              marginTop: "1rem",
              padding: "0 1rem",
            }}
          ></Box>
          <Box
            sx={{
              marginTop: "0.5rem",
              padding: "0 1rem",
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <Box
                  component="a"
                  sx={{
                    backgroundColor: "#3665f3",
                    color: "#fff",
                    fontWeight: "bold",
                    border: "1px solid #3665f3",
                    borderRadius: "3rem",
                    minHeight: "3rem",
                    paddingLeft: 0,
                    paddingRight: 0,
                    padding: "0 16px",
                    lineHeight: "48px",
                    fontSize: "16px",
                    height: "48px",
                    boxSizing: "border-box",
                    display: "inline-block",
                    textDecoration: "none",
                    fontFamily: "inherit",
                    margin: 0,
                    textAlign: "center",
                    verticalAlign: "middle",
                    minWidth: "auto",
                    outlineColor: "#111820",
                    width: "100%",

                    cursor: "pointer",

                    ":-webkit-any-link": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    Achat immédiat
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      "@keyframes spin": {
                        "0%": {
                          WebkitTransform: "rotate(0)",
                          transform: "rotate(0)",
                        },

                        "100%": {
                          WebkitTransform: "rotate(360deg)",
                          transform: "rotate(360deg)",
                        },
                      },
                      display: "none",
                      WebkitAnimation: "spin 600ms linear infinite",
                      animation: "spin 600ms linear infinite",
                      height: "30px",
                      width: "30px",
                    }}
                  >
                    <CircularProgress
                      sx={{
                        "&:only-child": {
                          margin: 0,
                        },

                        height: "inherit",
                        maxHeight: "inherit",
                        maxWidth: "inherit",
                        width: "inherit",
                        alignSelf: "center",
                        flexShrink: 0,
                        color: "#fff",
                        fill: "#fff",
                        display: "inline-block",
                        pointerEvents: "none",
                        stroke: "currentColor",
                        strokeWidth: 0,
                        verticalAlign: "middle",
                      }}
                    ></CircularProgress>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  marginTop: "0.5rem",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <Box
                  component="a"
                  sx={{
                    border: "1px solid #3665f3",
                    borderRadius: "3rem",
                    color: "#3665f3",
                    minHeight: "3rem",
                    paddingLeft: 0,
                    paddingRight: 0,
                    padding: "0 16px",
                    lineHeight: "48px",
                    fontSize: "16px",
                    height: "48px",
                    boxSizing: "border-box",
                    display: "inline-block",
                    textDecoration: "none",
                    backgroundColor: "#fff",
                    fontFamily: "inherit",
                    fontWeight: "normal",
                    margin: 0,
                    textAlign: "center",
                    verticalAlign: "middle",
                    minWidth: "auto",
                    width: "100%",
                    cursor: "pointer",
                    ":-webkit-any-link": {
                      cursor: "pointer",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "#3665f3",
                      fontSize: "16px",
                      fontFamily: "inherit",
                      fontWeight: "normal",
                      textAlign: "center",

                      boxSizing: "border-box",
                      margin: 0,
                      padding: 0,
                      lineHeight: "20px",
                      letterSpacing: "normal",
                      WebkitFontSmoothing: "antialiased",
                      MozFontSmoothing: "antialiased",
                      MsFontSmoothing: "antialiased",
                      WebkitTextSizeAdjust: "none",
                      MozTextSizeAdjust: "none",
                      MsTextSizeAdjust: "none",
                      textSizeAdjust: "none",
                      verticalAlign: "middle",
                    }}
                  >
                    Ajouter au panier
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      "@keyframes spin": {
                        "0%": {
                          WebkitTransform: "rotate(0)",
                          transform: "rotate(0)",
                        },

                        "100%": {
                          WebkitTransform: "rotate(360deg)",
                          transform: "rotate(360deg)",
                        },
                      },
                      display: "none",
                      WebkitAnimation: "spin 600ms linear infinite",
                      animation: "spin 600ms linear infinite",
                      height: "30px",
                      width: "30px",
                      color: "#3665f3",
                      fontSize: "16px",
                      fontWeight: "normal",
                      textAlign: "center",

                      boxSizing: "border-box",
                      margin: 0,
                      padding: 0,
                      lineHeight: "20px",
                      letterSpacing: "normal",
                      WebkitFontSmoothing: "antialiased",
                      MozFontSmoothing: "antialiased",
                      MsFontSmoothing: "antialiased",
                      WebkitTextSizeAdjust: "none",
                      MozTextSizeAdjust: "none",
                      MsTextSizeAdjust: "none",
                      textSizeAdjust: "none",
                      verticalAlign: "middle",
                    }}
                  >
                    <CircularProgress
                      sx={{
                        "@keyframes spin": {
                          "0%": {
                            WebkitTransform: "rotate(0)",
                            transform: "rotate(0)",
                          },

                          "100%": {
                            WebkitTransform: "rotate(360deg)",
                            transform: "rotate(360deg)",
                          },
                        },
                        //  display: "none",
                        WebkitAnimation: "spin 600ms linear infinite",
                        animation: "spin 600ms linear infinite",
                        height: "30px",
                        width: "30px",
                        color: "#3665f3",
                        fontSize: "16px",
                        fontWeight: "normal",
                        textAlign: "center",

                        boxSizing: "border-box",
                        margin: 0,
                        padding: 0,
                        lineHeight: "20px",
                        letterSpacing: "normal",
                        WebkitFontSmoothing: "antialiased",
                        MozFontSmoothing: "antialiased",
                        MsFontSmoothing: "antialiased",
                        WebkitTextSizeAdjust: "none",
                        MozTextSizeAdjust: "none",
                        MsTextSizeAdjust: "none",
                        textSizeAdjust: "none",
                        verticalAlign: "middle",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
          lineHeight: "20px",

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
        }}
      >
        <Box>
          <Box>
            <Box
              sx={{
                border: 0,
                margin: 0,
                padding: "20px 0",
                borderRadius: "2px",
                backgroundColor: "#fff",
              }}
            >
              <Box
                sx={{
                  margin: "0 16px",
                }}
              >
                <Box
                  sx={{
                    lineHeight: "1.154",
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        "&:not(:last-child)": {
                          margin: "0 0 20px",
                        },
                        border: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Box component="span">
                            <Box
                              component="span"
                              sx={{
                                fontSize: "1.25rem",
                                color: "#111820",
                                fontWeight: "700",
                                lineHeight: "1.25",
                                margin: 0,
                                display: "inline-block",
                              }}
                            >
                              À propos de cet article
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              margin: "8px 0",
                              wordBreak: "break-word",
                            }}
                          >
                            {info_article_1}
                            {info_article_2}
                            {info_article_3}
                            {info_article_4}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        border: 0,
                        "&:last-child": {
                          marginBottom: 0,
                        },

                        margin: "8px 0",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          width: "100%",
                          height: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Link
                            href={`/produit/pdescdet/${encodeURIComponent(
                              selectedprd[0].imgNum
                            )}`}
                            as={`/produit/pdescdet/${selectedprd[0].imgNum}`}
                          >
                            <Box
                              component="a"
                              sx={{
                                // padding: "8px",
                                alignItems: "center",
                                display: "flex",
                                color: "inherit",
                                textDecoration: "none",
                                backgroundColor: "transparent",
                                outline: 0,
                                cursor: "pointer",
                                ":-webkit-any-link": {
                                  cursor: "pointer",
                                },
                                fontSize: ".875rem",
                              }}
                            >
                              <Box
                                component="span"
                                aria-hidden="true"
                                tabIndex="-1"
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    fontSize: "1.25rem",
                                    color: "#111820",
                                    fontWeight: 700,
                                    lineHeight: "1.25",
                                    margin: 0,
                                    display: "inline-block",
                                  }}
                                >
                                  Description de l&rsquo;article
                                </Box>
                              </Box>
                              <CustChevronRightIcon
                                sx={{
                                  marginLeft: "auto",
                                  flexShrink: 0,
                                  fill: "#282828",
                                }}
                              />
                            </Box>
                          </Link>
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
                          ></Box>
                          <Box
                            sx={{
                              margin: "8px 0",
                              wordBreak: "break-word",
                            }}
                          >
                            <Box
                              sx={{
                                "&:not(:last-child)": {
                                  margin: "0 0 8px",
                                  display: "block",
                                },

                                wordBreak: "break-word",
                              }}
                            >
                              <Box
                                sx={{
                                  wordBreak: "break-word",
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    color: "var(--color-text-primary,#111820)",
                                    fontSize: ".875rem",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  Lecteur optique : Graveur DVD. Réseau :
                                  Integrated Realtek LOM + Clé USB Wifi. - 1 x
                                  HDMI. MonsieurCyberMan Reprend &amp; Répare
<<<<<<< HEAD
                                  Vos Vieux PC : 56350 Béganne - France. Les
=======
                                  Vos Vieux PC :-. 56350 Béganne - France. Les
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
                                  Fosses Rouges. Nos coordonnées.
                                </Box>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                              }}
                            >
                              <Box>
                                <Link
                                  href={`/produit/pdescdet/${encodeURIComponent(
                                    selectedprd[0].imgNum
                                  )}`}
                                  as={`/produit/pdescdet/${selectedprd[0].imgNum}`}
                                >
                                  <Box
                                    component="a"
                                    // onClick={handleClick}
                                    //  onTouchEnd={handleTouchEnd}
                                    sx={{
                                      textDecoration: "underline",
                                      color: "#3665f3",
                                      cursor: "initial",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    <Box
                                      component="span"
                                      aria-hidden="true"
                                      tabIndex="-1"
                                      sx={{
                                        fontSize: ".875rem",
                                      }}
                                    >
                                      <Box
                                        component="span"
                                        aria-hidden="true"
                                        tabIndex="-1"
                                        sx={{
                                          color: "#3665f3",
                                          textDecoration: "underline",
                                          wordBreak: "break-word",
                                          fontSize: ".875rem",
                                        }}
                                      >
                                        Voir la description complète
                                      </Box>
                                    </Box>
                                  </Box>
                                </Link>
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
      <Box>
        <Box>
          <Box>
            <Box>
              <Box>
                <Box
                  sx={{
                    margin: "0 16px",
                    paddingBottom: "20px",
                  }}
                >
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      margin: "30px 0 10px",
                      fontSize: ".875rem",
                      color: "var(--color-text-primary,#111820)",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "100%",
                      }}
                    >
                      <Box
                        component="h2"
                        sx={{
                          color: "#111820",
                          fontSize: "20px",
                          fontWeight: 700,
                          lineHeight: "28px",
                          margin: 0,
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "#111820",
                            fontSize: "20px",
                            fontWeight: 700,
                            lineHeight: "28px",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              color: "#111820",
                              fontSize: "20px",
                              fontWeight: 700,
                              lineHeight: "28px",
                            }}
                          >
                            Livraison, retours et paiements
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      "&:last-child": {
                        marginBottom: 0,
                        border: 0,
                      },

                      margin: "8px 0",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        height: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <Box>
                          {info_livraison}
                          {info_retours}
                          {info_paiements}
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
};

export default ProdViewXs;
