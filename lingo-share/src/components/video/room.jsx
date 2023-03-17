import React, { useEffect, useState } from "react";
import { ChakraProvider, extendTheme, useToast } from "@chakra-ui/react";
import Participant from "./participant";
import Controls from "./controls";
import { useTranslation } from "react-i18next";
import { UserAuth } from "../../contexts/AuthContext";
import "../../styles/room.css";
import { rtdb } from "../../firebase";
import { ref, get, set, onValue } from "firebase/database";
import PromptSidebar from "./promptSidebar";
import Icon from "@adeira/icons";

export default function Room({ roomName, room, handleLogout, callID }) {
  const [participants, setParticipants] = useState([]);
  const [activePrompt, setActivePrompt] = useState("");
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [togglePrompt, setTogglePrompt] = useState(false);
  const toast = useToast();
  const activePromptRef = ref(
    rtdb,
    `/calls/${roomName}/${callID}/active_prompt`
  );
  const [preferredLanguage, setPreferredLanguage] = useState("en");
  const { user } = UserAuth();
  const targetUserRef = ref(rtdb, "users/" + user.uid);
  const { t, i18n } = useTranslation();
  const customTheme = extendTheme({
    components: {
      Alert: {
        variants: {
          // define own toast variant
          toast: {
            container: {
              color: "gray.50",
              bg: "#6B6C72",
              padding: "20px",
            },
          },
        },
      },
    },
  });

  const handleTranslate = (lang) => {
    console.log("translate");
    i18n.changeLanguage(lang);
    setPreferredLanguage(lang);
  };

  useEffect(() => {
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      setPreferredLanguage(snapshotVal.language);
    });
  }, []);

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
        // console.log("grabbing active prompt");
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          let dbPromptDict = snapshot.val();
          let dbPromptInLang = snapshot.val()[preferredLanguage];
          if (
            !Object.values(dbPromptDict).includes(activePrompt) &&
            dbPromptInLang !== undefined
          ) {
            setActivePrompt(dbPromptInLang);
          }
        }
      });
    }, 1000);

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
  }, [room, preferredLanguage, activePrompt]);

  const handleCallDisconnect = () => {
    const languageRef = ref(rtdb, `users/${user.uid}/language`);
    set(languageRef, preferredLanguage); // set the user's language in DB after leaving call
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

  useEffect(() => {
    if (activePrompt === "") return;
    toast.closeAll();
    toast({
      title: `${activePrompt}`,
      variant: "toast",
      isClosable: true,
      containerStyle: {
        marginBottom: "125px",
        fontFamily: "Atkinson Hyperlegible",
      },
      icon: <Icon name={"thread"} width={"25px"} height={"25px"} />,
    });
  }, [activePrompt, toast]);

  return (
    <ChakraProvider theme={customTheme}>
      <div className="room">
        {togglePrompt && (
          <PromptSidebar
            roomName={roomName}
            callID={callID}
            setActivePrompt={setActivePrompt}
            preferredLanguage={preferredLanguage}
          />
        )}
        <div className="local-participant">
          {room ? (
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
              isLocal={true}
              isVideoOn={toggleVideo}
            />
          ) : (
            <div></div>
          )}
        </div>
        <div className="remote-participants">{remoteParticipants}</div>
        <div className="controls">
          <Controls
            handleCallDisconnect={handleCallDisconnect}
            handleAudioToggle={handleAudioToggle}
            handleVideoToggle={handleVideoToggle}
            handlePromptToggle={handlePromptToggle}
            handleTranslate={handleTranslate}
            preferredLanguage={preferredLanguage}
            translator={t}
            isPromptToggled={togglePrompt}
            audio={toggleAudio}
            video={toggleVideo}
          />
        </div>
      </div>
    </ChakraProvider>
  );
}
