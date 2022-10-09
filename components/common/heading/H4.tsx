import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
};
export default function H4({ className, children }: Props) {
  return (
    <h4
      className={className ? className : ""}
      style={{ fontWeight: "bold !important" }}
    >
      {children}
    </h4>
  );
}
