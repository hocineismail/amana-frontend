import React from "react";
import Container from "../common/container/Container";
import H3 from "../common/heading/H3";
import CardInformation from "./CardInformation";
import { BsWallet2 } from "react-icons/bs";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
type Props = {};

export interface IInformationHome {
  title: string;
  icon: JSX.Element;
  text: string;
}
const informations = [
  {
    title: "Easy",
    icon: (
      <BsWallet2 size={36} className="text-blue text-center  m-auto mb-6" />
    ),

    text: "We focus on making your experience easy & simple, we also offer 24h phone support",
  },
  {
    title: "Secure ",
    icon: (
      <RiSecurePaymentFill
        size={40}
        className="text-blue text-center  m-auto mb-6"
      />
    ),

    text: `We’re a registered business in the UK & Algeria & we have offices in the UK, France & Algeria
we also have hundreds of happy clients`,
  },
  {
    title: "Flexible",
    icon: (
      <GiTakeMyMoney size={36} className="text-blue text-center  m-auto mb-6" />
    ),
    text: "We offer you multiple ways to transfer your money ",
  },
];
export default function WhyShooseIWallet({}: Props) {
  return (
    <div className=" pt-10 pb-40  m-auto   rounded-t-3xl ">
      <div className="h-2 w-10 rounded-lg m-auto bg-orange mb-5"></div>
      <H3 className="text-2xl text-center text-blue font-bold center">
        Why Choose Us?
      </H3>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 m-auto">
          {informations.map((item: IInformationHome, index: number) => {
            return (
              <CardInformation
                key={index}
                title={item.title}
                icon={item.icon}
                text={item.text}
              />
            );
          })}
        </div>
      </Container>
    </div>
  );
}
