import React, { useState, useCallback, useEffect } from "react";
import { get_token } from "../../firebase";
import { UserAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue, get, child, remove } from "firebase/database";
import { rtdb } from "../../firebase";
import Video from "twilio-video";
import Lobby from "./lobby";
import Room from "./room";

export default function VideoChat() {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { callerID } = state;
  const callRef = ref(rtdb, "/calls");

  const removeCallStatusEntry = () => {
    get(callRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.exists()) {
          if (
            childSnapshot.val().callee === user.uid ||
            childSnapshot.val().caller === user.uid
          ) {
            remove(childSnapshot.ref);
          }
        }
      });
    });
  };

  const handleLogout = useCallback(() => {
    removeCallStatusEntry();
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
    let roomNameInList = [uid, callerID];
    return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
  };

  useEffect(() => {
    let concatRoomName = getRoomName(user.uid, callerID);
    setRoomName(concatRoomName);
    const handleSubmit = async () => {
      // preventDefault();
      setConnecting(true);
      let identityName = !user.displayName ? user.uid : user.displayName;
      const result = await get_token({
        identity: identityName,
        room: concatRoomName,
      });
      const data = result.data;
      console.log(data.token);
      Video.connect(data.token, {
        name: concatRoomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
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

  return (
    <div>
      {room ? (
        <Room roomName={roomName} room={room} handleLogout={handleLogout} />
      ) : (
        <></>
      )}
    </div>
  );
}
