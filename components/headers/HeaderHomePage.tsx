import React from "react";
import Exchange from "../Exchange/Exchange";
import Navbar from "../navbar/Navbar";
import HeaderInfo from "./HeaderInfo";

export default function HeaderHome() {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0, 43, 73, 53%),rgba(0, 43, 73, 53%)), url("images/O 06 2.png"), linear-gradient(rgba(0, 43, 73, 53%), rgba(0, 43, 73, 53%))`,
      }}
    >
      <Navbar />
      <div className="container  mx-auto" style={{ paddingBottom: "100px" }}>
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2  ">
          <HeaderInfo />
          <Exchange />
        </div>
      </div>
    </div>
  );
}
