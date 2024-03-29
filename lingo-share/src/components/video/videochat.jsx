import { child, ref, remove } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Video from "twilio-video";
import { UserAuth } from "../../contexts/AuthContext";
import { get_token, rtdb } from "../../firebase";
import Room from "./room";

export default function VideoChat() {
  const [userName, setUserName] = useState("");
  // const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { callID, roomName } = state;
  const activeCallsRef = ref(rtdb, "/active_calls");

  const removeCallStatusEntry = () => {
    remove(child(activeCallsRef, callID));
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

    // TODO add a feedback screen here
    navigate("/callfeedback", {
      state: { roomName: roomName, callID: callID },
    });
  }, []);

  // const getRoomName = (uid, callerID) => {
  //   let roomNameInList = [uid, callerID];
  //   return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
  // };

  useEffect(() => {
    // let concatRoomName = getRoomName(user.uid, callerID);
    // setRoomName(concatRoomName);
    const handleSubmit = async () => {
      // preventDefault();
      setConnecting(true);
      let identityName = !user.displayName ? user.uid : user.displayName;
      const result = await get_token({
        identity: identityName,
        room: roomName,
      });
      const data = result.data;
      Video.connect(data.token, {
        name: roomName,
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

    // on value check the prompts list for the specific callID
  }, [roomName, user.displayName, user.uid]);

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
        <Room
          roomName={roomName}
          room={room}
          handleLogout={handleLogout}
          callID={callID}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
