import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set, remove, child } from "firebase/database";
import { rtdb } from "../firebase";
import { useNavigate } from "react-router-dom";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Navbar from "./navbar";
import CallNotification from "./callnotification";
import FriendRequest from "./friendrequest";
import ProfileCard from "./lingoshare-components/profilecard";
import "../styles/meetfriends.css";
import { mergeObj } from "../utils/userutils";

export default function MeetNewFriends() {
  const usersRef = ref(rtdb, "/users");
  const statusRef = ref(rtdb, "/status");
  const friendRequestsRef = ref(rtdb, "/friend_requests");
  const acceptedFriendRequestsRef = ref(rtdb, "/accepted_friend_requests");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [friendRequestsObj, setFriendRequestsObj] = useState([]);
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
      if (ref === friendRequestsRef) {
        setFriendRequestsObj(newObjectList);
      }
      if (ref === acceptedFriendRequestsRef) {
        handleAcceptedFriendRequest(newObjectList);
      }
    });
  };

  const handleAcceptedFriendRequest = (acceptedFriendRequestsObj) => {
    let targetIDs = [];
    // add user to friend list if they have already sent a friend request
    Object.values(acceptedFriendRequestsObj).forEach((obj) => {
      for (let [senderID, receiverIDObj] of Object.entries(obj)) {
        if (senderID === user.uid) {
          Object.keys(receiverIDObj).forEach((receiverID) => {
            targetIDs.push(receiverID);
            let friendRef = ref(
              rtdb,
              `/users/${user.uid}/friends/${receiverID}`
            );
            set(friendRef, true)
              .then(() => {
                console.log("friend added");
              })
              .catch((error) => {
                console.log(error);
              });
            navigate("/meetnewfriends"); // workaround
          });
        }
      }
    });

    // remove the entries from /accepted_friend_requests obj
    Object.values(targetIDs).forEach((targetID) => {
      get(acceptedFriendRequestsRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              Object.keys(childSnapshot.val()).forEach((receiverID) => {
                if (childSnapshot.key === user.uid && receiverID === targetID) {
                  remove(
                    child(acceptedFriendRequestsRef, `/${user.uid}/${targetID}`)
                  );
                }
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const handleClickManageFriend = async (e, targetID, add) => {
    e.preventDefault();
    if (targetID !== user.uid && targetID !== undefined) {
      let friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
      let friendRequestsRef = ref(
        rtdb,
        `/friend_requests/${user.uid}/${targetID}`
      );
      if (add) {
        // add a friend
        set(friendRequestsRef, "");
      } else {
        // remove a friend
        set(friendRef, null)
          .then(() => {
            console.log("friend removed");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      navigate("/meetnewfriends"); // workaround
    }
  };

  const handleClickViewProfile = (targetID) => {
    navigate(`/profile/${targetID}`);
  };

  useEffect(() => {
    getQuery(statusRef);
    getQuery(usersRef);
    getQuery(acceptedFriendRequestsRef);
    getQuery(friendRequestsRef);
  }, [user.uid]);

  useEffect(() => {
    setMergedObj(
      mergeObj(
        statusObj,
        usersObj,
        friendsObj,
        friendRequestsObj,
        user.uid,
        false
      )
    );
  }, [statusObj, usersObj, friendsObj, friendRequestsObj]);

  return (
    <div>
      <FriendRequest />
      <CallNotification />
      <Navbar
        topLeftDisplay={t("Meet New Friends")}
        currPage={"/meetnewfriends"}
      />
      <Text className="font" fontSize="3xl">
        {t("These people are also using LingoShare")}
      </Text>
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
                    friendRequestSent={value.friendRequestSent}
                    profileURL={value.profilePic}
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
