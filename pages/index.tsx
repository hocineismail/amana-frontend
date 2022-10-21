import React from "react";
import { boolean } from "yup";
import Dashboard from "../components/pages/Dashboard";
import Home from "../components/pages/Home";

function Index() {
  const [verified, setVerified] = React.useState<boolean | undefined>(
    undefined
  );
  React.useEffect(() => {
    // if no accessToken was found,then we redirect to "/" page.
    setTimeout(() => {
      if (!localStorage.getItem("isAuth")) {
        setVerified(false);
      } else {
        setVerified(true);
      }
    }, 1000);
  }, []);
  if (verified === undefined)
    return <div className="loading">Loading&#8230;</div>;
  if (verified === true) return <Dashboard />;
  return <Home />;
}

export default Index;
