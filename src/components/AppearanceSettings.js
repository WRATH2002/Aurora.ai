import { ChevronDown, Moon, Sun, SunDim, SunMedium } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";

export default function AppearanceSettings(props) {
  const [themeDropdown, setThemeDropdown] = useState(false);
  const [appFontDropdown, setAppFontDropdown] = useState(false);
  const [editorFontDropdown, setEditorFontDropdown] = useState(false);
  const [theme, setTheme] = useState(false);

  function toggleTheme() {
    const user = firebase.auth().currentUser;
    const docRef = db.collection("user").doc(user?.uid);
    docRef.update({
      Theme: !theme,
    });
    console.log("Note saved successfully!");
  }

  function fetchTheme() {
    const user = firebase.auth().currentUser;

    const channelRef = db.collection("user").doc(user?.uid);

    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
    });
  }

  useEffect(() => {
    fetchTheme();
  }, []);

  return (
    <div
      className={
        "w-full h-full flex flex-col justify-start items-start text-[14px] overflow-y-scroll pr-[25px] pt-[30px] z-50" +
        (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
      }
    >
      <div className="w-full flex flex-col justify-center items-start  mb-[-5px] overflow-visible">
        <div
          className={
            "text-[12px] uppercase" +
            (theme ? " text-[#9b98a3a8]" : " text-[#6e6e7c]")
          }
        >
          General
        </div>
        <div
          className={
            "w-[45px] h-[2px] rounded-full  mb-[20px]" +
            (theme ? " bg-[#9b98a3a8]" : " bg-[#9b98a3a8]")
          }
        ></div>
      </div>
      {/* <div className="w-full my-[8px] border-b-[2px] border-[#242424]"></div> */}
      <div className="w-full flex justify-between items-center  h-[45px] overflow-visible">
        <div className="flex flex-col justify-center items-start">
          <div className={"" + (theme ? " text-[white]" : " text-[black]")}>
            Baisc Color Scheme
          </div>
          <div className="text-[12px]">Choose your favourite theme</div>
        </div>
        <div className="flex h-[30px] justify-end items-center">
          <div className="w-[33px] h-[22px] flex flex-col justify-start items-center overflow-hidden mr-[5px] text-[white]">
            <div
              className={
                "w-full min-h-full flex justify-center items-center" +
                (!theme ? " mt-[0px]" : " mt-[-22px]") +
                (!theme ? " opacity-100" : " opacity-0")
              }
              style={{ transition: ".3s" }}
            >
              <Sun width={18} height={18} strokeWidth="2.2" className="" />
            </div>
            <div
              className={
                "w-full min-h-full flex justify-center items-center" +
                (!theme ? " opacity-0" : " opacity-100")
              }
              style={{ transition: ".3s" }}
            >
              <Moon width={18} height={18} strokeWidth="2.2" className="" />
            </div>
          </div>

          <div
            className={
              "w-[33px] h-[22px] rounded-full shadow-inner  flex justify-start items-center px-[2px] cursor-pointer" +
              (!theme ? " bg-[#141414]" : " bg-[#3a6f7754]")
            }
            onClick={() => {
              // setTheme(!theme);
              toggleTheme();
            }}
            style={{ transition: ".3s" }}
          >
            <div
              className={
                "w-[16px] aspect-square rounded-full drop-shadow-md  " +
                (!theme ? " ml-[1px] bg-[#222222]" : " ml-[11px] bg-[#3a6f77]")
              }
              style={{ transition: ".3s" }}
            ></div>
          </div>
        </div>
      </div>
      <div
        className={
          "w-full my-[8px] border-b-[2px] " +
          (theme ? " border-[#242424]" : " border-[#eaeaea6f]")
        }
      ></div>
      <div className="w-full flex justify-between items-center h-[45px] overflow-visible">
        <div className="flex flex-col justify-center items-start">
          <div className={"" + (theme ? " text-[white]" : " text-[black]")}>
            Accent Color
          </div>
          <div className="text-[12px]">
            Choose the accent color throughout the app
          </div>
        </div>
        <div></div>
      </div>
      <div
        className={
          "w-full my-[8px] border-b-[2px] " +
          (theme ? " border-[#242424]" : " border-[#eaeaea6f]")
        }
      ></div>
      <div className="w-full flex flex-col justify-center items-start mt-[20px] mb-[-5px] overflow-visible">
        <div className="text-[#9b98a3a8] text-[12px]">Font</div>
        <div className="w-[25px] h-[2px] rounded-full bg-[#9b98a3a8] mb-[20px] "></div>
      </div>
      {/* <div className="w-full my-[8px] border-b-[2px] border-[#242424]"></div> */}
      <div className="w-full flex justify-between items-center h-[45px] overflow-visible">
        <div className="flex flex-col justify-center items-start">
          <div className={"" + (theme ? " text-[white]" : " text-[black]")}>
            Default App Font
          </div>
          <div className="text-[12px]">
            This is the font applied throughout the app
          </div>
        </div>
        <div>
          <div
            className={
              "w-auto h-[30px] rounded-[6px] text-[14px] flex justify-center items-center px-[10px]  cursor-pointer" +
              (theme
                ? " hover:bg-[#38464d] bg-[#222222] text-[white]"
                : " bg-[#EAEBF4] hover:bg-[#d7daf1] text-[black]")
            }
          >
            Geist
            <ChevronDown
              width={18}
              height={18}
              strokeWidth="2.2"
              className="ml-[20px] mr-[-3px]"
            />
          </div>
        </div>
      </div>
      <div
        className={
          "w-full my-[8px] border-b-[2px] " +
          (theme ? " border-[#242424]" : " border-[#eaeaea6f]")
        }
      ></div>
      <div className="w-full flex justify-between items-center h-[45px] overflow-visible">
        <div className="flex flex-col justify-center items-start">
          <div className={"" + (theme ? " text-[white]" : " text-[black]")}>
            Default Editor Font
          </div>
          <div className="text-[12px]">
            This is the font applied to the text editor by default
          </div>
        </div>
        <div className="flex h-[30px] flex-col justify-start items-end">
          <div
            className={
              "w-auto min-h-[30px] rounded-[6px] text-[14px] flex justify-center items-center px-[10px]  cursor-pointer" +
              (theme
                ? " hover:bg-[#38464d] bg-[#222222] text-[white]"
                : " bg-[#EAEBF4] hover:bg-[#d7daf1] text-[black]")
            }
            onClick={() => {
              setThemeDropdown(!themeDropdown);
            }}
          >
            Geist
            <ChevronDown
              width={18}
              height={18}
              strokeWidth="2.2"
              className="ml-[20px] mr-[-3px]"
            />
          </div>
          <div
            className={
              "w-auto h-auto rounded-[6px] text-[14px] flex-col justify-start items-start mt-[5px] p-[5px]  bg-[#2d2d2d] text-[white] cursor-pointer z-20" +
              (themeDropdown ? " flex" : " hidden")
            }
          >
            <div
              className="w-auto h-[26px] rounded-[4px] text-[14px] flex justify-center items-center px-[10px] hover:bg-[#4b4b4b] bg-[#36363600] text-[#9b98a3] hover:text-[white] cursor-pointer"
              onClick={() => {
                setThemeDropdown(!themeDropdown);
              }}
            >
              <Moon
                width={15}
                height={15}
                strokeWidth="2.2"
                className="mr-[10px] ml-[-2px]"
              />
              Dark
              {/* <ChevronDown
                width={18}
                height={18}
                strokeWidth="2.2"
                className="ml-[20px] mr-[-3px]"
              /> */}
            </div>
            <div
              className="w-auto h-[26px] rounded-[4px] text-[14px] flex justify-center items-center px-[10px] hover:bg-[#4b4b4b] bg-[#36363600] text-[#9b98a3] hover:text-[white] cursor-pointer"
              onClick={() => {
                setThemeDropdown(!themeDropdown);
              }}
            >
              <Sun
                width={15}
                height={15}
                strokeWidth="2.2"
                className="mr-[10px] ml-[-2px]"
              />
              Light
              {/* <ChevronDown
                width={18}
                height={18}
                strokeWidth="2.2"
                className="ml-[20px] mr-[-3px]"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
