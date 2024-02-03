import "./App.css";
import React from "react";
import VideoPlayer from "./components/VideoPlayer.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Notifications from "./components/Notifications.jsx";

const App = () => {
  return (
    <div>
      <h1 className="text-white font-bold text-3xl text-center">Meeting App</h1>

      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default App;
