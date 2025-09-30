import { useEffect, useRef, useState } from "react";

export default function EditLinkModal({
  isOpen,
  onClose,
  initialUrl,
  initialText,
  onSave,
}) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const urlInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setTimeout(() => urlInputRef.current?.focus(), 50); // auto focus
    }
  }, [isOpen, initialUrl, initialText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[10000]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[350px]">
        <h2 className="text-lg font-semibold mb-4">Edit Link</h2>

        <label className="block mb-2 text-sm font-medium">URL</label>
        <input
          ref={urlInputRef}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border px-3 py-2 rounded-md mb-4"
        />

        <label className="block mb-2 text-sm font-medium">Link Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border px-3 py-2 rounded-md mb-6"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(url, text)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
