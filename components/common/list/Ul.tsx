import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
};

export default function Ul({ className, children }: Props) {
  return <ul className={className ? className : ""}>{children}</ul>;
}
