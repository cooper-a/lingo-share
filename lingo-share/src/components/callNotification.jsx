import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get } from "firebase/database";
import { rtdb } from "../firebase";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function CallNotification() {
  const [callerID, setCallerID] = useState("");
  const [isCallee, setisCallee] = useState(false);
  const [callerDisplayName, setCallerDisplayName] = useState("");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const activeCallsRef = ref(rtdb, "/active_calls");
  const usersRef = ref(rtdb, "/users");

  const generateRoomName = (uid, callerID) => {
    let roomNameInList = [uid, callerID];
    return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
  };

  const handleClick = (event, callerID) => {
    event.currentTarget.disabled = true;
    let roomName = generateRoomName(user.uid, callerID);
    navigate("/callroom", { state: { roomName: roomName } });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      get(activeCallsRef).then((snapshot) => {
        setisCallee(false);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.val().callee === user.uid &&
              childSnapshot.key !== "dummyObject"
            ) {
              setisCallee(true);
              setCallerID(childSnapshot.val().caller);
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
          {callerDisplayName === "" ? callerID : callerDisplayName} is calling
          you
        </h1>
        <Button
          onClick={(event) => handleClick(event, callerID)}
          direction="row"
          align="center"
          variant="outline"
        >
          Accept
        </Button>
      </div>
    );
  }
  return render;
}
