import { Cctv, Fingerprint, Pencil, UserPen } from "lucide-react";
import React, { useState } from "react";

export default function AccountPage(props) {
  const [userBio, setUserBio] = useState(
    `Hi 🔥, I'm Ronald, a passionate UX designer with 10 of experience in creating intuitive and user-centered digital experiences. With a strong background in user research, information architecture, and interaction design, I am dedicated 🚀 to crafting seamless and delightful user journeys.`
  );

  return (
    <>
      <div
        className={
          "w-full h-full flex flex-col justify-start items-start text-[14px] overflow-y-scroll pr-[25px] pt-[30px] z-50" +
          (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
        }
      >
        <div
          className={
            "text-[17px] flex justify-start items-center font-[geistSemibold] tracking-wide" +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          <UserPen
            width={20}
            height={20}
            strokeWidth={2.2}
            className="mr-[10px]"
          />
          Profile
        </div>
        {/* <div className="mt-[20px]">Avatar</div>
        <div className=" flex justify-start items-center">
          <div className="min-w-[70px] max-w-[70px] aspect-square rounded-full bg-[#00000025] "></div>
        </div> */}
        <div className="w-full flex justify-start items-center mt-[20px]">
          <div className="w-[120px] aspect-square rounded-full overflow-hidden ">
            <img
              src="https://images.pexels.com/photos/2128807/pexels-photo-2128807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              className="w-full h-full object-cover"
            ></img>
          </div>
          <div className="w-[calc(100%-150px)] flex flex-col justify-center items-start ml-[30px] ">
            <div
              className={
                "px-[13px] h-[35px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px]" +
                (props?.theme
                  ? " bg-[#293542] hover:bg-[#344352] text-[#97a2b0] hover:text-[white] hover:border-[#3d4b59] border-[#2d3945]"
                  : " bg-[#404148] text-[white]")
              }
            >
              Upload new photo
            </div>
            <div className="mt-[15px]">
              Recommendeed file format JPG or PNG.
            </div>
            <div className="">Image size should be less than 10MB.</div>
          </div>
        </div>
        <div className="w-full rounded-xl border-[#2d3945] border-[1.5px] p-[20px] mt-[30px] flex flex-col justify-start items-start">
          <div className="w-full flex justify-between items-center">
            <div
              className={
                "text-[17px] flex justify-start items-center font-[geistSemibold] tracking-wide" +
                (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
            >
              {/* <UserPen
                width={20}
                height={20}
                strokeWidth={2.2}
                className="mr-[10px]"
              /> */}
              Personal Info
            </div>
            <div
              className={
                "px-[10px] h-[30px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px]" +
                (props?.theme
                  ? " bg-[#293542] hover:bg-[#344352] text-[#97a2b0] hover:text-[white] hover:border-[#3d4b59] border-[#2d3945]"
                  : " bg-[#404148] text-[white]")
              }
            >
              <Pencil
                width={12}
                height={12}
                strokeWidth={2.2}
                className="mr-[8px]"
              />
              Edit
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row lg:flex-row justify-start items-start md:items-center lg:items-center mt-[20px]">
            <div className="flex flex-col justify-start items-start">
              <div>Name</div>
              <div className="text-[white] mt-[0px] md:mt-[5px] lg:mt-[5px]">
                Himadri Purkait
              </div>
            </div>
            <div className="flex flex-col justify-start items-start ml-[0px] md:ml-[80px] lg:ml-[80px]">
              <div className="mt-[10px] md:mt-[0px] lg:mt-[0px]">Email</div>
              <div className="text-[white] mt-[0px] md:mt-[5px] lg:mt-[5px]">
                himadri@gmail.com
              </div>
            </div>
            <div className="flex flex-col justify-start items-start ml-[0px] md:ml-[80px] lg:ml-[80px]">
              <div className="mt-[10px] md:mt-[0px] lg:mt-[0px]">Phone</div>
              <div className="text-[white] mt-[0px] md:mt-[5px] lg:mt-[5px]">
                +91 8100524419
              </div>
            </div>
          </div>
        </div>
        <div className="w-full rounded-xl border-[#2d3945] border-[1.5px] p-[20px] mt-[30px] flex flex-col justify-start items-start">
          <div className="w-full flex justify-between items-center">
            <div
              className={
                "text-[17px] flex justify-start items-center font-[geistSemibold] tracking-wide" +
                (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
            >
              Location
            </div>
            <div
              className={
                "px-[10px] h-[30px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px]" +
                (props?.theme
                  ? " bg-[#293542] hover:bg-[#344352] text-[#97a2b0] hover:text-[white] hover:border-[#3d4b59] border-[#2d3945]"
                  : " bg-[#404148] text-[white]")
              }
            >
              <Pencil
                width={12}
                height={12}
                strokeWidth={2.2}
                className="mr-[8px]"
              />
              Edit
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row lg:flex-row justify-start items-start md:items-center lg:items-center mt-[20px]">
            <div className="flex flex-col justify-start items-start">
              <div>Name</div>
              <div className="text-[white] mt-[0px] md:mt-[5px] lg:mt-[5px]">
                Himadri Purkait
              </div>
            </div>
          </div>
        </div>
        <div className="w-full rounded-xl border-[#2d3945] border-[1.5px] p-[20px] mt-[30px] flex flex-col justify-start items-start">
          <div className="w-full flex justify-between items-center">
            <div
              className={
                "text-[17px] flex justify-start items-center font-[geistSemibold] tracking-wide" +
                (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
            >
              Bio
            </div>
            <div
              className={
                "px-[10px] h-[30px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px]" +
                (props?.theme
                  ? " bg-[#293542] hover:bg-[#344352] text-[#97a2b0] hover:text-[white] hover:border-[#3d4b59] border-[#2d3945]"
                  : " bg-[#404148] text-[white]")
              }
            >
              <Pencil
                width={12}
                height={12}
                strokeWidth={2.2}
                className="mr-[8px]"
              />
              Edit
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row lg:flex-row justify-start items-start md:items-center lg:items-center mt-[20px]">
            <textarea
              className="outline-none resize-none max-h-[300px] bg-transparent w-full "
              style={{ transition: ".2s" }}
              placeholder="Type your message ..."
              value={userBio}
              onInput={(e) => {
                setUserBio(e.target.value);
                e.target.style.height = "auto"; // Reset the height to auto to recalculate
                e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
              }}
            ></textarea>
          </div>
        </div>
        <div
          className={
            "mt-[20px]" + (props?.theme ? " text-white" : " text-black")
          }
        >
          Name
        </div>
        <div className={"mt-[0px]"}>Please enter your full name</div>
        <div className="w-full flex justify-start items-center  mt-[10px] ">
          <input
            className={
              "w-[200px] h-[35px] rounded-lg border-[1.5px] text-[14px] flex justify-start items-center outline-none px-[12px]" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
            value={"Himadri Purkait"}
          ></input>
          <div
            className={
              "px-[12px] h-[35px] rounded-lg bg-[#f0f0f0] hover:bg-[#d9d9d9] flex justify-center items-center ml-[15px] cursor-pointer opacity-50" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
          >
            Save
          </div>
        </div>
        <div
          className={
            "mt-[20px]" + (props?.theme ? " text-white" : " text-black")
          }
        >
          Email
        </div>
        <div className={"mt-[0px]"}>Please enter your full name</div>
        <div className="w-full flex justify-start items-center  mt-[10px] ">
          <input
            className={
              "w-[200px] h-[35px] rounded-lg border-[1.5px] text-[14px] flex justify-start items-center outline-none px-[12px]" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
            value={"Himadri Purkait"}
          ></input>
          <div
            className={
              "px-[12px] h-[35px] rounded-lg bg-[#f0f0f0] hover:bg-[#d9d9d9] flex justify-center items-center ml-[15px] cursor-pointer opacity-50" +
              (props?.theme
                ? " border-[#2c363b] text-white"
                : " border-[#ededed] text-black")
            }
          >
            Save
          </div>
        </div>
        <div
          className={
            "text-[17px] flex justify-start items-center mt-[70px]" +
            (props?.theme ? " text-[#ffffff]" : " text-[black]")
          }
        >
          <Cctv
            width={20}
            height={20}
            strokeWidth={2.2}
            className="mr-[10px]"
          />
          Account Security
        </div>
        <div className="flex justify-start items-center mt-[6px]">
          {/* <TriangleAlert
            width={16}
            height={16}
            strokeWidth={2.2}
            className="text-[#FFA217] mr-[9px]"
          /> */}
          Set up security measure for better protection
        </div>
      </div>
    </>
  );
}
