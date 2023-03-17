import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get } from "firebase/database";
import { rtdb } from "../firebase";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FriendRequestCard from "./lingoshare-components/friendrequestcard";
import { handleAcceptRequest, handleIgnoreRequest } from "../utils/userutils";

export default function FriendRequest() {
  const [friendRequestSnapshot, setFriendRequestSnapshot] = useState([]);
  const [requestSenders, setRequestSenders] = useState({});
  const [incomingRequests, setIncomingRequests] = useState([]);
  const { user } = UserAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const friendRequestsRef = ref(rtdb, "/friend_requests");
  const usersRef = ref(rtdb, "/users");
  // console.log(friendRequestSnapshot);
  // console.log(requestSenders);

  const extractRequestSenderID = () => {
    friendRequestSnapshot.forEach((requestChildSnapshot) => {
      Object.keys(requestChildSnapshot.val()).forEach((receiverID) => {
        if (
          user.uid === receiverID &&
          !requestSenders.hasOwnProperty(requestChildSnapshot.key)
        ) {
          let senderUid = requestChildSnapshot.key;
          appendRequestSender(senderUid);
        }
      });
    });
  };

  const appendRequestSender = (targetID) => {
    // extract sender's display name
    get(usersRef)
      .then((snapshot) => {
        snapshot.forEach((userChildSnapshot) => {
          if (userChildSnapshot.key === targetID) {
            // append friend request sender to requestSenders
            const { interests, userType, userDisplayName, profilePic } =
              userChildSnapshot.val();
            let newObj = {
              userId: targetID,
              interests: interests,
              userType: userType,
              userDisplayName: userDisplayName,
              profilePic: profilePic,
            };
            let newIncomingRequests = [...incomingRequests];
            newIncomingRequests.push(newObj);
            setIncomingRequests(newIncomingRequests);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAcceptFriendRequest = (event, incomingRequestIndex, targetID) => {
    handleAcceptRequest(event, friendRequestsRef, user, targetID);
    // remove the added incomingRequestId from the incomingRequests object
    let newIncomingRequests = [];
    for (let i = 0; i < incomingRequests.length; i++) {
      if (i !== incomingRequestIndex) {
        newIncomingRequests.push(incomingRequests[i]);
      }
    }
    setIncomingRequests(newIncomingRequests);

    navigate("/meetnewfriends"); // workaround
  };

  const handleIgnoreFriendRequest = (event, incomingRequestIndex, targetID) => {
    handleIgnoreRequest(event, friendRequestsRef, user, targetID);
    // remove the added incomingRequestId from the incomingRequests object
    let newIncomingRequests = [];
    for (let i = 0; i < incomingRequests.length; i++) {
      if (i !== incomingRequestIndex) {
        newIncomingRequests.push(incomingRequests[i]);
      }
    }
    setIncomingRequests(newIncomingRequests);
  };

  useEffect(() => {
    onValue(friendRequestsRef, (snapshot) => {
      setFriendRequestSnapshot(snapshot);
    });
  }, []);

  useEffect(() => {
    extractRequestSenderID();
  }, [friendRequestSnapshot]);

  return (
    <div>
      {incomingRequests.length > 0 && (
        <Text
          marginBottom={"2rem"}
          className="font"
          float={"left"}
          fontSize="3xl"
        >
          {t("These people have added you as a friend!")}
        </Text>
      )}
      {incomingRequests.map((friendInvite, i) => (
        <FriendRequestCard
          key={i}
          incomingRequestIndex={i}
          userId={friendInvite.userId}
          displayName={friendInvite.userDisplayName}
          interests={friendInvite.interests}
          userType={friendInvite.userType}
          profilePic={friendInvite.profilePic}
          onClickIgnore={handleIgnoreFriendRequest}
          onClickAccept={handleAcceptFriendRequest}
        />
      ))}
    </div>
  );
}
