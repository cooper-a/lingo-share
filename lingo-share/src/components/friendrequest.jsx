import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set, remove, child } from "firebase/database";
import { rtdb } from "../firebase";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FriendRequestCard from "./lingoshare-components/friendrequestcard";

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
            console.log(userChildSnapshot.val());
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

  const handleAcceptRequest = (event, incomingRequestIndex, targetID) => {
    event.currentTarget.disabled = true;

    // add senderID into user's friend list
    let friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
    set(friendRef, true)
      .then(() => {
        console.log("friend added");
      })
      .catch((error) => {
        console.log(error);
      });

    // copy entry over to accepted_friend_requests object upon accept
    let acceptedFriendRequestsRef = ref(
      rtdb,
      `accepted_friend_requests/${targetID}/${user.uid}`
    );
    set(acceptedFriendRequestsRef, "");

    // remove the identical entry from friend request object
    removeEntryFromFriendRequests(targetID);

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

  const handleIgnoreRequest = (event, incomingRequestIndex, targetID) => {
    event.currentTarget.disabled = true;

    removeEntryFromFriendRequests(targetID);

    // remove the added incomingRequestId from the incomingRequests object
    let newIncomingRequests = [];
    for (let i = 0; i < incomingRequests.length; i++) {
      if (i !== incomingRequestIndex) {
        newIncomingRequests.push(incomingRequests[i]);
      }
    }
    setIncomingRequests(newIncomingRequests);
  };

  const removeEntryFromFriendRequests = (targetID) => {
    get(friendRequestsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            Object.keys(childSnapshot.val()).forEach((receiverID) => {
              if (childSnapshot.key === targetID && receiverID === user.uid) {
                remove(child(friendRequestsRef, `/${targetID}/${user.uid}`));
              }
            });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
          onClickIgnore={handleIgnoreRequest}
          onClickAccept={handleAcceptRequest}
        />
      ))}
    </div>
  );
}
