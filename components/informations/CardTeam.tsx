import React from "react";
import H2 from "../common/heading/H2";

type Props = {
  name: string;
  text: string;
  src: string;
};

export default function CardTeam({ name, text, src }: Props) {
  return (
    <div className="m-10 max-w-xs">
      <div className="border  max-w-xs border-blue p-4 rounded-full">
        <img
          className="avatar-team"
          src={`/images` + src}
          alt="avatar team memeber"
        />
      </div>
      <H2 className="text-xl mt-5 text-center text-blue font-bold center">
        {name}
      </H2>
      <p className="text-[#363636] text-sm text-center  mt-2  font-bold center">
        {text}
      </p>
    </div>
  );
}
