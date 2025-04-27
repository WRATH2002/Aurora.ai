import React, { useState, useEffect } from "react";

export default function TypingEffect({ data, activeIndex, setActiveIndex }) {
  const [typedElements, setTypedElements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevSize, setPrevSize] = useState(data?.Message?.length || 0);

  useEffect(() => {
    const currentSize = data?.Message?.length || 0;

    if (currentSize !== prevSize) {
      // Handle size change
      setPrevSize(currentSize); // Update size tracking
      setActiveIndex(currentSize - 1); // Set active index to the last message
      setTypedElements([]); // Reset typed elements for animation
      setCurrentIndex(0); // Reset animation index
    }
  }, [data?.Message?.length, prevSize, setActiveIndex]);

  useEffect(() => {
    const text = data?.Message?.[activeIndex] || "";
    const currentSize = data?.Message?.length || 0;

    if (currentSize !== prevSize) {
      // Animation logic when size changes
      const formatText = (text) => text; // Optional: Add your formatting logic here

      const html = formatText(text); // Format the text
      const parser = new DOMParser();
      const parsedDocument = parser.parseFromString(html, "text/html");
      const nodes = Array.from(parsedDocument.body.childNodes);

      // Split the nodes into words
      const words = nodes.flatMap((node) =>
        node.nodeType === Node.TEXT_NODE
          ? node.textContent.split(" ").map((word) => ({ word, tag: null }))
          : [{ word: node.outerHTML, tag: node.nodeName.toLowerCase() }]
      );

      if (currentIndex < words.length) {
        const timeout = setTimeout(() => {
          setTypedElements((prev) => [...prev, words[currentIndex]]);
          setCurrentIndex((prev) => prev + 1);
        }, 50); // Adjust typing speed for words

        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, activeIndex, data?.Message, prevSize]);

  const text = data?.Message?.[activeIndex] || "";

  // Render text directly if size hasn't changed
  if (data?.Message?.length === prevSize) {
    return <div className="whitespace-pre-wrap font-[DMSr]">{text}</div>;
  }

  // Render with animation if size changes
  return (
    <div className="whitespace-pre-wrap font-[DMSr]">
      {typedElements.map((element, index) =>
        element.tag ? (
          <span
            key={index}
            className="typing-char"
            dangerouslySetInnerHTML={{ __html: element.word }}
          />
        ) : (
          <span key={index} className="typing-char">
            {element.word + " "}
          </span>
        )
      )}
    </div>
  );
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function formatText(text) {
  text = text.replace(/```(.*?)```/gs, (match, p1) => {
    if (p1.trim() === "") return "";

    const lines = p1.trim().split("\n");
    const language = lines[0].trim().toLowerCase();
    const codeLines = lines.slice(1);

    const minIndentation = Math.min(
      ...codeLines
        .filter((line) => line.trim() !== "")
        .map((line) => (line.match(/^\s*/) || [""])[0].length)
    );

    const code = codeLines.map((line) => line.slice(minIndentation)).join("\n");

    return `
      <div style="white-space: pre-wrap; background-color: #1e1e1e; color: white; border-radius: 16px;">
        <div style="background-color: #000; color: white; padding: 5px; border-radius: 16px 16px 0 0;">
          <span style="color: #acacac">${language}</span>
        </div>
        <pre style="padding: 10px;"><code class="language-${language}">${escapeHtml(
      code
    )}</code></pre>
      </div>
    `;
  });

  text = text.replace(
    /`([^`]+)`/g,
    (match, p1) => `<code>${escapeHtml(p1)}</code>`
  );
  text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  text = text.replace(/\*(?!\*|$)/g, "•");
  text = text.replace(/##(.*?)(?=\n|$)/g, "<b>$1</b>");
  text = text.replace(
    /(https:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank">$1</a>'
  );

  return text;
}
