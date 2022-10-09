import React from "react";
import Container from "../common/container/Container";
import H3 from "../common/heading/H3";
import CardTeam from "./CardTeam";

type Props = {};
let teamMember = [
  {
    name: "ismail hocine",
    src: "/avatar.jpg",
    text: "web developer anjhsdj",
  },
  {
    name: "ismail hocine",
    src: "/avatar.jpg",
    text: "web developer anjhsdj",
  },
  {
    name: "ismail hocine",
    src: "/avatar.jpg",
    text: "web developer anjhsdj",
  },
];
export default function Team({}: Props) {
  return (
    <div className=" pt-20 pb-40 m-auto bg-white rounded-t-3xl ">
      <div className="h-2 w-10 rounded-lg m-auto bg-orange mb-5"></div>
      <H3 className="text-2xl text-center text-blue font-bold center">
        Our Team
      </H3>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 m-auto">
          {teamMember.map((item: any, index: number) => {
            return (
              <CardTeam
                key={index}
                name={item.name}
                src={item.src}
                text={item.text}
              />
              //   <CardInformation
              //     key={index}
              //     title={item.title}
              //     icon={item.icon}
              //     text={item.text}
              //   />
            );
          })}
        </div>
      </Container>{" "}
    </div>
  );
}
