import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { onGetExchange } from "../../actions/actions";
import { globalState } from "../../features/globalSlice";
import Footer from "../footer/footer";
import Menu from "../menu/Menu";
import Navbar from "../navbar/Navbar";

type Props = {
  children: React.ReactChild;
};

export default function Layout({ children }: Props) {
  //we need to fetch exchange for using it for all pages
  const { exchange } = useSelector(globalState);

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (exchange === null) dispatch(onGetExchange());
  }, [dispatch, exchange]);

  return (
    <>
      <Navbar />
      <div>
        <main>{children}</main>
      </div>
      <Footer />
      <Menu />
    </>
  );
}
