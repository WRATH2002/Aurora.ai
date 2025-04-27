import {
  Command,
  FilePenLine,
  Key,
  LogOut,
  Moon,
  PaintbrushVertical,
  PenTool,
  UserPen,
  X,
} from "lucide-react";
import React, { useState } from "react";
import EditToolbar from "./EditToolbar";
import ProfileSettings from "./ProfileSettings";
import AppearanceSettings from "./AppearanceSettings";
import HotKeysSettings from "./HotKeysSettings";
import APIKeyAdd from "./APIKeyAdd";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import AccountPage from "./AccountPage";
import { useNavigate, useSearchParams } from "react-router-dom";

function SettingsPage(props) {
  const [section, setSection] = useState("");

  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log("Signed Out Successfully"))
      .catch((error) => console.log(error));
  };

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  function navigateBack() {
    navigate(
      `/user/welcomeUser/user?ID=${
        searchParams.get("ID")?.split("?section=")[0]
      }?section=${
        searchParams
          .get("ID")
          ?.split("?section=")[1]
          .split("_")[0]
          .split("%")[1]
      }`
    );
  }

  function navigateToSettingsSection(section) {
    navigate(
      `/user/welcomeUser/user?ID=${
        searchParams.get("ID")?.split("?section=")[0]
      }?section=${
        searchParams.get("ID")?.split("?section=")[1].split("_")[0]
      }_${section}`
    );
  }

  return (
    <div
      className={
        "w-full h-full fixed left-0 top-0 text-[14px] font-[DMSr] flex justify-center items-center z-[800]  backdrop-blur-[5px]  " +
        (props?.theme ? " bg-[#161b1e5c]" : " bg-[#b0b0b081]")
      }
      // style={{ transform: "translate(-50%,-50%)" }}
    >
      <div
        className={
          "w-[100%] h-[100%] md:w-[70%] md:h-[80%] lg:w-[70%] lg:h-[80%] rounded-none md:rounded-xl lg:rounded-xl  fixed left-[50%] top-[50%] text-[15px] md:text-[14px] lg:text-[14px] font-[DMSr] flex justify-start items-start z-20 boxShadowLight2" +
          (props?.theme
            ? " text-[#9ba6aa] bg-[#1A1A1A] border-[2px] border-[#222d37]"
            : " text-[#9999aa] bg-[#ffffff] border-[2px] border-[#d4d4d400]")
        }
        style={{ transform: "translate(-50%,-50%)" }}
      >
        <div
          className={
            "w-full md:w-[200px] lg:w-[200px] h-full border-r-[2px]  p-[20px] md:p-[30px] lg:p-[30px] fixed md:static lg:static flex flex-col justify-start items-start" +
            (props?.theme
              ? " border-[#222d3700] md:border-[#222d37] lg:border-[#222d37]"
              : " border-[#eaeaea00] md:border-[#eaeaea6f] lg:border-[#eaeaea6f]")
          }
        >
          <div
            className={
              "w-[30px] h-[30px] cursor-pointer rounded-full flex justify-center items-center mb-[20px]" +
              (props?.theme
                ? " hover:bg-[#222222] text-[#9ba6aa] hover:text-[white]"
                : " hover:bg-[#eaebf4] text-[#9999aa] hover:text-[black]")
            }
            onClick={() => {
              navigateBack();
              props?.setIsSettings(false);
            }}
          >
            <X width={18} height={18} strokeWidth={2.1} />
          </div>
          <div className="flex flex-col justify-start items-start w-full h-[calc(100%-110px)]">
            <button
              className={
                "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[30px] max-h-[30px] md:min-h-[27px] md:max-h-[27px] lg:min-h-[27px] lg:max-h-[27px] my-[1.5px] group " +
                (section == "Account"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme
                  ? " hover:bg-[#222222] hover:text-[white]"
                  : " hover:bg-[#eaebf4] hover:text-[black]")
              }
              onClick={() => {
                navigateToSettingsSection("Account");
                setSection("Account");
              }}
            >
              <UserPen
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              Account
            </button>
            <button
              className={
                "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[30px] max-h-[30px] md:min-h-[27px] md:max-h-[27px] lg:min-h-[27px] lg:max-h-[27px] my-[1.5px] group " +
                (section == "Editor"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme
                  ? " hover:bg-[#222222] hover:text-[white]"
                  : " hover:bg-[#eaebf4] hover:text-[black]")
              }
              onClick={() => {
                navigateToSettingsSection("Editor");
                setSection("Editor");
              }}
            >
              <FilePenLine
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              Editor
            </button>
            <button
              className={
                "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[30px] max-h-[30px] md:min-h-[27px] md:max-h-[27px] lg:min-h-[27px] lg:max-h-[27px] my-[1.5px] group " +
                (section == "Toolbar"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme
                  ? " hover:bg-[#222222] hover:text-[white]"
                  : " hover:bg-[#eaebf4] hover:text-[black]")
              }
              onClick={() => {
                navigateToSettingsSection("Toolbar");
                setSection("Toolbar");
              }}
            >
              <PenTool
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              Toolbar
            </button>
            <button
              className={
                "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[30px] max-h-[30px] md:min-h-[27px] md:max-h-[27px] lg:min-h-[27px] lg:max-h-[27px] my-[1.5px] group " +
                (section == "Appearance"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme
                  ? " hover:bg-[#222222] hover:text-[white]"
                  : " hover:bg-[#eaebf4] hover:text-[black]")
              }
              onClick={() => {
                navigateToSettingsSection("Appearance");
                setSection("Appearance");
              }}
            >
              <PaintbrushVertical
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              Appearance
            </button>
            <button
              className={
                "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[30px] max-h-[30px] md:min-h-[27px] md:max-h-[27px] lg:min-h-[27px] lg:max-h-[27px] my-[1.5px] group " +
                (section == "API Key"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme
                  ? " hover:bg-[#222222] hover:text-[white]"
                  : " hover:bg-[#eaebf4] hover:text-[black]")
              }
              onClick={() => {
                navigateToSettingsSection("API-Key");
                setSection("API-Key");
              }}
            >
              <Key
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              API Key
            </button>
            <button
              className={
                "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[30px] max-h-[30px] md:min-h-[27px] md:max-h-[27px] lg:min-h-[27px] lg:max-h-[27px] my-[1.5px] group " +
                (section == "Hot Keys"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme
                  ? " hover:bg-[#222222] hover:text-[white]"
                  : " hover:bg-[#eaebf4] hover:text-[black]")
              }
              onClick={() => {
                navigateToSettingsSection("Hot-Keys");
                setSection("Hot-Keys");
              }}
            >
              <Command
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              Hot Keys
            </button>
            {/* <span
              className={
                "  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[27px] max-h-[27px] my-[1.5px] group mt-[30px] " +
                (section == "Log Out"
                  ? props?.theme
                    ? " bg-[#222222] text-[white]"
                    : " bg-[#eaebf4] text-[black]"
                  : props?.theme
                  ? " bg-[#6e52da00] text-[#9ba6aa]"
                  : " bg-[#6e52da00] text-[#9999aa]") +
                (props?.theme ? " hover:text-[white]" : " hover:text-[black]")
              }
              onClick={() => {
                // setSection("Log Out");
                userSignOut();
              }}
            >
              <LogOut
                width={16}
                height={16}
                strokeWidth={2}
                className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
              />{" "}
              Log Out
            </span> */}
          </div>
          <button
            className={
              "outline-none  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[27px] max-h-[27px] my-[1.5px] group " +
              (section == "Log Out"
                ? props?.theme
                  ? " bg-[#222222] text-[white]"
                  : " bg-[#eaebf4] text-[black]"
                : props?.theme
                ? " bg-[#6e52da00] text-[#9ba6aa]"
                : " bg-[#6e52da00] text-[#9999aa]") +
              (props?.theme ? " hover:text-[white]" : " hover:text-[black]")
            }
            onClick={() => {
              // setSection("Log Out");
              userSignOut();
            }}
          >
            <LogOut
              width={16}
              height={16}
              strokeWidth={2}
              className="mr-[10px] md:mr-[10px] lg:mr-[10px] w-[18px] h-[18px] md:w-[16px] md:h-[16px] lg:w-[16px] lg:h-[16px]"
            />{" "}
            Log Out
          </button>
          <span
            className={
              "text-[12px] tracking-widest rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[27px] max-h-[27px] my-[1.5px] group " +
              (props?.theme
                ? " bg-[#6e52da00] text-[#636c70]"
                : " bg-[#6e52da00] text-[#9999aa]")
            }
          >
            v 1.0.1.2
          </span>
        </div>
        <div
          className={
            " h-full pl-[30px] flex-col justify-start items-start pr-[2px] fixed md:static lg:static " +
            (searchParams.get("ID")?.split("?section=")[1].includes("_")
              ? " w-full flex md:w-[calc(100%-200px)] lg:w-[calc(100%-200px)]"
              : " w-full hidden md:flex lg:flex md:w-[calc(100%-200px)] lg:w-[calc(100%-200px)]") +
            (props?.theme ? " bg-[#1A1A1A]" : " bg-[#ffffff]")
          }
        >
          {searchParams.get("ID")?.split("?section=")[1]?.split("_")[1] ==
          "Account" ? (
            <>
              <AccountPage theme={props?.theme} />
            </>
          ) : searchParams.get("ID")?.split("?section=")[1]?.split("_")[1] ==
            "Editor" ? (
            <>
              <EditToolbar theme={props?.theme} />
            </>
          ) : searchParams.get("ID")?.split("?section=")[1]?.split("_")[1] ==
            "Appearance" ? (
            <>
              <AppearanceSettings theme={props?.theme} />
            </>
          ) : searchParams.get("ID")?.split("?section=")[1]?.split("_")[1] ==
            "API-Key" ? (
            <>
              <APIKeyAdd theme={props?.theme} />
            </>
          ) : searchParams.get("ID")?.split("?section=")[1]?.split("_")[1] ==
            "Hot-Keys" ? (
            <>
              <HotKeysSettings theme={props?.theme} />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
