//import * as React from "react";
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
//import store from "../redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { wrapper } from "../redux/store";

import { SessionProvider } from "next-auth/react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

<<<<<<< HEAD
/*const MyApp = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { emotionCache = clientSideEmotionCache, pageProps } = props;*/
=======
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
export default function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { emotionCache = clientSideEmotionCache, pageProps } = props;
  //export default function MyApp(props) {
  // const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
<<<<<<< HEAD
  const { session } = pageProps;
  /* console.log("_app.js rest:", rest);
  console.log("_app.js pageProps:", pageProps);
  console.log("_app.js Session:", session); // Log the session data*/
  //
  const router = useRouter();

  const [isReady, setIsReady] = useState(router.isReady);
  const [hasMounted, setHasMounted] = useState(false);
  const [asPath, setAsPath] = useState("");
  const [pdescid, setPdescid] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [email, setEmail] = useState();
  const [nom, setNom] = useState();
  const [prenom, setPrenom] = useState();
  const [password, setPassword] = useState();
  const [token, setToken] = useState();
  const [resetCode, setResetCode] = useState();
  const [userId, setUserId] = useState();
=======

  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [asPath, setAsPath] = useState("");
  const [pdescid, setPdescid] = useState();
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed

  // Set router.isReady when the page has mounted
  useEffect(() => {
    // setIsReady(router.isReady);
    if (router.isReady) {
      //  const { vpdescid, vasPath } = router.query;
<<<<<<< HEAD
      setIsReady(router.isReady);
      setAsPath(router.asPath);
      setPdescid(router.query.pdescid);
      setErrorMsg(router.query.errorMsg);
      setEmail(router.query.email);
      setNom(router.query.nom);
      setPrenom(router.query.prenom);
      setPassword(router.query.password);
      setToken(router.query.token);
      setResetCode(router.query.resetCode);
      setUserId(router.query.userId);
    }
  }, [router]);

  /////////////////////////////////// End Add //////////////////////////////////////////////

  /*useEffect(() => {
    // Function to clear the search input value from localStorage
    const clearSearchTermFromLocalStorage = () => {
      localStorage.removeItem("searchTerm");
    };

    // Add an event listener for the 'beforeunload' event

    if (!router.pathname.includes("/fuzzySearch/searchResults")) {
      console.log("My Route is changing to:", router.pathname);
      window.addEventListener("beforeunload", clearSearchTermFromLocalStorage);
    }
    // Add an event listener for the 'popstate' event (back/forward navigation)
    const handlePopState = () => {
      // Check if the current route matches the specific page where you want to retain the value
      const isSpecificPage = router.pathname === "/fuzzySearch/searchResults";

      // Check if the query parameters indicate the specific page
      const hasQueryParameters = router.query.allSearchProducts;

      if (!isSpecificPage || !hasQueryParameters) {
        // Clear the search input value in localStorage for all other pages
        clearSearchTermFromLocalStorage();
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener(
        "beforeunload",
        clearSearchTermFromLocalStorage
      );
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router.pathname, router.query.allSearchProducts]);*/

  /////////////////////////////////// End Add //////////////////////////////////////////////

=======

      setAsPath(router.asPath);
      setPdescid(router.query.pdescid);
    }
  }, [router]);

>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
  // Blocking hydration warning
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const currentAsPath = router.asPath;
<<<<<<< HEAD
  // Get the current URL
  //const currentURL = decodeURIComponent(window.location.href);
  // const targetURL = `/auth/emailUsed?errorMsg=${errorMsg}&email=${email}`;
  const verifReqURL = `/auth/verify-request?email=${email}`;
  const accountExtURL = `/auth/accountExist?errorMsg=${errorMsg}&email=${email}&nom=${nom}&prenom=${prenom}&password=${password}`;
  const verifEmailSuccess = `/auth/verify-email-success?email=${email}`;
  const signInEmail = `/auth/signin?email=${email}`;
  const forgotPswd = `/auth/forgotPassword?email=${email}`;
  const resetCodePswd = `/auth/verifCodePswd?email=${email}`;
  const changePswd = `/auth/changePassword?email=${email}&resetCode=${resetCode}`;
  const verifyEmail = `/auth/verify-email/${token}?email=${email}`;
  const chgPswdSuccess = `/auth/changePswdSuccess?email=${email}`;
  const checkout = `/checkout?userId=${userId}`;

  // Extract the base paths and query parameters from the current and target URLs
  const currentBasePath = currentAsPath.split("?")[0];
  //const targetBasePath = targetURL.split("?")[0];
  const targetVerifReq = verifReqURL.split("?")[0];
  const targetAccountExt = accountExtURL.split("?")[0];
  const targetverifEmailSuccess = verifEmailSuccess.split("?")[0];
  const targetSignInEmail = signInEmail.split("?")[0];
  const targetForgotPswd = forgotPswd.split("?")[0];
  const targetResetCodePswd = resetCodePswd.split("?")[0];
  const targetChangePswd = changePswd.split("?")[0];
  const targetVerifyEmail = verifyEmail.split("?")[0];
  const targetChgPswdSuccess = chgPswdSuccess.split("?")[0];
  const targetCheckout = checkout.split("?")[0];

  /*console.log("currentBasePath :", currentBasePath);
  console.log("targetVerifyEmail :", targetVerifyEmail);
  console.log("currentQueryParams :", currentQueryParams);
  console.log("targetVerifyEmailQp :", targetVerifyEmailQp);
  console.log("isMatchingVerifyEmailURL :", isMatchingVerifyEmailURL);*/

  const currentQueryParams = new URLSearchParams(currentAsPath);
  const targetVerifReqQP = new URLSearchParams(verifReqURL);
  const targetAcctExtQP = new URLSearchParams(accountExtURL);
  const targetverifEmailSuccessQp = new URLSearchParams(verifEmailSuccess);
  const targetSignInEmailQp = new URLSearchParams(signInEmail);
  const targetForgotPswdQp = new URLSearchParams(forgotPswd);
  const targetResetCodePswdQp = new URLSearchParams(resetCodePswd);
  const targetChangePswdQp = new URLSearchParams(changePswd);
  const targetVerifyEmailQp = new URLSearchParams(verifyEmail);
  const targetChgPswdSuccessQp = new URLSearchParams(chgPswdSuccess);
  const targetCheckoutQp = new URLSearchParams(checkout);

  const isMatchingAcctExtURL =
    currentBasePath === targetAccountExt &&
    currentQueryParams.toString() === targetAcctExtQP.toString();

  const isMatchingVerifReqURL =
    currentBasePath === targetVerifReq &&
    currentQueryParams.toString() === targetVerifReqQP.toString();

  const isMatchingverifEmailSuccessURL =
    currentBasePath === targetverifEmailSuccess &&
    currentQueryParams.toString() === targetverifEmailSuccessQp.toString();

  const isMatchingSignInEmailURL =
    currentBasePath === targetSignInEmail &&
    currentQueryParams.toString() === targetSignInEmailQp.toString();

  const isMatchingForgotPswdURL =
    currentBasePath === targetForgotPswd &&
    currentQueryParams.toString() === targetForgotPswdQp.toString();

  const isMatchingResetCodePswdURL =
    currentBasePath === targetResetCodePswd &&
    currentQueryParams.toString() === targetResetCodePswdQp.toString();

  const isMatchingChangePswdURL =
    currentBasePath === targetChangePswd &&
    currentQueryParams.toString() === targetChangePswdQp.toString();

  const isMatchingVerifyEmailURL =
    currentBasePath === targetVerifyEmail &&
    currentQueryParams.toString() === targetVerifyEmailQp.toString();

  const isMatchingChgPswdSuccessURL =
    currentBasePath === targetChgPswdSuccess &&
    currentQueryParams.toString() === targetChgPswdSuccessQp.toString();

  const isMatchingCheckoutURL =
    currentBasePath === targetCheckout &&
    currentQueryParams.toString() === targetCheckoutQp.toString();

  /////////////////////////////////////////////

  const asPathWanted = asPath === `/produit/pdescdet/${pdescid}`;

  //const asPathWanted2 = asPath === "/checkout";

  const asPathWanted2 = isMatchingCheckoutURL;

  const asPathWanted3 = asPath === "/auth/authForm";

  const asPathWanted4 = asPath === "/auth/signup";

  const asPathWanted5 = asPath === "/verifCodePswd";

  // Test if the current path matches the current URL
  const asPathWanted6 = isMatchingAcctExtURL;

  //const asPathWanted7 = asPath === verifReqURL;
  const asPathWanted7 = isMatchingVerifReqURL;

  const asPathWanted8 = isMatchingVerifyEmailURL;

  //const asPathWanted9 = asPath === "/auth/verify-email-success";
  // const asPathWanted9 = asPath === `/auth/verify-email-success?email=${email}`;
  const asPathWanted9 = isMatchingverifEmailSuccessURL;

  const asPathWanted10 = isMatchingSignInEmailURL;

  const asPathWanted11 = isMatchingForgotPswdURL;

  const asPathWanted12 = isMatchingResetCodePswdURL;

  const asPathWanted13 = isMatchingChangePswdURL;

  const asPathWanted14 = isMatchingChgPswdSuccessURL;

=======

  const asPathWanted = asPath === `/produit/pdescdet/${pdescid}`;

>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
  if (asPathWanted) {
    return (
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Dimapromo</title>
          {/* <meta name="viewport" content="initial-scale=1, width=device-width" /> */}

          <meta name="viewport" content="initial-scale=1, width=device-width" />

          {/* <meta
          name="viewport"
          content="initial-scale=1, width=device-width, user-scalable=no"
        ></meta>*/}
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />

          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    );
  }

<<<<<<< HEAD
  if (
    asPathWanted2 ||
    asPathWanted3 ||
    asPathWanted4 ||
    asPathWanted5 ||
    asPathWanted6 ||
    asPathWanted7 ||
    asPathWanted8 ||
    asPathWanted9 ||
    asPathWanted10 ||
    asPathWanted11 ||
    asPathWanted12 ||
    asPathWanted13 ||
    asPathWanted14
  ) {
    return (
      <SessionProvider session={pageProps.session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CacheProvider value={emotionCache}>
              <Head>
                <title>Dimapromo</title>
                <meta
                  name="viewport"
                  content="initial-scale=1, width=device-width"
                />
              </Head>

              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />

                <Component {...pageProps} />
              </ThemeProvider>
            </CacheProvider>
          </PersistGate>
        </Provider>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CacheProvider value={emotionCache}>
            <Head>
              <title>Dimapromo</title>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>

            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />

              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </CacheProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
=======
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>Dimapromo</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>

          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </CacheProvider>
      </PersistGate>
    </Provider>
>>>>>>> 4465f2d017ef6aeea8e7c621b51747a7452b6bed
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

//export default MyApp;
