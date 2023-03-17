import {
  Button,
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { rtdb } from "../firebase";
import "../styles/blockedpeople.css";
import { mergeObj } from "../utils/userutils";
import CallNotification from "./callnotification";
import CompactProfileCard from "./lingoshare-components/compactprofilecard";
import PrimaryButton from "./lingoshare-components/primarybutton";
import SecondaryButton from "./lingoshare-components/secondarybutton";
import Navbar from "./navbar";

const ReviewModal = ({ isOpen, blockedReason, onClose }) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal isCentered onClose={onClose} size={"sm"} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            marginTop={"0.5rem"}
            className="font"
            alignSelf={"center"}
          >
            {"Blocked Reason"}
          </ModalHeader>
          <ModalBody alignSelf={"center"}>{blockedReason}</ModalBody>
          <ModalFooter marginBottom={"1rem"} alignSelf={"center"}>
            <SecondaryButton
              text={t("OK")}
              onClick={onClose}
              marginleft={"15px"}
              width={"150px"}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default function BlockedPeople() {
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

  const handleClickUnblockFriend = async (e, targetID) => {
    e.preventDefault();
    if (targetID !== user.uid && targetID !== undefined) {
      let blockRef = ref(rtdb, `/users/${user.uid}/blocked/${targetID}`);
      set(blockRef, null)
        .then(() => {
          console.log("user blocked");
        })
        .catch((error) => {
          console.log(error);
        });
      navigate("/blockedpeople");
    }
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
        false,
        true
      )
    );
  }, [statusObj, usersObj, friendsObj]);

  const [selectedBlockedReason, setSelectedBlockedReason] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleBlockedReviewClick = (blockedReason) => {
    setSelectedBlockedReason(blockedReason);
    onOpen();
  };

  return (
    <div>
      <CallNotification />
      <Navbar currPage={"/blockedpeople"} />
      <ChakraProvider>
        <ReviewModal
          isOpen={isOpen}
          onClose={onClose}
          blockedReason={selectedBlockedReason}
        />
        <div className="field-pg">
          <Text fontSize="3xl">{t("Manage your blocklist")}</Text>
          <div className="card-display">
            {Object.entries(mergedObj).map(([key, value], i) => {
              return (
                <div key={i}>
                  <CompactProfileCard
                    marginBottom={"10px"}
                    profileURL={value.profilePic}
                    displayNameText={value.userDisplayName}
                    subheadingText={
                      value.userType === "learner"
                        ? "Language Learner"
                        : "Native Speaker"
                    }
                    moreSubheadingText={"Blocked"}
                    secondaryButtonWidth={"100px"}
                    secondaryButtonText={"Unblock"}
                    tertiaryButtonText={"Review"}
                    secondaryButtonClick={(e) =>
                      handleClickUnblockFriend(e, key)
                    }
                    tertiaryButtonClick={() =>
                      handleBlockedReviewClick(value.blockedReason)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </ChakraProvider>
    </div>
  );
}
