import {
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { onValue, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { rtdb } from "../firebase";
import "../styles/profilepage.css";
import { handleAcceptRequest, handleIgnoreRequest } from "../utils/userutils";
import CallNotification from "./callnotification";
import SecondaryButton from "./lingoshare-components/secondarybutton";
import Navbar from "./navbar";
import AboutSection from "./profile/aboutsection";
import InterestsSection from "./profile/interestssection";
import SavedAlert from "./profile/savedalert";
import UserName from "./profile/username";

export default function ProfilePage() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams();
  const { state } = useLocation();
  const prevPage = state ? state.prevPage : null;
  const userRef = ref(rtdb, "users/" + user.uid);
  const targetUserRef = ref(rtdb, "users/" + params.id);
  const userStatusRef = ref(rtdb, "status/" + params.id);
  const friendRequestsRef = ref(rtdb, "/friend_requests");
  const userFriendRequestsRef = ref(rtdb, "/friend_requests/" + user.uid);
  const incomingRequestsRef = ref(rtdb, "/friend_requests/" + params.id);
  const [incomingRequest, setIncomingRequest] = useState(false);
  const [friendRequestsObj, setFriendRequestsObj] = useState([]);
  const [isPrimaryUser, setIsPrimaryUser] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState("");
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isOnline, setIsOnline] = useState("offline");
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState(new Set([]));
  const [userObj, setUserObj] = useState({});
  const [blockedUsers, setBlockedUsers] = useState({});
  const [userFriends, setUserFriends] = useState({});
  const [alertText, setAlertText] = useState("");
  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false });
  const languageMap = {
    learner: t("Mandarin"),
    native: t("English"),
  };
  const proficiencyMap = {
    poor: t("Getting started with ") + languageMap[userType],
    okay: t("Speaks some ") + languageMap[userType],
    well: t("Speaks ") + languageMap[userType] + t(" well"),
  };

  const setProfileValues = (fieldName, val) => {
    let fieldRef = ref(rtdb, "users/" + params.id + "/" + fieldName);
    set(fieldRef, val);
  };

  const handleProfileEdit = () => {
    let interestsArray = Array.from(interests);
    if (bio !== "") {
      setProfileValues("bio", bio);
    }
    if (interestsArray.length > 0) {
      setProfileValues("interests", interestsArray);
    }
    setProfileValues("userDisplayName", displayName);
    navigate(`/profile/${params.id}`);
    setAlertText(t("Your profile changes were saved"));
    onOpen();
  };

  const addInterest = (interest) => {
    if (interest === "") return;
    let newInterests = new Set(interests);
    newInterests.add(interest);
    setInterests(newInterests);
  };

  const removeInterest = (interest) => {
    if (interest === "") return;
    let newInterests = new Set(interests);
    newInterests.delete(interest);
    setInterests(newInterests);
  };

  const handleAcceptFriendRequest = (event, targetID) => {
    handleAcceptRequest(event, friendRequestsRef, user, targetID);
    setIncomingRequest(false);
    navigate("/profile/" + params.id); // workaround
  };

  const handleIgnoreFriendRequest = (event, targetID) => {
    handleIgnoreRequest(event, friendRequestsRef, user, targetID);
    setIncomingRequest(false);
  };

  const handleManageFriend = async (targetID, add) => {
    if (targetID !== user.uid && targetID !== undefined) {
      let friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
      let friendRequestsRef = ref(
        rtdb,
        `/friend_requests/${user.uid}/${targetID}`
      );
      if (add) {
        // add a friend
        set(friendRequestsRef, "");
      } else {
        // remove a friend
        set(friendRef, null)
          .then(() => {
            console.log("friend removed");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      navigate("/profile/" + params.id); // workaround
    }
  };

  useEffect(() => {
    setIsPrimaryUser(user.uid === params.id);
  }, [user, params]);

  useEffect(() => {
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      setDisplayName(snapshotVal.userDisplayName);
      setProfilePicURL(snapshotVal.profilePic);
      setUserType(snapshotVal.userType);
      setBio(snapshotVal.bio);
      setUserObj(snapshotVal);
      setInterests(snapshotVal.interests);
      if (!snapshotVal.interests) {
        setInterests(new Set([]));
      }
    });
    onValue(userRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      if (!snapshotVal) return;
      setUserFriends(snapshotVal.friends);
      if (!snapshotVal.friends) {
        setUserFriends({});
      }
      setBlockedUsers(snapshotVal.blocked);
      if (!snapshotVal.blocked) {
        setBlockedUsers({});
      }
    });
    onValue(userFriendRequestsRef, (snapshot) => {
      let newObjectList = [];
      snapshot.forEach((childSnapshot) => {
        let newObject = {};
        newObject[childSnapshot.key] = childSnapshot.val();
        newObjectList.push(newObject);
      });
      setFriendRequestsObj(newObjectList);
    });
    onValue(userStatusRef, (snapshot) => {
      setIsOnline(snapshot.val().state);
    });
    onValue(incomingRequestsRef, (snapshot) => {
      // responsible for checking whether params.id is requesting
      // user.uid to be their friend (e.g. incoming request from the
      // profile that they are viewing)
      let isRequestIncoming = false;
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key === user.uid) {
          isRequestIncoming = true;
        }
      });
      setIncomingRequest(isRequestIncoming);
    });
  }, [
    incomingRequestsRef,
    targetUserRef,
    user,
    userRef,
    userStatusRef,
    userFriendRequestsRef,
  ]);

  return (
    <div>
      <CallNotification />
      <Navbar
        topLeftDisplay={
          isPrimaryUser ? t("Your Profile") : displayName + t("'s Profile")
        }
        currPage={
          isPrimaryUser ? "/profile/" + user.uid : "/profile/" + params.id
        }
        prevPage={isPrimaryUser ? "/dashboard" : prevPage}
      />
      <div className="primary-user">
        <UserName
          blockedUsers={blockedUsers}
          curPage={
            isPrimaryUser ? "/profile/" + user.uid : "/profile/" + params.id
          }
          displayName={displayName}
          handleAcceptRequest={handleAcceptFriendRequest}
          handleIgnoreRequest={handleIgnoreFriendRequest}
          friendRequests={friendRequestsObj}
          isRequestIncoming={incomingRequest}
          userObj={userObj}
          isPrimaryUser={isPrimaryUser}
          isOnline={isOnline}
          setDisplayName={setDisplayName}
          proficiencyMap={proficiencyMap}
          params={params}
          profilePic={profilePicURL}
          userFriends={userFriends}
          handleClickManageFriend={handleManageFriend}
          onOpenSuccessAlert={onOpen}
          setAlertText={setAlertText}
        />
        <div className="user-info">
          <AboutSection
            setBio={setBio}
            isPrimaryUser={isPrimaryUser}
            bio={bio}
          />
          <InterestsSection
            isPrimaryUser={isPrimaryUser}
            setIsEditingInterests={() =>
              setIsEditingInterests(!isEditingInterests)
            }
            isEditingInterests={isEditingInterests}
            onAddInterest={addInterest}
          />
          <div className="tags">
            {interests ? (
              Array.from(interests).map((interest, i) => (
                <Tag
                  size={"lg"}
                  borderRadius="full"
                  variant="solid"
                  bgColor="white"
                  color={"black"}
                  borderWidth={"1px"}
                  height={"50px"}
                  borderColor={"#393939"}
                  mr="4"
                  key={i}
                  className="font"
                >
                  <TagLabel p="2" className="heading">
                    {interest}
                  </TagLabel>
                  {isPrimaryUser && (
                    <TagCloseButton
                      pr="3"
                      color={"#393939"}
                      onClick={() => removeInterest(interest)}
                    />
                  )}
                </Tag>
              ))
            ) : (
              <div>
                <Text fontSize={"lg"}>{t("No interests to show yet")}</Text>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="alert-notif">
        {isVisible && (
          <div>
            <SavedAlert text={alertText} onClose={onClose} />
          </div>
        )}
        {isPrimaryUser && (
          <SecondaryButton
            width={"100vh"}
            marginBottom="2rem"
            onClick={handleProfileEdit}
            className="heading"
            text={t("Save Changes")}
          />
        )}
      </div>
    </div>
  );
}
