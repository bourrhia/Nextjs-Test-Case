import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import SvgIcon from "@mui/material/SvgIcon";
import CloseIcon from "@mui/icons-material/Close";

const DialogCheckout = ({
  open,
  onClose,
  handleNavSignIn,
  clickCheckoutNoInsc,
  isLoading,
  isNavCheckout,
  isNavSignIn,
}) => {
  function CustCloseIcon(props) {
    return (
      <SvgIcon {...props}>
        <CloseIcon />
      </SvgIcon>
    );
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
      /* BackdropComponent={Backdrop}
        BackdropProps={{
          onClick: handleCloseDialogCheckout,
          style: {
            // background: "rgba(15, 17, 17,0.1)",
            background: "rgba(17,24,32,.7)",
          },
        }}*/
      position="fixed"
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            backgroundColor: "rgba(17,24,32,.7)",
            bottom: 0,
            left: 0,
            overflowY: "auto",
            //position: "fixed",
            right: 0,
            top: 0,
            willChange: "background-color",
            zIndex: 100000,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: "396px",
              borderRadius: 0,

              "@media screen and (min-width: 769px)": {
                maxWidth: "616px",
              },

              backgroundColor: "#fff",
              display: "flex",
              flex: "1 0 auto",
              flexDirection: "column",
              minHeight: "55px",
              willChange: "opacity,transform",
              // marginTop: "15vh",
            }}
          >
            <Box
              sx={{
                paddingBottom: "10px",
                justifyContent: "right",
                display: "flex",
                flexShrink: 0,
                margin: "16px 16px 0",
                position: "relative",
              }}
            >
              <Box
                component="button"
                onClick={handleCloseDialogCheckout}
                sx={{
                  width: "25px",
                  height: "25px",
                  cursor: "pointer",
                  display: "inline-block",
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  border: 0,
                  minWidth: "32px",
                  position: "relative",
                  zIndex: 1,

                  "&:not(:focus-visible)": {
                    outline: 0,
                  },

                  borderRadius: "50%",
                  boxSizing: "border-box",
                  margin: 0,
                  padding: 0,
                  verticalAlign: "text-bottom",
                }}
              >
                <CustCloseIcon
                  sx={{
                    maxWidth: "75%",
                    position: "relative",
                    //height: "14px",
                    // width: "14px",
                    display: "inline-block",
                    pointerEvents: "none",
                    stroke: "currentColor",
                    strokeWidth: 0,
                    verticalAlign: "middle",
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                margin: 0,
                boxSizing: "border-box",
                flex: "1 1 auto",
                position: "relative",
                minHeight: "18px",
              }}
            >
              <Box
                sx={{
                  "&:last-child": {
                    marginBottom: 0,
                  },

                  "&:first-child": {
                    marginTop: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "364px",
                    // padding: "16px 16px",
                  }}
                >
                  <Box
                    sx={{
                      marginTop: "28px",
                    }}
                  >
                    <Box>
                      <Box
                        //component="a"
                        component="button"
                        onClick={handleNavSignIn}
                        disabled={isLoading || isNavCheckout || isNavSignIn}
                        sx={{
                          //backgroundColor: "#3665f3",
                          backgroundColor: "#FFD814",
                          fontSize: "1rem",
                          width: "364px",
                          borderRadius: "3px",
                          height: "48px",
                          lineHeight: 1.563,
                          fontWeight: "400 !important",

                          //color: "#fff",
                          color: "#0F1111",
                          padding: "9px 0",
                          border: "1px solid #0053a0",
                          outlineColor: "#0053a0",
                          boxSizing: "border-box",
                          margin: 0,
                          textAlign: "center",
                          textDecoration: "none",
                          verticalAlign: "bottom",

                          display: "inline-block",
                          minHeight: "40px",
                          minWidth: "88px",

                          cursor: "pointer",
                          "a:-webkit-any-link": {
                            cursor: "pointer",
                          },

                          maxWidth: "364px !important",
                          /*":root": {
                              "--bubble-filter":
                                "drop-shadow(0 2px 7px rgba(0,0,0,0.15)) drop-shadow(0 5px 17px rgba(0,0,0,0.2))",
                            },
                            filter: "var(--bubble-filter)",*/
                          /////

                          // backgroundColor: "transparent",
                          // border: "none",
                          // outline: 0,
                          borderColor: "#FCD200",
                          borderRadius: "8px",
                          boxShadow: "0 2px 5px 0 rgb(213 217 217 / 50%)",
                          fontWeight: "bold",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            display: "block",
                            maxWidth: "90%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              fontWeight: 400,
                            }}
                          >
                            Se connecter pour finaliser l&rsquo;achat
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        marginTop: "16px",
                      }}
                    >
                      <Box
                        //component="a"
                        component="button"
                        onClick={clickCheckoutNoInsc}
                        disabled={isLoading || isNavCheckout || isNavSignIn}
                        sx={{
                          borderColor: "#c7c7c7",
                          color: "#006efc !important",
                          backgroundColor: "#fff !important",
                          fontSize: "1rem",
                          width: "364px",
                          borderRadius: "3px",
                          height: "48px",
                          lineHeight: 1.563,
                          fontWeight: "400 !important",

                          border: "1px solid",
                          boxSizing: "border-box",
                          margin: 0,
                          textAlign: "center",
                          textDecoration: "none",
                          verticalAlign: "bottom",

                          display: "inline-block",
                          minHeight: "40px",
                          minWidth: "88px",
                          padding: "9.5px 20px",
                          cursor: "pointer",
                          "a:-webkit-any-link": {
                            cursor: "pointer",
                          },
                          //
                          maxWidth: "364px !important",
                          //
                          //  backgroundColor: "transparent",
                          // border: "none",
                          // outline: 0,
                          // textAlign: "center!important",
                          // width: "100%!important",
                        }}
                      >
                        <Box
                          component="span"
                          sx={
                            {
                              /* display: 'block',
                            maxWidth: '90%',
                             overflow: 'hidden',
                             textOverflow: 'ellipsis',
                             whiteSpace: 'nowrap', */
                            }
                          }
                        >
                          <Box
                            component="span"
                            sx={{
                              fontWeight: 400,
                            }}
                          >
                            Finaliser l&rsquo;achat sans être inscrit
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
      </DialogContent>
    </Dialog>
  );
};

export default DialogCheckout;
