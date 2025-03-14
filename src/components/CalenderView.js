import { Moon } from "lucide-react";
import { getMonthCalendar } from "../utils/functions";
import {
  dayNamesShort,
  monthNamesShort,
  monthNamesLong,
} from "../utils/constant";

import { ChevronDown, Plus } from "lucide-react";

export default function CalenderView(props) {
  //   const navigate = useNavigate();

  //   function navigateToSection(section) {
  //     navigate(`/user/welcomeUser/events?date=${section}`);
  //   }
  return (
    <>
      <div className="w-full h-full border-[1.5px] border-[#ededed] rounded-lg py-[15px] flex-col justify-start items-start pb-[0px] font-[geistRegular] ">
        <div className="flex w-full h-[50px] justify-between items-center px-[15px] ">
          <div className="flex justify-start items-center h-full">
            <div className="flex flex-col  border-[1.5px] border-[#ededed] rounded-[8px] h-full w-[60px] overflow-hidden ">
              <div className="w-full h-[23px] flex justify-center items-center font-[geistSemibold] bg-[#2C2C2E] text-[#7b7b7b] text-[12px]">
                {monthNamesShort[new Date().getMonth()]?.toUpperCase()}
              </div>
              <div className="w-full h-[27px] flex justify-center items-center text-[white] font-[geistBold] text-[18px]">
                {new Date().getDate()}
              </div>
            </div>
            <div className=" flex-col ml-[18px] h-full justify-center items-start hidden md:flex lg:flex">
              <div className="text-[18px] font-[geistBold] text-[white]">
                {monthNamesLong[new Date().getMonth()]},{" "}
                {new Date().getFullYear()}
              </div>
              <div className="text-[13px] text-[#7b7b7b] font-[geistRegular] mt-[-2px]">
                {monthNamesShort[new Date().getMonth()]} 1,{" "}
                {new Date().getFullYear()} -{" "}
                {monthNamesShort[new Date().getMonth()]}{" "}
                {new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0
                ).getDate()}
                , {new Date().getFullYear()}
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center h-full ">
            <div className="flex border-[1.5px] border-[#ededed] text-white justify-between items-center  px-[10px] h-[35px] rounded-[8px] cursor-pointer w-[130px]">
              <span className="mr-[8px] ml-[3px] text-[14px]">
                {monthNamesLong[new Date().getMonth()]}
              </span>
              <ChevronDown width={20} height={20} strokeWidth={2.4} />
            </div>
            <div className="flex border-[1.5px] border-[#ededed] text-white justify-between items-center  px-[10px] h-[35px] rounded-[8px] cursor-pointer ml-[10px] w-[100px]">
              <span className="mr-[8px] ml-[3px] text-[14px]">
                {new Date().getFullYear()}
              </span>
              <ChevronDown width={20} height={20} strokeWidth={2.4} />
            </div>
            <div className=""></div>
            <div
              className="flex justify-center items-center  px-[10px] h-[35px] rounded-[8px] ml-[10px] bg-[#0b5077] text-[white] cursor-pointer"
              onClick={() => {
                props?.setToggleAddEventModal(!props?.toggleAddEventModal);
              }}
            >
              <Plus width={18} height={18} strokeWidth={2.4} />
              <span className="ml-[8px] mr-[3px] text-[14px]">Add Events</span>
            </div>
          </div>
        </div>
        <div className="w-full border-y-[1.5px] border-[#ededed] h-[35px] mt-[15px] flex justify-normal items-center">
          {dayNamesShort?.map((data, index) => {
            return (
              <div
                key={data}
                className={
                  "w-[calc(100%/7)] h-full flex justify-center font-[IinterSemibold] items-center text-[14px] text-[#A7A7A7]" +
                  (index == 0
                    ? " border-l-[0px] border-[#ffffff]"
                    : " border-l-[1.5px] border-[#ededed]")
                }
              >
                {data}
              </div>
            );
          })}
        </div>
        {getMonthCalendar(2024, 12)?.map((data, index) => {
          return (
            <div
              key={index}
              className={
                `w-full flex justify-start items-center ` +
                (index == 0
                  ? " border-t-[0px] border-[#ffffff]"
                  : " border-t-[1.5px] border-[#ededed]")
              }
              style={{
                height: `calc((100% - 100px) / ${
                  getMonthCalendar(2024, 12)?.length
                })`,
              }}
            >
              {data?.map((dataa, indexx) => {
                return (
                  <div
                    key={dataa?.date}
                    className={
                      "w-[calc(100%/7)] h-full flex flex-col justify-center items-center text-[14px] cursor-pointer " +
                      (indexx == 0
                        ? " border-l-[0px] border-[#ffffff]"
                        : " border-l-[1.5px] border-[#ededed]")
                    }
                    onClick={() => {
                      //   navigateToSection("11-12-2024");
                    }}
                  >
                    <div className="w-full flex justify-start items-center px-[10px] h-[20px] text-[#ffffff] font-[IinterSemibold] pt-[7px]">
                      {dataa?.date == -1 ? <></> : <>{dataa?.date}</>}
                    </div>
                    {dataa?.date == -1 ? (
                      <></>
                    ) : (
                      <>
                        <div className="w-full h-[calc(100%-20px)] flex flex-col justify-start items-start p-[10px]  text-[#b3b3b3]">
                          {indexx == 5 && index == 2 ? (
                            <>
                              <div className="bg-[#2C2C2E] mt-[3px] h-[24px] w-full rounded-[6px] flex justify-start items-center p-[7px] py-[6px]">
                                <div className="h-full w-[3px] rounded-full bg-[white] mr-[7px]"></div>
                                <div className="w-[calc(100%-10px)] text-[12px] hover:text-[white] cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden ">
                                  09:00 - Ecstasia 2024, UEM Kolkata
                                </div>
                              </div>
                            </>
                          ) : indexx == 2 && index == 3 ? (
                            <>
                              <div className="bg-[#2C2C2E] mt-[3px] h-[24px] w-full rounded-[6px] flex justify-start items-center p-[7px] py-[6px]">
                                <div className="h-full w-[3px] rounded-full bg-[white] mr-[7px]"></div>
                                <div className="w-[calc(100%-10px)] text-[12px] hover:text-[white] cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden ">
                                  09:00 - Ecstasia 2024, UEM Kolkata
                                </div>
                              </div>
                              <div className="bg-[#2C2C2E] mt-[3px] h-[24px] w-full rounded-[6px] flex justify-start items-center p-[7px] py-[6px]">
                                <div className="h-full w-[3px] rounded-full bg-[white] mr-[7px]"></div>
                                <div className="w-[calc(100%-10px)] text-[12px] hover:text-[white] cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden ">
                                  09:00 - Ecstasia 2024, UEM Kolkata
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
