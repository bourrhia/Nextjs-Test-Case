import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import Typography from "@mui/material/Typography";
//
import Getcattitle from "./Getcattitle";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const Prdlistupmd2 = ({ imgmrv }) => {
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

    // draggable: true,

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
      component="li"
      key={image.imgNum}
      sx={{
        width: "198px",
        display: "inline-block",
        listStyle: "none",
        wordWrap: "break-word",
        height: "100%",
        maxWidth: "297px",
        minWidth: "198px",
        float: "left",
        textAlign: "left",
        position: "relative",
        padding: "0 2px 0 0 !important",
        margin: "0 !important",

        //

        scrollSnapAlign: "start",
      }}
    >
      <Box
        component="span"
        sx={{
          color: "#0F1111",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#FFF",
            marginBottom: "0!important",
          }}
        >
          <Box
            component="a"
            sx={{
              cursor: "pointer",

              textDecoration: "none",

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
                margin: "0px",
                backgroundColor: "#FFF",
                height: "250px",
              }}
            >
              <Box
                sx={{
                  margin: "10px auto 10px auto",
                  width: "180px",
                  maxHeight: "230px",
                  verticalAlign: "top",
                  maxWidth: "100%",
                  border: 0,
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
    </Box>
  ));

  return (
    <Box
      sx={{
        marginBottom: 0,
        margin: "40px 0px",
        minWidth: "794px",
        maxWidth: "2573px",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          marginBottom: "0 !important",
        }}
      >
        <Getcattitle />
      </Box>
      <Box
        sx={{
          marginBottom: 0,
          marginTop: "10px",
        }}
      >
        <Box
          component="ul"
          sx={{
            display: "block",
            marginLeft: 0,
            color: "#0F1111",
            // height: "384px",
            overflow: "hidden",
            marginBottom: "0 !important",
            padding: 0,

            margin: "0 0 0 18px",

            "&::before,&::after": {
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
          <Slider ref={slider} {...sliderSettings}>
            {renderedImg}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
};

export default Prdlistupmd2;
