import React from "react";

type Props = {
  className: string;
  text: string;
};

export default function Badge({ className, text }: Props) {
  return <span className={className}>{text}</span>;
}
