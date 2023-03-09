import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Navbar from "./navbar";
import CallNotification from "./callNotification";
import ProfileCard from "./lingoshare-components/profilecard";
import "../styles/meetfriends.css";

export default function MeetNewFriends() {
  const usersRef = ref(rtdb, "/users");
  const statusRef = ref(rtdb, "/status");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
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
            }
          }
        }
      }
    });
  };

  const mergeObj = (statusList, userList) => {
    let res = [];
    let friendsDict = {};

    for (let [friendID, friendValue] of Object.entries(friendsObj)) {
      friendsDict[friendID] = friendValue;
    }

    // loop through each dictionary in userList
    for (let userDict of userList) {
      // loop through each key-value pair in the current dictionary
      for (let [userID, userValue] of Object.entries(userDict)) {
        // check if the current userID is in the statusList
        if (
          statusList.some((statusDict) => statusDict.hasOwnProperty(userID))
        ) {
          // if it is, find the corresponding status dictionary in the statusList
          let statusDict = statusList.find((statusDict) =>
            statusDict.hasOwnProperty(userID)
          );

          // merge the two dictionaries into a new object
          let mergedDict = { ...userValue, ...statusDict[userID] };

          // add the merged dictionary to the result object with the userID as the key
          if (friendsDict.hasOwnProperty(userID)) {
            mergedDict = { ...mergedDict, isFriend: true };
          } else {
            mergedDict = { ...mergedDict, isFriend: false };
          }
          res[userID] = mergedDict;
        } else {
          if (friendsDict.hasOwnProperty(userID)) {
            userValue = { ...userValue, isFriend: true };
          } else {
            userValue = { ...userValue, isFriend: false };
          }
          // if the userID isn't in the statusList, just add the userValue to the result object with the userID as the key
          res[userID] = userValue;
        }
      }
    }
    delete res[user.uid];

    return res;
  };

  const handleClickManageFriend = async (e, targetID, add) => {
    e.preventDefault();
    if (targetID !== user.uid && targetID !== undefined) {
      let friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
      if (add) {
        set(friendRef, true)
          .then(() => {
            console.log("friend added");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        set(friendRef, null)
          .then(() => {
            console.log("friend removed");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      navigate("/meetnewfriends");
    }
  };

  const handleClickViewProfile = (targetID) => {
    navigate(`/profile/${targetID}`);
  };

  useEffect(() => {
    getQuery(statusRef);
    getQuery(usersRef);
  }, []);

  useEffect(() => {
    setMergedObj(mergeObj(statusObj, usersObj));
  }, [statusObj, usersObj, friendsObj]);

  return (
    <div>
      <CallNotification />
      <Navbar currPage={"/meetnewfriends"} />
      <Text fontSize="3xl">{t("These people are also using LingoShare")}</Text>
      <ChakraProvider>
        <div className="field-pg">
          <div className="card-display">
            {Object.entries(mergedObj).map(([key, value], i) => {
              return (
                <div key={i} className="card-item">
                  <ProfileCard
                    name={value.userDisplayName}
                    userId={key}
                    isFriend={value.isFriend}
                    handleClickViewProfile={handleClickViewProfile}
                    handleClickManageFriend={handleClickManageFriend}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
