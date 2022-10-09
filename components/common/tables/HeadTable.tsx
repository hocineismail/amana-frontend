import React from "react";

type Props = {
  HeadClassName?: string | undefined;
  TrClassName?: string | undefined;
  ThClassName?: string | undefined;
  head: string[];
};

export default function HeadTable({
  HeadClassName,
  head,
  TrClassName,
  ThClassName,
}: Props) {
  return (
    <thead className={HeadClassName ? HeadClassName : ""}>
      <tr className={TrClassName ? TrClassName : ""}>
        {head?.map((item: string, index: number) => {
          return (
            <th key={index} className={ThClassName ? ThClassName : ""}>
              {item}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
