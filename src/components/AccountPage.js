import { Cctv, Fingerprint, UserPen } from "lucide-react";
import React from "react";

export default function AccountPage(props) {
  return (
    <>
      <div
        className={
          "w-full h-full flex flex-col justify-start items-start text-[14px] overflow-y-scroll pr-[25px] pt-[30px] z-50" +
          (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
        }
      >
        <div
          className={
            "text-[17px] flex justify-start items-center" +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          <UserPen
            width={20}
            height={20}
            strokeWidth={2.2}
            className="mr-[10px]"
          />
          Profile
        </div>
        <div className="mt-[20px]">Avatar</div>
        <div className=" flex justify-start items-center">
          <div className="min-w-[70px] max-w-[70px] aspect-square rounded-full bg-[#00000025] "></div>
        </div>
        <div
          className={
            "mt-[20px]" + (props?.theme ? " text-white" : " text-black")
          }
        >
          Name
        </div>
        <div className={"mt-[0px]"}>Please enter your full name</div>
        <div className="w-full flex justify-start items-center  mt-[10px] ">
          <input
            className={
              "w-[200px] h-[35px] rounded-lg border-[1.5px] text-[14px] flex justify-start items-center outline-none px-[12px]" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
            value={"Himadri Purkait"}
          ></input>
          <div
            className={
              "px-[12px] h-[35px] rounded-lg bg-[#f0f0f0] hover:bg-[#d9d9d9] flex justify-center items-center ml-[15px] cursor-pointer opacity-50" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
          >
            Save
          </div>
        </div>
        <div
          className={
            "mt-[20px]" + (props?.theme ? " text-white" : " text-black")
          }
        >
          Email
        </div>
        <div className={"mt-[0px]"}>Please enter your full name</div>
        <div className="w-full flex justify-start items-center  mt-[10px] ">
          <input
            className={
              "w-[200px] h-[35px] rounded-lg border-[1.5px] text-[14px] flex justify-start items-center outline-none px-[12px]" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
            value={"Himadri Purkait"}
          ></input>
          <div
            className={
              "px-[12px] h-[35px] rounded-lg bg-[#f0f0f0] hover:bg-[#d9d9d9] flex justify-center items-center ml-[15px] cursor-pointer opacity-50" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
          >
            Save
          </div>
        </div>
        <div
          className={
            "text-[17px] flex justify-start items-center mt-[70px]" +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          <Cctv
            width={20}
            height={20}
            strokeWidth={2.2}
            className="mr-[10px]"
          />
          Account Security
        </div>
        <div className="flex justify-start items-center mt-[6px]">
          {/* <TriangleAlert
            width={16}
            height={16}
            strokeWidth={2.2}
            className="text-[#FFA217] mr-[9px]"
          /> */}
          Set up security measure for better protection
        </div>
      </div>
    </>
  );
}
