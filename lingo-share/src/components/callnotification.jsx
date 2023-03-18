import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, get, remove } from "firebase/database";
import { rtdb } from "../firebase";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SecondaryButton from "./lingoshare-components/secondarybutton";
import PrimaryButton from "./lingoshare-components/primarybutton";
import "../styles/font.css";

const CallNotificationModal = ({
  isOpen,
  handleAccept,
  handleIgnore,
  onClose,
  callerName,
  callerID,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal onClose={onClose} size={"sm"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent borderRadius={"2xl"} bgColor={"#363636"} color={"white"}>
          <ModalHeader
            marginTop={"0.25rem"}
            className="font"
            alignSelf={"center"}
          >
            <Text className="font-bold" fontSize={"2xl"}>
              {callerName}
            </Text>
            <Text textAlign={"center"} fontSize={"md"}>
              {t(" is calling you")}
            </Text>
          </ModalHeader>
          <ModalFooter
            gap={"20px"}
            marginBottom={"0.5rem"}
            alignSelf={"center"}
          >
            <SecondaryButton
              onClick={(event) => handleAccept(event, callerID)}
              direction="row"
              align="center"
              text={t("Answer")}
              width={"150px"}
              height={"45px"}
            />
            <PrimaryButton
              onClick={(event) => handleIgnore(event, callerID)}
              direction="row"
              align="center"
              variant="outline"
              text={t("Ignore")}
              outlineColor={"white"}
              borderWidth={"2px"}
              width={"150px"}
              height={"45px"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default function CallNotification() {
  const [callerID, setCallerID] = useState("");
  const [callID, setCallID] = useState(""); // callID is the key of the active call in the database
  const [isCallee, setisCallee] = useState(false);
  const [callerDisplayName, setCallerDisplayName] = useState("");
  const { user } = UserAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const activeCallsRef = ref(rtdb, "/active_calls");
  const usersRef = ref(rtdb, "/users");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const generateRoomName = (uid, callerID) => {
    let roomNameInList = [uid, callerID];
    return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
  };

  const handleAccept = (event, callerID) => {
    event.currentTarget.disabled = true;
    let roomName = generateRoomName(user.uid, callerID);
    navigate("/callroom", { state: { callID: callID, roomName: roomName } });
  };

  const handleIgnore = (event, callerID) => {
    event.currentTarget.disabled = true;
    get(activeCallsRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.key !== "dummyObject" &&
            childSnapshot.val().callee === user.uid &&
            childSnapshot.val().caller === callerID
          ) {
            remove(childSnapshot.ref);
          }
        });
      }
    });
    onClose();
  };

  useEffect(() => {
    // TODO: We should stop the interval when we render the notification
    const interval = setInterval(() => {
      get(activeCallsRef).then((snapshot) => {
        setisCallee(false);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.val().callee === user.uid &&
              childSnapshot.key !== "dummyObject"
            ) {
              console.log(childSnapshot.key);
              setisCallee(true);
              setCallerID(childSnapshot.val().caller);
              setCallID(childSnapshot.key);
            }
          });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getUserDisplayName = async (callerID) => {
      await get(usersRef)
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.key === callerID &&
              childSnapshot.val().userDisplayName !== undefined
            ) {
              setCallerDisplayName(childSnapshot.val().userDisplayName);
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserDisplayName(callerID).catch((error) => {
      console.log(error);
    });
  }, [callerID]);

  return (
    isCallee && (
      <div>
        <CallNotificationModal
          isOpen={isCallee}
          callerName={callerDisplayName === "" ? callerID : callerDisplayName}
          onClose={onClose}
          callerID={callerID}
          handleAccept={handleAccept}
          handleIgnore={handleIgnore}
        />
      </div>
    )
  );
}
