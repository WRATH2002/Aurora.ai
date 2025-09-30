import {
  Alien02Icon,
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
  SettingError04Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useEffect, useState } from "react";

export default function DownloadingToast(props) {
  return (
    <div className="fixed right-[20px] bottom-[20px] w-[250px] min-h-[50px] rounded-2xl boxShadowLight1 border-[1.5px] border-[#efefef] bg-[#ffffff] text-[black] z-[60]  flex flex-col justify-start items-start overflow-hidden">
      <div className="flex justify-between items-center whitespace-nowrap w-full p-[15px]">
        <div className="flex justify-start items-center whitespace-nowrap">
          {props?.downloadStarting ? (
            <HugeiconsIcon
              className={" mr-[10px] mt-[0px] rotate "}
              // onClick={() => {}}
              icon={Loading03Icon}
              size={18}
              strokeWidth={1.8}
            />
          ) : (
            <HugeiconsIcon
              className={" mr-[10px] text-[#32BD6F] "}
              // onClick={() => {}}
              icon={CheckmarkCircle01Icon}
              size={18}
              strokeWidth={2.2}
            />
          )}
          {props?.downloadStarting ? (
            <>Making things ready</>
          ) : (
            <>Download started</>
          )}
        </div>
        {props?.downloadStarting ? (
          <HugeiconsIcon
            className={" opacity-0 ml-[30px] "}
            // onClick={() => {}}
            icon={Cancel01Icon}
            size={15}
            strokeWidth={2.2}
          />
        ) : (
          <HugeiconsIcon
            className={
              " opacity-100 ml-[30px] cursor-pointer " +
              (props?.theme
                ? " text-[#828282] hover:text-[#ffffff]"
                : " text-[#797979] hover:text-[#000000]")
            }
            onClick={() => {
              props?.setDownloadStartingSub((prev) => false);
            }}
            icon={Cancel01Icon}
            size={14}
            strokeWidth={2.5}
          />
        )}
      </div>
      <div className="w-full h-[4px] mt-[-4px] flex justify-start items-center">
        <div
          className={
            "h-full bg-[#32BD6F]  rounded-r-sm" +
            (props?.downloadStarting ? " w-[0px]" : " w-full")
          }
          style={{ transition: " 3s" }}
        ></div>
      </div>
    </div>
  );
}

export function APIErrorToast(props) {
  const [expand, setExpand] = useState(false);
  useEffect(() => {
    setExpand(false);
  }, [props?.APIError]);
  return (
    <div
      className={
        "fixed right-[20px] bottom-[20px] w-[300px]  rounded-2xl boxShadowLight1 border-[1.5px] border-[#efefef] bg-[#ffffff] text-[black] z-[60]  flex flex-col justify-start items-start overflow-hidden" +
        (expand
          ? props?.APIError
            ? " mr-[0px] h-[140px] opacity-100"
            : " mr-[-100px] h-[140px] opacity-0"
          : props?.APIError
          ? " mr-[0px] h-[53px] opacity-100"
          : " mr-[-100px] h-[53px] opacity-0")
      }
      style={{ transition: ".2s" }}
    >
      <div className="w-full min-h-[50px] flex flex-col justify-start items-start overflow-hidden whitespace-nowrap px-[15px]">
        <div className="min-h-[50px] max-h-[50px] w-full flex justify-between items-center">
          <div className="flex justify-start items-center whitespace-nowrap text-[#EF4153] font-[DMSm] text-[15px]">
            <HugeiconsIcon
              className={" mr-[10px]  "}
              // onClick={() => {}}
              icon={SettingError04Icon}
              size={18}
              strokeWidth={2.2}
            />
            {props?.APIErrorMessage ? (
              <>Daily quota reached</>
            ) : (
              <>Encountered some error</>
            )}
          </div>

          <div className="flex justify-end items-center">
            <HugeiconsIcon
              className={
                " opacity-100 ml-[0px] cursor-pointer " +
                (props?.theme
                  ? " text-[#828282] hover:text-[#ffffff]"
                  : " text-[#797979] hover:text-[#000000]") +
                (expand ? " rotate-180 " : " rotate-0")
              }
              onClick={() => {
                setExpand(!expand);
              }}
              style={{ transition: ".3s" }}
              icon={ArrowDown01Icon}
              size={20}
              strokeWidth={1.8}
            />

            <HugeiconsIcon
              className={
                " opacity-100 ml-[10px] cursor-pointer " +
                (props?.theme
                  ? " text-[#828282] hover:text-[#ffffff]"
                  : " text-[#797979] hover:text-[#000000]")
              }
              onClick={() => {
                props?.setAPIError((prev) => false);
                props?.setAPIErrorMessage((prev) => "");
              }}
              icon={Cancel01Icon}
              size={14}
              strokeWidth={2.5}
            />
          </div>
        </div>
        <div
          className={
            "w-full h-auto  text-[13px] mb-[15px] mt-[-5px] pl-[28px] text-[#535353] whitespace-pre-wrap" +
            (expand ? " opacity-100" : " opacity-0")
          }
          style={{ transition: ".3s" }}
        >
          {props?.APIErrorMessage ? (
            <>
              Your daily quota for the Gemini Model{" "}
              <strong>{props?.currentModel}</strong> has been reached. Please
              try again after the quota resets or try with different model.
            </>
          ) : (
            <>
              An error occurred. Please try again later or consider using an
              alternative Gemini model.
            </>
          )}
        </div>
      </div>

      <div className="w-full min-h-[4px] mt-[-4px] flex justify-start items-center">
        <div
          className={
            "h-full bg-[#EF4153]  rounded-r-sm" +
            (props?.APIError ? " w-full" : " w-[0px]")
          }
          style={{ transition: " 10s" }}
        ></div>
      </div>
    </div>
  );
}
