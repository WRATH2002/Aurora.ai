import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Calendar,
  CalendarFold,
  Check,
  ChevronRight,
  Circle,
  CircleCheck,
  CloudDrizzle,
  Cog,
  Ellipsis,
  File,
  FileArchive,
  FileSearch,
  FolderClosed,
  FolderOpen,
  Link2,
  Loader,
  MessageSquare,
  MessageSquareText,
  MoveLeft,
  NotebookPen,
  Paperclip,
  Pause,
  Plus,
  Search,
  Siren,
  SlidersHorizontal,
  SlidersVertical,
  Sparkles,
  Tags,
  Terminal,
  Trash,
  Twitch,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  CalendarLove02Icon,
  CalendarSetting01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Loading03Icon,
  MoreVerticalCircle01Icon,
  MoreVerticalIcon,
  Note04Icon,
  PaintBoardIcon,
  PauseIcon,
  PencilEdit01Icon,
  PlusSignIcon,
  StarIcon,
  StickyNote01Icon,
  StickyNote02Icon,
} from "@hugeicons/core-free-icons";

import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import RoadMapColoumnView, { ShowTaskInfo } from "./RoadMapColoumnView";
import { colorCode } from "../utils/constant";
import { color } from "framer-motion";

const taskInfo = {
  Title: "Developing a Smart Waste Management System",
  CreationTime: "2025-05-24T10:00:00Z",
  DueTime: "2025-06-30T23:59:59Z",
  Progress: "inprogress",
  CreatedBy: "user_001",
  Status: "Active",
  Priority: "High",
  Tags: ["IoT", "Environment", "Automation"],
  Assignees: ["user_002", "user_003"],
  Description:
    "Build a smart waste management system using IoT sensors and cloud analytics to optimize garbage collection routes.",
  Activity: [
    {
      Activity: "Initial project proposal drafted",
      UserID: "user_001",
      Time: "2025-05-24T11:00:00Z",
      Attachment: [
        {
          Link: "https://example.com/proposal.docx",
          DocType: "document",
          Size: "1MB",
        },
      ],
    },
  ],
  MyWork: [
    {
      Activity: "Research on IoT sensor integration",
      UserID: "user_002",
      Time: "2025-05-25T09:30:00Z",
      Attachment: [
        {
          Link: "https://example.com/sensor_research.pdf",
          DocType: "pdf",
          Size: "500KB",
        },
      ],
    },
  ],
  Assigned: [
    {
      Activity: "Design database schema for waste collection data",
      UserID: "user_003",
      Time: "2025-05-26T14:15:00Z",
      Attachment: [
        {
          Link: "https://example.com/db_schema.png",
          DocType: "image",
          Size: "250KB",
        },
      ],
    },
  ],
  Comments: [
    {
      Activity: "Consider including a mobile app interface",
      UserID: "user_004",
      Time: "2025-05-26T16:00:00Z",
      Attachment: [],
    },
  ],
};

const initialColumns = {
  Todo: [
    { id: "1", content: "Item 1" },
    { id: "4", content: "Item 4" },
    { id: "1-new", content: "Item 8" },
  ],
  InProgress: [
    { id: "2", content: "Item 2" },
    { id: "5", content: "Item 5" },
    { id: "2-new", content: "Item 8" },
  ],
  Pause: [
    { id: "3", content: "Item 3" },
    { id: "6", content: "Item 6" },
    { id: "3-new", content: "Item 8" },
  ],
  Done: [
    { id: "9", content: "Item 3" },
    { id: "7", content: "Item 6" },
    { id: "4-new", content: "Item 8" },
  ],
};

function SortableItem({
  item,
  isPlaceholder = false,
  theme,
  showMoreInfoModal,
  setShowMoreInfoModal,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isPlaceholder ? 0.4 : 1,
    borderStyle: isPlaceholder ? "dashed" : "solid",
    borderColor: isPlaceholder ? "#999" : "",
  };

  function getDateFormat(dateStr) {
    let arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      dateStr?.split("/")[0] +
      " " +
      arr[parseInt(dateStr?.split("/")[1]) - 1] +
      ", " +
      dateStr?.split("/")[2]
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isPlaceholder ? { ...attributes, ...listeners } : {})}
      className={
        "draggable text-[black] w-full    flex-col justify-start items-start rounded-[10px]  cursor-grab" +
        (theme ? " text-[white]" : " text-[#000000] bg-[white] ") +
        (theme
          ? ["1-new", "2-new", "3-new", "4-new"].includes(item.id)
            ? " border-[0px] border-[#f1f1f100]"
            : " border-[1.5px] border-[#f1f1f1]"
          : ["1-new", "2-new", "3-new", "4-new"].includes(item.id)
          ? " border-[0px] border-[#f1f1f100]"
          : " border-[1.5px] border-[#f1f1f1]") +
        (["1-new", "2-new", "3-new", "4-new"].includes(item.id)
          ? " flex h-[0px] overflow-hidden p-[0px] my-0"
          : " flex h-auto overflow-visible p-[15px] my-1")
      }
    >
      <div
        className={
          "px-[10px] h-[28px] flex justify-center items-center rounded-lg text-[12px] " +
          (theme
            ? " border-[#303030] bg-[#F7F7F7]"
            : " border-[#f7f7f7] bg-[#F7F7F7]")
        }
      >
        <span className="text-[18px] mr-[5px]">•</span> {item?.Status}
      </div>
      <div className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-[16px] font-[DMSm] mt-[8px]">
        {item?.Title}
      </div>
      <div
        className={
          "w-full text-ellipsis overflow-hidden line-clamp-2 text-[13px] font-[DMSr] mt-[2px] " +
          (theme ? " text-[#000000]" : " text-[#5e5e5e]")
        }
      >
        {item?.Description}
      </div>
      <div className="flex justify-between items-center w-full mt-[8px] ">
        <div
          className={
            "flex justify-start items-center text-[13px]" +
            (theme ? " text-[#000000]" : " text-[#5e5e5e]")
          }
        >
          <HugeiconsIcon
            className=" mr-[8px]"
            icon={CalendarLove02Icon}
            size={18}
            strokeWidth={1.5}
          />
          {getDateFormat(item?.DueTime)}
        </div>
        <div
          className={
            "flex justify-end items-center text-[13px]" +
            (theme ? " text-[#000000]" : " text-[#5e5e5e]")
          }
        >
          {item?.Priority}
        </div>
      </div>
    </div>
  );
}

function Column({
  id,
  items,
  activeItemId,
  theme,
  showMoreInfoModal,
  setShowMoreInfoModal,
  setAddTaskModal,
}) {
  const showPlaceholder = items?.length === 0;

  return (
    <div
      className={
        "w-[330px] h-full flex flex-col justify-start items-start border-[1.5px] rounded-lg py-[10px] px-[4px]" +
        (theme
          ? " border-[#30303000] bg-[#F7F7F700]"
          : " border-[#f7f7f700] bg-[#F7F7F700]") +
        (id != "Todo" ? " ml-[15px]" : " ml-[0px]")
      }
    >
      <div
        className={
          "w-full flex justify-between items-center px-[0px] mb-[5px] " +
          (theme ? " text-[white]" : " text-[#7b798b]")
        }
      >
        <div className="flex justify-start items-center">
          {id == "Todo" ? (
            <HugeiconsIcon
              className=" mr-[8px]"
              icon={StickyNote01Icon}
              size={18}
              strokeWidth={1.8}
            />
          ) : id == "InProgress" ? (
            <HugeiconsIcon
              className=" mr-[8px]"
              icon={Loading03Icon}
              size={18}
              strokeWidth={1.8}
            />
          ) : id == "Pause" ? (
            <HugeiconsIcon
              className=" mr-[8px]"
              icon={PauseIcon}
              size={18}
              strokeWidth={1.8}
            />
          ) : id == "Done" ? (
            <HugeiconsIcon
              className=" mr-[8px]"
              icon={CheckmarkCircle02Icon}
              size={18}
              strokeWidth={1.8}
            />
          ) : (
            <HugeiconsIcon
              className=" mr-[8px]"
              icon={CheckmarkCircle02Icon}
              size={18}
              strokeWidth={1.8}
            />
          )}
          {id}
        </div>
        <div className="flex justify-end items-center">
          <HugeiconsIcon
            className=" mr-[8px]"
            icon={PlusSignIcon}
            size={18}
            strokeWidth={1.8}
            onClick={() => {
              setAddTaskModal([{ forTaskProgress: id }]);
            }}
          />
          <HugeiconsIcon
            className=""
            icon={MoreVerticalCircle01Icon}
            fill="black"
            size={16}
            strokeWidth={1.8}
          />
        </div>
      </div>
      {/* <h3>{id.toUpperCase()}</h3> */}
      <SortableContext
        items={items?.length ? items.map((item) => item.id) : ["placeholder"]}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            isPlaceholder={item.id === activeItemId}
            theme={theme}
            showMoreInfoModal={showMoreInfoModal}
            setShowMoreInfoModal={setShowMoreInfoModal}
          />
        ))}
        {items?.length == 1 && (
          <div className="w-full h-[40px] border border-dashed border-gray-400 flex justify-center items-center text-gray-500">
            Drop here
          </div>
        )}
      </SortableContext>
    </div>
  );
}

export default function RoadMapContainer(props) {
  const [theme, setTheme] = useState(props?.theme);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [section, setSection] = useState("All");
  const [activeItemId, setActiveItemId] = useState(null);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showTaskData, setShowTaskData] = useState([]);
  const [addTaskModal, setAddTaskModal] = useState([]);
  const [taskInfoArr, setTaskInfoArr] = useState([]);

  const navigate = useNavigate();

  function navigateToWelcomePgae() {
    navigate(`/user/login`);
  }

  useEffect(() => {
    function ActiveApiKey() {
      // const user = firebase.auth().currentUser;
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          const channelRef = db.collection("user").doc(user?.uid);

          const taskRef = db
            .collection("taskSpace")
            .doc(user?.uid)
            ?.collection("taskInfo")
            .doc("taskInfo");

          onSnapshot(channelRef, (snapshot) => {
            setTheme(snapshot?.data()?.Theme);
          });
          onSnapshot(taskRef, (snapshot) => {
            setTaskInfoArr([
              snapshot?.data()?.Todo,
              snapshot?.data()?.InProgress,
              snapshot?.data()?.Pause,
              snapshot?.data()?.Done,
            ]);
          });
        } else {
          console.log("Not Logged in");
          navigateToWelcomePgae();
        }
      });
    }
    ActiveApiKey();
  }, []);

  const [columns, setColumns] = useState(initialColumns);
  const [activeItem, setActiveItem] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    if (taskInfoArr != undefined) {
      let tempData = convertToObjectOfTaskType(taskInfoArr);
      setColumns(tempData);
    }
  }, [taskInfoArr]);

  const findItemColumn = (id) => {
    return Object.keys(columns).find((columnId) =>
      columns[columnId].some((item) => item.id === id)
    );
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const column = findItemColumn(active.id);
    setActiveItem(columns[column].find((i) => i.id === active.id));
    setActiveItemId(active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const overColumn = findItemColumn(over.id);
    const activeCol = findItemColumn(active.id);

    if (activeCol !== overColumn) {
      const activeItemData = columns[activeCol].find(
        (item) => item.id === active.id
      );

      setColumns((prev) => {
        const activeItems = prev[activeCol].filter(
          (item) => item.id !== active.id
        );
        const overItems = [...prev[overColumn], activeItemData];

        return {
          ...prev,
          [activeCol]: activeItems,
          [overColumn]: overItems,
        };
      });
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      handleDragCancel();
      return;
    }

    const oldColumn = findItemColumn(active.id);
    const newColumn = findItemColumn(over.id);

    if (!oldColumn || !newColumn) return;

    if (oldColumn === newColumn) {
      const oldIndex = columns[oldColumn].findIndex(
        (item) => item.id === active.id
      );
      const newIndex = columns[newColumn].findIndex(
        (item) => item.id === over.id
      );

      if (oldIndex !== newIndex) {
        setColumns((prev) => ({
          ...prev,
          [newColumn]: arrayMove(prev[newColumn], oldIndex, newIndex),
        }));
      }
    } else {
      const movingItem = columns[oldColumn].find(
        (item) => item.id === active.id
      );
      setColumns((prev) => ({
        ...prev,
        [oldColumn]: prev[oldColumn].filter((item) => item.id !== active.id),
        [newColumn]: [
          ...prev[newColumn].slice(
            0,
            columns[newColumn].findIndex((item) => item.id === over.id)
          ),
          movingItem,
          ...prev[newColumn].slice(
            columns[newColumn].findIndex((item) => item.id === over.id)
          ),
        ],
      }));
    }

    setActiveItem(null);
    setActiveItemId(null);
  };

  const handleDragCancel = () => {
    setActiveItem(null);
    setActiveItemId(null);
  };

  function convertToObjectOfTaskType(inputTaskArr) {
    let idFlag = 1;
    let tempArr = ["Todo", "InProgress", "Pause", "Done"];
    let newIdArr = ["1-new", "2-new", "3-new", "4-new"];
    let outputObject = {
      Todo: [],
      InProgress: [],
      Pause: [],
      Done: [],
    };

    inputTaskArr?.map((data, index) => {
      data?.map((item, itemIndex) => {
        outputObject[tempArr[index]].push({
          ...item,
          id: idFlag,
        });
        idFlag += 1;
      });
    });

    tempArr.map((data, index) => {
      outputObject[data].push({
        content: "None",
        id: newIdArr[index],
      });
      idFlag += 1;
    });

    console.log(outputObject);

    console.log(taskInfoArr);

    return outputObject;
  }

  function getDateFormat(dateStr) {
    let arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      dateStr?.split("/")[0] +
      " " +
      arr[parseInt(dateStr?.split("/")[1]) - 1] +
      ", " +
      dateStr?.split("/")[2]
    );
  }

  return (
    <>
      {/* <ShowTaskInfo theme={theme} taskInfo={taskInfo} /> */}
      {showMoreInfoModal && (
        <ShowTaskInfo
          theme={theme}
          // taskInfo={taskInfo}
          setShowMoreInfoModal={setShowMoreInfoModal}
          showMoreInfoModal={showMoreInfoModal}
          showTaskData={showTaskData}
          setShowTaskData={setShowTaskData}
        />
      )}
      {addTaskModal?.length > 0 && (
        <CreateNewTaskModal
          theme={theme}
          setAddTaskModal={setAddTaskModal}
          addTaskModal={addTaskModal}
        />
      )}
      <div
        className={
          "w-[calc(100%-50px)] h-[100svh] flex flex-col justify-start items-start py-[8px] text-[white] text-[14px]" +
          (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
        }
      >
        {/* <div className="w-full h-[40px]"></div> */}
        <div
          className={
            "w-full h-full rounded-xl flex flex-col justify-start items-start overflow-hidden" +
            (theme ? " bg-[#1a1a1a]" : " bg-[#ffffff]")
          }
        >
          <div
            className={
              "w-full h-[86px] border-b-[1.5px] flex flex-col justify-start items-start p-[8px] pb-[0px]" +
              (theme
                ? " bg-[#222222] border-[#303030]"
                : " bg-[#ffffff] border-[#f7f7f7]")
            }
          >
            <div className="w-full flex justify-between items-center px-[10px]">
              <div className="w-[calc((100%-450px)/2)] flex justify-start items-center h-full">
                {/* <button className="flex justify-center items-center">
                  <SlidersVertical
                    width={16}
                    height={16}
                    strokeWidth={2}
                    className="mr-[8px]"
                  />{" "}
                  Layout
                </button> */}
              </div>
              <div className="w-[450px] flex justify-center items-center">
                <button className="w-[35px] flex justify-center items-center mr-[-35px] z-10 text-[#808080] hover:text-[#ffffff] cursor-pointer">
                  <Search width={16} height={16} strokeWidth={2} className="" />
                </button>
                <input
                  className={
                    "outline-none rounded-[10px] h-[33px] w-[450px] border-[1.5px] px-[35px]" +
                    (theme
                      ? " bg-[#292929] border-[#323232] placeholder:text-[#5b5b5b]"
                      : " bg-[#292929] border-[#303030]")
                  }
                  placeholder="Search for anything"
                  value={searchPrompt}
                  onInput={(e) => {
                    setSearchPrompt(e.target.value);
                    // e.target.style.height = "auto"; // Reset the height to auto to recalculate
                    // e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
                  }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter" && !e.shiftKey) {
                  //     e.preventDefault(); // Prevent new line
                  //     if (message?.trim().length > 0) {
                  //       addUserMessage(message);
                  //       setLoading(true);
                  //       e.target.style.height = "auto";
                  //     }
                  //   }
                  // }}
                ></input>
                <button
                  className={
                    "w-[35px] justify-center items-center ml-[-35px] z-10 text-[#808080] hover:text-[#ffffff] cursor-pointer" +
                    (searchPrompt?.length > 0 ? " flex" : " hidden")
                  }
                  onClick={() => {
                    setSearchPrompt("");
                    // setShowModels(false);
                  }}
                >
                  <X width={16} height={16} strokeWidth={2} className="" />
                </button>
              </div>
              <div className="w-[calc((100%-450px)/2)] flex justify-end items-center h-full">
                <button
                  className={
                    "flex justify-center items-center border-[1.5px] rounded-lg h-[30px] px-[10px]" +
                    (theme
                      ? " text-[#828282] hover:text-[white]  border-[#3c3c3c] hover:bg-[#3c3c3c] hover:border-[#4a4a4a]"
                      : " text-[#797979] hover:text-[black]  border-[#303030]")
                  }
                  onClick={() => {
                    convertToObjectOfTaskType(taskInfoArr);
                    // setShowModels(false);
                  }}
                >
                  <SlidersVertical
                    width={16}
                    height={16}
                    strokeWidth={2}
                    className="mr-[8px]"
                  />{" "}
                  Layout
                </button>
              </div>
            </div>
            <div className="w-full flex justify-between items-end mt-[10px] h-[35px] mb-[-1.5px] px-[14px]">
              <div className="flex justify-start ">
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer" +
                    (theme
                      ? section == "All"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "All"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("All");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    All
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "All"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "All"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Ongoing"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Ongoing"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Ongoing");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Ongoing
                    <div
                      className={
                        "border-[1.5px] rounded-md flex justify-center items-center px-[4px] h-[17px] text-[9px] font-[geistMedium] ml-[5px]" +
                        (theme ? " border-[#3d3d3d]" : " border-[#eeeeee]")
                      }
                    >
                      32
                    </div>
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Ongoing"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Ongoing"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Notes"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Notes"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Notes");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Notes
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Notes"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Notes"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Due"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Due"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Due");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Due{" "}
                    <div
                      className={
                        "border-[1.5px] rounded-md flex justify-center items-center px-[4px] h-[17px] text-[9px] font-[geistMedium] ml-[5px]" +
                        (theme ? " border-[#3d3d3d]" : " border-[#eeeeee]")
                      }
                    >
                      9
                    </div>
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Due"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Due"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Rent"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Rent"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Rent");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Rent
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Rent"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Rent"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
              </div>
              <div className="flex justify-end h-full"></div>
            </div>
          </div>
          <div className="w-full h-[calc(100%-86px)]  p-[15px] flex justify-start items-start">
            {/* <DndContext
              collisionDetection={closestCenter}
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              {Object.entries(columns).map(([colId, items]) => (
                <Column
                  key={colId}
                  id={colId}
                  items={items}
                  theme={theme}
                  showMoreInfoModal={showMoreInfoModal}
                  setShowMoreInfoModal={setShowMoreInfoModal}
                  setAddTaskModal={setAddTaskModal}
                />
              ))}

              <DragOverlay>
                {activeItem && (
                  <div
                    className={
                      "draggable text-[black] w-full h-auto my-1 flex flex-col justify-start items-start p-[15px] rounded-[10px] border-[1.5px] cursor-grab" +
                      (theme
                        ? " text-[white]"
                        : " text-[#000000] bg-[white] border-[#f1f1f1]")
                    }
                  >
                    <div
                      className={
                        "px-[10px] h-[28px] flex justify-center items-center rounded-lg text-[12px] " +
                        (theme
                          ? " border-[#303030] bg-[#F7F7F7]"
                          : " border-[#f7f7f7] bg-[#F7F7F7]")
                      }
                    >
                      <span className="text-[18px] mr-[5px]">•</span>{" "}
                      {activeItem?.Status}
                    </div>
                    <div className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-[16px] font-[DMSm] mt-[8px]">
                      {activeItem?.Title}
                    </div>
                    <div
                      className={
                        "w-full text-ellipsis overflow-hidden line-clamp-2 text-[13px] font-[DMSr] mt-[2px] " +
                        (theme ? " text-[#000000]" : " text-[#5e5e5e]")
                      }
                    >
                      {activeItem?.Description}
                    </div>
                    <div className="flex justify-between items-center w-full mt-[8px] ">
                      <div
                        className={
                          "flex justify-start items-center text-[13px]" +
                          (theme ? " text-[#000000]" : " text-[#5e5e5e]")
                        }
                      >
                        <HugeiconsIcon
                          className=" mr-[8px]"
                          icon={CalendarLove02Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        {getDateFormat(activeItem?.DueTime)}
                      </div>
                      <div
                        className={
                          "flex justify-end items-center text-[13px]" +
                          (theme ? " text-[#000000]" : " text-[#5e5e5e]")
                        }
                      >
                        {activeItem?.Priority}
                      </div>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext> */}
            {Object?.entries(columns)?.map(([colID, data]) => {
              return (
                <RoadMapColoumnView
                  theme={theme}
                  colData={data}
                  index={colID}
                  id={colID}
                  setAddTaskModal={setAddTaskModal}
                  addTaskModal={addTaskModal}
                  setShowMoreInfoModal={setShowMoreInfoModal}
                  showMoreInfoModal={showMoreInfoModal}
                  showTaskData={showTaskData}
                  setShowTaskData={setShowTaskData}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function CreateNewTaskModal(props) {
  const [tags, setTags] = useState([]);
  const [tagsName, setTagsName] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [assigneesUserID, setAssigneesUserID] = useState("");
  const [progress, setProgress] = useState(
    props?.addTaskModal[0]?.forTaskProgress
  );
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeInputField, setActiveInputField] = useState("taskTitle");
  const [colorTheme, setColorTheme] = useState(0);

  function checkIfReadyToCreateTask() {
    return (
      tags?.length > 0 &&
      progress?.length > 0 &&
      status?.length > 0 &&
      priority?.length > 0 &&
      dueDate?.length > 0 &&
      title?.length > 0 &&
      description?.length > 0
    );
  }

  function getCurrentDateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    let time = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    let date =
      now.getDate() +
      "/" +
      parseInt(parseInt(now.getMonth()) + 1) +
      "/" +
      now.getFullYear();

    return { Time: time, Date: date };
  }

  function addTaskToFirebaseDatbase() {
    const user = firebase.auth().currentUser;
    let tempDateTime = getCurrentDateTime();

    db.collection("taskSpace")
      .doc(user?.uid)
      .collection("taskSpace")
      .doc(title)
      .set({
        Title: title,
        CreationTime: tempDateTime?.Time,
        CreationDate: tempDateTime?.Date,
        DueTime: dueDate,
        Progress: progress,
        CreatedBy: user?.uid,
        Status: status,
        Priority: priority,
        Tags: tags,
        Assignees: assignees,
        Description: description,
        Activity: [],
        MyWork: [],
        Assigned: [],
        Comments: [],
        ColorThemePrimary: colorCode[colorTheme].primary,
        ColorThemeSecondary: colorCode[colorTheme].secondary,
      });

    let tempObj = {
      Title: title,
      CreationTime: tempDateTime?.Time,
      CreationDate: tempDateTime?.Date,
      DueTime: dueDate,
      Progress: progress,
      CreatedBy: user?.uid,
      Status: status,
      Priority: priority,
      Tags: tags,
      Assignees: assignees,
      Description: description,
      ColorThemePrimary: colorCode[colorTheme].primary,
      ColorThemeSecondary: colorCode[colorTheme].secondary,
      // Activity: [],
      // MyWork: [],
      // Assigned: [],
      // Comments: [],
    };

    db.collection("taskSpace")
      .doc(user?.uid)
      .collection("taskInfo")
      .doc("taskInfo")
      .update({ [progress]: arrayUnion(tempObj), AllTasks: arrayUnion(title) });

    props?.setAddTaskModal([]);

    console.log("function called");
  }

  return (
    <>
      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center backdrop-blur-[5px] z-50" +
          (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
        }
        onClick={() => {
          props?.setAddTaskModal([]);
        }}
      >
        <div
          className={
            "w-[450px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
            (props?.theme
              ? " bg-[#1A1A1A] border-[#252525]"
              : " bg-[#ffffff] border-[#eaeaea]")
          }
          style={{ transition: ".3s" }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span
            className={
              "text-[22px] font-[geistMedium] w-full flex justify-between items-center" +
              (props?.theme ? " text-[white]" : " text-[black]")
            }
          >
            Create Task in {props?.addTaskModal[0]?.forTaskProgress}
            <X
              width={18}
              height={18}
              strokeWidth={2.2}
              className={
                "cursor-pointer " +
                (props?.theme
                  ? " text-[#828282] hover:text-[white]"
                  : " text-[#828282] hover:text-[black]")
              }
              onClick={(e) => {
                props?.setAddTaskModal([]);
              }}
            />
          </span>

          <div className="w-full flex justify-between items-center mt-[20px]">
            <div className="flex justify-start items-center">
              {colorCode?.map((data, index) => {
                return (
                  <div
                    className="rounded-full flex justify-center items-center p-[2px] mr-[3px] "
                    style={{
                      border:
                        index == colorTheme
                          ? `2px solid ${data?.primary}`
                          : `2px solid transparent`,
                    }}
                    onClick={() => {
                      setColorTheme(index);
                    }}
                  >
                    <div
                      key={index}
                      className={`min-w-[18px] min-h-[18px] rounded-full  cursor-pointer `}
                      style={{ backgroundColor: `${data?.primary}` }}
                    ></div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end items-center">
              <HugeiconsIcon
                className="mr-[10px] text-[#c4c4c4]"
                icon={PaintBoardIcon}
                height={18}
                width={18}
                strokeWidth={1.8}
              />
              <div
                className={`min-w-[18px] min-h-[18px] rounded-full  cursor-pointer `}
                style={{ backgroundColor: `${colorCode[colorTheme]?.primary}` }}
              ></div>
            </div>
          </div>

          <InputFieldUI
            theme={props?.theme}
            inputTitle={"Task title"}
            var={title}
            setVar={setTitle}
            activeInputField={activeInputField}
            setActiveInputField={setActiveInputField}
            fieldValue={"taskTitle"}
            placeholderText={"eg. Design Home Page Wireframe"}
            marginTop={"30px"}
            isEditable={true}
            isAutoFocus={true}
            addButton={false}
            isRequired={true}
          />
          <TextAreaFieldUI
            theme={props?.theme}
            inputTitle={"Task description"}
            var={description}
            setVar={setDescription}
            activeInputField={activeInputField}
            setActiveInputField={setActiveInputField}
            fieldValue={"taskDescription"}
            placeholderText={
              "eg. Describe about the task, what needs to be done, what it is about etc."
            }
            marginTop={"20px"}
          />
          <div className="w-full flex justify-between items-center mt-[20px]">
            <div className="w-[calc((100%-20px)/2)] flex justify-start items-center">
              <InputFieldUI
                theme={props?.theme}
                inputTitle={"Task progress"}
                var={progress}
                setVar={setProgress}
                activeInputField={activeInputField}
                setActiveInputField={setActiveInputField}
                fieldValue={"taskProgress"}
                placeholderText={""}
                marginTop={"0px"}
                isEditable={false}
                isAutoFocus={false}
                addButton={false}
                isRequired={true}
                addTaskModal={props?.addTaskModal}
                setAddTaskModal={props?.setAddTaskModal}
              />
            </div>
            <div className="w-[calc((100%-20px)/2)] flex justify-start items-center">
              <InputFieldUI
                theme={props?.theme}
                inputTitle={"Task status"}
                var={status}
                setVar={setStatus}
                activeInputField={activeInputField}
                setActiveInputField={setActiveInputField}
                fieldValue={"taskStatus"}
                placeholderText={"eg. In Research ..."}
                marginTop={"0px"}
                isEditable={true}
                isAutoFocus={false}
                addButton={false}
                isRequired={true}
              />
            </div>
          </div>
          <div className="w-full flex justify-between items-center mt-[20px]">
            <div className="w-[calc((100%-20px)/2)] flex justify-start items-center">
              <InputFieldUI
                theme={props?.theme}
                inputTitle={"Task priority"}
                var={priority}
                setVar={setPriority}
                activeInputField={activeInputField}
                setActiveInputField={setActiveInputField}
                fieldValue={"taskPriority"}
                placeholderText={""}
                marginTop={"0px"}
                isEditable={true}
                isAutoFocus={false}
                addButton={false}
                isRequired={true}
                addTaskModal={props?.addTaskModal}
                setAddTaskModal={props?.setAddTaskModal}
              />
            </div>
            <div className="w-[calc((100%-20px)/2)] flex justify-start items-center">
              <InputFieldUI
                theme={props?.theme}
                inputTitle={"Due date"}
                var={dueDate}
                setVar={setDueDate}
                activeInputField={activeInputField}
                setActiveInputField={setActiveInputField}
                fieldValue={"taskDueDate"}
                placeholderText={"eg. Enter due date"}
                marginTop={"0px"}
                isEditable={true}
                isAutoFocus={false}
                addButton={false}
                isRequired={true}
              />
            </div>
          </div>
          <InputFieldUI
            theme={props?.theme}
            inputTitle={"Task tags"}
            var={tagsName}
            setVar={setTagsName}
            activeInputField={activeInputField}
            setActiveInputField={setActiveInputField}
            fieldValue={"taskTags"}
            placeholderText={"eg. Enter task tags - UI, Design, etc."}
            marginTop={"20px"}
            isEditable={true}
            isAutoFocus={true}
            addButton={true}
            buttonFunction={setTags}
            buttonData={tags}
            isRequired={true}
          />
          <div className="w-[calc(100%+10px)] mt-[10px] ml-[-10px] flex justify-start items-start flex-wrap ">
            {tags?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "px-[9px] h-[28px] rounded-full flex justify-center items-center border-[1.5px] border-[#f1f1f1] bg-[#F7F7F7] text-[12px] mt-[10px]" +
                    (index > 0 ? " ml-[10px]" : " ml-[10px]")
                  }
                >
                  {data.charAt(0).toUpperCase() + data.substr(1)}
                  <HugeiconsIcon
                    className=" ml-[6px] text-[#7d7d7d] hover:text-[black] cursor-pointer"
                    icon={Cancel01Icon}
                    size={10}
                    strokeWidth={2.8}
                    onClick={(e) => {
                      setTags(tags?.filter((elem) => elem != data));
                    }}
                  />
                </div>
              );
            })}
          </div>
          <InputFieldUI
            theme={props?.theme}
            inputTitle={"Task Assignees"}
            var={assigneesUserID}
            setVar={setAssigneesUserID}
            activeInputField={activeInputField}
            setActiveInputField={setActiveInputField}
            fieldValue={"taskAssignees"}
            placeholderText={"eg. Enter task assignees userID's"}
            marginTop={"20px"}
            isEditable={true}
            isAutoFocus={true}
            addButton={true}
            buttonFunction={setAssignees}
            buttonData={assignees}
            isRequired={false}
          />
          <div className="group flex w-full justify-start items-center mt-[20px] max-h-[35px] flex-col">
            <div
              className={
                " w-auto px-[10px]  rounded-[10px] min-h-[35px] flex justify-center items-center " +
                (props?.theme
                  ? checkIfReadyToCreateTask()
                    ? " bg-[white] hover:bg-[#eaeaea] text-[#000000] cursor-pointer"
                    : " bg-[white] text-[#000000] cursor-not-allowed opacity-25"
                  : checkIfReadyToCreateTask()
                  ? " bg-[black] hover:bg-[#292929] text-[#ffffff] cursor-pointer"
                  : " bg-[black] text-[#ffffff] cursor-not-allowed opacity-25")
              }
              onClick={(e) => {
                if (checkIfReadyToCreateTask()) {
                  addTaskToFirebaseDatbase();
                }
              }}
            >
              <HugeiconsIcon
                icon={StickyNote02Icon}
                size={18}
                strokeWidth={1.8}
                className="mr-[8px]"
              />
              Add Task
            </div>
            <div
              className={
                "mt-[5px] whitespace-nowrap   justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                (props?.theme
                  ? " bg-[#363636] text-[#d7d7d7]"
                  : " bg-[black] text-[#ffffff]") +
                (checkIfReadyToCreateTask()
                  ? " hidden group-hover:hidden"
                  : " hidden group-hover:flex")
              }
              style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)", zIndex: 1000 }}
            >
              Fill all the fields
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function InputFieldUI(props) {
  const [priorityArr, setPriorityArr] = useState(["High", "Medium", "Low"]);
  const [priorityFlag, setPriorityFlag] = useState(false);
  const [progressArr, setProgressArr] = useState([
    "Todo",
    "InProgress",
    "Pause",
    "Done",
  ]);
  const [progressFlag, setProgressFlag] = useState(false);

  return (
    <>
      <div
        className={" flex flex-col justify-start items-start w-full"}
        style={{ marginTop: `${props?.marginTop}` }}
      >
        <label
          className={
            "text-[12px] h-[2px] flex justify-center items-center px-[6px] mb-[-1.5px] ml-[10px] z-50 " +
            (props?.theme
              ? props?.activeInputField === props?.fieldValue
                ? " text-[#a3a3a3] bg-[#1A1A1A]"
                : " text-[#828282] bg-[#1A1A1A]"
              : props?.activeInputField === props?.fieldValue
              ? " text-[#565656] bg-[#ffffff]"
              : " text-[#999999] bg-[#ffffff]")
          }
          style={{ transition: ".1s" }}
        >
          {props?.inputTitle}{" "}
          <span
            className={" ml-[4px]" + (props?.isRequired ? " flex" : " hidden")}
          >
            *
          </span>
        </label>
        <div className="w-full flex flex-col justify-start items-end max-h-[40px] overflow-visible">
          <input
            className={
              "w-[calc(100%-0px)] px-[15px] bg-transparent min-h-[40px] outline-none rounded-[10px] border-[1.5px] text-[14px] mt-[0px]" +
              (props?.theme
                ? props?.activeInputField === props?.fieldValue
                  ? " text-[white] placeholder:text-[#5b5b5b] border-[#636363]"
                  : " text-[white] placeholder:text-[#5b5b5b] border-[#2c2c2c]"
                : props?.activeInputField === props?.fieldValue
                ? " text-[black] placeholder:text-[#828282] border-[#cdcdcd] "
                : " text-[black] placeholder:text-[#828282] border-[#ececec] ")
            }
            style={{ transition: ".1s" }}
            autoFocus={props?.isAutoFocus}
            readOnly={!props?.isEditable}
            onFocus={(e) => {
              props?.setActiveInputField(props?.fieldValue);
            }}
            onBlur={(e) => {
              props?.setActiveInputField("");
            }}
            value={props?.var}
            onKeyDown={(e) => {
              if (props?.inputTitle == "Task tags" && e.key == "Enter") {
                if (!props?.buttonData.includes(props?.var.toLowerCase())) {
                  props?.buttonFunction((prev) => [
                    ...prev,
                    props?.var.toLowerCase(),
                  ]);
                  props?.setVar("");
                }
              }
            }}
            onChange={(e) => {
              if (props?.inputTitle == "Due date") {
                props?.setVar(e.target.value);
              } else {
                if (
                  !e.target.value.includes(".") &
                  !e.target.value.includes("/") &
                  !e.target.value.includes("%")
                ) {
                  if (
                    props?.inputTitle == "Task tags" ||
                    props?.inputTitle == "Task assignees"
                  ) {
                    if (!e.target.value.includes(" ")) {
                      props?.setVar(e.target.value);
                    }
                  } else {
                    props?.setVar(e.target.value);
                  }
                }
              }
            }}
            placeholder={props?.placeholderText}
          ></input>
          <div
            className={
              "w-[30px] min-h-[40px] justify-center items-center mt-[-40px] cursor-pointer" +
              (props?.inputTitle == "Task progress"
                ? progressFlag
                  ? " rotate-180"
                  : " rotate-0"
                : props?.inputTitle == "Task priority"
                ? priorityFlag
                  ? " rotate-180"
                  : " rotate-0"
                : " ") +
              (props?.inputTitle == "Task progress" ||
              props?.inputTitle == "Task priority"
                ? " flex"
                : " hidden")
            }
            style={{ transition: ".2s" }}
            onClick={(e) => {
              if (props?.inputTitle == "Task progress") {
                setPriorityFlag((prev) => false);
                setProgressFlag(!progressFlag);
              } else {
                setProgressFlag((prev) => false);
                setPriorityFlag(!priorityFlag);
              }
            }}
          >
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={18}
              strokeWidth={1.8}
              className=""
            />
          </div>
          <div
            className={
              "w-auto overflow-hidden  flex-col justify-start items-start rounded-[10px] bg-[white] border-[1.5px]  z-[60] text-[14px] mt-[10px]" +
              (props?.theme ? " border-[#2c2c2c]" : " border-[#ececec]") +
              (props?.inputTitle == "Task progress"
                ? progressFlag
                  ? " flex min-h-[120px] opacity-100"
                  : " flex min-h-[0px] opacity-0"
                : props?.inputTitle == "Task priority"
                ? priorityFlag
                  ? " flex min-h-[95px] opacity-100"
                  : " flex min-h-[0px] opacity-0"
                : " hidden")
            }
            style={{ transition: ".2s" }}
          >
            {props?.inputTitle == "Task progress" ? (
              <>
                {progressArr?.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        "min-h-[25px] flex justify-start items-center px-[13px] cursor-pointer " +
                        (index > 0 ? " mt-[0px]" : " mt-[10px]")
                      }
                      onClick={(e) => {
                        props?.setAddTaskModal([{ forTaskProgress: data }]);
                        props?.setVar(data);
                        setProgressFlag(false);
                      }}
                    >
                      {data == "Todo" ? (
                        <HugeiconsIcon
                          className=" mr-[8px]"
                          icon={StickyNote01Icon}
                          size={16}
                          strokeWidth={1.8}
                        />
                      ) : data == "InProgress" ? (
                        <HugeiconsIcon
                          className=" mr-[8px]"
                          icon={Loading03Icon}
                          size={16}
                          strokeWidth={1.8}
                        />
                      ) : data == "Pause" ? (
                        <HugeiconsIcon
                          className=" mr-[8px]"
                          icon={PauseIcon}
                          size={16}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <HugeiconsIcon
                          className=" mr-[8px]"
                          icon={CheckmarkCircle02Icon}
                          size={16}
                          strokeWidth={1.8}
                        />
                      )}
                      {data}
                    </div>
                  );
                })}
              </>
            ) : (
              <>
                {priorityArr?.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        "min-h-[25px] flex justify-start items-center px-[13px] cursor-pointer " +
                        (index > 0 ? " mt-[0px]" : " mt-[10px]")
                      }
                      onClick={(e) => {
                        // props?.setAddTaskModal([{ forTaskProgress: data }]);
                        props?.setVar(data);
                        setPriorityFlag(false);
                      }}
                    >
                      {data}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div
          className={
            "h-[0px] overflow-visible w-full justify-end items-center mt-[-20px] mb-[20px] px-[7px]" +
            (props?.addButton ? " flex" : " hidden")
          }
        >
          <div
            className="z-[290] h-[26px] rounded-lg px-[10px] flex justify-center items-center bg-black text-[white] text-[12px] cursor-pointer"
            onClick={(e) => {
              if (props?.inputTitle == "Task progress") {
                if (!props?.buttonData.includes(props?.var.toLowerCase())) {
                  props?.buttonFunction((prev) => [
                    ...prev,
                    props?.var.toLowerCase(),
                  ]);
                  props?.setVar("");
                }
              } else {
                props?.buttonFunction((prev) => [...prev, props?.var]);
              }
            }}
          >
            Add
          </div>
        </div>
      </div>
    </>
  );
}

export function TextAreaFieldUI(props) {
  return (
    <>
      <div
        className={" flex flex-col justify-start items-start w-full"}
        style={{ marginTop: `${props?.marginTop}` }}
      >
        <label
          className={
            "text-[12px] h-[2px]  justify-center items-center px-[6px] mb-[-1.5px] ml-[10px] z-50 " +
            (props?.theme
              ? props?.activeInputField === props?.fieldValue
                ? " text-[#a3a3a3] bg-[#1A1A1A]"
                : " text-[#828282] bg-[#1A1A1A]"
              : props?.activeInputField === props?.fieldValue
              ? " text-[#565656] bg-[#ffffff]"
              : " text-[#999999] bg-[#ffffff]") +
            (props?.noHeading ? " hidden" : " flex")
          }
          style={{ transition: ".1s" }}
        >
          {props?.inputTitle}
          <span className={" ml-[4px]" + (true ? " flex" : " hidden")}>*</span>
        </label>
        <div
          className={
            "w-[calc(100%-0px)] bg-transparent  outline-none rounded-[10px] border-[1.5px] text-[14px] mt-[0px] pt-[5px]" +
            (props?.theme
              ? props?.activeInputField === props?.fieldValue
                ? " text-[white] border-[#636363]"
                : " text-[white] border-[#2c2c2c]"
              : props?.activeInputField === props?.fieldValue
              ? " text-[black] border-[#cdcdcd] "
              : " text-[black] border-[#ececec] ")
          }
          style={{
            transition: "border .1s",
            background: props?.noHeading ? `${props?.bgColor}` : `transparent`,
          }}
        >
          <textarea
            className={
              "w-[calc(100%-0px)] px-[15px] bg-transparent pt-[4px] outline-none rounded-[10px] text-[14px] mt-[0px] h-[100px] resize-none" +
              (props?.theme
                ? " placeholder:text-[#5b5b5b] chatScrollDark"
                : " placeholder:text-[#828282] chatScrollLight")
            }
            spellcheck="false"
            onFocus={(e) => {
              props?.setActiveInputField(props?.fieldValue);
            }}
            onBlur={(e) => {
              props?.setActiveInputField("");
            }}
            value={props?.title}
            onChange={(e) => {
              props?.setVar(e.target.value);
            }}
            placeholder={props?.placeholderText}
          ></textarea>
        </div>
      </div>
    </>
  );
}
