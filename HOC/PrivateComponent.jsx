import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const privateComponent = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const [verified, setVerified] = useState(false);

    useEffect(async () => {
      const accessToken = localStorage.getItem("isAuth");
      // if no accessToken was found,then we redirect to "/" page.
      if (accessToken) setVerified(true);
    }, []);

    if (verified) {
      return <WrappedComponent {...props} />;
    } else {
      return <div>You have to sign up</div>;
    }
  };
};

export default privateComponent;