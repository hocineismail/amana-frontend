import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
};
export default function H2({ className, children }: Props) {
  return (
    <h2 className={className ? className : ""} style={{ fontSize: "20px" }}>
      {children}
    </h2>
  );
}
