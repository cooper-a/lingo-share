import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Navbar from "./navbar";
import CallNotification from "./callnotification";
import "../styles/meetfriends.css";
import { mergeObj } from "../utils/userutils";

export default function BlockedPeople() {
  const usersRef = ref(rtdb, "/users");
  const statusRef = ref(rtdb, "/status");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const [blockedObj, setBlockedObj] = useState([]);
  const [blockedByObj, setBlockedByObj] = useState([]);
  const { t } = useTranslation();

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
              } else {
                setFriendsObj({});
              }
              if (userValue.blocked) {
                setBlockedObj(userValue.blocked);
              } else {
                setBlockedObj({});
              }
              if (userValue.blockedBy) {
                setBlockedByObj(userValue.blockedBy);
              } else {
                setBlockedByObj({});
              }
            }
          }
        }
      }
    });
  };

  const handleClickUnblockFriend = async (e, targetID) => {
    e.preventDefault();
    if (targetID !== user.uid && targetID !== undefined) {
      let blockRef = ref(rtdb, `/users/${user.uid}/blocked/${targetID}`);
      set(blockRef, null)
        .then(() => {
          console.log("user blocked");
        })
        .catch((error) => {
          console.log(error);
        });
      navigate("/blockedpeople");
    }
  };

  useEffect(() => {
    getQuery(statusRef);
    getQuery(usersRef);
  }, [user.uid]);

  useEffect(() => {
    setMergedObj(
      mergeObj(
        statusObj,
        usersObj,
        friendsObj,
        blockedObj,
        blockedByObj,
        user.uid,
        false,
        true
      )
    );
  }, [statusObj, usersObj, friendsObj]);

  return (
    <div>
      <CallNotification />
      <Navbar currPage={"/blockedpeople"} />
      <Text fontSize="3xl">{t("Manage your blocklist")}</Text>
      <ChakraProvider>
        <div className="field-pg">
          <div className="card-display">
            {Object.entries(mergedObj).map(([key, value], i) => {
              return (
                <div key={i} className="card-item">
                  <Text> {value.userDisplayName} </Text>
                  <Text>Blocked reason: {value.blockedReason}</Text>
                  <Button onClick={(e) => handleClickUnblockFriend(e, key)}>
                    {t("Unblock User")}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
