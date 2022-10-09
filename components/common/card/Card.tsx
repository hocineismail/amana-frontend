import React from "react";

type Props = {
  dataTestid: string;
  className?: string;
  children: React.ReactNode;
};

export default function Card({ dataTestid, className, children }: Props) {
  return (
    <div
      data-testid={dataTestid}
      className={` ${
        className ? className : "bg-white "
      } bg-white  mt-20 p-6   max-w-sm bg-semi rounded-2xl     dark:bg-semi`}
    >
      {children}
    </div>
  );
}
