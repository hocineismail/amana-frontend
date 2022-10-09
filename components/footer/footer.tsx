import Link from "next/link";
import React from "react";
import { FiFacebook, FiInstagram } from "react-icons/fi";

import H4 from "../common/heading/H4";
import Li from "../common/list/Li";
import Ul from "../common/list/Ul";
import "/node_modules/flag-icons/css/flag-icons.min.css";
type Props = {};

export default function Footer({}: Props) {
  return (
    <div className="bg-[#001829] text-white   ">
      <footer className="container m-auto  ">
        <div className="footer-grid">
          <div className="pl-10 pr-10   pb-10 ">
            <img
              src="/images/logo footer white.png"
              style={{ width: "250px" }}
            />
            <p>
              Amana Transfers is a subdivision of CNG Global Services LTD, a UK
              based company that also holds offices in France & Algeria. Amana
              Transfers is the fastest, cheapest and most secure way of sending
              money to your loved ones in Algeria
            </p>
          </div>
          <div className="pl-10 pr-10 pt-10  pb-10  ">
            <H4 className="text-white text-xl text-bold">
              <span style={{ fontWeight: "bold" }}>Links</span>
            </H4>
            <Ul className="ml-4">
              <Li className="pt-3 pb-2 ">
                <Link href={"/"}>
                  <a>Home</a>
                </Link>
              </Li>
              {/* <Li className="pt-2 pb-2">
              <Link href={"/login"}>
                <a>Login</a>
              </Link>
            </Li>
            <Li className="pt-2 pb-2">
              <Link href={"/signup"}>
                <a>Signup</a>
              </Link>
            </Li> */}
              <Li className="pt-2 pb-2">
                <Link href={"/privacy-policy"}>
                  <a>Privacy & Policy</a>
                </Link>
              </Li>
            </Ul>
          </div>
          <div className="pl-10 pr-10 pt-10  pb-10">
            <H4 className="text-white  text-xl">
              <span style={{ fontWeight: "bold" }}>Follow us</span>
            </H4>
            <Ul className="inline-block">
              <Li className="inline-block">
                <Link href={"https://www.facebook.com/amanatransfers"}>
                  <a className="pt-2 pb-2 pl-2  w-10 h-10 rounded-lg border m-2  border-gray inline-block">
                    <FiFacebook size={20} />
                  </a>
                </Link>
              </Li>
              <Li className="inline-block">
                <Link href={"https://www.instagram.com/amanatransfers"}>
                  <a className="pt-2 pb-2 pl-2  w-10 h-10 rounded-lg border m-2  border-gray inline-block">
                    <FiInstagram size={20} />
                  </a>
                </Link>
              </Li>
            </Ul>
          </div>
          <div className="pl-10 pr-10 pt-10  pb-10">
            <H4 className="text-white  text-xl mb-2">
              <span style={{ fontWeight: "bold" }}>Contact Us</span>
            </H4>
            <Ul>
              <Li>
                <span className="fi fi-gb"> </span>
                &nbsp;<b>+44 744 142 8355</b>
              </Li>
              <Li>
                <span className="fi fi-fr"> </span>
                &nbsp;<b>+33 644 624 246</b>
              </Li>{" "}
              <Li>
                <span className="fi fi-dz"></span>
                &nbsp;<b>+213 672 427 409 </b>
              </Li>
            </Ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
