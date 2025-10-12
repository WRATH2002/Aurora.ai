import React from "react";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon, SpamIcon } from "@hugeicons/core-free-icons";

// Default values shown

export function LoaderForSignIn({ loading }) {
  return (
    <>
      <div className="w-full h-[100svh] fixed top-0 left-0 bg-[#0000001d] backdrop-blur-sm z-[110] flex flex-col justify-center items-center font-[r]">
        {/* <div className="w-[200px] h-[200px] rounded-xl bg-white z-50 fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          Loader
        </div> */}

        <div className=" flex flex-col justify-center items-center rounded-2xl p-[30px] bg-white ">
          {loading?.error ? (
            <HugeiconsIcon
              size={25}
              strokeWidth={1.9}
              className="text-[#c34902]"
              icon={SpamIcon}
            />
          ) : loading?.success ? (
            <HugeiconsIcon
              size={25}
              strokeWidth={1.9}
              className="text-[#009616]"
              icon={CheckmarkBadge01Icon}
            />
          ) : (
            <Ring size="25" stroke="3" bgOpacity="0" speed="2" color="black" />
          )}
          <div className="text-[14px] mt-[10px]">
            {loading?.error
              ? `${loading?.statusError}`
              : loading?.success
              ? `${loading?.statusSuccess}`
              : `${loading?.statusInitial}`}
          </div>
        </div>
      </div>
    </>
  );
}

export function LoaderForSignUp({ loading }) {
  return (
    <>
      <div className="w-full h-[100svh] fixed top-0 left-0 bg-[#0000001d] backdrop-blur-sm z-[110] flex flex-col justify-center items-center font-[r]">
        {/* <div className="w-[200px] h-[200px] rounded-xl bg-white z-50 fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          Loader
        </div> */}

        <div className=" flex flex-col justify-center items-center rounded-2xl p-[30px] bg-white ">
          {loading?.error ? (
            <HugeiconsIcon
              size={25}
              strokeWidth={1.9}
              className="text-[#c34902]"
              icon={SpamIcon}
            />
          ) : loading?.success ? (
            <HugeiconsIcon
              size={25}
              strokeWidth={1.9}
              className="text-[#009616]"
              icon={CheckmarkBadge01Icon}
            />
          ) : (
            <Ring size="25" stroke="3" bgOpacity="0" speed="2" color="black" />
          )}
          <div className="text-[14px] mt-[10px]">
            {loading?.error
              ? `${loading?.statusError}`
              : loading?.success
              ? `${loading?.statusSuccess}`
              : `${loading?.statusInitial}`}
          </div>
        </div>
      </div>
    </>
  );
}
