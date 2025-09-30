import { TeaIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useEffect, useState } from "react";

export default function LockDown(props) {
  const [countdown, setCountdown] = useState(20); // 20 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          props?.onBreakComplete(); // notify parent when countdown ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  }, [props?.onBreakComplete]);

  function formatTime(data) {
    if (data < 10) {
      return "0" + data;
    } else {
      return data;
    }
  }
  return (
    <div
      className={
        "w-full h-[100svh] flex flex-col justify-center items-center z-[500] fixed left-0 top-0 select-none" +
        (props?.theme
          ? " bg-[#1A1A1A] text-[#484848]"
          : " bg-[white] text-[#393939]")
      }
    >
      <span className="font-[DMSm] flex justify-center items-center text-[30px] h-[40px] mb-[-40px]">
        <HugeiconsIcon
          className="mr-[10px] mt-[-10px]"
          icon={TeaIcon}
          size={38}
          // fill="black"
          strokeWidth={2}
        />
        Take a break!
      </span>
      <span className="font-[dd] text-[300px]">00:{formatTime(countdown)}</span>
    </div>
  );
}
