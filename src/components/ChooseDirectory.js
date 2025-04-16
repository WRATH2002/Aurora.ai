import { ChevronRight, File, Folder, FolderOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { checkAndAddFiles } from "../utils/functionsConstant";

export default function ChooseDirectory(props) {
  const [expand, setExpand] = useState(false);

  return (
    <>
      {props?.data?.isFolder ? (
        <div
          key={props?.index}
          className={
            "text-[14px]  cursor-pointer rounded-[4px] flex justify-start items-center px-[7px] w-full min-h-[27px] max-h-[27px] my-[1px] group " +
            (props?.data?.isFolder
              ? props?.theme
                ? " hover:bg-[#26262600] text-[#9ba6aa] hover:text-[#ffffff]"
                : " hover:bg-[#F8F8FB00] text-[#6e6e7c] hover:text-[#000000]"
              : props?.theme
              ? props?.fileStacked[props?.selected] == props?.directory
                ? " bg-[#222222] text-[#ffffff]"
                : " hover:bg-[#222222] text-[#9ba6aa] hover:text-[#ffffff]"
              : props?.fileStacked[props?.selected] == props?.directory
              ? " hover:bg-[#ededed] text-[#6e6e7c] hover:text-[#000000]"
              : " hover:bg-[#ededed] text-[#6e6e7c] hover:text-[#000000]")
          }
          onClick={() => {
            if (props?.data?.isFolder) {
              setExpand(!expand);
            } else {
              props?.setFileStacked(
                checkAndAddFiles(
                  props?.fileStacked,
                  props?.directory,
                  props?.setSelected
                )
              );
              console.log(props?.data?.Title);
            }
            console.log(props?.directory);

            if (props?.directory.includes("~_~")) {
              if (props?.data?.isFolder) {
                console.log("The activeFolder is ------> " + props?.directory);
                props?.setEntryDirectory(props?.directory);
              } else {
                console.log(
                  "The activeFolder is ------> " +
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
                props?.setEntryDirectory(props?.directory);
              } else {
                console.log("The activeFolder is ------> Root");
                props?.setEntryDirectory("");
              }
            }
          }}
        >
          {props?.data?.isFolder ? (
            <>
              <div className="min-w-[40px] mr-[-4px] flex justify-start items-center">
                <ChevronRight
                  width={14}
                  height={14}
                  strokeWidth="2.5"
                  className={
                    " ml-[-3px] mr-[5.5px]  " +
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
                      ? " text-[#6e6e7c]"
                      : " text-[#6e6e7c]")
                  }
                  style={{ transition: ".2s" }}
                />
                {!expand ? (
                  <Folder
                    width={15}
                    height={15}
                    strokeWidth="2"
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
                        ? " text-[#6e6e7c] group-hover:text-[#000000]"
                        : " text-[#6e6e7c] group-hover:text-[#000000]")
                    }
                    style={{ transition: ".2s" }}
                  />
                ) : (
                  <FolderOpen
                    width={15}
                    height={15}
                    strokeWidth="2"
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
                        ? " text-[#6e6e7c] group-hover:text-[#000000]"
                        : " text-[#6e6e7c] group-hover:text-[#000000]")
                    }
                    style={{ transition: ".2s" }}
                  />
                )}
              </div>
            </>
          ) : (
            <></>
          )}
          {!props?.data?.isFolder ? (
            <></>
          ) : (
            <>
              <span
                className={
                  "text-ellipsis overflow-hidden whitespace-nowrap " +
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
                    ? " group-hover:text-[black]"
                    : " group-hover:text-[#000000]")
                }
              >
                {props?.data?.Title}
              </span>
            </>
          )}
        </div>
      ) : (
        <></>
      )}
      {expand && props?.data?.isFolder ? (
        <>
          <div className="w-full flex flex-col justify-start items-start pl-[10px]">
            <div
              className={
                "w-full flex flex-col justify-start items-start border-dashed pl-[5px] border-l-[1.5px] " +
                (props?.theme ? " border-[#222222]" : " border-[#f3f3fa]")
              }
            >
              {props?.data?.subStructure?.map((data, index) => {
                return (
                  <>
                    <ChooseDirectory
                      index={index}
                      data={data}
                      directory={props?.directory + "~_~" + data?.Title}
                      fileStacked={props?.fileStacked}
                      setFileStacked={props?.setFileStacked}
                      selected={props?.selected}
                      setSelected={props?.setSelected}
                      activeFolder={props?.activeFolder}
                      setActiveFolder={props?.setActiveFolder}
                      entryDirectory={props?.entryDirectory}
                      setEntryDirectory={props?.setEntryDirectory}
                      theme={props?.theme}
                    />
                  </>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
