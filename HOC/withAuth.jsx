import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(async () => {
      // if no accessToken was found,then we redirect to "/" page.
       
      if (!localStorage.getItem("isAuth"))  {
      
        Router.replace("/login");
      } else {
        setVerified(true);
      }
    }, []);
 
    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
};

export default withAuth;
