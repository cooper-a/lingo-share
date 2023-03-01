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
  const callRef = ref(rtdb, "/calls");
  const usersRef = ref(rtdb, "/users");

  const handleClick = (event, callerID) => {
    event.currentTarget.disabled = true;
    navigate("/callRoom", { state: { callerID: callerID } });
  };

  const getUserDisplayName = (callerID) => {
    get(usersRef)
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.key === callerID &&
            typeof childSnapshot.val().userDisplayName !== "undefined"
          ) {
            // console.log(childSnapshot.val().userDisplayName);
            return childSnapshot.val().userDisplayName;
          }
          // console.log(callerID);
          return callerID;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    onValue(callRef, (snapshot) => {
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
  }, []);

  let render;
  if (isCallee) {
    render = (
      <div>
        <h1>{callerID} is calling you!</h1>
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
