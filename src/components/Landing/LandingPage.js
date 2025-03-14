import { FileSymlink } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  function navigateToLoginPage() {
    navigate(`/user/login`);
  }

  function navigateToSignupPage() {
    navigate(`/user/signup`);
  }
  return (
    <div className="w-full h-[100svh] overflow-y-scroll flex flex-col justify-start items-center pt-[130px] bg-white font-[geistRegular] px-[100px] ">
      <div className="w-full h-[50px] fixed left-0 top-0 flex justify-between items-center px-[100px]">
        <div className="font-[geistBold] text-[26px]">Inkly.ai</div>
        <div>
          <button
            onClick={() => {
              navigateToLoginPage();
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              navigateToSignupPage();
            }}
          >
            Signup
          </button>
        </div>
      </div>
      {/* <span className="font-[gr] text-[70px]">Capture Every Idea</span>
      <span className="font-[gr] text-[70px]">with Reimagined Note-Taking</span> */}
      <span className="font-[gr] text-[80px]">
        Redefining the Art of Note-Taking
      </span>
      <span className="font-[gr] text-[80px] mt-[-30px]">
        Reimagined for You
      </span>

      <span className="sm:w-[80%] md:w-[60%] lg:w-[45%] text-center text-[18px] mt-[20px] text-[#6e6e7c] font-[sr]">
        Supercharge your productivity with intelligent note-taking that
        understands your needs and helps you connect the dots
      </span>
      <div className="min-h-[45px] px-[15px] bg-[#323DD6] shadow-md shadow-[#323dd640]  text-[white] mt-[40px] rounded-xl flex justify-center items-center cursor-pointer">
        Start Capturing Ideas{" "}
        <FileSymlink
          width={18}
          height={18}
          strokeWidth="2"
          className="ml-[10px]"
        />
      </div>
      <div className="min-h-[100px]"></div>
      <di className="font-[geistMedium] text-[14px] uppercase text-[#323DD6]">
        Ai assistant
      </di>

      <div className="font-[gr] text-[40px]">Never Write Alone</div>
      <div className="text-center sm:w-[80%] md:w-[60%] lg:w-[45%] text-[18px] mt-[20px] font-[sr] text-[#6e6e7c]">
        Supercharge your productivity with our suite of AI features.
        Automatically summarize key points, generate action items, and connect
        related notes, all within a secure and private environment. No training
        data used.
      </div>
      {/* <span className="sm:w-[80%] md:w-[60%] lg:w-[45%] text-center text-[18px] mt-[20px] text-[#6e6e7c] font-[sr]">
        Features built to enhance your research and writing capabilities
      </span> */}
      <div className="flex justify-between items-center mt-[60px] w-full">
        <div className="flex flex-col justify-start items-start w-[calc((100%-150px)/3)]">
          <span className="font-[grm] text-[25px]">Unified Workspace</span>
          <span className="font-[sr] text-[#6e6e7c]">
            Keep everything in one place. Seamlessly manage your notes, tasks,
            and reminders within a single, unified workspace. Your data is kept
            secure and never used to train AI models.
          </span>
        </div>
        <div className="h-[60px] w-[1.8px] bg-gradient-to-b from-[white] via-[#868686] to-[white] rounded-full"></div>
        <div className="flex flex-col justify-start items-start w-[calc((100%-150px)/3)]">
          <span className="font-[grm] text-[25px]">AI Powered</span>
          <span className="font-[sr] text-[#6e6e7c]">
            Supercharge your productivity with our suite of AI features.
            Automatically summarize key points, generate action items, and
            connect related notes, all within a secure and private environment.
            No training data used.
          </span>
        </div>
        <div className="h-[60px] w-[1.8px] bg-gradient-to-b from-[white] via-[#868686] to-[white] rounded-full"></div>

        <div className="flex flex-col justify-start items-start w-[calc((100%-150px)/3)]">
          <span className="font-[grm] text-[25px]">End to End Encrypted</span>
          <span className="font-[sr] text-[#6e6e7c]">
            We rigorously protect your information with industry-leading
            security practices. Your notes are organized into secure, encrypted
            folders, ensuring your sensitive data remains private and
            confidential.
          </span>
        </div>
      </div>
    </div>
  );
}
