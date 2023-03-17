import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get } from "firebase/database";
import { rtdb } from "../firebase";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FriendRequestCard from "./lingoshare-components/friendrequestcard";
import "../styles/meetfriends.css";
import {
  handleAcceptRequest,
  handleIgnoreRequest,
  extractRequestSenderID,
} from "../utils/userutils";

export default function FriendRequest() {
  const [friendRequestSnapshot, setFriendRequestSnapshot] = useState([]);
  const [requestSenders, setRequestSenders] = useState({});
  const { user } = UserAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const friendRequestsRef = ref(rtdb, "/friend_requests");
  const usersRef = ref(rtdb, "/users");
  // console.log(friendRequestSnapshot);
  // console.log(requestSenders);

  const extractRequestSenderIDFromSnapshot = () => {
    extractRequestSenderID(
      friendRequestSnapshot,
      user,
      requestSenders,
      usersRef,
      setRequestSenders
    );
  };

  const handleAcceptFriendRequest = (event, targetID) => {
    handleAcceptRequest(event, friendRequestsRef, user, targetID);
    // remove the added requestSenderID from the requestSenders object
    const newRequestSenders = { ...requestSenders };
    delete newRequestSenders[targetID];
    setRequestSenders(newRequestSenders);

    navigate("/meetnewfriends"); // workaround
  };

  const handleIgnoreFriendRequest = (event, targetID) => {
    handleIgnoreRequest(event, friendRequestsRef, user, targetID);
    // remove the added requestSenderID from the requestSenders object
    const newRequestSenders = { ...requestSenders };
    delete newRequestSenders[targetID];
    setRequestSenders(newRequestSenders);
  };

  useEffect(() => {
    onValue(friendRequestsRef, (snapshot) => {
      setFriendRequestSnapshot(snapshot);
    });
  }, []);

  useEffect(() => {
    extractRequestSenderIDFromSnapshot();
  }, [friendRequestSnapshot]);

  return (
    <div className="friend-requests">
      {Object.entries(requestSenders).length > 0 && (
        <Text
          marginBottom={"2rem"}
          className="font"
          float={"left"}
          fontSize="3xl"
        >
          {t("These people have added you as a friend!")}
        </Text>
      )}
      {Object.entries(requestSenders).map(([senderID, senderInfo], i) => {
        console.log(i);
        return (
          <div key={senderID} className="friend-request">
            <FriendRequestCard
              key={i}
              userId={senderInfo.userId}
              displayName={senderInfo.userDisplayName}
              interests={senderInfo.interests}
              userType={senderInfo.userType}
              profilePic={senderInfo.profilePic}
              onClickIgnore={handleIgnoreFriendRequest}
              onClickAccept={handleAcceptFriendRequest}
            />
          </div>
        );
      })}
    </div>
  );
}
