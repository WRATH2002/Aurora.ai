import React from "react";

const COMMANDS = [
  { label: "Heading 1", action: () => console.log("Insert H1") },
  { label: "Heading 2", action: () => console.log("Insert H2") },
  { label: "Bullet List", action: () => console.log("Insert Bullet List") },
  { label: "Numbered List", action: () => console.log("Insert Numbered List") },
];

export default function CommandMenu({ position }) {
  return (
    <div
      className="command-menu"
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        padding: "8px",
        zIndex: 1000,
      }}
    >
      {COMMANDS.map((cmd, i) => (
        <div
          key={i}
          className="command-item"
          style={{ padding: "6px 10px", cursor: "pointer" }}
          onClick={cmd.action}
        >
          {cmd.label}
        </div>
      ))}
    </div>
  );
}
