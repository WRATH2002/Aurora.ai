import {
  ArrowRight01Icon,
  Download04Icon,
  EnergyIcon,
  FullScreenIcon,
  RedoIcon,
  Settings03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import html2pdf from "html2pdf.js";

const aiModels = [
  {
    Model: "gemini-2.5-pro-preview-05-06",
    About: "Coding, reasoning, multimodal",
    limit: 1500,
    rpd: 25,
  },
  {
    Model: "gemini-2.5-pro-preview-05-06",
    About: "Coding, reasoning, multimodal",
    limit: 1500,
    rpd: 25,
  },
  {
    Model: "gemini-2.0-flash",
    About: "Multimodal, realtime streaming",
    limit: 1500,
    rpd: 1500,
  },
  {
    Model: "gemini-2.0-flash-lite",
    About: "Long context, realtime streaming",
    limit: 1500,
    rpd: 1500,
  },
  // {
  //   Model: "gemini-2.0-pro-exp-02-05",
  //   About: "Multimodal, realtime streaming",
  //   limit: 1500,rpd : 25,
  // },
  // {
  //   Model: "gemini-2.0-flash-thinking-exp-01-21",
  //   About: "Multimodal, reasoning, coding",
  //   limit: 1500,rpd : 25,
  // },
  {
    Model: "gemini-1.5-pro",
    About: "Long context, complex & math reasoning",
    limit: 50,
    rpd: 50,
  },
  {
    Model: "gemini-1.5-flash",
    About: "Image, video, audio understanding",
    limit: 1500,
    rpd: 1500,
  },
  {
    Model: "gemini-1.5-flash-8b",
    About: "Low latency, multilingual, summarization",
    limit: 1500,
    rpd: 1500,
  },
];

export default function AIChatInfo(props) {
  const handleDownload = (data) => {
    // const element = contentRef.current;
    console.log("Starting download...");
    props?.setDownloadStarting((prev) => true);
    props?.setDownloadStartingSub((prev) => true);

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // Top, left, bottom, right in inches
      filename: "document.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(options)
      .from(data)
      .toPdf()
      .get("pdf")
      .then(() => {
        console.log("Download started.");
        props?.setDownloadStarting((prev) => false);

        setTimeout(() => {
          props?.setDownloadStartingSub((prev) => false);
        }, 3000);
      })
      .save();
  };

  function checkPercentage(model, apiInfo) {
    let tempRPD = aiModels?.filter((data) => {
      if (data?.Model == model) {
        return data?.rpd;
      }
    })[0]?.rpd;
    console.log(tempRPD);

    let apiCallCount = apiInfo?.RequestInADay?.filter(
      (data) => data?.model == model
    );
    console.log(apiCallCount.length);

    return Math?.round(apiCallCount?.length / tempRPD);
  }

  return (
    <>
      <div
        className={
          "min-h-[50px] font-[DMSr] w-full flex border-b-[1.5px]  justify-between items-center px-[15px] " +
          (props?.theme ? " border-[#252525]" : " border-[#f7f7f7]")
        }
      >
        <div
          className={
            "text-[13px] flex justify-start items-center" +
            (props?.theme ? " text-[#ffffff]" : " text-[#949494]")
          }
        >agent
          <HugeiconsIcon
            className={
              "mr-[15px] cursor-pointer" +
              (props?.theme
                ? " text-[#828282] hover:text-[#ffffff]"
                : " text-[#797979] hover:text-[#000000]")
            }
            icon={FullScreenIcon}
            size={18}
            strokeWidth={1.8}
            onClick={() => {
              props?.setChatSidebarModal(!props?.chatSidebarModal);
            }}
          />
          {props?.agentInfo?.length ? (
            <div className="px-[10px] py-[2px] flex justify-center items-center border-[1.5px] border-[#000000] bg-[#000000] text-[#ffffff] rounded-[10px] text-[12px]">
              Agent
            </div>
          ) : (
            <div className="px-[10px] py-[2px] flex justify-center items-center border-[1.5px] border-[#f2f2f2] bg-[#f7f7f7] text-[#000000] rounded-[10px] text-[12px]">
              Normal
            </div>
          )}
          <HugeiconsIcon
            className="mx-[5px]"
            icon={ArrowRight01Icon}
            size={12}
            strokeWidth={2.4}
          />
          {props?.selectedChatName}
        </div>
        <div className="flex justify-end items-center">
          <div className="flex justify-start items-center ">
            <HugeiconsIcon
              className={
                "rotate-6" +
                (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
              }
              icon={EnergyIcon}
              size={18}
              fill="black"
              strokeWidth={1}
            />
            {/* <span className="ml-[5px] text-[13px]">Token Usage</span> */}
            {/* <div className="ml-[15px] w-[100px] h-[6px] rounded-full bg-[#f3f3f3] flex justify-start items-center overflow-hidden">
              
              <div
                className={
                  ` h-full rounded-r-[2px]  ` +
                  (props?.theme
                    ? Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) < 50
                      ? " bg-[#19cb5a]"
                      : Math.round(
                          (props?.APIKeyInfo?.RequestInADay?.filter(
                            (data) => data?.model == props?.currentModel
                          ).length /
                            aiModels?.filter((data) => {
                              if (data?.Model == props?.currentModel) {
                                return data?.rpd;
                              }
                            })[0]?.rpd) *
                            100
                        ) <= 75
                      ? " bg-[#ababab]"
                      : " bg-[#ababab]"
                    : Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) < 50
                    ? " bg-[#55cf30]"
                    : Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) <= 75
                    ? " bg-[#e0981a]"
                    : " bg-[#e0541a]")
                }
                style={{
                  transition: ".3s",
                  width: `${Math.round(
                    (props?.APIKeyInfo?.RequestInADay?.filter(
                      (data) => data?.model == props?.currentModel
                    ).length /
                      aiModels?.filter((data) => {
                        if (data?.Model == props?.currentModel) {
                          return data?.rpd;
                        }
                      })[0]?.rpd) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
            <span className="ml-[15px] text-[12px]">
            
              {Math.round(
                (props?.APIKeyInfo?.RequestInADay?.filter(
                  (data) => data?.model == props?.currentModel
                ).length /
                  aiModels?.filter((data) => {
                    if (data?.Model == props?.currentModel) {
                      return data?.rpd;
                    }
                  })[0]?.rpd) *
                  100
              )}
              %
            </span> */}

            <div className="ml-[10px] w-[50px] h-[20px] rounded-[6px] bg-[#f3f3f3] flex flex-col justify-start items-start overflow-hidden ">
              <div
                className="w-full h-[20px] flex justify-center items-center text-[11px] font-[DMSb] z-[4]"
                // style={{ WebkitTextStroke: ".1px white" }}
              >
                {Math.round(
                  (props?.APIKeyInfo?.RequestInADay?.filter(
                    (data) => data?.model == props?.currentModel
                  ).length /
                    aiModels?.filter((data) => {
                      if (data?.Model == props?.currentModel) {
                        return data?.rpd;
                      }
                    })[0]?.rpd) *
                    100
                )}
                %
              </div>
              {/* <div className="w-full h-full mt-[-20px] flex justify-evenly items-center z-[3]">
                <div className="w-[1.8px] bg-[white] h-full"></div>
                <div className="w-[1.8px] bg-[white] h-full"></div>
              </div> */}

              <div
                className={
                  "  h-full rounded-l-[6px] filter mt-[-20px]" +
                  (props?.theme
                    ? Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) < 50
                      ? " bg-[#82df36e3] drop-shadow-[0_0px_6px_rgba(130,223,54,0.5)]"
                      : Math.round(
                          (props?.APIKeyInfo?.RequestInADay?.filter(
                            (data) => data?.model == props?.currentModel
                          ).length /
                            aiModels?.filter((data) => {
                              if (data?.Model == props?.currentModel) {
                                return data?.rpd;
                              }
                            })[0]?.rpd) *
                            100
                        ) <= 75
                      ? " bg-[#ababab]"
                      : " bg-[#ababab]"
                    : Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) < 50
                    ? " bg-[#82df36e3] drop-shadow-[0_0px_6px_rgba(130,223,54,0.5)]"
                    : Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) <= 75
                    ? " bg-[#f5aa27eb] drop-shadow-[0_0px_6px_rgba(245,170,39,0.5)]"
                    : " bg-[#f05210e0] drop-shadow-[0_0px_6px_rgba(240,82,16,0.5)]")
                }
                style={{
                  transition: ".2s",
                  width: `${Math.round(
                    (props?.APIKeyInfo?.RequestInADay?.filter(
                      (data) => data?.model == props?.currentModel
                    ).length /
                      aiModels?.filter((data) => {
                        if (data?.Model == props?.currentModel) {
                          return data?.rpd;
                        }
                      })[0]?.rpd) *
                      100
                  )}%`,
                }}
              ></div>

              {/* <div
                className={
                  " rounded-r-sm h-full rounded-l-[6px] overflow-hidden" +
                  (props?.theme
                    ? Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) < 50
                      ? " shadow-[0_0px_6px_rgba(130,223,54,0.5)]"
                      : Math.round(
                          (props?.APIKeyInfo?.RequestInADay?.filter(
                            (data) => data?.model == props?.currentModel
                          ).length /
                            aiModels?.filter((data) => {
                              if (data?.Model == props?.currentModel) {
                                return data?.rpd;
                              }
                            })[0]?.rpd) *
                            100
                        ) <= 75
                      ? " "
                      : " "
                    : Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) < 50
                    ? " shadow-[0_0px_6px_rgba(130,223,54,0.5)]"
                    : Math.round(
                        (props?.APIKeyInfo?.RequestInADay?.filter(
                          (data) => data?.model == props?.currentModel
                        ).length /
                          aiModels?.filter((data) => {
                            if (data?.Model == props?.currentModel) {
                              return data?.rpd;
                            }
                          })[0]?.rpd) *
                          100
                      ) <= 75
                    ? " shadow-[0_0px_6px_rgba(245,170,39,0.5)]"
                    : " shadow-[0_0px_6px_rgba(240,82,16,0.5)]")
                }
                style={{
                  transition: ".2s",
                  width: `20%`,
                }}
              >
                {" "}
                <div
                  className={
                    " rounded-r-sm h-full rounded-l-[6px]" +
                    (props?.theme
                      ? Math.round(
                          (props?.APIKeyInfo?.RequestInADay?.filter(
                            (data) => data?.model == props?.currentModel
                          ).length /
                            aiModels?.filter((data) => {
                              if (data?.Model == props?.currentModel) {
                                return data?.rpd;
                              }
                            })[0]?.rpd) *
                            100
                        ) < 50
                        ? " bg-[#82df36e3] shadow-[0_0px_6px_rgba(130,223,54,0.5)]"
                        : Math.round(
                            (props?.APIKeyInfo?.RequestInADay?.filter(
                              (data) => data?.model == props?.currentModel
                            ).length /
                              aiModels?.filter((data) => {
                                if (data?.Model == props?.currentModel) {
                                  return data?.rpd;
                                }
                              })[0]?.rpd) *
                              100
                          ) <= 75
                        ? " bg-[#ababab]"
                        : " bg-[#ababab]"
                      : Math.round(
                          (props?.APIKeyInfo?.RequestInADay?.filter(
                            (data) => data?.model == props?.currentModel
                          ).length /
                            aiModels?.filter((data) => {
                              if (data?.Model == props?.currentModel) {
                                return data?.rpd;
                              }
                            })[0]?.rpd) *
                            100
                        ) < 50
                      ? " bg-[#82df36e3] shadow-[0_0px_6px_rgba(130,223,54,0.5)]"
                      : Math.round(
                          (props?.APIKeyInfo?.RequestInADay?.filter(
                            (data) => data?.model == props?.currentModel
                          ).length /
                            aiModels?.filter((data) => {
                              if (data?.Model == props?.currentModel) {
                                return data?.rpd;
                              }
                            })[0]?.rpd) *
                            100
                        ) <= 75
                      ? " bg-[#f5aa27eb] shadow-[0_0px_6px_rgba(245,170,39,0.5)]"
                      : " bg-[#f05210e0] shadow-[0_0px_6px_rgba(240,82,16,0.5)]")
                  }
                  style={{
                    transition: ".2s",
                    width: `${Math.round(
                      (props?.APIKeyInfo?.RequestInADay?.filter(
                        (data) => data?.model == props?.currentModel
                      ).length /
                        aiModels?.filter((data) => {
                          if (data?.Model == props?.currentModel) {
                            return data?.rpd;
                          }
                        })[0]?.rpd) *
                        100
                    )}%`,
                  }}
                ></div>
              </div> */}
            </div>
          </div>
          <div className="border-l-[1.5px] border-[#e9e9e9] mx-[15px] h-[22px]"></div>
          {/* <div
            className={
              "text-[12px] px-[10px] border-[1.5px] py-[3px] flex rounded-[10px] justify-center items-center mr-[15px] cursor-pointer" +
              (props?.theme
                ? " bg-[white] border-[green] text-[black]"
                : " bg-[#38ce3d28] border-[#58be36a3] text-[#1eb51e] hover:bg-[#38ce3d40] hover:border-[#5ca245a3] hover:text-[#4aa32c]")
            }
            onClick={(e) => {
              console.log(props?.chatReference);
              // // handleCopyClick(index)
              // const preInsideDiv = document.querySelectorAll(
              //   ".chatMessageContainer .chatMessage"
              // );
              // // setIsCopied(true);
              // // setTimeout(() => {
              // //   setIsCopied(false);
              // // }, 1000);
              handleDownload(props?.chatReference);
              // console.log(preInsideDiv[index]);
            }}
          >
            
            Export Chat
          </div> */}
          {/* <div className=""></div> */}
          {/* 1b7d1eba */}
          <div className="flex justify-end items-center">
            <HugeiconsIcon
              className={
                "mr-[15px] cursor-pointer" +
                (props?.theme
                  ? " text-[#828282] hover:text-[#ffffff]"
                  : " text-[#797979] hover:text-[#000000]")
              }
              icon={RedoIcon}
              size={18}
              strokeWidth={1.8}
            />
            <HugeiconsIcon
              className={
                "mr-[0px] cursor-pointer" +
                (props?.theme
                  ? " text-[#828282] hover:text-[#ffffff]"
                  : " text-[#797979] hover:text-[#000000]")
              }
              icon={Settings03Icon}
              size={18}
              strokeWidth={1.8}
            />
          </div>
        </div>
      </div>
    </>
  );
}
