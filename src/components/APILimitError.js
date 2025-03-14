import { TriangleAlert } from "lucide-react";
import React from "react";

export default function APILimitError(props) {
  return (
    <div
      className="w-full h-[100svh] font-[geistRegular] flex justify-center items-center fixed left-0 top-0 bg-[#0000002b] z-[900]"
      onClick={() => {
        props?.setAiErrorMessage("");
        props?.setAiError(false);
      }}
    >
      <div className="w-[350px] h-auto bg-white rounded-2xl p-[40px] flex flex-col justify-center items-center boxShadowLight2">
        <div className="w-[70px] h-[70px] rounded-full bg-[#FFEDC9] text-[#FFEDC9] flex justify-center items-center">
          <TriangleAlert
            width={50}
            height={50}
            strokeWidth={2}
            fill="#FFA217"
            className="mt-[-5px]"
          />
        </div>
        <span className="mt-[20px] text-[30px] font-[geistBold]">Oops !</span>
        <span className="mt-[10px] text-[21px] font-[geistMedium] text-center leading-7">
          You've reached your AI quota limit.
        </span>
        <span className="mt-[25px] text-[15px] text-[#636363]">
          It appears that you have made too many requests or exceeded your daily
          quota. Please try again later or consider adding new API keys to
          continue using the service.
        </span>
      </div>
    </div>
  );
}
