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
          "h-full w-[50px] hidden md:flex lg:flex flex-col justify-start items-center  " +
          (props?.isMinimise
            ? " border-r-[1.5px] border-[#25252500]"
            : " border-r-[0px] border-[#25252500]") +
          (props?.theme
            ? " bg-[#141414] text-[#9ba6aa]"
            : " bg-[#ffffff00] text-[#6e6e7c]")
        }
        style={{ transitionDelay: props?.isMinimise ? ".3s" : "0s" }}
      >
        <div className="w-full h-[40px] border-b-[1.5px] border-[#25252500] flex justify-center items-center">
          <div className="">
            {props?.isMinimise ? (
              <>
                <Maximize
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
                />
              </>
            ) : (
              <>
                <Minimize
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
            <FileSearch
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
            {/* <GitFork
          width={20}
          height={20}
          strokeWidth="1.8"
          className="mb-[18px] text-[#7b798b] hover:text-[#000000] cursor-pointer"
        /> */}
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
            />
          </div>
          <div className="flex flex-col justify-end items-center w-full">
            <CircleHelp
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
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebar;
