import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  extendTheme,
  useToast,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Participant from "./participant";
import Controls from "./controls";
import { useTranslation } from "react-i18next";
import { UserAuth } from "../../contexts/AuthContext";
import "../../styles/room.css";
import { rtdb } from "../../firebase";
import { ref, get, set, onValue } from "firebase/database";
import PromptSidebar from "./promptSidebar";
import LeaveConfirmModal from "./leaveconfirmmodal";
import Icon from "@adeira/icons";

export default function Room({ roomName, room, handleLogout, callID }) {
  const [participants, setParticipants] = useState([]);
  const [activePrompt, setActivePrompt] = useState("");
  const [localActivePrompt, setLocalActivePrompt] = useState("");
  const [toggleAudio, setToggleAudio] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(true);
  const [togglePrompt, setTogglePrompt] = useState(false);
  const [toggleLeaveModal, setToggleLeaveModal] = useState(false);
  const toast = useToast();
  const toastIdRef = React.useRef();
  const { isOpen, onToggle, onClose } = useDisclosure(); // for the popover over Topics button
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
              color: "white",
              bg: "#363636",
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

  const toggleOpenPopover = async () => {
    await timeout(5000);
    onToggle();
  };

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  useEffect(() => {
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      setPreferredLanguage(snapshotVal.language);
    });
    toggleOpenPopover();
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
          let dbPromptObj = snapshot.val();
          // let dbPromptInLang = snapshot.val()[preferredLanguage];
          if (
            dbPromptObj !== undefined &&
            activePrompt[preferredLanguage] !== dbPromptObj[preferredLanguage]
          ) {
            setActivePrompt(dbPromptObj);
          }
        }
      });
    }, 1000);

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

  const handleLeaveToggle = () => {
    setToggleLeaveModal(!toggleLeaveModal);
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
    if (localActivePrompt === "" || localActivePrompt === undefined) return;
    // when our active prompt changes, we want to display a toast
    toast.closeAll();

    let toastDesc = <></>;
    if (preferredLanguage === "en")
      toastDesc = (
        <div>
          <Text paddingLeft={"10px"} fontSize={"lg"} marginBottom={"5px"}>
            {localActivePrompt.zh}
          </Text>{" "}
          <Text paddingLeft={"10px"} fontSize={"lg"}>
            {localActivePrompt["zh-pinyin"]}
          </Text>
        </div>
      );
    if (preferredLanguage === "zh")
      toastDesc = (
        <Text paddingLeft={"10px"} fontSize={"lg"}>
          {localActivePrompt["zh-pinyin"]}
        </Text>
      );

    toastIdRef.current = toast({
      title: (
        <Text paddingLeft={"10px"} fontSize={"lg"} marginBottom={"5px"}>
          {localActivePrompt[preferredLanguage]}
        </Text>
      ),
      description: toastDesc,
      variant: "toast",
      isClosable: true,
      containerStyle: {
        maxW: "1000px",
        display: "flex",
        flexDirection: "column",
        marginBottom: "15vh",
        fontFamily: "Atkinson Hyperlegible",
      },
      duration: null,
      icon: (
        <div className="prompt-icon">
          <Icon name={"thread"} width={"25px"} height={"25px"} />
        </div>
      ),
    });
  }, [localActivePrompt, toast]);

  useEffect(() => {
    // when our preferred language changes, we want to change the language of the toast but only if it exists
    if (toast.isActive(toastIdRef.current)) {
      if (preferredLanguage === "en") {
        // for english we want to display english, chinese, and pinyin
        setLocalActivePrompt(activePrompt);
      }
      if (preferredLanguage === "zh") {
        // for chinese we want to display chinese, and pinyin
        setLocalActivePrompt({
          zh: activePrompt.zh,
          "zh-pinyin": activePrompt["zh-pinyin"],
        });
      }
    }
  }, [preferredLanguage]);

  useEffect(() => {
    // when our active prompt changes we always want to update the local active prompt
    setLocalActivePrompt(activePrompt);
  }, [activePrompt]);

  return (
    <ChakraProvider theme={customTheme}>
      <div className="room">
        {togglePrompt && (
          <PromptSidebar
            roomName={roomName}
            callID={callID}
            setActivePrompt={setActivePrompt}
            preferredLanguage={preferredLanguage}
            handlePromptToggle={handlePromptToggle}
          />
        )}
        {toggleLeaveModal && (
          <LeaveConfirmModal
            handleLeaveToggle={handleLeaveToggle}
            handleCallDisconnect={handleCallDisconnect}
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
        {remoteParticipants.length > 0 ? (
          <div className="remote-participants">{remoteParticipants}</div>
        ) : (
          <div className="waiting-div">
            <Text color={"white"} fontSize={"2xl"}>
              {t("Waiting for other user...")}
            </Text>
          </div>
        )}
        <div className="controls">
          <Controls
            handleCallDisconnect={handleCallDisconnect}
            handleAudioToggle={handleAudioToggle}
            handleVideoToggle={handleVideoToggle}
            handlePromptToggle={handlePromptToggle}
            handleLeaveToggle={handleLeaveToggle}
            handleTranslate={handleTranslate}
            isOpen={isOpen}
            onClose={onClose}
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
