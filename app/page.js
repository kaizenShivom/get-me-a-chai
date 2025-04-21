import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center gap-4 text-white items-center h-[44vh] px-5 md:px-10 lg:px-20 text-xs md:text-base">
        <div className="font-bold flex gap-2 md:text-5xl justify-center items-center text-3xl text-center">
          Get Me a Chai
          <span>
            <img className="invertImg" src="/tea.gif" width={88} alt="" />
          </span>
        </div>
        <p className="text-center">
          A crowdfunding platform for creators. Get funded by your fans and followers. Start Now!
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href={"/login"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Start Here
            </button>
          </Link>
          <Link href={"/about"}>
            <button
              type="button"
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white h-1 opacity-10"></div>
      <div className="text-white container mx-auto py-13 px-5 md:px-10 lg:px-20">
        <h2 className="text-3xl font-bold text-center pb-5 mb-4">Your fans can buy you a Chai</h2>
        <div className="flex flex-wrap gap-5 justify-center">
          <div className="item space-y-3 flex flex-col justify-center items-center text-center">
            <img className="bg-slate-400 rounded-full text-black p-2" width={88} src="/man.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p>Your fans are available to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center text-center">
            <img className="bg-slate-400 rounded-full text-black p-2" width={88} src="/coin.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p>Your fans are available to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center text-center">
            <img className="bg-slate-400 rounded-full text-black p-2" width={88} src="/group.gif" alt="" />
            <p className="font-bold">Fans want to help</p>
            <p>Your fans are available to help you</p>
          </div>
        </div>
      </div>
      <div className="bg-white h-1 opacity-10"></div>
      <div className="text-white container mx-auto py-13 flex flex-col items-center justify-center px-5 md:px-10 lg:px-20">
        <h2 className="text-3xl font-bold text-center pb-5 mb-4">Learn more about us</h2>
        <div>
          <iframe className="md:w-[560px] md:h-[315px]"
            src="https://www.youtube.com/embed/kPa7bsKwL-c?si=QrNuuYW-1hN4CbOv"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </>
  );
}
