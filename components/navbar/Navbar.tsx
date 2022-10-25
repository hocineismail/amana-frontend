import React from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import DropDown from "../common/dropDown/DropDown";
import { useDispatch } from "react-redux";
import { onUpdateLeftSidebarStatus } from "../../features/sidebarSlice";
export default function Navbar() {
  const [isAuth, setisAuth] = React.useState<boolean | null>();
  React.useEffect(() => {
    // if no accessToken was found,then we redirect to "/" page.
    if (localStorage.getItem("isAuth")) {
      setisAuth(true);
    }
  }, []);
  const dispatch = useDispatch();
  const onShowMenu = () => {
    dispatch(onUpdateLeftSidebarStatus());
  };
  return (
    <nav className="bg-[#122c47] pt-4 px-4 py-2.5 m-0">
      <div
        className="container 
         flex flex-wrap
         justify-between 
         items-center mx-auto"
      >
        <div className="flex ">
          <Link href="/">
            <a className="flex items-center">
              <img
                src={`/logo white.png`}
                className="mr-3 h-10 sm:h-10"
                alt="Flowbite Logo"
              />
            </a>
          </Link>

          <div
            className="hidden w-full md:block md:w-auto ml-10"
            id="mobile-menu"
          >
            <Navigation />
          </div>
        </div>

        {isAuth ? (
          <div>
            <button
              data-collapse-toggle="mobile-menu"
              type="button"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
              onClick={() => onShowMenu()}
              className="mobile"
              style={{ display: "inline-block" }}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <DropDown />
          </div>
        ) : (
          <div>
            <button
              data-collapse-toggle="mobile-menu mobile"
              type="button"
              className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded="false"
              onClick={() => onShowMenu()}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="navbar-buttons">
              <Link href="/login">
                <a
                  type="button"
                  className="text-orange 
              border border-orange
                transform transition duration-500 
              bg-transparent
              
            hover:text-white
               focus:ring-4 
              focus:ring-orange-300 font-medium 
              rounded-2xl text-sm px-5 py-2.5
              text-center mr-2 mb-2 dark:bg-orange-600 
            dark:hover:bg-orange dark:focus:ring-orange-800"
                >
                  Login
                </a>
              </Link>
              <Link href="/signup">
                <a
                  type="button"
                  className="text-white bg-orange
                    border border-orange
                    hover:bg-[#ffa600de]
                    transform transition duration-500 
                    focus:ring-4 
                    focus:ring-orange-300 font-medium 
                    rounded-2xl text-sm px-5 py-2.5
                    text-center mr-2 mb-2 dark:bg-orange-600 
                  dark:hover:bg-orange dark:focus:ring-orange-800"
                >
                  Sign up
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
