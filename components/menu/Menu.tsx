import React from "react";
import { onClearSideBar, sidebarState } from "../../features/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";
import { AiOutlineCloseCircle } from "react-icons/ai";
import links from "../../data/navlinks.json";
import Link from "next/link";
import {
  FiLogIn,
  FiMessageSquare,
  FiUserPlus,
  FiSmile,
  FiHome,
} from "react-icons/fi";

type Props = {};

export default function Menu({}: Props) {
  const [blur, setblur] = React.useState<boolean>(false);
  const menu = React.useRef<any>(null);
  const { isOpenLeft } = useAppSelector(sidebarState);
  const [isAuth, setisAuth] = React.useState<boolean | null>();

  React.useEffect(() => {
    if (localStorage.getItem("isAuth")) {
      setisAuth(true);
    }
    return () => {
      dispatch(onClearSideBar());
    };
  }, []);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  const handleClickOutside = (event: any) => {
    if (menu?.current && !menu?.current.contains(event.target)) {
      if (isOpenLeft) return dispatch(onClearSideBar());
    }
  };

  React.useEffect(() => {
    if (!isOpenLeft) {
      const delayDebounceFn = setTimeout(() => {
        setblur(isOpenLeft);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setblur(isOpenLeft);
    }
  }, [isOpenLeft]);
  return (
    <div className="mobile">
      <div
        className="fade"
        style={{
          position: "fixed",
          bottom: 0,
          top: 0,
          right: 0,
          left: 0,
          zIndex: 20,
          backgroundColor: "black",
          transition: "1s",
          opacity: isOpenLeft ? "0.8" : 0,
          display: blur ? "block" : "none",
        }}
      ></div>

      <div
        ref={menu}
        style={{
          position: "fixed",
          bottom: 0,
          top: 0,
          left: isOpenLeft ? 0 : "-350px",
          width: "100%",
          maxWidth: "350px",
          zIndex: 100,
          backgroundColor: "white",
          transition: "0.5s",
        }}
      >
        <div className="m-6 pt-20">
          {" "}
          <ul>
            <li>
              <Link href={`/`}>
                <a className="mt-3 font-bold block py-2 pr-4 pl-3 text-blue bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-blue">
                  <span>
                    <FiHome
                      style={{ display: "inline", marginRight: "10px" }}
                    />
                    &nbsp; Home
                  </span>
                </a>
              </Link>
            </li>

            <li>
              <Link href={`/privacy-policy`}>
                <a className="mt-3 font-bold block py-2 pr-4 pl-3 text-blue bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-blue">
                  <span>
                    <FiSmile
                      style={{ display: "inline", marginRight: "10px" }}
                    />
                    &nbsp; Privacy Policy
                  </span>{" "}
                </a>
              </Link>
            </li>
            {!isAuth ? (
              <>
                <li>
                  <Link href={`/login`}>
                    <a className="mt-3 font-bold block py-2 pr-4 pl-3 text-blue bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-blue">
                      <span>
                        <FiLogIn
                          style={{ display: "inline", marginRight: "10px" }}
                        />
                        &nbsp; Login
                      </span>{" "}
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={`/signup`}>
                    <a className="mt-3 font-bold block py-2 pr-4 pl-3 text-blue bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-blue">
                      <span>
                        <FiUserPlus
                          style={{ display: "inline", marginRight: "10px" }}
                        />
                        &nbsp; Sign up
                      </span>
                    </a>
                  </Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
          }}
          onClick={() => dispatch(onClearSideBar())}
        >
          <AiOutlineCloseCircle size={36} />
        </div>
      </div>
    </div>
  );
}
