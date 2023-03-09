import {
  Button,
  Avatar,
  FormControl,
  FormLabel,
  Input,
  Badge,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Navbar from "./navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue, get } from "firebase/database";
import { rtdb } from "../firebase";
import CallNotification from "./callnotification";
import ProfilePicture from "./profilepicture";

export default function ProfilePage() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams();
  const targetUserRef = ref(rtdb, "users/" + params.id);
  const [targetUserData, setTargetUserData] = useState(null);
  const [isPrimaryUser, setIsPrimaryUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userType, setUserType] = useState("");
  const [profilePicURL, setProfilePicURL] = useState(null);

  useEffect(() => {
    setIsPrimaryUser(user.uid === params.id);
    onValue(targetUserRef, (snapshot) => {
      let snapshotVal = snapshot.val();
      setTargetUserData(snapshotVal);
      setFirstName(snapshotVal.userDisplayName.split(" ")[0]);
      setLastName(snapshotVal.userDisplayName.split(" ")[1]);
      setProfilePicURL(snapshotVal.profilePic);
      setUserType(snapshotVal.userType);
      console.log(snapshotVal);
    });
  }, []);

  return (
    <div>
      <CallNotification />
      <Navbar currPage={`/profile/${params.id}`} />
      <FormControl isRequired>
        <FormLabel>First name</FormLabel>
        <Input placeholder={firstName} />
        <FormLabel>Last name</FormLabel>
        <Input placeholder={lastName} />
        <Badge>
          {userType === "native"
            ? "Native Mandarin Speaker"
            : "Madarin Learner"}
        </Badge>
        <h2>Current Profile Picture</h2>
        <Avatar size={"sm"} bg="grey" src={profilePicURL} />
        <ProfilePicture />
      </FormControl>
    </div>
  );
}
