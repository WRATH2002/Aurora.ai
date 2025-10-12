import { useState, useRef } from "react";
import { Pipette } from "lucide-react";

export default function ColorPicker({ currentTheme }) {
  const [colorMode, setColorMode] = useState("RGB");
  const [hue, setHue] = useState(240);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [alpha, setAlpha] = useState(100);
  const [isDraggingSaturation, setIsDraggingSaturation] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);

  const saturationRef = useRef(null);
  const hueRef = useRef(null);
  const alphaRef = useRef(null);

  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4)),
    ];
  };

  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const [r, g, b] = hslToRgb(hue, saturation, lightness);

  const handleSaturationMouseDown = (e) => {
    setIsDraggingSaturation(true);
    handleSaturationMove(e);
  };

  const handleSaturationMove = (e) => {
    if (!saturationRef.current) return;
    const rect = saturationRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const newSaturation = (x / rect.width) * 100;
    const newLightness = 100 - (y / rect.height) * 100;

    setSaturation(newSaturation);
    setLightness(newLightness);
  };

  const handleHueMouseDown = (e) => {
    setIsDraggingHue(true);
    handleHueMove(e);
  };

  const handleHueMove = (e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newHue = (x / rect.width) * 360;
    setHue(newHue);
  };

  const handleAlphaMouseDown = (e) => {
    setIsDraggingAlpha(true);
    handleAlphaMove(e);
  };

  const handleAlphaMove = (e) => {
    if (!alphaRef.current) return;
    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newAlpha = (x / rect.width) * 100;
    setAlpha(newAlpha);
  };

  const handleGlobalMouseMove = (e) => {
    if (isDraggingSaturation && saturationRef.current) {
      handleSaturationMove(e);
    }
    if (isDraggingHue && hueRef.current) {
      handleHueMove(e);
    }
    if (isDraggingAlpha && alphaRef.current) {
      handleAlphaMove(e);
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDraggingSaturation(false);
    setIsDraggingHue(false);
    setIsDraggingAlpha(false);
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return [h * 360, s * 100, l * 100];
  };

  const handleHexInput = (value) => {
    const rgb = hexToRgb(value);
    if (rgb) {
      const [newH, newS, newL] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
      setHue(newH);
      setSaturation(newS);
      setLightness(newL);
    }
  };

  const handleRgbInput = (index, value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 255) return;

    const newRgb = [r, g, b];
    newRgb[index] = num;
    const [newH, newS, newL] = rgbToHsl(newRgb[0], newRgb[1], newRgb[2]);
    setHue(newH);
    setSaturation(newS);
    setLightness(newL);
  };

  const handleHslInput = (type, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    if (type === "h" && num >= 0 && num <= 360) setHue(num);
    if (type === "s" && num >= 0 && num <= 100) setSaturation(num);
    if (type === "l" && num >= 0 && num <= 100) setLightness(num);
  };

  const handleAlphaInput = (value) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setAlpha(num);
    }
  };

  return (
    <div
      className="bg-white rounded-xl p-[8px] w-[240px] border border-[#d2d2d2] font-[Geist]"
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
      style={{
        background: "#fff",
        boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* <div
        className="w-full h-[35px] rounded-lg border-[1.5px]  overflow-hidden border-[#ededed] flex justify-start items-center"
        style={{ backgroundColor: `${currentTheme?.bgFourthary}` }}
      >
        <div
          className={
            "w-[calc(100%/4)] h-full rounded-lg shadow-md border-[0px] border-[#ededed]" +
            (colorMode == "Hex"
              ? " ml-[calc((100%/4)*0)]"
              : colorMode == "RGB"
              ? " ml-[calc((100%/4)*1)]"
              : colorMode == "HSL"
              ? " ml-[calc((100%/4)*2)]"
              : " ml-[calc((100%/4)*3)]")
          }
          style={{
            backgroundColor: `${currentTheme?.bgPrimary}`,
            transition: `${currentTheme?.mediumAnimationDuration}`,
            // boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
          }}
        ></div>
      </div> */}

      {/* <div
        className="mt-[-35px] w-full h-[35px] rounded-lg  flex justify-start items-center"
        style={{ backgroundColor: `transparent` }}
      >
        {["Hex", "RGB", "HSL", "Null"].map((mode) => (
          <button
            key={mode}
            onClick={() => setColorMode(mode)}
            className={`w-[calc(100%/4)] h-full font-[600] text-[14px] flex justify-center items-center transition-all rounded-[10px] ${
              colorMode === mode
                ? " text-[gray-800] "
                : " text-[gray-500] hover:bg-[gray-200]"
            }`}
          >
            {mode}
          </button>
        ))}
      </div> */}
      <div className="w-full flex justify-between items-center">
        <div className="flex justify-start items-center w-auto">
          <div
            className="min-w-[25px] min-h-[25px] rounded-lg  bg-[length:12px_12px] 
     [background-color:white] 
     [background-image:linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] 
     [background-position:0_0,0_6px,6px_-6px,-6px_0] overflow-hidden"
          >
            <div className="min-w-full min-h-full bg-[#c12a2ac8] z-[1000]"></div>
          </div>{" "}
          <input
            className="ml-[10px] w-auto text-[14px] font-[500] outline-none"
            value={rgbToHex(r, g, b).toUpperCase()}
          ></input>
        </div>
        <div className="flex justify-end items-center">
          <input
            className="ml-[10px] w-auto text-[14px] font-[500] outline-none"
            value={`${Math.round(alpha)}%`}
          ></input>
        </div>
      </div>

      <div
        ref={saturationRef}
        className="relative w-full h-[200px] rounded-[10px] cursor-crosshair mb-6 overflow-hidden mt-[8px]"
        style={{
          background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hue}, 100%, 50%))`,
        }}
        onMouseDown={handleSaturationMouseDown}
      >
        <div
          className="absolute w-[18px] h-[18px] rounded-full border-[3px] border-white shadow-lg pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${saturation}%`,
            top: `${100 - lightness}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* <Pipette className="w-8 h-8 text-gray-600" /> */}
        <div
          ref={hueRef}
          className="relative flex-1 h-[10px] rounded-full cursor-pointer"
          style={{
            background:
              "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
          onMouseDown={handleHueMouseDown}
        >
          <div
            className="absolute w-[18px] h-[18px] rounded-full border-[4px] border-white shadow-lg top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${(hue / 360) * 100}%`,
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 ">
        <div
          ref={alphaRef}
          className="relative flex-1 h-[10px] rounded-full cursor-pointer"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: "10px 10px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
          }}
          onMouseDown={handleAlphaMouseDown}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, hsl(${hue}, ${saturation}%, ${lightness}%))`,
            }}
          />
          <div
            className="absolute w-6 h-6 rounded-full border-4 border-white shadow-lg top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${alpha}%`,
              backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${
                alpha / 100
              })`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>

      <div className="flex justify-start items-center w-full text-[14px]">
        {colorMode === "RGB" && (
          <>
            <div className="flex items-center ">
              <span className="text-gray-400 text-3xl font-medium">R</span>
              <input
                type="text"
                value={r}
                onChange={(e) => handleRgbInput(0, e.target.value)}
                className="text-gray-800 text-4xl font-semibold min-w-[90px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-3xl font-medium">G</span>
              <input
                type="text"
                value={g}
                onChange={(e) => handleRgbInput(1, e.target.value)}
                className="text-gray-800 text-4xl font-semibold min-w-[90px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-3xl font-medium">B</span>
              <input
                type="text"
                value={b}
                onChange={(e) => handleRgbInput(2, e.target.value)}
                className="text-gray-800 text-4xl font-semibold min-w-[90px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
              />
            </div>
          </>
        )}
        {colorMode === "Hex" && (
          <div className="flex items-center w-[calc(100%-100px)]">
            <input
              type="text"
              value={rgbToHex(r, g, b).toUpperCase()}
              onChange={(e) => handleHexInput(e.target.value)}
              className="text-gray-800 font-semibold bg-gray-50 border-2 border-transparent rounded-lg px-3 py-1 focus:border-gray-300 focus:outline-none"
            />
          </div>
        )}
        {colorMode === "HSL" && (
          <>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-3xl font-medium">H</span>
              <input
                type="text"
                value={Math.round(hue)}
                onChange={(e) => handleHslInput("h", e.target.value)}
                className="text-gray-800 text-4xl font-semibold min-w-[90px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-3xl font-medium">S</span>
              <input
                type="text"
                value={Math.round(saturation)}
                onChange={(e) => handleHslInput("s", e.target.value)}
                className="text-gray-800 text-4xl font-semibold min-w-[90px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-3xl font-medium">L</span>
              <input
                type="text"
                value={Math.round(lightness)}
                onChange={(e) => handleHslInput("l", e.target.value)}
                className="text-gray-800 text-4xl font-semibold min-w-[90px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
              />
            </div>
          </>
        )}
        {colorMode === "Null" && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-4xl font-semibold">null</span>
          </div>
        )}
        <div className="flex items-center w-[80px]">
          <input
            type="text"
            value={Math.round(alpha)}
            onChange={(e) => handleAlphaInput(e.target.value)}
            className="text-gray-800 font-semibold w-[120px] bg-gray-50 border-2 border-transparent rounded-lg px-2 py-1 focus:border-gray-300 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
