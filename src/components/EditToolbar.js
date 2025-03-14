import { CircleMinus, Menu, Mic } from "lucide-react";
import React from "react";
import { toolbarItems } from "../utils/constant";
import IconPack from "./IconPack";

export default function EditToolbar(props) {
  return (
    <div
      className={
        "w-full h-full flex flex-col justify-start items-start text-[14px] overflow-y-scroll pr-[25px] z-50" +
        (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
      }
    >
      <div className="w-full flex justify-start items-start mb-[45px] mt-[30px]">
        <div className="flex flex-col justify-start items-start w-[calc(100%-80px)] mr-[15px]">
          <div
            className={
              " text-[17px] " +
              (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
            }
          >
            Configure Editor Toolbar Arrangement
          </div>
          <div className="text-[14px] ">
            Configure your toolbar by arranging tools using the drag-and-drop
            functionality below. You can choose to enable or remove tools as
            needed. To revert to the default toolbar configuration, click
            'Reset'.
          </div>
        </div>
        <div className="flex justify-center items-center cursor-pointer hover:bg-[#4b4b4b] bg-[#363636] text-[white] rounded-[6px] w-[65px] h-[30px]">
          Reset
        </div>
      </div>
      <div className="text-[#6e6e7c] text-[14px] mb-[5px]">
        Mange your toolbar options
      </div>
      {toolbarItems?.map((data, index) => {
        return (
          <div
            key={data?.id}
            className="w-full min-h-[30px] flex justify-between items-center"
          >
            <div className="flex justify-start items-center">
              <CircleMinus
                width={18}
                height={18}
                strokeWidth="2.2"
                className="text-[#a60000] mr-[10px] cursor-pointer"
              />
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
