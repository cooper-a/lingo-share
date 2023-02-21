import React, { useState, useEffect, useLayoutEffect } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "../firebase";
import {
  Button,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'

export default function CallFriend() {
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const status_ref = ref(rtdb, "/status");
  const users_ref = ref(rtdb, "/users");
  // console.log(statusObj);
  // console.log(usersObj);
  console.log(mergedObj);

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
        if (statusList.some(statusDict => statusDict.hasOwnProperty(userID))) {
          // if it is, find the corresponding status dictionary in the statusList
          let statusDict = statusList.find(statusDict => statusDict.hasOwnProperty(userID));
          
          // merge the two dictionaries into a new object
          let mergedDict = {...userValue, ...statusDict[userID]};

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
        if (userList.some(userDict => userDict.hasOwnProperty(userID))) {
          let userDict = userList.find(userDict => userDict.hasOwnProperty(userID));
          let mergedDict = {...statusValue, ...userDict[userID]};
          res[userID] = mergedDict;
        } else {
          res[userID] = statusValue;
        }
      }
    }

    return res
  };
  
  useEffect(() => {
    getQuery(status_ref);
    getQuery(users_ref);
  }, []);

  useEffect(() => {
    setMergedObj(mergeObj(statusObj, usersObj));
  }, [statusObj, usersObj]);

    return (
          <UnorderedList spacing={5} align>
            {Object.entries(mergedObj).map(([key, value]) => {
              return (
                <ListItem key={key}>
                  {key}     {value.state}     {String(value.isOnboarded)}     {value.proficiency}     {value.userType}     {value.last_changed} <Button colorScheme='blue' direction='row' align='center'>Call</Button>
                </ListItem>
              )
            })}
          </UnorderedList>
    );
}