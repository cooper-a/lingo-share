import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set, remove, child } from "firebase/database";
import { rtdb } from "../firebase";
import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

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
            setRequestSenders((requestSenders) => ({
              ...requestSenders,
              [userChildSnapshot.key]: userChildSnapshot.val().userDisplayName,
            }));
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAcceptRequest = (event, targetID) => {
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

    // remove the added requestSenderID from the requestSenders object
    const newRequestSenders = { ...requestSenders };
    delete newRequestSenders[targetID];
    setRequestSenders(newRequestSenders);

    navigate("/meetnewfriends"); // workaround
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
      {Object.entries(requestSenders).map(
        ([senderID, senderDisplayName], i) => {
          return (
            <div key={senderID}>
              <h1>Incoming Friend Request</h1>
              <p>{senderDisplayName} sent you a friend request!</p>
              <Button direction="row" align="center" variant="outline">
                {t("Ignore")}
              </Button>
              <Button
                direction="row"
                align="center"
                variant="outline"
                onClick={(event) => handleAcceptRequest(event, senderID)}
              >
                {t("Accept")}
              </Button>
            </div>
          );
        }
      )}
    </div>
  );
}
