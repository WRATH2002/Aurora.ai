import React, { useEffect } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { db } from "../../firebase";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { Eye, EyeOff } from "lucide-react";
import { arrayUnion, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toolbarItems } from "../../utils/constant";
import { processStringEncrypt } from "../../utils/functions";
import { formatDate } from "../../utils/functionsConstant";
import logo from "../../assets/img/brandLogo.svg";
import ClickSpark from "../Animations/ClickSpark";
import { LoaderForSignUp } from "../Loader";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameField, setNameField] = useState(false);
  const [emailField, setEmailField] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [errorInfo, setErrorInfo] = useState({
    Name: false,
    email: false,
    password: false,
    errorDetails: "",
  });
  const [loading, setLoading] = useState({
    state: false,
    statusInitial: "Validating credentials ...",
    error: false,
    statusError: "Oops, Account already exists !",
    success: false,
    statusSuccess: "Account created successfully ! Redirecting ...",
  });

  const provider = new GoogleAuthProvider();

  function formattedName() {
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(" ");
  }

  // Function to get a proper formatted date with time ---------------------------

  function formatDateTime(dateTimeStr) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const suffixes = ["st", "nd", "rd", "th"];

    const dateObj = new Date(dateTimeStr);
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    const hour = dateObj.getHours() % 12 || 12;
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const period = dateObj.getHours() >= 12 ? "PM" : "AM";

    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      return suffixes[(day % 10) - 1] || "th";
    };

    return {
      Date: `${day}${getDaySuffix(day)} ${month}, ${year}`,
      Time: `${hour}:${minutes} ${period}`,
    };
  }

  // Function to create user space in Firebase -----------------------------------

  function createUserCollection(user) {
    let tempCreationTime = formatDateTime(new Date().toLocaleString());

    // UserSpace ----------->
    db.collection("user")
      .doc(user.uid)
      .set({
        // User Details Object --------------------------->
        UserDetails: {
          Name: formattedName(),
          Email: email,
          Password: password,
          UserID: user.uid,
          PhotoURL: "default",
          Username: "notCreated",
          CreationTime: tempCreationTime,
          // Timestamp: serverTimestamp(),
        },

        // Default Editor Settings ----------------------->
        DefaultToolbar: toolbarItems,
        EditedToolbar: toolbarItems,
        notInToolbar: [],

        // Default Account Settings ---------------------->
        Theme: false, // False -> Light || True -> Dark
        AccentColor: "#EAEBF4",
        AppDefaultFont: "geistRegular", // Geist Regular
        AppCurrentFont: "geistRegular", // Geist Regular
        EditorDefaultFont: "rr", // Roboto Mono
        EditorCurrentFont: "rr", // Roboto Mono
      });

    // User API Space ------>
    db.collection("user")
      .doc(user.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .set({
        StoreAPILocally: false,
        ScopedAPIUsage: false,
        ScopedUserID: user.uid,
        ActiveAPIKey: processStringEncrypt(
          "AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U"
        ),
        AllAPIKeys: [
          {
            APIKeyID: processStringEncrypt(
              "AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U"
            ),
            CreationTime: "By Default",
            Status: "",
          },
        ],
        DeletedAPIKeys: [],
      });

    db.collection("user")
      .doc(user.uid)
      .collection("APIKeys")
      .doc(
        "APIKey_" +
          processStringEncrypt("AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U")
      )
      .set({
        CurrentDate:
          new Date().getDate() +
          "/" +
          parseInt(new Date().getMonth() + 1) +
          "/" +
          new Date().getFullYear(),
        TotalTokens: 10000000,
        CurrentUsage: 0,
        RequestInADay: [],
      });

    // User Note Space ----->
    db.collection("user")
      .doc(user.uid)
      .collection("AllNotes")
      .doc("AllNotes")
      .set({
        FolderStructure: [
          { Title: "Readme.txt", isFolder: false, subStructure: [] },
        ],
      });

    // User All Folder Record ----->
    db.collection("user")
      .doc(user.uid)
      .collection("AllNotes")
      .doc("AllFolders")
      .set({
        AllFolders: [],
      });

    // User All Note Content ----->
    db.collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("FilewiseContent")
      .collection("FilewiseContent")
      .doc("~_~Readme.txt")
      .set({
        Content: `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 40px;","text":"Welcome to AI Notes","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-family: rr;font-size: 40px;"},{"children":[],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"👋 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Hello, and welcome aboard!","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" You've just unlocked the smartest way to take, organize, and master your notes. Let’s get you started!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-family: rr;font-size: 14px;"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 26px;","text":"🚀 Why You’ll Love AI Notes","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"✍️ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Write Effortlessly:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Say goodbye to cluttered thoughts. Let AI structure your ideas seamlessly.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"🔍 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Find Anything, Instantly:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Can't remember where you saved something? AI-powered search has your back!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"🤖 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Smarter Notes:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Get summaries, key insights, or even brainstorm ideas with your AI assistant.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"🌍 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Anywhere, Anytime:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Your notes are secure, synced, and accessible across all your devices.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 26px;","text":"🛠️ How to Get Started","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-family: rr;font-size: 26px;"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"1️⃣ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Open a New Tab:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Click ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"+ New Tab","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" to begin your first note.","type":"text","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"2️⃣ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"View Saved Notes:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Dive into your archive from the ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Files","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" menu.","type":"text","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"3️⃣ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Ask the AI:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Have a question? Highlight text or type a command—AI is ready to help!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-family: rr;font-size: 14px;"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 26px;","text":"🎯 Pro Tips","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Double Click to Rename Tabs","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":": Keep your workspace tidy by naming your tabs.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Drag to Reorder Tabs","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":": Organize your ideas, your way.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"AI Shortcuts:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Use ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"/summarize","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":", ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"/highlight","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":", or ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"/explain","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" in your notes to save time and boost productivity.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 26px;","text":"🌟 Quick Features Rundown","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"📂 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Multiple Tabs:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Like browser tabs, but for your notes—switch between files effortlessly.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"🧠 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"AI Summaries:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Condense long paragraphs into quick, actionable points.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"📝 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Collaborative Editing:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Work with your team in real-time.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"📤 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Export Options:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Save your notes as PDFs, Word docs, or even share directly via email.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 26px;","text":"🌈 Fun Fact","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"On average, users save ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"2 hours per week","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" with AI Notes. Imagine what you could do with that extra time—maybe start a new hobby or conquer the world? 🌍","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-family: rr;font-size: 14px;"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"💬 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"Got Questions?","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" Our chatbot in the corner is your 24/7 guide.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-family: rr;font-size: 14px;"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"🎉 Now, go ahead and hit ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":"+ New Tab","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;font-size: 14px;","text":" to start crafting brilliance!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-family: rr;font-size: 14px;"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`,
        LastSaved: formatDate(),
      });

    // User All TextFile Record ----->
    db.collection("user")
      .doc(user.uid)
      .collection("AllNotes")
      .doc("AllTextFile")
      .set({
        AllTextFile: ["Readme.txt"],
      });

    // AllUserSpace -------->
    db.collection("allUsers")
      .doc("AllUsersDetails")
      .update({
        // AllUsers Details Array --------------------------->
        AllUsersDetails: arrayUnion({
          Name: formattedName(),
          Email: email,
          Password: password,
          UserID: user.uid,
          PhotoURL: "default",
          Username: "notCreated",
          CreationTime: tempCreationTime,
          // Timestamp: serverTimestamp(),
        }),
      });

    // AIChatSpace ---------->
    db.collection("user")
      .doc(user.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .set({
        AllArchivedChatName: [],
        AllChatName: [],
        AllChatNameInfo: [],
        AllSharedChatName: [],
        ChatAccessRequest: [],
      });

    // AIAgentSpace ---------->
    db.collection("user")
      .doc(user.uid)
      .collection("AIAgents")
      .doc("AllAIAgents")
      .set({
        AllAIAgentInfo: [],
        AllAgentName: [],
      });

    // TaskInfo space ----------->
    db.collection("taskSpace")
      .doc(user.uid)
      .collection("taskInfo")
      .doc("taskInfo")
      .set({
        Todo: [],
        InProgress: [],
        Pause: [],
        Done: [],
        AllTasks: [],
      });

    console.log("Arora Space => Account created successfully");
    // navigateToLoggedInPage(user.uid);

    setTimeout(() => {
      setLoading((prev) => ({
        ...prev,
        state: false,
        success: false,
      }));
      navigateToLoggedInPage(user.uid);
    }, 1500);
  }

  const signUp = () => {
    const letterPattern = /[a-zA-Z]/;

    let obj = errorInfo;

    if (
      email?.toLowerCase()?.includes("@gmail.com") &&
      password?.length >= 8 &&
      name.length > 0
    ) {
      setLoading((prev) => ({
        ...prev,
        state: true,
      }));
    }

    if (name.length == 0) {
      obj = {
        Name: true,
        email: obj.email,
        password: obj.password,
        errorDetails: "",
      };
    }
    if (!email?.toLowerCase()?.includes("@gmail.com")) {
      obj = {
        Name: obj.Name,
        email: true,
        password: obj.password,
        errorDetails: "",
      };
    }
    if (password?.length < 8) {
      obj = {
        Name: obj.Name,
        email: obj.email,
        password: true,
        errorDetails: "",
      };
    }

    if (
      email?.toLowerCase()?.includes("@gmail.com") &&
      password?.length >= 8 &&
      name.length > 0
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setLoading((prev) => ({
            ...prev,
            success: true,
          }));
          createUserCollection(userCredential.user);
        })
        .catch((error) => {
          setErrorInfo({
            name: false,
            email: false,
            password: false,
            errorDetails: "Oops! Invalid Login Credentials",
          });
          setLoading((prev) => ({
            ...prev,
            error: true,
          }));

          setTimeout(() => {
            setLoading((prev) => ({
              ...prev,
              state: false,
              error: false,
            }));
          }, 1500);
        });
    }

    setErrorInfo(obj);
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        // Optionally, create a user collection in your database
        createUserCollection(user);
      })
      .catch((error) => {
        setError("Google Sign-In failed");
      });
  };

  const navigate = useNavigate();
  function navigateToSection() {
    navigate(`/user/login`);
  }

  function navigateToHome() {
    navigate(`/`);
  }

  function navigateToLoggedInPage(id) {
    navigate(`/user/welcomeUser/user?ID=${id}?section=Notes`);
  }

  return (
    <>
      <ClickSpark
        sparkColor="#000"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      />
      {loading?.state && <LoaderForSignUp loading={loading} />}
      <div className="w-full h-[100svh] flex justify-center items-center font-[r]">
        <div
          className="w-full lg:w-[400px] md:w-[400px] p-[40px] py-[20px] rounded-none md:rounded-xl lg:rounded-xl min-h-[100svh] md:min-h-[75%] lg:min-h-[75%]  flex flex-col justify-center md:justify-center lg:justify-center items-start bg-[white] px-[50px] font-[r] text-[14px] max-h-full md:max-h-[100%] lg:max-h-[100%]"
          // style={{ zIndex: "0" }}
        >
          <div
            style={{ zIndex: "10" }}
            className="w-full flex justify-center items-center mb-[30px]"
          >
            <button
              className="w-[80px] h-[80px] p-[13px] rounded-lg bg-[#f7f7f7]"
              onClick={() => {
                navigateToHome();
              }}
            >
              <img src={logo} className=" w-full h-full object-fill "></img>
            </button>
          </div>
          <div
            style={{ zIndex: "10" }}
            className=" font-[geistSemibold] text-[26px] mb-[5px] w-full flex justify-center"
          >
            Hey , join us today!
          </div>
          <div
            style={{ zIndex: "10" }}
            className=" w-full flex justify-center items-center text-[#00000078] mb-[20px]"
          >
            Already have an account ?{" "}
            <button
              className="px-[3px] mx-[2px] text-[black] cursor-pointer"
              onClick={() => {
                navigateToSection();
              }}
            >
              Log In here
            </button>
          </div>

          <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[20px] ">
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (nameField || name.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[13px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px] flex justify-center items-center px-[3px] text-[#0000004d]" +
                  (nameField || name.length > 0 ? " z-[10]" : " z-[0]")
                }
                style={{
                  zIndex: nameField || name.length > 0 ? "100" : "0",
                  // transition: ".3s",
                }}
              >
                Name
              </div>
            </div>
            <input
              id="nameField"
              className="w-full h-[40px] border-[1px] border-[#d5d5d500] rounded-lg bg-transparent px-[12px] "
              style={{
                zIndex: "5",
                outline: errorInfo?.name
                  ? "2px solid #ce3d00"
                  : "1px solid #d5d5d5" /* Force an outline */,
                outlineOffset: "0px",
              }}
              value={name}
              onChange={(e) => {
                if (errorInfo?.name) {
                  setErrorInfo({
                    Name: false,
                    email: errorInfo?.email,
                    password: errorInfo?.password,
                    errorDetails: "",
                  });
                }
                setName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (name.length == 0) {
                    console.log("Please enter your name !");
                    document.getElementById("nameField").focus();
                  } else if (email.length == 0) {
                    console.log("Please enter your email !");
                    document.getElementById("emailField").focus();
                  } else if (password.length == 0) {
                    console.log("Please choose any password !");
                    document.getElementById("passwordField").focus();
                  } else if (
                    name.length > 0 &&
                    email.length > 0 &&
                    password.length > 0
                  ) {
                    console.log("We are processing the details !");
                    signUp();
                  }

                  // signUp();
                }
              }}
              onFocus={() => {
                setNameField(true);
              }}
              onBlur={() => {
                setNameField(false);
              }}
            ></input>
          </div>
          <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[15px] ">
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (emailField || email.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[13px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px]  flex justify-center items-center px-[3px] text-[#0000004d]" +
                  (emailField || email.length > 0 ? " z-[10]" : " z-[0]")
                }
                style={{
                  zIndex: emailField || email.length > 0 ? "100" : "0",
                  // transition: ".3s",
                }}
              >
                Email
              </div>
            </div>
            <input
              id="emailField"
              className="w-full h-[40px] border-[1px] border-[#d5d5d500] rounded-lg bg-transparent px-[12px]"
              style={{
                zIndex: "5",
                outline: errorInfo?.email
                  ? "2px solid #ce3d00"
                  : "1px solid #d5d5d5" /* Force an outline */,
                outlineOffset: "0px",
              }}
              value={email}
              onChange={(e) => {
                if (errorInfo?.email) {
                  setErrorInfo({
                    name: errorInfo?.Name,
                    email: false,
                    password: errorInfo?.password,
                    errorDetails: "",
                  });
                }
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (name.length == 0) {
                    console.log("Please enter your name !");
                    document.getElementById("nameField").focus();
                  } else if (email.length == 0) {
                    console.log("Please enter your email !");
                    document.getElementById("emailField").focus();
                  } else if (password.length == 0) {
                    console.log("Please choose any password !");
                    document.getElementById("passwordField").focus();
                  } else if (
                    name.length > 0 &&
                    email.length > 0 &&
                    password.length > 0
                  ) {
                    console.log("We are processing the details !");
                    signUp();
                  }

                  // signUp();
                }
              }}
              onFocus={() => {
                setEmailField(true);
              }}
              onBlur={() => {
                setEmailField(false);
              }}
            ></input>
          </div>
          <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[15px] ">
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (passwordField || password.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[13px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px]  flex justify-center items-center px-[3px] text-[#0000004d]" +
                  (passwordField || password.length > 0 ? " z-[10]" : " z-[0]")
                }
                style={{
                  zIndex: passwordField || password.length > 0 ? "100" : "0",
                  // transition: ".3s",
                }}
              >
                Password
              </div>
            </div>
            <div
              className="w-full h-[40px]  bg-transparent flex justify-start items-center "
              style={{ zIndex: "5" }}
            >
              <input
                id="passwordField"
                className="w-full h-[40px] border-[1px] border-[#d5d5d500] rounded-lg bg-transparent px-[12px]"
                style={{
                  zIndex: "5",
                  outline: errorInfo?.password
                    ? "2px solid #ce3d00"
                    : "1px solid #d5d5d5" /* Force an outline */,
                  outlineOffset: "0px",
                }}
                value={password}
                type={!showPass ? "password" : "text"}
                onChange={(e) => {
                  if (errorInfo?.password) {
                    setErrorInfo({
                      Name: errorInfo?.Name,
                      email: errorInfo?.email,
                      password: false,
                      errorDetails: "",
                    });
                  }
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (name.length == 0) {
                      console.log("Please enter your name !");
                      document.getElementById("nameField").focus();
                    } else if (email.length == 0) {
                      console.log("Please enter your email !");
                      document.getElementById("emailField").focus();
                    } else if (password.length == 0) {
                      console.log("Please choose any password !");
                      document.getElementById("passwordField").focus();
                    } else if (
                      name.length > 0 &&
                      email.length > 0 &&
                      password.length > 0
                    ) {
                      console.log("We are processing the details !");
                      signUp();
                    }

                    // signUp();
                  }
                }}
                onFocus={() => {
                  setPasswordField(true);
                }}
                onBlur={() => {
                  setPasswordField(false);
                }}
              ></input>
              <button
                className="w-[40px] h-full ml-[-40px] flex justify-center items-center cursor-pointer z-20"
                onClick={() => {
                  setShowPass(!showPass);
                }}
              >
                {showPass ? (
                  <EyeOff width={15} height={15} strokeWidth={1.7} />
                ) : (
                  <Eye width={15} height={15} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>
          <div
            className={
              "w-full flex justify-end items-center text-[12px] mt-[5px] text-[#ff3b00]" +
              (error.length > 0 ? " flex" : " hidden")
            }
          >
            <div>{error} *</div>
          </div>

          <div
            style={{ zIndex: "10" }}
            className="w-full h-[40px] mt-[30px] rounded-lg font-[700] tracking-wider bg-[#000000] hover:bg-[#252525] text-[white] text-[14px] flex justify-center items-center cursor-pointer"
            onClick={() => {
              signUp();
            }}
          >
            Sign Up
          </div>

          {/* <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-center items-center text-[#9ba6aa]">
            Already have an account ?{" "}
            <span
              className="text-[black] ml-[5px] cursor-pointer"
              onClick={() => {
                navigateToSection();
              }}
            >
              {" "}
              Sign In
            </span>
          </div> */}

          <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-between items-center text-[#9ba6aa]">
            <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
            <div className="">or</div>
            <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
          </div>
          <div
            style={{ zIndex: "10" }}
            className="w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] flex justify-center items-center  cursor-pointer"
            onClick={() => {
              signUpWithGoogle();
            }}
          >
            <span>
              <FcGoogle className="text-[18px] mr-[10px]" />
            </span>
            <span>Sign up with Google</span>
          </div>
          <div className="text-[12px] text-center text-[#b3b3b3] mt-[30px] w-full z-[2]">
            You acknowledge that you read, and agree, to our
          </div>
          <div className="text-[12px] text-center text-[#b3b3b3] mt-[0px] w-full z-[2]">
            <button className="text-[#454545] mx-[0px] underline underline-offset-[2px]">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-[#454545] mx-[0px] underline underline-offset-[2px]">
              Privacy Policy
            </button>
            .
          </div>
        </div>{" "}
      </div>
    </>
  );
}
