import React from "react";

type Props = {
  HeadClassName?: string | undefined;
  TrClassName?: string | undefined;
  ThClassName?: string | undefined;
  data: any;
};

export default function BodyTable({
  HeadClassName,
  TrClassName,
  ThClassName,
  data,
}: Props) {
  return (
    <tbody className={HeadClassName ? HeadClassName : ""}>
      {data.map((item: any, index: number) => {
        return (
          <tr key={index} className={TrClassName ? TrClassName : ""}>
            {data?.column?.map((item: string, index: number) => {
              return (
                <th key={index} className={ThClassName ? ThClassName : ""}>
                  {item}
                </th>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
