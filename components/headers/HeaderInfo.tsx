import React from "react";
import Button from "../common/button/Button";

import Link from "next/link";
import H2 from "../common/heading/H2";
import Li from "../common/list/Li";
import Ul from "../common/list/Ul";
type Props = {};

export default function HeaderInfo({}: Props) {
  return (
    <div className=" mx-auto  hidden md:flex flex-wrap justify-between mt-10 ">
      <div style={{ margin: "30px" }}>
        <H2 className="font-bold text-white mt-10">
          Send Money to Your family in&nbsp;
          <span className="bg-orange rounded-2xl p-2  ">Algeria Now </span>
        </H2>
        <Ul className="text-lg text-white mt-5">
          <Li className="pl-5 pt-3">
            &#9758; Open a wallet in Amana and send money to Algeria easily
          </Li>
          <Li className="pl-5 pt-3">
            &#9758; We offer flexible transfer options
          </Li>
          <Li className="pl-5 pt-3">
            &#9758; Your recipient receives the money quickly and securely
          </Li>
        </Ul>
        <Link href="/signup">
          <a className="text-black transition duration-150">
            <Button
              dataTestid="signup"
              className=" mt-5 pl-10 pr-10    fw-400 text-black bg-white
              border border-white  h-12 justify-item 
              transform transition duration-500 
              hover:border-orange
              hover:bg-orange  focus:ring-4 
              focus:ring-orange-300 font-bold 
              rounded-2xl  text-base px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-orange-600 
            dark:hover:bg-orange dark:focus:ring-orange-800
              font-sans w-60"
            >
              Open a wallet
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}
