import React from "react";
import {
  onDisplayAdded,
  onDisplayAll,
  onDisplaySent,
  transferSwitchState,
} from "../../features/transferSwitch";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxHook";

type Props = {};

export default function Switcher({}: Props) {
  const { sent, added, all } = useAppSelector(transferSwitchState);
  const dispatch = useAppDispatch();
  return (
    <div>
      <div style={{ display: "inline-block" }}>
        <button
          data-testid="send"
          style={{ borderColor: "transparent", fontSize: "bold" }}
          className="bg-transparent w-20 border ml-4 mt-4 "
          onClick={() => dispatch(onDisplayAll())}
        >
          <span style={{ fontWeight: "bold", width: "150px" }}> All</span>
        </button>
      </div>
      <div style={{ display: "inline-block" }}>
        <button
          data-testid="send"
          style={{ borderColor: "transparent", fontSize: "bold" }}
          className="bg-transparent w-20 border ml-4 mt-4 "
          onClick={() => dispatch(onDisplayAdded())}
        >
          <span style={{ fontWeight: "bold", width: "150px" }}> Added</span>
        </button>
      </div>
      <div style={{ display: "inline-block" }}>
        <button
          style={{ borderColor: "transparent", fontSize: "bold" }}
          data-testid="send"
          className="bg-transparent w-20 border ml-4 mt-4"
          onClick={() => dispatch(onDisplaySent())}
        >
          <span style={{ fontWeight: "bold", width: "150px" }}> Sent</span>
        </button>
      </div>

      <div
        style={{ transition: "0.2s" }}
        className={`w-20 rounded-2xl bg-blue  ${
          all ? "ml-4" : added ? "ml-28" : "ml-52"
        }  mt-2 h-1`}
      ></div>
    </div>
  );
}
