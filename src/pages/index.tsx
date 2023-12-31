import SharedWebChannel from "@r_wohl/web-channel-message";
import Head from "next/head";
import { useEffect, useState } from "react";

const channel = new SharedWebChannel();

type BackgroundColor =
  | "bg-green-500"
  | "bg-red-500"
  | "bg-blue-500"
  | "bg-yellow-500";

export default function Home() {
  const [bgColor, setBgColor] = useState<BackgroundColor>("bg-green-500");
  const [messageMode, setMessageMode] = useState<"all" | "broadcast">("all");
  const [instances, setInstances] = useState<number>(1);

  useEffect(() => {
    channel.registerCallback("set-bg-color", setBgColor);
  }, []);

  function handleClick(color: BackgroundColor) {
    channel.sendMessage({
      type: messageMode,
      payload: color,
      callbackKey: "set-bg-color",
    });
  }

  return (
    <>
      <Head>
        <title>Web Channel Message Demo</title>
        <meta
          name="description"
          content="A demo site for the web-channel-message library"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center font-mono ${bgColor}`}
      >
        <div className="container flex max-w-[80%] flex-col items-center justify-center gap-10 py-8 md:max-w-[50%] ">
          <h1 className="font-mono text-4xl text-white">
            Web Channel Message demo{" "}
            <span className="text-black">x{instances}</span>
          </h1>
          <p>
            Navigate to this page in multiple browser tabs/windows and click the
            button to see the{" "}
            <span className="inline-block cursor-pointer text-black underline transition-colors duration-1000 hover:text-white">
              <a
                href={
                  "https://www.npmjs.com/package/@r_wohl/web-channel-message"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                web-channel-message library
              </a>
            </span>{" "}
            in action. Select 'broadcast' mode to only trigger a function in all
            other instances of the application, or 'all' mode to trigger in
            every instance.
          </p>
          <div className="my-4 flex flex-row gap-4">
            <button
              className={`w-28 rounded-md  bg-opacity-60 p-2 text-sm font-light uppercase ${
                messageMode === "all"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => setMessageMode("all")}
            >
              All
            </button>
            <button
              className={`w-28 rounded-md bg-opacity-60 p-2 text-sm font-light uppercase ${
                messageMode === "broadcast"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => setMessageMode("broadcast")}
            >
              Broadcast
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-28 rounded-md bg-black bg-opacity-60 p-2 text-sm font-light uppercase text-white"
              onClick={() => handleClick("bg-green-500")}
            >
              Green
            </button>
            <button
              className="w-28 rounded-md bg-black bg-opacity-60 p-2 text-sm font-light uppercase text-white"
              onClick={() => handleClick("bg-red-500")}
            >
              Red
            </button>
            <button
              className="w-28 rounded-md bg-black bg-opacity-60 p-2 text-sm font-light uppercase text-white"
              onClick={() => handleClick("bg-blue-500")}
            >
              Blue
            </button>
            <button
              className="w-28 rounded-md bg-black bg-opacity-60 p-2 text-sm font-light uppercase text-white"
              onClick={() => handleClick("bg-yellow-500")}
            >
              Yellow
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
