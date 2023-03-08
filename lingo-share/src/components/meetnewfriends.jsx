import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarBadge,
  Box,
  Card,
  CardHeader,
  ChakraProvider,
  Flex,
  Heading,
  Text,
  UnorderedList,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Navbar from "./navbar";
import CallNotification from "./callNotification";
import { PhoneIcon } from "@chakra-ui/icons";

export default function MeetNewFriends() {
  const usersRef = ref(rtdb, "/users");
  const statusRef = ref(rtdb, "/status");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const friendsRef = ref(rtdb, `/users/${user.uid}/friends`);
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const { t } = useTranslation();

  const getUsersStatusFriends = (usersRef, statusRef, friendsRef) => {
    onValue(usersRef, (snapshot) => {
      let newObjectList = [];
      snapshot.forEach((childSnapshot) => {
        let newObject = {};
        newObject[childSnapshot.key] = childSnapshot.val();
        newObjectList.push(newObject);
      });

      setUsersObj(newObjectList);
    });

    onValue(statusRef, (snapshot) => {
      let newObjectList = [];
      snapshot.forEach((childSnapshot) => {
        let newObject = {};
        newObject[childSnapshot.key] = childSnapshot.val();
        newObjectList.push(newObject);
      });

      setStatusObj(newObjectList);
    });

    onValue(friendsRef, (snapshot) => {
      let newObjectList = [];
      snapshot.forEach((childSnapshot) => {
        let newObject = {};
        newObject[childSnapshot.key] = childSnapshot.val();
        newObjectList.push(newObject);
      });

      setFriendsObj(newObjectList);
    });
  };

  const mergeObj = (statusList, userList, friends) => {
    let res = [];

    let friendsDict = {};

    for (let friendDict of friends) {
      for (let [friendID, friendValue] of Object.entries(friendDict)) {
        friendsDict[friendID] = friendValue;
      }
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

    // delete res_filtered[user.uid];

    console.log(res);
    delete res[user.uid];

    return res;
  };

  const handleClickManageFriend = async (e, targetID, add) => {
    e.preventDefault();
    if (targetID !== user.uid && targetID !== undefined) {
      const friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
      if (add) {
        set(friendRef, true).catch((error) => {
          console.log(error);
        });
        console.log("friend added");
      } else {
        set(friendRef, false).catch((error) => {
          console.log(error);
        });
      }
    }
  };

  const handleClickViewProfile = (targetID) => {
    navigate(`/profile/${targetID}`);
  };

  useEffect(() => {
    getUsersStatusFriends(usersRef, statusRef, friendsRef);
  }, []);

  useEffect(() => {
    setMergedObj(mergeObj(statusObj, usersObj, friendsObj));
  }, [statusObj, usersObj, friendsObj]);

  return (
    <div>
      <CallNotification />
      <Navbar />
      <Text fontSize="3xl">{t("These people are also using LingoShare")}</Text>
      <ChakraProvider>
        <div className="field-pg">
          <UnorderedList spacing={5}>
            {Object.entries(mergedObj).map(([key, value]) => {
              return (
                <Card maxW="md" key={key} width={"600px"}>
                  <CardHeader>
                    <Flex spacing="4">
                      <Flex
                        flex="1"
                        gap="4"
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        {value.state === "online" ? (
                          <Avatar bg="grey">
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                          </Avatar>
                        ) : (
                          <Avatar bg="grey" />
                        )}

                        <Box>
                          {value.userDisplayName ? (
                            <Heading size="sm">{value.userDisplayName}</Heading>
                          ) : (
                            <Heading size="sm">{key}</Heading>
                          )}
                          {value.state === "online" ? (
                            <Text float={"left"}>{t("Online")}</Text>
                          ) : (
                            <Text float={"left"}>{t("Offline")}</Text>
                          )}
                        </Box>
                      </Flex>
                      <Box alignSelf={"center"}>
                        <Button
                          colorScheme="black"
                          variant="outline"
                          size="xs"
                          onClick={(e) => handleClickManageFriend(e, key, true)}
                        >
                          {t("Add Friend")}
                          {/* {value.isFriend ? t("Friend") : t("Add Friend")} */}
                        </Button>
                        <Button
                          colorScheme="black"
                          variant="outline"
                          size="xs"
                          onClick={(e) => handleClickViewProfile(key)}
                        >
                          {t("View Profile")}
                        </Button>
                      </Box>
                    </Flex>
                  </CardHeader>
                </Card>
              );
            })}
          </UnorderedList>
        </div>
      </ChakraProvider>
    </div>
  );
}
