import React, { useState, useContext } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { SocketContext } from "../Context";

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <div className="mt-8 p-4 flex flex-col  bg-slate-100 align-center">
      <div className="border-2  p-4 flex flex-row space-x-40 justify-center">
        <div className="mb-4 w-1/2 mx-10">
          <h6 className="text-lg font-bold">Account Info</h6>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border p-2 w-full"
          />
          <CopyToClipboard text={me}>
            <button className="bg-blue-700 text-white p-2 mt-2 w-full">
              Copy Your ID
            </button>
          </CopyToClipboard>
        </div>

        <div className="w-1/2 mx-10">
          <h6 className="text-lg font-bold">Make a Call</h6>
          <input
            type="text"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
            placeholder="ID to call"
            className="border p-2 w-full"
          />
          {callAccepted && !callEnded ? (
            <button
              onClick={leaveCall}
              className="bg-red-600 text-white p-2 mt-2 w-full"
            >
              Hang Up
            </button>
          ) : (
            <button
              onClick={() => callUser(idToCall)}
              className="bg-green-600 text-white p-2 mt-2 w-full"
            >
              Call
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
