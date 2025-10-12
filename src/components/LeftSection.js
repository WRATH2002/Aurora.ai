import {
  Check,
  ChevronRight,
  Clipboard,
  Ellipsis,
  EllipsisVertical,
  File,
  FileArchive,
  FilePen,
  FilePenLine,
  FileText,
  FileX,
  Folder,
  FolderClosed,
  FolderOpen,
  FolderPlus,
  FolderTree,
  FolderX,
  Maximize,
  Minimize,
  PenOff,
  Plus,
  RefreshCcw,
  RotateCw,
  Share2,
  Trash,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { checkAndAddFiles, formatDate } from "../utils/functionsConstant";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import ChooseDirectory from "./ChooseDirectory";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowRight04Icon,
  CheckmarkBadge01Icon,
  Copy01Icon,
  Delete01Icon,
  Edit04Icon,
  File02Icon,
  FileAddIcon,
  FileCorruptIcon,
  FileEmpty02Icon,
  FileShredderIcon,
  Folder01Icon,
  Folder02Icon,
  FolderAddIcon,
  FolderOpenIcon,
  LinkForwardIcon,
  RefreshIcon,
  SpamIcon,
  StructureFolderIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";

const name = [
  "Clippings",
  "Writing",
  "telepathy",
  "Daily",
  "Ideas",
  "Writing",
  "telepathy",
  "Meta",
  "Writing",
  "Projects",
  "References",
  "Evergreen",
  "notes",
  "turn",
  "Calmness",
  "superpower",
  "Travel",
  "Creativity",
  "combinatory",
  "Emergence",
  "Recipes",
  "Books",
  "Health",
];

const LeftSection = (props) => {
  const [noteList, setNoteList] = useState();
  const [activeFolder, setActiveFolder] = useState("");
  const [folderStructure, setFolderStructure] = useState([]);
  const [allFolders, setAllFolders] = useState([]);
  const [allTextFiles, setAllTextFiles] = useState([]);
  const [entryDirectory, setEntryDirectory] = useState("");
  const [showFolderTree, setShowFolderTree] = useState(false);
  const [addFolderModal, setAddFolderModal] = useState(false);
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [moreModal, setMoreModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newNoteName, setNewNoteName] = useState("");
  const moreModalRef = useRef(null);
  const [rightClickedFolder, setRightClickFolder] = useState("");
  const [isfolder, setIsfolder] = useState(false);

  // const starterContent = {"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 50px;font-family: smr;"}],"direction":null,"format":"","indent":0,"type":"root","version":1}},

  useEffect(() => {
    if (!moreModal) return;

    const handleClickOutside = (event) => {
      if (
        moreModalRef.current &&
        !moreModalRef.current.contains(event.target)
      ) {
        // console.log("outside");
        setMoreModal(false);
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreModal]);

  function fetchFolderStructureFromFirebase() {
    console.log(
      "• Action Function : fetchFolderStructureFromFirebase()\n• Action Message : Fetching Folder Structure Array form Firebase"
    );
    const user = firebase.auth().currentUser;
    const channelRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("AllNotes");

    onSnapshot(channelRef, (snapshot) => {
      setFolderStructure(snapshot?.data()?.FolderStructure);
    });
    const folderRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllFolders")
      .doc("AllNotes");

    onSnapshot(folderRef, (snapshot) => {
      setAllFolders(snapshot?.data()?.AllFolders);
    });
    const textfileRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("AllTextFile");

    onSnapshot(textfileRef, (snapshot) => {
      setAllTextFiles(snapshot?.data()?.AllTextFile);
    });
  }

  useEffect(() => {
    fetchFolderStructureFromFirebase();
  }, []);

  function UpdateFolderStructure(data) {
    console.log(
      "• Action Function : UpdateFolderStructure()\n• Action Message : Updating Folder Structure in Firebase"
    );
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("AllNotes")
      .set({ FolderStructure: data });
  }

  function addNew(path, fldName, type) {
    const user = firebase.auth().currentUser;
    let tempArr = [...folderStructure]; // Create a copy of arr to maintain immutability
    const pathArray = path ? path.split("~_~") : [];
    console.log("paharray size : " + pathArray);

    if (pathArray.length === 0) {
      // ✅ If path is empty, insert the object at the beginning of the root array
      if (type == "folder") {
        tempArr.unshift({
          Title: newFolderName,
          isFolder: true,
          subStructure: [],
        });

        db.collection("user")
          .doc(user?.uid)
          .collection("AllNotes")
          .doc("AllFolders")
          .update({ AllFolders: arrayUnion(path + "~_~" + newFolderName) });

        setNewFolderName("");
      } else if (type == "note") {
        tempArr.unshift({
          Title: newNoteName + ".txt",
          isFolder: false,
          subStructure: [],
        });

        db.collection("user")
          .doc(user?.uid)
          .collection("AllNotes")
          .doc("AllTextFile")
          .update({
            AllTextFile: arrayUnion(path + "~_~" + newNoteName + ".txt"),
          });

        db.collection("user")
          .doc(user?.uid)
          .collection("AllNotes")
          .doc("FilewiseContent")
          .collection("FilewiseContent")
          .doc(path + "~_~" + newNoteName + ".txt")
          .set({
            Content: `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 50px;font-family: Geist;"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`,
            LastSaved: formatDate(),
          });

        setNewNoteName("");
      }
    } else {
      findAndReplace(
        tempArr,
        pathArray,
        0,
        pathArray.length - 1,
        fldName,
        type,
        path
      );
    }

    console.log(tempArr); // Return the updated structure
    UpdateFolderStructure(tempArr);
  }

  function findAndReplace(
    data,
    toFind,
    ind,
    totalLength,
    fldName,
    typee,
    path
  ) {
    const user = firebase.auth().currentUser;

    data.forEach((element) => {
      if (element.Title === toFind[ind]) {
        if (ind === totalLength) {
          // ✅ Insert the new object at the first position of subStructure
          if (typee == "folder") {
            element.subStructure.unshift({
              Title: newFolderName,
              isFolder: true,
              subStructure: [],
            });
            db.collection("user")
              .doc(user?.uid)
              .collection("AllNotes")
              .doc("AllFolders")
              .update({ AllFolders: arrayUnion(path + "~_~" + newFolderName) });
          } else if (typee == "note") {
            element.subStructure.unshift({
              Title: newNoteName + ".txt",
              isFolder: false,
              subStructure: [],
            });
            db.collection("user")
              .doc(user?.uid)
              .collection("AllNotes")
              .doc("AllTextFile")
              .update({
                AllTextFile: arrayUnion(path + "~_~" + newNoteName + ".txt"),
              });
          }
        } else {
          // 🔄 Recursively go deeper into the folder structure
          findAndReplace(
            element.subStructure,
            toFind,
            ind + 1,
            totalLength,
            fldName,
            typee,
            path
          );
        }
      }
    });

    setNewFolderName("");
    setNewNoteName("");
  }

  // useEffect(() => {
  //   console.log(folderStructure);
  // }, [activeFolder]);

  return (
    <>
      <div
        className={
          "w-full h-[100svh] justify-center items-center fixed z-[200] font-[Geist] backdrop-blur-md " +
          (props?.theme ? " bg-[#00000097]" : " bg-[#b0b0b01e]") +
          (addFolderModal || addNoteModal ? " flex" : " hidden")
        }
        onClick={() => {
          setAddFolderModal(false);
          setAddNoteModal(false);
          setShowFolderTree(false);
          setNewFolderName("");
          setNewNoteName("");
        }}
      >
        <div
          className={
            "w-[330px] h-auto rounded-2xl flex flex-col justify-start items-start border p-[20px] pt-[15px] " +
            (props?.theme
              ? " text-[#9b9b9b] bg-[#1A1A1A] border-[#2d2d2d6f]"
              : " text-[#8f8f8f] bg-[#ffffff] border-[#d2d2d2]")
          }
          style={{ boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span
            className={
              "text-[20px] font-[600]" +
              (props?.theme ? " text-[white]" : " text-[black]")
            }
          >
            {addFolderModal ? (
              <>Create New Folder</>
            ) : addNoteModal ? (
              <>Create New Note</>
            ) : (
              <></>
            )}
          </span>
          <div className="text-[14px] mt-[3px]">
            {addFolderModal ? (
              <>
                Choose a directory and provide a name to create a new folder in
                that location.
              </>
            ) : addNoteModal ? (
              <>
                Choose a directory and name your note to create a new note in
                that location.
              </>
            ) : (
              <></>
            )}
          </div>
          <div
            className={
              "mt-[15px] text-[13px] font-[500]" +
              (props?.theme ? " text-[white]" : " text-[black]")
            }
          >
            Directory
          </div>
          <div className="w-full flex justify-start items-center mt-[0px]">
            <button className="h-[25px] w-[25px] flex justify-center items-center hover:bg-[#eaeaea] hover:text-[#000000] rounded-md focus:bg-[#eaeaea] focus:text-[#000000] ">
              <HugeiconsIcon
                icon={StructureFolderIcon}
                size={16}
                strokeWidth={1.9}
                className=" cursor-pointer"
                onClick={() => {
                  setShowFolderTree(!showFolderTree);
                }}
              />
            </button>

            <div
              className={
                "w-[calc(100%-25px)] h-[35px] rounded-lg text-[14px] overflow-visible flex flex-col justify-start items-start  "
                // +
                // (props?.theme ? " text-[white]" : " text-[black]")
              }
            >
              <div className="w-full flex justify-start items-center ">
                <div className="w-full min-h-[35px] flex justify-start items-center whitespace-nowrap overflow-x-scroll directoryTreeScroll z-30">
                  {/* <div className="min-w-[20px] h-[35px] bg-gradient-to-r from-[white] to-[#ffffff00]  z-[60] fixed"></div> */}
                  <div className="mr-[10px]"></div>
                  {entryDirectory.length == 0 ? (
                    <>{"root"}</>
                  ) : (
                    <>
                      {entryDirectory?.split("~_~")?.map((data, index) => {
                        return (
                          <>
                            {index == 0 ? (
                              <></>
                            ) : (
                              <>
                                <HugeiconsIcon
                                  icon={ArrowRight01Icon}
                                  size={14}
                                  strokeWidth={2}
                                  className="text-[#cacaca] mx-[2px] min-w-[15px]"
                                />
                              </>
                            )}

                            {data}
                          </>
                        );
                      })}
                    </>
                  )}
                  <div className="mr-[50px]"></div>
                </div>
                {/* <div className="min-w-[40px] h-[35px] bg-gradient-to-l from-[white] to-[#ffffff00] ml-[-40px] z-50"></div> */}
              </div>
              <div
                className={
                  "w-full min-h-[170px] max-h-[170px] pr-[3px] z-50 rounded-lg mt-[0px] flex-col justify-start items-center border-[1.5px] border-[#ededed] boxShadowLight0  " +
                  (props?.theme ? " bg-[#141414]" : " bg-[#ffffff]") +
                  (showFolderTree ? " flex" : " hidden")
                }
              >
                <div className="w-full h-full treeScroll p-[10px] pr-[7px] flex-col justify-start items-center overflow-y-scroll">
                  {folderStructure?.map((data, index) => {
                    return (
                      <>
                        <ChooseDirectory
                          fileStacked={props?.fileStacked}
                          setFileStacked={props?.setFileStacked}
                          selected={props?.selected}
                          setSelected={props?.setSelected}
                          index={index}
                          data={data}
                          directory={data?.Title}
                          entryDirectory={entryDirectory}
                          setEntryDirectory={setEntryDirectory}
                          theme={props?.theme}
                          activeFolder={activeFolder}
                          setActiveFolder={setActiveFolder}
                        />
                      </>
                    );
                  })}
                  <div className="w-full min-h-[50px]"></div>
                </div>
              </div>
              <div
                className={
                  "w-full justify-end mt-[-27px] mb-[10px] pr-[20px] z-50 max-h-[0px] flex items-center " +
                  (showFolderTree ? " flex" : " hidden")
                }
              >
                <div
                  className="px-[10px] py-[3px] rounded-lg bg-[#f0f0f0] hover:bg-[#d9d9d9] h-[32px] flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    setShowFolderTree(false);
                    setEntryDirectory("");
                  }}
                >
                  Root
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "mt-[5px] text-[13px] font-[500]" +
              (props?.theme ? " text-[white]" : " text-[black]")
            }
          >
            Folder Name
          </div>
          {addFolderModal ? (
            <div className="w-full flex justify-start items-center mt-[8px] ">
              <div className="h-[35px] w-[30px] flex justify-start items-center pl-[10px] ">
                <Folder
                  width={16}
                  height={16}
                  strokeWidth="2.4"
                  className="text-[#7b798b]"
                />
              </div>
              <input
                className={
                  "ml-[-30px] w-[calc(100%-65px)] pl-[35px] bg-transparent h-[35px] outline-none rounded-lg border-[1.5px] border-[#ededed] text-[14px] px-[12px]" +
                  (props?.theme ? " text-[white]" : " text-[black]")
                }
                value={newFolderName}
                onChange={(e) => {
                  if (!e.target.value.includes(".")) {
                    setNewFolderName(e.target.value);
                  }
                }}
                placeholder="eg. Educational Notes"
              ></input>
              <div className="min-h-[35px] max-h-[35px] min-w-[35px] max-w-[35px] ml-[30px] rounded-full flex justify-center items-center bg-slate-200">
                SDV
              </div>
            </div>
          ) : addNoteModal ? (
            <div className="w-full flex justify-start items-center mt-[5px] ">
              {/* <div className="h-[35px] w-[30px] flex justify-start items-center pl-[10px] ">
                <File
                  width={16}
                  height={16}
                  strokeWidth="2.4"
                  className="text-[#7b798b]"
                />
              </div> */}
              <input
                className={
                  "w-full pl-[10px] pr-[35px] bg-transparent h-[35px] outline-none rounded-[10px] border-[1.5px]  text-[14px] " +
                  (props?.theme
                    ? " text-[white] border-[#2e2e2e] placeholder:text-[#9b9b9b]"
                    : " text-[black] border-[#ededed] placeholder:text-[#8f8f8f]")
                }
                value={newNoteName}
                onChange={(e) => {
                  if (!e.target.value.includes(".")) {
                    setNewNoteName(e.target.value);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (
                      allTextFiles.some(
                        (file) =>
                          file.toLowerCase() ===
                          (
                            entryDirectory +
                            "~_~" +
                            newNoteName +
                            ".txt"
                          ).toLowerCase()
                      )
                    ) {
                    } else {
                      addNew(entryDirectory, newNoteName, "note");
                      setAddFolderModal(false);
                      setAddNoteModal(false);
                      setShowFolderTree(false);
                    }
                  }
                }}
                placeholder="eg. To-do's for today"
                spellCheck={false}
              ></input>
              <div
                className={
                  "min-h-[22px] max-h-[22px] min-w-[22px] max-w-[22px] ml-[-28.5px] mr-[6.5px] rounded-full justify-center items-center " +
                  (newNoteName.length == 0 ? " hidden" : " flex") +
                  (props?.theme
                    ? allTextFiles.some(
                        (file) =>
                          file.toLowerCase() ===
                          (
                            entryDirectory +
                            "~_~" +
                            newNoteName +
                            ".txt"
                          ).toLowerCase()
                      )
                      ? " text-[#f97811]"
                      : " text-[#57d608]"
                    : allTextFiles.some(
                        (file) =>
                          file.toLowerCase() ===
                          (
                            entryDirectory +
                            "~_~" +
                            newNoteName +
                            ".txt"
                          ).toLowerCase()
                      )
                    ? " text-[#c34902]"
                    : " text-[#009616]")
                  // (props?.theme ? " bg-[#f1694a]" : " bg-[#f1694a]")
                }
                style={{
                  transition: ".1s",
                }}
              >
                {allTextFiles.some(
                  (file) =>
                    file.toLowerCase() ===
                    (
                      entryDirectory +
                      "~_~" +
                      newNoteName +
                      ".txt"
                    ).toLowerCase()
                ) ? (
                  <>
                    <HugeiconsIcon
                      icon={SpamIcon}
                      size={24}
                      strokeWidth={1.9}
                      className=""
                    />
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      size={24}
                      strokeWidth={1.9}
                      className=""
                    />
                  </>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="w-full flex justify-end items-center mt-[20px]">
            <button
              className={
                "px-[15px] py-[3px] rounded-[10px] h-[32px] flex justify-center items-center text-[14px] mr-[12px] " +
                (props?.theme
                  ? " bg-[#232323] hover:bg-[#2b2b2b] focus:bg-[#2b2b2b] text-white"
                  : " bg-[#F5F5F5] hover:bg-[#F7F7F7] focus:bg-[#F7F7F7] text-black")
              }
              onClick={() => {
                setAddFolderModal(false);
                setAddNoteModal(false);
                setShowFolderTree(false);
                setNewFolderName("");
                setNewNoteName("");
              }}
            >
              Cancel
            </button>

            <button
              className={
                "px-[15px] outline-none py-[3px] rounded-[10px] h-[32px] flex justify-center items-center text-[14px] " +
                (addNoteModal
                  ? allTextFiles?.some(
                      // for note-modal
                      (file) =>
                        file.toLowerCase() ===
                        (
                          entryDirectory +
                          "~_~" +
                          newNoteName +
                          ".txt"
                        ).toLowerCase()
                    ) || newNoteName.length == 0
                    ? props?.theme
                      ? " bg-[#ffffff] text-[#000000] opacity-15 cursor-not-allowed"
                      : " bg-[#171717] text-[white] opacity-15 cursor-not-allowed"
                    : props?.theme
                    ? " bg-[#ffffff] hover:bg-[#CFCFCF] focus:bg-[#CFCFCF] text-[#000000] opacity-100"
                    : " bg-[#171717] hover:bg-[#2E2E2E] focus:bg-[#2E2E2E] text-[white] opacity-100"
                  : allTextFiles?.some(
                      // for folder-modal
                      (file) =>
                        file.toLowerCase() ===
                        (
                          entryDirectory +
                          "~_~" +
                          newNoteName +
                          ".txt"
                        ).toLowerCase()
                    ) || newFolderName.length == 0
                  ? props?.theme
                    ? " bg-[#ffffff] text-[#000000] opacity-15 cursor-not-allowed"
                    : " bg-[#171717] text-[white] opacity-15 cursor-not-allowed"
                  : props?.theme
                  ? " bg-[#ffffff] hover:bg-[#CFCFCF] focus:bg-[#CFCFCF] text-[#000000] opacity-100"
                  : " bg-[#171717] hover:bg-[#2E2E2E] focus:bg-[#2E2E2E] text-[white] opacity-100")
              }
              onClick={() => {
                if (addFolderModal) {
                  addNew(entryDirectory, newFolderName, "folder");
                  setAddFolderModal(false);
                  setAddNoteModal(false);
                  setShowFolderTree(false);
                } else if (addNoteModal) {
                  if (
                    allTextFiles.some(
                      (file) =>
                        file.toLowerCase() ===
                        (
                          entryDirectory +
                          "~_~" +
                          newNoteName +
                          ".txt"
                        ).toLowerCase()
                    )
                  ) {
                  } else {
                    addNew(entryDirectory, newNoteName, "note");
                    setAddFolderModal(false);
                    setAddNoteModal(false);
                    setShowFolderTree(false);
                  }
                }
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      <div
        className={
          "h-full  border-r-[0px] border-[#25252500] flex flex-col font-[Geist]  " +
          (props?.isMinimise
            ? " w-[0px] overflow-hidden"
            : " w-full md:w-[250px] lg:w-[250px]")
        }
        style={{ transition: ".3s" }}
      >
        <div
          className={
            "w-full h-[0px] md:h-[40px] lg:h-[40px] border-b-[1.5px] border-[#25252500] flex justify-between items-center text-[18px] uppercase" +
            (props?.theme ? " bg-[#141414] " : " bg-[#ffffff00] ")
          }
        >
          {/* Inscribe */}
          <div></div>
          <div className="pr-[15px]"></div>
        </div>
        <div
          className={
            "w-full h-[calc(100%-0px)] md:h-[calc(100%-40px)] lg:h-[calc(100%-40px)] flex flex-col justify-start items-start px-[3px] text-[white] overflow-hidden rounded-l-lg border-r-[1px] border-[#f6f6f6]" +
            (props?.theme
              ? " bg-[#1A1A1A] text-white"
              : " bg-[#ffffff] text-black")
          }
        >
          <div className="w-full h-[50px] flex justify-between items-center px-[30px] md:px-[15px] lg:px-[15px]">
            <div className=" font-bold">Notes</div>
            <div className="flex flex-col justify-start items-end overflow-visible h-[30px] w-[40px]">
              <div className="flex justify-end items-center min-h-[30px] max-h-[30px] w-[40px]">
                {/* <FolderPlus
              width={18}
              height={18}
              strokeWidth="1.8"
              className="text-[#7b798b] hover:text-[#000000] cursor-pointer"
            />{" "} */}
                {/* <RotateCw
                width={18}
                height={18}
                strokeWidth="1.8"
                className="text-[#7b798b] hover:text-[#000000] cursor-pointer mr-[10px]"
                onClick={() => {
                  fetchFolderStructureFromFirebase();
                }}
              />

              <Folder
                width={18}
                height={18}
                strokeWidth="1.8"
                className="text-[#7b798b] hover:text-[#000000] cursor-pointer mr-[10px]"
                onClick={() => {
                  // addNew(activeFolder);
                  setAddFolderModal(true);
                }}
              />

              <File
                width={17}
                height={17}
                strokeWidth="1.8"
                className="text-[#7b798b] hover:text-[#000000] cursor-pointer"
              /> */}
                {moreModal ? (
                  <X
                    width={17}
                    height={17}
                    strokeWidth="2.4"
                    className={
                      " cursor-pointer" +
                      (props?.theme
                        ? " text-[#9ba6aa] hover:text-[#ffffff]"
                        : " text-[#6e6e7c] hover:text-[#000000]")
                    }
                    onClick={() => {
                      setMoreModal(!moreModal);
                    }}
                  />
                ) : (
                  <EllipsisVertical
                    width={17}
                    height={17}
                    strokeWidth="1.8"
                    className={
                      " cursor-pointer " +
                      (props?.theme
                        ? " text-[#9ba6aa] hover:text-[#ffffff]"
                        : " text-[#6e6e7c] hover:text-[#000000]")
                    }
                    onClick={() => {
                      setMoreModal(!moreModal);
                    }}
                  />
                )}
              </div>
              <div
                ref={moreModalRef}
                className={
                  "w-auto h-auto p-[15px] py-[12px] mt-[10px] flex flex-col justify-start items-start rounded-[10px] border z-[10] text-[14px] " +
                  (props?.theme
                    ? " text-[#9ba6aa] bg-[#141414] border-[#2d2d2d6f]"
                    : " text-[#454545] bg-[#ffffff] border-[#d2d2d2]") +
                  (moreModal ? " flex" : " hidden")
                }
                style={{
                  // position: "fixed",
                  // top: toolbar.top,
                  // left: toolbar.left,
                  // background: "#fff",
                  // padding: "3px 7px",
                  boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                  // zIndex: 9999,
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  className={
                    "w-full h-[27px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                  onClick={() => {
                    setMoreModal(false);
                    fetchFolderStructureFromFirebase();
                  }}
                >
                  <HugeiconsIcon
                    icon={RefreshIcon}
                    size={16}
                    strokeWidth={1.7}
                    className="mr-[7px]"
                  />
                  {/* <RefreshCcw
                    width={16}
                    height={16}
                    strokeWidth="1.8"
                    className="mr-[7px]"
                  /> */}
                  Refresh
                </div>
                <div
                  className={
                    "w-full h-[27px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                  onClick={() => {
                    setMoreModal(false);
                    // addNew(activeFolder);
                    setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    icon={FolderAddIcon}
                    size={16}
                    strokeWidth={1.7}
                    className="mr-[7px]"
                  />
                  {/* <FolderClosed
                    width={16}
                    height={16}
                    strokeWidth="1.8"
                    className="mr-[7px]"
                  /> */}
                  New Folder
                </div>
                <div
                  className={
                    "w-full h-[27px] flex justify-start items-center whitespace-nowrap cursor-pointer " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                  onClick={() => {
                    setMoreModal(false);
                    // addNew(activeFolder);
                    setAddNoteModal(true);
                  }}
                >
                  <HugeiconsIcon
                    icon={FileAddIcon}
                    size={16}
                    strokeWidth={1.7}
                    className="mr-[7px]"
                  />
                  {/* <FileText
                    width={16}
                    height={16}
                    strokeWidth="1.8"
                    className="mr-[7px]"
                  /> */}
                  New Note
                </div>
                {/* <div
                  className={
                    "w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                  onClick={() => {
                    setMoreModal(false);
                    // addNew(activeFolder);
                    setAddNoteModal(true);
                  }}
                >
                  <Wrench
                    width={16}
                    height={16}
                    strokeWidth="1.8"
                    className="mr-[7px]"
                  />
                  Properties
                </div>
                <div
                  className={
                    "w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                  onClick={() => {
                    setMoreModal(false);
                    // addNew(activeFolder);
                    setAddNoteModal(true);
                  }}
                >
                  <Share2
                    width={16}
                    height={16}
                    strokeWidth="1.8"
                    className="mr-[7px]"
                  />
                  Share
                </div> */}
              </div>
            </div>
          </div>
          <div
            className={
              "w-full h-[calc(100%-50px)] flex flex-col justify-start items-start  px-[30px] md:px-[7px] lg:px-[7px] " +
              (props?.isMinimise ? " overflow-hidden" : " overflow-y-scroll")
            }
          >
            <div
              className={`w-full `}
              style={{
                transition: ".2s",
                display: "grid",
                gridTemplateRows: "1fr",
              }}
            >
              <div className="overflow-hidden w-full ">
                {folderStructure?.map((data, index) => {
                  return (
                    <>
                      <NoteTitleBlock
                        fileStacked={props?.fileStacked}
                        setFileStacked={props?.setFileStacked}
                        selected={props?.selected}
                        setSelected={props?.setSelected}
                        index={index}
                        data={data}
                        directory={data?.Title}
                        theme={props?.theme}
                        activeFolder={activeFolder}
                        setActiveFolder={setActiveFolder}
                        entryDirectory={entryDirectory}
                        setEntryDirectory={setEntryDirectory}
                        setRightClickFolder={setRightClickFolder}
                        rightClickedFolder={rightClickedFolder}
                        isfolder={isfolder}
                        setIsfolder={setIsfolder}
                        setFetchNoteQueue={props?.setFetchNoteQueue}
                        fetchNoteQueue={props?.fetchNoteQueue}
                      />
                    </>
                  );
                })}
              </div>
            </div>
            {/* {folderStructure?.map((data, index) => {
              return (
                <>
                  <NoteTitleBlock
                    fileStacked={props?.fileStacked}
                    setFileStacked={props?.setFileStacked}
                    selected={props?.selected}
                    setSelected={props?.setSelected}
                    index={index}
                    data={data}
                    directory={data?.Title}
                    theme={props?.theme}
                    activeFolder={activeFolder}
                    setActiveFolder={setActiveFolder}
                    entryDirectory={entryDirectory}
                    setEntryDirectory={setEntryDirectory}
                    setRightClickFolder={setRightClickFolder}
                    rightClickedFolder={rightClickedFolder}
                    isfolder={isfolder}
                    setIsfolder={setIsfolder}
                    setFetchNoteQueue={props?.setFetchNoteQueue}
                    fetchNoteQueue={props?.fetchNoteQueue}
                  />
                </>
              );
            })} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSection;

const NoteTitleBlock = (props) => {
  const [expand, setExpand] = useState(false);
  const rightClickedRef = useRef(null);

  useEffect(() => {
    if (props?.rightClickedFolder == "~_~") return;

    const handleClickOutside = (event) => {
      if (
        rightClickedRef.current &&
        !rightClickedRef.current.contains(event.target)
      ) {
        console.log("outside");
        props?.setRightClickFolder("~_~");
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Cleanup event listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props?.rightClickedFolder]);

  const handleRightClick = (event, item, folder) => {
    event.preventDefault(); // Prevent the default context menu
    console.log("Right-clicked on:", item);
    props?.setRightClickFolder(item);
    if (folder) {
      props?.setIsfolder(true);
    } else {
      props?.setIsfolder(false);
    }
  };

  return (
    <>
      <div className="min-h-[30px] max-h-[30px] flex flex-col justify-start items-end w-full overflow-y-visible">
        <div
          key={props?.index}
          className={
            "text-[16px] md:text-[14px] lg:text-[14px]  cursor-pointer rounded-[4px] flex justify-start items-center  px-[0px] md:px-[7px] lg:px-[7px] w-full min-h-[33px] max-h-[33px] my-[1px] group " +
            (props?.data?.isFolder
              ? props?.theme
                ? " hover:bg-[#26262600] text-[#9ba6aa] hover:text-[#ffffff]"
                : " hover:bg-[#F8F8FB00] text-[#6d6d6d] hover:text-[#000000]"
              : props?.theme
              ? props?.fileStacked[props?.selected] == props?.directory
                ? " bg-[#22222200] text-[#ffffff]"
                : " hover:bg-[#22222200] text-[#9ba6aa] hover:text-[#ffffff]"
              : props?.fileStacked[props?.selected] == props?.directory
              ? " bg-[#f4f6f800] text-[#000000]"
              : " hover:bg-[#f4f6f800] text-[#6d6d6d] hover:text-[#000000]")
          }
          onContextMenu={(event) =>
            handleRightClick(event, props?.directory, props?.data?.isFolder)
          }
          onClick={() => {
            if (props?.data?.isFolder) {
              setExpand(!expand);
            } else {
              props?.setFileStacked(
                checkAndAddFiles(
                  props?.fileStacked,
                  props?.directory,
                  props?.setSelected,
                  props?.fileStackedWithInfo,
                  props?.setFileStackedWithInfo
                )
              );
              if (
                props?.fetchNoteQueue?.includes(props?.directory) ||
                props?.fileStacked.includes(props?.directory)
              ) {
              } else {
                props?.setFetchNoteQueue((prev) => [...prev, props?.directory]);
              }
              console.log(props?.data?.Title);
            }
            console.log(props?.directory);

            if (props?.directory.includes("~_~")) {
              if (props?.data?.isFolder) {
                console.log("The activeFolder is ------> " + props?.directory);
                props?.setActiveFolder(props?.directory);
                props?.setEntryDirectory(props?.directory);
              } else {
                console.log(
                  "The activeFolder is ------> " +
                    props?.directory
                      ?.split("~_~")
                      ?.slice(0, props?.directory?.split("~_~").length - 1)
                      ?.join("~_~")
                );
                props?.setActiveFolder(
                  props?.directory
                    ?.split("~_~")
                    ?.slice(0, props?.directory?.split("~_~").length - 1)
                    ?.join("~_~")
                );
                props?.setEntryDirectory(
                  props?.directory
                    ?.split("~_~")
                    ?.slice(0, props?.directory?.split("~_~").length - 1)
                    ?.join("~_~")
                );
              }
            } else {
              if (props?.data?.isFolder) {
                console.log("The activeFolder is ------> " + props?.directory);
                props?.setActiveFolder(props?.directory);
                props?.setEntryDirectory(props?.directory);
              } else {
                console.log("The activeFolder is ------> Root");
                props?.setActiveFolder("");
                props?.setEntryDirectory("");
              }
            }
          }}
        >
          {props?.data?.isFolder ? (
            <>
              <div className="min-w-[42px] mr-[-4px] flex justify-start items-center">
                {/* <HugeiconsIcon
                  className={
                    " ml-[-3px] mr-[3.5px]  bg-slate-50" +
                    (expand ? "  rotate-90" : "  rotate-0") +
                    (props?.theme
                      ? props?.fileStacked[props?.selected]?.startsWith(
                          props?.directory
                        )
                        ? " text-[#6f787b]"
                        : " text-[#6f787b]"
                      : props?.fileStacked[props?.selected]?.startsWith(
                          props?.directory
                        )
                      ? " text-[#aeaebb]"
                      : " text-[#aeaebb]")
                  }
                  style={{ transition: ".2s" }}
                  icon={ArrowRight01Icon}
                  size={16}
                  strokeWidth={1.7}
                /> */}
                <div
                  className="group mr-[3px] w-[15px] h-[15px] flex justify-center items-center"
                  onClick={() => {
                    console.log("fileStacked: " + props?.fileStacked);
                    console.log("directory: " + props?.directory);
                    console.log("selected: " + props?.selected);
                    console.log("activeFolder: " + props?.activeFolder);
                  }}
                >
                  <div
                    className={
                      "group-hover:w-[15px] group-hover:h-[15px] rounded-full flex justify-center items-center cursor-pointer    " +
                      (expand
                        ? " bg-[#dfdfdf] w-[15px] h-[15px] hover:bg-[#dfdfdf]"
                        : " bg-[#dfdfdf] w-[6px] h-[6px] hover:bg-[#dfdfdf]")
                    }
                    style={{ transition: ".2s" }}
                  >
                    <div
                      className={"w-[6px] h-[6px] rounded-full bg-[#747474]"}
                    ></div>
                  </div>
                </div>
                {!expand ? (
                  <>
                    <HugeiconsIcon
                      className={
                        " ml-[0px] mr-[8px] mt-[-1px]  " +
                        (props?.theme
                          ? props?.fileStacked[props?.selected]?.startsWith(
                              props?.directory
                            )
                            ? " text-[#ffffff]"
                            : " text-[#9ba6aa] group-hover:text-[#ffffff]"
                          : props?.fileStacked[props?.selected]?.startsWith(
                              props?.directory
                            )
                          ? " text-[#000000]"
                          : " text-[#6d6d6d] group-hover:text-[#000000]")
                      }
                      icon={Folder01Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                  </>
                ) : (
                  <>
                    <HugeiconsIcon
                      className={
                        " ml-[0px] mr-[8px] mt-[-1px]  " +
                        (props?.theme
                          ? props?.fileStacked[props?.selected]?.startsWith(
                              props?.directory
                            )
                            ? " text-[#ffffff]"
                            : " text-[#9ba6aa] group-hover:text-[#ffffff]"
                          : props?.fileStacked[props?.selected]?.startsWith(
                              props?.directory
                            )
                          ? " text-[#000000]"
                          : " text-[#6d6d6d] group-hover:text-[#000000]")
                      }
                      icon={Folder02Icon}
                      size={16}
                      strokeWidth={1.6}
                    />
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="min-w-[22px] mr-[0px] flex justify-start items-center">
                {props?.fileStacked[props?.selected]?.startsWith(
                  props?.directory
                ) ? (
                  <HugeiconsIcon
                    className={
                      " ml-[0px] mr-[3px]  " +
                      (props?.theme
                        ? props?.fileStacked[props?.selected]?.startsWith(
                            props?.directory
                          )
                          ? " text-[#ffffff]"
                          : " text-[#9ba6aa] group-hover:text-[#ffffff]"
                        : props?.fileStacked[props?.selected]?.startsWith(
                            props?.directory
                          )
                        ? " text-[#000000]"
                        : " text-[#05a0f7] group-hover:text-[#05a0f7]")
                    }
                    icon={ArrowRight04Icon}
                    fill="currentColor"
                    size={16}
                    strokeWidth={2.3}
                  />
                ) : (
                  <HugeiconsIcon
                    className={
                      " ml-[0px] mr-[3px]   " +
                      (props?.theme
                        ? props?.fileStacked[props?.selected]?.startsWith(
                            props?.directory
                          )
                          ? " text-[#ffffff]"
                          : " text-[#9ba6aa] group-hover:text-[#ffffff]"
                        : props?.fileStacked[props?.selected]?.startsWith(
                            props?.directory
                          )
                        ? " text-[#000000]"
                        : " text-[#6d6d6d] group-hover:text-[#000000]")
                    }
                    icon={File02Icon}
                    size={16}
                    strokeWidth={1.6}
                  />
                )}

                {/* <div
                  className={`group/circle min-w-[18px] min-h-[18px] max-w-[18px] max-h-[18px] rounded-full flex justify-center items-center  mr-[10px] cursor-pointer`}
                  // onClick={() => toggleExpanded(index)}
                  style={{
                    transition: ".3s",
                    backgroundColor: `#393a4400`,
                  }}
                >
                  <div
                    className={
                      "min-w-[6px] min-h-[6px] rounded-full  group-hover/circle:min-w-[6px] group-hover/circle:min-h-[6px]"
                    }
                    style={{
                      transition: ".15s",
                      backgroundColor: `#787785`,
                    }}
                  ></div>
                </div> */}
              </div>
            </>
          )}
          {props?.data?.isCreating == true ? (
            <input
              className={
                "w-[calc(100%-20px)] outline-none bg-transparent caret" +
                (expand ? " " : " ") +
                (props?.theme
                  ? props?.fileStacked[props?.selected]?.startsWith(
                      props?.directory
                    )
                    ? " text-[white]"
                    : " group-hover:text-[#ffffff]"
                  : props?.fileStacked[props?.selected]?.startsWith(
                      props?.directory
                    )
                  ? " text-[black]"
                  : " group-hover:text-[#000000]")
              }
            >
              {/* {props?.data?.Title} */}
            </input>
          ) : (
            <>
              <span
                className={
                  "text-ellipsis overflow-hidden whitespace-nowrap w-full " +
                  (expand ? " " : " ") +
                  (props?.theme
                    ? props?.fileStacked[props?.selected]?.startsWith(
                        props?.directory
                      )
                      ? " text-[white]"
                      : " group-hover:text-[#ffffff]"
                    : props?.fileStacked[props?.selected]?.startsWith(
                        props?.directory
                      )
                    ? " text-[black]"
                    : " group-hover:text-[#000000]")
                }
              >
                {props?.data?.Title}
              </span>
              {props?.data?.Title == "UI Design & Interaction.txt" ? (
                <div className="min-w-[20px] h-[20px] flex justify-end items-center">
                  <div className="min-w-[8px] h-[8px] rounded-full bg-[#fac66d]"></div>
                </div>
              ) : (
                <></>
              )}
              {/* {props?.data?.isFolder &&
              props?.data?.subStructure.length &&
              !expand > 0 ? (
                // && !props?.activeFolder.includes(props?.directory)
                <span
                  className={
                    "min-w-[17px] h-[17px] rounded-[5px] text-[11px] flex justify-center items-center " +
                    (props?.theme
                      ? " bg-[#141414] text-[#9ba6aa]"
                      : " bg-[#efefef] text-[#030303]") +
                    (props?.data?.isFolder &&
                    props?.data?.subStructure.length > 0 &&
                    !expand
                      ? " opacity-100"
                      : " opacity-0")
                  }
                  style={{ transition: ".2s"  }}
                >
                  {props?.data?.subStructure.length}
                </span>
              ) : (
                <></>
              )} */}
              <span
                className={
                  "min-w-[17px] h-[17px] rounded-[5px] text-[11px] flex justify-center items-center " +
                  (props?.theme
                    ? " bg-[#141414] text-[#9ba6aa]"
                    : " bg-[#efefef] text-[#030303]") +
                  (props?.data?.isFolder &&
                  props?.data?.subStructure.length > 0 &&
                  !expand
                    ? " opacity-100"
                    : " opacity-0")
                }
                style={{ transition: ".15s" }}
              >
                {props?.data?.subStructure.length}
              </span>
            </>
          )}
        </div>
        <div className="w-full flex justify-end items-start">
          <div
            ref={rightClickedRef}
            className={
              "w-auto relative min-w-[150px] h-auto p-[4px] py-[12px] px-[15px] mt-[-14px] mr-[4px] rounded-xl z-10 boxShadowLight00 flex-col justify-start items-start backdrop-blur-[8px] border-[2px] " +
              (props?.rightClickedFolder == props?.directory
                ? " flex"
                : " hidden") +
              (props?.theme
                ? " bg-[#141414b0] border-[#29333c]"
                : " bg-[#ffffffb0] border-[#f2f2f2]")
            }
          >
            {props?.isfolder ? (
              <div
                className={
                  "w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                  (props?.theme
                    ? " text-[#9ba6aa] hover:text-[#ffffff]"
                    : " text-[#6e6e7c] hover:text-[#000000]")
                }
                onClick={() => {
                  // addNew(activeFolder);
                  // setAddFolderModal(true);
                }}
              >
                <FolderX
                  width={16}
                  height={16}
                  strokeWidth="1.8"
                  className="mr-[7px]"
                />
                Delete Folder
              </div>
            ) : (
              <>
                <div
                  className={
                    "group w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6d6d6d] hover:text-[#000000]")
                  }
                  onClick={() => {
                    // addNew(activeFolder);
                    // setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    className={" mr-[7px]   "}
                    icon={FileCorruptIcon}
                    size={16}
                    strokeWidth={1.7}
                  />
                  Archive
                </div>{" "}
                <div
                  className={
                    "group w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6d6d6d] hover:text-[#000000]")
                  }
                  onClick={() => {
                    // addNew(activeFolder);
                    // setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    className={" mr-[7px]   "}
                    icon={Copy01Icon}
                    size={16}
                    strokeWidth={1.7}
                  />
                  Copy
                </div>
                <div
                  className={
                    "group w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6d6d6d] hover:text-[#000000]")
                  }
                  onClick={() => {
                    // addNew(activeFolder);
                    // setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    className={" mr-[7px]   "}
                    icon={LinkForwardIcon}
                    size={16}
                    strokeWidth={1.7}
                  />
                  Share
                </div>{" "}
                <div
                  className={
                    "group w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6d6d6d] hover:text-[#000000]")
                  }
                  onClick={() => {
                    // addNew(activeFolder);
                    // setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    className={" mr-[7px]   "}
                    icon={Edit04Icon}
                    size={16}
                    strokeWidth={1.7}
                  />
                  Rename
                </div>{" "}
                <div
                  className={
                    "group w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6d6d6d] hover:text-[#000000]")
                  }
                  onClick={() => {
                    // addNew(activeFolder);
                    // setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    className={" mr-[7px]   "}
                    icon={Wrench01Icon}
                    size={16}
                    strokeWidth={1.7}
                  />
                  Properties
                </div>{" "}
                <div
                  className={
                    "group w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer" +
                    (props?.theme
                      ? " text-[#aaa39b] hover:text-[#ffffff]"
                      : " text-[#f65c2d] hover:text-[#dc4c39]")
                  }
                  onClick={() => {
                    // addNew(activeFolder);
                    // setAddFolderModal(true);
                  }}
                >
                  <HugeiconsIcon
                    className={" mr-[7px]   "}
                    icon={FileShredderIcon}
                    size={16}
                    strokeWidth={1.7}
                  />
                  Delete
                </div>
              </>
            )}
            {/* <div
            className={
              "w-full h-[27px] text-[14px] flex justify-start items-center whitespace-nowrap cursor-pointer " +
              (props?.theme
                ? " text-[#9ba6aa] hover:text-[#ffffff]"
                : " text-[#6e6e7c] hover:text-[#000000]")
            }
            onClick={() => {
              // addNew(activeFolder);
              // setAddNoteModal(true);
            }}
          >
            <File
              width={16}
              height={16}
              strokeWidth="1.8"
              className="mr-[7px]"
            />
            New Note
          </div> */}
          </div>
        </div>
      </div>
      {/* {expand && props?.data?.isFolder ? (
        <>
          <div className="w-full flex flex-col justify-start items-start pl-[10px]">
            <div
              className={
                "w-full flex flex-col justify-start items-start pl-[5px] border-l-[1.5px] " +
                (props?.theme ? " border-[#222222]" : " border-[#f3f3fa]")
              }
              style={{
                height: expand && props?.data?.isFolder ? `${props?.data?.subStructure?.length * 30}px` : `30px`,
                transition: ".3s",
              }}
            >
              {props?.data?.subStructure?.map((data, index) => {
                return (
                  <>
                    <NoteTitleBlock
                      index={index}
                      data={data}
                      theme={props?.theme}
                      directory={props?.directory + "~_~" + data?.Title}
                      fileStacked={props?.fileStacked}
                      setFileStacked={props?.setFileStacked}
                      selected={props?.selected}
                      setSelected={props?.setSelected}
                      activeFolder={props?.activeFolder}
                      setActiveFolder={props?.setActiveFolder}
                      entryDirectory={props?.entryDirectory}
                      setEntryDirectory={props?.setEntryDirectory}
                      setRightClickFolder={props?.setRightClickFolder}
                      rightClickedFolder={props?.rightClickedFolder}
                      isfolder={props?.isfolder}
                      setIsfolder={props?.setIsfolder}
                      setFetchNoteQueue={props?.setFetchNoteQueue}
                      fetchNoteQueue={props?.fetchNoteQueue}
                    />
                  </>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <></>
      )} */}

      <div
        className={
          "w-full pl-[11px]" +
          (expand && props?.data?.isFolder
            ? " opacity-100 overflow-visible"
            : " opacity-0 overflow-hidden")
        }
        style={{
          transition: ".2s",
          // transitionDelay: expand && props?.data?.isFolder ? "0.1s" : "0s",
          display: "grid",
          gridTemplateRows: expand && props?.data?.isFolder ? "1fr" : "0fr",
        }}
      >
        <div
          className={
            "w-full flex flex-col justify-start items-start pl-[4px] border-l-[1.5px] overflow-hidden" +
            (props?.theme ? " border-[#222222]" : " border-[#f3f3fa]")
            // +
            // (expand && props?.data?.isFolder
            //   ? " opacity-100 overflow-visible"
            //   : " opacity-0 overflow-hidden")
          }
          // style={{
          //   maxHeight:
          //     expand && props?.data?.isFolder
          //       ? `${props?.data?.subStructure?.length * 30}px`
          //       : `0px`,
          //   transition: "max-height 0.3s ease, opacity 0.3s ease",
          //   transitionDelay:
          //     expand && props?.data?.isFolder ? "0s, 0.1s" : "0s, 0s",
          // }}
        >
          {props?.data?.subStructure?.map((data, index) => {
            return (
              <>
                <NoteTitleBlock
                  index={index}
                  data={data}
                  theme={props?.theme}
                  directory={props?.directory + "~_~" + data?.Title}
                  fileStacked={props?.fileStacked}
                  setFileStacked={props?.setFileStacked}
                  selected={props?.selected}
                  setSelected={props?.setSelected}
                  activeFolder={props?.activeFolder}
                  setActiveFolder={props?.setActiveFolder}
                  entryDirectory={props?.entryDirectory}
                  setEntryDirectory={props?.setEntryDirectory}
                  setRightClickFolder={props?.setRightClickFolder}
                  rightClickedFolder={props?.rightClickedFolder}
                  isfolder={props?.isfolder}
                  setIsfolder={props?.setIsfolder}
                  setFetchNoteQueue={props?.setFetchNoteQueue}
                  fetchNoteQueue={props?.fetchNoteQueue}
                />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};
