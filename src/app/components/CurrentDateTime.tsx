"use client";

import clsx from "clsx";
import {useEffect, useState} from "react";
import {GoX} from "react-icons/go";

import {getFormattedDateTime} from "@/utils/general";
import {DateTimeType} from "@/types/utils";


export function CurrentDateTime() {

  const [curr, setCurr] = useState<DateTimeType>(getFormattedDateTime())
  const [showCurr, setShowCurr] = useState<boolean>(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurr(getFormattedDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="relative">
      <div
        itemType="button"
        className="flex items-center font-light justify-center m-2 hover:border-b border-b-black transition-colors cursor-pointer"
        onClick={() => setShowCurr(!showCurr)}
      >
        {showCurr ? (
          <GoX />
        ) : (
          <>
            <p>{curr.time}</p>
          </>
        )}
      </div>
      <div
        className={clsx("flex flex-col justify-center gap-y-2 bg-gray-100 rounded-lg shadow-lg w-max uppercase absolute left-10 top-0 overflow-hidden transition-all", {
          "h-auto p-4 z-50": showCurr,
          "h-0 p-0 -z-50": !showCurr
        })}>
        <p className="text-xl">{curr.date} <span className="font-light !text-sm">({curr.day})</span></p>
        <div
          className="h-0 border border-black"
          style={{
            width: `${((100 / 59) * curr.seconds).toFixed(2)}%`,
            opacity: `${(((50 / 59) * curr.seconds) + 50).toFixed(2)}%`
          }}
        />
        <p className="text-4xl">{curr.timeS}</p>
      </div>
    </div>
  );
}