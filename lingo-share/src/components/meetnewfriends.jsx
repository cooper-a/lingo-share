import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getQuery } from "../helpers/userhelpers";
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
      } else if (ref === usersRef) {
        setUsersObj(newObjectList);
      }
    });
  };

  // TODO Refactor this function
  const mergeObj = (statusList, userList) => {
    let res = [];
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
          res[userID] = mergedDict;
        } else {
          // if the userID isn't in the statusList, just add the userValue to the result object with the userID as the key
          res[userID] = userValue;
        }
      }
    }

    // brute force for the other way around if userID is found in statusList but not in userList
    for (let statusDict of statusList) {
      for (let [userID, statusValue] of Object.entries(statusDict)) {
        if (userList.some((userDict) => userDict.hasOwnProperty(userID))) {
          let userDict = userList.find((userDict) =>
            userDict.hasOwnProperty(userID)
          );
          let mergedDict = { ...statusValue, ...userDict[userID] };
          res[userID] = mergedDict;
        } else {
          res[userID] = statusValue;
        }
      }
    }
    return res;
  };

  const handleClickAddFriend = (targetID) => {
    if (targetID !== user.uid && targetID !== undefined) {
      const friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
      set(friendRef, true);
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
  }, [statusObj, usersObj]);

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
                          onClick={(e) => handleClickAddFriend(key)}
                        >
                          {t("Add Friend")}
                        </Button>
                        <Button
                          colorScheme="black"
                          variant="outline"
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