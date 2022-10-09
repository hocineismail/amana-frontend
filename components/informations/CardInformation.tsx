import React from "react";
import Card from "../common/card/Card";
import { BsWallet2 } from "react-icons/bs";
import { RiSecurePaymentFill } from "react-icons/ri";
import H2 from "../common/heading/H2";
type Props = {
  title: string;
  icon: React.ReactNode;
  text: string;
};

export default function CardInformation({ title, icon, text }: Props) {
  return (
    <div>
      <Card dataTestid="CardInformation" className="m-7 max-w-xs">
        {icon}

        <H2 className="text-xl text-center text-blue font-bold center">
          {title}
        </H2>
        <p className="text-sm text-center  mt-6 text-[#363636] font-bold center">
          {text}
        </p>
      </Card>
    </div>
  );
}
