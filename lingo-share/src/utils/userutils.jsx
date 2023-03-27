import {
  ref,
  set,
  get,
  remove,
  child,
  push,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "../firebase";

const mergeObj = (
  statusObj,
  userObj,
  friendsObj,
  blockedObj,
  blockedByObj,
  friendRequestsObj,
  uid,
  friendsOnly,
  blockedOnly
) => {
  let res = [];
  let friendsDict = {};
  let pendingFriendRequestList = []; // storing the list of users IDs that the current user sent a friend request to
  let receivedFriendRequestList = []; // storing the list of users IDs that sent a friend request to the current user

  // Takes in status, friends, and users

  for (let [friendID, friendValue] of Object.entries(friendsObj)) {
    friendsDict[friendID] = friendValue;
  }

  // First we merge the status and users objects and add the isFriend key
  Object.values(friendRequestsObj).forEach((requestsObj) => {
    for (let [senderID, receiverIDList] of Object.entries(requestsObj)) {
      if (senderID === uid) {
        Object.keys(receiverIDList).forEach((receiverID) => {
          pendingFriendRequestList.push(receiverID);
        });
      }
      if (receiverIDList.hasOwnProperty(uid)) {
        receivedFriendRequestList.push(senderID);
      }
    }
  });

  // loop through each dictionary in userList
  for (let userDict of userObj) {
    // loop through each key-value pair in the current dictionary
    for (let [userID, userValue] of Object.entries(userDict)) {
      // check if the current userID is in the statusList

      if (statusObj.some((statusDict) => statusDict.hasOwnProperty(userID))) {
        // if it is, find the corresponding status dictionary in the statusList
        let statusDict = statusObj.find((statusDict) =>
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
        if (pendingFriendRequestList.includes(userID)) {
          mergedDict = { ...mergedDict, friendRequestSent: true };
        } else {
          mergedDict = { ...mergedDict, friendRequestSent: false };
        }
        res[userID] = mergedDict;
      } else {
        if (friendsDict.hasOwnProperty(userID)) {
          userValue = { ...userValue, isFriend: true };
        } else {
          userValue = { ...userValue, isFriend: false };
        }
        if (pendingFriendRequestList.includes(userID)) {
          userValue = { ...userValue, friendRequestSent: true };
        } else {
          userValue = { ...userValue, friendRequestSent: false };
        }
        // if the userID isn't in the statusList, just add the userValue to the result object with the userID as the key
        res[userID] = userValue;
      }
    }
  }
  // filter out the current user
  delete res[uid];

  if (blockedOnly === true) {
    // first add the blocked reason to the user object
    for (let [blockedID, blockedValue] of Object.entries(blockedObj)) {
      if (res[blockedID]) {
        res[blockedID] = { ...res[blockedID], blockedReason: blockedValue };
      }
    }

    let res_filtered = [];
    for (let [blockedID, blockedValue] of Object.entries(blockedObj)) {
      res_filtered[blockedID] = res[blockedID];
    }
    return res_filtered;
  }

  // filter out the users that are blocked by the current user
  for (let [blockedID, blockedValue] of Object.entries(blockedObj)) {
    delete res[blockedID];
  }

  // filter out the users that have blocked the current user
  for (let [blockedByID, blockedValue] of Object.entries(blockedByObj)) {
    delete res[blockedByID];
    console.log(blockedByID);
  }

  // if for the friends page, filter out the users that are not friends
  if (friendsOnly === true) {
    let res_filtered = [];
    for (let [friendID, friendValue] of Object.entries(friendsObj)) {
      res_filtered[friendID] = res[friendID];
    }
    return res_filtered;
  }

  // filter out the users that have sent a friend request to the current user
  if (receivedFriendRequestList.length > 0) {
    for (let receiverID of receivedFriendRequestList) {
      delete res[receiverID];
    }
  }

  return res;
};

const handleAcceptRequest = (event, friendRequestsRef, user, targetID) => {
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
  removeEntryFromFriendRequests(friendRequestsRef, user, targetID);
  // setIncomingRequest(false);
  // navigate("/profile/" + params.id); // workaround
};

const handleIgnoreRequest = (event, friendRequestsRef, user, targetID) => {
  event.currentTarget.disabled = true;
  removeEntryFromFriendRequests(friendRequestsRef, user, targetID);
  // setIncomingRequest(false);
};

const removeEntryFromFriendRequests = (friendRequestsRef, user, targetID) => {
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

const handleBlockUser = async (targetID, blockedReason, user) => {
  if (targetID !== user.uid && targetID !== undefined) {
    let blockRef = ref(rtdb, `/users/${user.uid}/blocked/${targetID}`);
    let friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
    let blockedReasonString = blockedReason;
    if (blockedReason === "") {
      blockedReasonString = "No reason given";
    }
    set(blockRef, blockedReasonString)
      .then(() => {
        console.log("user blocked");
      })
      .catch((error) => {
        console.log(error);
      });
    set(friendRef, null)
      .then(() => {
        console.log("user removed from friends list");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const handleReportUser = async (targetID, reportReason, user) => {
  if (targetID !== user.uid && targetID !== undefined) {
    let reportRef = ref(rtdb, `/reports/${user.uid}/${targetID}`);
    let reportReasonString = reportReason;
    if (reportReasonString === "") {
      reportReasonString = "No reason given";
    }
    push(reportRef, reportReasonString)
      .then(() => {
        console.log("user reported");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const handleUnblockUser = async (targetID, user) => {
  if (targetID !== user.uid && targetID !== undefined) {
    let blockRef = ref(rtdb, `/users/${user.uid}/blocked/${targetID}`);
    set(blockRef, null)
      .then(() => {
        console.log("user unblocked");
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const extractRequestSenderID = (
  friendRequestSnapshot,
  user,
  requestSenders,
  usersRef,
  setRequestSenders
) => {
  friendRequestSnapshot.forEach((requestChildSnapshot) => {
    Object.keys(requestChildSnapshot.val()).forEach((receiverID) => {
      if (
        user.uid === receiverID &&
        !requestSenders.hasOwnProperty(requestChildSnapshot.key)
      ) {
        let senderUid = requestChildSnapshot.key;
        appendRequestSender(senderUid, usersRef, setRequestSenders);
      }
    });
  });
};

const appendRequestSender = (targetID, usersRef, setRequestSenders) => {
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
          setRequestSenders((requestSenders) => ({
            ...requestSenders,
            [userChildSnapshot.key]: newObj,
          }));
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

async function generateCallStatusEntryAndNavigate(
  callerID,
  activeCallsRef,
  user,
  navigate
) {
  var startTime = performance.now();
  const uid = user.uid;
  get(activeCallsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let callExists = false;
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().caller === uid ||
            childSnapshot.val().callee === callerID
          ) {
            callExists = true;
          }
        });
        if (!callExists) {
          const pushData = {
            caller: uid, // the user who initiated the call will always be caller
            callee: callerID, // the user who is being called will always be callee
          };
          const currActiveCallsRef = push(activeCallsRef, pushData);
          const callID = currActiveCallsRef.key;
          const roomName = generateRoomName(uid, callerID);
          const callIDRef = ref(rtdb, `/calls/${roomName}/${callID}`);
          set(callIDRef, {
            caller: uid,
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

const generateRoomName = (uid, callerID) => {
  let roomNameInList = [uid, callerID];
  return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
};

export {
  mergeObj,
  handleAcceptRequest,
  handleIgnoreRequest,
  handleBlockUser,
  handleReportUser,
  handleUnblockUser,
  extractRequestSenderID,
  generateCallStatusEntryAndNavigate,
  generateRoomName,
};
