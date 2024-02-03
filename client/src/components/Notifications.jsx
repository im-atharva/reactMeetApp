import React, { useContext } from "react";

import { SocketContext } from "../Context";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  console.log("caller name: ", call.name);
  return (
    <div>
      {call.isReceivingCall && !callAccepted && (
        <div className="flex justify-around">
          <h1 className="text-xl">{call.name} is calling:</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={answerCall}
          >
            Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
