import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesColumn,
  FileSymlink,
  MoveRight,
  NotebookPen,
  Rocket,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import SplitText from "../Animations/SplitText";
import StarBorder from "../Animations/StarBorder";
import ShinyText from "../Animations/ShinyText";
import Threads from "../Animations/Threads";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import logoDark from "../../assets/img/logoDark.png";

import { DotButton, useDotButton } from "../Carousel/EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "../Carousel/EmblaCarouselArrowButtons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileAttachmentIcon,
  FileShredderIcon,
  Note02Icon,
  PackageReceiveIcon,
  StickyNote02Icon,
} from "@hugeicons/core-free-icons";
import HeroSection from "./HeroSection";

export default function LandingPage() {
  const [nav, setNav] = useState(false);
  const [info, setInfo] = useState(false);
  const [test, setTest] = useState(false);
  const [head1, setHead1] = useState(false);
  const [head2, setHead2] = useState(false);
  const [anime, setAnime] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const SLIDE_COUNT = 5;
  const slides = [
    {
      name: "Aarav Mehta",
      role: "Product Manager",
      review:
        "This app is a lifesaver! Whether I’m in a meeting or studying, the AI keeps my notes neat, searchable, and super easy to find.",
      submessage: "Highly recommend for professionals juggling multiple tasks.",
    },
    {
      name: "Neha Sharma",
      role: "Research Analyst",
      review:
        "Taking notes has never felt this effortless! The AI organizes everything so smoothly that I barely have to think about it.",
      submessage:
        "Perfect for researchers who need structured notes on the go.",
    },
    {
      name: "Rohan Iyer",
      role: "Software Engineer",
      review:
        "I used to struggle with messy notes, but not anymore! This app makes everything structured and easy to access whenever I need it.",
      submessage: "A game-changer for developers managing multiple projects.",
    },
    {
      name: "Priya Verma",
      role: "Marketing Consultant",
      review:
        "Finally, a note-taking app that actually understands me! The AI-powered features help me stay on top of things without the usual hassle.",
      submessage: "Seamless experience for marketers handling creative ideas.",
    },
    {
      name: "Vikram Rao",
      role: "Chartered Accountant",
      review:
        "From quick ideas to detailed plans, this app keeps everything in one place and perfectly organized—can’t imagine working without it now!",
      submessage:
        "Ideal for finance professionals who need well-structured notes.",
    },
  ];
  const options = { loop: true };
  // const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    setAnime(true);
    setTimeout(() => {
      setHead1(true);
    }, 800);
    setTimeout(() => {
      setHead2(true);
    }, 1200);
    setTimeout(() => {
      setTest(true);
    }, 3000);
  }, []);

  const navigate = useNavigate();

  function navigateToLoginPage() {
    navigate(`/user/login`);
  }

  function navigateToDocs() {
    navigate(`/documentation`);
  }

  function navigateToSignupPage() {
    navigate(`/user/signup`);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        // setActiveIndex(activeIndex + 1);
        // console.log(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <div className="-z-30 left-0 top-0 fixed w-full h-[100svh] bg-[#000712] flex flex-col justify-center items-start text-[white]">
        {/* <div className="w-[85%] h-[70%] rounded-b-[70%] bg-gradient-to-b from-[#232234] to-[#3b4554] blur-[150px] mt-[-50px] mr-[-100px] md:mt-[-150px] md:mr-[-400px] lg:mt-[-150px] lg:mr-[-400px]"></div> */}
        {/* <div className="h-[100px] flex justify-between items-center w-[400px]">
          <HugeiconsIcon
            className="mr-[8px]"
            icon={Note02Icon}
            size={28}
            strokeWidth={1.8}
          />
        </div>{" "}
        <div className="h-[100px] flex justify-between items-center w-[400px]">
          <HugeiconsIcon
            className="mr-[8px] blur-[2px]"
            icon={StickyNote02Icon}
            size={28}
            strokeWidth={1.8}
          />
        </div>{" "}
        <div className="h-[100px] flex justify-between items-center w-[400px]">
          <HugeiconsIcon
            className="mr-[8px]"
            icon={FileAttachmentIcon}
            size={28}
            strokeWidth={1.8}
          />
        </div>{" "}
        <div className="h-[100px] flex justify-between items-center w-[400px]">
          <HugeiconsIcon
            className="mr-[8px]"
            icon={FileShredderIcon}
            size={28}
            strokeWidth={1.8}
          />
        </div> */}
      </div>
      <div className="w-full h-[100svh] flex flex-col justify-start items-center overflow-y-scroll">
        <div
          className={
            "w-full min-h-[60px] md:min-h-[60px] lg:min-h-[60px]  flex justify-between items-center px-[20px] md:px-[100px] lg:px-[100px] z-[70] fixed left-0 top-0 backdrop-blur-[15px] bg-[#00071290] " +
            (anime ? " mt-[0px] opacity-100" : " mt-[30px] opacity-0")
          }
          style={{
            transition: "margin-top .5s, opacity .6s",
            transitionDelay: "0s , .2s ",
          }}
        >
          <div className=" font-bold text-[20px] tracking-wider flex justify-start items-center text-[white]">
            <div className="flex justify-start items-center">
              {/* <Rocket
                width={20}
                height={20}
                strokeWidth={2.5}
                className="mr-[7px] moving-item"
              />{" "}
              aurora.ai */}
              <img src={logoDark} className="w-[20px]"></img>
              <span className="text-[20px] ml-[15px] font-[DMSm] ">Aurora</span>
            </div>
            {/* <button
              className="text-[15px] hidden md:block lg:block tracking-normal hover:text-[white] ml-[80px] font-[geistRegular] text-[#cecece] font-normal "
              onClick={() => {
                // navigateToLoginPage();
              }}
            >
              Pricing
            </button> */}
            <button
              className="text-[15px] hidden md:block lg:block tracking-normal hover:text-[white] ml-[80px] font-[DMSr] text-[#cecece] font-normal "
              onClick={() => {
                navigateToDocs();
              }}
            >
              Documentation
            </button>
            <button
              className="text-[15px] hidden md:block lg:block tracking-normal hover:text-[white] ml-[50px] font-[DMSr] text-[#cecece] font-normal "
              onClick={() => {
                // navigateToLoginPage();
              }}
            >
              FAQs
            </button>
          </div>
          <div className="w-auto flex justify-end items-center text-[#cecece]">
            <button
              className="text-[15px] hidden md:block lg:block px-[15px] hover:text-[white] "
              onClick={() => {
                navigateToLoginPage();
              }}
            >
              Log in
            </button>
            <button
              className="text-[15px]  hidden md:flex lg:flex px-[15px] h-[31px] w-auto rounded-xl bg-gradient-to-tr from-[#cfcfcf] via-[#ffffff] to-[#ffffff] ml-[30px] text-[black] whitespace-nowrap  justify-center items-center "
              onClick={() => {
                navigateToSignupPage();
              }}
            >
              Signup{" "}
              <ArrowRight
                width={16}
                height={16}
                strokeWidth={2.5}
                className="ml-[7px] mr-[-3px]"
              />
            </button>
            {/* <StarBorder
              as="button"
              className="custom-class"
              color="white"
              speed="1s"
            >
              Sign up
            </StarBorder> */}
            <div>
              <ChartNoAxesColumn
                width={25}
                height={25}
                strokeWidth={2.4}
                className="flex md:hidden lg:hidden -rotate-90 text-[white]"
              />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col justify-center items-center relative min-h-[600px] w-[80%] text-[white]">
          <span
            className={
              "font-[DMSb] text-[50px] flex justify-center items-center relative" +
              (anime
                ? " mt-[0px] opacity-100 blur-0"
                : " mt-[30px] opacity-0 blur-md")
            }
            style={{ transition: ".5s", transitionDelay: ".4s" }}
          >
            Redefining Note Taking
          </span>
          <span
            className={
              "font-[DMSb] text-[50px] flex justify-center items-center relative" +
              (anime
                ? " mt-[-10px] opacity-100 blur-0"
                : " mt-[20px] opacity-0 blur-md")
            }
            style={{ transition: ".5s", transitionDelay: ".6s" }}
          >
            <div className="glow-text mr-[15px]">Reimagined</div> for You
          </span>

          {(() => {
            const icons = [];
            const positions = [];

            const isTooClose = (x1, y1, x2, y2) =>
              Math.hypot(x2 - x1, y2 - y1) < 8;

            while (icons.length < 12) {
              const top = Math.random() * 100;
              const left = Math.random() * 100;

              // Skip if in center (40-60%) or edges (<10% or >90%)
              const inCenter = top > 40 && top < 60 && left > 40 && left < 60;
              const tooCloseToEdge =
                top < 10 || top > 90 || left < 10 || left > 90;

              if (inCenter || tooCloseToEdge) continue;

              const tooClose = positions.some(([t, l]) =>
                isTooClose(top, left, t, l)
              );
              if (tooClose) continue;

              positions.push([top, left]);

              icons.push(
                <HugeiconsIcon
                  key={icons.length}
                  className="absolute text-[white] animate-float"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    transform: `translate(-50%, -50%) rotate(${
                      Math.random() * 360
                    }deg)`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                  icon={FileAttachmentIcon}
                  size={28}
                  strokeWidth={1.8}
                />
              );
            }

            console.log("Generated Icons:", icons);

            return icons;
          })()}
        </div> */}
        <div className="w-full min-h-[calc(100svh)] flex justify-center items-center">
          <HeroSection anime={anime} />
        </div>
        <section className=" py-20 px-6 text-white font-[DMSr]">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-[DMSb] mb-8">
              Supercharged by <span className="glow-text">AI</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-16">
              Experience next-gen productivity tools built with intelligence.
            </p>

            <div className="grid md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="bg-[#131A2600] rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition">
                <div className="text-[#38BDF8] text-3xl mb-4">🧠</div>
                <h3 className="text-xl font-[DMSm] whitespace-nowrap flex justify-center items-center mb-2">
                  <div className="glow-text2 mr-[5px]">AI Note</div> Summarizer
                </h3>
                <p className="text-gray-400">
                  Turn long notes into concise summaries instantly using our
                  powerful AI engine.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#131A2600] rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition">
                <div className="text-[#38BDF8] text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-[DMSm] whitespace-nowrap flex justify-center items-center mb-2">
                  <div className="glow-text2 mr-[5px]">AI Chatbot</div>{" "}
                  Assistant
                </h3>
                <p className="text-gray-400">
                  Ask questions, generate ideas, or get help right inside your
                  notes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#131A2600] rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition">
                <div className="text-[#38BDF8] text-3xl mb-4">⚙️</div>
                <h3 className="text-xl font-[DMSm] whitespace-nowrap flex justify-center items-center mb-2">
                  Smart <div className="glow-text2 mr-[5px]">AI Agents</div>
                </h3>
                <p className="text-gray-400">
                  Automate tasks like scheduling, organizing, or tagging —
                  effortlessly.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-20 my-10"></div>
        <section className="text-center mt-20">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to level up your notes?
          </h3>
          <button className="mt-4 px-8 py-3 bg-[#38BDF8] text-black font-semibold rounded-full shadow-lg hover:scale-105 transition">
            Try It Now
          </button>
        </section>

        <div className="w-full h-[calc(100%-60px)] md:h-[calc(100%-80px)] lg:h-[calc(100%-80px)]  flex flex-col justify-start items-center pt-[50px] md:pt-[130px] lg:pt-[130px] pb-[200px]  px-[20px] md:px-[100px] lg:px-[100px] text-[white] font-[DMSR] ">
          <div
            className={
              "px-[10px] min-h-[30px] max-w-[calc(100%-00px)] md:max-w-auto lg:max-w-auto text-[14px] flex flex-wrap justify-center items-center whitespace-normal md:whitespace-nowrap lg:whitespace-nowrap rounded-2xl border-[1.5px] border-[#404040] bg-[#2D2D3B] text-[#cecece] " +
              (anime ? " mt-[30px] opacity-100" : " mt-[60px] opacity-0")
            }
            style={{ transition: ".4s", transitionDelay: ".5s" }}
          >
            {/* Total users <span className="mx-[6px]">-</span> 2089{" "} */}
            Case study : Our note app boosts productivity by{" "}
            <div className="mx-[4px] text-[white]">2x</div> for{" "}
            <div className="mx-[4px] text-[white]">10,000+</div> users
            <TrendingUp
              width={16}
              height={16}
              strokeWidth={2}
              className="ml-[7px] text-[#9af989] drop-shadow-[0_0px_4px_rgb(84,255,37)] shadow-[#70d070]"
            />
          </div>

          {head1 ? (
            <span
              className="font-[geistRegular] hidden md:block lg:block text-[60px] mt-[30px] text-[#CCCED8]"
              // style={{ transition: ".2s" }}
            >
              {/* Redefining the Art of Note-Taking */}
              {/* Redefining Note-Taking */}
              {/* <SplitText
                text="Redefining Note-Taking"
                className=""
                delay={20}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              /> */}
            </span>
          ) : (
            <>
              <span className="font-[geistRegular] hidden md:block lg:block text-[60px] mt-[30px] text-transparent">
                hel
              </span>
            </>
          )}
          {head2 ? (
            <span className="font-[geistRegular] hidden md:block lg:block text-[60px] mt-[-15px] text-[#CCCED8]">
              {/* Reimagined for You */}
              {/* <SplitText
                text="Reimagined for You"
                className=""
                delay={20}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              /> */}
            </span>
          ) : (
            <>
              <span className="font-[geistRegular] hidden md:block lg:block text-[60px] mt-[-15px] text-transparent">
                hel
              </span>
            </>
          )}
          {head1 ? (
            <span
              className="font-[geistRegular] block md:hidden lg:hidden text-center text-[60px] mt-[70px] text-[#CCCED8]"
              // style={{ transition: ".2s" }}
            >
              {/* Redefining the Art of Note-Taking */}
              {/* Redefining Note-Taking */}
              {/* <SplitText
                text="Reimagined"
                className=""
                delay={20}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              /> */}
            </span>
          ) : (
            <>
              <span className="font-[geistRegular] block md:hidden lg:hidden text-[60px] mt-[30px] text-transparent">
                hel
              </span>
            </>
          )}
          {head2 ? (
            <span className="font-[geistRegular] block md:hidden lg:hidden text-center text-[60px] mt-[-15px] text-[#CCCED8]">
              {/* Reimagined for You */}
              {/* <SplitText
                text="for You"
                className=""
                delay={20}
                animationFrom={{
                  opacity: 0,
                  transform: "translate3d(0,50px,0)",
                }}
                animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                easing="easeOutCubic"
                threshold={0.2}
                rootMargin="-50px"
              /> */}
            </span>
          ) : (
            <>
              <span className="font-[geistRegular] block md:hidden lg:hidden text-[60px] mt-[-15px] text-transparent">
                hel
              </span>
            </>
          )}
          <span
            className={
              "sm:w-[80%] md:w-[60%] lg:w-[45%] text-center text-[16px] mt-[20px] font-[geistRegular] text-[#B3B1B9]" +
              (anime ? " mt-[30px] opacity-100" : " mt-[60px] opacity-0")
            }
            style={{ transition: ".5s", transitionDelay: "1.8s" }}
          >
            Supercharge your productivity with intelligent note-taking that
            understands your needs and helps you connect the dots
          </span>
          <button
            className={
              "group px-[15px] min-h-[40px] flex justify-center items-center rounded-xl mt-[100px] md:mt-[70px] lg:mt-[70px] border-[1.5px] border-[#404040] bg-[#2d2d3b79] hover:bg-[#2d2d3b] hover: hover:text-[white]" +
              (anime ? " mt-[30px] opacity-100" : " mt-[60px] opacity-0")
            }
            style={{ transition: ".5s", transitionDelay: "2.3s" }}
          >
            <ShinyText
              text="Start Capturing Ideas"
              disabled={false}
              speed={5}
              className="custom-class group-hover:text-[white]"
            />
          </button>
          <div
            className={
              " text-[15px] text-[#5f5f5f] font-semibold tracking-[6px]" +
              (anime ? " mt-[130px] opacity-100" : " mt-[160px] opacity-0")
            }
            style={{ transition: ".5s", transitionDelay: "2.8s" }}
          >
            TESTIMONIALS
          </div>
          <div
            className={
              "text-[50px]  text-transparent bg-gradient-to-b from-[white] to-[#565656] bg-clip-text " +
              (anime ? " mt-[30px] opacity-100" : " mt-[60px] opacity-0")
            }
            style={{ transition: ".5s", transitionDelay: "3.2s" }}
          >
            Some words from users
          </div>
          <div
            className={
              "text-[#929292] text-[14px]" +
              (anime ? " mt-[5px] opacity-100" : " mt-[15px] opacity-0")
            }
            style={{ transition: ".5s", transitionDelay: "3.7s" }}
          >
            Hear what some of our users have to say about our product
          </div>

          {test ? (
            <div className="embla mt-[100px] w-[70%] flex flex-col justify-start items-center ">
              <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container w-[100%]">
                  {slides.map((data, index) => (
                    <div
                      className="min-w-[calc(100%-0px)] px-[15%] cursor-pointer flex flex-col justify-start items-start mx-[30px]"
                      key={index}
                    >
                      <div className="flex flex-col justify-start items-start text-[18px]  text-[#CCCED8] w-full text-justify ">
                        {data?.submessage}
                      </div>
                      <span className=" text-[#949494] mt-[5px] w-full text-justify text-[14px]">
                        {data?.review}
                      </span>
                      <div className="flex justify-start items-center text-[14px] text-[#787878] mt-[15px]">
                        <MoveRight
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className="mr-[5px]"
                        />{" "}
                        <span className="ml-[5px] mr-[3px] font-semibold text-[#949494]">
                          {data?.name}
                        </span>
                        , {data?.role}{" "}
                        <BadgeCheck
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className="ml-[10px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="embla__controls w-[70%]">
                <div className="embla__buttons w-full flex justify-center items-center">
                  <PrevButton
                    onClick={onPrevButtonClick}
                    disabled={prevBtnDisabled}
                  />
                  <NextButton
                    onClick={onNextButtonClick}
                    disabled={nextBtnDisabled}
                  />
                </div>

                <div className="embla__dots">
                  {scrollSnaps.map((_, index) => (
                    <DotButton
                      key={index}
                      onClick={() => onDotButtonClick(index)}
                      className={"embla__dot".concat(
                        index === selectedIndex ? " embla__dot--selected" : ""
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
