import React from "react";
import svg from "../../../public/images/undraw_maintenance_re_59vn.svg";
import Image from "next/image";
type Props = {};

export default function Maintanance({}: Props) {
  return (
    <div className="flex-container">
      <div className="row">
        <div className="flex-item">
          <Image
            src={svg}
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
