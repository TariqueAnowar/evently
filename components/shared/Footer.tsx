import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
        <div className="flex items-center ">
          Build with
          <span className="text-primary text-2xl px-1">&#9825;</span>
          by&nbsp;
          <Link
            href="https://www.tanowar.co.in/"
            target="_blank"
            className="underline underline-offset-4"
          >
            TariqueAnowar
          </Link>
        </div>
        <Link
          href="https://www.tanowar.co.in/contact"
          className="underline underline-offset-4 "
          target="_blank"
        >
          Say Hello
        </Link>
      </div>
    </footer>
  );
};
