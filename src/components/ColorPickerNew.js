import React from "react";

export default function ColorPickerNew() {
  const saturationRef = useRef(null);
  return (
    <>
      <div
        ref={saturationRef}
        className="relative w-full h-[200px] rounded-[10px] cursor-crosshair mb-6 overflow-hidden mt-[8px]"
        style={{
          background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`,
        }}
        onMouseDown={handleSaturationMouseDown}
      >
        <div
          className="absolute w-6 h-6 rounded-full border-4 border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </>
  );
}
