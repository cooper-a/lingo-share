import { Button, Tag, Text, TagLabel } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Navbar from "./navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "../firebase";
import CallNotification from "./callnotification";
import ProfilePicture from "./profilepicture";
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
  // const [profilePicURL, setProfilePicURL] = useState(null);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState([]);
  const [userObj, setUserObj] = useState({});
  const [userFriends, setUserFriends] = useState({});
  // const [bioInput, setBioInput] = useState("");
  const languageMap = {
    learner: "Mandarin",
    native: "English",
  };
  const proficiencyMap = {
    poor: "Getting started with " + languageMap[userType],
    okay: "Speaks some " + languageMap[userType],
    well: "Speaks " + languageMap[userType] + " well",
  };

  const setProfileValues = (fieldName, val) => {
    let fieldRef = ref(rtdb, "users/" + params.id + "/" + fieldName);
    set(fieldRef, val);
  };

  const handleProfileEdit = () => {
    if (bio !== "") {
      setProfileValues("bio", bio);
    }
    if (interests.length > 0) {
      setProfileValues("interests", interests);
    }
    setProfileValues("userDisplayName", displayName);
    navigate(`/profile/${params.id}`);
  };

  const addInterest = (interest) => {
    if (interest === "") return;
    let newInterests = [...interests];
    newInterests.push(interest);
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
    setIsPrimaryUser(user.uid === params.id);
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      console.log(snapshotVal);
      setDisplayName(snapshotVal.userDisplayName);
      // setProfilePicURL(snapshotVal.profilePic);
      setUserType(snapshotVal.userType);
      // setPreferredLanguage(snapshotVal.language);
      // setLocation(snapshotVal.location);
      setBio(snapshotVal.bio);
      setUserObj(snapshotVal);
      setInterests(snapshotVal.interests);
      if (!snapshotVal.interests) {
        setInterests([]);
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
        currPage={
          isPrimaryUser ? "/profile/" + user.uid : "/profile/" + params.id
        }
      />
      <div className="primary-user">
        <UserName
          userType={userType}
          userObj={userObj}
          isPrimaryUser={isPrimaryUser}
          setDisplayName={setDisplayName}
          proficiencyMap={proficiencyMap}
          params={params}
          userFriends={userFriends}
          handleClickManageFriend={handleClickManageFriend}
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
              interests.map((interest, i) => (
                <Tag
                  size={"lg"}
                  borderRadius="full"
                  variant="solid"
                  bgColor="#D9D9D9"
                  color={"black"}
                  key={i}
                >
                  <TagLabel className="heading">{interest}</TagLabel>
                </Tag>
              ))
            ) : (
              <div>
                <Text fontSize={"lg"}>No interests to show yet</Text>
              </div>
            )}
          </div>
        </div>
        {isPrimaryUser && (
          <Button
            marginTop={"3rem"}
            width={"300px"}
            variant={"outline"}
            onClick={handleProfileEdit}
            className="heading"
          >
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
