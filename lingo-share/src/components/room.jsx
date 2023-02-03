import React, { useEffect, useState } from "react";
import Participant from "./participant";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Here we define what happens when a remote participant joins
    const participantConnected = (participant) => {
      console.log("HERE");
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        participant,
      ]);
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
    console.log(room.participants)
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  // filter out any participants that are repeated
  const uniqueParticipants = participants.filter((p, index) => {
    return participants.indexOf(p) === index;
  });
  const remoteParticipants = uniqueParticipants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      {/* {console.log(room.participants)} */}
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;
