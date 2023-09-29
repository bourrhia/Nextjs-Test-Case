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

export default function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { emotionCache = clientSideEmotionCache, pageProps } = props;
  //export default function MyApp(props) {
  // const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();

  const [hasMounted, setHasMounted] = useState(false);
  const [asPath, setAsPath] = useState("");
  const [pdescid, setPdescid] = useState();

  // Set router.isReady when the page has mounted
  useEffect(() => {
    // setIsReady(router.isReady);
    if (router.isReady) {
      //  const { vpdescid, vasPath } = router.query;

      setAsPath(router.asPath);
      setPdescid(router.query.pdescid);
    }
  }, [router]);

  // Blocking hydration warning
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const currentAsPath = router.asPath;

  const asPathWanted = asPath === `/produit/pdescdet/${pdescid}`;

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
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

//export default MyApp;
