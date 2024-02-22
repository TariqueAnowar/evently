"use client";

import { headerLinks } from "@/constants";
import { link } from "fs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  setOpen: (value: boolean) => void;
};
const MobNavItems = ({ setOpen }: Props) => {
  const pathname = usePathname();
  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route} onClick={(e) => setOpen(false)}>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default MobNavItems;
