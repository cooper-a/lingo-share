import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, remove } from "firebase/database";
import { rtdb } from "../firebase";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  let render;
  if (isCallee) {
    render = (
      <div>
        <h1>
          {callerDisplayName === "" ? callerID : callerDisplayName}
          {t(" is calling you")}
        </h1>
        <Button
          onClick={(event) => handleAccept(event, callerID)}
          direction="row"
          align="center"
          variant="outline"
        >
          {t("Accept")}
        </Button>
        <Button
          onClick={(event) => handleIgnore(event, callerID)}
          direction="row"
          align="center"
          variant="outline"
        >
          {t("Ignore")}
        </Button>
      </div>
    );
  }
  return render;
}
