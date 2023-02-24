import React, { useState, useCallback, useEffect } from "react";
import { get_token } from "../../firebase";
import { UserAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Video from "twilio-video";
import Lobby from "./lobby";
import Room from "./room";

const VideoChat = ({callerID}) => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
    navigate("/dashboard");
  }, []);

  const getRoomName = (uid, callerID) => {
    const concatenatedRoomName = uid + callerID;
    return concatenatedRoomName.split('').sort().join(''); // room name will be the concatenation of the two user IDs sorted alphabetically
  }

  
  useEffect(() => {
    setUsername(user.uid);
    setRoomName(getRoomName(user.uid+callerID));
    const handleSubmit = async () => {
      setConnecting(true);
      const result = await get_token({ identity: user.uid, room: roomName }); // idk why username is still null at this line so I replaced with user.uid
      const data = result.data;
      console.log(data.token);
      Video.connect(data.token, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    };
    handleSubmit().catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room roomName={roomName} room={room} handleLogout={handleLogout} />
    );
  }
  return render;
};

export default VideoChat;
