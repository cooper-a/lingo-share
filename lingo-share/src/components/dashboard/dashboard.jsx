import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  ChakraProvider,
  Text,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import "../../styles/card.css";
import "@fontsource/atkinson-hyperlegible";
import { rtdb, storage } from "../../firebase";
import { ref, get, onValue, set } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import { useTranslation } from "react-i18next";
import CallNotification from "../callnotification";
import Icon from "@adeira/icons";
import { extractRequestSenderID } from "../../utils/userutils";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, checkStatus } = UserAuth();
  const languageRef = ref(rtdb, `users/${user.uid}/language`);
  const friendRequestsRef = ref(rtdb, "/friend_requests");
  const usersRef = ref(rtdb, "/users");
  const [friendRequestSnapshot, setFriendRequestSnapshot] = useState([]);
  const [requestSenders, setRequestSenders] = useState({});
  const { t, i18n } = useTranslation();

  const handleClick = (path) => {
    navigate("/" + path);
  };

  useEffect(() => {
    checkStatus(user);
    get(languageRef).then((snapshot) => {
      if (snapshot.exists()) {
        i18n.changeLanguage(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
    onValue(friendRequestsRef, (snapshot) => {
      setFriendRequestSnapshot(snapshot);
    });
    // Change profile pic to compressed version if it exists in storage
    if (user.photoURL && !user.photoURL.includes("profile_150x150")) {
      console.log("changing to compressed version");
      getDownloadURL(
        storageRef(storage, `profile_pics/${user.uid}_profile_150x150`)
      )
        .then((url) => {
          set(ref(rtdb, `users/${user.uid}/profilePic`), url);
          updateProfile(user, {
            photoURL: url, // save the compressed photo url to auth context
          });
        })
        .catch((error) => {
          console.log(error);
          console.log("Error getting compressed photo url");
        });
    }
  }, []);

  useEffect(() => {
    extractRequestSenderID(
      friendRequestSnapshot,
      user,
      requestSenders,
      usersRef,
      setRequestSenders
    );
  }, [friendRequestSnapshot]);

  const CardItem = ({
    text,
    iconName,
    onClick,
    displayNotification,
    friendRequests,
  }) => {
    return (
      <Card
        className="card"
        borderWidth={"2px"}
        borderColor={"#363636"}
        size={"lg"}
        onClick={onClick}
      >
        <CardBody>
          {displayNotification && (
            <div className="request-notification">{friendRequests}</div>
          )}
          <Icon name={iconName} width={"80px"} height={"80px"} />
          <Stack mt="6" spacing="3">
            <Text fontWeight={"bold"} className="font" fontSize="md">
              {text}
            </Text>
          </Stack>
        </CardBody>
      </Card>
    );
  };

  return (
    <div>
      <CallNotification />
      <Navbar currPage={"/dashboard"} />
      <ChakraProvider>
        <div className="dash">
          <SimpleGrid columns={2} spacing={10}>
            <CardItem
              text={t("Call a Friend")}
              iconName={"video"}
              onClick={() => handleClick("callfriend")}
            />
            <CardItem
              text={t("Your Friends")}
              iconName={"contacts"}
              onClick={() => handleClick(`yourfriends`)}
            />
            <CardItem
              text={t("Meet New Friends")}
              iconName={"users"}
              onClick={() => handleClick("meetnewfriends")}
              displayNotification={Object.keys(requestSenders).length > 0}
              friendRequests={Object.keys(requestSenders).length}
            />
            <CardItem
              text={t("Your Profile")}
              iconName={"user_male"}
              onClick={() => handleClick(`profile/${user.uid}`)}
            />
            <CardItem
              text={t("Blocked People")}
              iconName={"no_sign"}
              onClick={() => handleClick(`blockedpeople`)}
            />
            <CardItem
              text={t("How to Use this App")}
              iconName={"info_circle"}
            />
          </SimpleGrid>
        </div>
      </ChakraProvider>
    </div>
  );
}
