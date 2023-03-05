import React, { useEffect, useState } from "react";
import Participant from "./participant";
import Prompt from "./prompt";
import Controls from "./controls";
import "../../styles/room.css";
import { rtdb } from "../../firebase";
import { ref, get, set, onValue } from "firebase/database";

const Room = ({ roomName, room, handleLogout, callID }) => {
  const [participants, setParticipants] = useState([]);
  const [activePrompt, setActivePrompt] = useState("");
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [togglePrompt, setTogglePrompt] = useState(false);
  const activePromptRef = ref(
    rtdb,
    `/calls/${roomName}/${callID}/active_prompt`
  );

  useEffect(() => {
    // Here we define what happens when a remote participant joins
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    // This is what happens when a remote participant leaves
    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);

    // This is what happens when you join the room
    // It will trigger the participantConnected function for each participant
    // This is being called twice for some reason
    // console.log(room.participants);
    room.participants.forEach(participantConnected);

    const interval = setInterval(() => {
      get(activePromptRef).then((snapshot) => {
        console.log("grabbing active prompt");
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const dbPrompt = snapshot.val();
          if (dbPrompt !== activePrompt && dbPrompt !== "none") {
            setActivePrompt(dbPrompt);
            setTogglePrompt(true);
          }
        }
      });
    }, 2500);

    // onValue(activePromptRef, (snapshot) => {
    //   const data = snapshot.val();
    //   console.log(data);
    //   console.log("change detected");
    // });

    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
      clearInterval(interval);
    };
  }, [room]);

  const handleCallDisconnect = () => {
    room.disconnect();
    handleLogout();
  };

  const handlePromptToggle = () => {
    setTogglePrompt(!togglePrompt);
  };

  const handleAudioToggle = () => {
    room.localParticipant.audioTracks.forEach((track) => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleAudio(track.track.isEnabled);
    });
  };

  const handleVideoToggle = () => {
    room.localParticipant.videoTracks.forEach((track) => {
      if (track.track.isEnabled) {
        track.track.disable();
      } else {
        track.track.enable();
      }
      setToggleVideo(track.track.isEnabled);
    });
  };

  // filter out any participants that are repeated
  const uniqueParticipants = participants.filter((p, index) => {
    return participants.indexOf(p) === index;
  });
  const remoteParticipants = uniqueParticipants.map((participant) => (
    <Participant
      key={participant.sid}
      participant={participant}
      isLocal={false}
    />
  ));

  return (
    <div className="room">
      {/* <h2>Room: {roomName}</h2> */}
      {togglePrompt && <Prompt roomName={roomName} callID={callID} />}
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            isLocal={true}
            isVideoOn={toggleVideo}
          />
        ) : (
          ""
        )}
      </div>
      <div className="remote-participants">{remoteParticipants}</div>
      <div className="controls">
        <Controls
          handleCallDisconnect={handleCallDisconnect}
          handleAudioToggle={handleAudioToggle}
          handleVideoToggle={handleVideoToggle}
          handlePromptToggle={handlePromptToggle}
          isPromptToggled={togglePrompt}
          audio={toggleAudio}
          video={toggleVideo}
        />
      </div>
    </div>
  );
};

export default Room;
