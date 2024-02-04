import React, { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("http://localhost:5000");

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  // const [call, setCall] = useState({});
  // const [call, setCall] = useState({ isReceivingCall: false });
  const [call, setCall] = useState({
    isReceivingCall: false,
    from: "",
    name: "",
    signal: null,
  });

  const [me, setMe] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    console.log("mounted");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        setIsStreaming(true);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on("me", (id) => setMe(id)); // Listen for "me" event to set the user's ID

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      // Listen for "callUser" event to receive a call from another user
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    // Ensure 'call.signal' is defined before calling 'peer.signal'
    if (call.signal) {
      peer.signal(call.signal);
    }

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    // Check if the stream is available before creating a new Peer instance
    if (!stream) {
      console.error("Stream is not available");
      return;
    }

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // const callUser = (id) => {
  //   const peer = new Peer({ initiator: true, trickle: false, stream });

  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", {
  //       userToCall: id,
  //       signalData: data,
  //       from: me,
  //       name,
  //     });
  //   });

  //   // Listen for "callAccepted" event
  //   socket.once("callAccepted", (signal) => {
  //     setCallAccepted(true);

  //     // Ensure 'peer' is defined before calling 'peer.signal'
  //     if (peer) {
  //       peer.signal(signal);
  //     }
  //   });

  //   // Set the 'call' state before listening for 'stream' event
  //   setCall((prevCall) => ({
  //     ...prevCall,
  //     isReceivingCall: false, // Assuming you want to set this to false when initiating a call
  //   }));

  //   peer.on("stream", (currentStream) => {
  //     if (userVideo.current) {
  //       userVideo.current.srcObject = currentStream;
  //     }
  //   });

  //   connectionRef.current = peer;
  // };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        isStreaming,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
