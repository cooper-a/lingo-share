import {
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Badge,
  Box,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Navbar from "./navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "../firebase";
import CallNotification from "./callnotification";
import ProfilePicture from "./profilepicture";

export default function ProfilePage() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams();
  const targetUserRef = ref(rtdb, "users/" + params.id);
  const userStatusRef = ref(rtdb, "status/" + params.id);
  const [isPrimaryUser, setIsPrimaryUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [isOnline, setIsOnline] = useState("offline");
  const [location, setLocation] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [profilePicURL, setProfilePicURL] = useState(null);
  const [bio, setBio] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [hobbiesInput, setHobbiesInput] = useState("");

  const setProfileValues = (fieldName, val) => {
    let fieldRef = ref(rtdb, "users/" + params.id + "/" + fieldName);
    set(fieldRef, val);
  };

  const handleProfileEdit = (event) => {
    event.currentTarget.disabled = true;
    if (locationInput !== "") {
      setProfileValues("location", locationInput);
    }
    if (bioInput !== "") {
      setProfileValues("bio", bioInput);
    }
    if (hobbiesInput !== "") {
      setProfileValues("hobbies", hobbiesInput);
    }
    navigate(`/profile/${params.id}`);
    setLocationInput("");
    setBioInput("");
    setHobbiesInput("");
    event.currentTarget.disabled = false;
  };

  const handleLocationChange = (event) => {
    setLocationInput(event.target.value);
  };

  const handleBioChange = (event) => {
    setBioInput(event.target.value);
  };

  const handleHobbiesChange = (event) => {
    setHobbiesInput(event.target.value);
  };

  useEffect(() => {
    setIsPrimaryUser(user.uid === params.id);
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      setFirstName(snapshotVal.userDisplayName.split(" ")[0]);
      setLastName(snapshotVal.userDisplayName.split(" ")[1]);
      setProfilePicURL(snapshotVal.profilePic);
      setUserType(snapshotVal.userType);
      setPreferredLanguage(snapshotVal.language);
      setLocation(snapshotVal.location);
      setBio(snapshotVal.bio);
      setHobbies(snapshotVal.hobbies);
    });
    onValue(userStatusRef, (snapshot) => {
      setIsOnline(snapshot.val().state);
    });
  }, []);

  let render;
  if (isPrimaryUser) {
    render = (
      <div>
        <CallNotification />
        <Navbar currPage={`/profile/${params.id}`} />
        <Badge colorScheme={isOnline === "online" ? "green" : ""}>
          {isOnline}
        </Badge>
        <Badge colorScheme="green">
          {userType === "native"
            ? "Native Mandarin Speaker"
            : "Mandarin Learner"}
        </Badge>
        <FormControl>
          <FormLabel>First name</FormLabel>
          <FormLabel>{firstName}</FormLabel>
          <FormLabel>Last name</FormLabel>
          <FormLabel>{lastName}</FormLabel>
          <FormLabel>Location</FormLabel>
          <Input placeholder={location} onChange={handleLocationChange} />
          <FormLabel>Preferred Language</FormLabel>
          <FormLabel>
            {preferredLanguage === "en" ? "English" : "Mandarin Chinese"}
          </FormLabel>
          <FormLabel>Biography</FormLabel>
          <Input placeholder={bio} onChange={handleBioChange} />
          <FormLabel>Hobbies</FormLabel>
          <Input placeholder={hobbies} onChange={handleHobbiesChange} />
          <Button
            mt={4}
            colorScheme="teal"
            onClick={(event) => handleProfileEdit(event)}
            type="submit"
          >
            Save Changes
          </Button>
          <h2>Current Profile Picture</h2>
          <Avatar size={"sm"} bg="grey" src={profilePicURL} />
          <ProfilePicture />
        </FormControl>
      </div>
    );
  } else {
    render = (
      <div>
        <CallNotification />
        <Navbar currPage={`/profile/${params.id}`} />
        <Badge colorScheme={isOnline === "online" ? "green" : ""}>
          {isOnline}
        </Badge>
        <Badge colorScheme="green">
          {userType === "native"
            ? "Native Mandarin Speaker"
            : "Mandarin Learner"}
        </Badge>
        <FormControl>
          <FormLabel>First name</FormLabel>
          <FormLabel>{firstName}</FormLabel>
          <FormLabel>Last name</FormLabel>
          <FormLabel>{lastName}</FormLabel>
          <FormLabel>Location</FormLabel>
          <FormLabel>{location}</FormLabel>
          <FormLabel>Preferred Language</FormLabel>
          <FormLabel>
            {preferredLanguage === "en" ? "English" : "Mandarin Chinese"}
          </FormLabel>
          <FormLabel>Biography</FormLabel>
          <FormLabel>{bio}</FormLabel>
          <FormLabel>Hobbies</FormLabel>
          <FormLabel>{hobbies}</FormLabel>
          <h2>Profile Picture</h2>
          <Avatar size={"sm"} bg="grey" src={profilePicURL} />
        </FormControl>
      </div>
    );
  }
  return render;
}
