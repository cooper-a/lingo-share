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
import { PhoneIcon } from "@chakra-ui/icons";
import "../styles/homepage.css";
import { UserAuth } from "../contexts/AuthContext";
import { ref, get } from "firebase/database";
import { rtdb } from "../firebase";
import VideoChat from "./video/videochat";
import Navbar from "./navbar";
import { Button, UnorderedList } from "@chakra-ui/react";

export default function CallFriend() {
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const [callerID, setCallerID] = useState("");
  const [redirectToVideo, setRedirectToVideo] = useState(false);
  const status_ref = ref(rtdb, "/status");
  const users_ref = ref(rtdb, "/users");
  const { user } = UserAuth();
  // console.log(statusObj);
  // console.log(usersObj);
  // console.log(mergedObj);

  const getQuery = (ref) => {
    get(ref)
      .then((snapshot) => {
        let newObjectList = [];
        snapshot.forEach((childSnapshot) => {
          let newObject = {};
          newObject[childSnapshot.key] = childSnapshot.val();
          newObjectList.push(newObject);
        });
        if (ref === status_ref) {
          setStatusObj(newObjectList);
        } else if (ref === users_ref) {
          setUsersObj(newObjectList);
        }
      })
      .catch((error) => {
        console.log(error);
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
    return res;
  };

  const handleClick = (event, callerID) => {
    event.currentTarget.disabled = true;
    setCallerID(callerID);
    setRedirectToVideo(true);
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
    getQuery(status_ref);
    getQuery(users_ref);
  }, []);

  useEffect(() => {
    setMergedObj(mergeObj(statusObj, usersObj));
  }, [statusObj, usersObj]);

  let render;
  if (!redirectToVideo) {
    render = (
      <div>
        <Navbar />
        <Text fontSize="3xl">Who do you want to call?</Text>
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
                              <Heading size="sm">
                                {value.userDisplayName}
                              </Heading>
                            ) : (
                              <Heading size="sm">Name not set</Heading>
                            )}
                            {value.state === "online" ? (
                              <Text float={"left"}>Online</Text>
                            ) : (
                              <Text float={"left"}>Offline</Text>
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
                            Call
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
  } else {
    render = (
      <div>
        <VideoChat callerID={callerID} />
      </div>
    );
  }
  return render;
}
