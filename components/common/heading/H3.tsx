import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
};
export default function H3({ className, children }: Props) {
  return <h2 className={className ? className : ""}>{children}</h2>;
}
