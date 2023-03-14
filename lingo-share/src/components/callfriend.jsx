import React, { useState, useEffect } from "react";
import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import { UserAuth } from "../contexts/AuthContext";
import {
  ref,
  onValue,
  push,
  get,
  set,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "../firebase";
import Navbar from "./navbar";
import { UnorderedList } from "@chakra-ui/react";
import CallNotification from "./callnotification";
import CallCard from "./lingoshare-components/callcard";
import { useTranslation } from "react-i18next";
import { mergeObj } from "../utils/userutils";

export default function CallFriend() {
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const [hasNoFriends, setHasNoFriends] = useState(true);
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const statusRef = ref(rtdb, "/status");
  const usersRef = ref(rtdb, "/users");
  const activeCallsRef = ref(rtdb, "/active_calls");

  const getQuery = (ref) => {
    onValue(ref, (snapshot) => {
      let newObjectList = [];
      snapshot.forEach((childSnapshot) => {
        let newObject = {};
        newObject[childSnapshot.key] = childSnapshot.val();
        newObjectList.push(newObject);
      });
      if (ref === statusRef) {
        setStatusObj(newObjectList);
      }
      if (ref === usersRef) {
        setUsersObj(newObjectList);
        // extract friends list from usersObj
        for (let userDict of newObjectList) {
          for (let [userID, userValue] of Object.entries(userDict)) {
            if (userID === user.uid) {
              if (userValue.friends) {
                setFriendsObj(userValue.friends);
                setHasNoFriends(false);
              } else {
                setFriendsObj({});
                setHasNoFriends(true);
              }
            }
          }
        }
      }
    });
  };

  const generateRoomName = (uid, callerID) => {
    let roomNameInList = [uid, callerID];
    return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
  };

  async function generateCallStatusEntryAndNavigate(callerID) {
    var startTime = performance.now();
    get(activeCallsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let callExists = false;
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.val().caller === user.uid ||
              childSnapshot.val().callee === callerID
            ) {
              callExists = true;
            }
          });
          if (!callExists) {
            const pushData = {
              caller: user.uid, // the user who initiated the call will always be caller
              callee: callerID, // the user who is being called will always be callee
            };
            const currActiveCallsRef = push(activeCallsRef, pushData);
            const callID = currActiveCallsRef.key;
            const roomName = generateRoomName(user.uid, callerID);
            const callIDRef = ref(rtdb, `/calls/${roomName}/${callID}`);
            set(callIDRef, {
              caller: user.uid,
              callee: callerID,
              active_prompt: "none",
              prompt_history: [],
              created_at: serverTimestamp(),
            });
            var endTime = performance.now();
            console.log(
              "Time taken to generate call status entry and navigate: " +
                (endTime - startTime) +
                " milliseconds."
            );
            navigate("/callroom", {
              state: {
                callID: callID,
                roomName: roomName,
              },
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleClick = (event, callerID) => {
    console.log("hi");
    event.currentTarget.disabled = true;
    generateCallStatusEntryAndNavigate(callerID);
  };

  const handleClickViewProfile = (targetID) => {
    navigate(`/profile/${targetID}`);
  };

  const disableButton = (key, state) => {
    if (state === "offline" || typeof state === "undefined") {
      return true;
    } else if (key === user.uid) {
      return true; // if it's the current user, disable the button
    }
    return false;
  };

  useEffect(() => {
    getQuery(statusRef);
    getQuery(usersRef);
  }, [user.uid]);

  useEffect(() => {
    setMergedObj(mergeObj(statusObj, usersObj, friendsObj, user.uid, true));
  }, [statusObj, usersObj]);

  return (
    <div>
      <CallNotification />
      <Navbar topLeftDisplay={t("Call a Friend")} currPage={"/callfriend"} />
      {!hasNoFriends ? (
        <Text className="font" fontSize="3xl">
          {t("Who would you like to call?")}
        </Text>
      ) : (
        <div className="welcome-pg">
          <Text className="font" fontSize="3xl">
            {t("You don’t have any LingoShare friends yet!")}
          </Text>
          <Button
            marginTop={"1.5rem"}
            size={"lg"}
            variant={"outline"}
            onClick={() => navigate("/meetnewfriends")}
          >
            {t("Meet New Friends")}
          </Button>
        </div>
      )}

      <ChakraProvider>
        <div className="field-pg">
          <UnorderedList spacing={5}>
            {Object.entries(mergedObj).map(([key, value], i) => {
              return (
                <div key={i}>
                  <CallCard
                    userId={key}
                    onlineStatus={value.state}
                    displayName={value.userDisplayName}
                    profileURL={value.profilePic}
                    userType={value.userType}
                    disableButton={disableButton}
                    handleCallClick={handleClick}
                    handleViewProfile={handleClickViewProfile}
                  />
                </div>
              );
            })}
          </UnorderedList>
        </div>
      </ChakraProvider>
    </div>
  );
}
