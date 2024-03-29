import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set, remove, child } from "firebase/database";
import { rtdb } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  ChakraProvider,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Navbar from "./navbar";
import CallNotification from "./callnotification";
import FriendRequest from "./friendrequest";
import ProfileCard from "./lingoshare-components/profilecard";
import "../styles/meetfriends.css";
import PrimaryButton from "./lingoshare-components/primarybutton";
import TertiaryButton from "./lingoshare-components/tertiarybutton";
import { mergeObj } from "../utils/userutils";

const FraudConfirmationModal = ({ isOpen, onClose, handleNotShowAgain }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal isCentered onClose={onClose} size={"xl"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent
          paddingLeft={"15px"}
          paddingRight={"15px"}
          paddingTop={"15px"}
          borderRadius={"2xl"}
        >
          <ModalHeader
            marginTop={"1rem"}
            fontSize={"3xl"}
            fontWeight={"extrabold"}
            className="font"
            alignSelf={"center"}
            marginRight={"auto"}
          >
            {t("Before you start making friends...")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="disclaimer-msg">
              <div>
                <Text>
                  {t("Remember that")}{" "}
                  <span className="bolded-text">
                    {t("LingoShare is free for everyone!")}
                  </span>
                </Text>
              </div>
              <div>
                <Text>
                  {t(
                    "Nobody has to pay for anything to use LingoShare. If anyone asks for or demands money, please report their profile immediately."
                  )}
                </Text>
              </div>
              <div>
                <Text>{t("Happy chatting!")}</Text>
              </div>
            </div>
          </ModalBody>
          <ModalFooter
            marginLeft={"auto"}
            marginBottom={"1.5rem"}
            alignSelf={"center"}
            className="font"
          >
            <TertiaryButton
              text={t("Don't show this again")}
              onClick={handleNotShowAgain}
              marginRight={"15px"}
              width={"150px"}
            />
            <PrimaryButton
              text={t("OK")}
              marginLeft={"15px"}
              onClick={onClose}
              width={"150px"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default function MeetNewFriends() {
  const { user } = UserAuth();
  const usersRef = ref(rtdb, "/users");
  const fraudCheckRef = ref(rtdb, "users/" + user.uid + "/fraudCheck");
  const statusRef = ref(rtdb, "/status");
  const friendRequestsRef = ref(rtdb, "/friend_requests");
  const acceptedFriendRequestsRef = ref(rtdb, "/accepted_friend_requests");
  const navigate = useNavigate();
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [friendRequestsObj, setFriendRequestsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const [blockedObj, setBlockedObj] = useState([]);
  const [blockedByObj, setBlockedByObj] = useState([]);
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNotShowAgain = () => {
    set(fraudCheckRef, true);
    onClose();
    navigate("/meetnewfriends");
  };

  const handlefraudConfirmation = () => {
    get(fraudCheckRef).then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val() === false) {
          onOpen();
        }
      } else {
        set(fraudCheckRef, false);
        navigate("/meetnewfriends");
        onOpen();
      }
    });
  };

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
    navigate(`/profile/${targetID}`, {
      state: { prevPage: "/meetnewfriends" },
    });
  };

  useEffect(() => {
    getQuery(statusRef);
    getQuery(usersRef);
    getQuery(acceptedFriendRequestsRef);
    getQuery(friendRequestsRef);
    handlefraudConfirmation();
  }, [user.uid]);

  useEffect(() => {
    setMergedObj(
      mergeObj(
        statusObj,
        usersObj,
        friendsObj,
        blockedObj,
        blockedByObj,
        friendRequestsObj,
        user.uid,
        false,
        false
      )
    );
  }, [statusObj, usersObj, friendsObj, friendRequestsObj]);

  return (
    <div>
      <CallNotification />
      <FraudConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        handleNotShowAgain={handleNotShowAgain}
      />
      <Navbar
        topLeftDisplay={t("Meet New Friends")}
        currPage={"/meetnewfriends"}
      />
      <ChakraProvider>
        <div className="meet-friends-pg">
          <FriendRequest />
          <div className="also-users-text">
            <Text className="font" fontSize="3xl">
              {t("These people are also using LingoShare")}
            </Text>
          </div>
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
                    userType={value.userType}
                    interests={value.interests}
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
