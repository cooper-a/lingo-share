import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import Icon from "@adeira/icons";
import { useNavigate } from "react-router-dom";
import { PhoneIcon } from "@chakra-ui/icons";
import "../styles/homepage.css";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, push, get, set } from "firebase/database";
import { rtdb } from "../firebase";
import Navbar from "./navbar";
import { Button, UnorderedList } from "@chakra-ui/react";
import CallNotification from "./callNotification";
import { useTranslation } from "react-i18next";

export default function CallFriend() {
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const statusRef = ref(rtdb, "/status");
  const usersRef = ref(rtdb, "/users");
  const activeCallsRef = ref(rtdb, "/active_calls");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // console.log(statusObj);
  // console.log(usersObj);
  // console.log(mergedObj);

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
    // TODO QOL improvement: sort the res object based on if the user is online or offline
    // sort the res object based on if the user is online or offline
    // res.sort((a, b) => {
    //   if (a.state === "online" && b.state === "offline") {
    //     return -1;
    //   } else if (a.state === "offline" && b.state === "online") {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });
    //
    // console.log(res);

    return res;
  };

  const generateRoomName = (uid, callerID) => {
    let roomNameInList = [uid, callerID];
    return roomNameInList.sort().join(""); // room name will be the concatenation of the two user IDs sorted alphabetically
  };

  async function generateCallStatusEntryAndNavigate(callerID) {
    var startTime = performance.now();
    get(activeCallsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().caller === user.uid) {
              return;
            } else if (childSnapshot.val().callee === user.uid) {
              return;
            } else {
              const pushData = {
                caller: user.uid, // the user who initiated the call will always be caller
                callee: callerID, // the user who is being called will always be callee
              };
              const currActiveCallsRef = push(activeCallsRef, pushData);
              const callID = currActiveCallsRef.key;
              const roomName = generateRoomName(user.uid, callerID);
              const callIDRef = ref(rtdb, `/calls/${roomName}/${callID}`);
              set(callIDRef, {
                caller: user.uid,
                callee: callerID,
                active_prompt: "none",
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
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleClick = (event, callerID) => {
    event.currentTarget.disabled = true;
    generateCallStatusEntryAndNavigate(callerID);
  };

  const disableButton = (key, state) => {
    if (state === "offline" || typeof state === "undefined") {
      return true;
    } else if (key === user.uid) {
      return true; // if it's the current user, disable the button
    }
    return false;
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
      <Text fontSize="3xl">{t("Who would you like to call?")}</Text>
      <ChakraProvider>
        <div className="field-pg">
          <UnorderedList spacing={5}>
            {Object.entries(mergedObj).map(([key, value]) => {
              return (
                <Card maxW="md" key={key} width={"400px"}>
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
                          onClick={(event) => handleClick(event, key)}
                          isDisabled={disableButton(key, value.state)}
                          direction="row"
                          align="center"
                          leftIcon={<PhoneIcon w={3} h={3} />}
                          variant="outline"
                        >
                          {t("Call")}
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
