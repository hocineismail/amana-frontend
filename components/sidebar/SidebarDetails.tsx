import React from "react";
import { onClearSideBar, sidebarState } from "../../features/sidebarSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";
import DetailsCharge from "../transfers/details/DetailsCharge";
import DetailsTransfer from "../transfers/details/DetailsTransfer";

type Props = {};

export default function SidebarDetails({}: Props) {
  const [blur, setblur] = React.useState<boolean>(false);
  const menu = React.useRef<any>(null);
  const { isOpenRight, transferDetails } = useAppSelector(sidebarState);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
  const handleClickOutside = (event: any) => {
    if (menu?.current && !menu?.current.contains(event.target)) {
      if (isOpenRight) return dispatch(onClearSideBar());
    }
  };

  React.useEffect(() => {
    if (!isOpenRight) {
      const delayDebounceFn = setTimeout(() => {
        setblur(isOpenRight);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setblur(isOpenRight);
    }
  }, [isOpenRight]);
  return (
    <div>
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
          opacity: isOpenRight ? "0.8" : 0,
          display: blur ? "block" : "none",
        }}
      ></div>

      <div
        ref={menu}
        style={{
          position: "fixed",
          bottom: 0,
          top: 0,
          right: isOpenRight ? 0 : "-600px",
          width: "100%",
          maxWidth: "600px",
          zIndex: 100,
          backgroundColor: "white",
          transition: "0.5s",
        }}
      >
        <div className="m-6">
          {" "}
          {transferDetails?.request.type === "Charge" ? (
            <DetailsCharge item={transferDetails?.request} />
          ) : (
            <DetailsTransfer item={transferDetails?.request} />
          )}
        </div>
        {isOpenRight ? (
          <div
            className="btn-close-details"
            onClick={() => dispatch(onClearSideBar())}
          >
            Close
          </div>
        ) : null}
      </div>
    </div>
  );
}
