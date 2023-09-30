import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
//
import Getcattitle from "./Getcattitle";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Prdlistupmd3 = ({ imgmrv }) => {
  const slider = useRef(null);
  const [displayRightArrow, setdisplayRightArrow] = useState(true);
  const [displayLeftArrow, setdisplayLeftArrow] = useState(false);

  const slidesToShow = 6;

  const setArrowDisplay = (currentSlide) => {
    const LeftArrow = currentSlide !== 0;
    const RightArrow = currentSlide < imgmrv.length - slidesToShow;

    setdisplayRightArrow(RightArrow);
    setdisplayLeftArrow(LeftArrow);
  };

  const clickHandler = (direction) => {
    if (direction === "left") {
      slider.current.slickPrev();
    } else if (direction === "right") {
      slider.current.slickNext();
    }
  };

  function NextArrow(props) {
    const { className, onClick, styleClassName } = props;
    return (
      <Box
        className={className}
        style={{ ...styleClassName }}
        onClick={onClick}
      >
        <Box
          component="svg"
          width="14.6"
          height="24"
          viewBox="0 0 16 27"
          xmlns="http://www.w3.org/2000/svg"
          // className={classes.nextArrow1}
          sx={{
            transform: "rotate(180deg)",
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
            color: "#212121",
            overflow: "hidden",
          }}
        >
          <Box
            component="path"
            d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z"
            // className={classes.nextArrow2}
            sx={{
              fill: "#212121",
              transformOrigin: "0px 0px",
              color: "#212121",
            }}
          ></Box>
        </Box>
      </Box>
    );
  }

  function PrevArrow(props) {
    const { className, onClick, styleClassName } = props;
    return (
      <Box
        className={className}
        style={{ ...styleClassName }}
        onClick={onClick}
      >
        <Box
          component="svg"
          width="14.6"
          height="24"
          viewBox="0 0 16 27"
          xmlns="http://www.w3.org/2000/svg"
          // className={classes.prevArrow}
          sx={{
            boxSizing: "border-box",
            margin: 0,
            padding: 0,
            color: "#212121",
            overflow: "hidden",
          }}
        >
          <path d="M16 23.207L6.11 13.161 16 3.093 12.955 0 0 13.161l12.955 13.161z" />
        </Box>
      </Box>
    );
  }

  const prdCarouselLeft = {
    left: 0,

    borderRadius: "4px 0 0 4px",
    display: "flex",
    position: "absolute",
    alignSelf: "center",
    padding: "40px 15px 40px 5px",

    boxShadow: "1px 2px 10px -1px rgba(0,0,0,.3)",
    backgroundColor: "hsla(0,0%,100%,.98)",
    cursor: "pointer",
    boxSizing: "border-box",
    width: 50,
    alignItems: "center",
    zIndex: 100,
  };

  const prdCarouselLeftHide = {
    display: "none",
  };

  const prdCarouselRight = {
    right: 0,

    borderRadius: "4px 0 0 4px",
    display: "flex",
    position: "absolute",
    alignSelf: "center",
    padding: "40px 15px 40px 5px",

    boxShadow: "1px 2px 10px -1px rgba(0,0,0,.3)",
    backgroundColor: "hsla(0,0%,100%,.98)",
    cursor: "pointer",
    boxSizing: "border-box",
    margin: 0,
    width: 50,
    alignItems: "center",
    zIndex: 100,
  };

  const prdCarouselRightHide = {
    display: "none",
  };

  const sliderSettings = {
    dots: false,
    // arrows: true,
    infinite: false,
    initialSlide: 0,
    slidesToShow: slidesToShow,
    // slidesToShow: 5,
    //slidesToScroll: 1,
    slidesToScroll: slidesToShow,
    speed: 500,
    rows: 1,

    prevArrow: (
      <PrevArrow
        onClick={clickHandler}
        styleClassName={
          displayLeftArrow ? prdCarouselLeft : prdCarouselLeftHide
        }
      />
    ),
    nextArrow: (
      <NextArrow
        onClick={clickHandler}
        styleClassName={
          displayRightArrow ? prdCarouselRight : prdCarouselRightHide
        }
      />
    ),
    // arrows: false,

    afterChange: (currentSlide) => {
      setArrowDisplay(currentSlide);
    },
    /////
    // arrows: true,
    //  infinite: true,
    // centerMode: true,
    //speed: 100,
    //variableWidth: true,
    //swipeToSlide: true,

    /////
    responsive: [
      {
        breakpoint: 1083,
        settings: {
          dots: false,
          infinite: false,
          initialSlide: 0,
          slidesToShow: 5,
          slidesToScroll: 5,
          speed: 500,
          rows: 1,
        },
      },

      {
        breakpoint: 960,
        settings: {
          dots: false,
          infinite: false,
          initialSlide: 0,
          slidesToShow: 4,
          slidesToScroll: 4,
          speed: 500,
          rows: 1,
        },
      },

      {
        breakpoint: 768,
        settings: {
          dots: false,
          infinite: false,
          initialSlide: 0,
          slidesToShow: 3,
          slidesToScroll: 3,
          speed: 500,
          rows: 1,
        },
      },
    ],
  };

  const renderedImg = imgmrv.map((image) => (
    <Box
      key={image.imgNum}
      sx={{
        // width: "195px",
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
        //
        // marginRight: "16px",
        //
        display: "-webkit-flex",
        display: "-ms-flexbox",
        display: "flex",
        WebkitFlexDirection: "column",
        MsFlexDirection: "column",
        flexDirection: "column",
      }}
    >
      <Box>
        <Box
          component="a"
          sx={{
            // padding: "25px 15px",
            padding: "20px 10px",
            //
            /*  marginLeft: "3px",
            marginTop: "3px",
            padding: "1px",*/
            //
            display: "inline-block",
            verticalAlign: "top",
            width: "100%",
            maxHeight: "366px",
            // maxHeight: "100%",
            textAlign: "center",
            textDecoration: "none",
            color: "inherit",
            border: "none",
            outline: "none",

            cursor: "pointer",
            ":-webkit-any-link": {
              cursor: "pointer",
            },
          }}
        >
          <Box
            sx={{
              // height: "150px",
              height: "100%",
            }}
          >
            <Box
              sx={{
                //  height: "150px",
                height: "100%",
                //  width: "150px",
                width: "100%",

                position: "relative",
                margin: "0 auto",
              }}
            >
              <Image
                src={image.imgJpg}
                alt="Image meilleure vente"
                layout="responsive"
                width="100%"
                height="100%"
                // layout="fill"
                //className={styles.styleimg}
                //
                /*sx={{
                
              }}*/
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ));

  return (
    <Box
      sx={{
        // padding: "0px 0px 10px",
        display: "block",
        width: "100%",
      }}
    >
      <Box
        sx={{
          // borderTop: "1px solid #eaeaea",
          height: "100%",
          backgroundColor: "#fff",
          // borderRadius: "2px",
          //  boxShadow: "0 2px 4px 0 rgb(0 0 0 / 8%)",
        }}
      >
        <Box
          sx={
            {
              // padding: "15px 20px",
              // borderBottom: "1px solid rgba(0,0,0,.1)",
            }
          }
        >
          <Box>
            <Getcattitle />
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              overflow: "hidden",
              width: "100%",
              display: "-webkit-flex",
              display: "-ms-flexbox",
              display: "flex",
              WebkitFlexDirection: "row",
              MsFlexDirection: "row",
              flexDirection: "row",
              WebkitFlex: "none",
              MsFlex: "none",
              flex: "none",
              position: "relative",
            }}
          >
            <Box
              sx={{
                overflowX: "hidden",
                // overflowX: "scroll",
                paddingBottom: "64px",
                marginBottom: "-64px",
                width: "100%",
                display: "-webkit-flex",
                display: "-ms-flexbox",
                display: "flex",
                WebkitFlexDirection: "row",
                MsFlexDirection: "row",
                flexDirection: "row",
                WebkitFlex: "none",
                MsFlex: "none",
                flex: "none",

                //////

                /* overflowX: "auto",
                overflowY: "hidden",

                scrollBehavior: "smooth",
                scrollSnapType: "x proximity",
                MsScrollSnapType: "x proximity",*/
              }}
            >
              <Box
                sx={{
                  //width: "1570px",
                  width: "100%",
                  WebkitFlex: "none",
                  MsFlex: "none",
                  flex: "none",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    transform: "translateX(0px)",
                    transition: "-webkit-transform .4s ease-in-out",
                    transition: "transform .4s ease-in-out",
                    transition:
                      "transform .4s ease-in-out,-webkit-transform .4s ease-in-out",
                    display: "-webkit-flex",
                    display: "-ms-flexbox",
                    //display: "flex",
                    WebkitFlexDirection: "row",
                    MsFlexDirection: "row",
                    flexDirection: "row",
                    WebkitAlignItems: "stretch",
                    MsFlexAlign: "stretch",
                    alignItems: "stretch",

                    ////
                  }}
                >
                  <Slider ref={slider} {...sliderSettings}>
                    {renderedImg}
                  </Slider>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Prdlistupmd3;
