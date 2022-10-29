import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import AOS from "aos";
import "aos/dist/aos.css";
import { Provider } from "react-redux";
import { store } from "../getStore";
// import { SSRProvider } from "@react-aria/ssr";
// import Script from "next/script";
import Script from "next/script";
import axios from "axios";
import Maintanance from "../components/pages/maintanance/Maintanance";
import Whatsapp from "../components/whatsapp/Whatsapp";
import "../styles/date.css";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "../firebase/firebase";
function MyApp({ Component, pageProps }: AppProps) {
  const [access, setAccess] = React.useState<null | boolean>(null);
  React.useEffect(() => {
    AOS.init();

    // initializeAppCheck(app, {
    //   provider: new ReCaptchaV3Provider(
    //     "6LfWTssgAAAAAKTxLCgGeZKMtlFluqjjpyL6hAAu"
    //   ),

    //   // Optional argument. If true, the SDK automatically refreshes App Check
    //   // tokens as needed.
    //   isTokenAutoRefreshEnabled: true,
    // });
  }, []);

  function checkWebsiteAccess() {
    // let API = process.env.API || "";
    try {
      axios
        .get("/api/maintanance")
        .then((response: any) => {
          setAccess(!response.data.maintanance);
        })
        .catch(() => {
          setAccess(false);
        });
    } catch (error) {
      setAccess(false);
    }
  }
  checkWebsiteAccess();
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="author" content="ASTLAS" />
        <meta
          name="description"
          content="Amana Transfers is a subdivision of CNG Global Services LTD, a UK based company that also holds offices in France & Algeria.
          Amana Transfers is the fastest, cheapest and most secure way of sending money to your loved ones in Algeria ."
        />
        <Script src="https://www.google.com/recaptcha/api.js" async />
      </Head>
      <NextNProgress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Provider store={store}>
        {access === null ? (
          <div className="loading">Loading&#8230;</div>
        ) : access === true ? (
          <Component {...pageProps} />
        ) : (
          <Maintanance />
        )}
        <Whatsapp />
      </Provider>
    </React.Fragment>
  );
}

export default MyApp;
