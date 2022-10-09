import Image from "next/image";
import React from "react";
import Layout from "../components/layout/Layout";
import notFoundImage from "../public/images/undraw_page_not_found_re_e9o6.svg";
type Props = {};

export default function index({}: Props) {
  return (
    <Layout>
      <div
        style={{ height: "70vh" }}
        className=" justify-center container  mx-auto  hidden md:flex"
      >
        <div style={{ maxWidth: "450px", width: "100%", margin: "auto" }}>
          <Image src={notFoundImage} alt="not found  illistration" />
        </div>
      </div>
    </Layout>
  );
}
