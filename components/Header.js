//import * as React from "react";
import React, {
  useState,
  useEffect,
  useRef,
  // forwardRef,
  //useCallback,
  //  Suspense,
} from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";

import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { styled, alpha } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WomanIcon from "@mui/icons-material/Woman";
import ManIcon from "@mui/icons-material/Man";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import BoyIcon from "@mui/icons-material/Boy";
import SpaIcon from "@mui/icons-material/Spa";
import LuggageIcon from "@mui/icons-material/Luggage";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CelebrationIcon from "@mui/icons-material/Celebration";
import DevicesIcon from "@mui/icons-material/Devices";
import HouseIcon from "@mui/icons-material/House";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Image from "next/image";

import Badge, { BadgeProps } from "@mui/material/Badge";
import { useSelector } from "react-redux";
import { signOut, useSession } from "next-auth/react";
import Logout from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/router";
import { products } from "../data/product";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { useGetAllProductsQuery } from "../redux/features/api/apiSlice";
import { useGetProductsBySearchQuery } from "../redux/features/api/apiSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Fuse from "fuse.js";
import CircularProgress from "@mui/material/CircularProgress";
import useSearchTerm from "../hooks/useSearchTerm";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const drawermenu = [
  {
    id: "1",
    title: "Tendences",
    href: "/tendences",
    icon: <ShoppingBasketIcon />,
  },
  {
    id: "2",
    title: "Ventes Flash",
    href: "/ventesflash",
    icon: <MonetizationOnIcon />,
  },
  {
    id: "3",
    title: "Femmes",
    href: "/femmes",
    icon: <WomanIcon />,
  },

  {
    id: "4",
    title: "Hommes",
    href: "/hommes",
    icon: <ManIcon />,
  },

  {
    id: "5",
    title: "Enfants",
    href: "/enfants",
    icon: <BoyIcon />,
  },

  {
    id: "6",
    title: "Bébés",
    href: "/enfants",
    icon: <ChildFriendlyIcon />,
  },

  {
    id: "7",
    title: "Hotels & Vacances",
    href: "/vacances",
    icon: <LuggageIcon />,
  },
  {
    id: "8",
    title: "Restaurants",
    href: "/restaurants",
    icon: <RestaurantIcon />,
  },
  {
    id: "9",
    title: "Bien Être",
    href: "/bienetre",
    icon: <SpaIcon />,
  },
  {
    id: "10",
    title: "Mariages & Fêtes",
    href: "/mariages",
    icon: <CelebrationIcon />,
  },
  {
    id: "11",
    title: "High-Tech",
    href: "/hightech",
    icon: <DevicesIcon />,
  },
  {
    id: "12",
    title: "Maisons & Jardins",
    href: "/maisons",
    icon: <HouseIcon />,
  },
];

const drawerWidth = 240;

const StyledSearchIcon = styled("div")({
  "@keyframes animate-search-icon": {
    "0%": {
      opacity: 0,
    },

    "50%": {
      opacity: ".1",
    },

    "75%": {
      opacity: ".5",
    },

    "100%": {
      opacity: 1,
    },
  },
  position: "absolute",
  left: "12px",
  width: "24px",
  height: "24px",
  top: "7px",

  fill: "#767676",
  verticalAlign: "middle",
  animationName: "animate-search-icon",
  animationDuration: ".15s",
});

const StyledBadge = styled(Badge)(
  //<
  // BadgeProps >
  ({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",

      //
      /* right: "-4px",
      padding: "3px 4px",
      margin: "auto",
      minWidth: "8px",
      borderRadius: "13px",
      textAlign: "center",
      background: "#c9002c",
      display: "inline-block",
      position: "absolute",
      top: "-3px",
      zIndex: 2,
      font: "bold 11px Arial",
      color: "#fff",
      border: "1px solid #fff",*/
      //
      border: `2px solid ${theme.palette.background.paper}`,
      right: 8,
      top: 9,
      padding: "3px 4px",
      background: "#c9002c",
      font: "bold 11px Arial",
      color: "#fff",
    },
  })
);

function Header(props) {
  const { window } = props;
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  ////////////////// ADD inside ul////////////////////////////

  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isNavOpenCart, setIsNavOpenCart] = useState(false);
  const [isOnClickSignIn, setIsOnClickSignIn] = useState(false);
  const [isOnClickSignUp, setIsOnClickSignUp] = useState(false);

  const menuListRef = useRef(null);

  const fuzzySearchSchema = yup.object().shape({
    searchInput: yup
      .string("Le mot à rechercher doit être une chaîne de caractères")
      //.max(25, "Le prénom a un maximum de 25 caractères")
      //.required("Veuillez saisir votre mot a rechercher")
      .nullable(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(fuzzySearchSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  const handleClickAway = () => {
    setMenuOpen(false);
  };

  const {
    data: allProducts,
    // isFetching: allProductFetching,
    isLoading: allProductLoading,
    isSuccess: allProductSuccess,
    isError: allProductIsError,
    error: allProductError,
  } = useGetAllProductsQuery();

  const watchSearchInput = watch("searchInput");

  const {
    data: searchProducts,
    // isFetching: allProductFetching,
    isLoading: searchProductsLoading,
    isSuccess: searchProductsSuccess,
    isError: searchProductsIsError,
    error: searchProductsError,
  } = useGetProductsBySearchQuery(watchSearchInput);

  const handleNavSearchResults = async (searchPrdts) => {
    try {
      // console.log("searchPrdts : ", searchPrdts);
      await router.push({
        pathname: "/fuzzySearch/searchResults", // Replace with the actual page path
        query: { allSearchProducts: JSON.stringify(searchPrdts) },
        // query: { allSearchProducts: searchPrdts }, // Pass search results as a query parameter
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setisNavResetPswd(false);
    }
  };

  ///////////////  ADD  /////////////////////////////

  const storedSearchTerm = localStorage.getItem("searchTerm");
  const isSpecificPage = router.pathname === "/fuzzySearch/searchResults";
  useEffect(() => {
    if (isSpecificPage) {
      if (storedSearchTerm) {
        setValue("searchInput", storedSearchTerm); // Set the input field value

        //  setSearchTerm(storedSearchTerm);
      } else {
        setValue("searchInput", ""); // Set the input field value to null or an empty string

        // setSearchTerm(""); // Update searchTerm state to null or an empty string
        localStorage.removeItem("searchTerm");
      }
    }

    const handlePopState = () => {
      if (!isSpecificPage) {
        //  setSearchTerm(""); // Update searchTerm state to null or an empty string
        setValue("searchInput", ""); // Set the input field value to null or an empty string

        localStorage.removeItem("searchTerm");
      }
    };

    document.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("popstate", handlePopState);
    };
  }, [storedSearchTerm]);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLoading(true);
    };
    const handleRouteChange = () => {
      if (!isSpecificPage) {
        // setSearchTerm(""); // Update searchTerm state to null or an empty string
        setValue("searchInput", "");
        // setMenuOpen(false);
        localStorage.removeItem("searchTerm");
      } else {
        //  setSearchTerm(storedSearchTerm);
        setValue("searchInput", storedSearchTerm);
        // setMenuOpen(false);
      }
      // handleClickAway();
      setIsLoading(false);
    };

    // Add a listener to watch for route changes
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeStart", handleRouteChangeStart);

    // Clean up the listener when the component unmounts
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.pathname]);

  //////////////////////// END ADD /////////////////////////////////////////////

  const onSubmit = async (data, event) => {
    event.preventDefault();

    let searchTermInput = data.searchInput;

    setSearchTerm(searchTermInput);
    setMenuOpen(false);

    const canSearch = [searchTermInput].every(Boolean);
    if (canSearch) {
      setIsSearching(true);
      try {
        if (searchProductsSuccess && !searchProductsIsError) {
          if (searchProducts) {
            await handleNavSearchResults(searchProducts);
          }
        }
      } catch (err) {
        console.error("Un probleme est survenu pour rechercher: ", err);
      } finally {
        setIsSearching(false);
        handleClickAway();
      }
    }
  };

  useEffect(() => {
    // if (searchTerm.trim() === "") {
    if (!searchTerm || searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    setMenuOpen(true);

    /*const options = {
          keys: [
            { name: "firstLetter", weight: 0.8 }, // Add weight to prioritize firstLetter
            "productName",
          ],
          includeScore: true,
          threshold: 0.2, // Adjust the threshold for matching
        };
    
         // Create a new array with a 'firstLetter' field based on your data
        const dataWithFirstLetter = allProducts.map((item) => ({
          ...item,
          firstLetter: item.productName.charAt(0).toUpperCase(),
        }));
    
        const fuse = new Fuse(dataWithFirstLetter, options);
    
        const fuzzyResults = fuse.search(searchTerm);
        const allSearchResults = fuzzyResults.map((result) => result.item);
    
        setSearchResults(allSearchResults);*/

    ///////////////////////////////////////////////////////

    const options = {
      keys: ["productName"], // Specify the keys you want to search on
      includeScore: true,
    };
    const fuse = new Fuse(allProducts, options);

    //const filterResults = (searchTerm) => {
    //  const regex = new RegExp(`^${searchTerm}`, "i"); // 'i' for case-insensitive matching
    //  const filteredData = allProducts.filter((item) =>
    //   regex.test(item.productName)
    //  );
    // return filteredData;
    // };

    const filterResults = (searchTerm) => {
      // Check if fuse is properly initialized and allProducts data is available
      if (!fuse || !allProducts || allProducts.length === 0) {
        return []; // Return an empty array when data is missing or fuse is not initialized
      }
      // Check if searchTerm is undefined or an empty string
      if (!searchTerm || searchTerm.trim() === "") {
        return []; // Return an empty array when searchTerm is invalid
      }
      const results = fuse.search(searchTerm);

      // Filter the results to include only items where the name starts with the search term
      const filteredResults = results.filter((result) =>
        result.item.productName.startsWith(searchTerm)
      );

      return filteredResults.map((result) => result.item);
    };

    const allSearchResults = filterResults(searchTerm);
    setSearchResults(allSearchResults);
    //
    // setSelectedIndex(null);
  }, [searchTerm]);

  // Function to remove duplicates
  const removeDuplicates = (results) => {
    const seen = new Set();
    return results.filter((result) => {
      if (!seen.has(result.productName)) {
        seen.add(result.productName);
        return true;
      }
      return false;
    });
  };

  const uniqueSearchResults = removeDuplicates(searchResults);

  const handleMouseEnter = (index) => {
    const selectedResults = searchResults[index];

    // setValue("searchInput", selectedResults.productName);
    // setSelectedIndex(index);
    menuListRef.current.children[index].focus();
  };

  ///////////////////////////////////////////////////

  const handleListItemClick = (index) => {
    // setSelectedResultIndex(index);
    // setSelectedIndex(index);
    const selectedResults = uniqueSearchResults[index];

    setValue("searchInput", selectedResults.productName);
    // setValue('searchTerm', options[index]);
  };

  const handleNavHome = async () => {
    // setIsNavHome(true);

    try {
      await router.push({
        pathname: "/",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      // setIsNavHome(false);
    }
  };

  const handleOpenCart = async (e) => {
    e.preventDefault();
    setIsNavOpenCart(true);

    try {
      await router.push({
        pathname: "/cart",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsNavOpenCart(false);
    }
  };

  const handleOnClickSignIn = async (e) => {
    e.preventDefault();
    setIsOnClickSignIn(true);
    try {
      await router.push({
        pathname: "/auth/authForm",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsOnClickSignIn(false);
    }
  };

  const handleOnClickSignUp = async (e) => {
    e.preventDefault();
    setIsOnClickSignUp(true);

    try {
      await router.push({
        pathname: "/auth/signup",
      });
    } catch (error) {
      // Handle any errors that might occur during navigation
    } finally {
      setIsOnClickSignUp(false);
    }
  };

  const handleListKeyDown = (event) => {
    console.log("Vendredi  event.key :", event.key);
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuOpen(false);
    } else if (event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  const handleResultArrowKeyPress = (e, index) => {
    if (e.key === "ArrowUp") {
      if (index > 0) {
        // Set the value before changing the selectedResultIndex
        setValue("searchInput", uniqueSearchResults[index - 1].productName);
        // setSelectedResultIndex(index - 1);
      } else {
        // If at the first item, set the value to the last item
        setValue(
          "searchInput",
          uniqueSearchResults[uniqueSearchResults.length - 1].productName
        );
        // setSelectedResultIndex(searchResults.length - 1);
      }
    } else if (
      e.key === "ArrowDown" &&
      index < uniqueSearchResults.length - 1
    ) {
      // Set the value before changing the selectedResultIndex
      setValue("searchInput", uniqueSearchResults[index + 1].productName);
      //setSelectedResultIndex(index + 1);
    } else if (
      e.key === "ArrowDown" &&
      index === uniqueSearchResults.length - 1
    ) {
      // If at the last item, wrap around to the first item
      setValue("searchInput", uniqueSearchResults[0].productName);
      //  setSelectedResultIndex(0);
    } else if (e.key === "Enter" && index >= 0) {
      // Select the result on Enter key press
      const selectedResults = uniqueSearchResults[index];

      setValue("searchInput", selectedResults.productName); // Update the input value
      //  setSelectedResultIndex(-1); // Reset selection
    }
  };

  //////////////////////////////////////////////////////

  const cart = useSelector((state) => state.cart.products);

  // Getting the count of items
  const getItemsCount = () => {
    return cart.reduce((accumulator, item) => accumulator + item.prodQtee, 0);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Add session infos

  const { data: session } = useSession();

  ///////////

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async (event) => {
    event.preventDefault();

    await signOut({ redirect: false });
  };

  ///////////

  const drawer = (
    <div>
      <Box
        sx={(theme) => ({
          // necessary for content to be below app bar
          ...theme.mixins.toolbar,
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(0, 1),
          justifyContent: "flex-end",
        })}
      >
        <IconButton
          color="inherit"
          aria-label="close drawer"
          // edge="close"
          onClick={handleDrawerToggle}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Divider />
      <List>
        {drawermenu.map((menuitem) => (
          <ListItem button key={menuitem.id}>
            <ListItemIcon>{menuitem.icon}</ListItemIcon>
            <ListItemText primary={menuitem.title} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const headerxs = (
    <Box>
      <Box
        component="header"
        sx={{
          minHeight: "48px",
          boxSizing: "border-box",
          backgroundColor: "#fff",
          display: "flex",
          webkitBoxPack: "justify",
          justifyContent: "space-between",
          webkitBoxAlign: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            // minWidth: "66px",
            minWidth: "90px",
            webkitBoxOrdinalGroup: 2,
            order: 1,
            paddingLeft: "16px",
          }}
        >
          <Box
            component="span"
            sx={{
              margin: 0,
              //  fontWeight: "normal",
              // fontSize: "14px",
            }}
          >
            <Box
              component="a"
              sx={{
                ":link": {
                  textDecoration: "none",
                  color: "#111820",
                },
                ":focus": {
                  textDecoration: "none",
                  color: "#111820",
                },
                ":visited": {
                  textDecoration: "none",
                  color: "#111820",
                },

                position: "relative",
                display: "block",
                height: "27px",
                width: "90px",
                whiteSpace: "nowrap",
                //text-indent: '-9999px',

                ":-webkit-any-link": {
                  cursor: "pointer",
                },
              }}
            >
              <Image
                src="/logodimapromo.svg"
                alt="logo"
                //   width="90px"
                //  height="27px"
                layout="fill"
                priority
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            webkitBoxOrdinalGroup: 3,
            order: 2,
          }}
        ></Box>
        <Box
          sx={{
            minWidth: "66px",
            webkitBoxOrdinalGroup: 4,
            order: 3,
          }}
        >
          <Box
            component="a"
            sx={{
              display: "inline-block",
              verticalAlign: "middle",
              padding: "14px 16px",
              // padding: "14px 8px",

              "@media (min-width:210px) and (max-width: 270px)": {
                padding: "14px 4px",
              },
              "@media (max-width: 209px)": {
                padding: "14px 0px",
              },

              ":link": {
                textDecoration: "none",
                color: "#111820",
              },
              ":focus": {
                textDecoration: "none",
                color: "#111820",
              },
              ":visited": {
                textDecoration: "none",
                color: "#111820",
                position: "relative",
              },
              ":WebkitAnyLink": {
                cursor: "pointer",
              },
            }}
          >
            {/* <Box
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
              Mon&nbsp;compte
            </Box>*/}

            <PermIdentityIcon
              sx={{
                pointerEvents: "none",
                display: "inline-block",
                verticalAlign: "middle",
              }}
              aria-hidden="true"
              focusable="false"
            />
          </Box>

          <Box
            component="a"
            sx={{
              display: "inline-block",
              verticalAlign: "middle",
              padding: "14px 15px",
              // padding: "14px 8px",

              "@media (min-width:210px) and (max-width: 270px)": {
                padding: "14px 4px",
              },
              "@media (max-width: 209px)": {
                padding: "14px 0px",
              },

              ":link": {
                textDecoration: "none",
                color: "#111820",
              },
              ":focus": {
                textDecoration: "none",
                color: "#111820",
              },
              ":visited": {
                textDecoration: "none",
                color: "#111820",
                position: "relative",
              },
              ":webkitAnyLink": {
                cursor: "pointer",
              },
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{
                pointerEvents: "none",
                display: "inline-block",
                fill: "currentColor",
                stroke: "currentColor",
                strokeWidth: 0,
                verticalAlign: "middle",
              }}
              aria-hidden="true"
              focusable="false"
            />

            <Box
              component="span"
              aria-live="polite"
              aria-label="Votre panier est vide"
            ></Box>
          </Box>
          <Box
            component="button"
            sx={{
              background: "transparent",
              border: 0,
              position: "relative",
              margin: 0,
              verticalAlign: "middle",
              display: "initial !important",
              color: "#111820",
              padding: "18px 16px",
              // padding: "18px 8px",
              "@media (min-width:210px) and (max-width: 270px)": {
                padding: "14px 4px",
              },
              "@media (max-width: 209px)": {
                padding: "14px 0px",
              },
              appearance: "auto",
              webkitWritingMode: "horizontal-tb !important",
              textRendering: "auto",
              letterSpacing: "normal",
              wordSpacing: "normal",
              textTransform: "none",
              textIndent: "0px",
              textShadow: "none",
              textAlign: "center",
              alignItems: "flex-start",
              cursor: "default",
              boxSizing: "border-box",
              webkitTextSizeAdjust: "none",
            }}
            onClick={handleDrawerToggle}
          >
            {/* <Box
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
              Menu Ouvrir
            </Box> */}

            <MenuIcon
              sx={{
                pointerEvents: "none",
                display: "inline-block",
                fill: "currentColor",
                stroke: "currentColor",
                strokeWidth: 0,
                verticalAlign: "middle",
              }}
              aria-hidden="true"
              focusable="false"
            />
          </Box>
        </Box>
      </Box>
      <Box>
        <Box
          component="form"
          sx={{
            display: "block",
            position: "relative",
            margin: 0,
          }}
        >
          <Box
            sx={{
              transform: "translateZ(0)",
              opacity: 1,
              webkitTransition: "opacity 200ms ease-in-out",
              transition: "opacity 200ms ease-in-out",
            }}
          >
            <Box
              component="input"
              sx={{
                height: "1.5em",
                backgroundColor: "#fff",
                border: "solid 1px #111820",
                fontWeight: 400,
                borderRadius: 0,
                boxSizing: "border-box",
                //minHeight: "40px",
                minHeight: "48px",
                webkitAppearance: "none",
                color: "#111820",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                padding: "7px 48px 7px 17px",
                fontSize: "16px",
                width: "calc(100% - 32px)",
                margin: "8px 16px 16px",
                position: "relative",
                font: "inherit",
                webkitWritingMode: "horizontal-tb !important",
                textRendering: "auto",
                letterSpacing: "normal",
                wordSpacing: "normal",
                textTransform: "none",
                textIndent: "0px",
                textShadow: "none",
                display: "inline-block",
                textAlign: "start",
                webkitRtlOrdering: "logical",
                cursor: "text",
              }}
              maxLength="300"
              type="text"
              spellCheck="false"
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              placeholder="Rechercher sur eDimapromo"
              name="edp"
              aria-haspopup="false"
              aria-label="Rechercher sur eDimapromo"
            ></Box>
            <Box
              component="button"
              sx={{
                position: "absolute",
                zIndex: 100000,
                padding: 0,
                backgroundColor: "transparent",
                border: 0,
                top: "8px",
                right: "15px",
                boxSizing: "content-box",
                marginTop: 0,
                font: "inherit",
                margin: 0,
                textRendering: "auto",
                color: "-internal-light-dark(black, white)",
                letterSpacing: "normal",
                wordSpacing: "normal",
                textTransform: "none",
                textIndent: "0px",
                textShadow: "none",
                display: "inline-block",
                textAlign: "center",
                alignItems: "flex-start",
                cursor: "default",

                appearance: "auto",
                webkitWritingMode: "horizontal-tb !important",
              }}
              aria-label="Rechercher"
            >
              <SearchIcon
                sx={{
                  backgroundColor: "#006efc",
                  fill: "#fff",
                  padding: "12px",
                  // height: "16px",
                  // width: "16px",

                  boxSizing: "content-box",
                  pointerEvents: "none",
                  display: "inline-block",

                  // stroke: "currentColor",
                  // strokeWidth: 0,
                  verticalAlign: "middle",
                }}
                aria-hidden="true"
                focusable="false"
                //fontSize="medium"
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        component="nav"
        // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        // sx={{ flexShrink: { sm: 0 } }}
        aria-label="menu"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              // width: drawerWidth,
              width: "100%",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );

  const headerupsm = (
    <Box
      component="header"
      role="banner"
      sx={{
        display: { xs: "none", sm: "block" },
        paddingTop: "44px",
        paddingBottom: "5px",

        marginLeft: "32px",
        marginRight: "32px",
        maxWidth: "1248px",
        // minWidth: "600px",
        minWidth: "320px",
        color: "#333",
        textAlign: "left",

        position: "relative",
        // margin: 0,
        padding: "35px 0 10px 0",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="table"
        role="presentation"
        sx={{
          borderCollapse: "collapse",
          borderSpacing: 0,
          width: "100%",
          marginTop: 0,
          background: "none !important",
          borderColor: "grey",
          textAlign: "left",
        }}
      >
        <Box component="tbody">
          <Box component="tr">
            <Box
              component="td"
              sx={{
                width: "1%",
                verticalAlign: "middle",
                padding: 0,
                minWidth: "3px",
                display: "table-cell",
                textAlign: "left",
                //  paddingRight: "8px",
                paddingRight: "80px",
              }}
            >
              <Box
                component="h1"
                sx={{
                  display: "block",
                  margin: 0,
                }}
              >
                <Box
                  //component="a"
                  component="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavHome();
                  }}
                  disabled={
                    isLoading ||
                    isNavOpenCart ||
                    isOnClickSignUp ||
                    isOnClickSignIn
                  }
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    position: "relative",
                    textDecoration: "none",
                    cursor: "pointer",
                    //

                    // textIndent: "-9999px",
                    //  width: "139px",
                    width: "130px",
                    height: "48px",
                    //
                    backgroundColor: "transparent",
                    border: "none",
                    outline: 0,
                  }}
                >
                  <Image
                    src="/logodimapromo.svg"
                    alt="logo"
                    //width="125px"
                    // height="48px"
                    layout="fill"
                  />
                </Box>
              </Box>
            </Box>

            <Box
              component="td"
              sx={{
                width: "99%",
                verticalAlign: "middle",
                padding: 0,
                display: "table-cell",
              }}
            >
              <Box
                component="form"
                id="fuzzySearch_form"
                name="fuzzySearch"
                method="post"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  margin: 0,
                  padding: 0,
                  display: "block",
                }}
              >
                <Box
                  component="table"
                  role="presentation"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderSpacing: 0,
                  }}
                >
                  <Box component="tbody">
                    <Box component="tr">
                      <Box
                        component="td"
                        sx={{
                          width: "99%",
                          verticalAlign: "middle",
                          padding: 0,
                          display: "table-cell",
                        }}
                      >
                        <Box
                          sx={{
                            border: "2px solid #41413f",
                            // borderRight: "1px solid #c7c7c7",
                            borderRadius: 0,
                            paddingRight: "5px",
                            boxSizing: "border-box",
                            height: "42px",
                            background: "#fff",
                            padding: "0 10px 0 1px",
                            transition: "border-color .1s linear",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              whiteSpace: "normal",
                            }}
                          >
                            <Box
                              component="input"
                              type="text"
                              aria-autocomplete="list"
                              aria-expanded="false"
                              size="50"
                              maxLength="300"
                              aria-label="Rechercher sur Dimapromo"
                              placeholder="Rechercher sur Dimapromo"
                              autoCapitalize="off"
                              autoCorrect="off"
                              spellCheck="false"
                              autoComplete="off"
                              {...register("searchInput")}
                              //value={searchTerm}
                              onChange={(e) =>
                                //setSelectedResultIndex(-1)
                                setSearchTerm(e.target.value)
                              }
                              sx={{
                                webkitTransition: "none",
                                transition: "none",
                                padding: "9px 0 9px 40px",
                                boxSizing: "border-box",
                                webkitTransition: "padding .1s",
                                transition: "padding .1s",
                                lineHeight: "20px",
                                fontSize: "16px",
                                border: 0,
                                margin: 0,
                                width: "100%",
                                background: "transparent",
                                outline: 0,
                                boxShadow: "none",
                                webkitBorderRadius: "3px",
                                mozBorderRadius: "3px",
                                borderRadius: "3px",
                              }}
                            ></Box>
                            <StyledSearchIcon>
                              <SearchIcon
                                sx={{
                                  fill: "#767676",
                                  pointerEvents: "none",
                                  //stroke: "currentColor",
                                  strokeWidth: 0,
                                  verticalAlign: "middle",
                                }}
                                aria-hidden="true"
                                focusable="false"
                              ></SearchIcon>
                            </StyledSearchIcon>
                          </Box>
                        </Box>

                        <Box
                          // tabIndex="0"
                          sx={{
                            position: "relative",
                            display: "block",
                            // borderCollapse: "collapse",
                            //  borderSpacing: 0,
                            // textIndent: "initial",
                            // whiteSpace: "nowrap",
                            // lineHeight: 1,
                            fontSize: "14px",
                            color: "#333",
                            textAlign: "left",
                            WebkitTextSizeAdjust: "100%",
                          }}
                        >
                          <ClickAwayListener onClickAway={handleClickAway}>
                            <Paper
                              elevation={3}
                              sx={{
                                position: "absolute",
                              }}
                            >
                              <MenuList
                                id="simple-menu"
                                //autoFocusItem={true}
                                onKeyDown={handleListKeyDown}
                                ref={menuListRef} // Reference to the MenuList
                                variant="menu"
                                sx={{
                                  width: "569px",
                                  // display: "block",
                                  minWidth: "300px",
                                  cursor: "default",
                                  background: "#fff",
                                  border: "1px solid #aaa !important",
                                  MozBoxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                                  boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                                  MozBorderRadius: "3px 0 3px 3px",
                                  WebkitBorderRadius: "3px 0 3px 3px",
                                  borderRadius: "3px 0 3px 3px",
                                  zIndex: 9999,
                                  // opacity: 0,
                                  // visibility: "hidden",
                                  MozTransition:
                                    "visibility 0s linear .1s,opacity .1s linear",
                                  WebkitTransition:
                                    "visibility 0s linear .1s,opacity .1s linear",
                                  OTransition:
                                    "visibility 0s linear .1s,opacity .1s linear",
                                  transition:
                                    "visibility 0s linear .1s,opacity .1s linear",
                                  listStyle: "none",
                                  outline: 0,
                                  padding: "2px",
                                  marginLeft: "-1px",
                                  position: "absolute",
                                  top: "-1px !important",
                                  left: "1px !important",
                                  margin: 0,
                                  // borderCollapse: "collapse",
                                  //  borderSpacing: 0,
                                  // textIndent: "initial",
                                  // whiteSpace: "nowrap",
                                  //  lineHeight: 1,
                                  fontSize: "14px",
                                  color: "#333",
                                  textAlign: "left",
                                  //
                                  display: isMenuOpen ? "block" : "none",
                                }}
                                // style={{
                                //  display: isMenuOpen ? "block" : "none",
                                // }}
                              >
                                {isMenuOpen &&
                                  uniqueSearchResults.map((product, i) => (
                                    <MenuItem
                                      tabIndex="0"
                                      key={i}
                                      //ref={menuListRef}
                                      onClick={() => handleListItemClick(i)}
                                      onKeyDown={(e) =>
                                        handleResultArrowKeyPress(e, i)
                                      }
                                      onMouseEnter={() => handleMouseEnter(i)}
                                      sx={{
                                        // margin: 0,
                                        // padding: 0,
                                        width: "100%",
                                      }}
                                    >
                                      <Box
                                        component="a"
                                        role="option"
                                        sx={{
                                          textDecoration: "none",
                                          display: "block",
                                          minHeight: 0,
                                          whiteSpace: "normal",
                                          cursor: "pointer",
                                          color: "#333 !important",
                                          lineHeight: "26px",
                                          padding: "1px 7px",
                                          fontWeight: "bold !important",
                                        }}
                                      >
                                        <Box
                                          component="b"
                                          sx={{
                                            fontWeight: "normal",
                                            color: "#333",
                                            whiteSpace: "normal",
                                            cursor: "pointer",
                                            lineHeight: "26px",
                                          }}
                                        >
                                          {product.productName}
                                        </Box>
                                      </Box>
                                    </MenuItem>
                                  ))}
                              </MenuList>
                            </Paper>
                          </ClickAwayListener>
                          {/*
                          <Box
                            component="ul"
                            // tabindex="-1"
                            //tabIndex="0" // Make the container focusable
                            role="listbox"
                            // onKeyDown={handleKeyDown} // Handle arrow key navigation
                            // onFocus={handleFocus}
                            //ref={ulRef}
                            ref={listElmRef}
                            sx={{
                              width: "569px",
                              display: "block",
                              minWidth: "300px",
                              cursor: "default",
                              background: "#fff",
                              border: "1px solid #aaa !important",
                              MozBoxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                              boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                              MozBorderRadius: "3px 0 3px 3px",
                              WebkitBorderRadius: "3px 0 3px 3px",
                              borderRadius: "3px 0 3px 3px",
                              zIndex: 9999,
                              // opacity: 0,
                              // visibility: "hidden",
                              // MozTransition:
                              //   "visibility 0s linear .1s,opacity .1s linear",
                              // WebkitTransition:
                              //  "visibility 0s linear .1s,opacity .1s linear",
                              // OTransition:
                              //  "visibility 0s linear .1s,opacity .1s linear",
                              // transition:
                              //  "visibility 0s linear .1s,opacity .1s linear",
                              listStyle: "none",
                              outline: 0,
                              padding: "2px",
                              marginLeft: "-1px",
                              position: "absolute",
                              top: "-1px !important",
                              left: "1px !important",
                              margin: 0,
                              // borderCollapse: "collapse",
                              //  borderSpacing: 0,
                              // textIndent: "initial",
                              // whiteSpace: "nowrap",
                              //  lineHeight: 1,
                              fontSize: "14px",
                              color: "#333",
                              textAlign: "left",
                              //
                              //overflowY: "scroll",
                              overflowY: "scroll",
                              maxHeight: "200px",

                              //  scrollBehavior:
                              //    "smooth" ,
                              //  overflow:
                              //   "hidden" ,
                            }}
                          >
                            {renderPrdtList}
                          </Box> 
                          */}
                        </Box>
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          position: "relative",
                          width: "1%",
                          verticalAlign: "middle",
                          padding: 0,
                          minWidth: "3px",
                          display: "table-cell",
                        }}
                      >
                        <Box
                          component="input"
                          disabled={isLoading || isSubmitting || isSearching}
                          type="submit"
                          value="Rechercher"
                          sx={(theme) => ({
                            backgroundColor: "#3665f3",
                            textShadow: "none",
                            borderRadius: 0,
                            //background: 0,
                            padding: "8px 16px",
                            fontSize: "14px",
                            minWidth: "168px",
                            height: "42px",
                            fontWeight: "normal",
                            //  zoom: 1,
                            margin: "0 0 0 5px",
                            webkitBoxShadow: "none",
                            webkitAppearance: "none",
                            mozBoxShadow: "none",
                            boxShadow: "none",
                            display: "inline-block",
                            verticalAlign: "baseline",
                            cursor: "pointer",
                            textAlign: "center",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            border: 0,
                            color: "#fff",
                            userSelect: "none",
                            alignItems: "flex-start",
                            boxSizing: "border-box",
                            webkitWritingMode: "horizontal-tb !important",
                            textRendering: "auto",
                            letterSpacing: "normal",
                            wordSpacing: "normal",
                            textTransform: "none",
                            textIndent: "0px",
                            webkitRtlOrdering: "logical",
                            [theme.breakpoints.between("sm", "md")]: {
                              minWidth: "auto",
                              background: "none !important",
                              backgroundColor: "#3665f3 !important",
                              textIndent: "-9999px",
                              width: "43px",
                            },
                            ////
                          })}
                          //type="submit"
                          //  value="Rechercher"
                        ></Box>
                        <SearchIcon
                          sx={{
                            display: { sm: "block", md: "none" },
                            position: "absolute",
                            left: "15px",
                            width: "22px",
                            height: "23px",
                            top: "8px",
                            fill: "#fff",
                          }}
                        ></SearchIcon>

                        {(isSubmitting || isSearching) && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              // backgroundColor:
                              //  "rgba(255, 255, 255, 0.8); /* Add a semi-transparent background to dim the page behind the spinner",
                              zIndex: "9999",
                            }}
                          >
                            <CircularProgress size={40} />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Add  
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
                tabindex="0"
              >
                {products.map((product, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton>
                      <ListItemText
                        tabindex="0"
                        primary={product.productName}
                      />
                    </ListItemButton>
                  </ListItem>
                ))} 
              </List>*/}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        role="navigation"
        aria-label="Compte"
        sx={{
          display: { xs: "none", sm: "block" },
          //  borderBottom: "1px solid #e5e5e5",
          boxShadow: "none",
          backgroundColor: "#fff",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          height: "30px",
          // height: "45px",
          boxSizing: "initial",
          display: "block",
          //
          whiteSpace: "nowrap",
          lineHeight: 1,
          fontSize: "14px",
          webkitTextSizeAdjust: "100%",
          textAlign: "left",
        }}
      >
        <Box
          component="ul"
          sx={{
            margin: 0,
            padding: 0,
            listStyle: "none outside none",
            marginTop: "2px",
            textAlign: "left",

            height: "100%",
          }}
        >
          <Box
            component="li"
            sx={{
              /* "&>:first-child": {
                background: 0,
                //  padding: 0,
              },*/
              "&>:first-of-type": {
                background: 0,
                //padding: 0,
              },

              display: "inline-block",
              listStyle: "none",
              fontSize: "12px",
              margin: 0,
              textAlign: "-webkit-match-parent",
              whiteSpace: "nowrap",
              // lineHeight: 1,
              height: "100%",
            }}
          >
            {session ? (
              <Box>
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? "demo-customized-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  variant="contained"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    paddingRight: "5px",
                    //color: "#000",
                    FontSize: "12px",
                    whiteSpace: "nowrap",
                    //display: "inline-block",
                    // padding: "5px 17px 16px 10px",
                    padding: "5px 17px 0px 10px",
                    // border: "1px solid #fff",
                    // borderWidth: "2px 1px 0",
                    // textDecoration: "none",
                    position: "relative",
                    left: "-10px",
                    // maxHeight: "100%",
                  }}
                >
                  <Typography variant="caption text" sx={{ fontSize: "12px" }}>
                    Bonjour&nbsp;{session.user.lastname}&nbsp;
                    {session.user.firstname}
                  </Typography>
                </Button>
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={handleClose}
                    disableRipple
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <AccountCircleIcon />
                    Paramètre de compte
                  </MenuItem>
                  <Divider sx={{ my: 0.5 }} />
                  <MenuItem
                    // onClick={handleClose}
                    onClick={handleSignOut}
                    disableRipple
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <Logout />
                    Se déconnecter
                  </MenuItem>
                </StyledMenu>
              </Box>
            ) : (
              <Box
                component="span"
                sx={{
                  paddingRight: "5px",
                  color: "#000",
                  FontSize: "12px",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  padding: "5px 17px 16px 10px",
                  border: "1px solid #fff",
                  borderWidth: "2px 1px 0",
                  textDecoration: "none",
                  position: "relative",
                  left: "-10px",
                }}
              >
                <Typography variant="caption text">
                  Bienvenue&nbsp;!&nbsp;
                </Typography>
                <Box
                  // component="a"
                  component="button"
                  onClick={handleOnClickSignIn}
                  disabled={
                    isLoading ||
                    isNavOpenCart ||
                    isOnClickSignUp ||
                    isOnClickSignIn
                  }
                  sx={{
                    textDecoration: "underline",
                    color: "#0654ba",
                    cursor: "pointer",
                    //
                    backgroundColor: "transparent",
                    border: "none",
                    outline: 0,
                  }}
                >
                  <Typography variant="caption text">Se Connecter</Typography>
                </Box>
                &nbsp;
                <Box
                  component="span"
                  sx={{
                    color: "#000",
                  }}
                >
                  ou&nbsp;
                  <Box
                    //component="a"
                    component="button"
                    onClick={handleOnClickSignUp}
                    disabled={
                      isLoading ||
                      isNavOpenCart ||
                      isOnClickSignUp ||
                      isOnClickSignIn
                    }
                    sx={{
                      textDecoration: "underline",
                      color: "#0654ba",
                      cursor: "pointer",
                      //
                      backgroundColor: "transparent",
                      border: "none",
                      outline: 0,
                    }}
                  >
                    <Typography variant="caption text">
                      S&rdquo;incsrire
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          component="ul"
          sx={{
            position: "absolute",
            top: "1px",
            right: 0,
            zIndex: "99999",
            zoom: 1,
            margin: 0,
            padding: 0,
            listStyle: "none outside none",
            // display: "block",
            alignItems: "center",
            whiteSpace: "nowrap",
            textAlign: "left",
            height: "100%",
            display: "-webkit-flex",
            display: "-ms-flexbox",
            display: "flex",
          }}
        >
          <Box
            component="li"
            sx={{
              listStyle: "none",
              marginRight: 0,
              boxSizing: "border-box",
              // display: "inline-block",
              verticalAlign: "middle",
              position: "relative",
              whiteSpace: "nowrap",
              margin: "0 3px",
              flex: "0 0 auto",
              justifyContent: "flex-end",
              display: "flex",
              alignContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                // display: "inline",
                display: "inline-block",
              }}
            >
              <Box
                sx={{
                  display: "-webkit-flex",
                  display: "-ms-flexbox",
                  display: "flex",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box
                  component="button"
                  onClick={handleOnClickSignIn}
                  disabled={
                    isLoading ||
                    isNavOpenCart ||
                    isOnClickSignUp ||
                    isOnClickSignIn
                  }
                  sx={{
                    padding: "3px 17px 2px",
                    marginRight: "4px",
                    verticalAlign: "top",
                    // width: "52px",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    position: "relative",
                    borderWidth: "1px 1px 0",
                    fontSize: "12px",
                    color: "#333 !important",
                    // display: "inline-block",
                    border: "1px solid transparent",
                    textDecoration: "none !important",
                    //
                    display: "-webkit-flex",
                    display: "-ms-flexbox",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <PermIdentityIcon
                    sx={{
                      margin: "0 8px",
                    }}
                  ></PermIdentityIcon>

                  <Box component="span">
                    <Typography variant="caption text">Se Connecter</Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "inline",
                }}
              ></Box>
            </Box>
          </Box>
          <Box
            component="li"
            sx={{
              listStyle: "none",
              marginLeft: 0,
              display: "inline-block",
              verticalAlign: "middle",
              position: "relative",
              whiteSpace: "nowrap",
              margin: "0 3px",
              textAlign: "-webkit-match-parent",
              color: "#333",
              padding: 0,
              //
              flex: "0 0 auto",
              justifyContent: "flex-end",
              display: "flex",
              alignContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                //  display: "inline",
                display: "inline-block",
              }}
            >
              <Box
                sx={{
                  display: "-webkit-flex",
                  display: "-ms-flexbox",
                  display: "flex",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box
                  //component="a"
                  component="button"
                  onClick={handleOpenCart}
                  disabled={
                    isLoading ||
                    isNavOpenCart ||
                    isOnClickSignUp ||
                    isOnClickSignIn
                  }
                  sx={{
                    // padding: "3px 10px 2px",
                    padding: 0,
                    color: "#111820 !important",
                    cursor: "pointer",
                    borderWidth: "1px 1px 0",
                    position: "relative",
                    fontSize: "12px",
                    // display: "inline-block",
                    border: "1px solid transparent",
                    textDecoration: "none !important",
                    //
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    //
                    backgroundColor: "transparent",
                    border: "none",
                    outline: 0,
                  }}
                >
                  <IconButton aria-label="cart">
                    <StyledBadge
                      badgeContent={getItemsCount()}
                      //  color="secondary"
                    >
                      <ShoppingCartOutlinedIcon
                        sx={{
                          margin: "0 8px 0 0",
                          //
                        }}
                      ></ShoppingCartOutlinedIcon>
                    </StyledBadge>
                  </IconButton>

                  <Box component="span">
                    <Typography variant="caption text"> Panier</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      {isLoading &&
        !isSubmitting &&
        !isSearching &&
        !isNavOpenCart &&
        !isOnClickSignUp &&
        !isOnClickSignIn && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              // backgroundColor:
              //  "rgba(255, 255, 255, 0.8); /* Add a semi-transparent background to dim the page behind the spinner",
              zIndex: "9999",
            }}
          >
            <CircularProgress size={40} />
          </Box>
        )}
      <Box tabIndex="0">
        <Box
          // tabIndex="-1"
          // tabIndex="0"
          sx={{
            display: { xs: "none", sm: "block" },
            borderBottom: "1px solid #e5e5e5",
            zIndex: "-1",
            outline: 0,
            borderTopWidth: 0,
            backgroundColor: "#fff",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            height: "30px",
            boxSizing: "initial",
            fontSize: ".875rem",
            webkitTextSizeAdjust: "100%",
          }}
        ></Box>

        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            backgroundColor: "#fff",
            webkitTextSizeAdjust: "none",
            margin: 0,
          }}
        >
          {headerxs}
        </Box>
        {headerupsm}
      </Box>
    </Box>
  );
}

export default Header;
