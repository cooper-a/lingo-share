import { ChakraProvider, Text, UnorderedList } from "@chakra-ui/react";
import { onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { rtdb } from "../firebase";
import "../styles/homepage.css";
import {
  generateCallStatusEntryAndNavigate,
  mergeObj,
} from "../utils/userutils";
import CallNotification from "./callnotification";
import CallCard from "./lingoshare-components/callcard";
import PrimaryButton from "./lingoshare-components/primarybutton";
import Navbar from "./navbar";

export default function CallFriend() {
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const [blockedObj, setBlockedObj] = useState([]);
  const [blockedByObj, setBlockedByObj] = useState([]);
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
                // Edge case: if user has a friend but they are blocked
                setHasNoFriends(false);
              } else {
                setFriendsObj({});
                setHasNoFriends(true);
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

  const handleClick = (event, callerID) => {
    event.currentTarget.disabled = true;
    generateCallStatusEntryAndNavigate(
      callerID,
      activeCallsRef,
      user,
      navigate
    );
  };

  const handleClickViewProfile = (targetID) => {
    navigate(`/profile/${targetID}`, { state: { prevPage: "/callfriend" } });
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
    setMergedObj(
      mergeObj(
        statusObj,
        usersObj,
        friendsObj,
        blockedObj,
        blockedByObj,
        {},
        user.uid,
        true
      )
    );
  }, [statusObj, usersObj]);

  return (
    <div>
      <ChakraProvider>
        <CallNotification />
        <Navbar topLeftDisplay={t("Call a Friend")} currPage={"/callfriend"} />
        <div className="page-title">
          {!hasNoFriends ? (
            <Text className="font" fontSize="3xl">
              {t("Who would you like to call?")}
            </Text>
          ) : (
            <div className="welcome-pg">
              <Text className="font" fontSize="3xl">
                {t("You don't have any LingoShare friends yet!")}
              </Text>
              <PrimaryButton
                text={t("Meet New Friends")}
                onClick={() => navigate("/meetnewfriends")}
                marginTop={"1.5rem"}
                size={"lg"}
              />
            </div>
          )}
        </div>
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
