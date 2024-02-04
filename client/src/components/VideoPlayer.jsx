import React, { useContext, useEffect } from "react";
import { SocketContext } from "../Context.jsx";

const VideoPlayer = () => {
  const {
    call,
    callAccepted,
    callEnded,
    myVideo,
    userVideo,
    stream,
    name,
    isStreaming,
  } = useContext(SocketContext);

  useEffect(() => {
    if (isStreaming && myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [isStreaming, stream, myVideo]);
  useEffect(() => {
    if (callAccepted && !callEnded && userVideo.current && call?.stream) {
      userVideo.current.srcObject = call.stream;
    }
  }, [callAccepted, callEnded, userVideo, call?.stream]);

  return (
    <div className="flex justify-center flex-col">
      {stream && (
        <div className="p-10 border-white border-2 m-10">
          <h5 className="text-xl text-white font-bold mb-4">
            {name || "Name"}
          </h5>
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            className="max-w-[550px]"
          />
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="p-10 border-black border-2 m-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="text-xl font-bold mb-4">{call?.name || "Name"}</h2>
            <video
              playsInline
              muted
              ref={userVideo}
              autoPlay
              className="max-w-[550px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
