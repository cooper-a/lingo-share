import React, { useCallback } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { get_token } from "../firebase";
import { Button } from "@chakra-ui/react";
import Lobby from "./lobby";
import Room from "./room";

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [token, setToken] = useState(null);

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomChange = useCallback((event) => {
    setRoom(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const result = await get_token({ room: room });
      const data = result.data;
      setToken(data.token);
      console.log(data.token);
    },
    [room]
  );

  const handleLeave = useCallback(async (event) => {
    setToken(null);
  }, []);

  let render;
  if (token) {
    render = (
      <div>
        <Room roomName={room} token={token} handleLeave={handleLeave} />
      </div>
    );
  } else {
    render = (
      <div>
        <h1>VideoChat</h1>
        <Lobby
          username={username}
          room={room}
          handleUsernameChange={handleUsernameChange}
          handleRoomChange={handleRoomChange}
          handleSubmit={handleSubmit}
        />
      </div>
    );
  }

  return render;
};

export default VideoChat;
