import {
  Button,
  Tag,
  Text,
  TagLabel,
  TagCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Navbar from "./navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "../firebase";
import CallNotification from "./callnotification";
import SavedAlert from "./profile/savedalert";
import UserName from "./profile/username";
import AboutSection from "./profile/aboutsection";
import InterestsSection from "./profile/interestssection";
import "../styles/profilepage.css";

export default function ProfilePage() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams();
  const userRef = ref(rtdb, "users/" + user.uid);
  const targetUserRef = ref(rtdb, "users/" + params.id);
  const userStatusRef = ref(rtdb, "status/" + params.id);
  const [isPrimaryUser, setIsPrimaryUser] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState("");
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isOnline, setIsOnline] = useState("offline");
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState(new Set([]));
  const [userObj, setUserObj] = useState({});
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
    setAlertText("Your profile changes were saved");
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

  const handleClickManageFriend = async (targetID, add) => {
    if (targetID !== user.uid && targetID !== undefined) {
      let friendRef = ref(rtdb, `/users/${user.uid}/friends/${targetID}`);
      if (add) {
        set(friendRef, true)
          .then(() => {
            console.log("friend added");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        set(friendRef, null)
          .then(() => {
            console.log("friend removed");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      navigate(`/profile/${params.id}`);
    }
  };

  useEffect(() => {
    console.log(user.uid);
    setIsPrimaryUser(user.uid === params.id);
  }, [user, params]);

  useEffect(() => {
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      console.log(snapshotVal);
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
      console.log(snapshotVal);
      if (!snapshotVal) return;
      setUserFriends(snapshotVal.friends);
      if (!snapshotVal.friends) {
        setUserFriends({});
      }
    });
    onValue(userStatusRef, (snapshot) => {
      setIsOnline(snapshot.val().state);
    });
  }, []);

  return (
    <div>
      <CallNotification />
      <Navbar
        topLeftDisplay={
          isPrimaryUser ? "Your Profile" : displayName + "'s Profile"
        }
        currPage={
          isPrimaryUser ? "/profile/" + user.uid : "/profile/" + params.id
        }
        prevPage={isPrimaryUser ? "/dashboard" : "/meetnewfriends"}
      />
      <div className="primary-user">
        <UserName
          curPage={
            isPrimaryUser ? "/profile/" + user.uid : "/profile/" + params.id
          }
          displayName={displayName}
          userType={userType}
          userObj={userObj}
          isPrimaryUser={isPrimaryUser}
          isOnline={isOnline}
          setDisplayName={setDisplayName}
          proficiencyMap={proficiencyMap}
          params={params}
          profilePic={profilePicURL}
          userFriends={userFriends}
          handleClickManageFriend={handleClickManageFriend}
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
                  bgColor="#D9D9D9"
                  color={"black"}
                  key={i}
                >
                  <TagLabel className="heading">{interest}</TagLabel>
                  {isPrimaryUser && (
                    <TagCloseButton onClick={() => removeInterest(interest)} />
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
          <Button
            width={"100vh"}
            variant={"outline"}
            onClick={handleProfileEdit}
            marginBottom={"2rem"}
            className="heading"
          >
            {t("Save Changes")}
          </Button>
        )}
      </div>
    </div>
  );
}
