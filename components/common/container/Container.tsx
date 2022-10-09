import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <div
      className="container 
         flex flex-wrap
         justify-between 
         items-center mx-auto"
    >
      {children}
    </div>
  );
}
