import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Copy,
  Ellipsis,
  Eye,
  EyeOff,
  HardDriveDownload,
  Info,
  Key,
  LocateFixed,
  MonitorDot,
  Plus,
  Radius,
  RotateCcw,
  Search,
  Trash,
  TriangleAlert,
  Undo2,
  X,
} from "lucide-react";
import React, { useState, useEffect, use } from "react";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import {
  getFormattedDateAndTime,
  processStringDecrypt,
  processStringEncrypt,
} from "../utils/functions";

import { ring2 } from "ldrs";

ring2.register();

// Default values shown

export default function APIKeyAdd(props) {
  const [addNewAPI, setAddNewAPI] = useState(false);
  const [showDeletedAPI, setShowDeletedAPI] = useState(false);
  const [newAPI, setNewAPI] = useState("");
  const [activeAPIKey, setActiveAPIKey] = useState("");
  const [allAPIKeys, setAllAPIKeys] = useState([]);
  const [deletedAPIKeys, setDeletedAPIKeys] = useState([]);
  const [settingsIndex, setSettingsIndex] = useState(-1);
  const [localStorage, setLocaleStorage] = useState(false);
  const [accountScoped, setAccountScoped] = useState(false);
  const [scopedAPIUsage, setScopedAPIUsage] = useState(false);
  const [scopedUserID, setScopedUserID] = useState("");
  const [storeAPILocally, setStoreAPILocally] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function toggleAddNewAPI() {
    if (addNewAPI) {
      setAddNewAPI(false);
      setNewAPI("");
    }
  }

  function checkAPIFormat(text) {
    if (text.includes(" ") || text?.length <= 0) {
      return false;
    } else {
      return true;
    }
  }

  function fetchAPIs() {
    const user = firebase.auth().currentUser;
    const channelRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys");

    onSnapshot(channelRef, (snapshot) => {
      setAllAPIKeys(snapshot?.data()?.AllAPIKeys);
      setDeletedAPIKeys(snapshot?.data()?.DeletedAPIKeys);
      setActiveAPIKey(snapshot?.data()?.ActiveAPIKey);
      setScopedAPIUsage(snapshot?.data()?.ScopedAPIUsage);
      setScopedUserID(snapshot?.data()?.ScopedUserID);
      setStoreAPILocally(snapshot?.data()?.StoreAPILocally);
    });
  }

  function toggleFirebaseScopedAPIUsage() {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        ScopedAPIUsage: !scopedAPIUsage,
      });
  }

  function toggleFirebaseStoreAPILocally() {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        StoreAPILocally: !storeAPILocally,
      });
  }

  useEffect(() => {
    fetchAPIs();
  }, []);

  function addNewAPIKeyToFirebase(apiKey, createTime) {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        AllAPIKeys: arrayUnion({
          APIKeyID: processStringEncrypt(apiKey),
          CreationTime: createTime,
          Status: "",
        }),
      });

    setNewAPI("");
  }

  return (
    <div
      className={
        "w-full h-full flex flex-col justify-start items-start text-[14px] overflow-y-scroll aiScrollBar pr-[25px] pt-[30px] z-50 relative" +
        (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
      }
    >
      {/* <div className="w-full h-full bg-slate-200 absolute"></div> */}
      <div
        className={
          "text-[22px] flex justify-start items-center font-[geistMedium]" +
          (props?.theme ? " text-[#ffffff]" : " text-[black]")
        }
      >
        <Key width={20} height={20} strokeWidth={2.7} className="mr-[10px]" />
        Manage Your API Keys ID
      </div>
      <div className="flex justify-start items-center mt-[6px]">
        <TriangleAlert
          width={16}
          height={16}
          strokeWidth={2.2}
          className="text-[#FFA217] mr-[14px]"
        />
        API Key IDs are confidential, don't share with others
      </div>
      <div
        className={
          "border-t-[1.5px] my-[20px] w-full" +
          (props?.theme ? " border-t-[#222d37]" : " border-t-[#f6f6f6]")
        }
      ></div>
      <div className="w-full flex justify-between items-start  h-auto overflow-visible">
        <div className="flex flex-col justify-center items-start">
          <div
            className={
              "flex justify-start items-center font-[geistMedium] text-[15px]" +
              (props?.theme ? " text-[white]" : " text-[black]")
            }
          >
            <HardDriveDownload
              width={16}
              height={16}
              strokeWidth={2}
              className="mr-[12px]"
            />{" "}
            Store API Key ID Locally
          </div>
          <div className="text-[13px] mt-[-2px] ml-[28px]">
            The API Key will be stored on this device and will work only on this
            device, ensuring enhanced security
          </div>
        </div>
        <div className="flex h-[30px] justify-end items-center">
          <div
            className={
              "w-[33px] h-[22px] rounded-full shadow-inner  flex justify-start items-center px-[2px] cursor-pointer" +
              (!storeAPILocally
                ? props?.theme
                  ? " bg-[#141414]"
                  : " bg-[#F7F7F7]"
                : props?.theme
                ? " bg-[#00ff002e]"
                : " bg-[#ccf6cc]")
            }
            onClick={() => {
              // setTheme(!theme);
              // toggleTheme();
              // setLocaleStorage(!localStorage);
              toggleFirebaseStoreAPILocally();
            }}
            style={{ transition: ".3s" }}
          >
            <div
              className={
                "w-[16px] aspect-square rounded-full drop-shadow-md  " +
                (!storeAPILocally
                  ? props?.theme
                    ? " ml-[1px] bg-[#222222]"
                    : " ml-[1px] bg-[white]"
                  : props?.theme
                  ? " ml-[11px] bg-[#0ab810]"
                  : " ml-[11px] bg-[#609b60]")
              }
              style={{ transition: ".3s" }}
            ></div>
          </div>
        </div>
      </div>{" "}
      <div className="w-full flex justify-between items-start h-auto overflow-visible mt-[10px]">
        <div className="flex flex-col justify-center items-start">
          <div
            className={
              "flex justify-start items-center font-[geistMedium] text-[15px]" +
              (props?.theme ? " text-[white]" : " text-[black]")
            }
          >
            <LocateFixed
              width={16}
              height={16}
              strokeWidth={2}
              className="mr-[12px]"
            />{" "}
            Account-Scoped Usage
          </div>
          <div className="text-[13px] mt-[-2px] ml-[28px]">
            The API Key will be tied to your account and will not work for other
            accounts, even if logged in
          </div>
        </div>
        <div className="flex h-[30px] justify-end items-center">
          <div
            className={
              "w-[33px] h-[22px] rounded-full shadow-inner  flex justify-start items-center px-[2px] cursor-pointer" +
              (!scopedAPIUsage
                ? props?.theme
                  ? " bg-[#141414]"
                  : " bg-[#F7F7F7]"
                : props?.theme
                ? " bg-[#00ff002e]"
                : " bg-[#ccf6cc]")
            }
            onClick={() => {
              // setTheme(!theme);
              // toggleTheme();
              // setAccountScoped(!accountScoped);
              toggleFirebaseScopedAPIUsage();
            }}
            style={{ transition: ".3s" }}
          >
            <div
              className={
                "w-[16px] aspect-square rounded-full drop-shadow-md  " +
                (!scopedAPIUsage
                  ? props?.theme
                    ? " ml-[1px] bg-[#222222]"
                    : " ml-[1px] bg-[white]"
                  : props?.theme
                  ? " ml-[11px] bg-[#0ab810]"
                  : " ml-[11px] bg-[#609b60]")
              }
              style={{ transition: ".3s" }}
            ></div>
          </div>
        </div>
      </div>
      <div
        className={
          "border-t-[1.5px] my-[20px] w-full" +
          (props?.theme ? " border-t-[#222d37]" : " border-t-[#f6f6f6]")
        }
      ></div>
      <div className="w-full flex justify-end items-center mt-[10px]">
        {/* <div className="w-[250px] h-[30px] rounded-lg border-[1.5px] text-[black] border-[#ededed] mr-[10px] flex justify-start items-center">
          <div className="w-[30px] h-[30px] flex justify-center items-center">
            <Search
              width={16}
              height={16}
              strokeWidth={2.2}
              //   className="ml-[-3px] mr-[3px]"
            />
          </div>
          <input
            className="w-[calc(100%-30px)] pl-[0px] pr-[10px] outline-none"
            placeholder="Search API Key ID"
          ></input>
        </div> */}
        <div
          className={
            " text-[#000000] px-[10px] h-[30px] rounded-lg flex justify-center items-center cursor-pointer" +
            (props?.theme
              ? " bg-[#a2b9d5] hover:bg-[#c2d9f5]"
              : " bg-[#f0f0f0] hover:bg-[#d9d9d9]")
          }
          onClick={() => {
            setAddNewAPI(!addNewAPI);
          }}
        >
          <Plus
            width={16}
            height={16}
            strokeWidth={2.2}
            className="ml-[-3px] mr-[3px]"
          />{" "}
          Add API Key
        </div>
      </div>
      <div
        className={
          "w-full h-auto rounded-lg border-[1.5px] mt-[10px] flex flex-col justify-start items-start" +
          (props?.theme ? " border-[#283643]" : " border-[#ededed]")
        }
      >
        {/* <div className="w-full h-[10px] rounded-t-lg  flex justify-start items-center border-b-[1.5px] bg-[#FAFAFA] border-b-[#ededed] px-[15px]"></div> */}
        <div
          className={
            "w-full h-[35px] flex justify-start items-center px-[15px] font-[geistSemibold]" +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          <div className="w-[calc(100%-255px)] h-full flex flex-col justify-start items-start">
            <span className="w-full min-h-full flex justify-start items-center">
              <div className="hidden md:flex lg:flex justify-start items-center whitespace-nowrap">
                API Key ID
              </div>
              <div className="flex md:hidden lg:hidden justify-start items-center whitespace-nowrap">
                API
              </div>{" "}
              <Info
                width={16}
                height={16}
                strokeWidth={2.2}
                className="ml-[8px] cursor-pointer text-[#9ba6aa]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </span>
            <div
              className={`h-auto w-[200px] ${
                isHovered ? "flex" : "hidden"
              } z-50 text-[12px] rounded-lg p-[10px] font-[geistRegular] mt-[5px] bg-[white] border-[1.5px] border-[#ededed] boxShadowLight1 ml-[-11px]`}
            >
              All API Key IDs are securely encrypted and stored.
            </div>
          </div>
          <div className="w-[20px] mr-[15px] ml-[10px] flex justify-start items-center"></div>
          <div className="w-[120px] flex justify-start items-center">
            Created At
          </div>
          <div className="w-[60px] flex justify-start items-center">Status</div>
          <div className="w-[30px] flex justify-start items-center"></div>
        </div>{" "}
        {allAPIKeys?.length == 0 ? (
          <div
            key={props?.index}
            className={
              "w-full h-[35px] flex justify-center items-center border-t-[1.5px] px-[15px]" +
              (props?.theme ? " border-t-[#283643]" : " border-t-[#ededed]")
            }
          >
            <l-ring-2
              size="25"
              stroke="4"
              stroke-length="0.25"
              bg-opacity="0.1"
              speed="0.8"
              color="black"
            ></l-ring-2>
          </div>
        ) : (
          <>
            {allAPIKeys?.map((data, index) => {
              return (
                <APIKeyDisplay
                  data={data}
                  index={index}
                  activeAPIKey={activeAPIKey}
                  settingsIndex={settingsIndex}
                  setSettingsIndex={setSettingsIndex}
                  theme={props?.theme}
                  isDeleted={false}
                />
              );
            })}
          </>
        )}
        {/* <div className="w-full h-[35px]  flex justify-start items-center border-t-[1.5px] border-t-[#ededed] px-[15px]">
          <div className="w-[calc(100%-285px)] flex justify-start items-center text-[black]">
            AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U
          </div>
          <div className="w-[20px] mr-[15px] flex justify-start items-center cursor-pointer">
            <Eye width={18} height={18} strokeWidth={2.2} />
          </div>
          <div className="w-[140px] flex justify-start items-center">
            25 May, 2025
          </div>
          <div className="w-[80px] flex justify-start items-center  ">
            <div className="px-[7px] h-[20px] text-[black] text-[13px] flex justify-center items-center rounded-md bg-[#28d22859]">
              Active
            </div>
          </div>
          <div className="w-[30px] flex justify-end items-center cursor-pointer hover:text-[black]">
            <Ellipsis width={18} height={18} strokeWidth={2.2} />
          </div>
        </div> */}
        {/* <div className="w-full h-[35px]  flex justify-start items-center border-t-[1.5px] border-t-[#ededed] px-[15px]">
          <div className="w-[calc(100%-285px)] flex justify-start items-center text-[black]">
            {Array("HgYabsyfiziRgn423hhFU_486zR-SgBq12hTU0U".length)
              .fill("")
              .map((data) => {
                return <span className="mr-[3px] text-[16px]">•</span>;
              })}
          </div>
          <div className="w-[20px] mr-[15px] flex justify-start items-center cursor-pointer">
            <EyeOff width={18} height={18} strokeWidth={2.2} />
          </div>
          <div className="w-[140px] flex justify-start items-center">
            14 June, 2025
          </div>
          <div className="w-[80px] flex justify-start items-center">--</div>
          <div className="w-[30px] flex justify-end items-center cursor-pointer hover:text-[black]">
            <Ellipsis width={18} height={18} strokeWidth={2.2} />
          </div>
        </div> */}
        {addNewAPI ? (
          <div
            className={
              "w-full h-[35px]  flex justify-start items-center border-t-[1.5px] px-[15px]" +
              (props?.theme ? " border-[#283643]" : " border-[#ededed]")
            }
          >
            <input
              className={
                "w-[calc(100%-255px)] flex justify-start items-center bg-transparent text-[13px] font-[geistRegular] outline-none" +
                (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
              placeholder="Enter new API Key ID"
              value={newAPI}
              onChange={(e) => {
                setNewAPI(e.target.value);
              }}
              autoFocus={true}
              onBlur={() => {
                toggleAddNewAPI();
              }}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  if (checkAPIFormat(newAPI) && newAPI?.length > 0) {
                    setAddNewAPI(false);
                    addNewAPIKeyToFirebase(newAPI, getFormattedDateAndTime());
                  }
                }
              }}
            ></input>

            {checkAPIFormat(newAPI) ? (
              <div className="w-[20px] mr-[15px] ml-[10px] flex justify-start items-center cursor-default ">
                <Check
                  width={15}
                  height={15}
                  strokeWidth={2.2}
                  className={
                    "" +
                    (props?.theme ? " text-[#18d81891]" : " text-[#19c119]")
                  }
                />
              </div>
            ) : (
              <div className="w-[20px] mr-[15px] ml-[10px] flex justify-start items-center cursor-default ">
                <CircleAlert
                  width={15}
                  height={15}
                  strokeWidth={2.2}
                  className="text-[#e7582c]"
                />
              </div>
            )}

            <div className="w-[120px] flex justify-start items-center text-[13px]">
              {getFormattedDateAndTime()}
            </div>
            <div className="w-[60px] flex justify-start items-center"></div>
            <div className="w-[30px] flex justify-end items-center cursor-default hover:text-[black]">
              {/* <Ellipsis width={18} height={18} strokeWidth={2.2} /> */}{" "}
            </div>
          </div>
        ) : (
          <></>
        )}
        <div
          className={
            "w-full h-[8px] rounded-b-[7px]  flex justify-start items-center border-t-[1.5px] px-[15px]" +
            (props?.theme
              ? " bg-[#222222] border-[#2c363b]"
              : " bg-[#FAFAFA] border-[#ededed]")
          }
        ></div>
      </div>
      {/* <div className="w-full flex justify-center items-center mt-[10px] min-h-[30px]">
        <div
          className={
            "flex justify-center items-center border-[1.5px] rounded-lg h-full overflow-hidden" +
            (props?.theme ? " border-[#2c363b]" : " border-[#ededed]")
          }
        >
          <div
            className={
              "flex justify-center border-r-[1.5px] items-center w-[30px] h-full bg-[#FAFAFA]" +
              (props?.theme ? " border-r-[#2c363b]" : " border-r-[#ededed]")
            }
          >
            <ChevronLeft
              width={16}
              height={16}
              strokeWidth={2.2}
              className=""
            />
          </div>
          <div className="flex justify-center items-center w-[50px]">
            2<span className="mx-[2px]">/</span>4
          </div>
          <div
            className={
              "flex justify-center border-l-[1.5px] items-center w-[30px] h-full bg-[#FAFAFA]" +
              (props?.theme ? " border-l-[#2c363b]" : " border-l-[#ededed]")
            }
          >
            <ChevronRight
              width={16}
              height={16}
              strokeWidth={2.2}
              className=""
            />
          </div>
        </div>
      </div> */}
      <div className="w-full flex justify-end items-center mt-[20px]">
        <div
          className={
            " text-[#000000] px-[10px] min-h-[30px] rounded-lg flex justify-center items-center cursor-pointer" +
            (props?.theme
              ? " bg-[#a2b9d5] hover:bg-[#c2d9f5]"
              : " bg-[#f0f0f0] hover:bg-[#d9d9d9]")
          }
          onClick={() => {
            setShowDeletedAPI(!showDeletedAPI);
          }}
        >
          <Radius
            width={16}
            height={16}
            strokeWidth={2.2}
            className={
              "ml-[-3px] mr-[5px]" +
              (showDeletedAPI ? " -rotate-[360deg]" : " rotate-0")
            }
            style={{ transition: ".3s" }}
          />{" "}
          Recover Deleted API Key
        </div>
      </div>
      {showDeletedAPI ? (
        <div
          className={
            "w-full h-auto rounded-lg border-[1.5px] mt-[10px] flex flex-col justify-start items-start" +
            (props?.theme ? " border-[#283643]" : " border-[#ededed]")
          }
        >
          <div
            className={
              "w-full h-[35px] flex justify-start items-center px-[15px] font-[geistSemibold]" +
              (props?.theme ? " text-[#ffffff]" : " text-[black]")
            }
          >
            <div className="hidden md:flex lg:flex justify-start items-center whitespace-nowrap">
              Deleted API Key ID
            </div>
            <div className="flex md:hidden lg:hidden justify-start items-center whitespace-nowrap">
              Deleted API
            </div>
            <div className="w-[20px] mr-[15px] ml-[10px] flex justify-start items-center"></div>
            <div className="w-[120px] flex justify-start items-center">
              Deleted At
            </div>
            <div className="w-[60px] flex justify-start items-center">
              Status
            </div>
            <div className="w-[30px] flex justify-start items-center"></div>
          </div>{" "}
          {deletedAPIKeys?.map((data, index) => {
            return (
              <APIKeyDisplay
                data={data}
                index={index}
                activeAPIKey={activeAPIKey}
                settingsIndex={settingsIndex}
                setSettingsIndex={setSettingsIndex}
                theme={props?.theme}
                isDeleted={true}
              />
            );
          })}
          <div
            className={
              "w-full h-[8px] rounded-b-[7px]  flex justify-start items-center border-t-[1.5px] px-[15px]" +
              (props?.theme
                ? " bg-[#222222] border-[#2c363b]"
                : " bg-[#FAFAFA] border-[#ededed]")
            }
          ></div>
        </div>
      ) : (
        <></>
      )}
      <div
        className={
          "w-full mt-[20px]  border-[1.5px]  rounded-lg p-[15px]" +
          (props?.theme
            ? " bg-[#222222] border-[#2c363b]"
            : " bg-[#f7f7f7] border-[#f2f2f2]")
        }
      >
        <span
          className={
            "mr-[2px] font-[geistMedium] " +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          Note :{" "}
        </span>
        Each API key has a usage limit per minute. If the limit is reached, wait
        for a few minutes before retrying. If the issue persists, consider
        switching to a different API key.
      </div>
      <div
        className={
          "w-full text-[15px] mt-[20px] flex flex-col justify-start items-start border-[1.5px] rounded-lg p-[15px] mb-[30px]" +
          (props?.theme
            ? " bg-[#22222200] border-[#2c363b]"
            : " bg-[#f7f7f700] border-[#f2f2f2]")
        }
      >
        <span
          className={
            "font-[geistMedium]" +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          How to get an API Key ID ?
        </span>
        <span className="flex flex-col text-[14px] mt-[10px]">
          <span>
            <span className="mr-[5px] text-[16px]">•</span>
            <a
              className="text-[#3187f7] cursor-pointer"
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
            >
              Click here{" "}
            </a>
            to get redirected
          </span>
          <span className="mt-[-1px]">
            <span className="mr-[5px] text-[16px]">•</span>Sign up or Sign in
            using you Email ID
          </span>
          <span className="mt-[-1px]">
            <span className="mr-[5px] text-[16px]">•</span>Click on{" "}
            <span
              className={
                "" + (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
            >
              ' Create API Key '{" "}
            </span>
            Button
          </span>
          <span className="mt-[-1px]">
            <span className="mr-[5px] text-[16px]">•</span>A unique API Key ID
            will be generated for you
          </span>
          <span className="mt-[-1px]">
            <span className="mr-[5px] text-[16px]">•</span>Copy the API Key ID
            (do not share it with others)
          </span>
          {/* <span className="mt-[-1px]">
            <span className="mr-[5px] text-[16px]">•</span>Add the API Key ID
            here
          </span> */}

          <div className="w-full mt-[10px]">
            <span
              className={
                "mr-[2px] font-[geistMedium] " +
                (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
            >
              Note :{" "}
            </span>
            For multiple API Key IDs, use different email address for each API
            Key.
          </div>

          {/* <span>Click here </span> {">"} Sign up or sign in to your account if
          you haven’t already {">"} Click on "Create API Key" in the API section{" "}
          {">"} A unique API Key ID will be generated for you {">"} Copy the API
          Key ID and securely use it in your application (do not share it with
          others). */}
        </span>
      </div>
    </div>
  );
}

const APIKeyDisplay = (props) => {
  const [showAPI, setShowAPI] = useState(false);

  function copyToClipboard(text) {
    // const text = "Add note at cursor location";
    navigator.clipboard
      .writeText(processStringEncrypt(text))
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  function makeAPIKeyActive(key) {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        ActiveAPIKey: key,
      });
    props?.setSettingsIndex(-1);
  }

  function deleteAPIKey(key, status, createTime, activeKey) {
    const user = firebase.auth().currentUser;
    if (key == activeKey) {
      db.collection("user")
        .doc(user?.uid)
        .collection("APIKeys")
        .doc("APIKeys")
        .update({
          ActiveAPIKey: processStringEncrypt(
            "AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U"
          ),
        });
    }
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        DeletedAPIKeys: arrayUnion({
          APIKeyID: key,
          CreationTime: createTime,
          DeletionTime: getFormattedDateAndTime(),
          Status: status,
        }),
      });
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        AllAPIKeys: arrayRemove({
          APIKeyID: key,
          CreationTime: createTime,
          Status: status,
        }),
      });

    props?.setSettingsIndex(-1);
  }

  function restoreAPIKey(key, status, createTime, deleteTime) {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        DeletedAPIKeys: arrayRemove({
          APIKeyID: key,
          CreationTime: createTime,
          DeletionTime: deleteTime,
          Status: status,
        }),
      });
    db.collection("user")
      .doc(user?.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .update({
        AllAPIKeys: arrayUnion({
          APIKeyID: key,
          CreationTime: getFormattedDateAndTime(),
          Status: status,
        }),
      });
  }

  return (
    <div
      key={props?.index}
      className={
        "w-full h-[35px]  flex flex-col justify-start items-end border-t-[1.5px] px-[15px]" +
        (props?.theme ? " border-t-[#283643]" : " border-t-[#ededed]")
      }
    >
      {/* <div className="w-[calc(100%-285px)] flex justify-start items-center text-[black]">
        {props?.data?.APIKeyID}
      </div> */}
      <div className="w-full min-h-full flex justify-start items-center ">
        {showAPI ? (
          <div
            className={
              "w-[calc(100%-255px)] font-[geistRegular] text-[13px] text-ellipsis overflow-hidden whitespace-nowrap break-words" +
              (props?.theme ? " text-[#ffffff]" : " text-[black]")
            }
          >
            {processStringDecrypt(props?.data?.APIKeyID)}
          </div>
        ) : (
          <div
            className={
              "w-[calc(100%-255px)] flex justify-start items-center text-ellipsis overflow-hidden whitespace-nowrap" +
              (props?.theme ? " text-[#ffffff]" : " text-[black]")
            }
          >
            {/* {props?.data?.APIKeyID} */}
            {Array(props?.data?.APIKeyID?.length)
              .fill("")
              .map((data) => {
                return <span className="mr-[2px] text-[16px]">•</span>;
              })}
          </div>
        )}
        <div
          className={
            "w-[20px] mr-[15px] ml-[10px] flex justify-start items-center cursor-pointer" +
            (props?.theme ? " hover:text-[#ffffff]" : " hover:text-[black]")
          }
          onClick={() => {
            if (props?.data?.CreationTime != "By Default") {
              setShowAPI(!showAPI);
            }
          }}
        >
          {props?.data?.CreationTime == "By Default" ? (
            <></>
          ) : (
            <>
              {showAPI ? (
                <EyeOff width={15} height={15} strokeWidth={1.9} />
              ) : (
                <Eye width={15} height={15} strokeWidth={1.9} />
              )}
            </>
          )}
        </div>
        <div className="w-[120px] flex justify-start items-center text-[13px]">
          {props?.isDeleted ? (
            <>{props?.data?.DeletionTime}</>
          ) : (
            <>{props?.data?.CreationTime}</>
          )}
        </div>
        <div className="w-[60px] flex justify-start items-center  ">
          {props?.data?.APIKeyID == props?.activeAPIKey ? (
            <div
              className={
                "px-[7px] h-[20px] text-[13px] flex justify-center items-center rounded-md " +
                (props?.theme
                  ? " text-[#ffffff] bg-[#18d81891]"
                  : " text-[black] bg-[#28d22859]")
              }
            >
              Active
            </div>
          ) : (
            <></>
          )}
        </div>
        {props?.isDeleted ? (
          <div
            className={
              "w-[30px] justify-end items-center cursor-pointer  " +
              (props?.data?.CreationTime == "By Default" &&
              props?.data?.APIKeyID == props?.activeAPIKey
                ? " hidden"
                : " flex") +
              (props?.theme ? " hover:text-[#ffffff] " : " hover:text-[black]")
            }
            onClick={() => {
              restoreAPIKey(
                props?.data?.APIKeyID,
                props?.data?.Status,
                props?.data?.CreationTime,
                props?.data?.DeletionTime
              );
            }}
          >
            <Undo2 width={15} height={15} strokeWidth={1.9} />
          </div>
        ) : (
          <div
            className={
              "w-[30px] justify-end items-center cursor-pointer  " +
              (props?.data?.CreationTime == "By Default" &&
              props?.data?.APIKeyID == props?.activeAPIKey
                ? " hidden"
                : " flex") +
              (props?.theme ? " hover:text-[#ffffff] " : " hover:text-[black]")
            }
            onClick={() => {
              if (props?.settingsIndex == props?.index) {
                props?.setSettingsIndex(-1);
              } else {
                props?.setSettingsIndex(props?.index);
              }
            }}
          >
            {props?.settingsIndex == props?.index ? (
              <X width={15} height={15} strokeWidth={1.9} />
            ) : (
              <Ellipsis width={15} height={15} strokeWidth={1.9} />
            )}
          </div>
        )}
      </div>
      <div
        className={
          "w-auto h-auto z-[1000] mr-[-10px] mt-[6px] rounded-lg boxShadowLight1 border-[1.5px] flex-col justify-start items-start py-[5px]" +
          (props?.index == props?.settingsIndex ? " flex" : " hidden") +
          (props?.theme
            ? " border-[#2c363b] bg-[#141414]"
            : " border-[#ededed] bg-[white]")
        }
      >
        <span
          className={
            "w-full h-[30px] justify-start items-center px-[15px] cursor-pointer" +
            (props?.data?.APIKeyID == props?.activeAPIKey
              ? " hidden"
              : " flex") +
            (props?.theme ? " hover:text-[#ffffff]" : " hover:text-[black]")
          }
          onClick={() => {
            makeAPIKeyActive(props?.data?.APIKeyID);
          }}
        >
          <MonitorDot
            width={15}
            height={15}
            strokeWidth={2.2}
            className="mr-[10px]"
          />{" "}
          Activate
        </span>
        <span
          className={
            "w-full h-[30px] justify-start items-center px-[15px] cursor-pointer" +
            (props?.data?.CreationTime == "By Default" ? " hidden" : " flex") +
            (props?.theme ? " hover:text-[#ffffff]" : " hover:text-[black]")
          }
          onClick={() => {
            deleteAPIKey(
              props?.data?.APIKeyID,
              props?.data?.Status,
              props?.data?.CreationTime,
              props?.activeAPIKey
            );
          }}
        >
          <Trash
            width={15}
            height={15}
            strokeWidth={2.2}
            className="mr-[10px] mt-[-2px]"
          />{" "}
          Delete
        </span>
        <span
          className={
            "w-full h-[30px] justify-start items-center px-[15px] cursor-pointer" +
            (props?.data?.CreationTime == "By Default" ? " hidden" : " flex") +
            (props?.theme ? " hover:text-[#ffffff]" : " hover:text-[black]")
          }
          onClick={() => {
            copyToClipboard(props?.data?.APIKeyID);
            props?.setSettingsIndex(-1);
          }}
        >
          <Copy
            width={15}
            height={15}
            strokeWidth={2.2}
            className="mr-[10px] mt-[-2px]"
          />{" "}
          Copy
        </span>
        {/* <span>Usage</span> */}
      </div>
    </div>
  );
};
