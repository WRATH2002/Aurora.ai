import { CircleMinus, Menu, Mic } from "lucide-react";
import React from "react";
import { toolbarItems } from "../utils/constant";
import IconPack from "./IconPack";

export default function HotKeysSettings() {
  return (
    <div className="w-full h-full flex flex-col justify-start items-start text-[14px] overflow-y-scroll pr-[25px] z-50">
      <div className="w-full flex justify-start items-start mb-[45px] mt-[30px]">
        <div className="flex flex-col justify-start items-start w-full ">
          <div className="text-[white] text-[17px] ">
            Configure Editor Toolbar Arrangement
          </div>
          <div className="text-[14px] ">
            Configure your toolbar by arranging tools using the drag-and-drop
            functionality below. You can choose to enable or remove tools as
            needed. To revert to the default toolbar configuration, click
            'Reset'.
          </div>
        </div>
        {/* <div className="flex justify-center items-center cursor-pointer hover:bg-[#4b4b4b] bg-[#363636] text-[white] rounded-[6px] w-[65px] h-[30px]">
          Reset
        </div> */}
      </div>
      {toolbarItems?.map((data, index) => {
        return (
          <div
            key={data?.id}
            className="w-full min-h-[30px] flex justify-between items-center"
          >
            <div className="flex justify-start items-center">
              {/* <CircleMinus
                width={18}
                height={18}
                strokeWidth="2.2"
                className="text-[#a60000] mr-[10px] cursor-pointer"
              /> */}
              <IconPack data={data} />

              <span>{data?.itemName}</span>
            </div>
            <div className="flex justify-end items-center">
              <Menu
                width={18}
                height={18}
                strokeWidth="2.2"
                className="cursor-pointer"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
