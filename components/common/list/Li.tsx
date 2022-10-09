import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
};

export default function Li({ className, children }: Props) {
  return <li className={className ? className : ""}>{children}</li>;
}
