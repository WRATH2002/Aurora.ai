import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react"; // adjust import if needed
import {
  FileAttachmentIcon,
  FileShredderIcon,
  StickyNote02Icon,
  Note02Icon,
  AiBrain01Icon,
  Comment01Icon,
  MapsIcon,
  CalendarLove01Icon,
  AiVoiceIcon,
  Robot01Icon,
  ProjectorIcon,
  SentIcon,
} from "@hugeicons/core-free-icons"; // or whatever icon you use
import { p1, p2, p3, p4, p5, p6, p7, p8 } from "./position";

const a1 = [2, 5];
const a2 = [4, 8, 1, 9];
const a3 = [11, 6];

const iconList = [
  FileAttachmentIcon,
  FileShredderIcon,
  StickyNote02Icon,
  Note02Icon,
  AiBrain01Icon,
  Comment01Icon,
  MapsIcon,
  CalendarLove01Icon,
  AiVoiceIcon,
  Robot01Icon,
  ProjectorIcon,
  SentIcon,
];

const generateIcons = () => {
  const icons = [];
  const positions = [];

  const isTooClose = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1) < 8;

  while (icons.length < 12) {
    const top = +(Math.random() * 100).toFixed(2);
    const left = +(Math.random() * 100).toFixed(2);

    const inCenter = top > 40 && top < 60 && left > 40 && left < 60;
    const tooCloseToEdge = top < 10 || top > 90 || left < 10 || left > 90;

    if (inCenter || tooCloseToEdge) continue;

    const tooClose = positions.some(([t, l]) => isTooClose(top, left, t, l));
    if (tooClose) continue;

    const rotation = +(Math.random() * 360).toFixed(1);

    positions.push([top, left]);

    icons.push({ top, left, rotation });
  }

  console.log("Generated Icons:", icons);
  return icons;
};

const HeroSection = (props) => {
  const [iconData, setIconData] = useState(p8);

  useEffect(() => {
    setIconData(p7);
  }, []);

  const regenerate = () => {
    const newIcons = generateIcons();
    // const newIcons = p2;
    setIconData(newIcons);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(iconData, null, 2));
    alert("Copied icon positions to clipboard!");
  };

  const downloadAsFile = () => {
    const blob = new Blob([JSON.stringify(iconData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "icon-positions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center relative min-h-[600px] w-[80%] text-white ">
        <div className="w-full flex flex-col justify-start items-center h-[140px]">
          <span
            className={
              "font-[DMSb] whitespace-nowrap text-[30px] md:text-[50px] lg:text-[50px] flex justify-center items-center relative z-50" +
              (props?.anime
                ? " mt-[0px] opacity-100 blur-0"
                : " mt-[30px] opacity-0 blur-md")
            }
            style={{ transition: ".5s", transitionDelay: ".4s" }}
          >
            Redefining Note Taking
          </span>
          <span
            className={
              "font-[DMSb] whitespace-nowrap text-[30px] md:text-[50px] lg:text-[50px] flex justify-center items-center relative mt-[-10px] z-50" +
              (props?.anime
                ? " mt-[0px] md:mt-[-10px] lg:mt-[-10px] opacity-100 blur-0"
                : " mt-[30px] md:mt-[20px] lg:mt-[20px] opacity-0 blur-md")
            }
            style={{ transition: ".5s", transitionDelay: ".6s" }}
          >
            <div className="glow-text mr-[15px]">Reimagined</div> for You
          </span>
        </div>
        <div
          className={
            "hidden md:block lg:block" +
            (props?.anime ? " opacity-100" : " opacity-0")
          }
          style={{ transition: ".7s", transitionDelay: ".8s" }}
        >
          {p8?.map(({ top, left, rotation }, index) => (
            <>
              {index == 0 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={FileAttachmentIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 1 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={FileShredderIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 2 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={StickyNote02Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 3 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={Note02Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 4 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={AiBrain01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 5 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={Comment01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 6 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={MapsIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 7 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={CalendarLove01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 8 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={AiVoiceIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 9 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={Robot01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 10 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={SentIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={ProjectorIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              )}
            </>
          ))}
        </div>
        <div
          className={
            "block md:hidden lg:hidden" +
            (props?.anime ? " opacity-100" : " opacity-0")
          }
          style={{ transition: ".7s", transitionDelay: ".8s" }}
        >
          {p6?.map(({ top, left, rotation }, index) => (
            <>
              {index == 0 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={FileAttachmentIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 1 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={FileShredderIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 2 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={StickyNote02Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 3 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={Note02Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 4 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={AiBrain01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 5 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={Comment01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 6 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={MapsIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 7 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={CalendarLove01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 8 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={AiVoiceIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 9 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={Robot01Icon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : index == 10 ? (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={SentIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              ) : (
                <HugeiconsIcon
                  key={index}
                  className={
                    `absolute text-[#cfcfcf] animate-float rotate-[${rotation}deg]` +
                    (a1.includes(index)
                      ? " blur-[1px]"
                      : a2.includes(index)
                      ? " blur-[2px]"
                      : a3.includes(index)
                      ? " blur-[3px]"
                      : " blur-0")
                  }
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    // transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                    rotate: `${rotation}deg`,
                  }}
                  icon={ProjectorIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              )}
            </>
          ))}
        </div>
        {/*  */}
      </div>
      {/* <button
        onClick={regenerate}
        className="mt-8 px-4 py-2 bg-white text-black rounded shadow"
      >
        Regenerate Positions
      </button>{" "}
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-green-500 text-white rounded shadow"
      >
        Copy JSON
      </button>
      <button
        onClick={downloadAsFile}
        className="px-4 py-2 bg-blue-500 text-white rounded shadow"
      >
        Download JSON
      </button> */}
    </>
  );
};

export default HeroSection;
