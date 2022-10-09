import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
};
export default function H1({ className, children }: Props) {
  return <h1 className={className ? className : ""}>{children}</h1>;
}
