const mergeObj = (
  statusObj,
  userObj,
  friendsObj,
  friendRequestsObj,
  uid,
  friendsOnly
) => {
  let res = [];
  let friendsDict = {};
  let pendingFriendRequestList = [];

  // Takes in status, friends, and users

  for (let [friendID, friendValue] of Object.entries(friendsObj)) {
    friendsDict[friendID] = friendValue;
  }

  Object.values(friendRequestsObj).forEach((requestsObj) => {
    for (let [senderID, receiverIDList] of Object.entries(requestsObj)) {
      if (senderID === uid) {
        Object.keys(receiverIDList).forEach((receiverID) => {
          pendingFriendRequestList.push(receiverID);
        });
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

  delete res[uid];

  // if for the friends page, filter out the users that are not friends
  if (friendsOnly === true) {
    let res_filtered = [];
    for (let [friendID, friendValue] of Object.entries(friendsObj)) {
      res_filtered[friendID] = res[friendID];
    }
    return res_filtered;
  }

  return res;
};

export { mergeObj };
