import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { rtdb } from "../firebase";
import "../styles/meetfriends.css";
import {
  mergeObj,
  handleBlockUser,
  handleReportUser,
} from "../utils/userutils";
import CallNotification from "./callnotification";
import Input from "./lingoshare-components/input";
import Navbar from "./navbar";

export default function YourFriends() {
  const usersRef = ref(rtdb, "/users");
  const statusRef = ref(rtdb, "/status");
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [statusObj, setStatusObj] = useState([]);
  const [usersObj, setUsersObj] = useState([]);
  const [friendsObj, setFriendsObj] = useState([]);
  const [mergedObj, setMergedObj] = useState([]);
  const [blockedObj, setBlockedObj] = useState([]);
  const [blockedByObj, setBlockedByObj] = useState([]);
  const [blockedReason, setBlockedReason] = useState("");
  const [reportReason, setReportReason] = useState("");
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
      }
      if (ref === usersRef) {
        setUsersObj(newObjectList);
        // extract friends list from usersObj
        for (let userDict of newObjectList) {
          for (let [userID, userValue] of Object.entries(userDict)) {
            if (userID === user.uid) {
              if (userValue.friends) {
                setFriendsObj(userValue.friends);
              } else {
                setFriendsObj({});
              }
              if (userValue.blocked) {
                setBlockedObj(userValue.blocked);
              } else {
                setBlockedObj({});
              }
              if (userValue.blockedBy) {
                setBlockedByObj(userValue.blockedBy);
              } else {
                setBlockedByObj({});
              }
            }
          }
        }
      }
    });
  };

  const handleClickBlockFriend = async (e, targetID) => {
    e.preventDefault();
    handleBlockUser(targetID, blockedReason, user);
    navigate("/yourfriends");
  };

  const handleClickReportUser = async (e, targetID) => {
    e.preventDefault();
    console.log(user.uid);
    handleReportUser(targetID, reportReason, user);
    navigate("/yourfriends");
  };

  useEffect(() => {
    getQuery(statusRef);
    getQuery(usersRef);
  }, [user.uid]);

  useEffect(() => {
    setMergedObj(
      mergeObj(
        statusObj,
        usersObj,
        friendsObj,
        blockedObj,
        blockedByObj,
        {},
        user.uid,
        true,
        false
      )
    );
  }, [statusObj, usersObj, friendsObj]);

  return (
    <div>
      <CallNotification />
      <Navbar currPage={"/yourfriends"} />
      <Text fontSize="3xl">{t("Manage your friends")}</Text>
      <ChakraProvider>
        <div className="field-pg">
          <div className="card-display">
            {Object.entries(mergedObj).map(([key, value], i) => {
              return (
                <div key={i} className="card-item">
                  <h1> {value.userDisplayName} </h1>
                  <Input
                    onChange={(e) => setBlockedReason(e.target.value)}
                    width={"350px"}
                    placeholder={t("Block Reason")}
                    height={"50px"}
                  />
                  <Button onClick={(e) => handleClickBlockFriend(e, key)}>
                    {t("Block User")}
                  </Button>

                  <Input
                    onChange={(e) => setReportReason(e.target.value)}
                    width={"350px"}
                    placeholder={t("Report Reason")}
                    height={"50px"}
                  />
                  <Button onClick={(e) => handleClickReportUser(e, key)}>
                    {t("Report User")}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
