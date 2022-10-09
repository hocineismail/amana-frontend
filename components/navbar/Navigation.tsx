import React from "react";
import links from "../../data/navlinks.json";
import Link from "next/link";
type Props = {};

export default function Navigation({}: Props) {
  return (
    <>
      <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
        {links.map((item: any) => {
          return (
            <li key={item.name}>
              <Link href={`/${item.path}`}>
                <a className="mt-3 font-bold block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white">
                  {item.name}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
