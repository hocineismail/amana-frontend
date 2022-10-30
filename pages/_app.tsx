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
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { app } from "../firebase/firebase";
function MyApp({ Component, pageProps }: AppProps) {
  const [access, setAccess] = React.useState<null | boolean>(null);
  const [url, seturl] = React.useState<string>("");
  React.useEffect(() => {
    AOS.init();
    if (process.env.RECAPTCHA_PUBLIC_KEY) {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.RECAPTCHA_PUBLIC_KEY),

        // Optional argument. If true, the SDK automatically refreshes App Check
        // tokens as needed.
        isTokenAutoRefreshEnabled: true,
      });
    }
    seturl(window.location.href);
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
        <meta name="theme-color" content="#002b48" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="author" content="amanatransfers" />
        <meta
          name="description"
          content="Amana Transfers is the fastest, cheapest and most secure way of sending money to your loved ones in Algeria."
        />

        {/* <meta charset="utf-8" /> */}
        <link rel="shortcut icon" href="/logo192.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />

        <meta property="og:site_name" content="amanatransfers" />
        <meta property="og:title" content="Amana transfers" />
        <meta
          property="og:description"
          content="Amana Transfers is the fastest, cheapest and most secure way of sending money to your loved ones in Algeria."
        />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="Website" />
        <meta
          property="og:image"
          content="https://amanatransfers.com/images/logo footer white.png"
        />
        <meta
          name="keywords"
          content="Algeria
          ,Send money to Algeria
          ,Transfer money
          ,Transfer money to Algeria
          ,Money transfer
          ,Amana
          ,Amana transfers
          ,Algerian poste"
        />
        <link rel="manifest" href="/manifest.json" />
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
