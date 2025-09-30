import {
  Calendar,
  CircleHelp,
  FileArchive,
  FileSearch,
  GitFork,
  Map,
  Maximize,
  Minimize,
  NotebookPen,
  Settings,
  Terminal,
} from "lucide-react";
import React, { useState } from "react";
import SettingsPage from "./SettingsPage";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar03Icon,
  ChatBotIcon,
  File01Icon,
  FileZipIcon,
  MapsIcon,
  Robot01Icon,
  Setting07Icon,
  Settings01Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// import logoLight from "../assets/img/LogoLight.png";
// import logoDark from "../assets/img/logoDark.png";

const LeftSidebar = (props) => {
  const [isSettings, setIsSettings] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  function navigateToSection(section) {
    navigate(
      `/user/welcomeUser/user?ID=${
        searchParams.get("ID")?.split("?section=")[0]
      }?section=${section}`
    );
  }
  function navigateToSettings(section) {
    navigate(
      `/user/welcomeUser/user?ID=${
        searchParams.get("ID")?.split("?section=")[0]
      }?section=${section}%${searchParams.get("ID")?.split("?section=")[1]}`
    );
  }
  return (
    <>
      {searchParams
        .get("ID")
        ?.split("?section=")[1]
        .split("_")[0]
        .split("%")[0] == "Settings" ? (
        <>
          <SettingsPage
            theme={props?.theme}
            isSettings={isSettings}
            setIsSettings={setIsSettings}
          />
        </>
      ) : (
        <></>
      )}
      <div
        className={
          "w-full h-[60px] flex md:hidden lg:hidden justify-evenly items-center  tex-black fixed left-0 bottom-0 z-50 " +
          (props?.theme
            ? " bg-[#141414] text-[#9ba6aa]"
            : " bg-white text-[#6e6e7c]")
        }
      >
        <FileSearch
          width={20}
          height={20}
          strokeWidth="1.8"
          className={
            "cursor-pointer" +
            (props?.theme
              ? searchParams.get("ID")?.split("?section=")[1] == "Notes"
                ? " text-[#ffffff]"
                : " hover:text-[#ffffff]"
              : searchParams.get("ID")?.split("?section=")[1] == "Notes"
              ? " text-[#1e1e1ee4]"
              : " hover:text-[#1e1e1ee4]")
          }
          onClick={() => {
            navigateToSection("Notes");
          }}
        />
        <FileArchive
          width={20}
          height={20}
          strokeWidth="1.8"
          className={
            "cursor-pointer" +
            (props?.theme
              ? searchParams.get("ID")?.split("?section=")[1] ==
                "Archived_Notes"
                ? " text-[#ffffff]"
                : " hover:text-[#ffffff]"
              : searchParams.get("ID")?.split("?section=")[1] ==
                "Archived_Notes"
              ? " text-[#1e1e1ee4]"
              : " hover:text-[#1e1e1ee4]")
          }
          onClick={() => {
            navigateToSection("Archived_Notes");
          }}
        />
        <Map
          width={20}
          height={20}
          strokeWidth="1.8"
          className={
            "cursor-pointer" +
            (props?.theme
              ? searchParams.get("ID")?.split("?section=")[1] == "Roadmaps"
                ? " text-[#ffffff]"
                : " hover:text-[#ffffff]"
              : searchParams.get("ID")?.split("?section=")[1] == "Roadmaps"
              ? " text-[#1e1e1ee4]"
              : " hover:text-[#1e1e1ee4]")
          }
          onClick={() => {
            navigateToSection("Roadmaps");
          }}
        />
        <Calendar
          width={20}
          height={20}
          strokeWidth="1.8"
          className={
            "cursor-pointer" +
            (props?.theme
              ? searchParams.get("ID")?.split("?section=")[1] == "Calender"
                ? " text-[#ffffff]"
                : " hover:text-[#ffffff]"
              : searchParams.get("ID")?.split("?section=")[1] == "Calender"
              ? " text-[#1e1e1ee4]"
              : " hover:text-[#1e1e1ee4]")
          }
          onClick={() => {
            navigateToSection("Calender");
          }}
        />
        <Terminal
          width={20}
          height={20}
          strokeWidth="1.8"
          className={
            "cursor-pointer" +
            (props?.theme
              ? searchParams.get("ID")?.split("?section=")[1] == "Terminal"
                ? " text-[#ffffff]"
                : " hover:text-[#ffffff]"
              : searchParams.get("ID")?.split("?section=")[1] == "Terminal"
              ? " text-[#1e1e1ee4]"
              : " hover:text-[#1e1e1ee4]")
          }
          onClick={() => {
            navigateToSection("Terminal");
          }}
        />
        <Settings
          width={20}
          height={20}
          strokeWidth="1.8"
          className={
            " cursor-pointer" +
            (props?.theme ? " hover:text-[#ffffff]" : " hover:text-[#1e1e1ee4]")
          }
          onClick={() => {
            navigateToSettings("Settings");
            setIsSettings(!isSettings);
          }}
        />
      </div>
      <div
        className={
          "h-full min-w-[50px] hidden md:flex lg:flex flex-col justify-start items-center  " +
          (props?.isMinimise
            ? " border-r-[1.5px] border-[#25252500]"
            : " border-r-[1.5px] border-[#25252500]") +
          (props?.theme
            ? " bg-[#141414] text-[#9ba6aa]"
            : " bg-[#ffffff00] text-[#6e6e7c]")
        }
        style={{ transitionDelay: props?.isMinimise ? ".3s" : "0s" }}
      >
        {/* <img
          className="w-[20px] aspect-square my-[15px]"
          src={props?.theme ? logoDark : logoLight}
        ></img> */}
        <div className="w-full h-[40px] border-b-[1.5px] border-[#25252500] flex justify-center items-center">
          <div className="">
            {props?.isMinimise ? (
              <>
                {/* <Maximize
                  width={20}
                  height={20}
                  strokeWidth="1.8"
                  className={
                    " cursor-pointer" +
                    (props?.theme
                      ? " hover:text-[#ffffff]"
                      : " hover:text-[#1e1e1ee4]")
                  }
                  onClick={() => {
                    props?.setIsMinimise(!props?.isMinimise);
                  }}
                /> */}
                <HugeiconsIcon
                  className={
                    " cursor-pointer" +
                    (props?.theme
                      ? " hover:text-[#ffffff]"
                      : " hover:text-[#1e1e1ee4]")
                  }
                  onClick={() => {
                    props?.setIsMinimise(!props?.isMinimise);
                  }}
                  icon={SidebarRight01Icon}
                  size={22}
                  strokeWidth={1.8}
                />
              </>
            ) : (
              <>
                {/* <Minimize
                  width={20}
                  height={20}
                  strokeWidth="1.8"
                  className={
                    " cursor-pointer" +
                    (props?.theme
                      ? " hover:text-[#ffffff]"
                      : " hover:text-[#1e1e1ee4]")
                  }
                  onClick={() => {
                    props?.setIsMinimise(!props?.isMinimise);
                  }}
                /> */}
                <HugeiconsIcon
                  className={
                    " cursor-pointer" +
                    (props?.theme
                      ? " hover:text-[#ffffff]"
                      : " hover:text-[#1e1e1ee4]")
                  }
                  onClick={() => {
                    props?.setIsMinimise(!props?.isMinimise);
                  }}
                  icon={SidebarLeft01Icon}
                  size={22}
                  strokeWidth={1.8}
                />
              </>
            )}
          </div>
        </div>
        <div
          className={
            "h-[calc(100%-40px)] w-[50px] flex flex-col justify-between items-center py-[18px] border-r-[1.5px] border-[#25252500]" +
            (props?.theme ? " bg-[#141414]" : " bg-[#ffffff00]")
          }
        >
          <div className="flex flex-col justify-start items-center w-full">
            <div className="group w-[50px] h-[40px] flex justify-start items-center overflow-visible">
              <div
                className={
                  "min-w-[50px] h-full flex justify-center items-center cursor-pointer" +
                  (props?.theme
                    ? searchParams.get("ID")?.split("?section=")[1] == "Notes"
                      ? " text-[#ffffff]"
                      : " hover:text-[#ffffff]"
                    : searchParams.get("ID")?.split("?section=")[1] == "Notes"
                    ? " text-[#1e1e1ee4]"
                    : " hover:text-[#1e1e1ee4]")
                }
                onClick={() => {
                  navigateToSection("Notes");
                }}
              >
                <HugeiconsIcon icon={File01Icon} size={20} strokeWidth={1.6} />
              </div>
              <div
                className={
                  "hidden ml-[-10px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Notes
              </div>
            </div>
            <div className="group w-[50px] h-[40px] flex justify-start items-center overflow-visible">
              <div
                className={
                  "min-w-[50px] h-full flex justify-center items-center cursor-pointer" +
                  (props?.theme
                    ? searchParams.get("ID")?.split("?section=")[1] ==
                      "Archived_Notes"
                      ? " text-[#ffffff]"
                      : " hover:text-[#ffffff]"
                    : searchParams.get("ID")?.split("?section=")[1] ==
                      "Archived_Notes"
                    ? " text-[#1e1e1ee4]"
                    : " hover:text-[#1e1e1ee4]")
                }
                onClick={() => {
                  navigateToSection("Archived_Notes");
                }}
              >
                <HugeiconsIcon icon={FileZipIcon} size={20} strokeWidth={1.6} />
              </div>

              <div
                className={
                  "hidden ml-[-10px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Archived notes
              </div>
            </div>
            <div className="group w-[50px] h-[40px] flex justify-start items-center overflow-visible">
              <div
                className={
                  "min-w-[50px] h-full flex justify-center items-center cursor-pointer" +
                  (props?.theme
                    ? searchParams.get("ID")?.split("?section=")[1] ==
                      "Roadmaps"
                      ? " text-[#ffffff]"
                      : " hover:text-[#ffffff]"
                    : searchParams.get("ID")?.split("?section=")[1] ==
                      "Roadmaps"
                    ? " text-[#1e1e1ee4]"
                    : " hover:text-[#1e1e1ee4]")
                }
                onClick={() => {
                  navigateToSection("Roadmaps");
                }}
              >
                <HugeiconsIcon icon={MapsIcon} size={20} strokeWidth={1.6} />
              </div>

              <div
                className={
                  "hidden ml-[-10px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Roadmaps & tasks
              </div>
            </div>
            <div className="group w-[50px] h-[40px] flex justify-start items-center overflow-visible">
              <div
                className={
                  "min-w-[50px] h-full flex justify-center items-center cursor-pointer" +
                  (props?.theme
                    ? searchParams.get("ID")?.split("?section=")[1] ==
                      "Calender"
                      ? " text-[#ffffff]"
                      : " hover:text-[#ffffff]"
                    : searchParams.get("ID")?.split("?section=")[1] ==
                      "Calender"
                    ? " text-[#1e1e1ee4]"
                    : " hover:text-[#1e1e1ee4]")
                }
                onClick={() => {
                  navigateToSection("Calender");
                }}
              >
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={20}
                  strokeWidth={1.6}
                />
              </div>

              <div
                className={
                  "hidden ml-[-10px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Upcoming events
              </div>
            </div>
            <div className="group w-[50px] h-[40px] flex justify-start items-center overflow-visible">
              <div
                className={
                  "min-w-[50px] h-full flex justify-center items-center cursor-pointer" +
                  (props?.theme
                    ? searchParams.get("ID")?.split("?section=")[1] ==
                      "Terminal"
                      ? " text-[#ffffff]"
                      : " hover:text-[#ffffff]"
                    : searchParams.get("ID")?.split("?section=")[1] ==
                      "Terminal"
                    ? " text-[#1e1e1ee4]"
                    : " hover:text-[#1e1e1ee4]")
                }
                onClick={() => {
                  navigateToSection("Terminal");
                }}
              >
                <HugeiconsIcon icon={Robot01Icon} size={20} strokeWidth={1.6} />
              </div>

              <div
                className={
                  "hidden ml-[-10px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                AI assistant & agent
              </div>
            </div>

            {/* <FileSearch
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (props?.theme
                  ? searchParams.get("ID")?.split("?section=")[1] == "Notes"
                    ? " text-[#ffffff]"
                    : " hover:text-[#ffffff]"
                  : searchParams.get("ID")?.split("?section=")[1] == "Notes"
                  ? " text-[#1e1e1ee4]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSection("Notes");
              }}
            /> 
            <FileArchive
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (props?.theme
                  ? searchParams.get("ID")?.split("?section=")[1] ==
                    "Archived_Notes"
                    ? " text-[#ffffff]"
                    : " hover:text-[#ffffff]"
                  : searchParams.get("ID")?.split("?section=")[1] ==
                    "Archived_Notes"
                  ? " text-[#1e1e1ee4]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSection("Archived_Notes");
              }}
            />
            <Map
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (props?.theme
                  ? searchParams.get("ID")?.split("?section=")[1] == "Roadmaps"
                    ? " text-[#ffffff]"
                    : " hover:text-[#ffffff]"
                  : searchParams.get("ID")?.split("?section=")[1] == "Roadmaps"
                  ? " text-[#1e1e1ee4]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSection("Roadmaps");
              }}
            />
            <Calendar
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (props?.theme
                  ? searchParams.get("ID")?.split("?section=")[1] == "Calender"
                    ? " text-[#ffffff]"
                    : " hover:text-[#ffffff]"
                  : searchParams.get("ID")?.split("?section=")[1] == "Calender"
                  ? " text-[#1e1e1ee4]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSection("Calender");
              }}
            />
            <Terminal
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (props?.theme
                  ? searchParams.get("ID")?.split("?section=")[1] == "Terminal"
                    ? " text-[#ffffff]"
                    : " hover:text-[#ffffff]"
                  : searchParams.get("ID")?.split("?section=")[1] == "Terminal"
                  ? " text-[#1e1e1ee4]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSection("Terminal");
              }}
            />*/}
          </div>
          <div className="flex flex-col justify-end items-center w-full">
            {/* <CircleHelp
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "mb-[18px]  cursor-pointer" +
                (props?.theme
                  ? " hover:text-[#ffffff]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSection("Help");
              }}
            />
            <Settings
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                " cursor-pointer" +
                (props?.theme
                  ? " hover:text-[#ffffff]"
                  : " hover:text-[#1e1e1ee4]")
              }
              onClick={() => {
                navigateToSettings("Settings");
                setIsSettings(!isSettings);
              }}
            /> */}
            <div className="group w-[50px] h-[40px] flex justify-start items-center overflow-visible">
              <div
                className={
                  "min-w-[50px] h-full flex justify-center items-center cursor-pointer" +
                  (props?.theme
                    ? " hover:text-[#ffffff]"
                    : " hover:text-[#1e1e1ee4]")
                }
                onClick={() => {
                  navigateToSettings("Settings");
                  setIsSettings(!isSettings);
                }}
              >
                <HugeiconsIcon
                  icon={Setting07Icon}
                  size={20}
                  strokeWidth={1.6}
                />
              </div>

              <div
                className={
                  "hidden ml-[-10px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Settings
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
