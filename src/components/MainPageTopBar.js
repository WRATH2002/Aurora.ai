import { ArrowLeft, CloudUpload, Loader, X } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { getDurationFromPresent } from "../utils/functionsConstant";

const arr = [
  "Writing is Telepathy of Key ",
  "Neural Network Handwritten Notes",
  "Computer Networks Fundamentals",
  "Javascript Notes",
  "Writing is Telepathy of Key ",
  "Neural Network Handwritten Notes",
  "Computer Networks Fundamentals",
  // "Javascript Notes",
  // "Writing is Telepathy of Key ",
  // "Neural Network Handwritten Notes",
  // "Computer Networks Fundamentals",
  // "Javascript Notes",
  // "Writing is Telepathy of Key ",
  // "Neural Network Handwritten Notes",
  // "Computer Networks Fundamentals",
];

const MainPageTopBar = (props) => {
  // const [selected, setSelected] = useState(0);
  const [queue, setQueue] = useState([]);
  const [lastSaved, setLastSaved] = useState("");
  const [lastSavedDuration, setLastSavedDuration] = useState("");
  const isProcessing = useRef(false);
  const timeoutRef = useRef(null);

  const enqueueDeletion = (data, index) => {
    if (queue.some((item) => item.Title === data)) {
    } else {
      setQueue((prevQueue) => [...prevQueue, { Title: data, Position: index }]);
    }
  };

  const processQueue = async () => {
    if (queue.length === 0 || isProcessing.current) return;
    isProcessing.current = true;

    // while (queue.length > 0) {
    const data = queue[0]; // Get the first index from queue

    // Delay to simulate async operation
    // await new Promise((resolve) => setTimeout(resolve, 500));
    // if (props?.fileStacked[props?.selected] == data){
    //   props?.setSelected()
    // }

    if (props?.fileStacked.indexOf(data?.Title) < props?.selected) {
      props?.setSelected((prevIndex) => prevIndex - 1);
    } else if (props?.fileStacked.indexOf(data?.Title) > props?.selected) {
      // do nothing, it wont have an impact in index shifting
      props?.setSelected(props?.selected);
    } else if (props?.fileStacked.indexOf(data?.Title) == props?.selected) {
      if (props?.selected > 0) {
        props?.setSelected((prevIndex) => prevIndex - 1);
      } else if (props?.selected == 0) {
        props?.setSelected(props?.selected);
      }
    }

    props?.setFileStacked((prevElements) =>
      prevElements.filter((ele) => ele !== data?.Title)
    );
    props?.setFileStackedWithInfo((prevObjects) =>
      prevObjects.filter((ele) => ele.Title !== data?.Title)
    );
    console.log(
      `• Action Function : processQueue() -> Promise\n• Process Name : ${data}\n• Action Message : Element deleted`
    );

    setQueue((prevQueue) => prevQueue.slice(1)); // Remove processed index
    // }

    isProcessing.current = false;

    if (queue.length > 1) {
      processQueue();
    }
  };

  useEffect(() => {
    console.log(
      "• Action Function : processQueue()\n• Action Message : Delete actions are queued, to be performed one by one"
    );
    processQueue();
  }, [queue]);

  function fetchNoteData() {
    const user = firebase.auth().currentUser;

    const channelRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("FilewiseContent")
      .collection("FilewiseContent")
      .doc(
        props?.fileStacked[props?.selected]?.includes("~_~")
          ? props?.fileStacked[props?.selected]
          : "~_~" + props?.fileStacked[props?.selected]
      );

    onSnapshot(channelRef, (snapshot) => {
      setLastSaved(snapshot?.data()?.LastSaved);
      setLastSavedDuration(getDurationFromPresent(snapshot?.data()?.LastSaved));
    });
  }

  useEffect(() => {
    if (props?.fileStacked.length > 0) {
      fetchNoteData();
    }
  }, [props?.selected, props?.fileStacked]);

  useEffect(() => {
    if (
      lastSaved.length > 0 &&
      lastSaved !== undefined &&
      lastSavedDuration !== undefined
    ) {
      // Clear existing timeout if lastSave changes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Start a new timeout
      timeoutRef.current = setTimeout(() => {
        setLastSavedDuration(getDurationFromPresent(lastSaved));
      }, 10 * 60 * 1000); // 10 minutes

      // Cleanup function to clear timeout when component unmounts
      return () => clearTimeout(timeoutRef.current);
    }
  }, [lastSavedDuration]);

  return (
    <>
      <div
        className={
          "w-full h-[50px] px-[30px] text-[15px] flex md:hidden lg:hidden justify-between items-center z-[1] pt-[10px]" +
          (props?.theme ? " bg-[#1A1A1A]" : " bg-[#ffffff]")
        }
      >
        <div
          className=" flex justify-start items-center w-[80px]"
          onClick={() => {
            props?.setFileStacked([]);
            props?.setFileStackedWithInfo([]);
          }}
        >
          <ArrowLeft width={20} height={20} strokeWidth="2" className="" />
        </div>
        <div className="w-[calc(100%-160px)] h-full flex justify-center items-center whitespace-nowrap overflow-hidden text-ellipsis">
          {props?.fileStacked[props?.selected]?.includes("~_~") ? (
            <>
              {
                props?.fileStacked[props?.selected]?.split("~_~")[
                  props?.fileStacked[props?.selected]?.split("~_~") - 1
                ]
              }
            </>
          ) : (
            <>{props?.fileStacked[props?.selected]}</>
          )}
        </div>
        {/* <div>jnfianei</div> */}
        <div
          className={
            "flex justify-end items-center w-[80px] text-[14px] whitespace-nowrap font-[geistRegular] overflow-visible" +
            (props?.theme ? " text-[#9ba6aa]" : " text-[#9999aa]")
          }
        >
          {lastSavedDuration.length == 0 || props?.saveLoading ? (
            <>
              <Loader
                width={18}
                height={18}
                strokeWidth={2.1}
                className="mr-[5px] rotating "
              />
            </>
          ) : (
            <>
              <CloudUpload
                width={18}
                height={18}
                strokeWidth={2.1}
                className="mr-[5px]"
              />
              <span>{lastSavedDuration}</span>
            </>
          )}
        </div>
        {/* {fileStacked[selected]?.split("~_~")?.map((data, index) => {
              return (
                <>
                  {fileStacked[selected].split("~_~").length - 1 == index ? (
                    <>
                      <span
                        className={
                          "flex justify-start items-center cursor-default" +
                          (theme ? " text-[#ffffff]" : " text-[#000000]")
                        }
                      >
                        <File
                          width={16}
                          height={16}
                          strokeWidth="1.8"
                          className="mr-[5px]"
                        />
                        {data}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className={
                          "flex justify-start items-center cursor-default"
                        }
                      >
                        <FolderOpen
                          width={18}
                          height={18}
                          strokeWidth="1.8"
                          className="mr-[5px]"
                        />
                        {data}
                        <ChevronRight
                          width={14}
                          height={14}
                          strokeWidth="2.5"
                          className={
                            "mx-[5px]" +
                            (theme ? " text-[#6e6e7c]" : " text-[#6e6e7c]")
                          }
                        />
                      </span>
                    </>
                  )}
                </>
              );
            })} */}
        {/* 
            <div
              className="bg-slate-200"
              onClick={() => {
                setFileStacked([]);
              }}
            >
              ff
            </div> */}
      </div>
      <div
        className={
          "w-full h-[40px] hidden md:flex lg:flex justify-start items-end p-[10px] pt-[2px] pb-[0px] z-[1]" +
          (props?.theme
            ? " bg-[#141414] text-[white]"
            : " bg-[#ffffff00] text-[black]")
        }
      >
        {props?.fileStacked?.map((data, index) => {
          return (
            <>
              {/* {index == 0 ? (
                <></>
              ) : (
                <>
                  {props?.selected + 1 == index ? (
                    <></>
                  ) : props?.selected == index ? (
                    <></>
                  ) : (
                    <div className="h-full flex items-center">
                      <div className="h-[20px] "></div>
                    </div>
                  )}
                </>
              )} */}
              {index == props?.selected ? (
                <>
                  <div
                    className={
                      "min-w-[12px] h-[12px]  overflow-hidden p-[0px] border-none mr-[0px]  mb-[0px] z-0" +
                      (index == 0 ? " ml-[-10px]" : " ml-[-10px]") +
                      (props?.theme
                        ? " bg-[#1A1A1A] text-[white]"
                        : " bg-[#ffffff] text-[black]")
                    }
                    // style={{ zIndex: "7" }}
                  >
                    <div
                      className={
                        "w-full h-full rounded-tr-full rotate-90    " +
                        (props?.theme
                          ? " bg-[#141414] text-[white]"
                          : " bg-[#FAFAFA] text-[black]")
                      }
                    ></div>
                  </div>
                  <div
                    className={
                      "h-full min-w-[50px] w-[170px] rounded-t-lg mb-[0px] flex justify-between items-center px-[10px] text-[13px] cursor-pointer border-none mx-[0px] " +
                      (props?.theme
                        ? " bg-[#1A1A1A] text-[white]"
                        : " bg-[#ffffff] text-[black]")
                    }
                  >
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis pl-[5px]">
                      {data?.split("~_~")[data?.split("~_~").length - 1]}
                    </span>
                    <div
                      className={
                        "flex justify-center items-center min-w-[20px] h-[20px] rounded-full" +
                        (props?.theme
                          ? " text-[#9ba6aa] hover:bg-[#6d7986] hover:text-[#ffffff]"
                          : " text-[#9999aa] hover:bg-[#ffffff] hover:text-[black]")
                      }
                      onClick={() => {
                        enqueueDeletion(data, index);
                      }}
                    >
                      <X width={15} height={15} strokeWidth={2.5} />
                    </div>
                    {/* <div
                      className={
                        "w-full h-full rounded-lg   flex justify-between items-center px-[7px]  z-50" +
                        (props?.theme
                          ? " hover:bg-[#222222] text-[#9ba6aa] hover:text-[#ccd5d9]"
                          : " hover:bg-[#ffffff] text-[#6e6e7c]")
                      }
                      style={{ zIndex: "10" }}
                      onClick={() => {
                        props?.setSelected(index);
                        // console.log("parent");
                      }}
                    >
                      <span
                        className={
                          "whitespace-nowrap overflow-hidden text-ellipsis  pl-[5px]"
                          // (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
                        }
                      >
                        {data?.split("~_~")[data?.split("~_~").length - 1]}
                      </span>
                      <div
                        className={
                          "flex justify-center items-center   min-w-[20px] h-[20px] rounded-full" +
                          (props?.theme
                            ? " text-[#9ba6aa] hover:bg-[#6d7986] hover:text-[#ffffff]"
                            : " text-[#9999aa] hover:bg-[#ffffff] hover:text-[black]")
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          enqueueDeletion(data, index);

                          // console.log("child");
                        }}
                      >
                        <X width={15} height={15} strokeWidth={2.5} />
                      </div>
                    </div> */}
                  </div>
                  <div
                    className={
                      "min-w-[12px] h-[12px] overflow-hidden p-[0px] border-none ml-[0px] mr-[-10px]  mb-[0px] " +
                      (props?.theme
                        ? " bg-[#1A1A1A] text-[white]"
                        : " bg-[#ffffff] text-[black]")
                    }
                  >
                    <div
                      className={
                        "w-full h-full rounded-tr-full rotate-180 " +
                        (props?.theme
                          ? " bg-[#141414] text-[white]"
                          : " bg-[#FAFAFA] text-[black]")
                      }
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    key={index}
                    className={
                      "h-full min-w-[50px] w-[170px] rounded-t-lg flex justify-between items-center text-[13px] border-none mb-[0px]  cursor-pointer z-[2] p-[3px] py-[5px] rounded-lg" +
                      (props?.theme
                        ? " bg-[#141414] text-[white]"
                        : " bg-[#f8f6f500] text-[black]") +
                      (index == 0
                        ? index == props?.selected - 1
                          ? " ml-[2px] mr-[0px]"
                          : " ml-[2px] mr-[2px]"
                        : index == props?.selected - 1
                        ? " ml-[0px] mr-[0px]"
                        : " ml-[0px] mr-[2px]")
                    }
                  >
                    <div
                      className={
                        "w-full h-full rounded-lg   flex justify-between items-center px-[7px]  z-50" +
                        (props?.theme
                          ? " hover:bg-[#222222] text-[#9ba6aa] hover:text-[#ccd5d9]"
                          : " hover:bg-[#ffffff] text-[#6e6e7c]")
                      }
                      style={{ zIndex: "10" }}
                      onClick={() => {
                        props?.setSelected(index);
                        // console.log("parent");
                      }}
                    >
                      <span
                        className={
                          "whitespace-nowrap overflow-hidden text-ellipsis  pl-[5px]"
                          // (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
                        }
                      >
                        {data?.split("~_~")[data?.split("~_~").length - 1]}
                      </span>
                      <div
                        className={
                          "flex justify-center items-center   min-w-[20px] h-[20px] rounded-full" +
                          (props?.theme
                            ? " text-[#9ba6aa] hover:bg-[#6d7986] hover:text-[#ffffff]"
                            : " text-[#9999aa] hover:bg-[#ffffff] hover:text-[black]")
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          enqueueDeletion(data, index);

                          // console.log("child");
                        }}
                      >
                        <X width={15} height={15} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* {index == arr.length - 1 ? (
                <></>
              ) : (
                <>
                  <div className="h-full flex items-center">
                    <div className="h-[20px] border border-[#c7c7c7]"></div>
                  </div>
                </>
              )} */}
            </>
          );
        })}
        {/* <div className="w-[12px] h-[12px] bg-[#ffffff] overflow-hidden p-[0px] border-none mr-[-1px] z-[9] mb-[-1px] ">
          <div className="w-full h-full bg-[#F6F6F6] rounded-tr-full rotate-90 border-r-[1.5px] border-[#EBEBEB] border-t-[1.5px]"></div>
        </div>
        <div className="h-full min-[100px] w-[200px] rounded-t-lg  bg-[white] border-[1.5px] border-b-0 border-[#EBEBEB] mb-[-1px] flex justify-start items-center px-[10px] text-[14px] cursor-pointer ">
          <span className="whitespace-nowrap overflow-hidden text-ellipsis ">
            Writing is Telepathy and you know that
          </span>
          <div className="flex justify-center items-center hover:bg-[#EBEBEB] text-[#7b798b] hover:text-[black] min-w-[20px] h-[20px] rounded-full">
            <X width={15} height={15} strokeWidth={2.5} />
          </div>
        </div>
        <div className="w-[12px] h-[12px] bg-[#ffffff] overflow-hidden p-[0px] border-none ml-[-1px] z-[9] mb-[-1px] mr-[-10px]">
          <div className="w-full h-full bg-[#F6F6F6] rounded-tr-full rotate-180 border-r-[1.5px] border-[#EBEBEB] border-t-[1.5px]"></div>
        </div>
        <div className="h-[calc(100%-1px)] min-[100px] w-[200px] rounded-t-lg bg-[#F6F6F6] flex justify-start items-center px-[10px] text-[14px] border-[1.5px] border-b-0 border-[#ebebeb00] mb-[0px]  cursor-pointer z-[0]">
          <span className="whitespace-nowrap overflow-hidden text-ellipsis ">
            Writing is Telepathy and you know that
          </span>
          <div className="flex justify-center items-center hover:bg-[#EBEBEB] text-[#7b798b] hover:text-[black] min-w-[20px] h-[20px] rounded-full">
            <X width={15} height={15} strokeWidth={2.5} />
          </div>
        </div>
        <div className="h-full flex items-center">
          <div className="h-[20px] border border-[#c7c7c7]"></div>
        </div>
        <div className="h-[calc(100%-1px)] min-[100px] w-[200px] rounded-t-lg bg-[#F6F6F6] flex justify-start items-center px-[10px] text-[14px] border-[1.5px] border-b-0 border-[#ebebeb00] mb-[0px]  cursor-pointer z-[0]">
          <span className="whitespace-nowrap overflow-hidden text-ellipsis ">
            Writing is Telepathy and you know that
          </span>
          <div className="flex justify-center items-center hover:bg-[#EBEBEB] text-[#7b798b] hover:text-[black] min-w-[20px] h-[20px] rounded-full">
            <X width={15} height={15} strokeWidth={2.5} />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default MainPageTopBar;
