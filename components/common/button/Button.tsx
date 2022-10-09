import React from "react";

type Props = {
  className?: undefined | string;
  children: React.ReactNode;
  dataTestid: string;
};

//transition ease-in-out delay-150   hover:-translate-y-110 hover:scale-110 hover:bg-indigo-500 duration-300
export default function Button({ className, children, dataTestid }: Props) {
  return (
    <button
      data-testid={dataTestid}
      className={` ${className ? className : ""}`}
    >
      {children}
    </button>
  );
}
