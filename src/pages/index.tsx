import {
  SharedWebChannel,
  ChannelObserver,
  ActionType,
} from "@r_wohl/web-channel-message";
import Head from "next/head";
import { useEffect, useState } from "react";

const channel = new SharedWebChannel();
const anotherChannel = new SharedWebChannel("second-channel");

type BackgroundColor =
  | "bg-green-500"
  | "bg-red-500"
  | "bg-blue-500"
  | "bg-yellow-500";

function getInitialBackgroundColor() {
  const randomNumber = Math.floor(Math.random() * 3);

  switch (randomNumber) {
    case 0:
      return "bg-red-500";
    case 1:
      return "bg-blue-500";
    case 2:
      return "bg-yellow-500";
    // this should never happen
    default:
      return "bg-green-500";
  }
}

export default function Home() {
  const [bgColor, setBgColor] = useState<BackgroundColor>();
  const [messageMode, setMessageMode] = useState<ActionType>("all");
  const [instances, setInstances] = useState<number>();

  useEffect(() => {
    channel.registerCallback("set-bg-color", setBgColor);
    channel.onConnectionsUpdate(setInstances);
    setBgColor(getInitialBackgroundColor());

    setInstances(channel.connections);

    const observer1 = new ChannelObserver(anotherChannel, (message) => {
      const payload = message.payload as ActionType;
      if (payload) {
        setMessageMode(payload);
      }
    });

    return () => {
      anotherChannel.subject.unsubscribe(observer1);
    };
  }, []);

  function handleClickColor(color: BackgroundColor) {
    channel.sendMessage({
      type: "callback",
      action: messageMode,
      payload: color,
      callbackKey: "set-bg-color",
    });
  }

  function handleClickMode(type: ActionType) {
    anotherChannel.sendMessage({
      type: "observer",
      action: "all",
      payload: type,
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
        className={`flex min-h-screen flex-col items-center justify-center font-mono ${bgColor}`}
      >
        <div className="container flex max-w-[80%] flex-col items-center justify-center gap-6 py-8 md:max-w-[50%] ">
          <h1 className="font-mono text-4xl text-white">
            Web Channel Message demo{" "}
            <span className="text-black">x{instances}</span>
          </h1>
          <p>
            Navigate to this page in multiple browser tabs/windows and click any
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
              onClick={() => handleClickMode("all")}
            >
              All
            </button>
            <button
              className={`w-28 rounded-md bg-opacity-60 p-2 text-sm font-light uppercase ${
                messageMode === "broadcast"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => handleClickMode("broadcast")}
            >
              Broadcast
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              className={`w-28 rounded-md bg-opacity-60 p-2 text-sm font-light uppercase ${
                bgColor === "bg-green-500"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => handleClickColor("bg-green-500")}
            >
              Green
            </button>
            <button
              className={`w-28 rounded-md bg-opacity-60 p-2 text-sm font-light uppercase ${
                bgColor === "bg-red-500"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => handleClickColor("bg-red-500")}
            >
              Red
            </button>
            <button
              className={`w-28 rounded-md bg-opacity-60 p-2 text-sm font-light uppercase ${
                bgColor === "bg-blue-500"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => handleClickColor("bg-blue-500")}
            >
              Blue
            </button>
            <button
              className={`w-28 rounded-md bg-opacity-60 p-2 text-sm font-light uppercase ${
                bgColor === "bg-yellow-500"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => handleClickColor("bg-yellow-500")}
            >
              Yellow
            </button>
          </div>
          <footer className="justify center my-4 flex flex-col items-center gap-2">
            <div>
              Check out this demo's{" "}
              <span className="inline-block cursor-pointer text-black underline transition-colors duration-1000 hover:text-white">
                <a
                  href={"https://github.com/Rami-Wohl/shared-worker-lib-demo"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  source code
                </a>
              </span>{" "}
              on GitHub
            </div>
            <div>&copy; Rami Wohl {new Date().getFullYear()}</div>
          </footer>
        </div>
      </main>
    </>
  );
}
