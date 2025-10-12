import React from "react";
import { useSelector } from "react-redux";
import ColorPicker from "./ColorPicker";

export default function CreateTheme() {
  // ---- For fetching data from Redux Store
  const currentTheme = useSelector((state) => state?.currentTheme);

  return (
    <>
      <div className="w-full h-[100svh] flex justify-center items-center fixed z-[1000] backdrop-blur-sm bg-[#c1c1c154]">
        <div
          className="w-[700px] h-[400px] rounded-2xl p-[20px]"
          style={{
            backgroundColor: `${currentTheme?.bgPrimary}`,
          }}
        >
          <ColorPicker currentTheme={currentTheme} />
        </div>
      </div>
    </>
  );
}
