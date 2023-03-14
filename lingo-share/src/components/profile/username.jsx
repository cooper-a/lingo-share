import {
  Button,
  Avatar,
  Editable,
  EditableInput,
  EditablePreview,
  Text,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Icon from "@adeira/icons";
import "@fontsource/atkinson-hyperlegible";
import "../../styles/profilepage.css";
import ProfilePicture from "../profilepicture";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { rtdb, storage } from "../../firebase";
import { ref as dbRef, set } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { UserAuth } from "../../contexts/AuthContext";
import EditableControls from "./editablecontrols";

export default function UserName({
  curPage,
  displayName,
  userObj,
  isPrimaryUser,
  setDisplayName,
  userType,
  isOnline,
  proficiencyMap,
  params,
  profilePic,
  onOpenSuccessAlert,
  setAlertText,
  userFriends,
  handleClickManageFriend,
}) {
  const { t } = useTranslation();
  const { user } = UserAuth();
  const [pfp, setPfp] = useState(null);
  const navigate = useNavigate();

  const saveCompressedPhotoURL = () => {
    getDownloadURL(
      storageRef(storage, `profile_pics/${user.uid}_profile_150x150`)
    )
      .then((url) => {
        setPfp(url);
        set(dbRef(rtdb, `users/${user.uid}/profilePic`), url);
        updateProfile(user, {
          photoURL: url, // save the compressed photo url to auth context
        });
        navigate(curPage);
      })
      .catch((error) => {
        console.log(error);
      });
    setAlertText(
      "Your profile picture was updated, please refresh to see changes"
    );
    onOpenSuccessAlert();
  };

  return (
    <div className="profile-pic">
      <div className="picture">
        <div>
          <Avatar
            width={"150px"}
            height={"150px"}
            bg="grey"
            src={pfp ? pfp : profilePic}
          />
        </div>
        {isPrimaryUser && (
          <div className="picture-upload-btn">
            <ProfilePicture saveCompressedPhotoURL={saveCompressedPhotoURL} />
          </div>
        )}
      </div>
      {isPrimaryUser ? (
        <div className="user-name">
          <div className="heading">
            <Editable
              value={displayName}
              float={"left"}
              marginLeft={"48px"}
              marginTop={"24px"}
              fontSize="4xl"
              fontWeight={"bold"}
            >
              <EditablePreview />
              <EditableInput
                onChange={(e) => setDisplayName(e.target.value)}
                maxWidth={"275px"}
              />
              <EditableControls />
            </Editable>
          </div>
          <div className="heading">
            <Text fontSize={"lg"} marginLeft={"48px"}>
              {userType === "native"
                ? t("Native Mandarin Speaker")
                : t("Mandarin Learner")}{" "}
              • {proficiencyMap[userObj.proficiency]}
            </Text>
          </div>
        </div>
      ) : (
        <div>
          <div className="user-name">
            <div className="heading">
              <div className="heading-child">
                <Text
                  float={"left"}
                  marginLeft={"48px"}
                  marginBottom={"5px"}
                  fontSize="4xl"
                  fontWeight={"bold"}
                >
                  {userObj.userDisplayName}
                </Text>
              </div>
              <div className="heading-child-online">
                {params.id in userFriends && (
                  <Text
                    fontSize={"sm"}
                    fontWeight={"bold"}
                    alignContent={"center"}
                  >
                    {isOnline === "online" ? "(Online)" : "(Offline)"}
                  </Text>
                )}
              </div>
            </div>
            <div>
              <Text className="heading" fontSize={"lg"} marginLeft={"50px"}>
                {userObj.userType === "native"
                  ? t("Native Mandarin Speaker")
                  : t("Mandarin Learner")}{" "}
                • {proficiencyMap[userObj.proficiency]}
              </Text>
            </div>
            <Stack
              direction={"row"}
              spacing={4}
              align={"center"}
              marginTop={"10px"}
              marginLeft={"48px"}
              className="heading"
            >
              <Button
                onClick={() =>
                  handleClickManageFriend(
                    params.id,
                    !(params.id in userFriends)
                  )
                }
                width={"175px"}
                height={"45px"}
                bgColor={params.id in userFriends ? "white" : "#393939"}
                color={params.id in userFriends ? "#393939" : "white"}
                rightIcon={
                  params.id in userFriends && <Icon name="check_circle" />
                }
              >
                {params.id in userFriends ? t("Friends") : t("Add as Friend")}
              </Button>
              <Button
                width={"175px"}
                height={"45px"}
                variant={"outline"}
                borderWidth={"1.5px"}
                borderColor={"#393939"}
              >
                {t("Block User")}
              </Button>
            </Stack>
          </div>
        </div>
      )}
    </div>
  );
}
