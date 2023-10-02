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

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { wrapper } from "../redux/store";

import { SessionProvider } from "next-auth/react";
import { store, persistor } from "../redux/store";

const clientSideEmotionCache = createEmotionCache();

export default function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { emotionCache = clientSideEmotionCache, pageProps } = props;

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
  const [id, setId] = useState();

  useEffect(() => {
    if (router.isReady) {
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
      setId(router.query.id);
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

  const verifReqURL = `/auth/verify-request?email=${email}`;
  const accountExtURL = `/auth/accountExist?errorMsg=${errorMsg}&email=${email}&nom=${nom}&prenom=${prenom}&password=${password}`;
  const verifEmailSuccess = `/auth/verify-email-success?email=${email}`;
  const signInEmail = `/auth/signin?email=${email}`;
  const forgotPswd = `/auth/forgotPassword?email=${email}`;
  const resetCodePswd = `/auth/verifCodePswd?email=${email}`;
  const changePswd = `/auth/changePassword?email=${email}&resetCode=${resetCode}`;
  const verifyEmail = `/auth/verify-email/${token}?email=${email}`;
  const chgPswdSuccess = `/auth/changePswdSuccess?email=${email}`;
  const checkout = `/checkout?id=${id}`;

  // Extract the base paths and query parameters from the current and target URLs
  const currentBasePath = currentAsPath.split("?")[0];

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

  const asPathWanted2 = isMatchingCheckoutURL;

  const asPathWanted3 = asPath === "/auth/authForm";

  const asPathWanted4 = asPath === "/auth/signup";

  const asPathWanted5 = asPath === "/verifCodePswd";

  // Test if the current path matches the current URL
  const asPathWanted6 = isMatchingAcctExtURL;

  const asPathWanted7 = isMatchingVerifReqURL;

  const asPathWanted8 = isMatchingVerifyEmailURL;

  const asPathWanted9 = isMatchingverifEmailSuccessURL;

  const asPathWanted10 = isMatchingSignInEmailURL;

  const asPathWanted11 = isMatchingForgotPswdURL;

  const asPathWanted12 = isMatchingResetCodePswdURL;

  const asPathWanted13 = isMatchingChangePswdURL;

  const asPathWanted14 = isMatchingChgPswdSuccessURL;

  if (asPathWanted) {
    return (
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Dimapromo</title>

          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    );
  }

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
              <CssBaseline />

              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </CacheProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
